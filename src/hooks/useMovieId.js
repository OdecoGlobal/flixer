import { useState, useEffect } from "react";

import { useMovie } from "../hooks/useMovie";
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

export default function useMovieId() {
  const [latestMovies, setLatestMovie] = useState([]);
  const [movies, setMovie] = useState([]);

  const { moviesData, allMedia, moviesLoading, error, API_KEY } = useMovie();
  console.log(allMedia);

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
  return { latestMovies, moviesLoading, error, movies };
}
