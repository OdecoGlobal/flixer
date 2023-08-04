import { useEffect, useState } from "react";

import { useSeriesSeason } from "../hooks/useSeriesSeason";

export default function NewHero() {
  const { seasons } = useSeriesSeason();

  //   useEffect(() => {
  //     // console.log(seasons, "nop");
  //   }, [seasons]);
}

/*

// styles
// import styles from "./Hero.module.css";
// // assets
// import Play from "../assets/play.svg";
// import Bookmark from "../assets/bookmark.svg";

// const maxWidth = () => {
//   return window.matchMedia("(min-width: 769px)").matches;
// };

// const maxScreen = maxWidth();
  const [visibleText, setVisibleText] = useState(false);
  const [trrailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  // switch movie after 5 secs
  useEffect(() => {
    if (isMouseOver) {
      clearInterval(intervalId);
    }
    if (!isLoading && media.length > 0 && !isMouseOver) {
      const carouselInterval = setInterval(() => {
        setCurrentIndex((prevImage) => (prevImage + 1) % media?.length);
      }, 5000);
      setIntervalId(carouselInterval);
    }
    return () => clearInterval(intervalId);
  }, [media, isLoading, isMouseOver]);

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
      {isLoading && <p>Loading</p>}
      {error && <p>{error}</p>}
      {media &&
        media.slice(0, 10).map((mov, i) => (
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
  );*/
