import { useEffect, useMemo, useState } from "react";
import s from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import { Toaster, toast } from "react-hot-toast";
import { useMoviesQuery } from "../hooks/useMoviesQuery";
import ReactPaginate from "react-paginate";

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const App = () => {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isLoading, isFetching, isError, error } = useMoviesQuery(
    debouncedQuery,
    page
  );

  useEffect(() => {
    if (!debouncedQuery) return;
    if (isError) {
      toast.error(error?.message ?? "Something went wrong. Try again.");
    }
  }, [isError, error, debouncedQuery]);

  useEffect(() => {
    if (!debouncedQuery) return;
    if (data && data.results.length === 0 && !isLoading && !isFetching) {
      toast("No movies found for your request.");
    }
  }, [data, debouncedQuery, isLoading, isFetching]);

  const movies = useMemo(() => data?.results ?? [], [data]);
  const totalPages = data?.totalPages ?? 0;

  const handleSearchSubmit = (q: string): void => {
    setSelectedMovie(null);
    setQuery(q);
  };

  return (
    <div className={s.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearchSubmit} />

      {isError ? (
        <ErrorMessage />
      ) : isLoading && debouncedQuery ? (
        <Loader />
      ) : (
        <>
          {debouncedQuery && totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={s.pagination}
              activeClassName={s.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
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
