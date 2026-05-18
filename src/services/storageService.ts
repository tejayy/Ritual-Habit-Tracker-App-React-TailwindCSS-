import type { State } from "../types";
import { STORAGE_KEY, DARK_MODE_KEY, DEFAULT_STATE } from "../constants";

export const storageService = {
  loadState: (): State => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure undoStack exists
        return {
          ...parsed,
          undoStack: parsed.undoStack || [],
        };
      }
    } catch (error) {
      console.error("Error loading state:", error);
    }
    return DEFAULT_STATE;
  },

  saveState: (state: State): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state:", error);
    }
  },

  loadDarkMode: (): boolean => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
      // Check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (error) {
      console.error("Error loading dark mode:", error);
      return false;
    }
  },

  saveDarkMode: (darkMode: boolean): void => {
    try {
      localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
    } catch (error) {
      console.error("Error saving dark mode:", error);
    }
  },
};
