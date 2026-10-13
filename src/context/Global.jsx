import { createContext, useContext, useReducer, useState, useEffect } from 'react';
import {
  getTopAnime,
  searchAnimeApi,
  getCharacterPictures,
  getCharacterById,
  getCharacterFullById,
  getCharacterAnime,
  getCharacterVoiceActors,
} from '../services/tenraiService';

const GlobalContext = createContext();

// ── Action types ──────────────────────────────────────────────────────────────
const LOADING           = 'LOADING';
const SEARCH            = 'SEARCH';
const GET_POPULAR_ANIME = 'GET_POPULAR_ANIME';
const GET_UPCOMING_ANIME= 'GET_UPCOMING_ANIME';
const GET_AIRING_ANIME  = 'GET_AIRING_ANIME';
const GET_PICTURES      = 'GET_PICTURES';
const GET_CHARACTER     = 'GET_CHARACTER';
const SET_RENDERED      = 'SET_RENDERED';
const SET_SEARCHING     = 'SET_SEARCHING';
const ERROR             = 'ERROR';

// ── Reducer ───────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:           return { ...state, loading: true,  error: '' };
    case GET_POPULAR_ANIME: return { ...state, popularAnime:  action.payload, loading: false };
    case SEARCH:            return { ...state, searchResults: action.payload, loading: false };
    case GET_UPCOMING_ANIME:return { ...state, upcomingAnime: action.payload, loading: false };
    case GET_AIRING_ANIME:  return { ...state, airingAnime:   action.payload, loading: false };
    case GET_PICTURES:      return { ...state, pictures: action.payload.pictures, characterName: action.payload.name, loading: false };
    case GET_CHARACTER:     return { ...state, character: action.payload, loading: false };
    case SET_RENDERED:      return { ...state, rendered:  action.payload };
    case SET_SEARCHING:     return { ...state, isSearch:  action.payload };
    case ERROR:             return { ...state, error: action.payload, loading: false };
    default:                return state;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const GlobalContextProvider = ({ children }) => {
  const initialState = {
    popularAnime:  [],
    upcomingAnime: [],
    airingAnime:   [],
    pictures:      [],
    searchResults: [],
    character:     null,
    loading:       false,
    error:         '',
    isSearch:      false,
    rendered:      'popular',
    characterName: '',
  };

  const [state,  dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState('');

  // ── Search input handlers ────────────────────────────────────────────────
  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') dispatch({ type: SET_SEARCHING, payload: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      searchAnime(search);
      dispatch({ type: SET_SEARCHING, payload: true });
    } else {
      dispatch({ type: SET_SEARCHING, payload: false });
      alert('Please enter a search term');
    }
  };

  // ── Shared error handler ─────────────────────────────────────────────────
  const handleError = (error) => {
    console.error('Tenrai request failed:', error);
    dispatch({
      type:    ERROR,
      payload: error instanceof Error ? error.message : 'Unable to load anime data.',
    });
  };

  // ── Data fetchers — all use jikanService (cache + throttle + retry) ──────
  const getPopularAnime = async () => {
    dispatch({ type: LOADING });
    try {
      const data = await getTopAnime('bypopularity');
      dispatch({ type: GET_POPULAR_ANIME, payload: data.data || [] });
    } catch (e) { handleError(e); }
  };

  const getUpcomingAnime = async () => {
    dispatch({ type: LOADING });
    try {
      const data = await getTopAnime('upcoming');
      dispatch({ type: GET_UPCOMING_ANIME, payload: data.data || [] });
    } catch (e) { handleError(e); }
  };

  const getAiringAnime = async () => {
    dispatch({ type: LOADING });
    try {
      const data = await getTopAnime('airing');
      dispatch({ type: GET_AIRING_ANIME, payload: data.data || [] });
    } catch (e) { handleError(e); }
  };

  const searchAnime = async (query) => {
    dispatch({ type: LOADING });
    try {
      const data = await searchAnimeApi(query);
      dispatch({ type: SEARCH, payload: data.data || [] });
    } catch (e) { handleError(e); }
  };

  const getAnimePictures = async (id) => {
    dispatch({ type: LOADING });
    try {
      // Fire pictures + basic character info in parallel
      const [picsRes, charRes] = await Promise.allSettled([
        getCharacterPictures(id),
        getCharacterById(id),
      ]);
      dispatch({
        type: GET_PICTURES,
        payload: {
          pictures: picsRes.status === 'fulfilled' ? (picsRes.value.data || []) : [],
          name:     charRes.status === 'fulfilled' ? (charRes.value.data?.name ?? '') : '',
        },
      });
    } catch (e) { handleError(e); }
  };

  const getCharacterFull = async (id) => {
    dispatch({ type: LOADING });
    try {
      const [charRes, picsRes, voicesRes, animeRes] = await Promise.allSettled([
        getCharacterFullById(id),
        getCharacterPictures(id),
        getCharacterVoiceActors(id),
        getCharacterAnime(id),
      ]);
      dispatch({
        type: GET_CHARACTER,
        payload: {
          full:    charRes.status   === 'fulfilled' ? charRes.value.data   : null,
          pictures:picsRes.status   === 'fulfilled' ? picsRes.value.data   : [],
          voices:  voicesRes.status === 'fulfilled' ? voicesRes.value.data : [],
          anime:   animeRes.status  === 'fulfilled' ? animeRes.value.data  : [],
        },
      });
    } catch (e) { handleError(e); }
  };

  const setRendered = (value) => dispatch({ type: SET_RENDERED, payload: value });

  // ── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => { getPopularAnime(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        isLoading: state.loading,
        search,
        setSearch,
        handleChange,
        handleSubmit,
        searchAnime,
        getPopularAnime,
        getUpcomingAnime,
        getAiringAnime,
        getAnimePictures,
        getCharacterFull,
        setRendered,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
