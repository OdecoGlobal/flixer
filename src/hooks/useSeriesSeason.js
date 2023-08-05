import { useEffect, useState } from "react";

import { useMovie } from "./useMovie";
export function useSeriesSeason() {
  const [newSeasons, setNewSeasons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

      const fetchSeries = async (page) => {
        setSeriesLoading(true);
        try {
          const seasonPromise = seriesInfo?.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${API_KEY}&page=${page}`
            )
          );
          const seasonResponse = await Promise.all(seasonPromise);
          const seasonDetails = await Promise.all(
            seasonResponse?.map((promise) => promise.then((res) => res.json()))
          );

          const seasonWithSeriesId = seasonDetails.map((data, i) => ({
            ...data,
            series_id: seriesInfo[i].id,
          }));
          setSeriesLoading(false);
          setNewSeasons((prevSeason) => [...prevSeason, seasonWithSeriesId]);
          const totalPages =
            seasonResponse.length > 0 ? seasonResponse[0].total_pages : 0;
          if (page < totalPages) {
            setCurrentPage(page + 1);
            fetchSeries(page + 1);
          }
        } catch (err) {
          setSeriesLoading(false);
          console.error(err);
        }
      };
      setCurrentPage(1);
      setNewSeasons([]);
      fetchSeries(1);
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
      const fetchEpisodes = async (page) => {
        setIsEpisodeLoading(true);
        try {
          const episodePromises = episodesInfo?.map(
            ({ id, season_number, episode_number }) =>
              fetch(
                `https://api.themoviedb.org/3/tv/${id}/season/${season_number}/episode/${episode_number}?language=en-US&api_key=${API_KEY}&page=${page}`
              )
          );
          const episodeResponse = await Promise.all(episodePromises);
          const episodeDetails = await Promise.all(
            episodeResponse?.map((promise) => promise.then((res) => res.json()))
          );
          setIsEpisodeLoading(false);
          setNewEpisodes((prevEpisode) => [...prevEpisode, episodeDetails]);
          const totalPages =
            episodeResponse.length > 0 ? episodeResponse[0].total_pages : 0;
          if (page < totalPages) {
            setCurrentPage(page + 1);
            fetchEpisodes(page + 1);
          }
        } catch (err) {
          console.error(err);
        }
      };
      setCurrentPage(1);
      setNewEpisodes([]);
      fetchEpisodes(1);
    }
  }, [newSeasons, API_KEY]);

  return { newSeasons, newEpisodes, isSeriesLoading, isEpisodeLoading, error };
}
