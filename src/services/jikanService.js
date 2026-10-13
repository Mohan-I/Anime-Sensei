/**
 * jikanService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Jikan v4 client with LRU cache, token-bucket throttle, retry on 429/5xx,
 * and automatic offline mock fallback for blocked-network dev environments.
 *
 * Strategy (decided once at module load):
 *   Production  → VITE_JIKAN_BASE_URL (direct browser → api.jikan.moe)
 *   Dev, live   → /jikan  (Vite proxy → api.jikan.moe through Node)
 *   Dev, blocked→ mock data (instant, no network, realistic Jikan shapes)
 *
 * __JIKAN_PROXY_AVAILABLE__ is injected by vite.config.js after it probes
 * api.jikan.moe from Node at startup.
 */

import {
  mockPopular, mockAiring, mockUpcoming,
  mockSearch, mockAnimeById, mockCharacters, mockPictures,
  mockCharacterFull, mockCharacterById, mockCharacterAnime,
  mockCharacterVoices, mockCharacterPictures,
} from './jikanMockData.js';

// ── Numeric env helper ────────────────────────────────────────────────────────
const envNum = (key, fallback) => {
  const n = Number(import.meta.env[key]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// ── Decide strategy once ──────────────────────────────────────────────────────
// __JIKAN_PROXY_AVAILABLE__ = true  → Node can reach api.jikan.moe
// __JIKAN_PROXY_AVAILABLE__ = false → network blocked; use mock data in dev
const PROXY_OK = typeof __JIKAN_PROXY_AVAILABLE__ !== 'undefined'
  ? Boolean(__JIKAN_PROXY_AVAILABLE__)
  : true; // assume reachable in prod (define not injected by build)

const USE_MOCK = import.meta.env.DEV && !PROXY_OK;

const BASE_URL = import.meta.env.DEV
  ? '/jikan'   // Vite proxies /jikan/* → api.jikan.moe/v4
  : (import.meta.env.VITE_JIKAN_BASE_URL || 'https://api.jikan.moe/v4').replace(/\/$/, '');

if (import.meta.env.DEV) {
  console.log(`[Jikan] strategy: ${USE_MOCK ? '🎭 MOCK DATA (network blocked)' : `🌐 LIVE via ${BASE_URL}`}`);
}

// ── Config ────────────────────────────────────────────────────────────────────
const TIMEOUT_MS   = envNum('VITE_JIKAN_TIMEOUT_MS',               15_000);
const CACHE_TTL_MS = envNum('VITE_JIKAN_CACHE_TTL_MS',             60_000);
const MAX_ENTRIES  = envNum('VITE_JIKAN_CACHE_MAX_ENTRIES',            100);
const MAX_RPS      = envNum('VITE_JIKAN_MAX_REQUESTS_PER_SEC',           3);

// ── LRU cache ─────────────────────────────────────────────────────────────────
const cache = new Map();

const cacheGet = (key) => {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) { cache.delete(key); return null; }
  cache.delete(key); cache.set(key, e); // LRU touch
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

const acquireToken = () => new Promise((resolve) => {
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

  // Retry on rate-limit or transient server errors
  if ((response.status === 429 || response.status >= 500) && attempt < 2) {
    const ra = Number(response.headers.get('retry-after'));
    const delay = Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1_000, 10_000) : (attempt + 1) * 1_500;
    await new Promise((r) => setTimeout(r, delay));
    return fetchLive(fullPath, attempt + 1);
  }

  if (!response.ok) throw new Error(`Jikan ${response.status}: ${BASE_URL}${fullPath}`);
  return response.json();
};

// ── Mock router — returns the right mock for each endpoint ───────────────────
const serveMock = (endpoint, params) => {
  // /top/anime
  if (endpoint === '/top/anime') {
    const f = params?.filter;
    if (f === 'airing')        return mockAiring();
    if (f === 'upcoming')      return mockUpcoming();
    return mockPopular(); // bypopularity + default
  }
  // /anime (search)
  if (endpoint === '/anime')   return mockSearch(params?.q ?? '');
  // /anime/:id
  const animeFullMatch = endpoint.match(/^\/anime\/(\d+)\/full$/);
  if (animeFullMatch)              return mockAnimeById(animeFullMatch[1]);
  const animeMatch = endpoint.match(/^\/anime\/(\d+)$/);
  if (animeMatch)              return mockAnimeById(animeMatch[1]);
  // /anime/:id/characters — pass the id so each anime gets its own roster
  const charsMatch = endpoint.match(/^\/anime\/(\d+)\/characters$/);
  if (charsMatch) return mockCharacters(charsMatch[1]);
  // /characters/:id/pictures
  const charPicsMatch = endpoint.match(/^\/characters\/(\d+)\/pictures$/);
  if (charPicsMatch) return mockCharacterPictures(charPicsMatch[1]);
  // /characters/:id/full
  const charFullMatch = endpoint.match(/^\/characters\/(\d+)\/full$/);
  if (charFullMatch) return mockCharacterFull(charFullMatch[1]);
  // /characters/:id
  const charMatch = endpoint.match(/^\/characters\/(\d+)$/);
  if (charMatch) return mockCharacterById(charMatch[1]);
  // /characters/:id/anime
  const charAnimeMatch = endpoint.match(/^\/characters\/(\d+)\/anime$/);
  if (charAnimeMatch) return mockCharacterAnime(charAnimeMatch[1]);
  // /characters/:id/voices
  if (endpoint.match(/^\/characters\/\d+\/voices$/)) return mockCharacterVoices();
  // default
  return mockPopular();
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch a Jikan v4 endpoint.
 * @param {string} endpoint  e.g. '/top/anime'
 * @param {object} [params]  query-string params
 */
export const fetchJikan = async (endpoint, params = {}) => {
  const qs       = new URLSearchParams(params).toString();
  const fullPath = qs ? `${endpoint}?${qs}` : endpoint;
  const cacheKey = fullPath;

  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Use mock data instantly in blocked-network dev — no network call at all
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
export const getTopAnime            = (filter) => fetchJikan('/top/anime', { filter });
export const searchAnimeApi         = (query)  => fetchJikan('/anime', { q: query, order_by: 'popularity', sort: 'asc', sfw: 'true' });
export const getAnimeById           = (id)     => fetchJikan(`/anime/${id}`);
export const getAnimeFullById       = (id)     => fetchJikan(`/anime/${id}/full`);
export const getAnimeCharacters     = (id)     => fetchJikan(`/anime/${id}/characters`);
export const getCharacterById       = (id)     => fetchJikan(`/characters/${id}`);
export const getCharacterFullById   = (id)     => fetchJikan(`/characters/${id}/full`);
export const getCharacterPictures   = (id)     => fetchJikan(`/characters/${id}/pictures`);
export const getCharacterAnime      = (id)     => fetchJikan(`/characters/${id}/anime`);
export const getCharacterVoiceActors= (id)     => fetchJikan(`/characters/${id}/voices`);
