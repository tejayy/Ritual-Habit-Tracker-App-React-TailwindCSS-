import React, { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Habit } from "../../types";
import { SortableHabitItem } from "./SortableHabitItem";
import { getTodayString } from "../../utils/dateUtils";
import { calculateStreak } from "../../utils/habitUtils";

type ViewMode = "compact" | "detailed";

type CategoryGroupProps = {
  category: string;
  habits: Habit[];
  viewMode: ViewMode;
  defaultOpen?: boolean;
  onToggle: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (habit: Habit) => void;
  onRemove: (id: string) => void;
};

// Category icon map
const CATEGORY_ICONS: Record<string, string> = {
  Morning: "🌅",
  Evening: "🌙",
  Health: "💊",
  Fitness: "💪",
  Mindfulness: "🧘",
  Spiritual: "🙏",
  Work: "💼",
  Productivity: "🎯",
  Learning: "📚",
  "Self-Care": "🌸",
  Home: "🏡",
  Family: "👨‍👩‍👧",
  Finance: "💰",
  Relationships: "❤️",
  Custom: "⭐",
  Uncategorised: "📋",
};

const getCategoryIcon = (cat: string) =>
  CATEGORY_ICONS[cat] ?? "📌";

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  habits,
  viewMode,
  defaultOpen = true,
  onToggle,
  onArchive,
  onDuplicate,
  onRemove,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const today = getTodayString();

  const completed = habits.filter((h) => h.completions[today]).length;
  const total = habits.length;
  const allDone = completed === total && total > 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
      allDone ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    }`}>
      {/* ── Group header ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        {/* Icon */}
        <span className="text-lg leading-none">{getCategoryIcon(category)}</span>

        {/* Title */}
        <span className="flex-1 font-serif text-sm font-semibold tracking-tight">
          {category}
        </span>

        {/* Progress pill */}
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
          allDone
            ? "bg-primary text-white"
            : "bg-muted text-muted-foreground"
        }`}>
          {completed}/{total}
        </span>

        {/* Mini progress bar */}
        <div className="hidden w-16 overflow-hidden rounded-full bg-border sm:block" style={{ height: 4 }}>
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Chevron */}
        <svg
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Habit rows ── */}
      {open && (
        <div className={`border-t border-border/60 ${viewMode === "compact" ? "divide-y divide-border/40" : "space-y-2 p-2"}`}>
          <SortableContext
            items={habits.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            {habits.map((h) => {
              const done = !!h.completions[today];
              const streak = calculateStreak(h);
              return (
                <SortableHabitItem
                  key={h.id}
                  habit={h}
                  done={done}
                  streak={streak}
                  viewMode={viewMode}
                  onToggle={() => onToggle(h.id)}
                  onArchive={() => onArchive(h.id)}
                  onDuplicate={() => onDuplicate(h)}
                  onRemove={() => onRemove(h.id)}
                />
              );
            })}
          </SortableContext>
        </div>
      )}
    </div>
  );
};
