"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  isReducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  const [isDarkTheme, setIsDarkThemeInternal] = useState(false);
  const [isReducedMotion, setIsReducedMotionInternal] = useState(true);

  function setIsDarkTheme(isDark : boolean) : void {
    setIsDarkThemeInternal(isDark);
    document.documentElement.classList[isDark ? 'remove' : 'add']('light');
    localStorage.setItem('theme', isDark ? "1" : "0");
  }

  function setIsReducedMotion(isReducedMotion : boolean) : void {
    setIsReducedMotionInternal(isReducedMotion);
    document.documentElement.classList[isReducedMotion ? 'add' : 'remove']('reducedMotion');
  }

  // Read theme from localStorage or system/browser preference
  useEffect(() => {
    const storedValue = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (storedValue !== null ? storedValue === "1" : system);
    setIsDarkTheme(initial);
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme, isReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider!');
  return ctx;
};
