import axios from "axios";
import type { Movie } from "../types/movie";

export type MoviesPage = {
  page: number;
  totalPages: number; // ⬅️ типізовано під total_pages
  totalResults: number;
  results: Movie[];
};

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export async function searchMovies(
  query: string,
  page: number,
  signal?: AbortSignal
): Promise<MoviesPage> {
  const res = await tmdb.get<{
    page: number;
    total_pages: number;
    total_results: number;
    results: Movie[];
  }>("/search/movie", {
    params: { query, include_adult: false, language: "en-US", page },
    signal,
  });

  const data = res.data;
  return {
    page: data.page ?? page,
    totalPages: data.total_pages ?? 0,
    totalResults: data.total_results ?? 0,
    results: data.results ?? [],
  };
}
