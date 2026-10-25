"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from "lucide-react";
import type { JikanAnime, JikanNamedResource } from "@/types/jikan";

interface MostPopularCarouselProps {
    animes: JikanAnime[];
}

function truncateSynopsis(text: string | null, maxWords: number = 100): string {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
}

function MostPopularCarousel({ animes }: MostPopularCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [fadeState, setFadeState] = useState<"visible" | "fading-out" | "fading-in">("visible");
    const contentRef = useRef<HTMLDivElement>(null);

    const items = animes.slice(0, 5);

    const goTo = useCallback(
        (index: number) => {
            if (isTransitioning) return;
            setIsTransitioning(true);

            // Phase 1: fade out current content
            setFadeState("fading-out");
            setCurrentIndex(index);
        },
        [isTransitioning]
    );

    // When fade-out completes, swap content and fade in
    useEffect(() => {
        if (fadeState === "fading-out") {
            const timer = setTimeout(() => {
                setDisplayIndex(currentIndex);
                setFadeState("fading-in");
            }, 250); // match CSS transition duration
            return () => clearTimeout(timer);
        }

        if (fadeState === "fading-in") {
            const timer = setTimeout(() => {
                setFadeState("visible");
                setIsTransitioning(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [fadeState, currentIndex]);

    const goPrev = useCallback(() => {
        goTo(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    }, [currentIndex, items.length, goTo]);

    const goNext = useCallback(() => {
        goTo(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
    }, [currentIndex, items.length, goTo]);

    if (items.length === 0) return null;

    // Use displayIndex for rendering — it only updates mid-transition
    const anime = items[displayIndex];
    const genres = [
        ...(anime.genres || []),
        ...(anime.themes || []),
    ].map((g: JikanNamedResource) => g.name);
    const year = anime.year ?? anime.aired?.prop?.from?.year ?? null;
    const imageUrl =
        anime.images?.jpg?.large_image_url ||
        anime.images?.jpg?.image_url ||
        "";

    // Compute content styles based on fade state
    const contentStyle: React.CSSProperties = {
        transition: "opacity 0.25s ease, transform 0.3s ease",
        opacity: fadeState === "fading-out" ? 0 : 1,
        transform: fadeState === "fading-out"
            ? "translateX(-12px)"
            : fadeState === "fading-in"
                ? "translateX(0)"
                : "none",
    };

    const navButtons = (
        <>
            <button
                onClick={goPrev}
                disabled={isTransitioning}
                aria-label="Previous anime"
                className="popular-carousel__nav-btn"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                onClick={goNext}
                disabled={isTransitioning}
                aria-label="Next anime"
                className="popular-carousel__nav-btn"
            >
                <ChevronRight size={16} />
            </button>
        </>
    );

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary-light">
                        <TrendingUp size={14} className="text-primary" />
                    </div>
                    <h2 className="text-text-primary text-[1.5rem] font-semibold">
                        Most Popular
                    </h2>
                </div>
                <Link
                    href="/browse?type=popular"
                    className="flex items-center gap-1 text-sm text-primary transition-all hover:gap-2"
                >
                    View all <ArrowRight size={14} />
                </Link>
            </div>

            {/* Carousel Content — NO key prop, uses fade transition instead */}
            <div className="popular-carousel" ref={contentRef}>
                {/* ── Desktop 3-column grid (visible ≥1024px) ── */}
                <div
                    className="popular-carousel__slide popular-carousel--desktop"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "360px 1fr 300px",
                        gap: "32px",
                    }}
                >
                    {/* Column 1: Title + Meta / Nav Arrows */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "460px",
                        }}
                    >
                        <div style={contentStyle}>
                            <Link href={`/anime/${anime.mal_id}`}>
                                <h3
                                    className="text-text-primary"
                                    style={{
                                        fontFamily: "var(--font-bebas-neue), sans-serif",
                                        fontSize: "clamp(3rem, 3vw, 2.6rem)",
                                        lineHeight: "0.8",
                                        letterSpacing: "-0.01em",
                                        textTransform: "uppercase",
                                        margin: "0 0 14px 0",
                                        cursor: "pointer",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.color = "var(--color-primary)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.color = "var(--color-text-primary)")
                                    }
                                >
                                    {anime.title}
                                </h3>
                            </Link>

                            <div
                                className="text-text-secondary"
                                style={{
                                    fontSize: "0.875rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    fontFamily: "var(--font-nunito-sans), sans-serif",
                                }}
                            >
                                {year && <span>{year}</span>}
                                {year && anime.episodes && (
                                    <span
                                        style={{
                                            width: "1px",
                                            height: "14px",
                                            backgroundColor: "var(--color-text-secondary)",
                                            display: "inline-block",
                                            opacity: 0.4,
                                        }}
                                    />
                                )}
                                {anime.episodes && (
                                    <span>
                                        {anime.episodes} episode{anime.episodes !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Nav arrows — NOT inside contentStyle, so they don't flash */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            {navButtons}
                        </div>
                    </div>

                    {/* Column 2: Synopsis + Genres / Ranking */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "460px",
                        }}
                    >
                        <div style={contentStyle}>
                            <p
                                className="text-text-secondary"
                                style={{
                                    fontSize: "0.85rem",
                                    lineHeight: "1.8",
                                    fontFamily: "var(--font-nunito-sans), sans-serif",
                                    margin: "0 0 24px 0",
                                }}
                            >
                                {truncateSynopsis(anime.synopsis)}
                            </p>

                            {genres.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {genres.slice(0, 6).map((genre) => (
                                        <span
                                            key={genre}
                                            className="text-text-primary"
                                            style={{
                                                padding: "5px 16px",
                                                borderRadius: "20px",
                                                border: "1px solid var(--color-border)",
                                                fontSize: "0.8rem",
                                                fontFamily: "var(--font-nunito-sans), sans-serif",
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ranking — transitions smoothly */}
                        <div
                            className="text-text-primary"
                            style={{
                                fontFamily: "var(--font-bebas-neue), sans-serif",
                                fontSize: "3rem",
                                lineHeight: 1,
                                letterSpacing: "0.02em",
                                alignSelf: "flex-end",
                                ...contentStyle,
                            }}
                        >
                            #{displayIndex + 1}
                        </div>
                    </div>

                    {/* Column 3: Poster Image */}
                    <div style={{ height: "100%", ...contentStyle }}>
                        <Link
                            href={`/anime/${anime.mal_id}`}
                            style={{
                                display: "block",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                height: "100%",
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={anime.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                }
                                loading="eager"
                            />
                        </Link>
                    </div>
                </div>

                {/* ── Tablet/Mobile layout (visible <1024px) ── */}
                <div className="popular-carousel--mobile">
                    <div className="popular-carousel--mobile__grid">
                        {/* Column 1: Poster */}
                        <div className="popular-carousel--mobile__poster" style={contentStyle}>
                            <Link
                                href={`/anime/${anime.mal_id}`}
                                className="popular-carousel--mobile__poster-link"
                            >
                                <img
                                    src={imageUrl}
                                    alt={anime.title}
                                    className="popular-carousel--mobile__poster-img"
                                    loading="eager"
                                />
                            </Link>
                        </div>

                        {/* Column 2: Title → Meta → Synopsis → Genres → Nav + Rank */}
                        <div className="popular-carousel--mobile__info">
                            <div style={contentStyle}>
                                {/* Title */}
                                <Link href={`/anime/${anime.mal_id}`}>
                                    <h3
                                        className="text-text-primary popular-carousel--mobile__title"
                                        style={{
                                            fontFamily: "var(--font-bebas-neue), sans-serif",
                                            lineHeight: "0.9",
                                            letterSpacing: "-0.01em",
                                            textTransform: "uppercase",
                                            margin: "0 0 10px 0",
                                            cursor: "pointer",
                                            transition: "color 0.2s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color = "var(--color-primary)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.color = "var(--color-text-primary)")
                                        }
                                    >
                                        {anime.title}
                                    </h3>
                                </Link>

                                {/* Year | Episodes */}
                                <div
                                    className="text-text-secondary"
                                    style={{
                                        fontSize: "0.85rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontFamily: "var(--font-nunito-sans), sans-serif",
                                        marginBottom: "14px",
                                    }}
                                >
                                    {year && <span>{year}</span>}
                                    {year && anime.episodes && (
                                        <span
                                            style={{
                                                width: "1px",
                                                height: "14px",
                                                backgroundColor: "var(--color-text-secondary)",
                                                display: "inline-block",
                                                opacity: 0.4,
                                            }}
                                        />
                                    )}
                                    {anime.episodes && (
                                        <span>
                                            {anime.episodes} episode{anime.episodes !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>

                                {/* Synopsis */}
                                <p
                                    className="text-text-secondary popular-carousel--mobile__synopsis"
                                    style={{
                                        lineHeight: "1.7",
                                        fontFamily: "var(--font-nunito-sans), sans-serif",
                                        margin: "0 0 14px 0",
                                    }}
                                >
                                    {truncateSynopsis(anime.synopsis, 50)}
                                </p>

                                {/* Genre Chips */}
                                {genres.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                        }}
                                    >
                                        {genres.slice(0, 5).map((genre) => (
                                            <span
                                                key={genre}
                                                className="text-text-primary"
                                                style={{
                                                    padding: "4px 14px",
                                                    borderRadius: "20px",
                                                    border: "1px solid var(--color-border)",
                                                    fontSize: "0.75rem",
                                                    fontFamily: "var(--font-nunito-sans), sans-serif",
                                                    fontWeight: 500,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bottom row: ranking left + arrows right on tablet */}
                            <div className="popular-carousel--mobile__footer">
                                <div className="popular-carousel--mobile__rank" style={contentStyle}>
                                    #{displayIndex + 1}
                                </div>
                                <div className="popular-carousel--mobile__nav">
                                    {navButtons}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(MostPopularCarousel);
