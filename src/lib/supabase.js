/**
 * lib/supabase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lazy singleton Supabase browser client.
 *
 * createClient() from @supabase/supabase-js always returns a NEW instance, so
 * we cache the first one in a module-level variable — one client per browser
 * tab, no matter how many components call getSupabaseClient().
 *
 * Env vars (set in .env):
 *   VITE_SUPABASE_URL       — your project URL  (https://xyz.supabase.co)
 *   VITE_SUPABASE_ANON_KEY  — anon/public key   (safe to ship to browsers)
 *
 * The service-role key MUST stay server-side only (Supabase Edge Function).
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let _client = null;

/**
 * Returns the singleton Supabase client.
 * Safe to call from any component or service function.
 */
export function getSupabaseClient() {
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Store session in localStorage so it survives page reloads.
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}

/**
 * Guard: returns true only when both env vars are present and non-placeholder.
 * Use this to conditionally render Supabase-dependent UI.
 */
export function isSupabaseConfigured() {
  return (
    !!supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('YOUR_PROJECT_ID') &&
    !!supabaseAnonKey &&
    !supabaseAnonKey.includes('YOUR_ANON_KEY')
  );
}
