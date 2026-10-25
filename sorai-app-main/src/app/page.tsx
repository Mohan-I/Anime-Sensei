"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import AnimeCard from "@/components/AnimeCard";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";
import MostPopularCarousel from "@/components/MostPopularCarousel";
import TopAnimeRanking from "@/components/TopAnimeRanking";
import { getTopAnime, getSeasonNow, getAnimeByIdThrottled, fetchSequential } from "@/lib/jikan";
import { mapToCardData, deduplicateByMalId } from "@/lib/mappers";
import { useAuth } from "@/context/AuthContext";
import { AnimeCardData } from "@/types/anime";
import type { JikanAnime, JikanNamedResource } from "@/types/jikan";

function mapToHeroData(anime: JikanAnime, backgroundUrl: string) {
    return {
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english || null,
        score: anime.score,
        type: anime.type,
        year: anime.year ?? (anime.aired?.prop?.from?.year || null),
        episodes: anime.episodes,
        status: anime.status,
        synopsis: anime.synopsis,
        image_url: backgroundUrl,
        genres: [
            ...(anime.genres || []),
            ...(anime.themes || []),
        ].map((g: JikanNamedResource) => g.name),
        studios: (anime.studios || []).map((s: JikanNamedResource) => s.name),
    };
}

// Hardcoded hero anime IDs with local background images
const HERO_ANIME = [
    { mal_id: 16498, bg: "/images/16498.webp" },   // Shingeki no Kyojin
    { mal_id: 1535,  bg: "/images/1535.webp" },     // Death Note
    { mal_id: 5114,  bg: "/images/5114.webp" },     // Fullmetal Alchemist: Brotherhood
    { mal_id: 30276, bg: "/images/30276.webp" },    // One Punch Man
    { mal_id: 38000, bg: "/images/38000.webp" },    // Kimetsu no Yaiba
];

export default function HomePage() {
    const { user, setOpenModal, profile } = useAuth();
    const showSensitive = profile?.show_sensitive_content ?? false;
    const [heroAnimes, setHeroAnimes] = useState<ReturnType<typeof mapToHeroData>[]>([]);
    const [popular, setPopular] = useState<JikanAnime[]>([]);
    const [season, setSeason] = useState<AnimeCardData[]>([]);
    const [topAiring, setTopAiring] = useState<JikanAnime[]>([]);
    const [topPopular, setTopPopular] = useState<JikanAnime[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);

        // Each section fetches independently — a failure in one doesn't block others
        try {
            // Fetch hero animes sequentially (rate-limited)
            const heroResults = await fetchSequential(
                HERO_ANIME,
                async (hero) => {
                    const data = await getAnimeByIdThrottled(hero.mal_id);
                    return mapToHeroData(data, hero.bg);
                },
                (results) => setHeroAnimes(results)
            );
            setHeroAnimes(heroResults);
        } catch { /* Hero section fails silently — skeletons stay */ }

        try {
            // Single call for bypopularity — reuse for both carousel (5) and ranking (10)
            const popularResult = await getTopAnime("bypopularity", 16, 1, undefined, !showSensitive);
            const popularUnique = deduplicateByMalId(popularResult.data);
            setPopular(popularUnique.slice(0, 5));
            setTopPopular(popularUnique.slice(0, 10));
        } catch { /* Popular section fails silently */ }

        try {
            // Fetch seasonal anime (8 for 4x2 grid)
            const seasonResult = await getSeasonNow(16, 1, !showSensitive);
            const seasonMapped = seasonResult.data.map(mapToCardData);
            const seasonUnique = deduplicateByMalId(seasonMapped);
            setSeason(seasonUnique.slice(0, 8));
        } catch { /* Season section fails silently */ }

        try {
            // Fetch top airing (weekly) for ranking sidebar
            const topAiringResult = await getTopAnime("airing", 10, 1, undefined, !showSensitive);
            setTopAiring(topAiringResult.data.slice(0, 10));
        } catch { /* Ranking section fails silently */ }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [showSensitive]);

    const isLoggedIn = !!user;

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Carousel */}
            {heroAnimes.length > 0 && <HeroCarousel animes={heroAnimes} />}

            {/* Hero skeleton while loading */}
            {loading && heroAnimes.length === 0 && (
                <div className="w-full skeleton" style={{ height: "560px" }} />
            )}

            <main className="max-w-container mx-auto px-6 md:px-10 py-10">

                {/* Season + Top Ranking sidebar */}
                <section className="mb-12">
                    <div className="season-ranking-layout">
                        {/* Left: In Season grid */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: "var(--color-season-icon-bg)" }}
                                    >
                                        <Sparkles size={14} style={{ color: "var(--color-type-special)" }} />
                                    </div>
                                    <h2 className="text-text-primary text-[1.5rem] font-semibold">
                                        In Season
                                    </h2>
                                </div>
                                <Link
                                    href="/browse?type=season"
                                    className="flex items-center gap-1 text-sm text-primary transition-all hover:gap-2"
                                >
                                    View all <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {loading
                                    ? Array.from({ length: 8 }).map((_, i) => (
                                        <AnimeCardSkeleton key={i} />
                                    ))
                                    : season.map((anime) => (
                                        <AnimeCard key={anime.mal_id} anime={anime} />
                                    ))}
                            </div>
                        </div>

                        {/* Right: Top Anime Ranking */}
                        <TopAnimeRanking
                            airingData={topAiring}
                            popularData={topPopular}
                            loading={loading}
                        />
                    </div>
                </section>

                {/* Popular */}
                {loading ? (
                    <section className="mb-12">
                        <div className="skeleton" style={{ height: "460px", borderRadius: "20px" }} />
                    </section>
                ) : (
                    <MostPopularCarousel animes={popular} />
                )}

                {/* CTA Banner */}
                {!isLoggedIn && (
                    <section>
                        <div
                            className="rounded-2xl overflow-hidden relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                            }}
                        >
                            <div
                                className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
                                style={{
                                    backgroundColor: "var(--color-glass-white-08)",
                                    transform: "translate(35%, -35%)",
                                }}
                            />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen size={18} className="text-purple-200" />
                                    <span className="text-purple-200 text-sm">
                                        Completely free
                                    </span>
                                </div>
                                <h3 className="text-white mb-2 text-[1.5rem] font-bold leading-tight">
                                    Track your progress,
                                    <br />
                                    organize your anime list
                                </h3>
                                <p className="text-purple-200 text-sm">
                                    Keep track of everything you watch, your scores, and much more.
                                </p>
                            </div>

                            <div className="relative z-10 flex gap-3 shrink-0">
                                <button
                                    onClick={() => setOpenModal("register")}
                                    className="px-6 h-11 bg-white rounded-xl text-sm transition-all hover:bg-purple-50 hover:shadow-lg active:scale-[0.98] text-primary font-medium"
                                >
                                    Create free account
                                </button>
                                <button
                                    onClick={() => setOpenModal("login")}
                                    className="px-6 h-11 rounded-xl text-sm text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                                    style={{ border: "1px solid var(--color-glass-white-35)" }}
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
