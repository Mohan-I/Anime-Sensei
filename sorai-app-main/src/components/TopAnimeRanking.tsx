"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { JikanAnime } from "@/types/jikan";

const typeColors: Record<string, string> = {
    TV: "var(--color-type-tv)",
    Movie: "var(--color-type-movie)",
    OVA: "var(--color-type-ova)",
    Special: "var(--color-type-special)",
    ONA: "var(--color-type-ona)",
    Music: "var(--color-type-music)",
};

interface TopAnimeRankingProps {
    airingData: JikanAnime[];
    popularData: JikanAnime[];
    loading?: boolean;
}

function TopAnimeRanking({ airingData, popularData, loading }: TopAnimeRankingProps) {
    const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
    const [animateKey, setAnimateKey] = useState(0);

    const data = activeTab === "weekly" ? airingData : popularData;

    const handleTabChange = (tab: "weekly" | "monthly") => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setAnimateKey((k) => k + 1);
    };

    // Skeleton rows
    if (loading) {
        return (
            <div className="top-ranking">
                <div className="top-ranking__header">
                    <div className="top-ranking__header-title">
                        <Trophy size={14} />
                        <span>Top Anime</span>
                    </div>
                    <div className="top-ranking__tabs">
                        <button className="top-ranking__tab top-ranking__tab--active">Weekly</button>
                        <button className="top-ranking__tab">Monthly</button>
                    </div>
                </div>
                <div className="top-ranking__list">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="top-ranking__row top-ranking__row--skeleton">
                            <span className="top-ranking__rank skeleton" style={{ width: "24px", height: "18px" }} />
                            <span className="skeleton" style={{ flex: 1, height: "16px", borderRadius: "6px" }} />
                            <span className="skeleton" style={{ width: "32px", height: "18px", borderRadius: "6px" }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="top-ranking">
            {/* Header: Title + Toggle */}
            <div className="top-ranking__header">
                <div className="top-ranking__header-title">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-cat-upcoming-bg)" }}
                    >
                        <Trophy size={14} style={{ color: "var(--color-cat-upcoming)" }} />
                    </div>
                    <span>Top Anime</span>
                </div>
                <div className="top-ranking__tabs">
                    <button
                        className={`top-ranking__tab ${activeTab === "weekly" ? "top-ranking__tab--active" : ""}`}
                        onClick={() => handleTabChange("weekly")}
                    >
                        Weekly
                    </button>
                    <button
                        className={`top-ranking__tab ${activeTab === "monthly" ? "top-ranking__tab--active" : ""}`}
                        onClick={() => handleTabChange("monthly")}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Ranked List */}
            <div className="top-ranking__list" key={animateKey}>
                {data.slice(0, 10).map((anime, index) => {
                    const imageUrl =
                        anime.images?.jpg?.small_image_url ||
                        anime.images?.jpg?.image_url ||
                        "";

                    return (
                        <Link
                            key={anime.mal_id}
                            href={`/anime/${anime.mal_id}`}
                            className="top-ranking__row"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            {/* Rank number */}
                            <span className="top-ranking__rank">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Poster thumbnail */}
                            <div className="top-ranking__thumb">
                                <img
                                    src={imageUrl}
                                    alt={anime.title}
                                    loading="lazy"
                                />
                            </div>

                            {/* Anime name */}
                            <span className="top-ranking__name">
                                {anime.title}
                            </span>

                            {/* Type badge */}
                            {anime.type && (
                                <span
                                    className="top-ranking__type"
                                    style={{
                                        backgroundColor: typeColors[anime.type] || "var(--color-primary)",
                                    }}
                                >
                                    {anime.type}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default React.memo(TopAnimeRanking);
