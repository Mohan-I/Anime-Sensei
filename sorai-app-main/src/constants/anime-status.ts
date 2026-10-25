import { AnimeStatus } from "@/types/anime";

/** Human-readable labels for each anime list status. */
export const STATUS_LABELS: Record<AnimeStatus, string> = {
    watching: "Watching",
    completed: "Completed",
    paused: "On Hold",
    dropped: "Dropped",
    planned: "Plan to Watch",
};

/** Theme colors for each status (CSS custom properties). */
export const STATUS_COLORS: Record<AnimeStatus, string> = {
    watching: "var(--color-status-watching)",
    completed: "var(--color-status-completed)",
    paused: "var(--color-status-paused)",
    dropped: "var(--color-status-dropped)",
    planned: "var(--color-status-planned)",
};

/** Background colors for status buttons overlaid on hero images. */
export const STATUS_BG_COLORS: Record<AnimeStatus, string> = {
    watching: "var(--color-status-watching-bg)",
    completed: "var(--color-status-completed-bg)",
    paused: "var(--color-status-paused-bg)",
    dropped: "var(--color-status-dropped-bg)",
    planned: "var(--color-status-planned-bg)",
};

/** Border colors for status buttons overlaid on hero images. */
export const STATUS_BORDER_COLORS: Record<AnimeStatus, string> = {
    watching: "var(--color-status-watching-border)",
    completed: "var(--color-status-completed-border)",
    paused: "var(--color-status-paused-border)",
    dropped: "var(--color-status-dropped-border)",
    planned: "var(--color-status-planned-border)",
};

/** Default display order for status groups. */
export const STATUS_ORDER: AnimeStatus[] = [
    "watching",
    "planned",
    "paused",
    "completed",
    "dropped",
];

/** Statuses for which scoring is disabled. */
export const NO_SCORE_STATUSES: AnimeStatus[] = ["paused", "planned"];
