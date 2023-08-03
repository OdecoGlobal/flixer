import { useFetch } from "./useFetch";
export function useMovie() {
  const API_KEY = "70161bbcd895dec3c1b8d56d7c36b5fd";

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 3;

  const {
    data: moviesData,
    isPending: moviesLoading,
    error,
  } = useFetch(
    `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${prevYear}-01-01&primary_release_date.lte=${currentYear}-12-31&sort_by=popularity.desc&api_key=${API_KEY}`
  );
  return { moviesData, moviesLoading, error };
}
