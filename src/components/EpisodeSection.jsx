import { useEffect, useMemo, useState } from "react";
import {
  getAnimeEpisodeVideos,
  getAnimeEpisodes,
  getAnimeVideos,
} from "../services/tenraiService";
import SubscriptionModal from "./SubscriptionModal";
import Locked from "../assets/locked.svg";

const getYoutubeUrl = (video) => {
  if (video?.embed_url) return video.embed_url;
  if (video?.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
  if (video?.url?.includes("youtube.com") || video?.url?.includes("youtu.be")) {
    return video.url;
  }
  return null;
};

const getEpisodeNumber = (value) => {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : null;
};

function EpisodeImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className="flex h-18 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5"
        aria-label={alt || "Image locked"}
      >
        <img src={Locked} alt="" className="h-12 w-12" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-16 w-24 rounded-lg object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function EpisodeSection({ animeId, title }) {
  const [episodes, setEpisodes] = useState([]);
  const [episodeVideos, setEpisodeVideos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getAnimeEpisodes(animeId),
      getAnimeEpisodeVideos(animeId),
      getAnimeVideos(animeId),
    ])
      .then(([episodeResponse, episodeVideoResponse, videoResponse]) => {
        if (cancelled) return;
        setEpisodes(episodeResponse.data ?? []);
        setEpisodeVideos(episodeVideoResponse.data ?? []);
        setPromos(videoResponse.data?.promo ?? []);
      })
      .catch((fetchError) => {
        if (!cancelled) {
          console.error("Episode data load failed:", fetchError);
          setError("Episode data is currently unavailable.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [animeId]);

  const videosByEpisode = useMemo(() => {
    const map = new Map();
    episodeVideos.forEach((video) => {
      const number = getEpisodeNumber(video.episode ?? video.title);
      const url = getYoutubeUrl(video);
      if (number !== null && url) map.set(number, url);
    });
    return map;
  }, [episodeVideos]);

  if (loading) {
    return (
      <section className="mt-10">
        <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-white/5" />
      </section>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="episodes-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="episodes-heading" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="inline-block h-5 w-1 rounded-full bg-violet-500" />
            Episodes
          </h2>
          <p className="mt-1 text-xs text-white/40">
            {title} · {episodes.length} episode{episodes.length === 1 ? "" : "s"}
          </p>
        </div>
        {promos.length > 0 && (
          <a
            href={getYoutubeUrl(promos[0]) ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-violet-300 hover:text-violet-200"
          >
            Watch official videos on YouTube &rarr;
          </a>
        )}
      </div>

      {error ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">{error}</p>
      ) : episodes.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">
          No episode information is available for this title.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.slice(0, 24).map((episode) => {
            const episodeNumber = getEpisodeNumber(episode.mal_id ?? episode.episode);
            const youtubeUrl = videosByEpisode.get(episodeNumber);
            return (
              <div
                key={episode.mal_id ?? episode.episode}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-2"
              >
                <EpisodeImage
                  src={episode.images?.jpg?.image_url}
                  alt={episode.title || "Episode thumbnail"}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                    {episode.episode ?? `Episode ${episode.mal_id}`}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-white">{episode.title || "Untitled episode"}</p>
                  {youtubeUrl ? (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                    >
                      Watch on YouTube &rarr;
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubscriptionModal(true)}
                      className="mt-2 text-left text-xs font-semibold text-amber-400 hover:text-amber-200"
                    >
                      Currently unavailable for your tier
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </section>
  );
}

export default EpisodeSection;