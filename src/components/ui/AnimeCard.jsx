/**
 * AnimeCard.jsx
 * Shared card used by Popular, Airing, and Upcoming grids.
 * Shows poster, title, score, status badge, and genre chips.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  "Currently Airing": { dot: "bg-emerald-500", ring: "ring-emerald-400/30", label: "Airing" },
  "Not yet aired":    { dot: "bg-sky-500",     ring: "ring-sky-400/30",     label: "Upcoming" },
  "Finished Airing":  { dot: "bg-gray-400",    ring: "ring-gray-400/30",    label: "Finished" },
};

export default function AnimeCard({ anime }) {
  const [imgErr, setImgErr] = useState(false);

  const {
    mal_id,
    title,
    score,
    status,
    episodes,
    genres = [],
    images,
    year,
    season,
  } = anime;

  const poster =
    images?.webp?.large_image_url ||
    images?.webp?.image_url ||
    images?.jpg?.large_image_url ||
    images?.jpg?.image_url ||
    null;

  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Finished Airing"];
  const topGenres = genres.slice(0, 2);
  const seasonYear = [season && season.charAt(0).toUpperCase() + season.slice(1), year]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      to={`/anime/${mal_id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl
                 bg-gradient-to-b from-white to-violet-50/40
                 ring-1 ring-gray-200/70
                 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                 hover:ring-violet-300/70 hover:shadow-[0_12px_32px_-8px_rgba(109,40,217,0.25)]
                 transition-all duration-300 ease-out hover:-translate-y-1.5
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {/* ── Poster ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
        {!imgErr && poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110
                       transition-transform duration-700 ease-out"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 p-4">
            <span className="text-white font-bold text-xs text-center leading-snug line-clamp-4">
              {title}
            </span>
          </div>
        )}

        {/* Gradient scrim for overlay legibility */}
        <div className="pointer-events-none absolute inset-0
                        bg-gradient-to-t from-black/70 via-black/0 to-black/20
                        opacity-80" />

        {/* Score pill — top-right */}
        {score > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1
                          rounded-full bg-black/60 backdrop-blur-md
                          px-2 py-0.5 text-[11px] font-semibold text-amber-300
                          ring-1 ring-white/20 shadow-lg">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
            {score.toFixed(2)}
          </div>
        )}

        {/* Episodes pill — top-left */}
        {episodes && (
          <div className="absolute top-2.5 left-2.5 rounded-full
                          bg-white/90 backdrop-blur-md px-2 py-0.5
                          text-[10px] font-bold uppercase tracking-wide text-violet-700
                          ring-1 ring-white/40 shadow-sm">
            {episodes} EP
          </div>
        )}

        {/* Status + season/year — bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2
                        px-3 pb-2.5 text-[11px] text-white/95">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} ring-2 ${statusCfg.ring}`} />
            {statusCfg.label}
          </span>
          {seasonYear && (
            <span className="font-medium text-white/80">{seasonYear}</span>
          )}
        </div>
      </div>

      {/* ── Info ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 px-3.5 pb-3.5 pt-3">
        <h3 className="font-semibold text-gray-800 text-[13.5px] leading-snug line-clamp-2
                       group-hover:text-violet-700 transition-colors duration-200">
          {title}
        </h3>

        {topGenres.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
            {topGenres.map((g) => (
              <span
                key={g.name}
                className="rounded-full bg-violet-100/80 px-2 py-0.5
                           text-[9.5px] font-semibold uppercase tracking-wide text-violet-700
                           ring-1 ring-violet-200/60"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}