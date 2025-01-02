import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/Global';

function Sidebar() {
  const { popularAnime } = useGlobalContext();

  const sorted = popularAnime?.sort((a, b) => {
    return b.score - a.score;
  });

  return (
    <div className="mt-8 bg-white border-t-4 border-gray-200 px-8 py-4 pt-8">
      <h3 className="text-xl font-semibold mb-4">Top 5 Popular</h3>
      <div className="anime flex flex-col">
        {sorted?.slice(0, 5).map((anime) => {
          return (
            <Link
              to={`/anime/${anime.mal_id}`}
              key={anime.mal_id}
              className="flex flex-col gap-1 my-4 text-green-600"
            >
              <img
                className="w-full rounded-lg border-4 border-gray-200"
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
              />
              <h5 className="text-base font-medium">{anime.title}</h5>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
