export default function AnimeCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden bg-surface" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="aspect-[2/3] skeleton" />
            <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-3 skeleton w-1/3" />
            </div>
        </div>
    );
}
