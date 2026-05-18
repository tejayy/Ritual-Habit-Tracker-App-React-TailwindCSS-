import React, { useState } from "react";
import type { HabitTemplate, TemplateHabit } from "../../data/templates";
import { HABIT_TEMPLATES } from "../../data/templates";
import type { Habit } from "../../types";

type TemplateModalProps = {
  onClose: () => void;
  onApply: (habits: Omit<Habit, "id" | "completions" | "order">[], intent: string) => void;
};

type EditableHabit = TemplateHabit & { selected: boolean; tempId: string };

export const TemplateModal: React.FC<TemplateModalProps> = ({ onClose, onApply }) => {
  const [step, setStep] = useState<"browse" | "edit">("browse");
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);
  const [editableHabits, setEditableHabits] = useState<EditableHabit[]>([]);
  const [editableIntent, setEditableIntent] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // ── Step 1: pick a template ──────────────────────────────────────────────
  const handleSelectTemplate = (tpl: HabitTemplate) => {
    setSelectedTemplate(tpl);
    setEditableIntent(tpl.intent);
    setEditableHabits(
      tpl.habits.map((h) => ({
        ...h,
        selected: true,
        tempId: crypto.randomUUID(),
      }))
    );
    setActiveCategory("All");
    setStep("edit");
  };

  // ── Step 2 helpers ───────────────────────────────────────────────────────
  const toggleSelect = (tempId: string) => {
    setEditableHabits((prev) =>
      prev.map((h) => (h.tempId === tempId ? { ...h, selected: !h.selected } : h))
    );
  };

  const updateHabit = (tempId: string, field: keyof TemplateHabit, value: string) => {
    setEditableHabits((prev) =>
      prev.map((h) => (h.tempId === tempId ? { ...h, [field]: value } : h))
    );
  };

  const addCustomHabit = () => {
    setEditableHabits((prev) => [
      ...prev,
      {
        name: "",
        detail: "",
        category: activeCategory === "All" ? "Custom" : activeCategory,
        selected: true,
        tempId: crypto.randomUUID(),
      },
    ]);
  };

  const removeHabit = (tempId: string) => {
    setEditableHabits((prev) => prev.filter((h) => h.tempId !== tempId));
  };

  const selectAll = () =>
    setEditableHabits((prev) => prev.map((h) => ({ ...h, selected: true })));
  const deselectAll = () =>
    setEditableHabits((prev) => prev.map((h) => ({ ...h, selected: false })));

  const categories = [
    "All",
    ...Array.from(new Set(editableHabits.map((h) => h.category))).sort(),
  ];

  const visibleHabits =
    activeCategory === "All"
      ? editableHabits
      : editableHabits.filter((h) => h.category === activeCategory);

  const selectedCount = editableHabits.filter((h) => h.selected).length;

  const handleApply = () => {
    const chosen = editableHabits
      .filter((h) => h.selected && h.name.trim())
      .map(({ name, detail, category }) => ({
        name,
        detail,
        category,
        archived: false,
      }));
    onApply(chosen, editableIntent);
    onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <div className="flex items-center gap-3">
            {step === "edit" && (
              <button
                onClick={() => setStep("browse")}
                className="mr-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h2 className="font-serif text-2xl font-semibold">
                {step === "browse" ? "Choose a Template" : selectedTemplate?.title}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {step === "browse"
                  ? "Pick a category that matches your goals, then customise it."
                  : selectedTemplate?.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* ── STEP 1: Browse ── */}
          {step === "browse" && (
            <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
              {HABIT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`group relative flex flex-col gap-3 rounded-2xl border border-border bg-gradient-to-br p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${tpl.color}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{tpl.icon}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tpl.accentBg} ${tpl.accentText}`}
                    >
                      {tpl.habits.length} habits
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{tpl.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(tpl.habits.map((h) => h.category)))
                      .slice(0, 4)
                      .map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                  </div>
                  <div
                    className={`absolute right-4 top-4 size-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${tpl.accentText.replace("text-", "bg-")}`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 2: Edit ── */}
          {step === "edit" && selectedTemplate && (
            <div className="flex flex-col gap-0">
              {/* Intent editor */}
              <div className="border-b border-border bg-muted/30 px-8 py-5">
                <label className="mini-label mb-2 block">Your Intent</label>
                <input
                  value={editableIntent}
                  onChange={(e) => setEditableIntent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-serif text-base font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="What is your goal with this template?"
                />
              </div>

              {/* Category tabs + controls */}
              <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-8 py-3 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          activeCategory === cat
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {cat}
                        {cat !== "All" && (
                          <span className="ml-1 opacity-60">
                            ({editableHabits.filter((h) => h.category === cat).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={selectAll}
                      className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      All
                    </button>
                    <button
                      onClick={deselectAll}
                      className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      None
                    </button>
                  </div>
                </div>
              </div>

              {/* Habit rows */}
              <div className="divide-y divide-border">
                {visibleHabits.map((h, idx) => {
                  const globalIdx = editableHabits.findIndex((eh) => eh.tempId === h.tempId);
                  const isEditing = editingIdx === globalIdx;

                  return (
                    <div
                      key={h.tempId}
                      className={`flex items-start gap-4 px-8 py-4 transition-colors ${
                        h.selected ? "bg-background" : "bg-muted/20 opacity-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelect(h.tempId)}
                        className={`mt-1 size-6 shrink-0 rounded-full transition-all ${
                          h.selected
                            ? "bg-primary shadow-md shadow-primary/30 ring-2 ring-primary/20"
                            : "border-2 border-border"
                        }`}
                      >
                        {h.selected && (
                          <svg className="mx-auto size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              autoFocus
                              value={h.name}
                              onChange={(e) => updateHabit(h.tempId, "name", e.target.value)}
                              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-serif text-base font-semibold outline-none focus:border-primary"
                              placeholder="Habit name"
                            />
                            <input
                              value={h.detail}
                              onChange={(e) => updateHabit(h.tempId, "detail", e.target.value)}
                              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm outline-none focus:border-primary"
                              placeholder="Short description"
                            />
                            <input
                              value={h.category}
                              onChange={(e) => updateHabit(h.tempId, "category", e.target.value)}
                              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm outline-none focus:border-primary"
                              placeholder="Category"
                            />
                            <button
                              onClick={() => setEditingIdx(null)}
                              className="rounded-full bg-primary px-4 py-1 text-xs font-medium text-white"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="font-serif text-base font-semibold">{h.name || "Untitled habit"}</p>
                            {h.detail && (
                              <p className="mt-0.5 text-xs text-muted-foreground">{h.detail}</p>
                            )}
                            <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {h.category}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => setEditingIdx(globalIdx)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Edit"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeHabit(h.tempId)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Remove"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add custom habit row */}
                <div className="px-8 py-4">
                  <button
                    onClick={addCustomHabit}
                    className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <svg className="mx-auto size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add a custom habit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {step === "edit" && (
          <div className="flex items-center justify-between border-t border-border bg-background px-8 py-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{selectedCount}</span> of{" "}
              {editableHabits.length} habits selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("browse")}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Back
              </button>
              <button
                onClick={handleApply}
                disabled={selectedCount === 0}
                className="ritual-button disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add {selectedCount} Ritual{selectedCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
