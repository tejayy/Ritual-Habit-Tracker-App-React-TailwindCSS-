import React, { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Habit } from "../../types";
import { SortableHabitItem, type ViewMode } from "./SortableHabitItem";
import { getTodayString } from "../../utils/dateUtils";
import { calculateStreak } from "../../utils/habitUtils";

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Morning:       { icon: "🌅", color: "text-amber-500" },
  Evening:       { icon: "🌙", color: "text-indigo-400" },
  Health:        { icon: "💊", color: "text-green-500" },
  Fitness:       { icon: "💪", color: "text-orange-500" },
  Mindfulness:   { icon: "🧘", color: "text-violet-500" },
  Spiritual:     { icon: "🙏", color: "text-rose-400" },
  Work:          { icon: "💼", color: "text-blue-500" },
  Productivity:  { icon: "🎯", color: "text-red-500" },
  Learning:      { icon: "📚", color: "text-cyan-500" },
  "Self-Care":   { icon: "🌸", color: "text-pink-500" },
  Home:          { icon: "🏡", color: "text-yellow-600" },
  Family:        { icon: "👨‍👩‍👧", color: "text-teal-500" },
  Finance:       { icon: "💰", color: "text-emerald-500" },
  Relationships: { icon: "❤️", color: "text-rose-500" },
  Custom:        { icon: "⭐", color: "text-yellow-500" },
  Uncategorised: { icon: "📋", color: "text-muted-foreground" },
  Results:       { icon: "🔍", color: "text-primary" },
};

const getMeta = (cat: string) =>
  CATEGORY_META[cat] ?? { icon: "📌", color: "text-muted-foreground" };

type CategoryGroupProps = {
  category: string;
  habits: Habit[];
  viewMode: ViewMode;
  defaultOpen?: boolean;
  existingCategories?: string[];
  onToggle: (id: string) => void;
  onEdit: (id: string, name: string, detail: string, category?: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (habit: Habit) => void;
  onRemove: (id: string) => void;
};

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  habits,
  viewMode,
  defaultOpen = true,
  existingCategories = [],
  onToggle,
  onEdit,
  onArchive,
  onDuplicate,
  onRemove,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const today = getTodayString();

  const completed = habits.filter((h) => h.completions[today]).length;
  const total = habits.length;
  const allDone = completed === total && total > 0;
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const { icon, color } = getMeta(category);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
      allDone
        ? "border-primary/30 bg-primary/[0.03]"
        : "border-border bg-card"
    }`}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        {/* Icon */}
        <span className={`text-base leading-none ${color}`}>{icon}</span>

        {/* Title */}
        <span className="flex-1 text-sm font-semibold text-foreground">
          {category}
        </span>

        {/* Progress bar (inline) */}
        <div className="hidden w-20 overflow-hidden rounded-full bg-border sm:block" style={{ height: 3 }}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-primary" : "bg-primary/50"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Count badge */}
        <span className={`min-w-[2.5rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold tabular-nums ${
          allDone
            ? "bg-primary text-white"
            : "bg-muted text-muted-foreground"
        }`}>
          {completed}/{total}
        </span>

        {/* Chevron */}
        <svg
          className={`size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Habit rows ─────────────────────────────────────────────────── */}
      {open && (
        <div className={`border-t border-border/50 ${
          viewMode === "compact"
            ? "divide-y divide-border/30"
            : "space-y-2 p-2"
        }`}>
          <SortableContext
            items={habits.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            {habits.map((h) => (
              <SortableHabitItem
                key={h.id}
                habit={h}
                done={!!h.completions[today]}
                streak={calculateStreak(h)}
                viewMode={viewMode}
                existingCategories={existingCategories}
                onToggle={() => onToggle(h.id)}
                onEdit={onEdit}
                onArchive={() => onArchive(h.id)}
                onDuplicate={() => onDuplicate(h)}
                onRemove={() => onRemove(h.id)}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};
