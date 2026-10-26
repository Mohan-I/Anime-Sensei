import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TiArrowLeft } from 'react-icons/ti';
import { useGlobalContext } from '../context/Global';
import Heart from "../assets/heart.svg";


// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-white">
    <span className="inline-block h-5 w-1 rounded-full bg-violet-500" />
    {children}
  </h2>
);

// ── Panel wrapper ─────────────────────────────────────────────────────────────
const Panel = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5
                   backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

// ── Voice actor card ──────────────────────────────────────────────────────────
const VoiceActorCard = ({ person, language }) => {
  const [err, setErr] = useState(false);
  const img = person?.images?.jpg?.image_url ?? null;
  const displayName = person?.name
    ? person.name.includes(',')
      ? person.name.split(',').map((s) => s.trim()).reverse().join(' ')
      : person.name
    : '';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06]
                    bg-white/[0.02] p-3 transition-colors hover:border-violet-400/30
                    hover:bg-white/[0.04]">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full
                      bg-violet-500/20 ring-1 ring-white/10">
        {!err && img ? (
          <img
            src={img}
            alt={displayName}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setErr(true)}
          />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || '?')}&size=48&background=6d28d9&color=fff&bold=true`}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white/90">{displayName}</p>
        <span className="mt-0.5 inline-block rounded-full border border-violet-400/25
                         bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-200">
          {language}
        </span>
      </div>
    </div>
  );
};

// ── Anime appearance card ─────────────────────────────────────────────────────
const AnimeAppearanceCard = ({ anime, role }) => {
  const [err, setErr] = useState(false);
  const img = anime?.images?.jpg?.large_image_url
            ?? anime?.images?.jpg?.image_url
            ?? null;
  const isMain = role === 'Main';

  return (
    <Link
      to={`/anime/${anime?.mal_id}`}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.06]
                 bg-white/[0.02] p-3 transition-all duration-200
                 hover:border-violet-400/30 hover:bg-white/[0.04]
                 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.3)]"
    >
      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg
                      bg-white/[0.04] ring-1 ring-white/10">
        {!err && img ? (
          <img
            src={img}
            alt={anime?.title}
            className="h-full w-full object-cover transition-transform duration-500
                       group-hover:scale-110"
            loading="lazy"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center
                          bg-gradient-to-br from-violet-600 to-indigo-500 p-1">
            <span className="text-center text-[9px] font-bold text-white line-clamp-3">
              {anime?.title}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-semibold text-white/90 transition-colors
                      group-hover:text-violet-200">
          {anime?.title}
        </p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]
                          font-bold uppercase tracking-wider
          ${isMain
            ? 'bg-amber-400/90 text-amber-950'
            : 'bg-white/10 text-white/70 ring-1 ring-white/10'}`}>
          {role}
        </span>
      </div>
    </Link>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
function Gallery() {
  const { id } = useParams();
  const { getCharacterFull, character, isLoading } = useGlobalContext();

  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    getCharacterFull(id);
    setSelectedImg(0);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { full, pictures = [], voices = [], anime: animeList = [] } = character ?? {};

  const voiceActors = voices.length > 0 ? voices : (full?.voices ?? []);

  const mainImage = pictures[selectedImg]?.jpg?.image_url
    ?? full?.images?.jpg?.image_url
    ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] px-4 pb-12 pt-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] px-4 pb-16 pt-20">
      {/* Ambient violet glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px]
                      bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl">

        {/* ── Back + breadcrumb ─────────────────────────────────────── */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to={-1}
            className="flex items-center gap-1.5 text-sm text-violet-300
                       transition-colors hover:text-violet-200"
          >
            <TiArrowLeft className="text-lg" /> Back
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40">Character Profile</span>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">

          {/* ── Left column: gallery ──────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]
                            bg-white/[0.03] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={full?.name}
                  className="w-full object-cover"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(full?.name ?? 'Character')}&size=400&background=6d28d9&color=fff&bold=true`;
                  }}
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center
                                bg-gradient-to-br from-violet-600 to-indigo-500 p-6">
                  <span className="text-center text-2xl font-bold text-white">{full?.name}</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {pictures.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {pictures.map((pic, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all duration-200
                      ${i === selectedImg
                        ? 'scale-105 border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.25)]'
                        : 'border-white/10 opacity-60 hover:border-violet-400/40 hover:opacity-100'
                      }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={pic?.jpg?.image_url}
                      alt={`${full?.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(full?.name ?? '?')}&size=64&background=6d28d9&color=fff`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick stats */}
            {full?.favorites > 0 && (
              <Panel>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  MAL Favorites
                </p>
                <div className='flex'>
                <img src={Heart} alt="" className="h-12 w-12" />
                <p className="mt-1 text-2xl font-bold px-2 text-violet-300">
                  {full.favorites.toLocaleString()}
                </p>
                </div>
              </Panel>
            )}
          </div>

          {/* ── Right column: info ────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Name + nicknames */}
            <div>
              <h1 className="bg-gradient-to-r from-white via-violet-100 to-violet-300
                             bg-clip-text text-3xl font-bold leading-tight text-transparent
                             md:text-4xl">
                {full?.name ?? `Character ${id}`}
              </h1>
              {full?.name_kanji && (
                <p className="mt-1 text-lg text-white/40">{full.name_kanji}</p>
              )}
              {full?.nicknames?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {full.nicknames.map((n, i) => (
                    <span key={i}
                      className="rounded-full border border-violet-400/25 bg-violet-500/15
                                 px-2 py-0.5 text-[11px] font-medium text-violet-200">
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            {full?.about && (
              <Panel>
                <SectionTitle>About</SectionTitle>
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">
                  {full.about}
                </p>
              </Panel>
            )}

            {/* Anime appearances */}
            {animeList.length > 0 && (
              <Panel>
                <SectionTitle>Anime Appearances</SectionTitle>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {animeList.map((entry, i) => (
                    <AnimeAppearanceCard key={i} anime={entry.anime} role={entry.role} />
                  ))}
                </div>
              </Panel>
            )}

            {/* Voice actors */}
            {voiceActors.length > 0 && (
              <Panel>
                <SectionTitle>Voice Actors</SectionTitle>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {voiceActors.map((v, i) => (
                    <VoiceActorCard
                      key={v.person?.mal_id ?? i}
                      person={v.person}
                      language={v.language}
                    />
                  ))}
                </div>
              </Panel>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;