"use client";

import { useState } from "react";
import { Music, Play, Youtube } from "lucide-react";
import type { JikanAnime } from "@/types/jikan";

interface AnimeInfoSidebarProps {
    anime: JikanAnime;
}

function cleanSongTitle(raw: string): string {
    return raw
        .replace(/^\d+:\s*/, "")
        .replace(/\([^)]*\)/g, "")
        .trim();
}

function buildYouTubeSearchUrl(song: string): string {
    const cleaned = cleanSongTitle(song);
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(cleaned)}`;
}

function ThemeSongItem({
    song,
    variant,
}: {
    song: string;
    variant: "opening" | "ending";
}) {
    const [hovered, setHovered] = useState(false);
    const url = buildYouTubeSearchUrl(song);

    const isOpening = variant === "opening";
    const bgClass = "bg-surface-alt";
    const iconColor = "var(--color-text-secondary)";
    const iconClass = "text-text-secondary";

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${bgClass} hover:bg-[#FF0000]/10`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon: Play → YouTube on hover */}
            <span
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md transition-all duration-200"
            >
                {hovered ? (
                    <Youtube size={16} className="text-[#FF0000]" />
                ) : (
                    <Play size={10} className={iconClass} fill={iconColor} />
                )}
            </span>

            <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                {song}
            </span>

            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded-lg bg-gray-900 text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                Search on YouTube
            </span>
        </a>
    );
}

export default function AnimeInfoSidebar({ anime }: AnimeInfoSidebarProps) {
    const studio = anime.studios?.[0]?.name || "Unknown";
    const isAiring = anime.status === "Currently Airing";

    return (
        <div className="space-y-6">
            {/* Info card */}
            <div
                className="bg-surface rounded-2xl p-5"
                style={{ boxShadow: "var(--shadow-info-card)" }}
            >
                <h3 className="text-text-primary mb-4 text-sm font-semibold">
                    Information
                </h3>
                <dl className="space-y-3">
                    {[
                        { label: "Score", value: anime.score ? `${anime.score} / 10` : "—" },
                        { label: "Ranking", value: anime.rank ? `#${anime.rank}` : "—" },
                        { label: "Studio", value: studio },
                        { label: "Type", value: anime.type || "—" },
                        { label: "Year", value: anime.year ? String(anime.year) : "—" },
                        { label: "Episodes", value: anime.episodes ? String(anime.episodes) : "—" },
                        { label: "Status", value: isAiring ? "Airing" : "Finished" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-start gap-4">
                            <dt className="text-gray-400 text-xs shrink-0">{label}</dt>
                            <dd className="text-text-secondary text-xs text-right font-medium">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Theme Songs */}
            {((anime.theme?.openings?.length ?? 0) > 0 ||
                (anime.theme?.endings?.length ?? 0) > 0) && (
                    <div
                        className="bg-surface rounded-2xl p-5"
                        style={{ boxShadow: "var(--shadow-info-card)" }}
                    >
                        <h3 className="text-text-primary mb-4 text-sm font-semibold flex items-center gap-2">
                            <Music size={14} className="text-text-secondary" />
                            Theme Songs
                        </h3>

                        {(anime.theme?.openings?.length ?? 0) > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-2">Opening</p>
                                <div className="space-y-1.5">
                                    {anime.theme!.openings.map((song: string, i: number) => (
                                        <ThemeSongItem key={i} song={song} variant="opening" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {(anime.theme?.endings?.length ?? 0) > 0 && (
                            <div>
                                <p className="text-xs text-gray-400 mb-2">Ending</p>
                                <div className="space-y-1.5">
                                    {anime.theme!.endings.map((song: string, i: number) => (
                                        <ThemeSongItem key={i} song={song} variant="ending" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}
