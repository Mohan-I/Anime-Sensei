import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/Global';

// Compact sidebar card — smaller than the main grid card
function SidebarCard({ anime }) {
  const [imgErr, setImgErr] = useState(false);
  const poster = anime.images?.jpg?.large_image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="flex items-center gap-3 group hover:bg-violet-50 rounded-xl p-2 -mx-2 transition-colors"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-gray-100">
        {!imgErr && poster ? (
          <img
            src={poster}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600
                          flex items-center justify-center p-1">
            <span className="text-white text-[9px] font-bold text-center leading-tight line-clamp-3">
              {anime.title}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
          {anime.title}
        </p>
        {anime.score > 0 && (
          <p className="text-xs text-yellow-500 font-semibold mt-0.5">
            ★ {anime.score.toFixed(2)}
          </p>
        )}
        {anime.genres?.slice(0, 1).map((g) => (
          <span key={g.name} className="text-[10px] text-gray-400 font-general">{g.name}</span>
        ))}
      </div>
    </Link>
  );
}

function Sidebar() {
  const { popularAnime } = useGlobalContext();

  // Top 5 by score descending
  const top5 = [...(popularAnime ?? [])]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-yellow-500">★</span> Top 5 Popular
      </h3>

      {top5.length === 0 ? (
        <p className="text-gray-400 text-xs font-general">No data yet.</p>
      ) : (
        <div className="flex flex-col gap-1 divide-y divide-gray-50">
          {top5.map((anime, i) => (
            <div key={anime.mal_id} className="pt-1 first:pt-0">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-300 w-4 mt-2.5 flex-shrink-0">
                  {i + 1}
                </span>
                <SidebarCard anime={anime} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
