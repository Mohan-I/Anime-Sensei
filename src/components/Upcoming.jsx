import { useEffect } from 'react';
import { useGlobalContext } from '../context/Global';
import AnimeCard from './ui/AnimeCard';
import Sidebar from './ui/Sidebar';

function Upcoming() {
  const {
    upcomingAnime, searchResults, isSearch,
    isLoading, error, rendered,
    getUpcomingAnime,
  } = useGlobalContext();

  // Fetch upcoming data the first time this tab becomes active
  useEffect(() => {
    if (rendered === 'upcoming' && (!upcomingAnime || upcomingAnime.length === 0)) {
      getUpcomingAnime();
    }
  }, [rendered]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-general text-sm">Loading upcoming anime…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-sm font-general p-8">
        {error} — please try again in a moment.
      </div>
    );
  }

  const list  = (!isSearch && rendered === 'upcoming') ? upcomingAnime : searchResults;
  const empty = !list || list.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h2 className="text-lg font-bold text-gray-800">Upcoming Anime</h2>
        </div>

        {empty ? (
          <p className="text-center text-gray-400 text-sm font-general py-10">
            {isSearch ? 'No search results found.' : 'No upcoming anime found.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <Sidebar />
      </div>
    </div>
  );
}

export default Upcoming;
