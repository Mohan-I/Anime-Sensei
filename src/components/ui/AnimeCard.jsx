/**
 * AnimeCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared card for Popular / Airing / Upcoming grids.
 * White surface, violet accents, live Supabase "+" quick-add.
 */

import { useState, useCallback } from "react";
import { Link }                  from "react-router-dom";
import { toast }                 from "react-toastify";
import { IoStar }                from "react-icons/io5";
import { useSupabase }           from "../../context/SupabaseContext";
import BookmarkIcon              from "../../assets/bookmark.svg";
import BookmarkTickedIcon        from "../../assets/bookmark_ticked.svg";
import MiniLoaderIcon            from "../../assets/mini_loader.svg";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Currently Airing": { dot: "bg-emerald-500", ring: "ring-emerald-400/30", label: "Airing"   },
  "Not yet aired":    { dot: "bg-sky-500",     ring: "ring-sky-400/30",     label: "Upcoming" },
  "Finished Airing":  { dot: "bg-gray-400",    ring: "ring-gray-400/30",    label: "Finished" },
};

export default function AnimeCard({ anime }) {
  const [imgErr,     setImgErr]     = useState(false);
  const [inList,     setInList]     = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const { supabase, firebaseUser, configured } = useSupabase();

  const {
    mal_id, title, score, status,
    episodes, genres = [], images, year, season,
  } = anime;

  const poster =
    images?.webp?.large_image_url ||
    images?.webp?.image_url        ||
    images?.jpg?.large_image_url   ||
    images?.jpg?.image_url         ||
    null;

  const statusCfg  = STATUS_CONFIG[status] ?? STATUS_CONFIG["Finished Airing"];
  const topGenres  = genres.slice(0, 2);
  const seasonYear = [
    season && season.charAt(0).toUpperCase() + season.slice(1),
    year,
  ].filter(Boolean).join(" ");

  // ── Quick-add ─────────────────────────────────────────────────────────
  const handleQuickAdd = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!configured) {
      toast.info("Connect Supabase to save your list.", { position: "top-center" });
      return;
    }
    if (!firebaseUser) {
      toast.info("Log in to save anime to your list.", { position: "top-center" });
      return;
    }
    if (inList || addLoading) return;

    setAddLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_anime_list")
        .insert({
          user_id:         firebaseUser.uid,
          mal_id,
          anime_title:     title,
          anime_image_url: poster ?? null,
          anime_year:      year        ?? null,
          anime_type:      anime.type  ?? null,
          total_ep:        episodes    ?? null,
          status:          "watching",
          progress_ep:     0,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          setInList(true);
          toast.info(`"${title}" is already in your list.`, { position: "top-center" });
        } else {
          throw error;
        }
        return;
      }

      setInList(true);
      toast.success(`"${title}" added! 🎌`, { position: "top-center" });
      console.log("[AnimeCard] ✓ Live row saved to Supabase:", data);
    } catch (err) {
      console.error("[AnimeCard] handleQuickAdd error:", err?.message ?? err);
      toast.error("Couldn't add to list. Try again.", { position: "top-center" });
    } finally {
      setAddLoading(false);
    }
  }, [configured, firebaseUser, inList, addLoading,
      supabase, mal_id, title, poster, year, anime.type, episodes]);

  return (
    <Link
      to={`/anime/${mal_id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl
                 bg-white ring-1 ring-gray-200/80
                 shadow-[0_1px_3px_rgba(0,0,0,0.05)]
                 hover:ring-violet-300 hover:shadow-[0_10px_30px_-10px_rgba(109,40,217,0.28)]
                 transition-all duration-300 ease-out hover:-translate-y-1
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {/* ── Poster ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
        {!imgErr && poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out
                       group-hover:scale-105"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center
                          bg-gradient-to-br from-violet-600 to-indigo-500 p-4">
            <span className="line-clamp-4 text-center text-xs font-bold leading-snug text-white">
              {title}
            </span>
          </div>
        )}

        {/* Score pill — top-right */}
        {score > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1
                          rounded-full bg-black/65 px-2 py-0.5 backdrop-blur-md
                          text-[11px] font-semibold text-amber-300
                          ring-1 ring-white/20 shadow-md">
            <IoStar className="h-3 w-3" />
            {score.toFixed(2)}
          </div>
        )}

        {/* Episodes pill — top-left */}
        {episodes && (
          <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5
                          text-[10px] font-bold uppercase tracking-wide text-violet-700
                          shadow-sm ring-1 ring-white/50">
            {episodes} EP
          </div>
        )}

        {/* Quick-add button — bottom-right, animated */}
        <button
          onClick={handleQuickAdd}
          aria-label={inList ? "Already in list" : "Add to list"}
          title={inList ? "Added to list" : "Add to watching list"}
          className={[
            "absolute top-8 left-2 z-10 flex h-10 w-8 items-center justify-center",
            "rounded-md shadow-lg transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
            inList
              ? "bg-emerald-500 ring-2 ring-emerald-300/60 opacity-100 scale-100"
              : "bg-violet-600 hover:bg-violet-500 ring-2 ring-violet-300/60 " +
                "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100",
            addLoading ? "cursor-wait" : "cursor-pointer",
          ].join(" ")}
        >
          {addLoading ? (
            <img src={MiniLoaderIcon} className="h-4 w-4 animate-spin" alt="" />
          ) : inList ? (
            <img src={BookmarkTickedIcon} className="h-4 w-4" alt="Added" />
          ) : (
            <img src={BookmarkIcon} className="h-4 w-4" alt="Add" />
          )}
        </button>

        {/* Status + season — bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2
                        bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6
                        text-[11px] text-white/95">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} ring-2 ${statusCfg.ring}`} />
            {statusCfg.label}
          </span>
          {seasonYear && (
            <span className="font-medium text-white/80">{seasonYear}</span>
          )}
        </div>
      </div>

      {/* ── Info (white surface) ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-1.5 bg-white px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-800
                       transition-colors duration-200 group-hover:text-violet-700">
          {title}
        </h3>

        {topGenres.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
            {topGenres.map((g) => (
              <span key={g.name}
                className="rounded-full bg-violet-50 px-2 py-0.5
                           text-[9.5px] font-semibold uppercase tracking-wide text-violet-600
                           ring-1 ring-violet-100">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}