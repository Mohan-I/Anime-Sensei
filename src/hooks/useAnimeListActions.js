/**
 * hooks/useAnimeListActions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised hook for anime-list CRUD with optimistic updates.
 *
 * Architecture (mirrors sorai-app-main/src/hooks/useAnimeListActions.ts):
 *  • Holds a single `userListItem` state — the current row for one anime.
 *  • Every mutation optimistically updates local state first, then persists
 *    to Supabase. On failure it restores the previous value and toasts.
 *  • The caller passes `supabase` (from useSupabase()) so this hook has
 *    zero coupling to the context — pure, testable, composable.
 *
 * Usage
 * ─────
 *   const { supabase, firebaseUser } = useSupabase();
 *   const {
 *     userListItem, setUserListItem, actionLoading,
 *     handleAddToList, handleStatusChange, handleScoreChange, handleRemove,
 *   } = useAnimeListActions(supabase, firebaseUser?.uid);
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  addAnimeToList,
  updateAnimeStatus,
  updateAnimeScore,
  updateAnimeProgress,
  removeAnimeFromList,
  NO_SCORE_STATUSES,
} from '../lib/userAnimeList';

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string|undefined} userId  — Firebase UID (used as user_id FK)
 * @param {{ onMutate?: () => void }} [options]
 */
export function useAnimeListActions(supabase, userId, options = {}) {
  const [userListItem,  setUserListItem]  = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Add ─────────────────────────────────────────────────────────────────
  const handleAddToList = useCallback(async ({
    mal_id,
    anime_title,
    anime_image_url = null,
    anime_year      = null,
    anime_type      = null,
    total_ep        = null,
  }) => {
    if (!userId) return;
    setActionLoading(true);
    try {
      const newItem = await addAnimeToList(supabase, {
        user_id: userId,
        mal_id,
        status: 'watching',
        anime_title,
        anime_image_url,
        anime_year,
        anime_type,
        total_ep,
      });
      setUserListItem(newItem);
      toast.success(`"${anime_title}" added to your list! 🎌`, { position: 'top-center' });
      options.onMutate?.();
    } catch (e) {
      toast.error('Could not add to list. Try again.', { position: 'top-center' });
      console.error('[useAnimeListActions] addAnimeToList:', e?.message ?? e);
    } finally {
      setActionLoading(false);
    }
  }, [supabase, userId, options]);

  // ── Status change (optimistic) ──────────────────────────────────────────
  const handleStatusChange = useCallback(async (malId, status) => {
    if (!userId) return;
    const prev = userListItem;

    // Optimistic update — clear score when moving to a no-score status
    setUserListItem((cur) =>
      cur ? {
        ...cur,
        status,
        score: NO_SCORE_STATUSES.includes(status) ? null : cur.score,
      } : cur
    );

    try {
      await updateAnimeStatus(supabase, userId, malId, status);
      options.onMutate?.();
    } catch (e) {
      setUserListItem(prev);               // revert
      toast.error('Status update failed.', { position: 'top-center' });
      console.error('[useAnimeListActions] updateAnimeStatus:', e?.message ?? e);
    }
  }, [supabase, userId, userListItem, options]);

  // ── Score change (optimistic) ───────────────────────────────────────────
  const handleScoreChange = useCallback(async (malId, score) => {
    if (!userId) return;
    const prev = userListItem;
    setUserListItem((cur) => (cur ? { ...cur, score } : cur));

    try {
      await updateAnimeScore(supabase, userId, malId, score);
      options.onMutate?.();
    } catch (e) {
      setUserListItem(prev);
      toast.error('Score update failed.', { position: 'top-center' });
      console.error('[useAnimeListActions] updateAnimeScore:', e?.message ?? e);
    }
  }, [supabase, userId, userListItem, options]);

  // ── Progress change (optimistic) ────────────────────────────────────────
  const handleProgressChange = useCallback(async (malId, progressEp) => {
    if (!userId) return;
    const prev = userListItem;
    setUserListItem((cur) => (cur ? { ...cur, progress_ep: progressEp } : cur));

    try {
      await updateAnimeProgress(supabase, userId, malId, progressEp);
      options.onMutate?.();
    } catch (e) {
      setUserListItem(prev);
      toast.error('Progress update failed.', { position: 'top-center' });
      console.error('[useAnimeListActions] updateAnimeProgress:', e?.message ?? e);
    }
  }, [supabase, userId, userListItem, options]);

  // ── Remove (optimistic) ─────────────────────────────────────────────────
  const handleRemove = useCallback(async (malId, animeTitle) => {
    if (!userId) return;
    const prev = userListItem;
    setUserListItem(null);                 // optimistic clear

    try {
      await removeAnimeFromList(supabase, userId, malId);
      toast.success(`"${animeTitle || 'Anime'}" removed from your list.`, { position: 'top-center' });
      options.onMutate?.();
    } catch (e) {
      setUserListItem(prev);               // revert
      toast.error('Could not remove. Try again.', { position: 'top-center' });
      console.error('[useAnimeListActions] removeAnimeFromList:', e?.message ?? e);
    }
  }, [supabase, userId, userListItem, options]);

  return {
    userListItem,
    setUserListItem,
    actionLoading,
    handleAddToList,
    handleStatusChange,
    handleScoreChange,
    handleProgressChange,
    handleRemove,
  };
}
