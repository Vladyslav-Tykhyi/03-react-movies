import s from "./SearchBar.module.css";
import { toast } from "react-hot-toast";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const SearchBar = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: SearchBarProps) => {
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
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchValue.trim();
            if (!q) {
              toast.error("Please enter your search query.");
              return;
            }
            onSearchSubmit(); // App doet de fetch
          }}
        >
          <input
            className={s.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
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
