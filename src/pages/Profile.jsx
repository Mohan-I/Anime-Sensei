import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

// ── Constants ─────────────────────────────────────────────────────────────────
const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mecha", "Mystery", "Romance", "Sci-Fi",
  "Slice of Life", "Shounen", "Seinen", "Psychological", "Sports", "Supernatural",
];

const BANNER_OPTIONS = [
  { id: 1, src: "/img/profile/profile_bg (1).webp", label: "Mountain Dusk"  },
  { id: 2, src: "/img/profile/profile_bg (2).webp", label: "Sakura Valley"  },
  { id: 3, src: "/img/profile/profile_bg (3).webp", label: "Night City"     },
];

const MOCK_STATS = {
  watchedAnime: 245,
  completed:    180,
  episodes:     3450,
  totalTime:    "84d 12h",
};

const MOCK_CURRENTLY_WATCHING = [
  { title: "Jujutsu Kaisen Season 2", ep: 15, total: 23, img: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg"  },
  { title: "Chainsaw Man",             ep: 8,  total: 12, img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"  },
  { title: "SPY x FAMILY Part 2",      ep: 10, total: 13, img: "https://cdn.myanimelist.net/images/anime/1416/138986.jpg"  },
  { title: "Attack on Titan Final",    ep: 6,  total: 9,  img: "https://cdn.myanimelist.net/images/anime/1460/110913.jpg"  },
];

const MOCK_FAVORITES = [
  { title: "Demon Slayer",  img: "/categories/wallpapers/demonslay.webp"  },
  { title: "JJK",           img: "/categories/wallpapers/jjk.webp"        },
  { title: "Death Note",    img: "/categories/wallpapers/deathnote.webp"  },
  { title: "Black Clover",  img: "/categories/wallpapers/blackclover.webp"},
  { title: "Naruto",        img: "/categories/wallpapers/naruto.webp"     },
  { title: "Tokyo Ghoul",   img: "/categories/wallpapers/tokyoghoul.webp" },
];

// ── Tiny reusable pieces ──────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h2 className="text-[10px] font-general font-semibold uppercase tracking-[0.15em] text-white/35 mb-4">
    {children}
  </h2>
);

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-0.5 py-2">
    <span className="text-lg leading-none">{icon}</span>
    <span className="text-white font-bold text-base leading-tight mt-0.5">{value}</span>
    <span className="text-[10px] font-general uppercase text-white/35 tracking-wider">{label}</span>
  </div>
);

const EpBar = ({ ep, total }) => {
  const pct = Math.min(100, Math.round((ep / total) * 100));
  return (
    <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-2xl ${className}`} />
);

// ── Banner picker — rendered via portal so overflow:hidden never clips it ─────
function BannerPicker({ anchorRef, open, onClose, bannerIdx, onSelect }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setRect(r);
  }, [open, anchorRef]);

  // Close on outside click / scroll
  useEffect(() => {
    if (!open) return;
    const close = () => onClose();
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll",      close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll",      close, true);
    };
  }, [open, onClose]);

  if (!open || !rect) return null;

  const style = {
    position: "fixed",
    top:  rect.bottom + 8,
    right: window.innerWidth - rect.right,
    zIndex: 9999,
    width: 256,
  };

  return createPortal(
    <div
      style={style}
      onMouseDown={(e) => e.stopPropagation()} // don't close when clicking inside
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
            className={`w-full relative rounded-xl overflow-hidden border-2 transition-all duration-150 ${
              bannerIdx === i
                ? "border-violet-500 ring-1 ring-violet-500/40"
                : "border-transparent hover:border-white/25"
            }`}
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
  const [userDetails,     setUserDetails]     = useState(null);
  const [profile,         setProfile]         = useState({ username: "", age: "", favoriteGenres: [] });
  const [isEditing,       setIsEditing]       = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [loading,         setLoading]         = useState(true);
  const [bannerIdx,       setBannerIdx]       = useState(0);
  const [pickerOpen,      setPickerOpen]      = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent,  setNewsletterSent]  = useState(false);

  const bannerBtnRef = useRef(null);
  const navigate     = useNavigate();

  // ── Auth guard + data ──────────────────────────────────────────────────
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
      } catch (e) { console.error("Profile load:", e); }
      finally { setLoading(false); }
    });
    return () => unsub();
  }, [navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────
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
    if (user) await setDoc(doc(db, "Users", user.uid), { bannerIdx: idx }, { merge: true });
  }, []);

  const handleLogout = async () => { await auth.signOut(); navigate("/login"); };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    toast.success("Subscribed! Gojo-sensei is watching over your inbox. 👁️", { position: "top-center" });
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
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

  const displayName    = userDetails?.username || userDetails?.firstName || "Anime Fan";
  const memberSince    = userDetails?.createdAt
    ? new Date(userDetails.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Jan 2024";
  const favoriteGenres = userDetails?.favoriteGenres ?? [];
  const currentBanner  = BANNER_OPTIONS[bannerIdx];

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">

        {/* ══════════════════════════════════════════════
            HERO  —  banner + avatar (no overflow:hidden so picker isn't clipped)
        ══════════════════════════════════════════════ */}
        <div className="relative mb-8 rounded-2xl shadow-2xl">

          {/* Banner image — its own container with rounded corners + overflow clip */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={currentBanner.src}
              alt="Profile banner"
              className="w-full h-44 sm:h-56 object-cover object-center transition-all duration-500"
            />
            {/* Bottom fade so avatar area blends in */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/20 to-transparent pointer-events-none" />

            {/* Change-banner button — anchored here, picker rendered via portal */}
            <div className="absolute top-3 right-3">
              <button
                ref={bannerBtnRef}
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white text-xs font-general px-3 py-1.5 rounded-full border border-white/15 transition-all active:scale-95"
              >
                <span>🖼</span>
                <span>Change Banner</span>
              </button>
            </div>
          </div>

          {/* Avatar + info — sits over the fade, outside overflow:hidden */}
          <div className="px-5 sm:px-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={userDetails?.photo || "/img/avatar-default.png"}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-violet-500 object-cover shadow-xl bg-[#1a1a2e]"
                onError={(e) => { e.target.src = "/img/avatar-default.png"; }}
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0d0d1a]" />
            </div>

            {/* Name + member since */}
            <div className="flex-1 pb-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">@{displayName}</h1>
              <p className="text-white/45 text-xs font-general mt-0.5">Member since {memberSince}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pb-1 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-general font-medium px-4 py-1.5 rounded-full transition-all"
              >
                ✏ Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/8 hover:bg-red-500/25 border border-white/10 text-white text-xs font-general font-medium px-4 py-1.5 rounded-full transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Portal-rendered banner picker — never clipped */}
        <BannerPicker
          anchorRef={bannerBtnRef}
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          bannerIdx={bannerIdx}
          onSelect={handleBannerSelect}
        />

        {/* ══════════════════════════════════════════════
            MAIN GRID  —  left (1 col) + right (2 cols)
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="space-y-5">

            {/* FAVORITE ANIME — 2×3 poster grid */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>Favorite Anime</SectionHeading>
              <div className="grid grid-cols-3 gap-2">
                {MOCK_FAVORITES.map((a) => (
                  <div key={a.title} className="group relative rounded-lg overflow-hidden aspect-[2/3] cursor-pointer shadow-md">
                    <img
                      src={a.img}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("bg-white/10");
                      }}
                    />
                    {/* Title tooltip on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                      <span className="text-[9px] font-general text-white leading-tight line-clamp-2">{a.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MY STATS */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>My Stats</SectionHeading>

              {/* Genre list */}
              <div className="flex items-start gap-2.5 mb-5">
                <span className="text-violet-400 flex-shrink-0 mt-0.5">👁</span>
                <div>
                  <p className="text-[10px] font-general uppercase text-white/30 mb-1.5 tracking-wider">Watch Anime</p>
                  {(favoriteGenres.length ? favoriteGenres : ["Action","Shonen","Fantasy","Comedy","Sci-Fi"])
                    .slice(0, 5)
                    .map((g) => (
                      <p key={g} className="text-sm text-white/75 leading-relaxed">{g}</p>
                    ))}
                </div>
              </div>

              {/* 2×2 numeric stat boxes */}
              <div className="grid grid-cols-2 gap-1 border-t border-white/[0.06] pt-4">
                <StatBox icon="🎯" label="Watched"   value={MOCK_STATS.watchedAnime}             />
                <StatBox icon="✅" label="Completed" value={MOCK_STATS.completed}                />
                <StatBox icon="📺" label="Episodes"  value={MOCK_STATS.episodes.toLocaleString()}/>
                <StatBox icon="⏱" label="Total Time" value={MOCK_STATS.totalTime}               />
              </div>
            </section>

            {/* FAVORITE GENRES */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>Favorite Genres</SectionHeading>
              {(favoriteGenres.length ? favoriteGenres : ["Action","Shonen","Fantasy","Comedy","Sci-Fi"]).map((g) => (
                <div key={g} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">{g}</span>
                </div>
              ))}
            </section>

          </div>

          {/* ── RIGHT COLUMN (2/3 width) ─────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* CURRENTLY WATCHING — full width on the right */}
            <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5">
              <SectionHeading>Currently Watching</SectionHeading>
              <div className="space-y-3">
                {MOCK_CURRENTLY_WATCHING.map((item) => (
                  <div key={item.title} className="flex items-center gap-3.5 group">
                    <div className="flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-white/5 shadow">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate leading-snug">{item.title}</p>
                      <EpBar ep={item.ep} total={item.total} />
                    </div>
                    <span className="flex-shrink-0 text-[11px] text-white/35 font-general tabular-nums">
                      Ep {item.ep} / {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* LAST VISITED */}
            {userDetails?.lastWatched?.animeId ? (
              <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5 flex gap-4 items-start">
                <img
                  src={userDetails.lastWatched.image}
                  alt={userDetails.lastWatched.title}
                  className="w-14 h-20 object-cover rounded-lg shadow flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-general uppercase tracking-widest text-violet-400 mb-1">Last Visited</p>
                  <p className="text-sm font-semibold text-white leading-snug mb-3 truncate">{userDetails.lastWatched.title}</p>
                  <Link
                    to={`/anime/${userDetails.lastWatched.animeId}`}
                    className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-general px-4 py-1.5 rounded-full transition-all active:scale-95"
                  >
                    Continue Watching →
                  </Link>
                </div>
              </section>
            ) : (
              <section className="bg-[#12122a] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-center min-h-[100px]">
                <div className="text-center">
                  <p className="text-white/25 text-sm mb-2">No anime visited yet.</p>
                  <Link to="/anime" className="text-violet-400 hover:text-violet-300 text-xs font-general transition-colors">
                    Browse Anime →
                  </Link>
                </div>
              </section>
            )}

          </div>
        </div>

        {/* ══════════════════════════════════════════════
            GOJO SENSEI NEWSLETTER
        ══════════════════════════════════════════════ */}
        <div className="mt-6 rounded-3xl overflow-hidden relative bg-[#12122a] border border-white/[0.06] shadow-2xl">
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-stretch">

            {/* Gojo image */}
            <div className="flex-shrink-0 flex items-end justify-center md:justify-start md:pl-8 pt-6 md:pt-4">
              <img
                src="/img/profile/Gojo_Sensei.webp"
                alt="Gojo Sensei"
                className="h-52 md:h-64 object-contain object-bottom drop-shadow-2xl"
              />
            </div>

            {/* Text + form */}
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
                "Throughout Heaven and Earth, I alone am the honored one." — Never miss a new
                release, power ranking update, or arc breakdown. No spoilers. Unless you want them.
              </p>

              {!newsletterSent ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto md:mx-0">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all whitespace-nowrap"
                  >
                    Subscribe ✦
                  </button>
                </form>
              ) : (
                <p className="flex items-center gap-2 text-emerald-400 text-sm font-medium justify-center md:justify-start">
                  <span className="text-xl">✅</span>
                  You're subscribed! Gojo-sensei is watching over your inbox.
                </p>
              )}

              <p className="text-white/20 text-[11px] font-general mt-3">
                No spam. Unsubscribe anytime. Even Infinity can be broken — so can this subscription.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            EDIT PROFILE MODAL
        ══════════════════════════════════════════════ */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <div className="relative w-full max-w-lg bg-[#1c1c35] border border-white/10 rounded-3xl shadow-2xl p-7 z-10 max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-white">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-white/30 hover:text-white text-xl leading-none transition-colors"
                >✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="e.g. AnimeFan99"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    placeholder="e.g. 21"
                    min="1" max="120"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-general uppercase tracking-widest text-white/35 mb-2">Favorite Genres</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => {
                      const sel = profile.favoriteGenres.includes(g);
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => handleGenreToggle(g)}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                            sel
                              ? "bg-violet-600 text-white border-violet-600"
                              : "bg-white/5 text-white/45 border-white/10 hover:border-violet-500/60 hover:text-white/80"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile({ username: userDetails?.username || "", age: userDetails?.age || "", favoriteGenres: userDetails?.favoriteGenres || [] });
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                  >
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
