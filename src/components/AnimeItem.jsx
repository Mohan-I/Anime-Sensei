import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function AnimeItem() {
  const { id } = useParams();

  // State
  const [anime, setAnime] = React.useState({});
  const [characters, setCharacters] = React.useState([]);
  const [showMore, setShowMore] = React.useState(false);

  // Destructure anime data
  const {
    title,
    synopsis,
    trailer,
    duration,
    aired,
    season,
    images,
    rank,
    score,
    scored_by,
    popularity,
    status,
    rating,
    source,
  } = anime;

  // Get anime based on ID
  const getAnime = async (animeId) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await response.json();
    setAnime(data.data);
  };

  // Get characters
  const getCharacters = async (animeId) => {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/characters`
    );
    const data = await response.json();
    setCharacters(data.data);
    console.log(data.data);
  };

  // Initial render
  useEffect(() => {
    getAnime(id);
    getCharacters(id);
  }, [id]);

  return (
    <div className="bg-black p-2">
      <div className="flex justify-center mt-20">
        {trailer?.embed_url ? (
          <iframe
            src={trailer?.embed_url}
            title="Anime Trailer"
            width="800"
            height="600"
            className="w-full mx-4"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <h3 className="font-general text-xs uppercase">
            ( Trailer not available )
          </h3>
        )}
      </div>
      <div className="bg-white rounded-xl p-8 border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={images?.jpg.large_image_url}
              alt={title}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-green-500 bg-clip-text mb-8">
              {title}
            </h1>
            <hr />
            <p>
              <span className="font-semibold text-gray-700">Aired:</span>{" "}
              {aired?.string}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Rating:</span>{" "}
              {rating}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Rank:</span> {rank}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Score:</span>{" "}
              {score}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Scored By:</span>{" "}
              {scored_by}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Popularity:</span>{" "}
              {popularity}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              {status}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Source:</span>{" "}
              {source}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Season:</span>{" "}
              {season}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Duration:</span>{" "}
              {duration}
            </p>
          </div>
        </div>

        <div className="mt-8 text-gray-700 space-y-4">
          <p className="text-lg leading-relaxed">
            {showMore ? synopsis : synopsis?.substring(0, 450) + "..."}
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-green-500 font-semibold ml-2"
            >
              {showMore ? "Show Less" : "Read More"}
            </button>
          </p>
        </div>

        <h3 className="text-2xl font-bold mt-8 text-transparent bg-gradient-to-r from-indigo-500 to-green-500 bg-clip-text">
          Characters
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {characters?.map((character, index) => {
            const { role } = character;
            const { images, name, mal_id } = character.character;
            return (
              <Link to={`/character/${mal_id}`} key={index}>
                <div className="p-4 border-4 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all">
                  <div class="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neutral-50 rounded-tl-2xl" />
                  <div class="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-neutral-50 rounded-tr-2xl" />
                  <div class="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-neutral-50 rounded-bl-2xl" />
                  <div class="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neutral-50 rounded-br-2xl" />
                  <img
                    src={images?.jpg.image_url}
                    alt={name}
                    className="w-full h-56 object-cover border-blue-50 rounded-lg mb-4"
                  />
                  <h4 className="text-lg font-semibold text-white pb-2">
                    {name}
                  </h4>
                  <p className="text-green-500 bg-white p-2 rounded-md w-fit font-general text-xs uppercase">
                    {role}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AnimeItem;
