import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactMarkdown from "react-markdown";
import type { Habit } from "../../types";
import { EditHabitModal } from "./EditHabitModal";

export type ViewMode = "compact" | "detailed";

type Props = {
  habit: Habit;
  done: boolean;
  streak: number;
  viewMode: ViewMode;
  existingCategories?: string[];
  onToggle: () => void;
  onEdit: (id: string, name: string, detail: string, category?: string) => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

/* ── tiny icon helpers ─────────────────────────────────────────────────── */
const IconEdit = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconDuplicate = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IconArchive = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);
const IconTrash = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconDrag = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" />
  </svg>
);

/* ── Action button ─────────────────────────────────────────────────────── */
const ActionBtn: React.FC<{
  onClick: () => void;
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, danger, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`rounded-lg p-1.5 transition-all ${
      danger
        ? "text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

/* ── Main component ────────────────────────────────────────────────────── */
export const SortableHabitItem: React.FC<Props> = ({
  habit,
  done,
  streak,
  viewMode,
  existingCategories = [],
  onToggle,
  onEdit,
  onArchive,
  onDuplicate,
  onRemove,
}) => {
  const [showEdit, setShowEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const actions = (
    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      <ActionBtn onClick={() => setShowEdit(true)} title="Edit">
        <IconEdit />
      </ActionBtn>
      <ActionBtn onClick={onDuplicate} title="Duplicate">
        <IconDuplicate />
      </ActionBtn>
      <ActionBtn onClick={onArchive} title={habit.archived ? "Unarchive" : "Archive"}>
        <IconArchive />
      </ActionBtn>
      {!done && (
        <ActionBtn onClick={onRemove} title="Delete" danger>
          <IconTrash />
        </ActionBtn>
      )}
    </div>
  );

  /* ── COMPACT ─────────────────────────────────────────────────────────── */
  if (viewMode === "compact") {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          className={`group flex items-center gap-2.5 px-3 py-2.5 transition-colors ${
            done ? "bg-primary/5" : "hover:bg-muted/30"
          }`}
        >
          {/* Drag */}
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground active:cursor-grabbing"
          >
            <IconDrag />
          </button>

          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`shrink-0 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${
              done
                ? "border-primary bg-primary"
                : "border-border hover:border-primary"
            }`}
          >
            {done && (
              <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Name */}
          <span
            className={`flex-1 truncate text-sm font-medium leading-none ${
              done ? "text-muted-foreground/60 line-through" : "text-foreground"
            }`}
          >
            {habit.name}
          </span>

          {/* Streak */}
          {streak > 0 && (
            <span className="shrink-0 text-[11px] font-semibold text-primary/80">
              🔥 {streak}
            </span>
          )}

          {/* Actions */}
          {actions}
        </div>

        {showEdit && (
          <EditHabitModal
            habit={habit}
            onSave={onEdit}
            onClose={() => setShowEdit(false)}
            existingCategories={existingCategories}
          />
        )}
      </>
    );
  }

  /* ── DETAILED ────────────────────────────────────────────────────────── */
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
          done
            ? "border-primary/15 bg-primary/5"
            : "border-border/60 bg-card hover:border-primary/25 hover:shadow-sm"
        }`}
      >
        {/* Drag */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground active:cursor-grabbing"
        >
          <IconDrag />
        </button>

        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-0.5 shrink-0 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            done
              ? "border-primary bg-primary shadow-md shadow-primary/25"
              : "border-border hover:border-primary"
          }`}
        >
          {done && (
            <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-semibold leading-snug ${done ? "text-muted-foreground/60 line-through" : "text-foreground"}`}>
              {habit.name}
            </span>
            {habit.category && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {habit.category}
              </span>
            )}
            {streak > 0 && (
              <span className="text-[11px] font-semibold text-primary/80">🔥 {streak}d</span>
            )}
          </div>
          {habit.detail && (
            <div className="prose prose-sm mt-1 max-w-none text-muted-foreground/80">
              <ReactMarkdown>{habit.detail}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Actions */}
        {actions}
      </div>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onSave={onEdit}
          onClose={() => setShowEdit(false)}
          existingCategories={existingCategories}
        />
      )}
    </>
  );
};
