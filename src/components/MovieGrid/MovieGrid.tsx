import React from "react";
import s from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

type MovieGridProps = {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
};

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/placeholder.jpg";

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <ul className={s.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div
            className={s.card}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(movie)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(movie);
              }
            }}
          >
            <img
              className={s.image}
              src={
                movie.poster_path
                  ? `${IMG_BASE}${movie.poster_path}`
                  : FALLBACK_POSTER
              }
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={s.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
