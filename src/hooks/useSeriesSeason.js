import { useEffect, useState } from "react";

import { useMovie } from "./useMovie";
export function useSeriesSeason() {
  const [newSeasons, setNewSeasons] = useState([]);
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [isSeriesLoading, setSeriesLoading] = useState(false);
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

          const seasonWithSeriesId = seasonDetails.map((data, i) => ({
            ...data,
            series_id: seriesInfo[i].id,
          }));
          setSeriesLoading(false);
          setNewSeasons(seasonWithSeriesId);
        } catch (err) {
          setSeriesLoading(false);
          console.error(err);
        }
      };
      fetchSeries();
    }
  }, [media, API_KEY]);

  ///////////////////////////////EPISODES

  useEffect(() => {
    if (newSeasons) {
      const episodesInfo = newSeasons?.flatMap((season) =>
        season.episodes.map((episode) => ({
          id: season.series_id,
          season_number: season.season_number,
          episode_number: episode.episode_number,
        }))
      );

      // console.log(episodesInfo);
      const fetchEpisodes = async () => {
        setIsEpisodeLoading(true);
        try {
          const episodePromises = episodesInfo?.map(
            ({ id, season_number, episode_number }) =>
              fetch(
                `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}?language=en-US&api_key=${API_KEY}`
              )
          );
          const episodeDetails = await Promise.all(
            episodePromises?.map((promise) => promise.then((res) => res.json()))
          );
          setIsEpisodeLoading(false);
          setNewEpisodes(episodeDetails);
        } catch (err) {
          console.error(err);
        }
      };
      fetchEpisodes();
    }
  }, [newSeasons, API_KEY]);

  return { newSeasons, newEpisodes, isSeriesLoading, isEpisodeLoading, error };
}
