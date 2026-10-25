"use client";

import { useState } from "react";
import { Tv } from "lucide-react";
import type { JikanEpisode } from "@/types/jikan";

interface AnimeEpisodesProps {
    episodes: JikanEpisode[];
}

export default function AnimeEpisodes({ episodes }: AnimeEpisodesProps) {
    const [showAll, setShowAll] = useState(false);

    if (episodes.length === 0) return null;

    const displayed = showAll ? episodes : episodes.slice(0, 12);

    return (
        <section>
            <h2 className="text-text-primary mb-4 flex items-center gap-2 text-[1.5rem] font-semibold">
                <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                <Tv size={16} className="text-text-secondary" />
                Episodes
            </h2>
            <div
                className="bg-surface rounded-2xl overflow-hidden"
                style={{ boxShadow: "var(--shadow-info-card)" }}
            >
                {displayed.map((ep: JikanEpisode, i: number) => (
                    <div
                        key={ep.mal_id}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors"
                        style={{
                            borderBottom:
                                i < displayed.length - 1
                                    ? "1px solid var(--color-surface-alt)"
                                    : "none",
                        }}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-primary-light text-primary font-semibold">
                            {ep.mal_id}
                        </div>
                        <p className="flex-1 text-text-secondary text-sm">
                            {ep.title || `Episode ${ep.mal_id}`}
                        </p>
                        {ep.aired && (
                            <p className="text-gray-400 text-xs shrink-0">
                                {new Date(ep.aired).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            {episodes.length > 12 && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="mt-3 w-full py-2.5 text-sm text-primary hover:bg-primary-light rounded-xl transition-colors font-medium"
                >
                    View all episodes ({episodes.length})
                </button>
            )}
        </section>
    );
}
