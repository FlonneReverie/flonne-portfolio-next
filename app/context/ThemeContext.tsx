"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  const [isDarkTheme, setIsDarkThemeInternal] = useState(false);

  function setIsDarkTheme(isDark : boolean) : void {
    setIsDarkThemeInternal(isDark);
    document.documentElement.classList[isDark ? 'remove' : 'add']('light');
    localStorage.setItem('theme', isDark ? "1" : "0");
  }

  // Read theme from localStorage or system/browser preference
  useEffect(() => {
    const storedValue = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (storedValue !== null ? storedValue === "1" : system);
    setIsDarkTheme(initial);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider!');
  return ctx;
};
