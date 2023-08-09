import { useEffect, useState } from 'react';
import { useFetchMovieDb } from './useFetchMovieDb';

export function useMovie(query) {
  const [media, setMedia] = useState([]);
  const [movie, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const { data, isLoading, API_KEY } = useFetchMovieDb('discover', '');
  useEffect(() => {
    if (!isLoading && data.length === 2) {
      const mediaBackdrop = data.map(mov =>
        mov.results.filter(back => back.backdrop_path !== null)
      );

      const [movie, tv] = mediaBackdrop;

      const allMedia = [
        ...movie.map(mov => ({
          ...mov,
          media_type: 'movie',
        })),
        ...tv.map(serie => ({
          ...serie,
          media_type: 'tv',
        })),
      ];

      const allId = allMedia.map(media => ({
        id: media.id,
        type: media.media_type,
      }));

      const fetchDetails = async () => {
        const urls = allId.map(
          ({ id, type }) =>
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}${query}`
        );

        try {
          setMediaLoading(true);
          const responses = await Promise.all(urls.map(url => fetch(url)));
          const details = await Promise.all(
            responses.map(res => {
              if (!res.ok) throw new Error(res.statusText);
              return res.json();
            })
          );
          setMediaLoading(false);
          setMediaError(null);
          const combinedMedia = details.map((data, i) => ({
            ...data,
            media_type: allId[i].type,
          }));
          setMedia(combinedMedia);
        } catch (err) {
          setMediaLoading(false);
          setMediaError(err);
          console.log(err);
        }
      };
      fetchDetails();
    }
  }, [data]);

  useEffect(() => {
    if (media) {
      const movies = media.filter(med => med.media_type === 'movie');
      const tvSeries = media.filter(med => med.media_type === 'tv');
      setSeries(tvSeries);
      setMovies(movies);
      console.log(movie, '11');
      console.log(series, '33');
    }
  }, [media]);

  return { media, mediaError, mediaLoading };
}
