import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";

interface AnimeGridSkeletonProps {
    /** Number of skeleton cards to render. Defaults to 12. */
    count?: number;
}

export default function AnimeGridSkeleton({ count = 12 }: AnimeGridSkeletonProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
            ))}
        </div>
    );
}
