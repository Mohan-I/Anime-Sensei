"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Star,
    Check,
    ChevronDown,
    Trash2,
    ArrowLeft,
} from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { AnimeStatus } from "@/types/anime";
import type { UserAnimeListItem } from "@/types/anime";
import type { JikanAnime, JikanNamedResource } from "@/types/jikan";
import {
    STATUS_LABELS,
    STATUS_COLORS,
    STATUS_BG_COLORS,
    STATUS_BORDER_COLORS,
} from "@/constants/anime-status";

/**
 * Validates that an embed URL is from a trusted YouTube domain.
 */
function isValidYouTubeEmbedUrl(url: string | undefined | null): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(
            parsed.hostname
        );
    } catch {
        return false;
    }
}

/**
 * Extracts YouTube video ID from a Jikan embed_url and returns HD thumbnail URLs.
 */
function getYouTubeThumbnails(embedUrl: string | undefined | null): { maxres: string; hq: string } | null {
    if (!embedUrl || !isValidYouTubeEmbedUrl(embedUrl)) return null;
    const match = embedUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    return {
        maxres: `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`,
        hq: `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`,
    };
}

interface AnimeHeroBannerProps {
    anime: JikanAnime;
    userListItem: UserAnimeListItem | null;
    actionLoading: boolean;
    user: { id: string } | null;
    onAddToList: () => void;
    onStatusChange: (status: AnimeStatus) => void;
    onScoreChange: (score: number) => void;
    onRemove: () => void;
    onBack: () => void;
    onLoginPrompt: () => void;
}

export default function AnimeHeroBanner({
    anime,
    userListItem,
    actionLoading,
    user,
    onAddToList,
    onStatusChange,
    onScoreChange,
    onRemove,
    onBack,
    onLoginPrompt,
}: AnimeHeroBannerProps) {
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showScoreDropdown, setShowScoreDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const studio = anime.studios?.[0]?.name || "Unknown";
    const genres = [...(anime.genres || []), ...(anime.themes || [])];
    const isAiring = anime.status === "Currently Airing";
    const isUpcoming = anime.status === "Not yet aired";
    const statusLabel = isAiring ? "Airing" : isUpcoming ? "Upcoming" : "Finished";
    const statusColor = isAiring
        ? "var(--color-overlay-status-airing)"
        : isUpcoming
            ? "var(--color-overlay-status-upcoming)"
            : "var(--color-glass-white-18)";
    const posterUrl =
        anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
    const ytThumbs = getYouTubeThumbnails(anime.trailer?.embed_url);
    const bannerUrl = ytThumbs?.maxres || ytThumbs?.hq || posterUrl;
    const bannerIsLowRes = !ytThumbs;

    return (
        <>
            <div className="relative" style={{ height: "480px" }}>
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={bannerUrl}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: ytThumbs ? "center center" : "center 20%",
                            filter: bannerIsLowRes ? "blur(2px)" : "none",
                            transform: bannerIsLowRes ? "scale(1.05)" : "none",
                        }}
                        onError={(e) => {
                            const img = e.currentTarget;
                            if (ytThumbs && img.src === ytThumbs.maxres) {
                                img.src = ytThumbs.hq;
                            } else if (ytThumbs && img.src === ytThumbs.hq) {
                                img.src = posterUrl;
                                img.style.filter = "blur(2px)";
                                img.style.transform = "scale(1.05)";
                            }
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)",
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to top, var(--color-background) 0%, rgba(249,249,249,0) 40%)",
                        }}
                    />
                </div>

                {/* Back button */}
                <div className="absolute top-6 left-0 right-0 z-20">
                    <div className="max-w-container mx-auto px-6 md:px-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm text-white transition-colors hover:bg-white/10 cursor-pointer"
                            style={{
                                backgroundColor: "var(--color-overlay-back-btn)",
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>
                </div>

                {/* Hero content */}
                <div className="absolute inset-0 flex items-end z-10">
                    <div className="max-w-container w-full mx-auto px-6 md:px-10 pb-12 flex gap-8 items-end">
                        {/* Poster */}
                        <div className="hidden md:block shrink-0">
                            <img
                                src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || posterUrl}
                                alt={anime.title}
                                className="w-[180px] rounded-2xl shadow-2xl"
                                style={{ aspectRatio: "2/3", objectFit: "cover" }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 pb-2">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {anime.rank != null && anime.rank > 0 && (
                                    <span
                                        className="text-xs px-2.5 py-1 rounded-full text-white"
                                        style={{
                                            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-gradient))",
                                        }}
                                    >
                                        #{anime.rank} Ranking
                                    </span>
                                )}
                                {anime.type && (
                                    <span
                                        className="text-xs px-2.5 py-1 rounded-full text-white"
                                        style={{
                                            backgroundColor: "var(--color-glass-white-18)",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        {anime.type}
                                    </span>
                                )}
                                <span
                                    className="text-xs px-2.5 py-1 rounded-full text-white"
                                    style={{
                                        backgroundColor: statusColor,
                                        backdropFilter: "blur(4px)",
                                    }}
                                >
                                    {statusLabel}
                                </span>
                            </div>

                            <h1
                                className="text-white mb-1 font-bold leading-tight tracking-tight"
                                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                            >
                                {anime.title}
                            </h1>
                            {anime.title_english && anime.title_english !== anime.title && (
                                <p className="text-white/60 mb-4">{anime.title_english}</p>
                            )}

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-white/80 text-sm">
                                {anime.score && (
                                    <>
                                        <div className="flex items-center gap-1.5 text-yellow-400">
                                            <Star size={15} fill="currentColor" />
                                            <span className="text-white">{anime.score}</span>
                                            <span className="text-white/50 text-xs">/10</span>
                                        </div>
                                        <span className="text-white/30">|</span>
                                    </>
                                )}
                                <span>{studio}</span>
                                <span className="text-white/30">|</span>
                                <span>{anime.year || "—"}</span>
                                <span className="text-white/30">|</span>
                                <span>{anime.episodes || "?"} episodes</span>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {genres.map((g: JikanNamedResource) => (
                                    <span
                                        key={g.mal_id}
                                        className="text-xs px-2.5 py-1 rounded-full text-white border"
                                        style={{
                                            borderColor: "var(--color-glass-white-25)",
                                            backgroundColor: "var(--color-glass-white-10)",
                                        }}
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            {/* List actions */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {!userListItem ? (
                                    <div className="relative">
                                        <button
                                            onClick={onAddToList}
                                            onMouseEnter={() => !user && setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 px-5 h-10 text-white rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                                            }}
                                        >
                                            {actionLoading ? (
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Plus size={16} />
                                            )}
                                            Add to my list
                                        </button>
                                        {showTooltip && !user && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                                                Sign in to save this anime
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        {/* Status dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setShowStatusDropdown(!showStatusDropdown);
                                                    setShowScoreDropdown(false);
                                                }}
                                                className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm text-white transition-all hover:opacity-90"
                                                style={{
                                                    backgroundColor: STATUS_BG_COLORS[userListItem.status],
                                                    backdropFilter: "blur(4px)",
                                                    border: `1px solid`,
                                                    borderColor: STATUS_BORDER_COLORS[userListItem.status],
                                                }}
                                            >
                                                <Check size={15} />
                                                {STATUS_LABELS[userListItem.status]}
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform ${showStatusDropdown ? "rotate-180" : ""}`}
                                                />
                                            </button>

                                            {showStatusDropdown && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-[100]"
                                                        onClick={() => setShowStatusDropdown(false)}
                                                    />
                                                    <div
                                                        className="absolute left-0 mt-2 w-52 bg-surface rounded-2xl border border-surface-alt overflow-hidden z-[101]"
                                                        style={{ top: "100%", boxShadow: "var(--shadow-poster)" }}
                                                    >
                                                        {Object.entries(STATUS_LABELS).map(([status, label]) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => {
                                                                    setShowStatusDropdown(false);
                                                                    onStatusChange(status as AnimeStatus);
                                                                }}
                                                                className="w-full text-left px-4 py-3 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between"
                                                                style={{
                                                                    color:
                                                                        userListItem.status === status
                                                                            ? STATUS_COLORS[status as AnimeStatus]
                                                                            : "var(--color-text-primary)",
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className="w-2 h-2 rounded-full shrink-0"
                                                                        style={{ backgroundColor: STATUS_COLORS[status as AnimeStatus] }}
                                                                    />
                                                                    {label}
                                                                </div>
                                                                {userListItem.status === status && <Check size={14} />}
                                                            </button>
                                                        ))}
                                                        <div className="border-t border-surface-alt" />
                                                        <button
                                                            onClick={() => {
                                                                setShowStatusDropdown(false);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm text-error hover:bg-red-50 transition-colors flex items-center gap-2"
                                                        >
                                                            <Trash2 size={14} />
                                                            Remove from my list
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Score dropdown */}
                                        {userListItem.status !== "paused" && userListItem.status !== "planned" && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        setShowScoreDropdown(!showScoreDropdown);
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm text-white transition-all hover:opacity-90"
                                                    style={{
                                                        backgroundColor: "var(--color-glass-white-15)",
                                                        backdropFilter: "blur(4px)",
                                                        border: "1px solid var(--color-glass-white-30)",
                                                    }}
                                                >
                                                    <Star
                                                        size={14}
                                                        fill={userListItem.score ? "var(--color-star)" : "none"}
                                                        style={{
                                                            color: userListItem.score ? "var(--color-star)" : "var(--color-glass-white-70)",
                                                        }}
                                                    />
                                                    <span>
                                                        {userListItem.score ? `${userListItem.score} / 10` : "Rate"}
                                                    </span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform ${showScoreDropdown ? "rotate-180" : ""}`}
                                                    />
                                                </button>

                                                {showScoreDropdown && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-[100]"
                                                            onClick={() => setShowScoreDropdown(false)}
                                                        />
                                                        <div
                                                            className="absolute left-0 mt-2 w-44 bg-surface rounded-2xl border border-surface-alt overflow-hidden z-[101] max-h-[360px] overflow-y-auto"
                                                            style={{ top: "100%", boxShadow: "var(--shadow-poster)" }}
                                                        >
                                                            {!userListItem.score && (
                                                                <>
                                                                    <div className="px-4 py-2.5 text-xs text-gray-400">Not rated</div>
                                                                    <div className="border-t border-surface-alt" />
                                                                </>
                                                            )}
                                                            {[...Array(10)].map((_, i) => {
                                                                const score = i + 1;
                                                                const isSelected = userListItem.score === score;
                                                                return (
                                                                    <button
                                                                        key={score}
                                                                        onClick={() => {
                                                                            setShowScoreDropdown(false);
                                                                            onScoreChange(score);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 hover:bg-surface-hover"
                                                                        style={{
                                                                            color: isSelected ? STATUS_COLORS[userListItem.status] : "var(--color-text-primary)",
                                                                        }}
                                                                    >
                                                                        <div className="flex gap-0.5">
                                                                            {[...Array(5)].map((_, si) => (
                                                                                <Star
                                                                                    key={si}
                                                                                    size={10}
                                                                                    fill={si < Math.ceil(score / 2) ? "var(--color-star)" : "none"}
                                                                                    style={{
                                                                                        color: si < Math.ceil(score / 2) ? "var(--color-star)" : "var(--color-text-disabled)",
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{score}</span>
                                                                        <span className="text-xs text-gray-400">/ 10</span>
                                                                        {isSelected && <Check size={12} className="ml-auto" style={{ color: STATUS_COLORS[userListItem.status] }} />}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    setShowDeleteModal(false);
                    onRemove();
                }}
                animeTitle={anime.title}
            />
        </>
    );
}
