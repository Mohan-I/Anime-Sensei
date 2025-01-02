import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/Global';
import Sidebar from './ui/Sidebar';

function Upcoming() {
  const { upcomingAnime, searchResults, isSearch, isLoading, rendered } = useGlobalContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  // Conditional render for upcoming anime or search results
  const conditionalRender = () => {
    if (!isSearch && rendered === 'upcoming') {
      if (!upcomingAnime || upcomingAnime.length === 0) {
        return (
          <div className="text-center text-gray-500 text-lg">
            No upcoming anime found.
          </div>
        );
      }
      return upcomingAnime.map((anime) => (
        <Link
          to={`/anime/${anime.mal_id}`}
          key={anime.mal_id}
          className="transform transition-all hover:scale-105"
        >
          <img
            className="w-full h-full object-cover rounded-lg border-4 border-gray-200"
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
          />
        </Link>
      ));
    } else {
      if (!searchResults || searchResults.length === 0) {
        return (
          <div className="text-center text-gray-500 text-lg">
            No search results found.
          </div>
        );
      }
      return searchResults.map((anime) => (
        <Link
          to={`/anime/${anime.mal_id}`}
          key={anime.mal_id}
          className="transform transition-all hover:scale-105"
        >
          <img
            className="w-full h-full object-cover rounded-lg border-4 border-gray-200"
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
          />
        </Link>
      ));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Anime Grid */}
      <div className="upcoming-anime grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-4 w-full bg-white border-t-4 border-gray-200">
        {conditionalRender()}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/4 mt-8 lg:mt-0 px-4">
        <Sidebar />
      </div>
    </div>
  );
}

export default Upcoming;
