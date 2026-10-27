/**
 * context/SupabaseContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase data-layer context for Anime Sensei (Firebase Auth app).
 *
 * Architecture
 * ─────────────
 * Identity provider : Firebase Auth
 * Data layer        : Supabase (anon key, no Supabase Auth session)
 *
 * `user_profiles.id`     = Firebase UID  (TEXT primary key)
 * `user_anime_list.user_id` = Firebase UID (TEXT)
 *
 * RLS policies are set to `true` on both tables — the anon key has no
 * ability to run arbitrary SQL, and every query already filters by the
 * Firebase UID in the WHERE clause, so only that user's rows are returned.
 */

import {
  createContext, useContext, useEffect,
  useState, useCallback, useMemo,
} from 'react';
import { auth }                          from '../firebase/firebase';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const supabase   = useMemo(() => getSupabaseClient(), []);
  const configured = isSupabaseConfigured();

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sbProfile,    setSbProfile]    = useState(null);
  const [sbLoading,    setSbLoading]    = useState(true);

  // ── Fetch / upsert profile row keyed by Firebase UID ──────────────────
  const fetchProfile = useCallback(async (uid) => {
    if (!configured) { setSbLoading(false); return; }
    try {
      // Try to load existing row
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', uid)          // id IS the Firebase UID (TEXT)
        .maybeSingle();

      if (error) throw error;

      // First login — create the row
      if (!data) {
        const res = await supabase
          .from('user_profiles')
          .insert({ id: uid })
          .select()
          .single();
        if (res.error) throw res.error;
        data = res.data;
      }

      setSbProfile(data);
    } catch (e) {
      console.error('[Supabase] profile load failed:', e?.message ?? e);
      setSbProfile(null);
    } finally {
      setSbLoading(false);
    }
  }, [supabase, configured]);

  // ── Watch Firebase Auth ────────────────────────────────────────────────
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      if (user) {
        setSbLoading(true);
        await fetchProfile(user.uid);
      } else {
        setSbProfile(null);
        setSbLoading(false);
      }
    });
    return () => unsub();
  }, [fetchProfile]);

  // ── Optimistic local update ────────────────────────────────────────────
  const applyProfileUpdate = useCallback((updates) => {
    setSbProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (firebaseUser) { setSbLoading(true); await fetchProfile(firebaseUser.uid); }
  }, [firebaseUser, fetchProfile]);

  // ── Persist profile changes ────────────────────────────────────────────
  const saveProfile = useCallback(async (updates) => {
    if (!firebaseUser?.uid) return;
    applyProfileUpdate(updates);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', firebaseUser.uid);
      if (error) throw error;
    } catch (e) {
      await refreshProfile();   // revert on failure
      throw e;
    }
  }, [supabase, firebaseUser, applyProfileUpdate, refreshProfile]);

  const value = useMemo(() => ({
    supabase,
    firebaseUser,
    sbProfile,
    sbLoading,
    configured,
    refreshProfile,
    applyProfileUpdate,
    saveProfile,
  }), [supabase, firebaseUser, sbProfile, sbLoading, configured,
       refreshProfile, applyProfileUpdate, saveProfile]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabase must be used inside <SupabaseProvider>');
  return ctx;
}
