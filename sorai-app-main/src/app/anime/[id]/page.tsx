"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Tv, AlertCircle } from "lucide-react";
import AnimeHorizontalCarousel from "@/components/AnimeHorizontalCarousel";
import AnimeHeroBanner from "@/components/anime-detail/AnimeHeroBanner";
import AnimeSynopsis from "@/components/anime-detail/AnimeSynopsis";
import AnimeTrailer from "@/components/anime-detail/AnimeTrailer";
import AnimeCharacters from "@/components/anime-detail/AnimeCharacters";
import AnimeEpisodes from "@/components/anime-detail/AnimeEpisodes";
import AnimeInfoSidebar from "@/components/anime-detail/AnimeInfoSidebar";
import { useAuth } from "@/context/AuthContext";
import { getUserAnimeItem } from "@/lib/user-anime-list";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import { useAnimeListActions } from "@/hooks/useAnimeListActions";
import { AnimeStatus } from "@/types/anime";

export default function AnimeDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;
    const router = useRouter();
    const { user, setOpenModal, supabase } = useAuth();

    const animeId = Number(id);

    // Data fetching via hook
    const {
        anime,
        characters,
        episodes,
        relatedAnime,
        similarAnime,
        loading,
        loadingRelated,
        loadingSimilar,
        error,
    } = useAnimeDetail(animeId);

    // List actions via hook
    const {
        userListItem,
        setUserListItem,
        actionLoading,
        handleAddToList: hookAddToList,
        handleStatusChange: hookStatusChange,
        handleScoreChange: hookScoreChange,
        handleRemove: hookRemove,
    } = useAnimeListActions(supabase, user?.id);

    // Check if anime is in user's list
    useEffect(() => {
        if (!user) { setUserListItem(null); return; }
        getUserAnimeItem(supabase, user.id, animeId)
            .then(setUserListItem)
            .catch(() => { });
    }, [user, animeId]);

    // Wrapper handlers
    const handleAddToList = () => {
        if (!user) { setOpenModal("login"); return; }
        if (!anime) return;
        hookAddToList({
            mal_id: animeId,
            anime_title: anime.title,
            anime_image_url: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
            anime_year: anime.year ?? null,
            anime_type: anime.type ?? null,
        });
    };

    const handleStatusChange = (status: AnimeStatus) => {
        hookStatusChange(animeId, status);
    };

    const handleScoreChange = (score: number) => {
        hookScoreChange(animeId, score);
    };

    const handleRemove = () => {
        hookRemove(animeId, anime?.title);
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                {/* Hero skeleton */}
                <div className="relative h-[480px] skeleton" />
                <main className="max-w-container mx-auto px-6 md:px-10 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-6 skeleton w-32" />
                            <div className="h-48 skeleton" />
                        </div>
                        <div className="space-y-6">
                            <div className="h-64 skeleton" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error || !anime) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-container mx-auto px-10 py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-50">
                        <AlertCircle size={28} className="text-error" />
                    </div>
                    <p className="text-text-secondary mb-4">
                        {error || "Anime not found."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        {error && (
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm px-4 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors"
                            >
                                Retry
                            </button>
                        )}
                        <Link
                            href="/"
                            className="text-sm px-4 py-2 rounded-xl border border-border text-text-primary hover:bg-surface-alt transition-colors"
                        >
                            Go to home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            <AnimeHeroBanner
                anime={anime}
                userListItem={userListItem}
                actionLoading={actionLoading}
                user={user}
                onAddToList={handleAddToList}
                onStatusChange={handleStatusChange}
                onScoreChange={handleScoreChange}
                onRemove={handleRemove}
                onBack={handleBack}
                onLoginPrompt={() => setOpenModal("login")}
            />

            {/* Main content */}
            <main className="max-w-container mx-auto px-6 md:px-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-10">
                        {anime.synopsis && <AnimeSynopsis synopsis={anime.synopsis} />}

                        <AnimeTrailer
                            embedUrl={anime.trailer?.embed_url}
                            youtubeId={anime.trailer?.youtube_id}
                        />

                        <AnimeCharacters characters={characters} />

                        <AnimeEpisodes episodes={episodes} />

                        {/* Related Anime */}
                        {loadingRelated ? (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                                    <Tv size={16} className="text-text-secondary" />
                                    <h2 className="text-text-primary text-[1.5rem] font-semibold">Related Anime</h2>
                                </div>
                                <div className="flex gap-4 overflow-hidden">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="shrink-0 animate-pulse" style={{ width: "160px" }}>
                                            <div className="rounded-2xl overflow-hidden bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
                                                <div className="aspect-[2/3] bg-surface-alt" />
                                                <div className="p-3 space-y-2">
                                                    <div className="h-4 bg-surface-alt rounded w-3/4" />
                                                    <div className="h-3 bg-surface-alt rounded w-1/2" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : relatedAnime.length > 0 && (
                            <AnimeHorizontalCarousel
                                title="Related Anime"
                                icon={<Tv size={16} className="text-text-secondary" />}
                                items={relatedAnime}
                            />
                        )}

                        {/* Similar Anime */}
                        {loadingSimilar ? (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                                    <Star size={16} className="text-text-secondary" />
                                    <h2 className="text-text-primary text-[1.5rem] font-semibold">Similar Anime</h2>
                                </div>
                                <div className="flex gap-4 overflow-hidden">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="shrink-0 animate-pulse" style={{ width: "160px" }}>
                                            <div className="rounded-2xl overflow-hidden bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
                                                <div className="aspect-[2/3] bg-surface-alt" />
                                                <div className="p-3 space-y-2">
                                                    <div className="h-4 bg-surface-alt rounded w-3/4" />
                                                    <div className="h-3 bg-surface-alt rounded w-1/2" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : similarAnime.length > 0 && (
                            <AnimeHorizontalCarousel
                                title="Similar Anime"
                                icon={<Star size={16} className="text-text-secondary" />}
                                items={similarAnime}
                            />
                        )}
                    </div>

                    {/* Right column */}
                    <AnimeInfoSidebar anime={anime} />
                </div>
            </main>
        </div>
    );
}
