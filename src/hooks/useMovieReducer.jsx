import { useReducer, useEffect } from "react";
import { useFetch } from "./useFetch";

const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

// INITIAL STATE
const initialState = {
  latestMedia: [],
  allMedia: [],
  mediaError: null,
  isLoading: false,
  media: [],
};

// REDUCER FUNCTION
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALL_MEDIA":
      return { ...state, allMedia: action.payload };
    case "SET_LATEST_MEDIA":
      return { ...state, latestMedia: action.payload };
    case "SET_MEDIA_ERROR":
      return { ...state, mediaError: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MEDIA":
      return { ...state, media: action.payload };
    default:
      return state;
  }
};

/*  */
export function useMovieReducer() {
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 10;
  ////////////////////FETCH MOVIES AND SERIES USING USEFETCH()
  const {
    data: moviesData,
    isPending: moviesLoading,
    error: moviesError,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  const {
    data: seriesData,
    isPending: seriesLoading,
    seriesError,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/tv/?&include_video_language=en&first_air_date_year=2015&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  ////////////////
  useEffect(() => {
    if (!seriesLoading && !moviesLoading) {
      const combinedData = [
        ...(moviesData
          ? moviesData.results.map((item) => ({
              ...item,
              media_type: "movie",
            }))
          : []),
        ...(seriesData
          ? seriesData.results.map((item) => ({
              ...item,
              media_type: "tv",
            }))
          : []),
      ];
      dispatch({ type: "SET_ALL_MEDIA", payload: combinedData });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [moviesData, seriesData]);

  useEffect(() => {
    if (moviesError || seriesError) {
      dispatch({
        type: "SET_MEDIA_ERROR",
        payload: moviesError || seriesError,
      });
    }
  }, [moviesError, seriesError]);

  //   filtering those without backdrop
  useEffect(() => {
    if (!state.isLoading && state.allMedia) {
      const detail = state.allMedia?.filter(
        (movie) => movie.backdrop_path !== null
      );
      dispatch({ type: "SET_LATEST_MEDIA", payload: detail });
    }
  }, [state.allMedia]);

  useEffect(() => {
    const controller = new AbortController();
    if (!state.isLoading && state.latestMedia) {
      const mediaInfo = state.latestMedia?.map((mov) => ({
        id: mov.id,
        type: mov.media_type,
      }));

      const fetchMovieData = async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
          const mediaPromise = mediaInfo.map(({ id, type }) =>
            fetch(
              `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=videos`,
              { signal: controller.signal }
            )
          );
          const mediaResponse = await Promise.all(
            mediaPromise?.map((promise) =>
              promise.then((res) => {
                if (!res.ok) {
                  throw new Error(res.statusText);
                }
                return res.json();
              })
            )
          );
          const mediaDetails = mediaResponse.map((data, i) => ({
            ...data,
            media_type: state.latestMedia[i].media_type,
          }));

          dispatch({ type: "SET_LOADING", payload: false });
          dispatch({ type: "SET_MEDIA", payload: mediaDetails });

          dispatch({ type: "SET_MEDIA_ERROR", payload: null });
        } catch (err) {
          if (err.name === "AbortError") {
            dispatch({
              type: "SET_MEDIA_ERROR",
              payload: "the fetch was aborted",
            });
          } else {
            dispatch({ type: "SET_LOADING", payload: false });
            dispatch({
              type: "SET_MEDIA_ERROR",
              payload: "Could not fetch the data",
            });
          }

          console.error(err);
        }
      };
      fetchMovieData();
      return () => {
        controller.abort();
      };
    }
  }, [state.latestMedia]);

  return state;
}
