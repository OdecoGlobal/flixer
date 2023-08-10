import { useEffect, useReducer } from 'react';
import { useMovieReducer } from './useMovieReducer';
const API_KEY = '70161bbcd895dec3c1b8d56d7c36b5fd';

const initialState = {
  series: [],
  newSeason: [],
  isSeriesLoading: false,
  seriesError: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NEW_SEASON':
      return { ...state, newSeason: action.payload };
    case 'SET_SERIES':
      return { ...state, series: action.payload };
    case 'SET_LOADING_STATE':
      return { ...state, isSeriesLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, seriesError: action.payload };
    default:
      return state;
  }
};

export function useSeriesReducer() {
  const { media, isLoading } = useMovieReducer();
  const [state, dispatch] = useReducer(reducer, initialState);

  ///////////FETCHING SEASONS

  useEffect(() => {
    if (media && !isLoading) {
      const onlySeries = media?.filter(series => series.media_type === 'tv');
      dispatch({ type: 'SET_SERIES', payload: onlySeries });
      const seriesInfo = onlySeries?.flatMap(serie =>
        serie.seasons.map(season => ({
          id: serie.id,
          season_number: season.season_number,
        }))
      );
      const fetchSeries = async () => {
        dispatch({ type: 'SET_LOADING_STATE', payload: true });
        try {
          const seasonPromise = seriesInfo?.map(({ id, season_number }) =>
            fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?append_to_response=videos&api_key=${API_KEY}`
            )
          );
          const seasonDetails = await Promise.all(
            seasonPromise?.map(promise =>
              promise.then(res => {
                if (!res.ok) throw new Error('Series Url Invalid');
                return res.json();
              })
            )
          );
          const seasonWithSeriesId = seasonDetails.map((data, i) => ({
            ...data,
            series_id: seriesInfo[i].id,
          }));

          //////////////////////////////////// CREATIN AN ARRAY OF SEASONS AND ID AND NAME
          const newSeasonData = (() => {
            const newSeriesSeasonsMap = {};
            seasonWithSeriesId.forEach(season => {
              const matchingSeries = onlySeries.find(
                ({ id }) => id === season.series_id
              );
              if (matchingSeries) {
                const { name } = matchingSeries;
                if (!newSeriesSeasonsMap[name]) {
                  newSeriesSeasonsMap[name] = [];
                }
                newSeriesSeasonsMap[name].push(season);
              }
            });

            const newSeasonWithId = Object.keys(newSeriesSeasonsMap).map(
              name => ({
                name,
                seasons: newSeriesSeasonsMap[name],
                id: onlySeries.find(
                  ({ name: seriesName }) => seriesName === name
                ).id,
              })
            );

            return newSeasonWithId;
          })();

          dispatch({ type: 'SET_LOADING_STATE', payload: false });
          dispatch({ type: 'SET_NEW_SEASON', payload: newSeasonData });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (err) {
          dispatch({ type: 'SET_ERROR', payload: err });
          dispatch({ type: 'SET_LOADING_STATE', payload: false });
        }
      };
      fetchSeries();
    }
  }, [media]);

  return state;
}
