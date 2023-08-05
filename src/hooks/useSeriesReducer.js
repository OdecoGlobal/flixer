import { useEffect, useReducer } from "react";
import { useMovieReducer } from "./useMovieReducer";
const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

const initialState = {
  newSeason: [],
  newEpisodes: [],
  isSeriesLoading: false,
  seriesError: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NEW_SEASON":
      return { ...state, newSeason: action.payload };
    case "SET_NEW_EPISODES":
      return { ...state, newEpisodes: action.payload };
    case "SET_LOADING_STATE":
      return { ...state, isSeriesLoading: action.payload };
    case "SET_ERROR":
      return { ...state, seriesError: action.payload };
  }
};

export default function useSeriesReducer() {
  const { media, isLoading, mediaError } = useMovieReducer();
  const [state, dispatch] = useReducer(reducer, initialState);

  ///////////FETCHIND SEASONS

  useEffect(() => {
    if (media) {
      const onlySeries = media?.filter((series) => series.media_type === "tv");
      const seriesInfo = onlySeries?.flatMap((serie) =>
        serie.seasons.map((season) => ({
          id: serie.id,
          season_number: season.season_number,
        }))
      );
      const fetchSeries = async () => {
        dispatch({ type: "SET_LOADING_STATE", payload: true });
        try {
          const seasonPromise = seriesInfo?.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${API_KEY}`
            )
          );
          const seasonDetails = await Promise.all(
            seasonPromise?.map((promise) =>
              promise.then((res) => {
                if (!res.ok) throw new Error("Series Url Invalid");
                return res.json();
              })
            )
          );
          console.log(seasonDetails, "4");
        } catch (err) {
          console.log(err);
        }
      };
      fetchSeries();
    }
  }, [media]);

  return state;
}

/*



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

 */
