import { useState, useEffect } from "react";

export function useMovieId(endpoint, query) {
  const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

  const types = ["movie", "tv"];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const movieCompany = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          types.map((type) =>
            fetch(
              `https://api.themoviedb.org/3/${endpoint}/${type}?api_key=${API_KEY}&${query}`
            )
          )
        );
        const data = await Promise.all(
          responses.map((res) => {
            if (!res.ok) {
              throw new Error(res.statusText);
            }
            return res.json();
          })
        );

        console.log(data, "4");
        setIsLoading(false);
        setData(data);
        setError(null);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    movieCompany();
  }, [endpoint]);

  return { data, isLoading, error };
}
