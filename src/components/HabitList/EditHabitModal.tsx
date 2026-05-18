import React, { useState, useEffect } from "react";
import type { Habit } from "../../types";
import { CategoryCombobox } from "./CategoryCombobox";

type EditHabitModalProps = {
  habit: Habit;
  onSave: (id: string, name: string, detail: string, category?: string) => void;
  onClose: () => void;
  /** Pass existing habit categories so they appear in the dropdown too */
  existingCategories?: string[];
};

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  habit,
  onSave,
  onClose,
  existingCategories = [],
}) => {
  const [name, setName] = useState(habit.name);
  const [detail, setDetail] = useState(habit.detail);
  const [category, setCategory] = useState(habit.category ?? "");

  /* ── Escape to close ─────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(habit.id, name.trim(), detail.trim(), category.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md overflow-visible rounded-3xl border border-border bg-background shadow-2xl">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-serif text-xl font-semibold">Edit Ritual</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="space-y-4 px-6 py-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="mini-label">Ritual Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Morning meditation"
              className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 font-serif text-base font-semibold outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="mini-label">
              Description{" "}
              <span className="normal-case tracking-normal opacity-50">
                (supports **markdown**)
              </span>
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Add a short note or goal…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
            />
          </div>

          {/* Category — combobox */}
          <div className="space-y-1.5">
            <label className="mini-label">Category</label>
            <CategoryCombobox
              value={category}
              onChange={setCategory}
              extraCategories={existingCategories}
              placeholder="Type to search or pick from list…"
              inputClassName="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
