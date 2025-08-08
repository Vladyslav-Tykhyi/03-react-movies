import { useEffect } from "react";
import s from "./MovieModal.module.css";
import type { Movie } from "../../types/movies";

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
};

const IMG_BASE = "https://image.tmdb.org/t/p/original";

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={s.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={s.modal}>
        <button
          className={s.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          x
        </button>
        <img
          src={movie.backdrop_path ? `${IMG_BASE}${movie.backdrop_path}` : ""}
          alt={movie.title}
          className={s.image}
          loading="lazy"
        />
        <div className={s.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
