import { useState } from "react";
import s from "./App.module.css";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movies";
import { Toaster, toast } from "react-hot-toast";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
type TMDBResponse = { results: Movie[] };

const App = () => {
  const [value, setValue] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async (query: string) => {
    try {
      setLoading(true);
      const res = await axios.get<TMDBResponse>(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { query, include_adult: false, language: "en-US", page: 1 },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const results = res.data.results ?? [];
      if (results.length === 0) {
        toast("No movies found for your request.");
      }
      setMovies(results);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    const q = value.trim();
    if (!q) {
      setMovies([]);
      return;
    }
    setSelectedMovie(null);
    setMovies([]);
    fetchMovies(q);
  };

  return (
    <div className={s.app}>
      <Toaster position="top-right" />

      <SearchBar
        searchValue={value}
        onSearchChange={setValue}
        onSearchSubmit={handleSearchSubmit}
      />

      {loading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={(m) => setSelectedMovie(m)} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
