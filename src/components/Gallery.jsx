import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TiArrowLeft } from 'react-icons/ti';
import { useGlobalContext } from '../context/Global';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
    {children}
  </h2>
);

// ── Voice actor card ──────────────────────────────────────────────────────────
const VoiceActorCard = ({ person, language }) => {
  const [err, setErr] = useState(false);
  // Real Jikan returns images.jpg.image_url for people — webp not always available
  const img = person?.images?.jpg?.image_url ?? null;
  // Format "Surname, Firstname" → "Firstname Surname" for display
  const displayName = person?.name
    ? person.name.includes(',')
      ? person.name.split(',').map((s) => s.trim()).reverse().join(' ')
      : person.name
    : '';

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-violet-100 flex-shrink-0">
        {!err && img ? (
          <img
            src={img}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => setErr(true)}
          />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || '?')}&size=48&background=6d28d9&color=fff&bold=true`}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{displayName}</p>
        <span className="text-xs text-violet-600 font-general bg-violet-50 px-2 py-0.5 rounded-full">
          {language}
        </span>
      </div>
    </div>
  );
};

// ── Anime appearance card ─────────────────────────────────────────────────────
const AnimeAppearanceCard = ({ anime, role }) => {
  const [err, setErr] = useState(false);
  // Real Jikan /characters/:id/anime returns image_url (not large_image_url)
  // Fall back gracefully through both field names
  const img = anime?.images?.jpg?.large_image_url
            ?? anime?.images?.jpg?.image_url
            ?? null;
  return (
    <Link
      to={`/anime/${anime?.mal_id}`}
      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100
                 hover:bg-violet-50 hover:border-violet-200 transition-colors group"
    >
      <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
        {!err && img ? (
          <img src={img} alt={anime?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={() => setErr(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center p-1">
            <span className="text-white text-[9px] font-bold text-center">{anime?.title}</span>
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm group-hover:text-violet-700 transition-colors line-clamp-2">
          {anime?.title}
        </p>
        <span className={`text-xs font-general px-2 py-1.5 rounded-full mt-1 inline-block
          ${role === 'Main' ? 'bg-violet-400 text-slate-100' : 'bg-gray-100 text-gray-600'}`}>
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

  // Voice actors: prefer the dedicated voices array from the separate endpoint,
  // but fall back to full.voices if the separate call came back empty.
  // This handles both live Jikan (separate endpoint) and mock (data in full.voices).
  const voiceActors = voices.length > 0
    ? voices
    : (full?.voices ?? []);

  const mainImage = pictures[selectedImg]?.jpg?.image_url
    ?? full?.images?.jpg?.image_url
    ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Back + breadcrumb ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={-1}
            className="flex items-center gap-1.5 text-sm font-general text-violet-600
                       hover:text-violet-800 transition-colors"
          >
            <TiArrowLeft className="text-lg" /> Back
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500 font-general">Character Profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">

          {/* ── Left column: gallery ──────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
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
                <div className="w-full h-72 bg-gradient-to-br from-violet-600 to-indigo-500
                                flex items-center justify-center p-6">
                  <span className="text-white font-bold text-2xl text-center">{full?.name}</span>
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
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${i === selectedImg
                        ? 'border-violet-500 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-violet-300 grayscale hover:grayscale-0'
                      }`}
                  >
                    <img
                      src={pic?.jpg?.image_url}
                      alt={`${full?.name} ${i + 1}`}
                      className="w-full h-full object-cover"
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm text-gray-500 font-general">MAL Favorites</p>
                <p className="text-2xl font-bold text-violet-600 mt-1">
                  {full.favorites.toLocaleString()}
                  <span className="text-red-400 ml-2">♥</span>
                </p>
              </div>
            )}
          </div>

          {/* ── Right column: info ────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Name + nicknames */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                {full?.name ?? `Character ${id}`}
              </h1>
              {full?.name_kanji && (
                <p className="text-gray-500 text-lg mt-0.5">{full.name_kanji}</p>
              )}
              {full?.nicknames?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {full.nicknames.map((n, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full font-general border border-violet-100">
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            {full?.about && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SectionTitle>About</SectionTitle>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {full.about}
                </p>
              </div>
            )}

            {/* Anime appearances */}
            {animeList.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SectionTitle>Anime Appearances</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {animeList.map((entry, i) => (
                    <AnimeAppearanceCard key={i} anime={entry.anime} role={entry.role} />
                  ))}
                </div>
              </div>
            )}

            {/* Voice actors */}
            {voiceActors.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SectionTitle>Voice Actors</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {voiceActors.map((v, i) => (
                    <VoiceActorCard key={v.person?.mal_id ?? i} person={v.person} language={v.language} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
