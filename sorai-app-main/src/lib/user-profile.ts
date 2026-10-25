import { SupabaseClient } from "@supabase/supabase-js";

export interface UserProfile {
    id: string;
    avatar_url: string | null;
    show_sensitive_content: boolean;
    theme_preference: "light" | "dark" | null;
    deactivated_at: string | null;
    created_at: string;
    updated_at: string;
}

export async function getUserProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function ensureUserProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<UserProfile> {
    const existing = await getUserProfile(supabase, userId);
    if (existing) return existing;

    const { data, error } = await supabase
        .from("user_profiles")
        .insert({ id: userId })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateUserProfile(
    supabase: SupabaseClient,
    userId: string,
    updates: Partial<Pick<UserProfile, "avatar_url" | "show_sensitive_content" | "theme_preference">>
): Promise<void> {
    const { error } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId);

    if (error) throw error;
}

export async function uploadAvatar(
    supabase: SupabaseClient,
    userId: string,
    file: File
): Promise<string> {
    const ext = file.name.split(".").pop() || "png";
    const filePath = `${userId}/avatar.${ext}`;

    // Remove old avatar if exists
    await supabase.storage.from("avatars").remove([filePath]);

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    // Add cache-busting param
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    // Save URL to profile
    await updateUserProfile(supabase, userId, { avatar_url: publicUrl });

    return publicUrl;
}

export async function removeAvatar(
    supabase: SupabaseClient,
    userId: string
): Promise<void> {
    // List files in user folder and remove them
    const { data: files } = await supabase.storage
        .from("avatars")
        .list(userId);

    if (files && files.length > 0) {
        const filePaths = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(filePaths);
    }

    await updateUserProfile(supabase, userId, { avatar_url: null });
}

export async function exportUserData(
    supabase: SupabaseClient,
    userId: string
): Promise<string | null> {
    const { data: animeList, error } = await supabase
        .from("user_anime_list")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) throw error;

    if (!animeList || animeList.length === 0) return null;

    const NO_SCORE_STATUSES = ["paused", "planned"];

    const exportData = animeList.map((item) => ({
        title: item.anime_title,
        status: item.status,
        score: NO_SCORE_STATUSES.includes(item.status) ? null : item.score,
        type: item.anime_type,
        year: item.anime_year,
        added_at: item.created_at?.split("T")[0] ?? null,
    }));

    return JSON.stringify(exportData, null, 2);
}

export async function deactivateAccount(
    supabase: SupabaseClient,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from("user_profiles")
        .update({
            deactivated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw error;

    await supabase.auth.signOut();
}
