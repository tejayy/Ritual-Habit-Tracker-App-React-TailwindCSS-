import type { Habit } from "../types";

export const calculateStreak = (habit: Habit): number => {
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];

    if (habit.completions[key]) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateDayCompletionRatio = (
  habits: Habit[],
  day: string
): number => {
  if (habits.length === 0) return 0;
  const completed = habits.filter((h) => h.completions[day]).length;
  return completed / habits.length;
};

export const calculateWeekRatio = (habits: Habit[], days: string[]): number => {
  const recent = days.slice(-7);

  if (habits.length === 0) return 0;

  let totalChecks = 0;
  let completedChecks = 0;

  recent.forEach((d) => {
    habits.forEach((h) => {
      totalChecks++;
      if (h.completions[d]) {
        completedChecks++;
      }
    });
  });

  return completedChecks / totalChecks;
};

export const getUniqueCategories = (habits: Habit[]): string[] => {
  const cats = new Set<string>();
  habits.forEach((h) => {
    if (h.category) cats.add(h.category);
  });
  return Array.from(cats).sort();
};

export const filterHabits = (
  habits: Habit[],
  searchQuery: string,
  selectedCategory: string,
  showArchived: boolean
): Habit[] => {
  let filtered = habits.filter((h) => (showArchived ? h.archived : !h.archived));

  if (searchQuery) {
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.detail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== "all") {
    filtered = filtered.filter((h) => h.category === selectedCategory);
  }

  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
};
