import { useEffect, useState } from "react";
import { getLatestAnimeNews } from "../services/tenraiService";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(date))
    : "Recently";

function AnimeNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getLatestAnimeNews()
      .then((response) => {
        if (!cancelled) setNews(response.data ?? []);
      })
      .catch((fetchError) => {
        if (!cancelled) {
          console.error("Anime news load failed:", fetchError);
          setError("Anime news is currently unavailable. Please try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-slate-950 px-4 py-16 text-white sm:px-8 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Community updates
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Latest anime news</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Fresh headlines from the anime community, updated through the Tenrai catalogue API.
          </p>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 12).map((item) => (
              <article
                key={item.mal_id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:border-violet-400/50"
              >
                {item.images?.jpg?.image_url ? (
                  <img
                    src={item.images.jpg.image_url}
                    alt=""
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-44 bg-gradient-to-br from-violet-700 to-indigo-950" />
                )}
                <div className="p-5">
                  <p className="text-xs text-violet-300">{formatDate(item.date)}</p>
                  <h3 className="mt-2 line-clamp-3 text-lg font-semibold">{item.title}</h3>
                  {item.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">{item.excerpt}</p>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200"
                  >
                    Read full story &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AnimeNews;
