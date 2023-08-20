import { useState, useEffect } from 'react';

export function useFetchMovieDb(endpoint, query) {
  // const API_KEY = '70161bbcd895dec3c1b8d56d7c36b5fd';
  const API_KEY = process.env.REACT_APP_API_KEYS;

  const types = ['movie', 'tv'];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    console.log(API_KEY, '1');

    const movieCompany = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          types.map(type =>
            fetch(
              `https://api.themoviedb.org/3/${endpoint}/${type}?api_key=${API_KEY}${query}`,
              { signal: controller.signal }
            )
          )
        );
        const data = await Promise.all(
          responses.map(res => {
            if (!res.ok) {
              throw new Error(res.statusText);
            }
            return res.json();
          })
        );

        setIsLoading(false);
        setData(data);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('the fetch was aborted');
        } else {
          console.log(err);
          setIsLoading(false);
          setError(err);
        }
      }
    };
    movieCompany();
    return () => {
      controller.abort();
    };
  }, [endpoint, API_KEY]);

  return { data, isLoading, error, API_KEY, types };
}
