import React, { useEffect, useRef, useState } from 'react';
import useMovieId from '../hooks/useMovieId';

// styles
import styles from './Hero.module.css';
// assets
import Play from '../assets/play.svg';
import Bookmark from '../assets/bookmark.svg';
import { useMovieReducer } from '../hooks/useMovieReducer';
import { useMovie } from '../hooks/useMovie';

const maxWidth = () => {
  return window.matchMedia('(min-width: 769px)').matches;
};

const maxScreen = maxWidth();

export default function Hero() {
  const [visibleText, setVisibleText] = useState(false);
  const [trrailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const {
  //   media: movies,
  //   mediaError,
  //   isLoading: moviesLoading,
  // } = useMovieReducer();

  const {
    media: movies,
    mediaError,
    mediaLoading: moviesLoading,
  } = useMovie('');
  useEffect(() => {
    if (movies) console.log(movies);
  }, [movies]);
  // switch movie after 10 secs
  useEffect(() => {
    if (isMouseOver) {
      clearInterval(intervalId);
    }
    if (!moviesLoading && movies.length > 0 && !isMouseOver) {
      const carouselInterval = setInterval(() => {
        setCurrentIndex(prevImage => (prevImage + 1) % movies?.length);
      }, 10000);
      setIntervalId(carouselInterval);
    }
    return () => clearInterval(intervalId);
  }, [movies, moviesLoading, isMouseOver]);

  const formatRuntime = runtime => {
    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;
    return `${hours}h${mins}m`;
  };

  // click functions
  const handleReadMore = () => {
    setVisibleText(true);
  };

  const handleInteraction = () => {
    setIsMouseOver(true);
  };

  const handleLeave = () => {
    setIsMouseOver(false);
  };

  const handleTrailer = trailerKey => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
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
      {mediaError && <p>{mediaError}</p>}
      {movies &&
        movies.map((mov, i) => (
          <div
            key={i}
            className={`${styles.imgContainer} ${
              i === currentIndex ? styles['active'] : ''
            }`}
          >
            <div className={styles.overlay}></div>

            <img
              src={`https://image.tmdb.org/t/p/original${mov.backdrop_path}`}
              className={styles.backdrop}
              loading="lazy"
            />
            <div className={styles.hero_details}>
              <h2 className={styles.movie_title}>
                {mov.media_type === 'movie' ? mov.original_title : mov.name}
              </h2>
              <p className={styles.type}>
                {mov.media_type === 'movie' ? 'Movie' : 'Series'}
              </p>
              <div className={styles.subdetails}>
                <p>{formatRuntime(mov.runtime || mov.episode_run_time)}</p>
                {mov.genres.slice(0, 3).map(genre => (
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
