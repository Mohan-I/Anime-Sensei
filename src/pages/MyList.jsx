/**
 * MyList.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full anime list page powered by Supabase.
 *
 * Features:
 *  • Grouped by status: Watching → Completed → Planned → Paused → Dropped
 *  • Inline status change (dropdown) with optimistic UI
 *  • Inline score change (1–10 stars) with optimistic UI
 *  • Episode progress increment (+1) with optimistic UI
 *  • Remove with undo-style toast
 *  • Client-side search / filter
 *  • Export list as JSON
 *  • Graceful empty state + Supabase-not-configured notice
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate }                 from "react-router-dom";
import { toast }                             from "react-toastify";
import { auth }                              from "../firebase/firebase";
import { useSupabase }                       from "../context/SupabaseContext";
import {
  getUserAnimeList,
  updateAnimeStatus,
  updateAnimeScore,
  updateAnimeProgress,
  removeAnimeFromList,
  NO_SCORE_STATUSES,
} from "../lib/userAnimeList";
import { exportUserData } from "../lib/userProfile";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_ORDER = ["watching", "completed", "planned", "paused", "dropped"];

const STATUS_META = {
  watching:  { label: "Watching",   icon: "▶",  color: "text-blue-400",    pill: "bg-blue-500/15 text-blue-300 border-blue-500/30"    },
  completed: { label: "Completed",  icon: "✅", color: "text-emerald-400", pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  planned:   { label: "Plan to Watch", icon: "📌", color: "text-yellow-400", pill: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  paused:    { label: "On Hold",    icon: "⏸",  color: "text-orange-400",  pill: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  dropped:   { label: "Dropped",    icon: "✕",  color: "text-red-400",     pill: "bg-red-500/15 text-red-300 border-red-500/30"     },
};

const SCORES = [1,2,3,4,5,6,7,8,9,10];

// ── Small helpers ─────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />
);

const StatusPill = ({ status }) => {
  const m = STATUS_META[status] ?? STATUS_META.watching;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-general uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.pill}`}>
      <span className="text-[9px]">{m.icon}</span>{m.label}
    </span>
  );
};

function EpBar({ ep = 0, total }) {
  if (!total) return null;
  const pct = Math.min(100, Math.round((ep / total) * 100));
  return (
    <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-500"
        style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Anime card ─────────────────────────────────────────────────────────────────
function AnimeCard({ item, onStatusChange, onScoreChange, onProgressChange, onRemove }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [scoreOpen,  setScoreOpen]  = useState(false);
  const canScore = !NO_SCORE_STATUSES.includes(item.status);

  return (
    <div className="group relative flex gap-3 bg-[#0d0d1a]/60 hover:bg-white/[0.04] rounded-xl p-3 transition-all border border-white/[0.04] hover:border-white/[0.08]">

      {/* Poster */}
      <Link to={`/anime/${item.mal_id}`} className="flex-shrink-0">
        <div className="w-14 h-[84px] sm:w-16 sm:h-24 rounded-lg overflow-hidden bg-white/5 shadow-md">
          {item.anime_image_url ? (
            <img src={item.anime_image_url} alt={item.anime_title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">🎌</div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link to={`/anime/${item.mal_id}`}
            className="text-sm font-semibold text-white hover:text-violet-300 transition-colors leading-snug line-clamp-2">
            {item.anime_title}
          </Link>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {item.anime_type && (
              <span className="text-[10px] text-white/30 font-general">{item.anime_type}</span>
            )}
            {item.anime_year && (
              <span className="text-[10px] text-white/30 font-general">{item.anime_year}</span>
            )}
          </div>
        </div>

        {/* Ep progress */}
        {item.status === "watching" && (
          <div className="mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/35 font-general tabular-nums">
                {item.total_ep ? `Ep ${item.progress_ep ?? 0} / ${item.total_ep}` : `Ep ${item.progress_ep ?? 0}`}
              </span>
              <button
                onClick={() => onProgressChange(item.mal_id, (item.progress_ep ?? 0) + 1)}
                className="text-[10px] bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 px-1.5 py-0.5 rounded font-general transition-colors leading-none"
                title="Mark next episode"
              >+1</button>
            </div>
            <EpBar ep={item.progress_ep ?? 0} total={item.total_ep} />
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => { setStatusOpen((v) => !v); setScoreOpen(false); }}
            className="flex items-center gap-1"
          >
            <StatusPill status={item.status} />
          </button>
          {statusOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-[#1c1c35] border border-white/10 rounded-xl shadow-2xl py-1 z-30">
              {STATUS_ORDER.map((s) => (
                <button key={s} onClick={() => { onStatusChange(item.mal_id, s); setStatusOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-general transition-colors hover:bg-white/5 flex items-center gap-2
                    ${item.status === s ? "text-violet-300" : "text-white/60"}`}>
                  <span>{STATUS_META[s].icon}</span>{STATUS_META[s].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Score */}
        {canScore && (
          <div className="relative">
            <button
              onClick={() => { setScoreOpen((v) => !v); setStatusOpen(false); }}
              className="text-[11px] font-general text-yellow-400 hover:text-yellow-300 transition-colors"
              title="Set score"
            >
              {item.score ? `★ ${item.score}` : <span className="text-white/25">Rate</span>}
            </button>
            {scoreOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#1c1c35] border border-white/10 rounded-xl shadow-2xl py-1.5 px-2 z-30">
                <p className="text-[9px] text-white/30 font-general uppercase mb-1 px-1">Score</p>
                <div className="grid grid-cols-5 gap-1">
                  {SCORES.map((s) => (
                    <button key={s} onClick={() => { onScoreChange(item.mal_id, s); setScoreOpen(false); }}
                      className={`text-xs py-1 rounded font-general transition-colors ${
                        item.score === s ? "bg-yellow-500/30 text-yellow-300" : "hover:bg-white/10 text-white/50"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Remove */}
        <button
          onClick={() => onRemove(item.mal_id, item.anime_title)}
          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-xs transition-all leading-none"
          title="Remove from list"
        >✕</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MyList Page
// ══════════════════════════════════════════════════════════════════════════════
export default function MyList() {
  const navigate  = useNavigate();
  const { supabase, firebaseUser, configured } = useSupabase();

  const [list,       setList]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState("all");  // "all" | status key
  const [exporting,  setExporting]  = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  // ── Fetch list ─────────────────────────────────────────────────────────
  const fetchList = useCallback(async () => {
    if (!configured || !firebaseUser) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getUserAnimeList(supabase, firebaseUser.uid);
      setList(data);
    } catch (e) {
      console.error("[MyList] fetch:", e?.message);
      toast.error("Could not load your list.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }, [configured, firebaseUser, supabase]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // ── Mutations — optimistic: mutate list, persist, revert on failure ────
  const handleStatusChange = useCallback(async (malId, status) => {
    setList((prev) => prev.map((item) =>
      item.mal_id === malId
        ? { ...item, status, score: NO_SCORE_STATUSES.includes(status) ? null : item.score }
        : item
    ));
    try {
      await updateAnimeStatus(supabase, firebaseUser.uid, malId, status);
    } catch {
      await fetchList(); // revert by refetch
      toast.error("Status update failed.", { position: "top-center" });
    }
  }, [supabase, firebaseUser, fetchList]);

  const handleScoreChange = useCallback(async (malId, score) => {
    setList((prev) => prev.map((item) => item.mal_id === malId ? { ...item, score } : item));
    try {
      await updateAnimeScore(supabase, firebaseUser.uid, malId, score);
    } catch {
      await fetchList();
      toast.error("Score update failed.", { position: "top-center" });
    }
  }, [supabase, firebaseUser, fetchList]);

  const handleProgressChange = useCallback(async (malId, progressEp) => {
    setList((prev) => prev.map((item) => item.mal_id === malId ? { ...item, progress_ep: progressEp } : item));
    try {
      await updateAnimeProgress(supabase, firebaseUser.uid, malId, progressEp);
    } catch {
      await fetchList();
      toast.error("Progress update failed.", { position: "top-center" });
    }
  }, [supabase, firebaseUser, fetchList]);

  const handleRemove = useCallback(async (malId, animeTitle) => {
    const prev = list;
    setList((p) => p.filter((item) => item.mal_id !== malId));
    try {
      await removeAnimeFromList(supabase, firebaseUser.uid, malId);
      toast.success(`"${animeTitle}" removed.`, { position: "top-center" });
    } catch {
      setList(prev);
      toast.error("Remove failed.", { position: "top-center" });
    }
  }, [list, supabase, firebaseUser]);

  const handleExport = useCallback(async () => {
    if (!configured || !firebaseUser) return;
    setExporting(true);
    try {
      const json = await exportUserData(supabase, firebaseUser.uid);
      if (!json) { toast.info("Your list is empty.", { position: "top-center" }); return; }
      const blob = new Blob([json], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), { href: url, download: "anime-list.json" });
      a.click();
      URL.revokeObjectURL(url);
      toast.success("List exported!", { position: "top-center" });
    } catch {
      toast.error("Export failed.", { position: "top-center" });
    } finally {
      setExporting(false);
    }
  }, [configured, firebaseUser, supabase]);

  // ── Derived ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let items = activeTab === "all" ? list : list.filter((i) => i.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.anime_title.toLowerCase().includes(q));
    }
    return items;
  }, [list, activeTab, search]);

  const grouped = useMemo(() => {
    if (activeTab !== "all") return [{ status: activeTab, items: filtered }];
    return STATUS_ORDER
      .map((s) => ({ status: s, items: filtered.filter((i) => i.status === s) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, activeTab]);

  const counts = useMemo(() =>
    STATUS_ORDER.reduce((acc, s) => ({ ...acc, [s]: list.filter((i) => i.status === s).length }), {}),
    [list]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Anime List</h1>
            <p className="text-white/35 text-sm font-general mt-1">
              {list.length} {list.length === 1 ? "series" : "series"} tracked
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/anime"
              className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-general font-medium px-4 py-2 rounded-full transition-all">
              + Add Anime
            </Link>
            <button onClick={handleExport} disabled={exporting || !configured}
              className="bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-white text-xs font-general font-medium px-4 py-2 rounded-full transition-all active:scale-95">
              {exporting ? "Exporting…" : "⬇ Export JSON"}
            </button>
          </div>
        </div>

        {/* Not configured */}
        {!configured && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
            <p className="text-amber-300 text-xs font-general font-semibold uppercase tracking-wider mb-1.5">⚡ Supabase not configured</p>
            <p className="text-amber-200/60 text-sm">
              Add <code className="bg-white/10 px-1 rounded text-amber-300">VITE_SUPABASE_URL</code> and{" "}
              <code className="bg-white/10 px-1 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> to your{" "}
              <code className="bg-white/10 px-1 rounded">.env</code> file.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your list…"
            className="w-full bg-[#12122a] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm transition-colors">✕</button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {[["all", "All", list.length], ...STATUS_ORDER.map((s) => [s, STATUS_META[s].label, counts[s]])].map(([key, label, count]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`text-xs font-general px-3 py-1.5 rounded-full border transition-all ${
                activeTab === key
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white/5 text-white/45 border-white/10 hover:border-violet-500/50 hover:text-white/80"
              }`}>
              {label} {count > 0 && <span className="ml-0.5 opacity-60">({count})</span>}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#12122a]">
                <Skeleton className="w-14 h-20 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2 w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <span className="text-6xl">🎌</span>
            <div>
              <p className="text-white/40 text-base font-semibold mb-1">
                {search ? "No results found" : "Your list is empty"}
              </p>
              <p className="text-white/20 text-sm">
                {search ? "Try a different search term" : "Start adding anime from the Browse page"}
              </p>
            </div>
            {!search && (
              <Link to="/anime"
                className="mt-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-general font-medium px-6 py-2.5 rounded-full transition-all active:scale-95">
                Browse Anime
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ status, items }) => (
              <div key={status}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-base ${STATUS_META[status]?.color}`}>{STATUS_META[status]?.icon}</span>
                  <h2 className="text-sm font-semibold text-white/70 font-general uppercase tracking-wider">
                    {STATUS_META[status]?.label}
                  </h2>
                  <span className="text-xs text-white/25 font-general">({items.length})</span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <AnimeCard
                      key={item.id}
                      item={item}
                      onStatusChange={handleStatusChange}
                      onScoreChange={handleScoreChange}
                      onProgressChange={handleProgressChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
