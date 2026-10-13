import { useEffect } from 'react';
import { useGlobalContext } from '../context/Global';
import AnimeCard from './ui/AnimeCard';
import Sidebar from './ui/Sidebar';

function Airing() {
  const {
    airingAnime, searchResults, isSearch,
    isLoading, error, rendered,
    getAiringAnime,
  } = useGlobalContext();

  // Fetch airing data the first time this tab becomes active
  useEffect(() => {
    if (rendered === 'airing' && (!airingAnime || airingAnime.length === 0)) {
      getAiringAnime();
    }
  }, [rendered]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-general text-sm">Loading airing anime…</p>
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

  const list  = (!isSearch && rendered === 'airing') ? airingAnime : searchResults;
  const empty = !list || list.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Header */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-lg font-bold text-gray-800">Currently Airing</h2>
        </div>

        {empty ? (
          <p className="text-center text-gray-400 text-sm font-general py-10">
            {isSearch ? 'No search results found.' : 'No airing anime found.'}
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

export default Airing;
