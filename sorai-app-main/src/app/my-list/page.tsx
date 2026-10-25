"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import GridCard from "@/components/my-list/GridCard";
import ListCard from "@/components/my-list/ListCard";
import {
    Star,
    Trash2,
    Grid3X3,
    List as ListIcon,
    ChevronDown,
    Check,
    LayoutList,
    Search,
    X,
} from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import {
    getUserAnimeList,
    updateAnimeStatus,
    updateAnimeScore,
    removeAnimeFromList,
} from "@/lib/user-anime-list";
import { AnimeStatus, UserAnimeListItem } from "@/types/anime";
import {
    STATUS_LABELS,
    STATUS_COLORS,
    STATUS_ORDER,
    NO_SCORE_STATUSES,
} from "@/constants/anime-status";



export default function MyListPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, supabase } = useAuth();

    const [list, setList] = useState<UserAnimeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [deleteTarget, setDeleteTarget] = useState<UserAnimeListItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openScoreDropdown, setOpenScoreDropdown] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [authLoading, user, router]);

    // Fetch list
    useEffect(() => {
        if (!user) return;

        const fetchList = async () => {
            setLoading((prev) => list.length === 0);
            try {
                const data = await getUserAnimeList(supabase, user.id);
                setList(data);
            } catch {
                // Silent
            }
            setLoading(false);
        };

        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, supabase]);

    // Filter by search query
    const filteredList = searchQuery.trim()
        ? list.filter((item) =>
            item.anime_title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : list;

    // Group by status
    const groupedList = STATUS_ORDER.reduce(
        (acc, status) => {
            const items = filteredList.filter((item) => item.status === status);
            if (items.length > 0) acc.push({ status, items });
            return acc;
        },
        [] as { status: AnimeStatus; items: UserAnimeListItem[] }[]
    );

    const handleStatusChange = async (
        malId: number,
        newStatus: AnimeStatus
    ) => {
        if (!user) return;
        setList((prev) =>
            prev.map((item) =>
                item.mal_id === malId
                    ? {
                        ...item,
                        status: newStatus,
                        score: NO_SCORE_STATUSES.includes(newStatus) ? null : item.score,
                    }
                    : item
            )
        );
        try {
            await updateAnimeStatus(supabase, user.id, malId, newStatus);
        } catch {
            // Revert
            const data = await getUserAnimeList(supabase, user.id);
            setList(data);
        }
    };

    const handleScoreChange = async (malId: number, score: number) => {
        if (!user) return;
        setOpenScoreDropdown(null);
        setList((prev) =>
            prev.map((item) =>
                item.mal_id === malId ? { ...item, score } : item
            )
        );
        try {
            await updateAnimeScore(supabase, user.id, malId, score);
        } catch {
            const data = await getUserAnimeList(supabase, user.id);
            setList(data);
        }
    };

    const handleDelete = async () => {
        if (!user || !deleteTarget) return;
        setIsDeleting(true);
        try {
            await removeAnimeFromList(supabase, user.id, deleteTarget.mal_id);
            setList((prev) =>
                prev.filter((item) => item.mal_id !== deleteTarget.mal_id)
            );
            toast.success("Removed from your list", {
                description: `${deleteTarget.anime_title || "Anime"} has been removed.`,
            });
        } catch {
            // Revert
            const data = await getUserAnimeList(supabase, user.id);
            setList(data);
            toast.error("Failed to remove from list");
        }
        setIsDeleting(false);
        setDeleteTarget(null);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background">
                <main className="max-w-container mx-auto px-6 md:px-10 py-10">
                    <div className="h-8 skeleton w-48 mb-8" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i}>
                                <div className="aspect-[2/3] skeleton rounded-card mb-2" />
                                <div className="h-4 skeleton w-3/4 mb-1" />
                                <div className="h-3 skeleton w-1/2" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-container mx-auto px-6 md:px-10 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-text-primary text-[1.5rem] font-bold">
                            My List
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {list.length} anime{list.length !== 1 ? "s" : ""} in your list
                        </p>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
                        <button
                            onClick={() => setViewMode("grid")}
                            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm transition-colors"
                            style={{
                                backgroundColor: viewMode === "grid" ? "var(--color-primary)" : "transparent",
                                color: viewMode === "grid" ? "white" : "var(--color-text-secondary)",
                            }}
                        >
                            <Grid3X3 size={14} />
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm transition-colors"
                            style={{
                                backgroundColor: viewMode === "list" ? "var(--color-primary)" : "transparent",
                                color: viewMode === "list" ? "white" : "var(--color-text-secondary)",
                            }}
                        >
                            <LayoutList size={14} />
                            <span className="hidden sm:inline">List</span>
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                {!loading && list.length > 0 && (
                    <div className="relative mb-6">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search in my list..."
                            maxLength={100}
                            className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-surface text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-primary transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i}>
                                <div className="aspect-[2/3] skeleton rounded-2xl mb-2" />
                                <div className="h-4 skeleton w-3/4 mb-1" />
                                <div className="h-3 skeleton w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : list.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-primary-light">
                            <ListIcon size={28} className="text-primary" />
                        </div>
                        <h3 className="text-text-primary mb-2 text-[1.1rem] font-semibold">
                            Your list is empty
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Browse the catalog and add your favorite anime
                        </p>
                        <Link
                            href="/"
                            className="inline-flex px-6 py-2.5 rounded-xl text-sm text-white font-medium bg-primary hover:bg-primary-hover transition-colors"
                        >
                            Browse anime
                        </Link>
                    </div>
                ) : searchQuery && filteredList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-primary-light">
                            <Search size={24} className="text-primary" />
                        </div>
                        <h3 className="text-text-primary mb-2 text-[1.05rem] font-semibold">
                            No results
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            No results for &ldquo;{searchQuery}&rdquo; in your list
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-sm text-primary hover:text-primary-hover transition-colors"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {groupedList.map(({ status, items }) => (
                            <section key={status}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: STATUS_COLORS[status] }}
                                    />
                                    <h2 className="text-text-primary text-lg font-semibold">
                                        {STATUS_LABELS[status]}
                                    </h2>
                                    <span className="text-gray-400 text-sm">
                                        ({items.length})
                                    </span>
                                </div>

                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                                            : "flex flex-col gap-3"
                                    }
                                >
                                    {items.map((item) =>
                                        viewMode === "grid" ? (
                                            <GridCard
                                                key={item.id}
                                                item={item}
                                                onDelete={() => setDeleteTarget(item)}
                                            />
                                        ) : (
                                            <ListCard
                                                key={item.id}
                                                item={item}
                                                onDelete={() => setDeleteTarget(item)}
                                                onScoreChange={handleScoreChange}
                                                onStatusChange={handleStatusChange}
                                                openScoreDropdown={openScoreDropdown}
                                                setOpenScoreDropdown={setOpenScoreDropdown}
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                animeTitle={deleteTarget?.anime_title || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}

