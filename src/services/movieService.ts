import axios from "axios";
import type { Movie } from "../types/movie";

export type TMDBResponse = { results: Movie[] };

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export async function searchMovies(query: string): Promise<Movie[]> {
  const res = await tmdb.get<TMDBResponse>("/search/movie", {
    params: { query, include_adult: false, language: "en-US", page: 1 },
  });
  return res.data.results ?? [];
}
