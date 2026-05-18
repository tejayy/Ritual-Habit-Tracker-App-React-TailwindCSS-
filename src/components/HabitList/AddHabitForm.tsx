import React, { useState } from "react";
import { CategoryCombobox } from "./CategoryCombobox";

type AddHabitFormProps = {
  onAdd: (name: string, detail: string, category?: string) => void;
  onCancel: () => void;
  /** Pass existing habit categories so they appear in the dropdown too */
  existingCategories?: string[];
};

export const AddHabitForm: React.FC<AddHabitFormProps> = ({
  onAdd,
  onCancel,
  existingCategories = [],
}) => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), detail.trim(), category.trim() || undefined);
    setName("");
    setDetail("");
    setCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-lg shadow-primary/5"
    >
      {/* ── Name ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ritual name…"
          autoFocus
          className="w-full bg-transparent font-serif text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      {/* ── Description ──────────────────────────────────────────────── */}
      <div className="px-5 pt-3">
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Short description (supports **markdown**)…"
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="mx-5 border-t border-border/60" />

      {/* ── Category combobox ────────────────────────────────────────── */}
      <div className="px-5 py-3">
        <CategoryCombobox
          value={category}
          onChange={setCategory}
          extraCategories={existingCategories}
          placeholder="Category — type or pick from list…"
          inputClassName="w-full rounded-xl border border-border bg-muted/40 py-2.5 text-sm focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Ritual
        </button>
      </div>
    </form>
  );
};
