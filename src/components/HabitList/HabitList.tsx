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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Habit } from "../../types";
import { getTodayString } from "../../utils/dateUtils";
import { calculateStreak, getUniqueCategories, filterHabits } from "../../utils/habitUtils";
import { SearchAndFilter } from "./SearchAndFilter";
import { AddHabitForm } from "./AddHabitForm";
import { SortableHabitItem } from "./SortableHabitItem";

type HabitListProps = {
  habits: Habit[];
  hydrated: boolean;
  onToggle: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (habit: Habit) => void;
  onRemove: (id: string) => void;
  onAdd: (name: string, detail: string, category?: string) => void;
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
  onReorder,
  canUndo,
  onUndo,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);

  const today = getTodayString();
  const categories = useMemo(() => getUniqueCategories(habits), [habits]);

  const filteredHabits = useMemo(
    () => filterHabits(habits, searchQuery, selectedCategory, showArchived),
    [habits, searchQuery, selectedCategory, showArchived]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  return (
    <section className="col-span-12 space-y-8 lg:col-span-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Daily Rituals</h2>

        <button onClick={() => setShowAdd((v) => !v)} className="ritual-button">
          {showAdd ? "Close" : "+ Add Ritual"}
        </button>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived((v) => !v)}
        canUndo={canUndo}
        onUndo={onUndo}
      />

      {showAdd && (
        <AddHabitForm onAdd={handleAdd} onCancel={() => setShowAdd(false)} />
      )}

      <div className="space-y-4">
        {hydrated && filteredHabits.length === 0 && !searchQuery && (
          <div className="ritual-card text-center">
            <p className="mb-3 font-serif text-3xl font-semibold text-muted-foreground">
              {showArchived ? "No archived rituals" : "A blank canvas."}
            </p>
            <p className="text-sm text-muted-foreground">
              {showArchived
                ? "Archive rituals to see them here."
                : "Add your first ritual to begin your journey."}
            </p>
          </div>
        )}

        {hydrated && filteredHabits.length === 0 && searchQuery && (
          <div className="ritual-card text-center">
            <p className="mb-3 font-serif text-2xl font-semibold text-muted-foreground">
              No rituals found
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredHabits.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredHabits.map((h) => {
              const done = !!h.completions[today];
              const streak = calculateStreak(h);

              return (
                <SortableHabitItem
                  key={h.id}
                  habit={h}
                  done={done}
                  streak={streak}
                  onToggle={() => onToggle(h.id)}
                  onArchive={() => onArchive(h.id)}
                  onDuplicate={() => onDuplicate(h)}
                  onRemove={() => onRemove(h.id)}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
};
