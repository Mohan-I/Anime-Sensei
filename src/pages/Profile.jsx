/**
 * Profile.jsx — with full Preferences & Restrictions panel
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal }            from "react-dom";
import { auth, db }                from "../firebase/firebase";
import { doc, getDoc, setDoc }     from "firebase/firestore";
import { useNavigate, Link }       from "react-router-dom";
import { toast }                   from "react-toastify";
import { useSupabase }             from "../context/SupabaseContext";
import { getUserAnimeList, getUserAnimeStats } from "../lib/userAnimeList";

// ── Genre list ────────────────────────────────────────────────────────────────
const GENRES = [
  "Action","Adventure","Comedy","Drama","Fantasy","Horror",
  "Mecha","Mystery","Romance","Sci-Fi","Slice of Life",
  "Shounen","Seinen","Psychological","Sports","Supernatural",
];

// ── Banner options ────────────────────────────────────────────────────────────
const BANNER_OPTIONS = [
  { id: 1, src: "/img/profile/profile_bg (1).webp", label: "Mountain Dusk" },
  { id: 2, src: "/img/profile/profile_bg (2).webp", label: "Sakura Valley" },
  { id: 3, src: "/img/profile/profile_bg (3).webp", label: "Night City"    },
];

const FALLBACK_FAVORITES = [
  { title: "Demon Slayer", img: "/categories/wallpapers/demonslay.webp"   },
  { title: "JJK",          img: "/categories/wallpapers/jjk.webp"         },
  { title: "Death Note",   img: "/categories/wallpapers/deathnote.webp"   },
  { title: "Black Clover", img: "/categories/wallpapers/blackclover.webp" },
  { title: "Naruto",       img: "/categories/wallpapers/naruto.webp"      },
  { title: "Tokyo Ghoul",  img: "/categories/wallpapers/tokyoghoul.webp"  },
];

// ── Customization options ─────────────────────────────────────────────────────
const MATURITY_OPTIONS = [
  { id: "all",    label: "All Ages",     desc: "Show everything including kids' content",  badge: "G",   color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "pg",     label: "PG",           desc: "Mild themes, some parental guidance",       badge: "PG",  color: "bg-blue-500/20 text-blue-300 border-blue-500/30"           },
  { id: "teen",   label: "Teen (13+)",   desc: "Moderate violence, mild language",          badge: "13+", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"      },
  { id: "mature", label: "Mature (17+)", desc: "Strong violence, adult themes",             badge: "17+", color: "bg-orange-500/20 text-orange-300 border-orange-500/30"      },
  { id: "r18",    label: "18+ Only",     desc: "Explicit content, restricted",              badge: "18+", color: "bg-red-500/20 text-red-300 border-red-500/30"               },
];

const LANGUAGE_OPTIONS = [
  { id: "en", label: "English",    flag: "🇺🇸" },
  { id: "ja", label: "Japanese",   flag: "🇯🇵" },
  { id: "es", label: "Spanish",    flag: "🇪🇸" },
  { id: "fr", label: "French",     flag: "🇫🇷" },
  { id: "de", label: "German",     flag: "🇩🇪" },
  { id: "pt", label: "Portuguese", flag: "🇵🇹" },
  { id: "hi", label: "Hindi",      flag: "🇮🇳" },
  { id: "ko", label: "Korean",     flag: "🇰🇷" },
  { id: "zh", label: "Chinese",    flag: "🇨🇳" },
  { id: "ar", label: "Arabic",     flag: "🇸🇦" },
];

const SUBTITLE_OPTIONS = [
  { id: "off",   label: "Off"              },
  { id: "en",    label: "English"          },
  { id: "en-cc", label: "English (CC)"     },
  { id: "ja",    label: "Japanese"         },
  { id: "multi", label: "Multi-language"   },
];

const CONTENT_FILTERS = [
  { id: "violence", label: "Violence & Gore",      desc: "Hide graphic fight scenes"          },
  { id: "language", label: "Strong Language",      desc: "Filter profanity in subtitles"      },
  { id: "nudity",   label: "Nudity & Fanservice",  desc: "Blur suggestive content"            },
  { id: "drugs",    label: "Drug & Alcohol Use",   desc: "Hide substance-related scenes"      },
  { id: "horror",   label: "Horror & Jump Scares", desc: "Warn before scary moments"          },
  { id: "spoilers", label: "Spoiler Blur",          desc: "Blur thumbnails from unwatched eps" },
];

const PLAYBACK_QUALITY = [
  { id: "auto", label: "Auto",      desc: "Adapt to connection"      },
  { id: "sd",   label: "480p SD",   desc: "Low data usage"           },
  { id: "hd",   label: "720p HD",   desc: "Balanced"                 },
  { id: "fhd",  label: "1080p FHD", desc: "Best quality"             },
  { id: "4k",   label: "4K UHD",    desc: "Requires fast connection" },
];

const DEFAULT_PREFS = {
  maturity:             "teen",
  language:             "en",
  subtitle:             "en-cc",
  dubPreferred:         false,
  autoplayNext:         true,
  skipIntro:            true,
  autoTrackProgress:    true,
  contentFilters:       [],
  playbackQuality:      "auto",
  dataSaver:            false,
  publicProfile:        true,
  showActivity:         true,
  allowRecommendations: true,
};

const DEFAULT_SUBSCRIPTION = {
  plan: "basic",
  status: "default",
};

// ── Tiny UI primitives ────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h2 className="text-[10px] font-general font-semibold uppercase tracking-[0.15em] text-white/35 mb-4">
    {children}
  </h2>
);

const SubHeading = ({ children }) => (
  <p className="text-[10px] font-general uppercase tracking-widest text-white/35 mb-2">{children}</p>
);

const StatBox = ({ icon, label, value, loading }) => (
  <div className="flex flex-col items-center gap-0.5 py-2">
    <span className="text-lg leading-none">{icon}</span>
    {loading
      ? <div className="h-5 w-10 bg-white/10 rounded animate-pulse mt-0.5" />
      : <span className="text-white font-bold text-base leading-tight mt-0.5">{value ?? "—"}</span>
    }
    <span className="text-[10px] font-general uppercase text-white/35 tracking-wider">{label}</span>
  </div>
);

const EpBar = ({ ep, total }) => {
  if (!total) return null;
  const pct = Math.min(100, Math.round(((ep || 0) / total) * 100));
  return (
    <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-2xl ${className}`} />
);

/** Accessible toggle switch */
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={[
      "relative w-10 h-5 rounded-full transition-colors flex-shrink-0 disabled:opacity-40",
      checked ? "bg-violet-600" : "bg-white/15",
    ].join(" ")}
  >
    <span
      className={[
        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-5" : "translate-x-0",
      ].join(" ")}
    />
  </button>
);

/**
 * Grid of selectable option cards.
 * Each option: { id, label, desc?, flag?, badge?, color? }
 */
const SegmentedSelect = ({ options, value, onChange, columns = 3 }) => (
  <div
    className="grid gap-2"
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
  >
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        title={o.desc}
        className={[
          "text-left px-3 py-2 rounded-xl border text-xs transition-all",
          value === o.id
            ? "bg-violet-600/20 border-violet-500 text-white"
            : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/25 hover:text-white/85",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5 font-medium leading-tight">
          {o.flag  && <span>{o.flag}</span>}
          {o.badge && (
            <span className={`text-[9px] px-1 py-0.5 rounded border ${o.color ?? ""}`}>
              {o.badge}
            </span>
          )}
          <span>{o.label}</span>
        </div>
        {o.desc && (
          <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{o.desc}</div>
        )}
      </button>
    ))}
  </div>
);

// ── Banner picker — portal so overflow:hidden can't clip it ──────────────────
function BannerPicker({ anchorRef, open, onClose, bannerIdx, onSelect }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    setRect(anchorRef.current.getBoundingClientRect());
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const close = () => onClose();
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, onClose]);

  if (!open || !rect) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top:   rect.bottom + 8,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
        width: 256,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="bg-[#1c1c35] border border-white/10 rounded-2xl shadow-2xl p-3"
    >
      <p className="text-[10px] font-general uppercase tracking-widest text-white/40 mb-2.5 px-0.5">
        Select Banner
      </p>
      <div className="space-y-2">
        {BANNER_OPTIONS.map((b, i) => (
          <button
            key={b.id}
            onMouseDown={(e) => { e.stopPropagation(); onSelect(i); }}
            className={[
              "w-full relative rounded-xl overflow-hidden border-2 transition-all",
              bannerIdx === i
                ? "border-violet-500 ring-1 ring-violet-500/40"
                : "border-transparent hover:border-white/25",
            ].join(" ")}
          >
            <img src={b.src} alt={b.label} className="w-full h-[52px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end px-2 pb-1.5">
              <span className="text-white text-[11px] font-semibold">{b.label}</span>
            </div>
            {bannerIdx === i && (
              <span className="absolute top-1.5 right-1.5 bg-violet-500 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Profile Page
// ══════════════════════════════════════════════════════════════════════════════
export default function Profile() {
  // Firebase / Firestore state
  const [userDetails,     setUserDetails]     = useState(null);
  const [profile,         setProfile]         = useState({ username: "", age: "", favoriteGenres: [] });
  const [isEditing,       setIsEditing]       = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [fbLoading,       setFbLoading]       = useState(true);
  const [bannerIdx,       setBannerIdx]       = useState(0);
  const [pickerOpen,      setPickerOpen]      = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent,  setNewsletterSent]  = useState(false);

  // Supabase state
  const { supabase, firebaseUser, sbProfile, configured, saveProfile } = useSupabase();
  const [animeList,   setAnimeList]   = useState([]);
  const [animeStats,  setAnimeStats]  = useState(null);
  const [listLoading, setListLoading] = useState(false);

  // Preferences state
  const [prefs,       setPrefs]       = useState(DEFAULT_PREFS);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsDirty,  setPrefsDirty]  = useState(false);
  const prefsSaveRef = useRef(null);

  const bannerBtnRef = useRef(null);
  const navigate     = useNavigate();

  // ── Firebase auth guard + Firestore load ──────────────────────────────
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { navigate("/login"); return; }
      try {
        const snap = await getDoc(doc(db, "Users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setUserDetails(d);
          setProfile({ username: d.username || "", age: d.age || "", favoriteGenres: d.favoriteGenres || [] });
          if (typeof d.bannerIdx === "number") setBannerIdx(d.bannerIdx);
        }
      } catch (e) { console.error("Firestore load:", e); }
      finally { setFbLoading(false); }
    });
    return () => unsub();
  }, [navigate]);

  // ── Supabase: anime list + stats ───────────────────────────────────────
  useEffect(() => {
    if (!configured || !firebaseUser) return;
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const [list, stats] = await Promise.all([
          getUserAnimeList(supabase, firebaseUser.uid),
          getUserAnimeStats(supabase, firebaseUser.uid),
        ]);
        if (!cancelled) { setAnimeList(list); setAnimeStats(stats); }
      } catch (e) { console.error("[Profile] list load:", e?.message); }
      finally { if (!cancelled) setListLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [configured, firebaseUser, supabase]);

  // ── Sync banner from Supabase profile ─────────────────────────────────
  useEffect(() => {
    if (typeof sbProfile?.banner_idx === "number") setBannerIdx(sbProfile.banner_idx);
  }, [sbProfile]);

  // ── Load preferences (Supabase wins over Firestore) ───────────────────
  useEffect(() => {
    const merged = { ...DEFAULT_PREFS };
    if (userDetails?.preferences) Object.assign(merged, userDetails.preferences);
    if (sbProfile?.preferences)   Object.assign(merged, sbProfile.preferences);
    setPrefs(merged);
  }, [userDetails, sbProfile]);

  // ── Persist preferences (debounced 700ms auto-save) ───────────────────
  const persistPrefs = useCallback((next) => {
    setPrefsDirty(true);
    clearTimeout(prefsSaveRef.current);
    prefsSaveRef.current = setTimeout(async () => {
      const user = auth.currentUser;
      if (!user) return;
      setPrefsSaving(true);
      try {
        await setDoc(doc(db, "Users", user.uid), { preferences: next }, { merge: true });
        if (configured) await saveProfile({ preferences: next });
        setPrefsDirty(false);
        toast.success("Preferences saved", { position: "bottom-right", autoClose: 1500 });
      } catch (e) {
        console.error("Prefs save:", e);
        toast.error("Couldn't save preferences", { position: "bottom-right" });
      } finally { setPrefsSaving(false); }
    }, 700);
  }, [configured, saveProfile]);

  const updatePref = useCallback((key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      persistPrefs(next);
      return next;
    });
  }, [persistPrefs]);

  const toggleFilter = useCallback((id) => {
    setPrefs((prev) => {
      const has  = prev.contentFilters.includes(id);
      const next = {
        ...prev,
        contentFilters: has
          ? prev.contentFilters.filter((x) => x !== id)
          : [...prev.contentFilters, id],
      };
      persistPrefs(next);
      return next;
    });
  }, [persistPrefs]);

  // ── Other handlers ─────────────────────────────────────────────────────
  const handleGenreToggle = (g) =>
    setProfile((p) => ({
      ...p,
      favoriteGenres: p.favoriteGenres.includes(g)
        ? p.favoriteGenres.filter((x) => x !== g)
        : [...p.favoriteGenres, g],
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "Users", user.uid),
        { username: profile.username, age: profile.age ? Number(profile.age) : "", favoriteGenres: profile.favoriteGenres },
        { merge: true }
      );
      if (configured) {
        await saveProfile({
          username:        profile.username,
          favorite_genres: profile.favoriteGenres,
          age:             profile.age ? Number(profile.age) : null,
        });
      }
      setUserDetails((p) => ({ ...p, ...profile }));
      setIsEditing(false);
      toast.success("Profile updated!", { position: "top-center" });
    } catch { toast.error("Save failed. Try again.", { position: "top-center" }); }
    finally  { setSaving(false); }
  };

  const handleBannerSelect = useCallback(async (idx) => {
    setBannerIdx(idx);
    setPickerOpen(false);
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "Users", user.uid), { bannerIdx: idx }, { merge: true });
      if (configured) await saveProfile({ banner_idx: idx });
    }
  }, [configured, saveProfile]);

  const handleLogout = async () => { await auth.signOut(); navigate("/login"); };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    toast.success("Subscribed! Gojo-sensei is watching over your inbox. 👁️", { position: "top-center" });
  };

  // ── Derived data ──────────────────────────────────────────────────────
  const watching      = animeList.filter((a) => a.status === "watching").slice(0, 5);
  const completed     = animeList.filter((a) => a.status === "completed").slice(0, 6);
  const favoritePosts = completed.length >= 3
    ? completed.map((a) => ({ title: a.anime_title, img: a.anime_image_url }))
    : FALLBACK_FAVORITES;
  const favoriteGenres = sbProfile?.favorite_genres?.length
    ? sbProfile.favorite_genres
    : (userDetails?.favoriteGenres ?? []);
  const lastVisited = sbProfile?.last_visited ?? userDetails?.lastWatched;
  const subscription = {
    ...DEFAULT_SUBSCRIPTION,
    ...(sbProfile?.subscription ?? {}),
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (fbLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] pt-20 px-4 pb-10">
        <div className="max-w-6xl mx-auto space-y-5">
          <Skeleton className="h-52 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-5"><Skeleton className="h-64" /><Skeleton className="h-40" /></div>
            <div className="lg:col-span-2 space-y-5"><Skeleton className="h-52" /><Skeleton className="h-40" /></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName   = sbProfile?.username || userDetails?.username || userDetails?.firstName || "Anime Fan";
  const memberSince   = userDetails?.createdAt
    ? new Date(userDetails.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Jan 2024";
  const currentBanner = BANNER_OPTIONS[bannerIdx] ?? BANNER_OPTIONS[0];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">

        {/* ══ HERO ══ */}
        <div className="relative mb-8 rounded-2xl shadow-2xl">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={currentBanner.src}
              alt="Profile banner"
              className="w-full h-44 sm:h-56 object-cover object-center transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/20 to-transparent pointer-events-none" />
            <div className="absolute top-3 right-3">
              <button
                ref={bannerBtnRef}
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white text-xs font-general px-3 py-1.5 rounded-full border border-white/15 transition-all active:scale-95"
              >
                <span>🖼</span><span>Change Banner</span>
              </button>
            </div>
          </div>

          <div className="px-5 sm:px-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={sbProfile?.avatar_url || userDetails?.photo || "/img/avatar-default.png"}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-violet-500 object-cover shadow-xl bg-[#1a1a2e]"
                onError={(e) => { e.target.src = "/img/avatar-default.png"; }}
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />
            </div>
            <div className="flex-1 pb-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">@{displayName}</h1>
              <p className="text-white/45 text-xs font-general mt-0.5">Member since {memberSince}</p>
            </div>
            <div className="flex gap-2 pb-1 flex-shrink-0 flex-wrap">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-general font-medium px-4 py-1.5 rounded-full transition-all"
              >✏ Edit Profile</button>
              <Link to="/my-list"
                className="bg-white/[0.08] hover:bg-violet-500/20 border border-white/10 text-white text-xs font-general font-medium px-4 py-1.5 rounded-full transition-all active:scale-95"
              >📋 My List</Link>
              <button
                onClick={handleLogout}
                className="bg-white/[0.08] hover:bg-red-500/25 border border-white/10 text-white text-xs font-general font-medium px-4 py-1.5 rounded-full transition-all active:scale-95"
              >Logout</button>
            </div>
          </div>
        </div>

        <BannerPicker
          anchorRef={bannerBtnRef}
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          bannerIdx={bannerIdx}
          onSelect={handleBannerSelect}
        />

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div className="space-y-5">

            {/* Favorite Anime */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>Favorite Anime</SectionHeading>
                {configured && (
                  <Link to="/my-list" className="text-[10px] text-violet-400 hover:text-violet-300 font-general transition-colors">
                    See all →
                  </Link>
                )}
              </div>
              {listLoading ? (
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3]" />)}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {favoritePosts.map((a) => (
                    <div key={a.title} className="group relative rounded-lg overflow-hidden aspect-[2/3] cursor-pointer shadow-md bg-white/5">
                      {a.img && (
                        <img
                          src={a.img} alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                        <span className="text-[9px] font-general text-white leading-tight line-clamp-2">{a.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* My Stats */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>My Stats</SectionHeading>
              <div className="flex items-start gap-2.5 mb-5">
                <span className="text-violet-400 flex-shrink-0 mt-0.5">👁</span>
                <div>
                  <p className="text-[10px] font-general uppercase text-white/30 mb-1.5 tracking-wider">Favourite Genres</p>
                  {(favoriteGenres.length ? favoriteGenres : ["Action","Shounen","Fantasy","Comedy","Sci-Fi"])
                    .slice(0, 5)
                    .map((g) => <p key={g} className="text-sm text-white/75 leading-relaxed">{g}</p>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 border-t border-white/[0.06] pt-4">
                <StatBox icon="🎯" label="Watched"   loading={listLoading} value={animeStats?.total_anime ?? 0} />
                <StatBox icon="✅" label="Completed" loading={listLoading} value={animeStats?.completed_count ?? 0} />
                <StatBox icon="📺" label="Episodes"  loading={listLoading} value={animeStats?.total_episodes_watched?.toLocaleString() ?? 0} />
                <StatBox icon="⭐" label="Avg Score" loading={listLoading} value={animeStats?.avg_score ?? "—"} />
              </div>
            </section>

            {/* Subscription */}
            <section className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionHeading>Membership</SectionHeading>
                  <p className="text-lg font-semibold text-white capitalize">{subscription.plan} plan</p>
                  <p className="text-xs text-white/45 mt-1 capitalize">{subscription.status} membership</p>
                </div>
                <span className="rounded-full bg-violet-500/20 border border-violet-400/30 px-2.5 py-1 text-[10px] font-general uppercase tracking-wider text-violet-200">
                  Default
                </span>
              </div>
              <p className="text-xs text-white/45 leading-relaxed mt-4">
                Your basic membership is active with the default Anime Sensei experience.
              </p>
            </section>

            {/* Favourite Genres */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>Favourite Genres</SectionHeading>
              {(favoriteGenres.length ? favoriteGenres : ["Action","Shounen","Fantasy","Comedy","Sci-Fi"]).map((g) => (
                <div key={g} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">{g}</span>
                </div>
              ))}
            </section>

          </div>

          {/* ── RIGHT COLUMN ────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Currently Watching */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>Currently Watching</SectionHeading>
                {configured && (
                  <Link to="/my-list" className="text-[10px] text-violet-400 hover:text-violet-300 font-general transition-colors">
                    Manage list →
                  </Link>
                )}
              </div>
              {listLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-10 h-14 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2 w-full" /></div>
                    </div>
                  ))}
                </div>
              ) : watching.length > 0 ? (
                <div className="space-y-3">
                  {watching.map((item) => (
                    <Link key={item.mal_id} to={`/anime/${item.mal_id}`} className="flex items-center gap-3.5 group">
                      <div className="flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-white/5 shadow">
                        {item.anime_image_url && (
                          <img src={item.anime_image_url} alt={item.anime_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = "none"; }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate leading-snug group-hover:text-violet-300 transition-colors">
                          {item.anime_title}
                        </p>
                        <EpBar ep={item.progress_ep} total={item.total_ep} />
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <span className="text-[11px] text-white/35 font-general tabular-nums">
                          {item.total_ep ? `Ep ${item.progress_ep ?? 0} / ${item.total_ep}` : `Ep ${item.progress_ep ?? 0}`}
                        </span>
                        {item.score && <span className="text-[10px] text-yellow-400">★ {item.score}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <span className="text-4xl">🎌</span>
                  <p className="text-white/30 text-sm">No anime in progress yet.</p>
                  <Link to="/anime"
                    className="text-xs text-violet-400 hover:text-violet-300 font-general border border-violet-500/30 px-4 py-1.5 rounded-full transition-colors">
                    Browse Anime →
                  </Link>
                </div>
              )}
            </section>

            {/* Last Visited */}
            {lastVisited?.animeId ? (
              <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5 flex gap-4 items-start">
                <img src={lastVisited.image} alt={lastVisited.title}
                  className="w-14 h-20 object-cover rounded-lg shadow flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-general uppercase tracking-widest text-violet-400 mb-1">Last Visited</p>
                  <p className="text-sm font-semibold text-white leading-snug mb-3 truncate">{lastVisited.title}</p>
                  <Link to={`/anime/${lastVisited.animeId}`}
                    className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-general px-4 py-1.5 rounded-full transition-all active:scale-95">
                    Continue Watching →
                  </Link>
                </div>
              </section>
            ) : (
              <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-center min-h-[100px]">
                <div className="text-center">
                  <p className="text-white/25 text-sm mb-2">No anime visited yet.</p>
                  <Link to="/anime" className="text-violet-400 hover:text-violet-300 text-xs font-general">Browse Anime →</Link>
                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════
                PREFERENCES & RESTRICTIONS
            ══════════════════════════════════════════ */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <SectionHeading>Preferences &amp; Restrictions</SectionHeading>
                <span className={[
                  "text-[10px] font-general transition-opacity duration-300",
                  prefsSaving ? "text-violet-300 opacity-100"
                  : prefsDirty ? "text-amber-300 opacity-100"
                  : "opacity-0",
                ].join(" ")}>
                  {prefsSaving ? "Saving…" : "Unsaved"}
                </span>
              </div>

              {/* ── Maturity ── */}
              <div className="mb-6">
                <SubHeading>🔞 Maturity Rating</SubHeading>
                <SegmentedSelect
                  options={MATURITY_OPTIONS}
                  value={prefs.maturity}
                  onChange={(v) => updatePref("maturity", v)}
                  columns={2}
                />
                {prefs.maturity === "r18" && (
                  <p className="mt-2.5 text-[11px] text-red-300/80 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 leading-relaxed">
                    ⚠️ 18+ content will be shown. You confirm you are of legal age in your region.
                  </p>
                )}
              </div>

              {/* ── Language ── */}
              <div className="mb-6">
                <SubHeading>🌐 Preferred Language</SubHeading>
                <select
                  value={prefs.language}
                  onChange={(e) => updatePref("language", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors mb-2"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.id} value={l.id} className="bg-[#1c1c35]">
                      {l.flag} {l.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-white/60">Prefer dubbed audio</span>
                  <Toggle checked={prefs.dubPreferred} onChange={(v) => updatePref("dubPreferred", v)} />
                </div>
              </div>

              {/* ── Subtitles ── */}
              <div className="mb-6">
                <SubHeading>💬 Subtitles</SubHeading>
                <SegmentedSelect
                  options={SUBTITLE_OPTIONS}
                  value={prefs.subtitle}
                  onChange={(v) => updatePref("subtitle", v)}
                  columns={3}
                />
              </div>

              {/* ── Playback ── */}
              <div className="mb-6">
                <SubHeading>▶️ Playback Quality</SubHeading>
                <SegmentedSelect
                  options={PLAYBACK_QUALITY}
                  value={prefs.playbackQuality}
                  onChange={(v) => updatePref("playbackQuality", v)}
                  columns={2}
                />
                <div className="mt-2.5 space-y-1.5">
                  {[
                    { key: "autoplayNext",      label: "Autoplay next episode"       },
                    { key: "skipIntro",         label: "Skip intros automatically"    },
                    { key: "autoTrackProgress", label: "Auto-track watch progress"    },
                    { key: "dataSaver",         label: "Data saver mode"              },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-white/60">{label}</span>
                      <Toggle checked={!!prefs[key]} onChange={(v) => updatePref(key, v)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Content Filters ── */}
              <div className="mb-6">
                <SubHeading>🛡️ Content Filters</SubHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONTENT_FILTERS.map((f) => {
                    const active = prefs.contentFilters.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFilter(f.id)}
                        className={[
                          "text-left px-3 py-2.5 rounded-xl border text-xs transition-all",
                          active
                            ? "bg-violet-600/20 border-violet-500"
                            : "bg-white/[0.03] border-white/10 hover:border-white/25",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between">
                          <span className={active ? "font-medium text-white" : "font-medium text-white/70"}>
                            {f.label}
                          </span>
                          <span className={[
                            "w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] flex-shrink-0",
                            active ? "bg-violet-500 border-violet-500 text-white" : "border-white/20",
                          ].join(" ")}>
                            {active ? "✓" : ""}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{f.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Privacy ── */}
              <div>
                <SubHeading>🔐 Privacy</SubHeading>
                <div className="space-y-1.5">
                  {[
                    { key: "publicProfile",         label: "Public profile"                          },
                    { key: "showActivity",          label: "Show watching activity to others"        },
                    { key: "allowRecommendations",  label: "Allow personalised recommendations"      },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-white/60">{label}</span>
                      <Toggle checked={!!prefs[key]} onChange={(v) => updatePref(key, v)} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Supabase not configured notice */}
            {!configured && (
              <section className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                <p className="text-amber-300 text-xs font-general font-semibold uppercase tracking-wider mb-1.5">⚡ Supabase not configured</p>
                <p className="text-amber-200/60 text-sm leading-relaxed">
                  Add <code className="bg-white/10 px-1 rounded text-amber-300">VITE_SUPABASE_URL</code> and{" "}
                  <code className="bg-white/10 px-1 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> to your{" "}
                  <code className="bg-white/10 px-1 rounded">.env</code> to enable real stats, anime list, and cloud saves.
                </p>
              </section>
            )}
          </div>
        </div>

        {/* ══ GOJO NEWSLETTER ══ */}
        <div className="mt-6 rounded-3xl overflow-hidden relative bg-[#12122a] border border-white/[0.06] shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-stretch">
            <div className="flex-shrink-0 flex items-end justify-center md:justify-start md:pl-8 pt-6 md:pt-4">
              <img src="/img/profile/Gojo_Sensei.webp" alt="Gojo Sensei"
                className="h-52 md:h-64 object-contain object-bottom drop-shadow-2xl" />
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 md:py-10 md:pr-10 text-center md:text-left">
              <span className="inline-block bg-violet-600/15 border border-violet-500/25 text-violet-300 text-[10px] font-general uppercase tracking-widest px-3 py-1 rounded-full mb-3 mx-auto md:mx-0 w-fit">
                🌀 Gojo Sensei's Newsletter
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug mb-2">
                Stay in the Loop,{" "}
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  the Honored One's Way
                </span>
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-md mx-auto md:mx-0">
                "Throughout Heaven and Earth, I alone am the honored one." — Never miss a new release, power ranking update, or arc breakdown.
              </p>
              {!newsletterSent ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto md:mx-0">
                  <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com" required
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors" />
                  <button type="submit"
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all whitespace-nowrap">
                    Subscribe ✦
                  </button>
                </form>
              ) : (
                <p className="flex items-center gap-2 text-emerald-400 text-sm font-medium justify-center md:justify-start">
                  <span className="text-xl">✅</span> You're subscribed! Gojo-sensei is watching over your inbox.
                </p>
              )}
              <p className="text-white/20 text-[11px] font-general mt-3">No spam. Unsubscribe anytime. Even Infinity can be broken.</p>
            </div>
          </div>
        </div>

        {/* ══ EDIT PROFILE MODAL ══ */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <div className="relative w-full max-w-lg bg-[#1c1c35] border border-white/10 rounded-3xl shadow-2xl p-7 z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-white">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-white/30 hover:text-white text-xl leading-none transition-colors">✕</button>
              </div>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-1.5">Username</label>
                  <input type="text" value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="e.g. AnimeFan99"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-1.5">Age</label>
                  <input type="number" value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    placeholder="e.g. 21" min="1" max="120"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-2">Favourite Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => {
                      const sel = profile.favoriteGenres.includes(g);
                      return (
                        <button type="button" key={g} onClick={() => handleGenreToggle(g)}
                          className={[
                            "text-xs px-3 py-1.5 rounded-full border font-medium transition-all",
                            sel
                              ? "bg-violet-600 text-white border-violet-600"
                              : "bg-white/5 text-white/45 border-white/10 hover:border-violet-500/60 hover:text-white/80",
                          ].join(" ")}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current restrictions summary */}
                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-2">
                    Current Restrictions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-200">
                      Maturity: {MATURITY_OPTIONS.find((m) => m.id === prefs.maturity)?.label}
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      Lang: {LANGUAGE_OPTIONS.find((l) => l.id === prefs.language)?.label}
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      Filters: {prefs.contentFilters.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1.5">
                    Manage in the "Preferences &amp; Restrictions" panel.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button type="button"
                    onClick={() => {
                      setProfile({ username: userDetails?.username || "", age: userDetails?.age || "", favoriteGenres: userDetails?.favoriteGenres || [] });
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
