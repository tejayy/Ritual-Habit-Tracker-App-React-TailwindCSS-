import { useState, useMemo } from "react";
import { Navigation } from "./components/Navigation/Navigation";
import { LeftSidebar } from "./components/Sidebar/LeftSidebar";
import { RightSidebar } from "./components/Sidebar/RightSidebar";
import { HabitList } from "./components/HabitList/HabitList";
import { PrintView } from "./components/PrintView/PrintView";
import { useHabits } from "./hooks/useHabits";
import { useDarkMode } from "./hooks/useDarkMode";
import { generateDays, getDateLabel, getTodayString } from "./utils/dateUtils";
import { calculateWeekRatio, getUniqueCategories } from "./utils/habitUtils";

const days = generateDays(14);

const App = () => {
  const {
    state,
    hydrated,
    setIntent,
    addHabit,
    editHabit,
    addHabitsFromTemplate,
    removeHabit,
    archiveHabit,
    duplicateHabit,
    toggleToday,
    undo,
    reorderHabits,
  } = useHabits();

  const { darkMode, toggleDarkMode } = useDarkMode();

  const [editIntent, setEditIntent] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const today = getTodayString();
  const dateLabel = getDateLabel();

  const completedToday = useMemo(() => {
    return state.habits.filter((h) => !h.archived && h.completions[today])
      .length;
  }, [state.habits, today]);

  const total = state.habits.filter((h) => !h.archived).length;

  const weekRatio = useMemo(() => {
    return calculateWeekRatio(state.habits, days);
  }, [state.habits]);

  const categories = useMemo(() => {
    return getUniqueCategories(state.habits);
  }, [state.habits]);

  if (showPrintView) {
    return (
      <PrintView
        intent={state.intent}
        dateLabel={dateLabel}
        habits={state.habits}
        categories={categories}
        total={total}
        onClose={() => setShowPrintView(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      style={{
      backgroundImage: `
        radial-gradient(circle at 50% 50%, 
          rgba(194, 65, 12, 0.18) 0%, 
          rgba(194, 65, 12, 0.1) 25%, 
          rgba(194, 65, 12, 0.04) 35%, 
          transparent 50%
        )
      `,
      backgroundSize: "100% 100%",
    }}
    >
      <Navigation
        dateLabel={dateLabel}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onShowPrintView={() => setShowPrintView(true)}
      />

      <main className="dashboard-container grid grid-cols-12 gap-8 py-12 md:gap-12">
        <LeftSidebar
          intent={state.intent}
          onIntentChange={setIntent}
          editIntent={editIntent}
          onEditIntentChange={setEditIntent}
          days={days}
          habits={state.habits}
          weekRatio={weekRatio}
        />

        <HabitList
          habits={state.habits}
          hydrated={hydrated}
          onToggle={toggleToday}
          onEdit={editHabit}
          onArchive={archiveHabit}
          onDuplicate={duplicateHabit}
          onRemove={removeHabit}
          onAdd={addHabit}
          onAddFromTemplate={addHabitsFromTemplate}
          onReorder={reorderHabits}
          canUndo={state.undoStack.length > 0}
          onUndo={undo}
        />

        <RightSidebar completedToday={completedToday} total={total} />
      </main>
    </div>
  );
};

export default App;
