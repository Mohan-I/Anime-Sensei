import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

const GlobalContext = createContext();

const baseUrl = 'https://api.jikan.moe/v4';

// Action types
const LOADING = 'LOADING';
const SEARCH = 'SEARCH';
const GET_POPULAR_ANIME = 'GET_POPULAR_ANIME';
const GET_UPCOMING_ANIME = 'GET_UPCOMING_ANIME';
const GET_AIRING_ANIME = 'GET_AIRING_ANIME';
const GET_PICTURES = 'GET_PICTURES';
const SET_RENDERED = 'SET_RENDERED';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case GET_POPULAR_ANIME:
      return { ...state, popularAnime: action.payload, loading: false };
    case SEARCH:
      return { ...state, searchResults: action.payload, loading: false };
    case GET_UPCOMING_ANIME:
      return { ...state, upcomingAnime: action.payload, loading: false };
    case GET_AIRING_ANIME:
      return { ...state, airingAnime: action.payload, loading: false };
    case GET_PICTURES:
      // We now store both pictures and character's name
      return { ...state, pictures: action.payload.pictures, characterName: action.payload.name, loading: false };
    case SET_RENDERED:
      return { ...state, rendered: action.payload };
    default:
      return state;
  }
};

// GlobalContextProvider
export const GlobalContextProvider = ({ children }) => {
  const initialState = {
    popularAnime: [],
    upcomingAnime: [],
    airingAnime: [],
    pictures: [],
    searchResults: [],
    loading: false,
    rendered: 'popular', // Default rendered value
    characterName: '', // Added character name to state
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState('');

  // Handle input change for search
  const handleChange = (e) => {
    setSearch(e.target.value);
    if(e.target.value === ''){
        state.isSearch = false;
    }
}

  // Handle form submit for search
  const handleSubmit = (e) => {
    e.preventDefault();
    if(search){
        searchAnime(search);
        state.isSearch = true;
    }else{
        state.isSearch = false;
        alert('Please enter a search term')
    }
}

  // Fetch popular anime
  const getPopularAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
    const data = await response.json();
    dispatch({ type: GET_POPULAR_ANIME, payload: data.data });
  };

  // Fetch upcoming anime
  const getUpcomingAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
    const data = await response.json();
    dispatch({ type: GET_UPCOMING_ANIME, payload: data.data });
  };

  // Fetch airing anime
  const getAiringAnime = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
    const data = await response.json();
    dispatch({ type: GET_AIRING_ANIME, payload: data.data });
  };

  // Search for anime by title
  const searchAnime = async (anime) => {
    dispatch({ type: LOADING });
    const response = await fetch(`${baseUrl}/anime?q=${anime}&order_by=popularity&sort=asc&sfw`);
    const data = await response.json();
    dispatch({ type: SEARCH, payload: data.data });
  };

  // Get anime pictures and character's name
  const getAnimePictures = async (id) => {
    dispatch({ type: LOADING });
    const response = await fetch(`${baseUrl}/characters/${id}/pictures`);
    const data = await response.json();

    // Assuming the character's name is available here
    const characterName = data.data?.character?.name;

    dispatch({
      type: GET_PICTURES,
      payload: {
        pictures: data.data,
        name: characterName,
      },
    });
  };

  // Set the rendered state (for switching components)
  const setRendered = (renderedValue) => {
    dispatch({ type: SET_RENDERED, payload: renderedValue });
  };

  // Initial fetch for popular anime
  useEffect(() => {
    getPopularAnime();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        search,
        setSearch,
        handleChange,
        handleSubmit,
        searchAnime,
        getPopularAnime,
        getUpcomingAnime,
        getAiringAnime,
        getAnimePictures,
        setRendered,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use global context
export const useGlobalContext = () => useContext(GlobalContext);
