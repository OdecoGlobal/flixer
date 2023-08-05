import { useEffect, useReducer } from "react";
import { useMovie } from "./useMovie";

const initialState = {
  newSeasons: [],
  newEpisodes: [],
  isSeriesLoading: false,
  isEpisodeLoading: false,
  error: null,
  seriesPage: 1,
  episodePage: 1,
  selectedSeries: null,
  selectedSeason: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SERIES_START":
      return { ...state, isSeriesLoading: true, error: null };
    case "FETCH_SERIES_SUCCESS":
      return {
        ...state,
        isSeriesLoading: false,
        newSeasons: action.payload,
      };
    case "FETCH_SERIES_ERROR":
      return { ...state, isSeriesLoading: false, error: action.payload };

    case "FETCH_EPISODES_START":
      return { ...state, isEpisodeLoading: true, error: null };
    case "FETCH_EPISODES_SUCCESS":
      return {
        ...state,
        isEpisodeLoading: false,
        newEpisodes: action.payload,
      };
    case "FETCH_EPISODES_ERROR":
      return { ...state, isEpisodeLoading: false, error: action.payload };

    case "SET_SERIES_PAGE":
      return { ...state, seriesPage: action.payload, selectedSeason: null };
    case "SET_EPISODE_PAGE":
      return { ...state, episodePage: action.payload };

    case "SET_SELECTED_SERIES":
      return { ...state, selectedSeries: action.payload, selectedSeason: null };
    case "SET_SELECTED_SEASON":
      return { ...state, selectedSeason: action.payload };

    default:
      return state;
  }
};

export function usePaginate() {
  const { media, mediaError, API_KEY } = useMovie();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    newSeasons,
    newEpisodes,
    isSeriesLoading,
    isEpisodeLoading,
    error,
    seriesPage,
    episodePage,
    selectedSeries,
    selectedSeason,
  } = state;

  useEffect(() => {
    if (media) {
      const onlySeries = media?.filter((s) => s.media_type === "tv");

      const seriesInfo = onlySeries.flatMap((series) =>
        series.seasons.map((season) => ({
          id: series.id,
          season_number: season.season_number,
        }))
      );

      const fetchSeries = async () => {
        dispatch({ type: "FETCH_SERIES_START" });
        try {
          const paginatedSeries = seriesInfo.slice(
            (seriesPage - 1) * 10,
            seriesPage * 10
          );

          const seriesPromises = paginatedSeries.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${API_KEY}`
            )
          );

          const seriesDetails = await Promise.all(
            seriesPromises.map((promise) => promise.then((res) => res.json()))
          );

          dispatch({ type: "FETCH_SERIES_SUCCESS", payload: seriesDetails });
        } catch (err) {
          dispatch({ type: "FETCH_SERIES_ERROR", payload: err });
        }
      };
      fetchSeries();
    }
  }, [media, API_KEY, seriesPage]);

  useEffect(() => {
    if (selectedSeries && selectedSeason) {
      const fetchEpisodes = async () => {
        dispatch({ type: "FETCH_EPISODES_START" });
        try {
          const url = `https://api.themoviedb.org/3/tv/${selectedSeries.id}/season/${selectedSeason.season_number}?language=en-US&api_key=${API_KEY}`;
          const response = await fetch(url);
          const data = await response.json();
          dispatch({ type: "FETCH_EPISODES_SUCCESS", payload: data.episodes });
        } catch (err) {
          dispatch({ type: "FETCH_EPISODES_ERROR", payload: err });
        }
      };
      fetchEpisodes();
    }
  }, [selectedSeries, selectedSeason, API_KEY]);

  const handleSeriesClick = (series) => {
    dispatch({ type: "SET_SELECTED_SERIES", payload: series });
    dispatch({ type: "SET_SELECTED_SEASON", payload: null });
  };

  const handleSeasonClick = (season) => {
    dispatch({ type: "SET_SELECTED_SEASON", payload: season });
  };

  return {
    newSeasons,
    newEpisodes,
    isSeriesLoading,
    isEpisodeLoading,
    error: mediaError || error,
    seriesPage,
    setSeriesPage: (page) =>
      dispatch({ type: "SET_SERIES_PAGE", payload: page }),
    episodePage,
    setEpisodePage: (page) =>
      dispatch({ type: "SET_EPISODE_PAGE", payload: page }),
    handleSeriesClick,
    handleSeasonClick,
    selectedSeries,
    selectedSeason,
  };
}
