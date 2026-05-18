import { useEffect, useMemo, useState } from "react";

type Habit = {
  id: string;
  name: string;
  detail: string;
  completions: Record<string, boolean>;
};

type State = {
  intent: string;

  habits: Habit[];
};

const STORAGE_KEY = "datalabel-habits";

const today = new Date().toISOString().split("T")[0];

const generateDays = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (count - 1 - i));
    return d.toISOString().split("T")[0];
  });
};

const days = generateDays(14);

const defaultState: State = {
  intent: "Become consistent through small daily rituals.",
  habits: [],
};

const App = () => {
  const [state, setState] = useState<State>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  const [editIntent, setEditIntent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      setState(JSON.parse(raw));
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("darkMode", darkMode.toString());
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, hydrated]);

  const setIntent = (intent: string) => {
    setState((prev) => ({
      ...prev,
      intent,
    }));
  };

  const addHabit = (name: string, detail: string) => {
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      detail,
      completions: {},
    };

    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  const removeHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  };

  const toggleToday = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== id) return h;

        return {
          ...h,
          completions: {
            ...h.completions,
            [today]: !h.completions[today],
          },
        };
      }),
    }));
  };

  const streakOf = (habit: Habit) => {
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = d.toISOString().split("T")[0];

      if (habit.completions[key]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const dayCompletionRatio = (habits: Habit[], day: string) => {
    if (habits.length === 0) return 0;

    const completed = habits.filter((h) => h.completions[day]).length;

    return completed / habits.length;
  };

  const completedToday = useMemo(() => {
    return state.habits.filter((h) => h.completions[today]).length;
  }, [state.habits]);

  const total = state.habits.length;

  const weekRatio = useMemo(() => {
    const recent = days.slice(-7);

    if (state.habits.length === 0) return 0;

    let totalChecks = 0;
    let completedChecks = 0;

    recent.forEach((d) => {
      state.habits.forEach((h) => {
        totalChecks++;

        if (h.completions[d]) {
          completedChecks++;
        }
      });
    });

    return completedChecks / totalChecks;
  }, [state.habits]);

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <nav className="sticky top-0 z-10 flex items-baseline justify-between border-b border-border/60 bg-background/95 px-6 py-6 backdrop-blur-xl md:px-10">
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">{dateLabel}</h1>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-primary transition-colors hover:text-primary/80">
            Today
          </a>

          <a
            href="#"
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            History
          </a>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="grid size-9 place-items-center rounded-full bg-muted transition-all hover:bg-muted/80"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/20">
            JD
          </div>
        </div>
      </nav>

      <main className="dashboard-container grid grid-cols-12 gap-8 py-12 md:gap-12">
        {/* LEFT */}
        <aside className="col-span-12 space-y-10 lg:col-span-3">
          <section className="space-y-5">
            <h2 className="mini-label">
              Current Intent
            </h2>

            <div className="sidebar-card space-y-4 transition-all duration-300 hover:shadow-md">
              {editIntent ? (
                <textarea
                  autoFocus
                  value={state.intent}
                  onChange={(e) => setIntent(e.target.value)}
                  onBlur={() => setEditIntent(false)}
                  rows={3}
                  className="w-full resize-none bg-transparent font-serif text-lg font-medium leading-snug tracking-tight outline-none"
                />
              ) : (
                <p
                  onClick={() => setEditIntent(true)}
                  className="cursor-text font-serif text-lg font-medium leading-snug tracking-tight transition-colors hover:text-primary"
                >
                  {state.intent}
                </p>
              )}

              <div className="flex items-center gap-2.5">
                <div className="size-2 animate-pulse rounded-full bg-primary shadow-lg shadow-primary/50" />

                <span className="mini-label text-[10px]">
                  Active Phase
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="mini-label">
              Last 14 Days
            </h2>

            <div className="sidebar-card">
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const ratio = dayCompletionRatio(state.habits, d);

                  return (
                    <div
                      key={d}
                      className="aspect-square rounded-lg bg-primary transition-all duration-300 hover:scale-110"
                      style={{
                        opacity: Math.max(ratio, 0.1),
                      }}
                    />
                  );
                })}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                You're at <span className="font-semibold text-primary">{Math.round(weekRatio * 100)}%</span> consistency this week.
              </p>
            </div>
          </section>
        </aside>

        {/* CENTER */}
        <section className="col-span-12 space-y-8 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Daily Rituals</h2>

            <button
              onClick={() => setShowAdd((v) => !v)}
              className="ritual-button"
            >
              {showAdd ? "Close" : "+ Add Ritual"}
            </button>
          </div>

          {showAdd && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                addHabit(name, detail);

                setName("");
                setDetail("");
                setShowAdd(false);
              }}
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
                placeholder="Add a short description..."
                className="mt-3 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ritual-button"
                >
                  Save Ritual
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {hydrated && state.habits.length === 0 && (
              <div className="ritual-card text-center">
                <p className="mb-3 font-serif text-3xl font-semibold text-muted-foreground">A blank canvas.</p>

                <p className="text-sm text-muted-foreground">
                  Add your first ritual to begin your journey.
                </p>
              </div>
            )}

            {state.habits.map((h) => {
              const done = !!h.completions[today];
              const streak = streakOf(h);

              return (
                <div
                  key={h.id}
                  className="ritual-card group flex items-center"
                >
                  <button
                    onClick={() => toggleToday(h.id)}
                    className={`mr-6 size-8 rounded-full transition-all duration-300 ${
                      done 
                        ? "bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20" 
                        : "border-2 border-border hover:border-primary"
                    }`}
                  >
                    {done && (
                      <svg className="mx-auto size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-serif text-xl font-semibold transition-all ${
                        done ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {h.name}
                    </h3>

                    <p className="mt-1.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
                      <span>{h.detail || "No description"}</span>
                      {streak > 0 && (
                        <>
                          <span className="text-border">•</span>
                          <span className="font-semibold text-primary">🔥 {streak} day streak</span>
                        </>
                      )}
                    </p>
                  </div>

                  {!done && (
                    <button
                      onClick={() => removeHabit(h.id)}
                      className="ml-4 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="col-span-12 space-y-10 lg:col-span-3">
          <section className="space-y-5">
            <h2 className="mini-label">
              Today's Progress
            </h2>

            <div className="sidebar-card bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-6xl font-bold text-primary">{completedToday}</span>

                <span className="text-lg text-muted-foreground">/ {total}</span>
              </div>

              <p className="mini-label mt-3 text-[10px]">
                Rituals Completed
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 shadow-lg shadow-primary/30 transition-all duration-700 ease-out"
                  style={{
                    width: total ? `${(completedToday / total) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="mini-label">
              Reflection
            </h2>

            <div className="sidebar-card">
              <p className="font-serif text-base leading-relaxed text-muted-foreground">
                {completedToday === 0
                  ? "A quiet start. The first check-in unlocks momentum."
                  : completedToday === total
                    ? "Full alignment today. Notice what made it possible."
                    : `${total - completedToday} ritual${total - completedToday > 1 ? 's' : ''} remaining.`}
              </p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default App;
