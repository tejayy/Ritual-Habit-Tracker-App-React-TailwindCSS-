import React, { useState, useRef, useEffect, useCallback } from "react";

/* ── All known categories with icons ──────────────────────────────────── */
export const ALL_CATEGORIES = [
  { label: "Morning",       icon: "🌅" },
  { label: "Evening",       icon: "🌙" },
  { label: "Health",        icon: "💊" },
  { label: "Fitness",       icon: "💪" },
  { label: "Mindfulness",   icon: "🧘" },
  { label: "Spiritual",     icon: "🙏" },
  { label: "Work",          icon: "💼" },
  { label: "Productivity",  icon: "🎯" },
  { label: "Learning",      icon: "📚" },
  { label: "Self-Care",     icon: "🌸" },
  { label: "Home",          icon: "🏡" },
  { label: "Family",        icon: "👨‍👩‍👧" },
  { label: "Finance",       icon: "💰" },
  { label: "Relationships", icon: "❤️" },
  { label: "Custom",        icon: "⭐" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Extra categories already used in the user's habits */
  extraCategories?: string[];
  placeholder?: string;
  inputClassName?: string;
};

export const CategoryCombobox: React.FC<Props> = ({
  value,
  onChange,
  extraCategories = [],
  placeholder = "e.g. Morning, Health, Work…",
  inputClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* ── Merge built-in + user-created categories, deduplicated ─────────── */
  const allOptions = React.useMemo(() => {
    const base = ALL_CATEGORIES.map((c) => c.label);
    const extras = extraCategories.filter((e) => !base.includes(e));
    return [
      ...ALL_CATEGORIES,
      ...extras.map((e) => ({ label: e, icon: "📌" })),
    ];
  }, [extraCategories]);

  /* ── Filter by what the user typed ──────────────────────────────────── */
  const filtered = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((c) => c.label.toLowerCase().includes(q));
  }, [value, allOptions]);

  /* ── Reset highlight when filtered list changes ──────────────────────── */
  useEffect(() => {
    setHighlighted(0);
  }, [filtered.length]);

  /* ── Scroll highlighted item into view ──────────────────────────────── */
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[highlighted] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  /* ── Close on outside click ─────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = useCallback(
    (label: string) => {
      onChange(label);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlighted]) {
          select(filtered[highlighted].label);
        } else if (value.trim()) {
          // Allow custom category not in list
          select(value.trim());
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    inputRef.current?.focus();
    setOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Input ──────────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Selected icon preview */}
        {value && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base leading-none">
            {allOptions.find((c) => c.label === value)?.icon ?? "📌"}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pr-16 transition-all outline-none ${
            value ? "pl-9" : "pl-4"
          } ${inputClassName}`}
        />

        {/* Right-side buttons */}
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {value && (
            <button
              type="button"
              onMouseDown={handleClear}
              className="rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
              tabIndex={-1}
              title="Clear"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
              inputRef.current?.focus();
            }}
            className="rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
            tabIndex={-1}
            title="Show all categories"
          >
            <svg
              className={`size-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Dropdown ───────────────────────────────────────────────────── */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          {/* "Create custom" hint when typed value isn't in list */}
          {value.trim() && !allOptions.some(
            (c) => c.label.toLowerCase() === value.trim().toLowerCase()
          ) && (
            <button
              type="button"
              onMouseDown={() => select(value.trim())}
              className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-base">
                ✨
              </span>
              <span>
                Create <strong className="text-primary">"{value.trim()}"</strong>
              </span>
            </button>
          )}

          {filtered.length === 0 && !value.trim() && (
            <p className="px-4 py-3 text-sm text-muted-foreground">No categories found.</p>
          )}

          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto py-1"
            role="listbox"
          >
            {filtered.map((cat, i) => {
              const isSelected = value === cat.label;
              const isHighlighted = highlighted === i;

              return (
                <li
                  key={cat.label}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={() => select(cat.label)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isHighlighted
                      ? "bg-primary/10 text-primary"
                      : isSelected
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
                    {cat.icon}
                  </span>
                  <span className="flex-1 font-medium">{cat.label}</span>
                  {isSelected && (
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
