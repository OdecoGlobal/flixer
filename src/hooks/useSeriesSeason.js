import { useEffect, useState } from "react";

import { useMovie } from "./useMovie";
export function useSeriesSeason() {
  const [newSeasons, setNewSeasons] = useState([]);
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [seriesIdAndName, setSeriesIdAndName] = useState([]);
  const [isLoading, setSeriesLoading] = useState(false);
  const [isEpisodeLoading, setIsEpisodeLoading] = useState(false);
  const { media, mediaError: error, API_KEY } = useMovie();

  useEffect(() => {
    if (media) {
      const onlySeries = media?.filter((s) => s.media_type === "tv");

      const seriesInfo = onlySeries.flatMap((series) =>
        series.seasons.map((season) => ({
          id: series.id,
          season_number: season.season_number,
        }))
      );

      const fetchSeries = async () => {
        setSeriesLoading(true);
        try {
          const seasonPromise = seriesInfo?.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${API_KEY}`
            )
          );
          const seasonDetails = await Promise.all(
            seasonPromise?.map((promise) => promise.then((res) => res.json()))
          );
          setSeriesLoading(false);
          setNewSeasons(seasonDetails);
        } catch (err) {
          setSeriesLoading(false);
          console.error(err);
        }
      };
      fetchSeries();
      setSeriesIdAndName(seriesInfo);
    }
  }, [media, API_KEY]);

  ///////////////////////////////EPISODES

  useEffect(() => {
    if (newSeasons) {
      const episodesInfo = newSeasons?.flatMap((season) =>
        season.episodes.map((episode) => ({
          ...seriesIdAndName,
          episode_number: episode.episode_number,
        }))
      );

      console.log(episodesInfo);
      // const fetchEpisodes = async () => {
      //   setIsEpisodeLoading(true);
      //   try {
      //     const episodePromises = episodesInfo?.map(
      //       ({ id, season_number, episode_number }) =>
      //         fetch(
      //           `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}?api_key=${API_KEY}`
      //         )
      //     );
      //     const episodeDetails = await Promise.all(
      //       episodePromises?.map((promise) => promise.then((res) => res.json()))
      //     );
      //     setIsEpisodeLoading(false);
      //     console.log(episodeDetails, "p");
      //   } catch (err) {
      //     console.error(err);
      //   }
      // };
      // fetchEpisodes();
    }
  }, [newSeasons, API_KEY, seriesIdAndName]);

  return { newSeasons, newEpisodes, isLoading, error };
}
