/**
 * AnimeCard.jsx
 * Shared card used by Popular, Airing, and Upcoming grids.
 * Shows poster, title, score, status badge, and genre chips.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  "Currently Airing": "bg-green-500",
  "Not yet aired":    "bg-blue-500",
  "Finished Airing":  "bg-gray-400",
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

  // Prefer webp, fall through to jpg
  const poster =
    images?.webp?.large_image_url ||
    images?.webp?.image_url ||
    images?.jpg?.large_image_url ||
    images?.jpg?.image_url ||
    null;
  const dotColor = STATUS_COLORS[status] ?? "bg-gray-400";
  const topGenres = genres.slice(0, 2);

  return (
    <Link
      to={`/anime/${mal_id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm
                 border border-gray-100 hover:shadow-xl hover:border-violet-200
                 transition-all duration-300 hover:-translate-y-1"
    >
      {/* ── Poster ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
        {!imgErr && poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-violet-600 to-indigo-500 p-4">
            <span className="text-white font-bold text-sm text-center leading-snug line-clamp-4">
              {title}
            </span>
          </div>
        )}

        {/* Score pill — top-right overlay */}
        {score > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1
                          bg-black/70 backdrop-blur-sm text-yellow-400 rounded-full
                          px-2 py-0.5 text-xs font-semibold shadow">
            <span className="text-yellow-400">★</span>
            {score.toFixed(2)}
          </div>
        )}

        {/* Episodes pill — top-left overlay */}
        {episodes && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm
                          text-violet-600 bg-violet-200 rounded-full px-2 py-0.5 text-xs font-semibold shadow">
             {episodes} EP
          </div>
        )}
      </div>

      {/* ── Info ───────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-[14px] leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Status + year row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${dotColor}`} />
          <span className="text-[10px] p-2 text-violet-800 font-general">{status}</span>
          {year && (
            <span className="text-xs text-gray-800 font-general ml-auto">
              {season ? `${season.charAt(0).toUpperCase() + season.slice(1)} ` : ""}{year}
            </span>
          )}
        </div>

        {/* Genre chips */}
        {topGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {topGenres.map((g) => (
              <span
                key={g.name}
                className="text-[8px] px-2 py-0.5 text-violet-50 bg-violet-600
                           rounded-full font-semibold border border-violet-100"
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
