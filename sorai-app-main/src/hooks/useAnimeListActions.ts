import { useState } from "react";
import { toast } from "sonner";
import { SupabaseClient } from "@supabase/supabase-js";
import {
    addAnimeToList,
    updateAnimeStatus,
    updateAnimeScore,
    removeAnimeFromList,
} from "@/lib/user-anime-list";
import { AnimeStatus, UserAnimeListItem } from "@/types/anime";
import { NO_SCORE_STATUSES } from "@/constants/anime-status";

interface AddAnimePayload {
    mal_id: number;
    anime_title: string;
    anime_image_url: string | null;
    anime_year: number | null;
    anime_type: string | null;
}

interface UseAnimeListActionsOptions {
    /** Called after any mutation so the consumer can reload data if needed. */
    onMutate?: () => void;
}

/**
 * Centralised hook for anime-list CRUD operations.
 *
 * It manages `userListItem` state internally and exposes optimistic-update
 * handlers that can be consumed from both the detail page and the list page.
 */
export function useAnimeListActions(
    supabase: SupabaseClient,
    userId: string | undefined,
    options?: UseAnimeListActionsOptions,
) {
    const [userListItem, setUserListItem] = useState<UserAnimeListItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleAddToList = async (payload: AddAnimePayload) => {
        if (!userId) return;

        setActionLoading(true);
        try {
            const newItem = await addAnimeToList(supabase, {
                user_id: userId,
                mal_id: payload.mal_id,
                status: "watching",
                anime_title: payload.anime_title,
                anime_image_url: payload.anime_image_url,
                anime_year: payload.anime_year,
                anime_type: payload.anime_type,
            });
            setUserListItem(newItem);
        } catch {
            // Silent
        }
        setActionLoading(false);
    };

    const handleStatusChange = async (malId: number, status: AnimeStatus) => {
        if (!userId) return;
        const prev = userListItem;
        setUserListItem((current) =>
            current
                ? {
                    ...current,
                    status,
                    score: NO_SCORE_STATUSES.includes(status) ? null : current.score,
                }
                : current
        );

        try {
            await updateAnimeStatus(supabase, userId, malId, status);
            options?.onMutate?.();
        } catch {
            setUserListItem(prev);
        }
    };

    const handleScoreChange = async (malId: number, score: number) => {
        if (!userId) return;
        const prev = userListItem;
        setUserListItem((current) => (current ? { ...current, score } : current));

        try {
            await updateAnimeScore(supabase, userId, malId, score);
            options?.onMutate?.();
        } catch {
            setUserListItem(prev);
        }
    };

    const handleRemove = async (malId: number, animeTitle?: string) => {
        if (!userId) return;
        const prev = userListItem;
        setUserListItem(null);

        try {
            await removeAnimeFromList(supabase, userId, malId);
            toast.success("Removed from your list", {
                description: `${animeTitle || "Anime"} has been removed.`,
            });
            options?.onMutate?.();
        } catch {
            setUserListItem(prev);
            toast.error("Failed to remove from list");
        }
    };

    return {
        userListItem,
        setUserListItem,
        actionLoading,
        handleAddToList,
        handleStatusChange,
        handleScoreChange,
        handleRemove,
    };
}
