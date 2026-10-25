/**
 * lib/userProfile.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service layer for the `user_profiles` Supabase table.
 *
 * Same contract as userAnimeList.js: client-injected, throw-on-error,
 * no React, no state — pure async functions.
 */

// ── READ ──────────────────────────────────────────────────────────────────────

/** Fetch an existing profile or return null. */
export async function getUserProfile(supabase, userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Fetch profile, creating a blank row if one doesn't exist yet.
 * This is the "ensure" pattern from the reference implementation.
 */
export async function ensureUserProfile(supabase, userId) {
  const existing = await getUserProfile(supabase, userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({ id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── WRITE ─────────────────────────────────────────────────────────────────────

/**
 * Partial update — only supply the keys you want to change.
 * `updated_at` is stamped automatically by the DB trigger.
 *
 * @param {object} updates  Any subset of:
 *   username, display_name, avatar_url, banner_idx,
 *   favorite_genres (string[]), age, last_visited, preferences,
 *   subscription
 */
export async function updateUserProfile(supabase, userId, updates) {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

// ── AVATAR STORAGE ────────────────────────────────────────────────────────────

/**
 * Upload an avatar File to the `avatars` Storage bucket and save the
 * public URL back to the profile.
 *
 * Storage bucket setup (do once in Supabase Dashboard):
 *   Storage → New bucket → name: "avatars" → Public: true
 *
 * @param {File}   file
 * @returns {Promise<string>}  The new public URL
 */
export async function uploadAvatar(supabase, userId, file) {
  const ext      = file.name.split('.').pop() || 'png';
  const filePath = `${userId}/avatar.${ext}`;

  // Remove old avatar first (upsert handles it, but explicit remove avoids orphans)
  await supabase.storage.from('avatars').remove([filePath]);

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  // Cache-bust so browsers don't serve a stale avatar
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  await updateUserProfile(supabase, userId, { avatar_url: publicUrl });
  return publicUrl;
}

/** Remove the user's avatar from Storage and clear the profile URL. */
export async function removeAvatar(supabase, userId) {
  const { data: files } = await supabase.storage.from('avatars').list(userId);
  if (files?.length) {
    const paths = files.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from('avatars').remove(paths);
  }
  await updateUserProfile(supabase, userId, { avatar_url: null });
}

// ── DATA EXPORT ───────────────────────────────────────────────────────────────

/**
 * Export a user's entire list as a formatted JSON string.
 * Returns null when the list is empty.
 */
export async function exportUserData(supabase, userId) {
  const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!data?.length) return null;

  const NO_SCORE = ['paused', 'planned'];
  const exportData = data.map((item) => ({
    title:    item.anime_title,
    status:   item.status,
    score:    NO_SCORE.includes(item.status) ? null : item.score,
    progress: item.progress_ep,
    type:     item.anime_type,
    year:     item.anime_year,
    added_at: item.created_at?.split('T')[0] ?? null,
  }));

  return JSON.stringify(exportData, null, 2);
}
