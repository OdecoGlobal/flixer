import { useEffect, useState } from "react";

import { useMovie } from "./useMovie";
export function useSeriesSeason() {
  const [seasons, setSeasons] = useState([]);
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [isLoading, setSeriesLoading] = useState(false);
  const { media, mediaError: error, API_KEY } = useMovie();

  useEffect(() => {
    if (media) {
      const onlySeries = media
        ?.filter((s) => s.media_type === "tv")
        .map((se) => ({
          name: se.name,
          id: se.id,
          num: se.seasons.map((n) => n.season_number),
        }));
      //

      const fetchSeries = async () => {
        try {
          setSeriesLoading(true);
          const seriesSeasons = onlySeries?.flatMap((series) =>
            series.num.map((seasonNumber) =>
              fetch(
                `https://api.themoviedb.org/3/tv/${series.id}/season/${seasonNumber}?api_key=${API_KEY}`
              ).then((res) => res.json())
            )
          );

          const seasonDetails = await Promise.all(seriesSeasons);

          setSeriesLoading(false);
          setSeasons(seasonDetails);
        } catch (err) {
          setSeriesLoading(false);

          console.error(err);
        }
      };

      fetchSeries();
    }
  }, [media, API_KEY]);

  //   fectching episodes
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const episodePromises = seasons.flatMap((series) => {
          series.episodes.map((ep) => {
            fetch(
              `https://api.themoviedb.org/3/tv/${series.id}/season/${series.season_number}/episode/${ep.episode_number}?api_key=${API_KEY}`
            ).then((res) => res.json());
          });
        });
        const episodeDetails = await Promise.all(episodePromises);
        setNewEpisodes(episodeDetails);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEpisodes();
  }, [seasons, API_KEY]);

  return { seasons, newEpisodes, isLoading, error };
}
/*


    //   console.log(seasonDetails, "oy");

          //   const seriesName = onlySeries?.map((series) => ({
          //     name: series.name,
          //     id: series.id,
          //     details: [...seasonDetails?.slice(0, series.num.length)],
          //   }));
 // const seasonEpisodes = seasons?.flatMap((series) => {
    //   series.episodes.map((ep) => ({
    //     s_id: series.id,
    //     s_num: series.season_number,
    //     e_num: ep.episode_number,
    //   }));
    // });
    // console.log(seasons);
    // console.log(seasonEpisodes);



        const episodePromises = updatedSeasons.flatMap((series) =>
          series.details.map((season) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${series.id}/season/${season.season_number}/episodes?api_key=${API_KEY}`
            ).then((res) => res.json())
          )
        );


        updatedSeasons.forEach((series, seriesIndex) => {
          series.details.forEach((season, seasonIndex) => {
            season.episodes = episodeDetails[seriesIndex * series.details.length + seasonIndex];
          });
        });

        // Update the seasons state with the updated season details containing episodes
        setSeasons(updatedSeasons);

        // Update the episodes state with the fetched episode details
        setEpisodes(episodeDetails);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch episodes of each season only if there are series and seasons available
    if (seasons.length > 0) {
      fetchEpisodes();
    }
  }, [seasons, API_KEY])
 */
