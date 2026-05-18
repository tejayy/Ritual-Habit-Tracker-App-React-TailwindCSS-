import type { State } from "../types";

export const STORAGE_KEY = "datalabel-habits";
export const DARK_MODE_KEY = "darkMode";

export const DEFAULT_STATE: State = {
  intent: "Become consistent through small daily rituals.",
  habits: [],
  undoStack: [],
};

export const MAX_UNDO_STACK_SIZE = 10;
