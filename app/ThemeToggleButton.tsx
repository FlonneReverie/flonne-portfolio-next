
/* Adapted from https://toggles.dev/classic */

import { useTheme } from "./context/ThemeContext";
import styles from "./ThemeToggleButton.module.css";

export default function ThemeToggleButton() {

  const {isDarkTheme, setIsDarkTheme, isReducedMotion} = useTheme();

  function toggleTheme() : void {
    setIsDarkTheme(!isDarkTheme);
  }

  return (
    <div className={`${styles.themeToggleContainer} ${isReducedMotion ? styles.reducedMotion : ''}`}>
      <label
        tabIndex={0}
        className={styles.themeToggle}
        title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
        aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
        aria-checked={!isDarkTheme}
        role="switch"
        onClick={toggleTheme}
        onKeyDown={(evt) => {
          if(evt.key === 'Enter' || evt.key === ' ') {
            toggleTheme();
            evt.preventDefault();
            return false;
          }
          return true;
        }}
      >
        <input type="checkbox" aria-hidden="true" checked={isDarkTheme} disabled />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="1em"
          height="1em"
          fill="currentColor"
          strokeLinecap="round"
          className={styles.themeToggleClassic}
          viewBox="0 0 32 32"
        >
          <clipPath id="theme-toggle__classic__cutout">
            <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
          </clipPath>
          <g clipPath="url(#theme-toggle__classic__cutout)">
            <circle cx="16" cy="16" r="9.34" />
            <g stroke="currentColor" strokeWidth="1.5">
              <path d="M16 5.5v-4" />
              <path d="M16 30.5v-4" />
              <path d="M1.5 16h4" />
              <path d="M26.5 16h4" />
              <path d="m23.4 8.6 2.8-2.8" />
              <path d="m5.7 26.3 2.9-2.9" />
              <path d="m5.8 5.8 2.8 2.8" />
              <path d="m23.4 23.4 2.9 2.9" />
            </g>
          </g>
        </svg>
      </label>
    </div>
  );
}
