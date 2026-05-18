import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedDarkMode = storageService.loadDarkMode();
    setDarkMode(savedDarkMode);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      storageService.saveDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, hydrated]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return { darkMode, toggleDarkMode };
};
