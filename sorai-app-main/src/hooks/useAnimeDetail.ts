import { useState, useEffect } from "react";
import {
    getAnimeById,
    getAnimeByIdThrottled,
    getAnimeCharacters,
    getAnimeEpisodes,
    getAnimeRelations,
    getAnimeRecommendations,
    fetchSequential,
    JikanError,
} from "@/lib/jikan";
import type { JikanAnime, JikanCharacter, JikanEpisode } from "@/types/jikan";
import type { CarouselAnimeItem } from "@/components/AnimeHorizontalCarousel";

const RELATION_LABELS: Record<string, string> = {
    Sequel: "Sequel",
    Prequel: "Prequel",
    "Alternative setting": "Alternative Setting",
    "Alternative version": "Alternative Version",
    "Side story": "Side Story",
    "Parent story": "Parent Story",
    Summary: "Summary",
    "Full story": "Full Story",
    Spin_off: "Spin-off",
    "Spin-off": "Spin-off",
    Adaptation: "Adaptation",
    Character: "Character",
    Other: "Other",
};

/**
 * Enriches a base carousel item with image, type, year, and score
 * by fetching the full anime data from the API (rate-limited).
 */
async function enrichItem(item: CarouselAnimeItem): Promise<CarouselAnimeItem> {
    const d = await getAnimeByIdThrottled(item.mal_id);
    return {
        ...item,
        image_url:
            d.images?.webp?.large_image_url ||
            d.images?.jpg?.large_image_url ||
            d.images?.jpg?.image_url ||
            "",
        type: d.type || null,
        year: d.year || d.aired?.prop?.from?.year || null,
        score: d.score || null,
    };
}

/**
 * Encapsulates all data-fetching logic for the anime detail page.
 *
 * Uses a rate-limited fetch queue to stagger API calls and prevent 429s,
 * replacing the previous nested-setTimeout approach.
 */
export function useAnimeDetail(animeId: number) {
    const [anime, setAnime] = useState<JikanAnime | null>(null);
    const [characters, setCharacters] = useState<JikanCharacter[]>([]);
    const [episodes, setEpisodes] = useState<JikanEpisode[]>([]);
    const [relatedAnime, setRelatedAnime] = useState<CarouselAnimeItem[]>([]);
    const [similarAnime, setSimilarAnime] = useState<CarouselAnimeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [loadingSimilar, setLoadingSimilar] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchAll = async () => {
            setLoading(true);
            setLoadingRelated(true);
            setLoadingSimilar(true);
            setError(null);

            // ── Phase 1: Core data (parallel) ──
            try {
                const [animeData, charsData, epsData] = await Promise.all([
                    getAnimeById(animeId),
                    getAnimeCharacters(animeId).catch(() => []),
                    getAnimeEpisodes(animeId).catch(() => []),
                ]);

                if (cancelled) return;
                setAnime(animeData);
                setCharacters(charsData.slice(0, 12));
                setEpisodes(epsData);
            } catch (err) {
                if (cancelled) return;
                setError(
                    err instanceof JikanError
                        ? err.message
                        : "Error loading anime. Please try again."
                );
                setLoading(false);
                setLoadingRelated(false);
                setLoadingSimilar(false);
                return;
            }
            if (!cancelled) setLoading(false);

            // ── Phase 2: Related anime (sequential, rate-limited) ──
            try {
                if (cancelled) return;
                const relData = await getAnimeRelations(animeId);
                const baseItems: CarouselAnimeItem[] = [];

                for (const rel of relData) {
                    const label = RELATION_LABELS[rel.relation] || rel.relation;
                    for (const entry of rel.entry) {
                        if (entry.type === "anime") {
                            baseItems.push({
                                mal_id: entry.mal_id,
                                title: entry.name,
                                image_url: "",
                                relation: label,
                            });
                        }
                    }
                }

                await fetchSequential(
                    baseItems.slice(0, 10),
                    enrichItem,
                    (results) => { if (!cancelled) setRelatedAnime(results); }
                );
            } catch { }
            if (!cancelled) setLoadingRelated(false);

            // ── Phase 3: Recommendations (sequential, rate-limited) ──
            try {
                if (cancelled) return;
                const recData = await getAnimeRecommendations(animeId);
                const baseItems = recData
                    .slice(0, 8)
                    .map((rec) => ({
                        mal_id: rec.entry?.mal_id,
                        title: rec.entry?.title || "",
                        image_url:
                            rec.entry?.images?.webp?.large_image_url ||
                            rec.entry?.images?.jpg?.large_image_url ||
                            rec.entry?.images?.jpg?.image_url ||
                            "",
                        type: null as string | null,
                        year: null as number | null,
                        score: null as number | null,
                    }))
                    .filter((i) => i.mal_id && i.image_url);

                await fetchSequential(
                    baseItems,
                    enrichItem,
                    (results) => { if (!cancelled) setSimilarAnime(results); }
                );
            } catch { }
            if (!cancelled) setLoadingSimilar(false);
        };

        fetchAll();

        return () => {
            cancelled = true;
        };
    }, [animeId]);

    return {
        anime,
        characters,
        episodes,
        relatedAnime,
        similarAnime,
        loading,
        loadingRelated,
        loadingSimilar,
        error,
    };
}
