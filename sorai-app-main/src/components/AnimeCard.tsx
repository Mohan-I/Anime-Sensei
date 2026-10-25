"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { AnimeCardData } from "@/types/anime";

const typeColors: Record<string, string> = {
    TV: "var(--color-type-tv)",
    Movie: "var(--color-type-movie)",
    OVA: "var(--color-type-ova)",
    Special: "var(--color-type-special)",
    ONA: "var(--color-type-ona)",
    Music: "var(--color-type-music)",
};

interface AnimeCardProps {
    anime: AnimeCardData;
}

function AnimeCard({ anime }: AnimeCardProps) {
    return (
        <Link href={`/anime/${anime.mal_id}`} className="group block">
            <div
                className="rounded-2xl overflow-hidden bg-surface transition-all duration-300  "
                style={{ boxShadow: "var(--shadow-card)" }}
                onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                    "var(--shadow-card-hover)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--shadow-card)")
                }
            >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
                    <img
                        src={anime.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Type badge */}
                    {anime.type && (
                        <div
                            className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-white text-xs font-medium"
                            style={{
                                backgroundColor: typeColors[anime.type] || "var(--color-primary)",
                            }}
                        >
                            {anime.type}
                        </div>
                    )}

                    {/* Score badge */}
                    {anime.score && (
                        <div
                            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                            style={{
                                backgroundColor: "var(--color-overlay-badge)",
                                backdropFilter: "blur(4px)",
                                color: "var(--color-star)",
                            }}
                        >
                            <Star size={10} fill="currentColor" />
                            <span className="text-white">{anime.score}</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-3">
                    <h3
                        className="text-text-primary truncate mb-1 leading-snug text-[1.15rem] font-medium uppercase"
                        style={{ fontFamily: "var(--font-bebas-neue), sans-serif", letterSpacing: "0.01em" }}
                    >
                        {anime.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs" style={{ fontFamily: "var(--font-nunito-sans), sans-serif" }}>{anime.year ?? "—"}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default React.memo(AnimeCard);
