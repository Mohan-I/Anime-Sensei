// Re-export Jikan types from the canonical source
export type {
    JikanAnime,
    JikanCharacter,
    JikanEpisode,
} from "./jikan";

export interface UserAnimeListItem {
    id: string;
    user_id: string;
    mal_id: number;
    status: "watching" | "completed" | "paused" | "dropped" | "planned";
    score: number | null;
    anime_title: string;
    anime_image_url: string | null;
    anime_year: number | null;
    anime_type: string | null;
    created_at: string;
}

export type AnimeStatus = "watching" | "completed" | "paused" | "dropped" | "planned";

export interface AnimeCardData {
    mal_id: number;
    title: string;
    image_url: string;
    type: string | null;
    year: number | null;
    score: number | null;
}
