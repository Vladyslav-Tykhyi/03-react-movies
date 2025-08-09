import { useState } from "react";
import s from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import { Toaster, toast } from "react-hot-toast";
import { searchMovies } from "../../services/movieService";
import axios from "axios";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchMovies = async (query: string): Promise<void> => {
    setHasError(false);
    setLoading(true);
    try {
      const results = await searchMovies(query);

      if (results.length === 0) {
        toast("No movies found for your request.");
      }

      setMovies(results);
    } catch (err: unknown) {
      setHasError(true);

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

  const handleSearchSubmit = (q: string): void => {
    setSelectedMovie(null);
    setMovies([]);
    void fetchMovies(q);
  };

  return (
    <div className={s.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearchSubmit} />
      {hasError ? (
        <ErrorMessage />
      ) : loading ? (
        <Loader />
      ) : (
        <>
          <MovieGrid movies={movies} onSelect={(m) => setSelectedMovie(m)} />
          {selectedMovie && (
            <MovieModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
