import { useState } from "react";
import s from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movies";
import { Toaster, toast } from "react-hot-toast";
import { searchMovies } from "../../services/moviesApi";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async (query: string) => {
    try {
      setLoading(true);
      const results = await searchMovies(query);
      if (results.length === 0) {
        toast("No movies found for your request.");
      }
      setMovies(results);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const apiMsg = (err.response?.data as { status_message?: string })
          ?.status_message;
        toast.error(apiMsg ?? err.message);
      } else {
        toast.error("Something went wrong. Try again.");
      }
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
