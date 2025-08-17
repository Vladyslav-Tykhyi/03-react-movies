import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchMovies, type MoviesPage } from "../../services/movieService";

export function useMoviesQuery(query: string, page: number) {
  return useQuery<MoviesPage, Error>({
    queryKey: ["movies", { query, page }],
    queryFn: ({ signal }) => searchMovies(query, page, signal),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}
