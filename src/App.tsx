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

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      setState(JSON.parse(raw));
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

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
    <div className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-10 flex items-baseline justify-between border-b border-white/10 bg-black/80 px-6 py-6 backdrop-blur-md md:px-10">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl italic md:text-2xl">{dateLabel}</h1>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium tracking-tight">
          <a href="#" className="text-violet-400">
            Today
          </a>

          <a
            href="#"
            className="hidden opacity-40 transition-opacity hover:opacity-100 sm:inline"
          >
            History
          </a>

          <div className="grid size-8 place-items-center rounded-full bg-violet-500/10 text-[10px] font-bold uppercase tracking-tighter text-violet-300 ring-1 ring-violet-500/20">
            JD
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-12 md:gap-12 md:px-10">
        {/* LEFT */}
        <aside className="col-span-12 space-y-12 lg:col-span-3">
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Current Intent
            </h2>

            <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              {editIntent ? (
                <textarea
                  autoFocus
                  value={state.intent}
                  onChange={(e) => setIntent(e.target.value)}
                  onBlur={() => setEditIntent(false)}
                  rows={3}
                  className="w-full resize-none bg-transparent text-lg font-medium leading-tight tracking-tight outline-none"
                />
              ) : (
                <p
                  onClick={() => setEditIntent(true)}
                  className="cursor-text text-lg font-medium leading-tight tracking-tight"
                >
                  {state.intent}
                </p>
              )}

              <div className="flex items-center gap-2">
                <div className="size-1.5 animate-pulse rounded-full bg-violet-400" />

                <span className="font-mono text-xs uppercase text-gray-500">
                  Active Phase
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Last 14 Days
            </h2>

            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d) => {
                const ratio = dayCompletionRatio(state.habits, d);

                return (
                  <div
                    key={d}
                    className="aspect-square rounded-sm bg-violet-500"
                    style={{
                      opacity: Math.max(ratio, 0.08),
                    }}
                  />
                );
              })}
            </div>

            <p className="text-[11px] leading-relaxed text-gray-500">
              You're at {Math.round(weekRatio * 100)}% consistency this week.
            </p>
          </section>
        </aside>

        {/* CENTER */}
        <section className="col-span-12 space-y-8 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl italic md:text-4xl">Daily Rituals</h2>

            <button
              onClick={() => setShowAdd((v) => !v)}
              className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-violet-400 hover:text-violet-400"
            >
              {showAdd ? "Close" : "+ Add"}
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
              className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name"
                className="w-full bg-transparent text-lg outline-none placeholder:text-gray-500"
              />

              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Short detail"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 text-sm text-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-full bg-white px-4 py-1.5 text-sm text-black"
                >
                  Save Habit
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {hydrated && state.habits.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                <p className="mb-2 text-2xl italic">A blank canvas.</p>

                <p className="text-sm text-gray-500">
                  Add your first ritual to begin.
                </p>
              </div>
            )}

            {state.habits.map((h) => {
              const done = !!h.completions[today];
              const streak = streakOf(h);

              return (
                <div
                  key={h.id}
                  className="group flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-violet-400/30"
                >
                  <button
                    onClick={() => toggleToday(h.id)}
                    className={`mr-5 size-7 rounded-full ${
                      done ? "bg-violet-400" : "border border-white/20"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-medium ${
                        done ? "line-through opacity-40" : ""
                      }`}
                    >
                      {h.name}
                    </h3>

                    <p className="mt-0.5 truncate font-mono text-xs text-gray-500">
                      {h.detail || "—"} {streak > 0 && `• ${streak} day streak`}
                    </p>
                  </div>

                  {!done && (
                    <button
                      onClick={() => removeHabit(h.id)}
                      className="ml-3 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-red-400"
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
        <aside className="col-span-12 space-y-8 lg:col-span-3">
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Today
            </h2>

            <div className="rounded-2xl bg-white p-6 text-black">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl italic">{completedToday}</span>

                <span className="text-sm opacity-50">/ {total}</span>
              </div>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">
                Rituals Completed
              </p>

              <div className="mt-6 h-1 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full bg-violet-500 transition-all duration-700"
                  style={{
                    width: total ? `${(completedToday / total) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 pt-6">
            <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Reflection
            </h2>

            <p className="text-sm leading-relaxed text-gray-400">
              {completedToday === 0
                ? "A quiet start. The first check-in unlocks momentum."
                : completedToday === total
                  ? "Full alignment today. Notice what made it possible."
                  : `${total - completedToday} rituals remaining.`}
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default App;
