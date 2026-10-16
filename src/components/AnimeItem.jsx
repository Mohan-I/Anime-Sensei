import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnimeById, getAnimeCharacters } from "../services/tenraiService";

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
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ── Badge chip ────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "violet", href }) => {
  const colors = {
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    green:  "bg-green-100  text-green-700  border-green-200",
    blue:   "bg-blue-100   text-blue-700   border-blue-200",
  };
  const cls = `inline-block px-2.5 py-0.5 rounded-full text-xs font-general font-medium border ${colors[color] ?? colors.violet}`;
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:opacity-80 transition-opacity`}>{children}</a>
    : <span className={cls}>{children}</span>;
};

// ── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) =>
  value ? (
    <p className="text-sm text-gray-700 flex gap-1.5">
      <span className="font-semibold text-gray-900 flex-shrink-0">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </p>
  ) : null;

// ── Character card — includes inline VA ───────────────────────────────────────
const CharCard = ({ character, role, voiceActors = [] }) => {
  const { images, name, mal_id } = character;
  const poster = bestImage(images, "small");
  // Show only the Japanese VA (most common) or first available
  const jaVA = voiceActors.find((v) => v.language === "Japanese") ?? voiceActors[0];

  return (
    <Link to={`/character/${mal_id}`}>
      <div className="group relative bg-gradient-to-br from-violet-600 to-indigo-500 rounded-2xl
                      overflow-hidden hover:shadow-xl w-[40-vw] hover:scale-105 transition-all duration-300">
        {/* Corner accents */}
        {["tl","tr","bl","br"].map((c) => (
          <div key={c} className={`absolute w-14 h-14 z-10
            ${c[0]==="t" ? "top-0" : "bottom-0"} ${c[1]==="l" ? "left-0" : "right-0"}
            ${c==="tl" ? "border-t-2 border-l-2 rounded-tl-2xl" :
              c==="tr" ? "border-t-2 border-r-2 rounded-tr-2xl" :
              c==="bl" ? "border-b-2 border-l-2 rounded-bl-2xl" :
                         "border-b-2 border-r-2 rounded-br-2xl"}
            border-white/25`}
          />
        ))}

        {/* Character image */}
        <img
          src={poster}
          alt={name}
          className="w-full h-[60vh] object-cover object-top"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=6d28d9&color=fff&bold=true`;
          }}
        />

        {/* Info overlay */}
        <div className="p-4">
          <h4 className="text-white font-semibold text-md truncate leading-snug">{name}</h4>
          <div className="flex items-center justify-between mt-1 gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-general font-medium
              ${role === "Main"
                ? "bg-yellow-300 text-semibold text-yellow-800"
                : "bg-white/20 text-white/80"}`}>
              {role}
            </span>
            {jaVA && (
              <span className="text-[10px] text-white/60 truncate font-general">
                🎙 {jaVA.person?.name?.split(", ").reverse().join(" ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
function AnimeItem() {
  const { id } = useParams();

  const [anime,       setAnime]       = useState(null);
  const [characters,  setCharacters]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [charLoading, setCharLoading] = useState(true);
  const [showMore,    setShowMore]    = useState(false);
  const [imgError,    setImgError]    = useState(false);
  // EN / JP title toggle — compact pill button
  const [titleLang,   setTitleLang]   = useState("en"); // "en" | "jp"

  // ── Record last watched ────────────────────────────────────────────────
  const recordLastWatched = async (d) => {
    const user = auth.currentUser;
    if (!user || !d) return;
    try {
      await setDoc(
        doc(db, "Users", user.uid),
        { lastWatched: { animeId: d.mal_id, title: d.title, image: bestImage(d.images) ?? "", updatedAt: serverTimestamp() } },
        { merge: true }
      );
    } catch (e) { console.error("recordLastWatched:", e); }
  };

  // ── Fetch — uses /anime/:id (not /full) + /anime/:id/characters ────────
  useEffect(() => {
    setLoading(true);
    setCharLoading(true);
    setAnime(null);
    setCharacters([]);
    setImgError(false);
    setShowMore(false);

    // /anime/:id — contains all essential display fields
    getAnimeById(id)
      .then((res) => { setAnime(res.data); recordLastWatched(res.data); })
      .catch((e)  => console.error("getAnimeById:", e))
      .finally(() => setLoading(false));

    // /anime/:id/characters — each entry includes voice_actors[]
    getAnimeCharacters(id)
      .then((res) => setCharacters(res.data ?? []))
      .catch((e)  => console.error("getAnimeCharacters:", e))
      .finally(() => setCharLoading(false));
  }, [id]);

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

  // Pick active title label
  const activeTitle = titleLang === "jp" && title_japanese
    ? title_japanese
    : (title_english || title || "");

  const hasJpTitle   = !!title_japanese && title_japanese !== (title_english || title);
  const studioNames  = studios?.map((s) => s.name).join(", ");
  const producerNames= producers?.map((p) => p.name).join(", ");
  const genreNames   = genres?.map((g) => g.name) ?? [];

  // Prefer webp poster
  const posterUrl    = bestImage(images, "large");

  // Sort: Main first, then Supporting, cap at 12 total
  const displayChars = [
    ...characters.filter((c) => c.role === "Main").slice(0, 8),
    ...characters.filter((c) => c.role !== "Main").slice(0, 4),
  ];

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 px-4 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <Skeleton className="h-96" />
          <div className="space-y-4 pt-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000] min-h-screen pb-16">
      <div className="w-full mx-auto px-4 sm:px-6">

        {/* ── Trailer ──────────────────────────────────────────────────── */}
        <div className="pt-20 pb-6">
          {trailer?.embed_url ? (
            <div className="rounded-2xl overflow-hidden">
              <iframe
                src={trailer.embed_url}
                title={`${activeTitle} — Trailer`}
                className="w-full h-full max-h-[80vh] aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-14 text-white/30 font-general text-xs uppercase tracking-widest">
              No trailer available
            </div>
          )}
        </div>

        {/* ── Main card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

            {/* ── Poster ─────────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-4">
              {!imgError && posterUrl ? (
                <picture>
                  {/* Offer webp if browser supports it */}
                  {images?.webp?.large_image_url && (
                    <source srcSet={images.webp.large_image_url} type="image/webp" />
                  )}
                  <img
                    src={images?.jpg?.large_image_url || posterUrl}
                    alt={activeTitle}
                    className="w-56 rounded-2xl shadow-lg object-cover"
                    onError={() => setImgError(true)}
                  />
                </picture>
              ) : (
                <div className="w-56 h-80 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500
                                flex items-center justify-center text-white text-center p-4 shadow-lg">
                  <span className="font-bold text-base leading-snug">{activeTitle}</span>
                </div>
              )}

              {/* Score */}
              {score > 0 && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200
                                rounded-full px-4 py-1.5 shadow-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold text-gray-800">{score}</span>
                  {scored_by > 0 && (
                    <span className="text-gray-400 text-xs">
                      ({scored_by >= 1000 ? `${(scored_by/1000).toFixed(0)}K` : scored_by})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── Info ───────────────────────────────────────────────── */}
            <div>
              {/* Title + language toggle */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600
                               bg-clip-text text-transparent leading-tight flex-1">
                  {activeTitle}
                </h1>

                {/* Compact EN / JP pill toggle — only shown when a JP title exists */}
                {hasJpTitle && (
                  <div className="flex items-center flex-shrink-0 bg-gray-100 rounded-full p-0.5 mt-1 text-xs font-general">
                    <button
                      onClick={() => setTitleLang("en")}
                      className={`px-2.5 py-0.5 rounded-full transition-all duration-150
                        ${titleLang === "en"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setTitleLang("jp")}
                      className={`px-2.5 py-0.5 rounded-full transition-all duration-150
                        ${titleLang === "jp"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"}`}
                    >
                      JP
                    </button>
                  </div>
                )}
              </div>

              {/* Secondary title hint */}
              {hasJpTitle && (
                <p className="text-sm text-gray-400 font-general mb-3 -mt-1">
                  {titleLang === "en" ? title_japanese : (title_english || title)}
                </p>
              )}

              {/* Genre badges */}
              {genreNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {genreNames.map((g) => <Badge key={g} color="violet">{g}</Badge>)}
                </div>
              )}

              <hr className="border-gray-100 mb-4" />

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-5">
                <InfoRow label="Type"       value={type} />
                <InfoRow label="Episodes"   value={episodes ?? "Ongoing"} />
                <InfoRow label="Status"     value={status} />
                <InfoRow label="Aired"      value={aired?.string} />
                <InfoRow label="Season"     value={season && year
                  ? `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`
                  : year?.toString()} />
                <InfoRow label="Duration"   value={duration} />
                <InfoRow label="Rating"     value={rating} />
                <InfoRow label="Source"     value={source} />
                <InfoRow label="Rank"       value={rank       ? `#${rank}`       : null} />
                <InfoRow label="Popularity" value={popularity ? `#${popularity}` : null} />
                <InfoRow label="Members"    value={members    ? members.toLocaleString()   : null} />
                <InfoRow label="Favorites"  value={favorites  ? favorites.toLocaleString() : null} />
                <InfoRow label="Studios"    value={studioNames} />
                <InfoRow label="Producers"  value={producerNames} />
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Synopsis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {showMore
                    ? synopsis
                    : `${synopsis?.substring(0, 400) ?? ""}${(synopsis?.length ?? 0) > 400 ? "…" : ""}`}
                </p>
                {(synopsis?.length ?? 0) > 400 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-violet-600 hover:text-violet-800 text-xs font-semibold mt-1.5 transition-colors"
                  >
                    {showMore ? "Show Less ↑" : "Read More ↓"}
                  </button>
                )}
              </div>

              {/* Background */}
              {background && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-xs leading-relaxed">{background}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Characters ────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
            Characters
          </h2>

          {charLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : displayChars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <p className="text-white/30 text-sm font-general">No character data available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default AnimeItem;
