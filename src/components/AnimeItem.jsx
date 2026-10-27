import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnimeById, getAnimeCharacters } from "../services/tenraiService";
import EpisodeSection from "./EpisodeSection";
import { useSupabase } from "../context/SupabaseContext";
import { useAnimeListActions } from "../hooks/useAnimeListActions";
import { getUserAnimeItem } from "../lib/userAnimeList";
import { IoStar } from "react-icons/io5";
import {
  FiPlus, FiCheck, FiChevronDown,
  FiStar, FiTrash2, FiPlusCircle,
} from "react-icons/fi";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Prefer webp if available, fall back to jpg. */
const bestImage = (images, size = "large") => {
  const key = size === "large" ? "large_image_url" : "image_url";
  return (
    images?.webp?.[key] ||
    images?.webp?.image_url ||
    images?.jpg?.[key] ||
    images?.jpg?.image_url ||
    null
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

// ── Badge chip ────────────────────────────────────────────────────────────────
const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-violet-400/25
                   bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-medium text-violet-200">
    {children}
  </span>
);

// ── Stat block ────────────────────────────────────────────────────────────────
const Stat = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">{label}</span>
      <span className="truncate text-sm font-medium text-white/90">{value}</span>
    </div>
  );
};

// ── Character card — includes inline VA ───────────────────────────────────────
const CharCard = ({ character, role, voiceActors = [] }) => {
  const { images, name, mal_id } = character;
  const poster = bestImage(images, "small");
  const jaVA = voiceActors.find((v) => v.language === "Japanese") ?? voiceActors[0];
  const isMain = role === "Main";

  return (
    <Link to={`/character/${mal_id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.04]
                      ring-1 ring-white/[0.06]
                      transition-all duration-300 ease-out
                      hover:ring-violet-400/40 hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.35)]
                      hover:-translate-y-1">
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <img
            src={poster}
            alt={name}
            className="h-full w-full object-cover object-top
                       transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=6d28d9&color=fff&bold=true`;
            }}
          />

          {/* Gradient scrim */}
          <div className="pointer-events-none absolute inset-0
                          bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Role badge */}
          <div className={`absolute left-2 top-2 rounded-full px-2 py-0.5
                           text-[10px] font-bold uppercase tracking-wider backdrop-blur-md
                           ${isMain
                             ? "bg-amber-400/90 text-amber-950"
                             : "bg-white/15 text-white/85 ring-1 ring-white/20"}`}>
            {role}
          </div>

          {/* Info overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h4 className="truncate text-sm font-semibold leading-snug text-white">
              {name}
            </h4>
            {jaVA && (
              <p className="mt-0.5 truncate text-[11px] text-white/60">
                🎙 {jaVA.person?.name?.split(", ").reverse().join(" ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Section heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold text-white">
    <span className="inline-block h-5 w-1 rounded-full bg-violet-500" />
    {children}
  </h2>
);

// ── Live List Panel ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { id: "watching",  label: "Watching",      color: "bg-blue-500/20 text-blue-300 border-blue-500/40"       },
  { id: "completed", label: "Completed",     color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "planned",   label: "Plan to Watch", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"  },
  { id: "paused",    label: "On Hold",       color: "bg-orange-500/20 text-orange-300 border-orange-500/40"   },
  { id: "dropped",   label: "Dropped",       color: "bg-red-500/20 text-red-300 border-red-500/40"            },
];
const SCORES = [1,2,3,4,5,6,7,8,9,10];

function LiveListPanel({ anime }) {
  const { supabase, firebaseUser, configured } = useSupabase();
  const [statusOpen, setStatusOpen] = useState(false);
  const [scoreOpen,  setScoreOpen]  = useState(false);

  const {
    userListItem, setUserListItem, actionLoading,
    handleAddToList, handleStatusChange, handleScoreChange,
    handleProgressChange, handleRemove,
  } = useAnimeListActions(supabase, firebaseUser?.uid);

  // Seed from Supabase on mount
  useEffect(() => {
    if (!configured || !firebaseUser || !anime?.mal_id) return;
    let cancelled = false;
    getUserAnimeItem(supabase, firebaseUser.uid, anime.mal_id)
      .then((item) => { if (!cancelled) setUserListItem(item ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [configured, firebaseUser, supabase, anime?.mal_id, setUserListItem]);

  if (!configured) return null;
  if (!firebaseUser) {
    return (
      <p className="mt-3 text-center text-xs text-white/35 font-general">
        <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Log in</Link>
        {" "}to track this anime
      </p>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.id === userListItem?.status);
  const canScore = userListItem && !["paused","planned"].includes(userListItem.status);

  return (
    <div className="mt-4 w-full space-y-2">
      {/* ── Not in list ── */}
      {!userListItem ? (
        <button
          onClick={() => handleAddToList({
            mal_id:          anime.mal_id,
            anime_title:     anime.title_english || anime.title,
            anime_image_url: anime.images?.webp?.large_image_url
                          || anime.images?.jpg?.large_image_url
                          || null,
            anime_year:  anime.year     ?? null,
            anime_type:  anime.type     ?? null,
            total_ep:    anime.episodes ?? null,
          })}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2
                     bg-violet-600 hover:bg-violet-500 disabled:opacity-50
                     text-white text-sm font-semibold py-2.5 rounded-2xl
                     transition-all active:scale-[0.98] shadow-lg shadow-violet-600/25"
        >
          {actionLoading
            ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <FiPlus className="h-4 w-4" />
          }
          Add to List
        </button>
      ) : (
        <>
          {/* Status dropdown */}
          <div className="relative">
            <button
              onClick={() => { setStatusOpen((v) => !v); setScoreOpen(false); }}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5
                          rounded-2xl border text-sm font-medium transition-all
                          ${currentStatus?.color ?? "bg-white/5 text-white border-white/10"}`}
            >
              <span>{currentStatus?.label ?? "Set status"}</span>
              <FiChevronDown className={`h-4 w-4 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>

            {statusOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30
                              bg-[#1c1c35] border border-white/10 rounded-2xl shadow-2xl py-1">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s.id}
                    onClick={() => { handleStatusChange(anime.mal_id, s.id); setStatusOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-general transition-colors
                                hover:bg-white/5 flex items-center gap-2
                                ${userListItem.status === s.id ? "text-violet-300" : "text-white/60"}`}
                  >
                    {userListItem.status === s.id && <FiCheck className="h-3 w-3 text-violet-400 flex-shrink-0" />}
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episode +1 and Score row */}
          <div className="flex gap-2">
            <button
              onClick={() => handleProgressChange(anime.mal_id, (userListItem.progress_ep ?? 0) + 1)}
              className="flex-1 flex items-center justify-center gap-1.5
                         bg-white/[0.05] hover:bg-violet-600/20
                         border border-white/10 hover:border-violet-500/40
                         text-white/70 hover:text-white text-xs font-general
                         py-2 rounded-xl transition-all"
              title="Mark next episode watched"
            >
              <FiPlusCircle className="h-3.5 w-3.5" />
              Ep {(userListItem.progress_ep ?? 0) + 1}
              {userListItem.total_ep ? `/${userListItem.total_ep}` : ""}
            </button>

            {canScore && (
              <div className="relative">
                <button
                  onClick={() => { setScoreOpen((v) => !v); setStatusOpen(false); }}
                  className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-amber-500/20
                             border border-white/10 hover:border-amber-500/40
                             text-amber-400 text-xs font-general
                             py-2 px-3 rounded-xl transition-all"
                  title="Rate this anime"
                >
                  <FiStar className="h-3.5 w-3.5" />
                  {userListItem.score ?? "Rate"}
                </button>

                {scoreOpen && (
                  <div className="absolute right-0 top-full mt-1 z-30
                                  bg-[#1c1c35] border border-white/10 rounded-2xl shadow-2xl p-2">
                    <div className="grid grid-cols-5 gap-1 w-28">
                      {SCORES.map((s) => (
                        <button key={s}
                          onClick={() => { handleScoreChange(anime.mal_id, s); setScoreOpen(false); }}
                          className={`text-xs py-1.5 rounded-lg font-general transition-colors
                            ${userListItem.score === s
                              ? "bg-amber-500/30 text-amber-300 ring-1 ring-amber-500/40"
                              : "hover:bg-white/10 text-white/50 hover:text-white"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={() => handleRemove(anime.mal_id, anime.title_english || anime.title)}
            className="w-full flex items-center justify-center gap-1.5
                       text-[11px] text-white/25 hover:text-red-400 font-general
                       transition-colors py-1"
          >
            <FiTrash2 className="h-3 w-3" />
            Remove from list
          </button>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function AnimeItem() {
  const { id } = useParams();
  const { configured, saveProfile } = useSupabase();

  const [anime,       setAnime]       = useState(null);
  const [characters,  setCharacters]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [charLoading, setCharLoading] = useState(true);
  const [showMore,    setShowMore]    = useState(false);
  const [imgError,    setImgError]    = useState(false);
  const [titleLang,   setTitleLang]   = useState("en");

  // ── Record last watched ────────────────────────────────────────────────
  const recordLastWatched = useCallback(async (d) => {
    const user = auth.currentUser;
    if (!user || !d) return;
    const lastVisited = {
      animeId: d.mal_id,
      title: d.title,
      image: bestImage(d.images) ?? "",
    };
    try {
      await setDoc(
        doc(db, "Users", user.uid),
        { lastWatched: { ...lastVisited, updatedAt: serverTimestamp() } },
        { merge: true }
      );
      if (configured) await saveProfile({ last_visited: lastVisited });
    } catch (e) { console.error("recordLastWatched:", e); }
  }, [configured, saveProfile]);

  // ── Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setCharLoading(true);
    setAnime(null);
    setCharacters([]);
    setImgError(false);
    setShowMore(false);

    getAnimeById(id)
      .then((res) => { setAnime(res.data); recordLastWatched(res.data); })
      .catch((e)  => console.error("getAnimeById:", e))
      .finally(() => setLoading(false));

    getAnimeCharacters(id)
      .then((res) => setCharacters(res.data ?? []))
      .catch((e)  => console.error("getAnimeCharacters:", e))
      .finally(() => setCharLoading(false));
  }, [id, recordLastWatched]);

  // ── Derived ───────────────────────────────────────────────────────────
  const {
    title, title_english, title_japanese,
    synopsis, trailer,
    duration, aired, season, images,
    rank, score, scored_by, popularity,
    status, rating, source, year, type,
    episodes, studios, producers, genres,
    members, favorites, background,
  } = anime ?? {};

  const activeTitle = titleLang === "jp" && title_japanese
    ? title_japanese
    : (title_english || title || "");

  const hasJpTitle    = !!title_japanese && title_japanese !== (title_english || title);
  const studioNames   = studios?.map((s) => s.name).join(", ");
  const producerNames = producers?.map((p) => p.name).join(", ");
  const genreNames    = genres?.map((g) => g.name) ?? [];
  const posterUrl     = bestImage(images, "large");

  const displayChars = [
    ...characters.filter((c) => c.role === "Main").slice(0, 8),
    ...characters.filter((c) => c.role !== "Main").slice(0, 4),
  ];

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] px-4 pb-10 pt-20">
        <div className="mx-auto max-w-6xl space-y-6">
          <Skeleton className="aspect-video w-full" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
            <Skeleton className="h-[380px]" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] pb-16">
      {/* Ambient violet glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px]
                      bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_60%)]" />

      {/* ── Trailer — full width, unchanged layout ───────────────────── */}
      <div className="relative mx-auto w-full px-6 pb-6 pt-24 sm:px-6">
        {trailer?.embed_url ? (
          <div className="overflow-hidden rounded-2xl">
            <iframe
              src={trailer.embed_url}
              title={`${activeTitle} — Trailer`}
              className="aspect-video h-full max-h-[80vh] w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex h-14 items-center justify-center text-xs uppercase
                          tracking-widest text-white/30">
            No trailer available
          </div>
        )}
      </div>

      {/* ── Everything else — centered, dark themed ──────────────────── */}
      <div className="relative bg-[#0a0a0f] mx-auto w-full max-w-full px-4 sm:px-6">

        {/* ── Main card ─────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6
                        shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">

            {/* ── Poster column ──────────────────────────────────── */}
            <div className="flex flex-col items-center gap-4">
              {!imgError && posterUrl ? (
                <picture>
                  {images?.webp?.large_image_url && (
                    <source srcSet={images.webp.large_image_url} type="image/webp" />
                  )}
                  <img
                    src={images?.jpg?.large_image_url || posterUrl}
                    alt={activeTitle}
                    className="w-full max-w-[260px] rounded-2xl object-cover
                               ring-1 ring-white/10 shadow-2xl shadow-black/40"
                    onError={() => setImgError(true)}
                  />
                </picture>
              ) : (
                <div className="flex aspect-[3/4] w-full max-w-[260px] items-center justify-center
                                rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500
                                p-4 text-center text-white shadow-2xl shadow-black/40">
                  <span className="font-bold text-base leading-snug">{activeTitle}</span>
                </div>
              )}

              {/* Score */}
              {score > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-amber-400/25
                                bg-amber-400/10 px-4 py-1.5">
                  <IoStar className="h-4 w-4 text-amber-400" />
                  <span className="font-bold text-white">{score}</span>
                  {scored_by > 0 && (
                    <span className="text-xs text-white/40">
                      ({scored_by >= 1000 ? `${(scored_by / 1000).toFixed(0)}K` : scored_by})
                    </span>
                  )}
                </div>
              )}

              {/* Rank */}
              {rank && (
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1
                                text-xs font-medium text-white/60">
                  Ranked #{rank}
                </div>
              )}

              {/* ── Live list actions ──────────────────────────────── */}
              <LiveListPanel anime={anime} />
            </div>
            {/* ── Info column ────────────────────────────────────── */}
            <div className="min-w-0">
              {/* Title row */}
              <div className="mb-2 flex items-start justify-between gap-3">
                <h1 className="flex-1 bg-gradient-to-r from-white via-violet-100 to-violet-300
                               bg-clip-text text-3xl font-bold leading-tight text-transparent
                               md:text-4xl">
                  {activeTitle}
                </h1>

                {hasJpTitle && (
                  <div className="mt-1 flex flex-shrink-0 items-center rounded-full
                                  border border-white/10 bg-white/[0.04] p-0.5 text-xs">
                    <button
                      onClick={() => setTitleLang("en")}
                      className={`rounded-full px-2.5 py-0.5 transition-all duration-150
                        ${titleLang === "en"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-white/50 hover:text-white/80"}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setTitleLang("jp")}
                      className={`rounded-full px-2.5 py-0.5 transition-all duration-150
                        ${titleLang === "jp"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-white/50 hover:text-white/80"}`}
                    >
                      JP
                    </button>
                  </div>
                )}
              </div>

              {/* Secondary title */}
              {hasJpTitle && (
                <p className="-mt-1 mb-3 text-sm text-white/40">
                  {titleLang === "en" ? title_japanese : (title_english || title)}
                </p>
              )}

              {/* Genre badges */}
              {genreNames.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {genreNames.map((g) => <Badge key={g}>{g}</Badge>)}
                </div>
              )}

              {/* Stats grid */}
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="Type"       value={type} />
                <Stat label="Episodes"   value={episodes ?? "Ongoing"} />
                <Stat label="Status"     value={status} />
                <Stat label="Aired"      value={aired?.string} />
                <Stat label="Season"     value={season && year
                  ? `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`
                  : year?.toString()} />
                <Stat label="Duration"   value={duration} />
                <Stat label="Rating"     value={rating} />
                <Stat label="Source"     value={source} />
                <Stat label="Popularity" value={popularity ? `#${popularity}` : null} />
                <Stat label="Members"    value={members ? members.toLocaleString() : null} />
                <Stat label="Favorites"  value={favorites ? favorites.toLocaleString() : null} />
              </div>

              {/* Studios / Producers */}
              {(studioNames || producerNames) && (
                <div className="mb-5 space-y-1.5 border-t border-white/[0.06] pt-4">
                  {studioNames && (
                    <p className="text-sm text-white/50">
                      <span className="font-semibold text-white/70">Studio:</span>{" "}
                      <span className="text-white/80">{studioNames}</span>
                    </p>
                  )}
                  {producerNames && (
                    <p className="text-sm text-white/50">
                      <span className="font-semibold text-white/70">Producers:</span>{" "}
                      <span className="text-white/70">{producerNames}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Synopsis */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-white/90">Synopsis</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {showMore
                    ? synopsis
                    : `${synopsis?.substring(0, 400) ?? ""}${(synopsis?.length ?? 0) > 400 ? "…" : ""}`}
                </p>
                {(synopsis?.length ?? 0) > 400 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="mt-2 text-xs font-semibold text-violet-300
                               transition-colors hover:text-violet-200"
                  >
                    {showMore ? "Show less ↑" : "Read more ↓"}
                  </button>
                )}
              </div>

              {/* Background */}
              {background && (
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs leading-relaxed text-white/50">{background}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {anime && <EpisodeSection animeId={id} title={activeTitle} />}

        {/* ── Characters ────────────────────────────────────────────── */}
        <div className="mt-10">
          <SectionHeading>Characters</SectionHeading>

          {charLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4]" />
              ))}
            </div>
          ) : displayChars.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {displayChars.map((c, i) => (
                <CharCard
                  key={c.character?.mal_id ?? i}
                  character={c.character}
                  role={c.role}
                  voiceActors={c.voice_actors ?? []}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30">No character data available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default AnimeItem;