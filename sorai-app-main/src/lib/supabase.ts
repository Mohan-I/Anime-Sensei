import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Singleton Supabase client.
 *
 * `createSupabaseClient` always returns a new instance, but we only need
 * one per browser tab. This lazy singleton avoids creating multiple
 * instances across pages and components.
 */
let _client: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
    if (!_client) {
        _client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
    return _client;
}

/**
 * @deprecated Use `getSupabaseClient()` instead. Kept for backward compat.
 */
export function createClient() {
    return getSupabaseClient();
}

export function isSupabaseConfigured(): boolean {
    return (
        !!supabaseUrl &&
        supabaseUrl !== "tu_url_de_supabase" &&
        supabaseUrl.startsWith("https://") &&
        !!supabaseAnonKey &&
        supabaseAnonKey !== "tu_anon_key_de_supabase"
    );
}
