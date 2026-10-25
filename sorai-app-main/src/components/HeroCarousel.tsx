"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Star, Play } from "lucide-react";

interface HeroAnime {
    mal_id: number;
    title: string;
    title_english: string | null;
    score: number | null;
    type: string | null;
    year: number | null;
    episodes: number | null;
    status: string | null;
    synopsis: string | null;
    image_url: string;
    genres: string[];
    studios: string[];
}

interface HeroCarouselProps {
    animes: HeroAnime[];
}

export default function HeroCarousel({ animes }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const dragRef = useRef({ startX: 0, isDragging: false, wasDragged: false });

    const goTo = useCallback(
        (index: number) => {
            if (transitioning) return;
            setTransitioning(true);
            setTimeout(() => {
                setCurrent(index);
                setTransitioning(false);
            }, 300);
        },
        [transitioning]
    );

    const next = useCallback(
        () => goTo((current + 1) % animes.length),
        [current, animes.length, goTo]
    );

    const prev = useCallback(
        () => goTo((current - 1 + animes.length) % animes.length),
        [current, animes.length, goTo]
    );

    useEffect(() => {
        if (animes.length <= 1) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, animes.length]);

    // Reset index when animes array changes
    useEffect(() => {
        setCurrent(0);
    }, [animes.length]);

    // Drag / swipe handlers
    const handleDragStart = (clientX: number) => {
        dragRef.current = { startX: clientX, isDragging: true, wasDragged: false };
    };

    const handleDragEnd = (clientX: number) => {
        if (!dragRef.current.isDragging) return;
        const diff = dragRef.current.startX - clientX;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            dragRef.current.wasDragged = true;
            if (diff > 0) next();
            else prev();
        }
        dragRef.current.isDragging = false;
    };

    const handleDragCancel = () => {
        dragRef.current.isDragging = false;
    };

    // Prevent navigation on links when user was swiping
    const handleClick = (e: React.MouseEvent) => {
        if (dragRef.current.wasDragged) {
            e.preventDefault();
            dragRef.current.wasDragged = false;
        }
    };

    if (animes.length === 0) return null;

    const safeIndex = current < animes.length ? current : 0;
    const anime = animes[safeIndex];
    if (!anime) return null;
    const isAiring = anime.status === "Currently Airing";

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: "560px" }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={() => {}}
            onMouseUp={(e) => handleDragEnd(e.clientX)}
            onMouseLeave={handleDragCancel}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
            onClick={handleClick}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: transitioning ? 0 : 1 }}
            >
                <img
                    src={anime.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 20%" }}
                />
                {/* Gradient overlays */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "var(--color-hero-gradient-bottom)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-container mx-auto px-6 md:px-10 flex items-center">
                <div
                    className="max-w-xl transition-all duration-500"
                    style={{
                        opacity: transitioning ? 0 : 1,
                        transform: transitioning ? "translateX(-16px)" : "translateX(0)",
                    }}
                >
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {anime.score && (
                            <span
                                className="text-xs px-2.5 py-1 rounded-full text-white"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-gradient))",
                                }}
                            >
                                <Star size={12} fill="currentColor" className="inline" /> {anime.score}
                            </span>
                        )}
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                            {anime.type} · {anime.year || "—"}
                        </span>
                        {isAiring && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/80 text-white backdrop-blur-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Airing
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1
                        className="text-white mb-1"
                        style={{
                            fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {anime.title}
                    </h1>
                    {anime.title_english && anime.title_english !== anime.title && (
                        <p className="text-white/60 mb-3" style={{ fontSize: "1rem" }}>
                            {anime.title_english}
                        </p>
                    )}

                    {/* Score & studio */}
                    <div className="flex items-center gap-4 mb-3">
                        {anime.score && (
                            <>
                                <div className="flex items-center gap-1.5 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-white text-sm">{anime.score}</span>
                                </div>
                                <span className="text-white/50 text-xs">•</span>
                            </>
                        )}
                        <span className="text-white/70 text-sm">
                            {anime.studios[0] || "Unknown studio"}
                        </span>
                        <span className="text-white/50 text-xs">•</span>
                        <span className="text-white/70 text-sm">
                            {anime.episodes || "?"} eps.
                        </span>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {anime.genres.slice(0, 5).map((genre) => (
                            <span
                                key={genre}
                                className="text-xs px-2.5 py-1 rounded-full text-white/90 border"
                                style={{
                                    borderColor: "var(--color-glass-white-25)",
                                    backgroundColor: "var(--color-glass-white-10)",
                                    backdropFilter: "blur(4px)",
                                }}
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Synopsis */}
                    {anime.synopsis && (
                        <p
                            className="text-white/75 mb-6 leading-relaxed"
                            style={{
                                fontSize: "0.9rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {anime.synopsis}
                        </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            href={`/anime/${anime.mal_id}`}
                            className="flex items-center gap-2 px-5 h-11 text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] text-sm"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                            }}
                        >
                            <Play size={16} fill="currentColor" />
                            View details
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dot indicators */}
            {animes.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                    {animes.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className="transition-all duration-300 rounded-full"
                            style={{
                                width: i === current ? "24px" : "8px",
                                height: "8px",
                                backgroundColor:
                                    i === current ? "var(--color-primary)" : "var(--color-glass-white-50)",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
