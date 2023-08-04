import { useState, useEffect } from "react";
import { useFetch } from "./useFetch";
// import { useMovie } from "../hooks/useMovie";
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

export default function useMovieId() {
  const [latestMovies, setLatestMovie] = useState([]);
  const [movies, setMovie] = useState([]);
  const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 3;

  const {
    data: moviesData,
    isPending: moviesLoading,
    error,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  useEffect(() => {
    if (!moviesLoading && moviesData) {
      const details = moviesData?.results.filter(
        (movie) => movie.backdrop_path !== null
      );
      setLatestMovie(details);
    }
  }, [moviesLoading, moviesData]);

  useEffect(() => {
    if (!moviesLoading && latestMovies) {
      const moviesId = latestMovies.map((movie) => movie.id);

      const fetchMovieData = async () => {
        try {
          const moviePromise = moviesId?.map((id) =>
            fetch(
              `${BASE_MOVIE_URL}${id}?api_key=${API_KEY}&append_to_response=videos`
            )
          );

          const movieDetails = await Promise.all(
            moviePromise?.map((promise) => promise.then((res) => res.json()))
          );
          setMovie(movieDetails);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchMovieData();
    }
  }, [moviesLoading, latestMovies]);
  return { moviesLoading, error, movies };
}
