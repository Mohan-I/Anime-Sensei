"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { UserAnimeListItem, AnimeStatus } from "@/types/anime";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/anime-status";

interface GridCardProps {
    item: UserAnimeListItem;
    onDelete: () => void;
}

export default function GridCard({ item, onDelete }: GridCardProps) {
    return (
        <div className="group relative">
            <Link href={`/anime/${item.mal_id}`}>
                <div
                    className="rounded-2xl overflow-hidden bg-surface transition-all duration-300 "
                    style={{ boxShadow: "var(--shadow-card)" }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                            "var(--shadow-card-hover)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
                    }
                >
                    <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
                        <img
                            src={item.anime_image_url || ""}
                            alt={item.anime_title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-white text-xs"
                            style={{ backgroundColor: STATUS_COLORS[item.status] }}
                        >
                            {STATUS_LABELS[item.status]}
                        </div>
                        {item.score && (
                            <div
                                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                                style={{
                                    backgroundColor: "var(--color-overlay-badge)",
                                    backdropFilter: "blur(4px)",
                                    color: "var(--color-star)",
                                }}
                            >
                                <Star size={10} fill="currentColor" />
                                <span className="text-white">{item.score}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3">
                        <h3
                            className="text-text-primary truncate text-[1.15rem] leading-snug font-medium uppercase"
                            style={{ fontFamily: "var(--font-bebas-neue), sans-serif", letterSpacing: "0.01em" }}
                        >
                            {item.anime_title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "var(--font-nunito-sans), sans-serif" }}>
                            {item.anime_type || "—"} · {item.anime_year || "—"}
                        </p>
                    </div>
                </div>
            </Link>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute md:opacity-0 group-hover:opacity-100 transition-all duration-200 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 z-10"
                style={{
                    top: "auto",
                    right: "8px",
                    bottom: "52px",
                    backgroundColor: "var(--color-glass-white-90)",
                    backdropFilter: "blur(4px)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-error)";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.boxShadow = "var(--shadow-delete-hover)";
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-glass-white-90)";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}
