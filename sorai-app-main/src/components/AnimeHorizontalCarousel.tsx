"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const typeColors: Record<string, string> = {
    TV: "var(--color-type-tv)",
    Movie: "var(--color-type-movie)",
    OVA: "var(--color-type-ova)",
    Special: "var(--color-type-special)",
    ONA: "var(--color-type-ona)",
    Music: "var(--color-type-music)",
};

export interface CarouselAnimeItem {
    mal_id: number;
    title: string;
    image_url: string;
    type?: string | null;
    year?: number | null;
    score?: number | null;
    relation?: string;
}

interface Props {
    title: string;
    icon: React.ReactNode;
    items: CarouselAnimeItem[];
}

export default function AnimeHorizontalCarousel({ title, icon, items }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll, { passive: true });
        window.addEventListener("resize", checkScroll);
        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [checkScroll, items]);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.7;
        el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    };

    if (items.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary flex items-center gap-2 text-[1.5rem] font-semibold">
                    <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                    {icon}
                    {title}
                </h2>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                            backgroundColor: canScrollLeft ? "var(--color-primary-light)" : "var(--color-surface-alt)",
                            color: canScrollLeft ? "var(--color-primary)" : "var(--color-text-disabled)",
                            cursor: canScrollLeft ? "pointer" : "default",
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                            backgroundColor: canScrollRight ? "var(--color-primary-light)" : "var(--color-surface-alt)",
                            color: canScrollRight ? "var(--color-primary)" : "var(--color-text-disabled)",
                            cursor: canScrollRight ? "pointer" : "default",
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {items.map((item) => (
                    <Link
                        key={`${item.mal_id}-${item.relation || ""}`}
                        href={`/anime/${item.mal_id}`}
                        className="group shrink-0"
                        style={{ width: "160px" }}
                    >
                        <div
                            className="rounded-2xl overflow-hidden bg-surface transition-all duration-300  "
                            style={{ boxShadow: "var(--shadow-card)" }}
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow =
                                "var(--shadow-carousel-hover)")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow =
                                "var(--shadow-card)")
                            }
                        >
                            <div className="relative aspect-[2/3] overflow-hidden bg-surface-alt">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {item.score && (
                                    <div
                                        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
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
                                {item.type && (
                                    <div
                                        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-white text-xs font-medium"
                                        style={{
                                            backgroundColor: typeColors[item.type] || "var(--color-primary)",
                                        }}
                                    >
                                        {item.type}
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3
                                    className="text-text-primary truncate text-[1.15rem] leading-snug font-medium mb-1 uppercase"
                                    style={{ fontFamily: "var(--font-bebas-neue), sans-serif", letterSpacing: "0.01em" }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-xs" style={{ fontFamily: "var(--font-nunito-sans), sans-serif" }}>
                                    {item.relation || (item.year ? String(item.year) : "—")}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Hide scrollbar CSS */}
            <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
