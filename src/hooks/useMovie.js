import { useState, useEffect } from "react";
import { useFetch } from "./useFetch";

const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

export function useMovie() {
  const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 10;
  const [latestMedia, setLatestMedia] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [media, setMedia] = useState([]);

  //   Fetching the movies and series
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
    `https://api.themoviedb.org/3/discover/tv/?&include_video_language=en&first_air_date_year=2015&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  // combining data
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
      setAllMedia(combinedData);
      setIsLoading(false);
    }
  }, [moviesData, moviesLoading, seriesData, seriesLoading]);

  //   Combining the Errors
  useEffect(() => {
    if (error || seriesError) {
      setMediaError(error || seriesError);
    }
  }, []);

  //   filtering those without backdrop
  useEffect(() => {
    if (!isLoading && allMedia) {
      const detail = allMedia?.filter((movie) => movie.backdrop_path !== null);
      setLatestMedia(detail);
    }
  }, [isLoading, allMedia]);

  //   getting id and movietype
  useEffect(() => {
    if (!isLoading && latestMedia) {
      const mediaInfo = latestMedia.map((movie) => ({
        id: movie.id,
        type: movie.media_type,
      }));
      console.log(latestMedia, "0");
      const fetchMovieData = async () => {
        setIsLoading(true);
        try {
          const mediaPromise = mediaInfo?.map(({ id, type }) =>
            fetch(
              `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=videos`
            )
          );

          const mediaDetails = await Promise.all(
            mediaPromise?.map((promise) => promise.then((res) => res.json()))
          );
          const mediaDetailType = mediaDetails.map((data, i) => ({
            ...data,
            media_type: latestMedia[i].media_type,
          }));
          setIsLoading(false);
          setMedia(mediaDetailType);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchMovieData();
    }
  }, [moviesLoading, latestMedia]);

  return {
    isLoading,
    mediaError,
    media,
    API_KEY,
  };
}
