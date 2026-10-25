/**
 * context/SupabaseContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase integration context for Anime Sensei.
 *
 * Architecture decision
 * ─────────────────────
 * The app already uses Firebase Auth for sign-in (email + Google OAuth).
 * Rather than replace that, Supabase is added as a *data layer* alongside it.
 *
 * The link between the two systems is the Firebase UID:
 *   user_profiles.firebase_uid = auth.currentUser.uid
 *
 * This context:
 *   1. Holds the singleton Supabase client (created once, never re-created).
 *   2. Watches Firebase Auth state — when a user is signed in it calls
 *      ensureUserProfile() to upsert a Supabase profile row keyed by firebase_uid.
 *   3. Exposes `supabase`, `sbProfile`, `sbLoading`, `refreshProfile`,
 *      `applyProfileUpdate` to all consumers.
 *   4. Re-exports `isSupabaseConfigured` so the UI can degrade gracefully when
 *      the env vars are missing.
 *
 * Usage
 * ─────
 *   // Wrap once in App.jsx (inside Firebase provider, outside pages):
 *   <SupabaseProvider>…</SupabaseProvider>
 *
 *   // In any component:
 *   const { supabase, sbProfile, sbLoading } = useSupabase();
 */

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { auth } from '../firebase/firebase';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { ensureUserProfile, updateUserProfile } from '../lib/userProfile';

// ── Context ───────────────────────────────────────────────────────────────────
const SupabaseContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function SupabaseProvider({ children }) {
  // Create the singleton once — never re-create inside a render
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sbProfile,    setSbProfile]    = useState(null);
  const [sbLoading,    setSbLoading]    = useState(true);
  const configured = isSupabaseConfigured();

  // ── Fetch / create profile for the given Firebase UID ──────────────────
  const fetchProfile = useCallback(async (uid) => {
    if (!configured) { setSbLoading(false); return; }
    try {
      // Look up profile by firebase_uid (not Supabase auth.uid —
      // we're using Firebase Auth, so Supabase is in anon mode).
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('firebase_uid', uid)
        .maybeSingle();

      if (error) throw error;

      // First sign-in: create the profile row
      if (!data) {
        const { data: created, error: insertErr } = await supabase
          .from('user_profiles')
          .insert({ firebase_uid: uid })
          .select()
          .single();

        if (insertErr) throw insertErr;
        data = created;
      }

      setSbProfile(data);
    } catch (e) {
      console.error('[Supabase] profile load failed:', e?.message ?? e);
      setSbProfile(null);
    } finally {
      setSbLoading(false);
    }
  }, [supabase, configured]);

  // ── Listen to Firebase Auth state ─────────────────────────────────────
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      if (user) {
        setSbLoading(true);
        await fetchProfile(user.uid);
      } else {
        setSbProfile(null);
        setSbLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchProfile]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (firebaseUser) {
      setSbLoading(true);
      await fetchProfile(firebaseUser.uid);
    }
  }, [firebaseUser, fetchProfile]);

  /**
   * Optimistic local update — use before the async DB call so the UI
   * reflects the change instantly.
   * @param {Partial<object>} updates
   */
  const applyProfileUpdate = useCallback((updates) => {
    setSbProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  /**
   * Persist profile changes to Supabase and sync local state.
   * Looks up by firebase_uid since we're not using Supabase Auth.
   */
  const saveProfile = useCallback(async (updates) => {
    if (!sbProfile?.id) return;
    applyProfileUpdate(updates);           // optimistic
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('firebase_uid', firebaseUser?.uid);
      if (error) throw error;
    } catch (e) {
      // Revert on failure
      await refreshProfile();
      throw e;
    }
  }, [sbProfile, supabase, firebaseUser, applyProfileUpdate, refreshProfile]);

  const value = useMemo(() => ({
    supabase,
    firebaseUser,
    sbProfile,
    sbLoading,
    configured,
    refreshProfile,
    applyProfileUpdate,
    saveProfile,
  }), [supabase, firebaseUser, sbProfile, sbLoading, configured, refreshProfile, applyProfileUpdate, saveProfile]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabase must be used inside <SupabaseProvider>');
  return ctx;
}
