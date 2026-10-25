import type { JikanAnime } from "@/types/jikan";

interface AnimeSynopsisProps {
    synopsis: string;
}

export default function AnimeSynopsis({ synopsis }: AnimeSynopsisProps) {
    return (
        <section>
            <h2 className="text-text-primary mb-4 flex items-center gap-2 text-[1.5rem] font-semibold">
                <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                Synopsis
            </h2>
            <div
                className="p-5 rounded-2xl bg-surface"
                style={{ boxShadow: "var(--shadow-info-card)" }}
            >
                <p className="text-text-secondary leading-relaxed text-sm">
                    {synopsis}
                </p>
            </div>
        </section>
    );
}
