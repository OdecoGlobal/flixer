import React, { useEffect, useRef, useState } from "react";
import { useMovie } from "../hooks/useMovie";

// styles
import styles from "./Hero.module.css";
// assets
import Play from "../assets/play.svg";
import Bookmark from "../assets/bookmark.svg";

const maxWidth = () => {
  return window.matchMedia("(min-width: 769px)").matches;
};

const maxScreen = maxWidth();

const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie/";

// https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=70161bbcd895dec3c1b8d56d7c36b5fd

export default function Hero() {
  const [visibleText, setVisibleText] = useState(false);
  const [latestMovies, setLatestMovie] = useState([]);
  const [movies, setMovie] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleReadMore = () => {
    setVisibleText(true);
  };

  const { moviesData, moviesLoading, error } = useMovie();
  useEffect(() => {
    if (!moviesLoading && moviesData) {
      const details = moviesData?.results
        .filter((movie) => movie.backdrop_path !== null)
        .slice(0, 10);
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

  {
    /* {playVideo && (
                <video width="560" height="315" controls>
                  <source
                    src={`https://www.youtube.com/watch?v=${playVideo.key}`}
                    type="video/youtube"
                  />
                </video>
              )} */
  }
  // switch movie after 5 secs
  useEffect(() => {
    if (isMouseOver) {
      clearInterval(intervalId);
    }
    if (!moviesLoading && movies.length > 0 && !isMouseOver) {
      const carouselInterval = setInterval(() => {
        setCurrentIndex((prevImage) => (prevImage + 1) % movies?.length);
      }, 5000);
      setIntervalId(carouselInterval);
    }
    return () => clearInterval(intervalId);
  }, [movies, moviesLoading, isMouseOver]);

  const handleInteraction = () => {
    setIsMouseOver(true);
  };
  const handleLeave = () => {
    setIsMouseOver(false);
  };

  const handleTrailer = (trailerKey) => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    }
  };

  return (
    <div
      className={styles.hero}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleLeave}
      onTouchStart={handleInteraction}
      onTouchEnd={handleLeave}
    >
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
              <h2 className={styles.movie_title}>{mov.original_title}</h2>
              <div className={styles.subdetails}>
                <p>{`${Math.floor(mov.runtime / 60)}h${mov.runtime % 60}m`}</p>
                {mov.genres.slice(0, 3).map((genre) => (
                  <p key={genre.id}>{genre.name}</p>
                ))}
              </div>
              {maxScreen ? (
                <p className={styles.overview}>{mov.overview}</p>
              ) : (
                <>
                  <p>
                    {visibleText ? (
                      <p
                        className={styles.overview}
                        onClick={() => setVisibleText(false)}
                      >
                        {mov.overview}
                      </p>
                    ) : (
                      <p className={styles.overview} onClick={handleReadMore}>
                        {mov.overview.substring(0, 70)}
                        <span>...Read More</span>
                      </p>
                    )}
                  </p>
                </>
              )}

              <div className={styles.trailer}>
                <div
                  className={`btn btn_primary`}
                  onClick={() => handleTrailer(mov?.videos?.results[0]?.key)}
                >
                  <img src={Play} alt="watch" />
                  <span>Watch Trailer</span>
                </div>
                <div className={`btn btn_secondary`}>
                  <img src={Bookmark} alt="watch" />
                  <span>Bookmark</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

/* <source src="={`https://www.youtube.com/embeded/${playMovie.trailerKey}`}" /> */
