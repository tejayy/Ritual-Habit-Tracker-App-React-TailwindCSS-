import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Habit } from "../../types";
import { getTodayString } from "../../utils/dateUtils";
import { filterHabits } from "../../utils/habitUtils";
import { AddHabitForm } from "./AddHabitForm";
import { CategoryGroup } from "./CategoryGroup";
import { TemplateModal } from "../Templates/TemplateModal";

type ViewMode = "compact" | "detailed";

type HabitListProps = {
  habits: Habit[];
  hydrated: boolean;
  onToggle: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (habit: Habit) => void;
  onRemove: (id: string) => void;
  onAdd: (name: string, detail: string, category?: string) => void;
  onAddFromTemplate: (
    habits: Omit<Habit, "id" | "completions" | "order">[],
    intent: string
  ) => void;
  onReorder: (oldIndex: number, newIndex: number, filteredHabits: Habit[]) => void;
  canUndo: boolean;
  onUndo: () => void;
};

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  hydrated,
  onToggle,
  onArchive,
  onDuplicate,
  onRemove,
  onAdd,
  onAddFromTemplate,
  onReorder,
  canUndo,
  onUndo,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");

  const today = getTodayString();

  // All unique categories (preserving order by first appearance)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    habits
      .filter((h) => (showArchived ? h.archived : !h.archived))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach((h) => {
        const cat = h.category || "Uncategorised";
        if (!seen.has(cat)) { seen.add(cat); result.push(cat); }
      });
    return result;
  }, [habits, showArchived]);

  // Filtered flat list (used for DnD and search results)
  const filteredHabits = useMemo(
    () => filterHabits(habits, searchQuery, selectedCategory, showArchived),
    [habits, searchQuery, selectedCategory, showArchived]
  );

  // Group filtered habits by category
  const grouped = useMemo(() => {
    const map = new Map<string, Habit[]>();
    filteredHabits.forEach((h) => {
      const cat = h.category || "Uncategorised";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(h);
    });
    return map;
  }, [filteredHabits]);

  // Today stats
  const completedToday = useMemo(
    () => filteredHabits.filter((h) => h.completions[today]).length,
    [filteredHabits, today]
  );
  const total = filteredHabits.length;
  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0;

  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredHabits.findIndex((h) => h.id === active.id);
      const newIndex = filteredHabits.findIndex((h) => h.id === over.id);
      const reordered = arrayMove(filteredHabits, oldIndex, newIndex);
      onReorder(oldIndex, newIndex, reordered);
    }
  };

  const handleAdd = (name: string, detail: string, category?: string) => {
    onAdd(name, detail, category);
    setShowAdd(false);
  };

  const isSearching = !!searchQuery || selectedCategory !== "all";

  return (
    <section className="col-span-12 space-y-5 lg:col-span-6">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title shrink-0">Daily Rituals</h2>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-full border border-border bg-card p-0.5">
            <button
              onClick={() => setViewMode("compact")}
              title="Compact view"
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "compact"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              title="Detailed view"
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "detailed"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
          </div>

          {/* Templates */}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Templates
          </button>

          {/* Add */}
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="ritual-button text-sm"
          >
            {showAdd ? "✕ Close" : "+ Add"}
          </button>
        </div>
      </div>

      {/* ── Sticky progress bar ─────────────────────────────────────────── */}
      {total > 0 && (
        <div className="rounded-2xl border border-border bg-card px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-primary">{completedToday}</span>
              <span className="text-sm text-muted-foreground">/ {total} done</span>
            </div>

            <div className="flex flex-1 items-center gap-3">
              <div className="flex-1 overflow-hidden rounded-full bg-border" style={{ height: 6 }}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`w-10 text-right text-xs font-semibold tabular-nums ${
                pct === 100 ? "text-primary" : "text-muted-foreground"
              }`}>
                {pct}%
              </span>
            </div>

            {/* Undo */}
            {canUndo && (
              <button
                onClick={onUndo}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Search + category filter bar ────────────────────────────────── */}
      <div className="space-y-2.5">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rituals…"
            className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category pills + archive toggle */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const catHabits = habits.filter(
              (h) => (h.category || "Uncategorised") === cat && !h.archived
            );
            const catDone = catHabits.filter((h) => h.completions[today]).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? "all" : cat)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span>{cat}</span>
                <span className={`tabular-nums ${selectedCategory === cat ? "opacity-80" : "opacity-50"}`}>
                  {catDone}/{catHabits.length}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition-all ${
              showArchived
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {showArchived ? "📦 Archived" : "Archive"}
          </button>
        </div>
      </div>

      {/* ── Add form ────────────────────────────────────────────────────── */}
      {showAdd && (
        <AddHabitForm onAdd={handleAdd} onCancel={() => setShowAdd(false)} />
      )}

      {/* ── Template modal ──────────────────────────────────────────────── */}
      {showTemplates && (
        <TemplateModal
          onClose={() => setShowTemplates(false)}
          onApply={onAddFromTemplate}
        />
      )}

      {/* ── Empty states ────────────────────────────────────────────────── */}
      {hydrated && filteredHabits.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-8 py-12 text-center">
          {isSearching ? (
            <>
              <p className="font-serif text-xl font-semibold text-muted-foreground">No rituals match</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="mt-4 rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                Clear filters
              </button>
            </>
          ) : showArchived ? (
            <>
              <p className="font-serif text-xl font-semibold text-muted-foreground">No archived rituals</p>
              <p className="mt-1 text-sm text-muted-foreground">Archive rituals to see them here.</p>
            </>
          ) : (
            <>
              <p className="mb-2 text-3xl">✨</p>
              <p className="font-serif text-xl font-semibold text-muted-foreground">A blank canvas.</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a ritual or load a template to begin.</p>
              <button onClick={() => setShowTemplates(true)} className="ritual-button mt-4 text-sm">
                Browse Templates
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Grouped habit list ──────────────────────────────────────────── */}
      {filteredHabits.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-3">
            {/* When searching/filtering flat — show all in one group */}
            {isSearching ? (
              <CategoryGroup
                category={selectedCategory === "all" ? "Results" : selectedCategory}
                habits={filteredHabits}
                viewMode={viewMode}
                defaultOpen
                onToggle={onToggle}
                onArchive={onArchive}
                onDuplicate={onDuplicate}
                onRemove={onRemove}
              />
            ) : (
              /* Normal view — one accordion per category */
              Array.from(grouped.entries()).map(([cat, catHabits]) => (
                <CategoryGroup
                  key={cat}
                  category={cat}
                  habits={catHabits}
                  viewMode={viewMode}
                  defaultOpen
                  onToggle={onToggle}
                  onArchive={onArchive}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                />
              ))
            )}
          </div>
        </DndContext>
      )}
    </section>
  );
};
