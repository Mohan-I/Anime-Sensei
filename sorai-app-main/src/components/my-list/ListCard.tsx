"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Trash2, ChevronDown, Check } from "lucide-react";
import { UserAnimeListItem, AnimeStatus } from "@/types/anime";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/anime-status";

interface ListCardProps {
    item: UserAnimeListItem;
    onDelete: () => void;
    onScoreChange: (malId: number, score: number) => void;
    onStatusChange: (malId: number, status: AnimeStatus) => void;
    openScoreDropdown: number | null;
    setOpenScoreDropdown: (id: number | null) => void;
}

export default function ListCard({
    item,
    onDelete,
    onScoreChange,
    onStatusChange,
    openScoreDropdown,
    setOpenScoreDropdown,
}: ListCardProps) {
    const [showStatus, setShowStatus] = useState(false);
    const isScoreOpen = openScoreDropdown === item.mal_id;

    return (
        <div
            className="flex items-center gap-4 bg-surface rounded-2xl p-3 pr-5 hover:shadow-md transition-all"
            style={{ boxShadow: "var(--shadow-soft)" }}
        >
            <Link href={`/anime/${item.mal_id}`} className="shrink-0">
                <img
                    src={item.anime_image_url || ""}
                    alt={item.anime_title}
                    className="w-14 h-20 rounded-xl object-cover"
                    loading="lazy"
                />
            </Link>

            <div className="flex-1 min-w-0">
                <Link href={`/anime/${item.mal_id}`}>
                    <h4
                        className="text-text-primary font-medium text-[1.15rem] truncate transition-colors"
                        style={{ fontFamily: "var(--font-bebas-neue), sans-serif", letterSpacing: "0.01em" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = STATUS_COLORS[item.status];
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                        }}
                    >
                        {item.anime_title}
                    </h4>
                </Link>
                <p className="text-gray-400 text-xs" style={{ fontFamily: "var(--font-nunito-sans), sans-serif" }}>
                    {item.anime_type || "—"} · {item.anime_year || "—"}
                </p>
            </div>

            {/* Status selector */}
            <div className="relative hidden sm:block">
                <button
                    onClick={() => {
                        setShowStatus(!showStatus);
                        setOpenScoreDropdown(null);
                    }}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs transition-colors"
                    style={{
                        backgroundColor: STATUS_COLORS[item.status] + "15",
                        color: STATUS_COLORS[item.status],
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[item.status] }}
                    />
                    {STATUS_LABELS[item.status]}
                    <ChevronDown size={12} />
                </button>

                {showStatus && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowStatus(false)}
                        />
                        <div
                            className="absolute right-0 mt-1 w-44 bg-surface rounded-xl border border-surface-alt overflow-hidden z-20"
                            style={{ boxShadow: "var(--shadow-dropdown)" }}
                        >
                            {Object.entries(STATUS_LABELS).map(([status, label]) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onStatusChange(item.mal_id, status as AnimeStatus);
                                        setShowStatus(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover flex items-center gap-2 transition-colors"
                                    style={{
                                        color:
                                            item.status === status ? STATUS_COLORS[status as AnimeStatus] : "var(--color-text-primary)",
                                        fontWeight: item.status === status ? 600 : 400,
                                    }}
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: STATUS_COLORS[status as AnimeStatus] }}
                                    />
                                    {label}
                                    {item.status === status && (
                                        <Check size={12} className="ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Score — hidden for On Hold and Plan to Watch */}
            {item.status !== "paused" && item.status !== "planned" && (
                <div className="relative hidden sm:block">
                    <button
                        onClick={() => {
                            setOpenScoreDropdown(isScoreOpen ? null : item.mal_id);
                            setShowStatus(false);
                        }}
                        className="flex items-center gap-1 px-3 h-8 rounded-lg text-xs text-text-secondary hover:bg-surface-alt transition-colors border border-border"
                    >
                        <Star
                            size={12}
                            fill={item.score ? "var(--color-star)" : "none"}
                            style={{ color: item.score ? "var(--color-star)" : "var(--color-text-disabled)" }}
                        />
                        {item.score ? `${item.score}/10` : "—"}
                    </button>

                    {isScoreOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenScoreDropdown(null)}
                            />
                            <div
                                className="absolute right-0 mt-1 w-36 bg-surface rounded-xl border border-surface-alt overflow-hidden z-20 max-h-[300px] overflow-y-auto"
                                style={{ boxShadow: "var(--shadow-dropdown)" }}
                            >
                                {[...Array(10)].map((_, i) => {
                                    const score = i + 1;
                                    const isSelected = item.score === score;
                                    return (
                                        <button
                                            key={score}
                                            onClick={() => onScoreChange(item.mal_id, score)}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover flex items-center gap-2 transition-colors"
                                            style={{
                                                color: isSelected ? STATUS_COLORS[item.status] : "var(--color-text-primary)",
                                                fontWeight: isSelected ? 600 : 400,
                                            }}
                                        >
                                            <Star
                                                size={10}
                                                fill="var(--color-star)"
                                                style={{ color: "var(--color-star)" }}
                                            />
                                            {score}
                                            <span className="text-gray-400">/10</span>
                                            {isSelected && (
                                                <Check size={10} className="ml-auto" style={{ color: STATUS_COLORS[item.status] }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={onDelete}
                className="p-2 rounded-lg text-gray-400 hover:text-error hover:bg-red-50 transition-colors shrink-0"
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}
