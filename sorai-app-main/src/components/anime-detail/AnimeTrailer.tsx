import { Play } from "lucide-react";

/**
 * Validates that an embed URL is from a trusted YouTube domain.
 */
function isValidYouTubeEmbedUrl(url: string | undefined | null): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(
            parsed.hostname
        );
    } catch {
        return false;
    }
}

interface AnimeTrailerProps {
    embedUrl?: string | null;
    youtubeId?: string | null;
}

export default function AnimeTrailer({ embedUrl, youtubeId }: AnimeTrailerProps) {
    return (
        <section>
            <h2 className="text-text-primary mb-4 flex items-center gap-2 text-[1.5rem] font-semibold">
                <span className="w-1 h-5 rounded-full inline-block bg-primary" />
                <Play size={16} className="text-text-secondary" />
                Trailer
            </h2>
            {embedUrl && isValidYouTubeEmbedUrl(embedUrl) ? (
                <div
                    className="rounded-2xl overflow-hidden bg-surface"
                    style={{ boxShadow: "var(--shadow-info-card)" }}
                >
                    <div className="relative aspect-video">
                        <iframe
                            src={embedUrl.replace("autoplay=1", "autoplay=0")}
                            title="Trailer"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            ) : youtubeId ? (
                <div
                    className="rounded-2xl overflow-hidden bg-surface"
                    style={{ boxShadow: "var(--shadow-info-card)" }}
                >
                    <div className="relative aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="Trailer"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-2xl overflow-hidden bg-surface flex items-center justify-center"
                    style={{ boxShadow: "var(--shadow-info-card)", aspectRatio: "16/9" }}
                >
                    <div className="text-center">
                        <Play size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Trailer not available</p>
                    </div>
                </div>
            )}
        </section>
    );
}
