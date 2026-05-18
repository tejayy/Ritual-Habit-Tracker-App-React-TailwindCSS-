// Core domain types
export type Habit = {
  id: string;
  name: string;
  detail: string;
  completions: Record<string, boolean>;
  category?: string;
  archived?: boolean;
  order?: number;
};

export type State = {
  intent: string;
  habits: Habit[];
  undoStack: UndoAction[];
};

export type UndoAction = {
  habitId: string;
  date: string;
  wasCompleted: boolean;
};

export type FilterState = {
  searchQuery: string;
  selectedCategory: string;
  showArchived: boolean;
};
