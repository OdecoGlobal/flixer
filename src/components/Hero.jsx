import React, { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import styles from "./Hero.module.css";

const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

export default function Hero() {
  // const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";
  const [latestMovies, setLatestMovie] = useState([]);
  const [movies, setMovie] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;
  // console.log(currentYear, prevYear);
  // const latestMovies = useRef(_latestMovies).current;

  const {
    data: moviesData,
    isPending: moviesLoading,
    error,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  useEffect(() => {
    if (!moviesLoading && moviesData) {
      const details = moviesData?.results
        .filter((movie) => movie.backdrop_path !== null)
        .slice(0, 5);
      setLatestMovie(details);
    }
  }, [moviesLoading, moviesData]);
  // console.log(latestMovies); &append_to_response=videos
  useEffect(() => {
    if (!moviesLoading && latestMovies) {
      const moviesId = latestMovies.map((movie) => movie.id);

      const fetchMovieData = async () => {
        try {
          {
            const moviePromise = moviesId?.map((id) =>
              fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
              )
            );

            const movieDetails = await Promise.all(
              moviePromise?.map((promise) => promise.then((res) => res.json()))
            );
            setMovie(movieDetails);
          }
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchMovieData();
    }
  }, [moviesLoading, latestMovies]);
  // console.log(movies);

  useEffect(() => {
    if (!moviesLoading && movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevImage) => (prevImage + 1) % movies?.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies, moviesLoading]);

  return (
    <div className={styles.hero}>
      {moviesLoading && <p>Loading</p>}
      {error && <p>{error}</p>}
      {movies &&
        movies.map((mov, i) => (
          <div
            key={i}
            className={`${styles.imgContainer} ${
              i === currentIndex ? styles["active"] : ""
            }`}
          >
            <div className={styles.overlay}></div>

            <img
              src={`https://image.tmdb.org/t/p/original${mov.backdrop_path}`}
              className={styles.backdrop}
              loading="lazy"
            />
            <div className={styles.hero_details}>
              <h2>{mov.original_title}</h2>
              <div>
                <p>{`${Math.floor(mov.runtime / 60)}h${mov.runtime % 60}m`}</p>
                {mov.genres.map((genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </div>
              <p>{mov.overview}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
