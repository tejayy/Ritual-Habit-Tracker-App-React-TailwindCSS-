import React, { useState } from "react";

type AddHabitFormProps = {
  onAdd: (name: string, detail: string, category?: string) => void;
  onCancel: () => void;
};

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(name, detail, category);
    setName("");
    setDetail("");
    setCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ritual-card animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ritual name"
        autoFocus
        className="w-full bg-transparent font-serif text-xl font-medium outline-none placeholder:text-muted-foreground/50"
      />

      <input
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Add a short description (supports **markdown**)..."
        className="mt-3 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category (optional)"
        className="mt-3 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
      />

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>

        <button type="submit" className="ritual-button">
          Save Ritual
        </button>
      </div>
    </form>
  );
};
