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
      className="flex items-center gap-2 group hover:bg-violet-50 rounded-xl w-full p-2 -mx-2 transition-colors"
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
                          flex items-center justify-center">
            <span className="text-white text-[12px] font-bold text-center leading-tight line-clamp-3">
              {anime.title}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors mb-2">
          {anime.title}
        </p>
        <div className='flex gap-2'>
        
        {anime.genres?.slice(0, 1).map((g) => (
          <span key={g.name} className="text-xs text-zinc-100 bg-violet-600 p-1 font-semibold rounded">{g.name}</span>
        ))}
        {anime.score > 0 && (
          <p className="text-xs bg-yellow-400 text-yellow-800 rounded p-1 font-semibold">
            ★ {anime.score.toFixed(2)}
          </p>
        )}
        </div>
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
      <h3 className="text-base border-b-2 py-2 font-bold uppercase text-gray-900 mb-4 flex items-center gap-2">
        Top 5 Popular
      </h3>

      {top5.length === 0 ? (
        <p className="text-gray-400 text-xs font-general">No data yet.</p>
      ) : (
        <div className="flex flex-col gap-1 divide-y divide-gray-50">
          {top5.map((anime, i) => (
            <div key={anime.mal_id} className="pt-1 first:pt-0">
              <div className="flex items-start gap-2">
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
