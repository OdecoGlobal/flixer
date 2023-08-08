import { useEffect, useState } from "react";
import { useMovieId } from "../hooks/useMovieId";

export default function NewHero() {
  const { data } = useMovieId(
    "discover",
    "primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31&sort_by=popularity.desc"
  );
  useEffect(() => {
    if (data) console.log(data, "1");
  }, [data]);

  return <div>NewHero</div>;
}

/**
 * const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const movieCompany = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          types.map((type) =>
            fetch(
              `https://api.themoviedb.org/3/watch/providers/${type}?api_key=${API_KEY}`
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
        setCompanies(data);
        setError(null);
      } catch (err) {
        console.log(err);
      }
    };
    movieCompany();
  }, []);

 */
