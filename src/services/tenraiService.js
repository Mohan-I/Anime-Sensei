/**
 * tenraiService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Tenrai API v1 client (https://api.tenrai.org/v1) — a Jikan-compatible proxy.
 * Identical response shapes to Jikan v4; all existing callers work unchanged.
 *
 * Features:
 *   LRU in-memory cache, token-bucket throttle (~3 req/sec), retry on 429/5xx,
 *   automatic offline mock fallback for blocked-network dev environments.
 *
 * Strategy (decided once at module load):
 *   Production  → VITE_TENRAI_BASE_URL   (direct browser → api.tenrai.org/v1)
 *   Dev, live   → /tenrai                (Vite proxy → api.tenrai.org/v1 via Node)
 *   Dev, blocked→ mock data              (instant, no network, Jikan-shaped)
 *
 * __TENRAI_PROXY_AVAILABLE__ is injected by vite.config.js after it probes
 * api.tenrai.org from Node at startup.
 */

import {
  mockPopular, mockAiring, mockUpcoming,
  mockSearch, mockAnimeById, mockCharacters, mockCharacterFull,
  mockCharacterById, mockCharacterAnime, mockCharacterVoices,
  mockCharacterPictures,
} from './jikanMockData.js';

// ── Numeric env helper ────────────────────────────────────────────────────────
const envNum = (key, fallback) => {
  const n = Number(import.meta.env[key]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// ── Decide strategy once ──────────────────────────────────────────────────────
// __TENRAI_PROXY_AVAILABLE__ = true  → Node can reach api.tenrai.org
// __TENRAI_PROXY_AVAILABLE__ = false → network blocked; use mock data in dev
const PROXY_OK =
  typeof __TENRAI_PROXY_AVAILABLE__ !== 'undefined'
    ? Boolean(__TENRAI_PROXY_AVAILABLE__)
    : true; // assume reachable in prod (define not injected by build)

const USE_MOCK = import.meta.env.DEV && !PROXY_OK;

const BASE_URL = import.meta.env.DEV
  ? '/tenrai'  // Vite proxies /tenrai/* → https://api.tenrai.org/v1
  : (import.meta.env.VITE_TENRAI_BASE_URL || 'https://api.tenrai.org/v1').replace(/\/$/, '');

if (import.meta.env.DEV) {
  console.log(
    `[Tenrai] strategy: ${
      USE_MOCK
        ? '🎭 MOCK DATA (network blocked)'
        : `🌐 LIVE via ${BASE_URL}`
    }`
  );
}

// ── Config ────────────────────────────────────────────────────────────────────
const TIMEOUT_MS   = envNum('VITE_TENRAI_TIMEOUT_MS',              15_000);
const CACHE_TTL_MS = envNum('VITE_TENRAI_CACHE_TTL_MS',            60_000);
const MAX_ENTRIES  = envNum('VITE_TENRAI_CACHE_MAX_ENTRIES',           100);
const MAX_RPS      = envNum('VITE_TENRAI_MAX_REQUESTS_PER_SEC',          3);

// ── LRU cache ─────────────────────────────────────────────────────────────────
const cache = new Map();

const cacheGet = (key) => {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) { cache.delete(key); return null; }
  // LRU touch — move to end
  cache.delete(key);
  cache.set(key, e);
  return e.data;
};

const cacheSet = (key, data) => {
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value);
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
};

// ── Token-bucket throttle ─────────────────────────────────────────────────────
let tokens = MAX_RPS, lastFill = Date.now();
const pending = [];
let ticking = false;

const refill = () => {
  const now = Date.now();
  tokens = Math.min(MAX_RPS, tokens + ((now - lastFill) / 1_000) * MAX_RPS);
  lastFill = now;
};

const tickBucket = () => {
  refill();
  while (pending.length && tokens >= 1) { tokens -= 1; pending.shift().resolve(); }
  if (pending.length) setTimeout(tickBucket, Math.ceil(1_000 / MAX_RPS));
  else ticking = false;
};

const acquireToken = () =>
  new Promise((resolve) => {
    refill();
    if (tokens >= 1) { tokens -= 1; resolve(); return; }
    pending.push({ resolve });
    if (!ticking) { ticking = true; setTimeout(tickBucket, Math.ceil(1_000 / MAX_RPS)); }
  });

// ── Live fetch with retry ─────────────────────────────────────────────────────
const fetchLive = async (fullPath, attempt = 0) => {
  await acquireToken();

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new DOMException(`Timed out after ${TIMEOUT_MS}ms`, 'TimeoutError')),
    TIMEOUT_MS
  );

  let response;
  try {
    response = await fetch(`${BASE_URL}${fullPath}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    clearTimeout(timer);
    throw controller.signal.reason instanceof Error ? controller.signal.reason : err;
  } finally {
    clearTimeout(timer);
  }

  // Retry on rate-limit or transient server errors (up to 2 extra attempts)
  if ((response.status === 429 || response.status >= 500) && attempt < 2) {
    const ra = Number(response.headers.get('retry-after'));
    const delay =
      Number.isFinite(ra) && ra > 0
        ? Math.min(ra * 1_000, 10_000)
        : (attempt + 1) * 1_500;
    await new Promise((r) => setTimeout(r, delay));
    return fetchLive(fullPath, attempt + 1);
  }

  if (!response.ok) throw new Error(`Tenrai ${response.status}: ${BASE_URL}${fullPath}`);
  return response.json();
};

// ── Mock router — returns the right mock shape for each endpoint ─────────────
const serveMock = (endpoint, params) => {
  if (endpoint === '/top/anime') {
    const f = params?.filter;
    if (f === 'airing')    return mockAiring();
    if (f === 'upcoming')  return mockUpcoming();
    return mockPopular();
  }
  if (endpoint === '/anime')       return mockSearch(params?.q ?? '');

  const animeFullMatch = endpoint.match(/^\/anime\/(\d+)\/full$/);
  if (animeFullMatch)              return mockAnimeById(animeFullMatch[1]);
  const animeMatch = endpoint.match(/^\/anime\/(\d+)$/);
  if (animeMatch)                  return mockAnimeById(animeMatch[1]);

  const charsMatch = endpoint.match(/^\/anime\/(\d+)\/characters$/);
  if (charsMatch)                  return mockCharacters(charsMatch[1]);

  const charPicsMatch = endpoint.match(/^\/characters\/(\d+)\/pictures$/);
  if (charPicsMatch)               return mockCharacterPictures(charPicsMatch[1]);
  const charFullMatch = endpoint.match(/^\/characters\/(\d+)\/full$/);
  if (charFullMatch)               return mockCharacterFull(charFullMatch[1]);
  const charMatch = endpoint.match(/^\/characters\/(\d+)$/);
  if (charMatch)                   return mockCharacterById(charMatch[1]);
  const charAnimeMatch = endpoint.match(/^\/characters\/(\d+)\/anime$/);
  if (charAnimeMatch)              return mockCharacterAnime(charAnimeMatch[1]);
  if (endpoint.match(/^\/characters\/\d+\/voices$/)) return mockCharacterVoices();

  return mockPopular();
};

// ── Public fetch primitive ────────────────────────────────────────────────────

/**
 * Fetch a Tenrai API v1 endpoint.
 * @param {string} endpoint  e.g. '/top/anime'
 * @param {object} [params]  query-string params as a plain object
 */
export const fetchTenrai = async (endpoint, params = {}) => {
  const qs       = new URLSearchParams(params).toString();
  const fullPath = qs ? `${endpoint}?${qs}` : endpoint;
  const cacheKey = fullPath;

  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Instant mock fallback — no network call when offline in dev
  if (USE_MOCK) {
    const data = serveMock(endpoint, params);
    cacheSet(cacheKey, data);
    return data;
  }

  const data = await fetchLive(fullPath);
  cacheSet(cacheKey, data);
  return data;
};

// ── Convenience wrappers ──────────────────────────────────────────────────────
export const getTopAnime             = (filter) => fetchTenrai('/top/anime', { filter });
export const searchAnimeApi          = (query)  => fetchTenrai('/anime', { q: query, order_by: 'popularity', sort: 'asc', sfw: 'true' });
export const getAnimeById            = (id)     => fetchTenrai(`/anime/${id}`);
export const getAnimeFullById        = (id)     => fetchTenrai(`/anime/${id}/full`);
export const getAnimeCharacters      = (id)     => fetchTenrai(`/anime/${id}/characters`);
export const getAnimeEpisodes        = (id, page = 1) => fetchTenrai(`/anime/${id}/episodes`, { page });
export const getAnimeVideos          = (id)     => fetchTenrai(`/anime/${id}/videos`);
export const getAnimeEpisodeVideos   = (id, page = 1) => fetchTenrai(`/anime/${id}/videos/episodes`, { page });
export const getAnimeNews            = (id, page = 1) => fetchTenrai(`/anime/${id}/news`, { page });
export const getLatestAnimeNews      = (page = 1) => fetchTenrai('/news', { page });
export const getCharacterById        = (id)     => fetchTenrai(`/characters/${id}`);
export const getCharacterFullById    = (id)     => fetchTenrai(`/characters/${id}/full`);
export const getCharacterPictures    = (id)     => fetchTenrai(`/characters/${id}/pictures`);
export const getCharacterAnime       = (id)     => fetchTenrai(`/characters/${id}/anime`);
export const getCharacterVoiceActors = (id)     => fetchTenrai(`/characters/${id}/voices`);
