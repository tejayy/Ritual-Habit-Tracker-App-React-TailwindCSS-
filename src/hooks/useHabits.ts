import { useState, useEffect, useCallback } from "react";
import type { State, Habit } from "../types";
import { storageService } from "../services/storageService";
import { DEFAULT_STATE, MAX_UNDO_STACK_SIZE } from "../constants";
import { getTodayString } from "../utils/dateUtils";
import { triggerConfetti } from "../utils/confettiUtils";

export const useHabits = () => {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const loadedState = storageService.loadState();
    setState(loadedState);
    setHydrated(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (hydrated) {
      storageService.saveState(state);
    }
  }, [state, hydrated]);

  const setIntent = useCallback((intent: string) => {
    setState((prev) => ({ ...prev, intent }));
  }, []);

  const addHabit = useCallback(
    (name: string, detail: string, category?: string) => {
      if (!name.trim()) return;

      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name,
        detail,
        completions: {},
        category: category || undefined,
        archived: false,
        order: state.habits.length,
      };

      setState((prev) => ({
        ...prev,
        habits: [...prev.habits, newHabit],
      }));
    },
    [state.habits.length]
  );

  const removeHabit = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  }, []);

  const archiveHabit = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === id ? { ...h, archived: !h.archived } : h
      ),
    }));
  }, []);

  const duplicateHabit = useCallback((habit: Habit) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      name: `${habit.name} (Copy)`,
      completions: {},
      order: state.habits.length,
    };

    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  }, [state.habits.length]);

  const toggleToday = useCallback(
    (id: string) => {
      const today = getTodayString();
      const habit = state.habits.find((h) => h.id === id);
      if (!habit) return;

      const wasCompleted = !!habit.completions[today];

      setState((prev) => {
        const updatedHabits = prev.habits.map((h) => {
          if (h.id !== id) return h;
          return {
            ...h,
            completions: {
              ...h.completions,
              [today]: !h.completions[today],
            },
          };
        });

        // Check if all habits are completed for confetti
        const activeHabits = updatedHabits.filter((h) => !h.archived);
        const allCompleted = activeHabits.every((h) => h.completions[today]);

        if (allCompleted && activeHabits.length > 0 && !wasCompleted) {
          setTimeout(() => triggerConfetti(), 100);
        }

        return {
          ...prev,
          habits: updatedHabits,
          undoStack: [
            ...prev.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1),
            { habitId: id, date: today, wasCompleted },
          ],
        };
      });
    },
    [state.habits]
  );

  const undo = useCallback(() => {
    if (state.undoStack.length === 0) return;

    const lastAction = state.undoStack[state.undoStack.length - 1];

    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== lastAction.habitId) return h;
        return {
          ...h,
          completions: {
            ...h.completions,
            [lastAction.date]: lastAction.wasCompleted,
          },
        };
      }),
      undoStack: prev.undoStack.slice(0, -1),
    }));
  }, [state.undoStack]);

  const addHabitsFromTemplate = useCallback(
    (habits: Omit<Habit, "id" | "completions" | "order">[], intent: string) => {
      setState((prev) => {
        const startOrder = prev.habits.length;
        const newHabits: Habit[] = habits.map((h, i) => ({
          ...h,
          id: crypto.randomUUID(),
          completions: {},
          order: startOrder + i,
        }));
        return {
          ...prev,
          intent,
          habits: [...prev.habits, ...newHabits],
        };
      });
    },
    []
  );

  const editHabit = useCallback(
    (id: string, name: string, detail: string, category?: string) => {
      setState((prev) => ({
        ...prev,
        habits: prev.habits.map((h) =>
          h.id === id ? { ...h, name, detail, category: category || undefined } : h
        ),
      }));
    },
    []
  );

  const reorderHabits = useCallback((_oldIndex: number, _newIndex: number, filteredHabits: Habit[]) => {
    setState((prev) => {
      const updatedHabits = prev.habits.map((h) => {
        const newOrder = filteredHabits.findIndex((fh) => fh.id === h.id);
        if (newOrder !== -1) {
          return { ...h, order: newOrder };
        }
        return h;
      });

      return {
        ...prev,
        habits: updatedHabits,
      };
    });
  }, []);

  return {
    state,
    hydrated,
    setIntent,
    addHabit,
    editHabit,
    addHabitsFromTemplate,
    removeHabit,
    archiveHabit,
    duplicateHabit,
    toggleToday,
    undo,
    reorderHabits,
  };
};
