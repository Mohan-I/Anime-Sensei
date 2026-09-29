import React from 'react';
import { useGlobalContext } from '../context/Global';
import Popular from '../components/Popular';
import Upcoming from '../components/Upcoming';
import Airing from '../components/Airing';
import { TiCoffee, TiGlobe, TiUploadOutline } from 'react-icons/ti';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { Link } from 'react-router-dom';

function AnimePage() {
  const {
    rendered,
    setRendered,
    handleSubmit,
    search,
    handleChange,
    searchResults,
    getUpcomingAnime,
    getAiringAnime,
    getPopularAnime,
  } = useGlobalContext();

  if (!rendered || !setRendered) {
    console.error('Context values are not available!');
  }

  const switchComponent = () => {
    if (search && searchResults.length > 0) {
      // If search results exist, display them in a search results component (or customize this)
      return (
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Search Results:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((anime) => (
              <Link
              to={`/anime/${anime.mal_id}`}
              key={anime.mal_id}
              className="transform transition-all hover:scale-105"
            >
              <div key={anime.mal_id} className="border p-2 rounded-md shadow-md">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-medium">{anime.title}</h3>
              </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    switch (rendered) {
      case 'popular':
        return <Popular />;
      case 'airing':
        return <Airing />;
      case 'upcoming':
        return <Upcoming />;
      default:
        return <Popular />;
    }
  };

  return (
    <div className="bg-gray-200 py-2">
      {/* Animated Title */}
      <AnimatedTitle
        title="Disc<b>o</b>ver the <b>wo</b>rld's <br /> Lar<b>ge</b>st <b>an</b>ime hub"
        containerClass="pt-20 !text-black text-center"
      />

      {/* Header Section */}
      <header className="px-4 lg:px-20 py-8 max-w-screen-xl mx-auto transition-all ease-in-out">
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-center">
            {rendered === 'popular' ? 'Popular Anime' : rendered === 'airing' ? 'Airing Anime' : 'Upcoming Anime'}
          </h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 w-full">
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-xs sm:max-w-sm">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search Anime..."
                value={search}
                onChange={handleChange}
                className="w-full py-2 px-4 rounded-full border-2 border-gray-300 text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-300 to-indigo-600 text-white rounded-full text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          {/* Buttons */}
          <button
            onClick={() => setRendered('popular')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-gray-300 text-sm sm:text-xl transition-all duration-300 hover:bg-gray-100"
          >
            <TiCoffee className="rounded-full bg-amber-900 text-white" />
            Popular
          </button>
          <button
            onClick={() => {
              setRendered('airing');
              getAiringAnime();
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-gray-300 text-sm sm:text-xl transition-all duration-300 hover:bg-gray-100"
          >
            <TiGlobe className="rounded-full bg-blue-600 text-white" />
            Airing
          </button>
          <button
            onClick={() => {
              setRendered('upcoming');
              getUpcomingAnime();
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-gray-300 text-sm sm:text-xl transition-all duration-300 hover:bg-gray-100"
          >
            <TiUploadOutline className="rounded-full bg-teal-600 text-white" />
            Upcoming
          </button>
        </div>
      </header>

      {/* Display search term */}
      {search && (
        <p className="px-4 lg:px-20 text-lg font-semibold text-gray-700 mt-4">
          Search for : <span className="font-bold">{search}</span>
        </p>
      )}

      {/* Rendered Component */}
      <div className="px-4 lg:px-20">{switchComponent()}</div>
    </div>
  );
}

export default AnimePage;
