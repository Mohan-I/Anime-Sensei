/**
 * lib/userAnimeList.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service layer for the `user_anime_list` Supabase table.
 *
 * Design rules (matching the sorai-app-main reference):
 *  • Every function receives `supabase` as its first argument — no hidden
 *    singleton import. The caller (context / hook) owns the client.
 *  • On error: `if (error) throw error` — errors bubble, callers handle them.
 *  • `.maybeSingle()` for optional single rows (no throw on 0 rows).
 *  • `.single()` only when exactly one row is guaranteed (insert + select).
 *  • RLS in Postgres is the real security boundary; the `user_id` filters
 *    are a convenience / defence-in-depth layer on top.
 */

/** Statuses that must NOT have a score */
export const NO_SCORE_STATUSES = ['paused', 'planned'];

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch the full anime list for a user, ordered oldest-first.
 * @returns {Promise<object[]>}
 */
export async function getUserAnimeList(supabase, userId) {
  const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch a single list entry by mal_id. Returns null when not in the list.
 * @returns {Promise<object|null>}
 */
export async function getUserAnimeItem(supabase, userId, malId) {
  const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', userId)
    .eq('mal_id', malId)
    .maybeSingle();   // ← returns null (not an error) when row is missing

  if (error) throw error;
  return data;
}

/**
 * Fetch aggregated stats for the profile page from the stats view.
 * @returns {Promise<object|null>}
 */
export async function getUserAnimeStats(supabase, userId) {
  const { data, error } = await supabase
    .from('user_anime_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ── WRITE ─────────────────────────────────────────────────────────────────────

/**
 * Add an anime to the list with status "watching".
 * Returns the created row so callers can use it immediately.
 */
export async function addAnimeToList(supabase, {
  user_id,
  mal_id,
  status = 'watching',
  anime_title,
  anime_image_url = null,
  anime_year      = null,
  anime_type      = null,
  total_ep        = null,
}) {
  const { data, error } = await supabase
    .from('user_anime_list')
    .insert({ user_id, mal_id, status, anime_title, anime_image_url, anime_year, anime_type, total_ep })
    .select()
    .single();       // ← safe here: insert always returns exactly one row

  if (error) throw error;
  return data;
}

/**
 * Update the status. Automatically clears score for no-score statuses.
 */
export async function updateAnimeStatus(supabase, userId, malId, status) {
  const payload = { status };
  if (NO_SCORE_STATUSES.includes(status)) payload.score = null;

  const { error } = await supabase
    .from('user_anime_list')
    .update(payload)
    .eq('user_id', userId)
    .eq('mal_id', malId);

  if (error) throw error;
}

/**
 * Set a score (1–10). Validated by a DB CHECK constraint too.
 */
export async function updateAnimeScore(supabase, userId, malId, score) {
  const { error } = await supabase
    .from('user_anime_list')
    .update({ score })
    .eq('user_id', userId)
    .eq('mal_id', malId);

  if (error) throw error;
}

/**
 * Update episode progress.
 */
export async function updateAnimeProgress(supabase, userId, malId, progressEp) {
  const { error } = await supabase
    .from('user_anime_list')
    .update({ progress_ep: progressEp })
    .eq('user_id', userId)
    .eq('mal_id', malId);

  if (error) throw error;
}

/**
 * Remove an anime from the list entirely.
 */
export async function removeAnimeFromList(supabase, userId, malId) {
  const { error } = await supabase
    .from('user_anime_list')
    .delete()
    .eq('user_id', userId)
    .eq('mal_id', malId);

  if (error) throw error;
}
