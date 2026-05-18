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
import type { ViewMode } from "./SortableHabitItem";

type HabitListProps = {
  habits: Habit[];
  hydrated: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, name: string, detail: string, category?: string) => void;
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
  onEdit,
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

  /* ── derived data ──────────────────────────────────────────────────── */
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

  const filteredHabits = useMemo(
    () => filterHabits(habits, searchQuery, selectedCategory, showArchived),
    [habits, searchQuery, selectedCategory, showArchived]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Habit[]>();
    filteredHabits.forEach((h) => {
      const cat = h.category || "Uncategorised";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(h);
    });
    return map;
  }, [filteredHabits]);

  const completedToday = useMemo(
    () => filteredHabits.filter((h) => h.completions[today]).length,
    [filteredHabits, today]
  );
  const total = filteredHabits.length;
  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0;

  /* ── DnD ───────────────────────────────────────────────────────────── */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredHabits.findIndex((h) => h.id === active.id);
      const newIndex = filteredHabits.findIndex((h) => h.id === over.id);
      onReorder(oldIndex, newIndex, arrayMove(filteredHabits, oldIndex, newIndex));
    }
  };

  const isFiltering = !!searchQuery || selectedCategory !== "all";

  return (
    <section className="col-span-12 space-y-4 lg:col-span-6">

      {/* ══ HEADER ══════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Daily Rituals
        </h2>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-border bg-muted/50 p-0.5">
            {(["compact", "detailed"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={mode === "compact" ? "Compact" : "Detailed"}
                className={`rounded-lg px-2.5 py-1.5 transition-all ${
                  viewMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "compact" ? (
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10m-10 6h16" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Templates */}
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              showAdd
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {showAdd ? (
              <>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </>
            ) : (
              <>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* ══ PROGRESS STRIP ══════════════════════════════════════════════ */}
      {total > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          {/* Count */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="font-serif text-xl font-bold text-primary tabular-nums">{completedToday}</span>
            <span className="text-xs text-muted-foreground">/{total}</span>
          </div>

          {/* Bar */}
          <div className="flex-1 overflow-hidden rounded-full bg-border" style={{ height: 5 }}>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                pct === 100
                  ? "bg-primary"
                  : "bg-gradient-to-r from-primary/70 to-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Pct */}
          <span className={`shrink-0 text-xs font-semibold tabular-nums ${pct === 100 ? "text-primary" : "text-muted-foreground"}`}>
            {pct === 100 ? "🎉 All done!" : `${pct}%`}
          </span>

          {/* Undo */}
          {canUndo && (
            <button
              onClick={onUndo}
              className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </button>
          )}
        </div>
      )}

      {/* ══ SEARCH + FILTERS ════════════════════════════════════════════ */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rituals…"
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
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
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? "all" : cat)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
                <span className={`tabular-nums ${isActive ? "opacity-75" : "opacity-50"}`}>
                  {catDone}/{catHabits.length}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`ml-auto rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              showArchived
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {showArchived ? "📦 Archived" : "Archive"}
          </button>
        </div>
      </div>

      {/* ══ ADD FORM ════════════════════════════════════════════════════ */}
      {showAdd && (
        <AddHabitForm
          onAdd={(name, detail, category) => {
            onAdd(name, detail, category);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
          existingCategories={categories}
        />
      )}

      {/* ══ TEMPLATE MODAL ══════════════════════════════════════════════ */}
      {showTemplates && (
        <TemplateModal
          onClose={() => setShowTemplates(false)}
          onApply={onAddFromTemplate}
        />
      )}

      {/* ══ EMPTY STATES ════════════════════════════════════════════════ */}
      {hydrated && filteredHabits.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-8 py-14 text-center">
          {isFiltering ? (
            <>
              <p className="font-serif text-lg font-semibold text-muted-foreground">Nothing matches</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="mt-4 rounded-xl bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </button>
            </>
          ) : showArchived ? (
            <>
              <p className="font-serif text-lg font-semibold text-muted-foreground">No archived rituals</p>
              <p className="mt-1 text-sm text-muted-foreground">Archive rituals to see them here.</p>
            </>
          ) : (
            <>
              <p className="mb-1 text-2xl">✨</p>
              <p className="font-serif text-lg font-semibold text-muted-foreground">A blank canvas.</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a ritual or start from a template.</p>
              <button
                onClick={() => setShowTemplates(true)}
                className="mt-4 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
              >
                Browse Templates
              </button>
            </>
          )}
        </div>
      )}

      {/* ══ GROUPED LIST ════════════════════════════════════════════════ */}
      {filteredHabits.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2.5">
            {isFiltering ? (
              <CategoryGroup
                category={selectedCategory === "all" ? "Results" : selectedCategory}
                habits={filteredHabits}
                viewMode={viewMode}
                defaultOpen
                existingCategories={categories}
                onToggle={onToggle}
                onEdit={onEdit}
                onArchive={onArchive}
                onDuplicate={onDuplicate}
                onRemove={onRemove}
              />
            ) : (
              Array.from(grouped.entries()).map(([cat, catHabits]) => (
                <CategoryGroup
                  key={cat}
                  category={cat}
                  habits={catHabits}
                  viewMode={viewMode}
                  defaultOpen
                  existingCategories={categories}
                  onToggle={onToggle}
                  onEdit={onEdit}
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
