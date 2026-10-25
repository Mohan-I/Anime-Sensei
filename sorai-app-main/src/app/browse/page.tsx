"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrendingUp, Sparkles, Clock, Film, Tag, Radio, Tv, Star, CalendarDays, Snowflake, Flower2, Sun, Leaf, SearchX } from "lucide-react";
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import AnimeGridSkeleton from "@/components/AnimeGridSkeleton";
import Pagination from "@/components/Pagination";
import FilterBar, { type ActiveFilters } from "@/components/FilterBar";
import { getSeasonNow, getSeasonUpcoming, getSeasonByYear, browseAnime, JikanError } from "@/lib/jikan";
import { TYPE_FILTERS, STATUS_FILTERS, GENRE_FILTERS, DEMOGRAPHIC_FILTERS } from "@/constants/filters";
import { mapToCardData, deduplicateByMalId } from "@/lib/mappers";
import { AnimeCardData } from "@/types/anime";
import { useAuth } from "@/context/AuthContext";



const SEASON_LABELS: Record<string, string> = {
    winter: "Winter",
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
};

const PAGE_CONFIG: Record<string, { title: string; subtitle: string; icon: React.ReactNode; iconBg: string }> = {
    popular: {
        title: "Most Popular",
        subtitle: "Most popular anime of all time",
        icon: <TrendingUp size={18} style={{ color: "var(--color-primary)" }} />,
        iconBg: "var(--color-primary-light)",
    },
    season: {
        title: "In Season",
        subtitle: "Anime currently airing this season",
        icon: <Sparkles size={18} style={{ color: "var(--color-type-special)" }} />,
        iconBg: "var(--color-season-icon-bg)",
    },
    upcoming: {
        title: "Upcoming Anime",
        subtitle: "Anime coming soon in the next season",
        icon: <Clock size={18} style={{ color: "var(--color-cat-upcoming)" }} />,
        iconBg: "var(--color-cat-upcoming-bg)",
    },
    movies: {
        title: "Top Movies",
        subtitle: "Highest rated anime movies",
        icon: <Film size={18} style={{ color: "var(--color-cat-movies)" }} />,
        iconBg: "var(--color-cat-movies-bg)",
    },
    airing: {
        title: "Top Airing",
        subtitle: "Highest rated anime currently on air",
        icon: <Radio size={18} style={{ color: "var(--color-cat-airing)" }} />,
        iconBg: "var(--color-cat-airing-bg)",
    },
    ona: {
        title: "ONAs",
        subtitle: "Original Net Animations — web-exclusive anime",
        icon: <Tv size={18} style={{ color: "var(--color-cat-ovaona)" }} />,
        iconBg: "var(--color-cat-ovaona-bg)",
    },
    ova: {
        title: "OVAs",
        subtitle: "Original Video Animations — special home-release anime",
        icon: <Tv size={18} style={{ color: "var(--color-cat-ovaona)" }} />,
        iconBg: "var(--color-cat-ovaona-bg)",
    },
    special: {
        title: "Specials",
        subtitle: "Special anime episodes and one-offs",
        icon: <Star size={18} style={{ color: "var(--color-cat-special)" }} />,
        iconBg: "var(--color-cat-special-bg)",
    },
};

// Pages that use season endpoints (only support type filter)
const SEASON_PAGES = ["season", "upcoming", "season-archive"];
// Pages that are already type-specific — type filter is redundant
const FORMAT_TYPES = ["ona", "ova", "special", "movies"];

function BrowseContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get("type") || "popular";
    const genre = searchParams.get("genre");
    const genreId = genre ? parseInt(genre) : null;
    const seasonYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;
    const seasonName = searchParams.get("season") || null;

    // Read filter values from URL params
    const urlPage = parseInt(searchParams.get("page") || "1");
    const urlTypeFilter = searchParams.get("filter") || "all";
    const urlDemographic = searchParams.get("demographic") || "all";
    const urlStatus = searchParams.get("status") || "all";

    // The URL "genre" param can be either a genre or a demographic ID (e.g. from footer links).
    // Detect which list it belongs to and initialize the correct dropdown.
    const urlGenreParam = searchParams.get("genre") || "all";
    const isDemographicId = DEMOGRAPHIC_FILTERS.some((d) => d.value === urlGenreParam);
    const isGenreId = GENRE_FILTERS.some((g) => g.value === urlGenreParam);
    const urlGenreFilter = isGenreId ? urlGenreParam : "all";
    const urlDemographicResolved = isDemographicId ? urlGenreParam : urlDemographic;

    const SEASON_ICONS: Record<string, React.ReactNode> = {
        winter: <Snowflake size={18} style={{ color: "var(--color-season-winter)" }} />,
        spring: <Flower2 size={18} style={{ color: "var(--color-season-spring)" }} />,
        summer: <Sun size={18} style={{ color: "var(--color-season-summer)" }} />,
        fall: <Leaf size={18} style={{ color: "var(--color-season-fall)" }} />,
    };

    const SEASON_ICON_BG: Record<string, string> = {
        winter: "var(--color-season-winter-bg)",
        spring: "var(--color-season-spring-bg)",
        summer: "var(--color-season-summer-bg)",
        fall: "var(--color-season-fall-bg)",
    };

    const GENRE_NAMES: Record<number, string> = {
        1: "Action", 2: "Adventure", 4: "Comedy", 8: "Drama",
        10: "Fantasy", 14: "Horror", 22: "Romance", 24: "Sci-Fi",
        27: "Shounen", 25: "Shoujo", 36: "Slice of Life", 30: "Sports",
        7: "Mystery", 37: "Supernatural", 42: "Seinen", 43: "Josei",
        5: "Avant Garde", 46: "Award Winning", 47: "Gourmet", 41: "Suspense",
        15: "Kids",
    };

    const seasonArchiveConfig = (type === "season-archive" && seasonYear && seasonName) ? {
        title: `${SEASON_LABELS[seasonName] || seasonName} ${seasonYear}`,
        subtitle: `Anime from the ${SEASON_LABELS[seasonName] || seasonName} ${seasonYear} season`,
        icon: SEASON_ICONS[seasonName] || <CalendarDays size={18} style={{ color: "var(--color-primary)" }} />,
        iconBg: SEASON_ICON_BG[seasonName] || "var(--color-primary-light)",
    } : null;

    const genreConfig = genreId ? {
        title: GENRE_NAMES[genreId] || "Genre",
        subtitle: `Popular ${GENRE_NAMES[genreId] || ""} anime`,
        icon: <Tag size={18} style={{ color: "var(--color-primary)" }} />,
        iconBg: "var(--color-primary-light)",
    } : null;

    const config = seasonArchiveConfig || genreConfig || PAGE_CONFIG[type] || PAGE_CONFIG.popular;

    // Determine which filters to show
    const isSeasonPage = SEASON_PAGES.includes(type);
    const isFormatPage = FORMAT_TYPES.includes(type);
    // Season endpoints only support type filter; format pages already have type locked
    const visibleFilters: Array<"type" | "genre" | "demographic" | "status"> = isSeasonPage
        ? ["type"]
        : isFormatPage
            ? ["genre", "demographic", "status"]
            : ["genre", "demographic", "type", "status"];

    // Can we use the full /anime endpoint? (supports all filters)
    // Season pages must use their specific endpoints which don't support genre/status
    const canUseFullFilters = !isSeasonPage;

    const [results, setResults] = useState<AnimeCardData[]>([]);
    const [currentPage, setCurrentPage] = useState(urlPage);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ActiveFilters>({
        type: urlTypeFilter,
        genre: urlGenreFilter,
        demographic: urlDemographicResolved,
        status: urlStatus,
    });
    const { profile } = useAuth();
    const showSensitive = profile?.show_sensitive_content ?? false;
    const sfw = !showSensitive;

    const DISPLAY_LIMIT = 12;
    const FETCH_LIMIT = 16;

    const fetchData = useCallback(
        async (page: number, activeFilters: ActiveFilters = filters) => {
            setLoading(true);
            setError(null);
            const apiType = activeFilters.type === "all" ? undefined : activeFilters.type;
            const apiGenre = activeFilters.genre === "all" ? undefined : activeFilters.genre;
            const apiDemographic = activeFilters.demographic === "all" ? undefined : activeFilters.demographic;
            const apiStatus = activeFilters.status === "all" ? undefined : activeFilters.status;

            // Combine genre + demographic into a single genres param (comma-separated for Jikan)
            const genreIds = [apiGenre, apiDemographic].filter(Boolean).join(",") || undefined;

            try {
                let result;

                if (isSeasonPage) {
                    // Season endpoints only support type filter
                    if (type === "season-archive" && seasonYear && seasonName) {
                        result = await getSeasonByYear(seasonYear, seasonName, FETCH_LIMIT, page, sfw, apiType);
                    } else if (type === "upcoming") {
                        result = await getSeasonUpcoming(FETCH_LIMIT, page, sfw, apiType);
                    } else {
                        result = await getSeasonNow(FETCH_LIMIT, page, sfw, apiType);
                    }
                } else if (type === "movies") {
                    // Movies page — type is locked to "movie"
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", type: "movie", genres: genreIds, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                } else if (type === "ona") {
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", type: "ona", genres: genreIds, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                } else if (type === "ova") {
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", type: "ova", genres: genreIds, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                } else if (type === "special") {
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", type: "special", genres: genreIds, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                } else if (type === "airing") {
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", status: apiStatus || "airing", type: apiType, genres: genreIds },
                        FETCH_LIMIT, page, sfw
                    );
                } else if (genreId && !genreIds) {
                    // Coming from footer genre link with no extra filters
                    result = await browseAnime(
                        { orderBy: "members", sort: "desc", genres: String(genreId), type: apiType, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                } else {
                    // popular (default) or genre browse with filters
                    const genres = genreIds || (genreId ? String(genreId) : undefined);
                    result = await browseAnime(
                        { orderBy: "popularity", sort: "asc", type: apiType, genres, status: apiStatus },
                        FETCH_LIMIT, page, sfw
                    );
                }

                const mapped = result.data.map(mapToCardData);
                const unique = deduplicateByMalId(mapped);
                setResults(unique.slice(0, DISPLAY_LIMIT));
                setTotalPages(result.pagination.last_visible_page);
                setCurrentPage(result.pagination.current_page);
            } catch (err) {
                if (err instanceof JikanError && err.status === 429) {
                    setError(err.message);
                } else {
                    setError("Error loading anime. Please try again.");
                }
            }
            setLoading(false);
        },
        [type, genreId, seasonYear, seasonName, sfw, filters, isSeasonPage]
    );

    // Build URL with current params + filter overrides
    const buildUrl = useCallback((overrides: { filters?: ActiveFilters; page?: number }) => {
        const params = new URLSearchParams();
        // Preserve base params
        if (type !== "popular") params.set("type", type);
        if (genreId && !overrides.filters?.genre) params.set("genre", String(genreId));
        if (seasonYear) params.set("year", String(seasonYear));
        if (seasonName) params.set("season", seasonName);

        const f = overrides.filters ?? filters;
        const p = overrides.page ?? currentPage;

        if (f.type && f.type !== "all") params.set("filter", f.type);
        if (f.genre && f.genre !== "all") params.set("genre", f.genre);
        if (f.demographic && f.demographic !== "all") params.set("demographic", f.demographic);
        if (f.status && f.status !== "all") params.set("status", f.status);
        if (p > 1) params.set("page", String(p));

        return `/browse?${params.toString()}`;
    }, [type, genreId, seasonYear, seasonName, filters, currentPage]);

    // Initial fetch on mount
    useEffect(() => {
        setResults([]);
        fetchData(urlPage, filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sfw]);

    const handleFilterChange = (newFilters: ActiveFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        fetchData(1, newFilters);
        router.push(buildUrl({ filters: newFilters, page: 1 }), { scroll: false });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchData(page);
        router.push(buildUrl({ page }), { scroll: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };



    return (
        <main className="max-w-container mx-auto px-6 md:px-10 py-10">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-primary text-sm transition-colors"
                    >
                        Home
                    </Link>
                    <span className="text-gray-300 text-sm">/</span>
                    <span className="text-text-primary text-sm font-medium">
                        {config.title}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: config.iconBg }}
                    >
                        {config.icon}
                    </div>
                    <h1 className="text-text-primary text-[1.5rem] font-bold">
                        {config.title}
                    </h1>
                </div>
                <p className="text-gray-400 text-sm mt-1 ml-10">
                    {config.subtitle}
                </p>
            </div>

            {/* Filter Bar */}
            <div className="mb-8">
                <FilterBar
                    filters={filters}
                    onChange={handleFilterChange}
                    visibleFilters={visibleFilters}
                    typeOptions={TYPE_FILTERS}
                    genreOptions={canUseFullFilters ? GENRE_FILTERS : []}
                    demographicOptions={canUseFullFilters ? DEMOGRAPHIC_FILTERS : []}
                    statusOptions={canUseFullFilters ? STATUS_FILTERS : []}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <p className="text-red-600 text-sm mb-2">{error}</p>
                    <button
                        onClick={() => fetchData(currentPage)}
                        className="text-sm px-4 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Results */}
            {loading ? (
                <div className="mb-10">
                    <AnimeGridSkeleton count={12} />
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
                    {results.map((anime) => (
                        <AnimeCard key={anime.mal_id} anime={anime} />
                    ))}
                </div>
            ) : !error && (
                <div className="text-center py-20 mb-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-primary-light">
                        <SearchX size={28} className="text-primary" />
                    </div>
                    <h3 className="text-text-primary mb-2 text-[1.1rem] font-semibold">
                        No results found
                    </h3>
                    <p className="text-gray-400 text-sm mb-5">
                        No anime found with the selected filters. Try adjusting your criteria.
                    </p>
                    {Object.values(filters).some((v) => v && v !== "all") && (
                        <button
                            onClick={() => handleFilterChange({ type: "all", genre: "all", demographic: "all", status: "all" })}
                            className="text-sm px-5 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </main>
    );
}

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-background">
            <Suspense
                fallback={
                    <main className="max-w-container mx-auto px-6 md:px-10 py-10">
                        <AnimeGridSkeleton count={12} />
                    </main>
                }
            >
                <BrowseContentWrapper />
            </Suspense>
        </div>
    );
}

function BrowseContentWrapper() {
    const searchParams = useSearchParams();
    const key = searchParams.toString();
    return <BrowseContent key={key} />;
}
