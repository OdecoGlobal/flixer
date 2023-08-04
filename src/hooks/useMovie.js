import { useState, useEffect, useRef } from "react";
import { useFetch } from "./useFetch";
export function useMovie() {
  const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 3;
  const [latestMedia, setLatestMedia] = useState([]);
  //   const [allMedia, setAllMedia] = useState([])
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [mediaError, setMediaError] = useState(null);

  const {
    data: moviesData,
    isPending: moviesLoading,
    error,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  const {
    data: seriesData,
    isPending: seriesLoading,
    seriesError,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/tv/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  //   setIsLoading(moviesLoading || seriesLoading);
  //   setMediaError(error || seriesError);
  const _allMedia = [
    ...(moviesData
      ? moviesData.results.map((item) => ({ ...item, media_type: "movie" }))
      : []),
    ...(seriesData
      ? seriesData.results.map((item) => ({ ...item, media_type: "series" }))
      : []),
  ];

  const allMedia = useRef(_allMedia).current;
  useEffect(() => {
    if (!seriesLoading && allMedia) {
      const details = moviesData?.results.filter(
        (movie) => movie.backdrop_path !== null
      );
      setLatestMedia(details);
    }
  }, [moviesLoading, allMedia]);

  return {
    moviesData,
    allMedia,
    moviesLoading,
    error,
    seriesData,
    seriesLoading,
    seriesError,
    API_KEY,
  };
}
