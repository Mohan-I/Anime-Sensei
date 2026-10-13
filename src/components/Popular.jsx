import { useGlobalContext } from '../context/Global';
import AnimeCard from './ui/AnimeCard';
import Sidebar from './ui/Sidebar';

function Popular() {
  const { popularAnime, searchResults, isSearch, isLoading, error, rendered } = useGlobalContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-general text-sm">Loading anime…</p>
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

  const list = (!isSearch && rendered === 'popular') ? popularAnime : searchResults;
  const empty = !list || list.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Grid */}
      <div className="flex-1">
        {empty ? (
          <p className="text-center text-gray-400 text-sm font-general py-10">
            {isSearch ? 'No search results found.' : 'No popular anime found.'}
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

export default Popular;
