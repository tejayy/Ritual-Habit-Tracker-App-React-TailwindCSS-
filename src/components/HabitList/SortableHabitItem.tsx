import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactMarkdown from "react-markdown";
import type { Habit } from "../../types";

type SortableHabitItemProps = {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

export const SortableHabitItem: React.FC<SortableHabitItemProps> = ({
  habit,
  done,
  streak,
  onToggle,
  onArchive,
  onDuplicate,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="ritual-card group flex items-center">
      <button
        {...attributes}
        {...listeners}
        className="mr-3 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      <button
        onClick={onToggle}
        className={`mr-6 size-8 rounded-full transition-all duration-300 ${
          done
            ? "bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20"
            : "border-2 border-border hover:border-primary"
        }`}
      >
        {done && (
          <svg
            className="mx-auto size-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`font-serif text-xl font-semibold transition-all ${
              done ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {habit.name}
          </h3>
          {habit.category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {habit.category}
            </span>
          )}
        </div>

        {habit.detail && (
          <div className="prose prose-sm mt-2 max-w-none text-muted-foreground">
            <ReactMarkdown>{habit.detail}</ReactMarkdown>
          </div>
        )}

        {streak > 0 && (
          <p className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="font-semibold text-primary">🔥 {streak} day streak</span>
          </p>
        )}
      </div>

      <div className="ml-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onDuplicate}
          className="rounded-full p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="Duplicate"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        <button
          onClick={onArchive}
          className="rounded-full p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title={habit.archived ? "Unarchive" : "Archive"}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </button>

        {!done && (
          <button
            onClick={onRemove}
            className="rounded-full p-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
