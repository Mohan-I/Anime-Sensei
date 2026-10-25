/** Anime type filter options used in search and browse pages. */
export const TYPE_FILTERS = [
    { value: "all", label: "All" },
    { value: "tv", label: "TV" },
    { value: "movie", label: "Movie" },
    { value: "ova", label: "OVA" },
    { value: "ona", label: "ONA" },
    { value: "special", label: "Special" },
    { value: "music", label: "Music" },
] as const;

/** Anime airing status filter options. */
export const STATUS_FILTERS = [
    { value: "all", label: "All" },
    { value: "airing", label: "Airing" },
    { value: "complete", label: "Finished" },
    { value: "upcoming", label: "Upcoming" },
] as const;

/** Anime genre filter options (Jikan genre IDs). */
export const GENRE_FILTERS = [
    { value: "all", label: "All" },
    { value: "1", label: "Action" },
    { value: "2", label: "Adventure" },
    { value: "5", label: "Avant Garde" },
    { value: "46", label: "Award Winning" },
    { value: "4", label: "Comedy" },
    { value: "8", label: "Drama" },
    { value: "10", label: "Fantasy" },
    { value: "47", label: "Gourmet" },
    { value: "14", label: "Horror" },
    { value: "7", label: "Mystery" },
    { value: "22", label: "Romance" },
    { value: "24", label: "Sci-Fi" },
    { value: "36", label: "Slice of Life" },
    { value: "30", label: "Sports" },
    { value: "37", label: "Supernatural" },
    { value: "41", label: "Suspense" },
] as const;

/** Anime demographic filter options (Jikan demographic genre IDs). */
export const DEMOGRAPHIC_FILTERS = [
    { value: "all", label: "All" },
    { value: "27", label: "Shounen" },
    { value: "25", label: "Shoujo" },
    { value: "42", label: "Seinen" },
    { value: "43", label: "Josei" },
    { value: "15", label: "Kids" },
] as const;
