import type {
    JikanAnime,
    JikanCharacter,
    JikanEpisode,
    JikanRelation,
    JikanRecommendation,
    JikanPaginatedResponse,
} from "@/types/jikan";

const JIKAN_BASE = "https://api.tenrai.org/v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class JikanError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "JikanError";
        this.status = status;
    }
}

function getCached<T>(key: string): T | null {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL_MS) {
            sessionStorage.removeItem(key);
            return null;
        }
        return data as T;
    } catch {
        return null;
    }
}

function setCache(key: string, data: unknown) {
    try {
        sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    } catch {
        // Storage full — clear old entries
        sessionStorage.clear();
    }
}

/* ─── Rate-Limited Fetch Queue ─── */

let lastFetchTime = 0;
const MIN_DELAY_MS = 334; // ~3 req/sec max (Jikan allows 3/sec)

/**
 * Ensures a minimum gap between Jikan API calls to prevent 429s.
 * All requests go through the same queue so staggered fetching is automatic.
 */
async function rateLimitedFetch<T>(endpoint: string): Promise<T> {
    const now = Date.now();
    const elapsed = now - lastFetchTime;
    if (elapsed < MIN_DELAY_MS) {
        await new Promise((r) => setTimeout(r, MIN_DELAY_MS - elapsed));
    }
    lastFetchTime = Date.now();
    return jikanFetch<T>(endpoint);
}

/**
 * Processes an array of async tasks sequentially with rate limiting.
 * Calls `onProgress` after each successful task, enabling progressive UI updates.
 */
export async function fetchSequential<TInput, TOutput>(
    items: TInput[],
    fetchFn: (item: TInput) => Promise<TOutput>,
    onProgress?: (results: TOutput[]) => void
): Promise<TOutput[]> {
    const results: TOutput[] = [];
    for (const item of items) {
        try {
            const result = await fetchFn(item);
            results.push(result);
            onProgress?.([...results]);
        } catch {
            // Skip failed items, continue with the rest
        }
    }
    return results;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUSES = [429, 503, 504];

async function jikanFetch<T>(endpoint: string): Promise<T> {
    const cacheKey = `jikan:${endpoint}`;

    // Return cached data if available
    if (typeof window !== "undefined") {
        const cached = getCached<T>(cacheKey);
        if (cached) return cached;
    }

    let lastError: JikanError | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const res = await fetch(`${JIKAN_BASE}${endpoint}`);

        // Silent retry for 429 (rate limit) and server errors with exponential backoff
        if (RETRYABLE_STATUSES.includes(res.status) && attempt < MAX_RETRIES) {
            lastError = new JikanError(
                res.status === 429
                    ? "Too many requests. Please wait a moment and try again."
                    : `Error connecting to the anime API (${res.status})`,
                res.status
            );
            const backoff = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // 1s, 2s
            await new Promise((r) => setTimeout(r, backoff));
            continue;
        }

        if (!res.ok) {
            throw new JikanError(
                res.status === 429
                    ? "Too many requests. Please wait a moment and try again."
                    : `Error connecting to the anime API (${res.status})`,
                res.status
            );
        }

        const data: T = await res.json();

        // Cache successful responses
        if (typeof window !== "undefined") {
            setCache(cacheKey, data);
        }

        return data;
    }

    // All retries exhausted
    throw lastError ?? new JikanError("Request failed after retries", 0);
}

export async function getTopAnime(
    filter: string = "bypopularity",
    limit: number = 12,
    page: number = 1,
    type?: string,
    sfw: boolean = true
): Promise<JikanPaginatedResponse<JikanAnime>> {
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(
        `/top/anime?filter=${filter}&limit=${limit}&page=${page}${type ? `&type=${type}` : ""}${sfw ? "&sfw" : ""}`
    );
}

export async function getSeasonNow(
    limit: number = 12,
    page: number = 1,
    sfw: boolean = true,
    type?: string
): Promise<JikanPaginatedResponse<JikanAnime>> {
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(
        `/seasons/now?limit=${limit}&page=${page}${sfw ? "&sfw" : ""}${type ? `&filter=${type}` : ""}`
    );
}

export async function getSeasonUpcoming(
    limit: number = 12,
    page: number = 1,
    sfw: boolean = true,
    type?: string
): Promise<JikanPaginatedResponse<JikanAnime>> {
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(
        `/seasons/upcoming?limit=${limit}&page=${page}${sfw ? "&sfw" : ""}${type ? `&filter=${type}` : ""}`
    );
}

export async function getAnimeByGenre(
    genreId: number,
    limit: number = 12,
    page: number = 1,
    sfw: boolean = true,
    type?: string
): Promise<JikanPaginatedResponse<JikanAnime>> {
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(
        `/anime?genres=${genreId}&order_by=members&sort=desc&limit=${limit}&page=${page}${sfw ? "&sfw" : ""}${type ? `&type=${type}` : ""}`
    );
}

export async function getSeasonByYear(
    year: number,
    season: string,
    limit: number = 12,
    page: number = 1,
    sfw: boolean = true,
    type?: string
): Promise<JikanPaginatedResponse<JikanAnime>> {
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(
        `/seasons/${year}/${season}?limit=${limit}&page=${page}${sfw ? "&sfw" : ""}${type ? `&filter=${type}` : ""}`
    );
}

export async function searchAnime(
    query: string,
    page: number = 1,
    limit: number = 16,
    sfw: boolean = true,
    type?: string,
    genres?: string,
    status?: string
): Promise<JikanPaginatedResponse<JikanAnime>> {
    let url = `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    if (sfw) url += "&sfw";
    if (type) url += `&type=${type}`;
    if (genres) url += `&genres=${genres}`;
    if (status) url += `&status=${status}`;
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(url);
}

export async function getAnimeById(id: number): Promise<JikanAnime> {
    const data = await rateLimitedFetch<{ data: JikanAnime }>(`/anime/${id}/full`);
    return data.data;
}

export async function getAnimeCharacters(id: number): Promise<JikanCharacter[]> {
    const data = await rateLimitedFetch<{ data: JikanCharacter[] }>(`/anime/${id}/characters`);
    return data.data;
}

export async function getAnimeEpisodes(id: number): Promise<JikanEpisode[]> {
    const data = await rateLimitedFetch<{ data: JikanEpisode[] }>(`/anime/${id}/episodes`);
    return data.data;
}

export async function getAnimeRelations(id: number): Promise<JikanRelation[]> {
    const data = await rateLimitedFetch<{ data: JikanRelation[] }>(`/anime/${id}/relations`);
    return data.data;
}

export async function getAnimeRecommendations(id: number): Promise<JikanRecommendation[]> {
    const data = await rateLimitedFetch<{ data: JikanRecommendation[] }>(
        `/anime/${id}/recommendations`
    );
    return data.data;
}

export { JikanError };

/**
 * @deprecated Use getAnimeById instead — all calls are now rate-limited.
 */
export const getAnimeByIdThrottled = getAnimeById;

/** Combined filter options for the /anime endpoint. */
export interface BrowseFilters {
    genres?: string;
    type?: string;
    status?: string;
    orderBy?: string;
    sort?: string;
}

/**
 * Generic browse/search using the /anime endpoint which supports
 * all filter combinations (genres, type, status, order_by).
 * Used for Popular, Top Airing, and Genre browse when multi-filtering.
 */
export async function browseAnime(
    filters: BrowseFilters,
    limit: number = 16,
    page: number = 1,
    sfw: boolean = true
): Promise<JikanPaginatedResponse<JikanAnime>> {
    let url = `/anime?limit=${limit}&page=${page}`;
    if (sfw) url += "&sfw";
    if (filters.genres) url += `&genres=${filters.genres}`;
    if (filters.type) url += `&type=${filters.type}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.orderBy) url += `&order_by=${filters.orderBy}`;
    if (filters.sort) url += `&sort=${filters.sort}`;
    return rateLimitedFetch<JikanPaginatedResponse<JikanAnime>>(url);
}
