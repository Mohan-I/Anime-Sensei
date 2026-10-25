// ── Jikan API response types ──
// Based on https://docs.api.jikan.moe/

/** Image set returned by the Jikan API for an anime entry. */
export interface JikanImages {
    jpg: {
        image_url: string;
        small_image_url?: string;
        large_image_url?: string;
    };
    webp?: {
        image_url?: string;
        small_image_url?: string;
        large_image_url?: string;
    };
}

/** Trailer information for an anime entry. */
export interface JikanTrailer {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images?: {
        image_url?: string;
        small_image_url?: string;
        medium_image_url?: string;
        large_image_url?: string;
        maximum_image_url?: string;
    };
}

/** Named resource reference (genre, theme, studio, demographic). */
export interface JikanNamedResource {
    mal_id: number;
    type?: string;
    name: string;
    url?: string;
}

/** Aired date information for an anime. */
export interface JikanAired {
    from: string | null;
    to: string | null;
    prop?: {
        from?: { day?: number; month?: number; year?: number };
        to?: { day?: number; month?: number; year?: number };
    };
}

/**
 * Full anime detail as returned by the Jikan `/anime/{id}/full` endpoint,
 * and also present in paginated list responses (`data[]`).
 */
export interface JikanAnime {
    mal_id: number;
    url: string;
    images: JikanImages;
    trailer: JikanTrailer;
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    type: string | null;
    episodes: number | null;
    status: string | null;
    score: number | null;
    scored_by?: number | null;
    rank: number | null;
    popularity?: number | null;
    members?: number | null;
    synopsis: string | null;
    year: number | null;
    season?: string | null;
    aired?: JikanAired;
    studios: JikanNamedResource[];
    genres: JikanNamedResource[];
    themes: JikanNamedResource[];
    demographics: JikanNamedResource[];
    theme?: {
        openings: string[];
        endings: string[];
    };
}

/** Character entry as returned by `/anime/{id}/characters`. */
export interface JikanCharacter {
    character: {
        mal_id: number;
        url: string;
        images: {
            jpg: { image_url: string };
        };
        name: string;
    };
    role: string;
    voice_actors: JikanVoiceActor[];
}

/** Voice actor entry within a character. */
export interface JikanVoiceActor {
    person: {
        mal_id: number;
        name: string;
        images: { jpg: { image_url: string } };
    };
    language: string;
}

/** Episode entry as returned by `/anime/{id}/episodes`. */
export interface JikanEpisode {
    mal_id: number;
    title: string;
    title_japanese: string | null;
    aired: string | null;
    filler: boolean;
    recap: boolean;
}

/** Relation group as returned by `/anime/{id}/relations`. */
export interface JikanRelation {
    relation: string;
    entry: {
        mal_id: number;
        type: string;
        name: string;
        url: string;
    }[];
}

/** Recommendation entry as returned by `/anime/{id}/recommendations`. */
export interface JikanRecommendation {
    entry: {
        mal_id: number;
        url: string;
        images: JikanImages;
        title: string;
    };
    votes: number;
}

/** Generic paginated response wrapper from the Jikan API. */
export interface JikanPaginatedResponse<T> {
    data: T[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        current_page: number;
    };
}
