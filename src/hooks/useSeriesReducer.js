import { useEffect, useReducer } from "react";
import { useMovieReducer } from "./useMovieReducer";
const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

const initialState = {
  newSeason: [],
  newEpisodes: [],
  isSeriesLoading: false,
  seriesError: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NEW_SEASON":
      return { ...state, newSeason: action.payload };
    case "SET_NEW_EPISODES":
      return { ...state, newEpisodes: action.payload };
    case "SET_LOADING_STATE":
      return { ...state, isSeriesLoading: action.payload };
    case "SET_ERROR":
      return { ...state, seriesError: action.payload };
    default:
      return state;
  }
};

export default function useSeriesReducer() {
  const { media, isLoading, mediaError } = useMovieReducer();
  const [state, dispatch] = useReducer(reducer, initialState);

  ///////////FETCHIND SEASONS

  useEffect(() => {
    if (media && !isLoading) {
      const onlySeries = media?.filter((series) => series.media_type === "tv");
      const seriesInfo = onlySeries?.flatMap((serie) =>
        serie.seasons.map((season) => ({
          id: serie.id,
          season_number: season.season_number,
        }))
      );
      const fetchSeries = async () => {
        dispatch({ type: "SET_LOADING_STATE", payload: true });
        try {
          const seasonPromise = seriesInfo?.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${API_KEY}`
            )
          );
          const seasonDetails = await Promise.all(
            seasonPromise?.map((promise) =>
              promise.then((res) => {
                if (!res.ok) throw new Error("Series Url Invalid");
                return res.json();
              })
            )
          );
          console.warn(seasonDetails);
          dispatch({ type: "SET_LOADING_STATE", payload: false });
          dispatch({ type: "SET_NEW_SEASON", payload: seasonDetails });
          dispatch({ type: "SET_ERROR", payload: null });
        } catch (err) {
          dispatch({ type: "SET_ERROR", payload: err });
          dispatch({ type: "SET_LOADING_STATE", payload: false });
        }
      };
      fetchSeries();
    }
  }, [media]);

  return state;
}
