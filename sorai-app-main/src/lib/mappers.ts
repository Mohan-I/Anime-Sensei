import { AnimeCardData } from "@/types/anime";
import { JikanAnime } from "@/types/jikan";

/**
 * Maps a raw Jikan anime response object to the minimal card data
 * needed for rendering AnimeCard components.
 */
export function mapToCardData(anime: JikanAnime): AnimeCardData {
    return {
        mal_id: anime.mal_id,
        title: anime.title,
        image_url:
            anime.images?.jpg?.large_image_url ||
            anime.images?.jpg?.image_url ||
            "",
        type: anime.type,
        year: anime.year ?? (anime.aired?.prop?.from?.year || null),
        score: anime.score,
    };
}

/**
 * Deduplicates an array of items by their `mal_id` property,
 * keeping the first occurrence of each.
 */
export function deduplicateByMalId<T extends { mal_id: number }>(items: T[]): T[] {
    return items.filter(
        (item, index, self) => self.findIndex((a) => a.mal_id === item.mal_id) === index
    );
}
