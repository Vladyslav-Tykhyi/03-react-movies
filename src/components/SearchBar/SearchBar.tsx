import s from "./SearchBar.module.css";
import { toast } from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <a
          className={s.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form
          className={s.form}
          action={(formData: FormData) => {
            const q = (formData.get("query") as string | null)?.trim() ?? "";
            if (!q) {
              toast.error("Please enter your search query.");
              return;
            }
            onSubmit(q);
          }}
        >
          <input
            className={s.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            aria-label="Search movies"
            autoFocus
          />
          <button className={s.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;
