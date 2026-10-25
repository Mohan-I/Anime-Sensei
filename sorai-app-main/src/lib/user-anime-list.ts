import { SupabaseClient } from "@supabase/supabase-js";
import { AnimeStatus, UserAnimeListItem } from "@/types/anime";

export async function getUserAnimeList(
    supabase: SupabaseClient,
    userId: string
): Promise<UserAnimeListItem[]> {
    const { data, error } = await supabase
        .from("user_anime_list")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
}

export async function getUserAnimeItem(
    supabase: SupabaseClient,
    userId: string,
    malId: number
): Promise<UserAnimeListItem | null> {
    const { data, error } = await supabase
        .from("user_anime_list")
        .select("*")
        .eq("user_id", userId)
        .eq("mal_id", malId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function addAnimeToList(
    supabase: SupabaseClient,
    item: {
        user_id: string;
        mal_id: number;
        status: AnimeStatus;
        anime_title: string;
        anime_image_url: string | null;
        anime_year: number | null;
        anime_type: string | null;
    }
): Promise<UserAnimeListItem> {
    const { data, error } = await supabase
        .from("user_anime_list")
        .insert(item)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Statuses that should not have a score
const NO_SCORE_STATUSES: AnimeStatus[] = ["paused", "planned"];

export async function updateAnimeStatus(
    supabase: SupabaseClient,
    userId: string,
    malId: number,
    status: AnimeStatus
): Promise<void> {
    const updateData: { status: AnimeStatus; score?: null } = { status };

    // Clear score when moving to a status that shouldn't have one
    if (NO_SCORE_STATUSES.includes(status)) {
        updateData.score = null;
    }

    const { error } = await supabase
        .from("user_anime_list")
        .update(updateData)
        .eq("user_id", userId)
        .eq("mal_id", malId);

    if (error) throw error;
}

export async function updateAnimeScore(
    supabase: SupabaseClient,
    userId: string,
    malId: number,
    score: number
): Promise<void> {
    const { error } = await supabase
        .from("user_anime_list")
        .update({ score })
        .eq("user_id", userId)
        .eq("mal_id", malId);

    if (error) throw error;
}

export async function removeAnimeFromList(
    supabase: SupabaseClient,
    userId: string,
    malId: number
): Promise<void> {
    const { error } = await supabase
        .from("user_anime_list")
        .delete()
        .eq("user_id", userId)
        .eq("mal_id", malId);

    if (error) throw error;
}
