# Architecture Diagram

## 🏗️ Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                      (Components)                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Navigation  │  │  LeftSidebar │  │ RightSidebar │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              HabitList Component                      │  │
│  │  ┌────────────────┐  ┌────────────────┐             │  │
│  │  │ SearchAndFilter│  │ AddHabitForm   │             │  │
│  │  └────────────────┘  └────────────────┘             │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │      SortableHabitItem (repeated)              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PrintView Component                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │ Props & Callbacks
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                        (Hooks)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │    useHabits()       │      │   useDarkMode()      │    │
│  │                      │      │                      │    │
│  │  • State Management  │      │  • Theme State       │    │
│  │  • CRUD Operations   │      │  • Persistence       │    │
│  │  • Undo Stack        │      │  • DOM Updates       │    │
│  │  • Persistence       │      │                      │    │
│  └──────────────────────┘      └──────────────────────┘    │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │ Calls
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│                        (Utils)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │   dateUtils.ts   │  │  habitUtils.ts   │  │confetti  │ │
│  │                  │  │                  │  │Utils.ts  │ │
│  │ • getTodayString │  │ • calculateStreak│  │          │ │
│  │ • generateDays   │  │ • filterHabits   │  │ • trigger│ │
│  │ • getDateLabel   │  │ • getCategories  │  │ Confetti │ │
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │ Uses
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│                      (Services)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           storageService.ts                           │  │
│  │                                                        │  │
│  │  • loadState()      • saveState()                     │  │
│  │  • loadDarkMode()   • saveDarkMode()                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │ Reads/Writes
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL STORAGE                          │
│                     (localStorage)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CROSS-CUTTING CONCERNS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  types/      │              │  constants/  │            │
│  │  index.ts    │              │  index.ts    │            │
│  │              │              │              │            │
│  │ • Habit      │              │ • STORAGE_KEY│            │
│  │ • State      │              │ • DEFAULT_   │            │
│  │ • UndoAction │              │   STATE      │            │
│  └──────────────┘              └──────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Example: User Completes a Ritual

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                               │
│    User clicks checkbox on ritual                            │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. COMPONENT (SortableHabitItem.tsx)                        │
│    onClick={() => onToggle(habit.id)}                       │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PARENT COMPONENT (HabitList.tsx)                         │
│    Passes event up to App.tsx                                │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. HOOK (useHabits.ts)                                      │
│    toggleToday(id) called                                    │
│    ├─ Gets today's date from dateUtils                      │
│    ├─ Updates habit completion state                        │
│    ├─ Adds to undo stack                                    │
│    ├─ Checks if all habits complete                         │
│    └─ Triggers confetti if 100%                             │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. UTILS (confettiUtils.ts)                                 │
│    triggerConfetti() - Pure function                         │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. SERVICE (storageService.ts)                              │
│    saveState(newState) - Persist to localStorage            │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. EXTERNAL STORAGE                                          │
│    localStorage.setItem('datalabel-habits', JSON)            │
└────────────────────────┬─────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. RE-RENDER                                                 │
│    React updates all components with new state               │
│    ├─ Checkbox shows checkmark                              │
│    ├─ Progress bar updates                                  │
│    ├─ Streak counter updates                                │
│    └─ Confetti animation plays                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Hierarchy

```
App.tsx (Main Orchestrator)
│
├─ Navigation
│  ├─ Date Display
│  ├─ Print Button
│  ├─ Theme Toggle
│  └─ User Avatar
│
├─ LeftSidebar
│  ├─ Intent Editor
│  └─ 14-Day Heatmap
│
├─ HabitList (Center Column)
│  ├─ Header
│  │  └─ Add Ritual Button
│  │
│  ├─ SearchAndFilter
│  │  ├─ Search Input
│  │  ├─ Category Filters
│  │  ├─ Archive Toggle
│  │  └─ Undo Button
│  │
│  ├─ AddHabitForm (conditional)
│  │  ├─ Name Input
│  │  ├─ Description Input
│  │  ├─ Category Input
│  │  └─ Submit/Cancel Buttons
│  │
│  └─ DndContext (Drag & Drop)
│     └─ SortableContext
│        └─ SortableHabitItem (repeated)
│           ├─ Drag Handle
│           ├─ Checkbox
│           ├─ Habit Info
│           │  ├─ Name
│           │  ├─ Category Badge
│           │  ├─ Description (Markdown)
│           │  └─ Streak Counter
│           └─ Action Buttons
│              ├─ Duplicate
│              ├─ Archive
│              └─ Delete
│
├─ RightSidebar
│  ├─ Progress Card
│  │  ├─ Completion Count
│  │  └─ Progress Bar
│  └─ Reflection Section
│
└─ PrintView (conditional)
   ├─ Header
   ├─ Intent
   ├─ Habits by Category
   └─ Progress Tracker
```

---

## 🔌 Hook Dependencies

```
useHabits()
│
├─ Uses: storageService
│  └─ loadState()
│  └─ saveState()
│
├─ Uses: dateUtils
│  └─ getTodayString()
│
├─ Uses: confettiUtils
│  └─ triggerConfetti()
│
└─ Returns:
   ├─ state: State
   ├─ hydrated: boolean
   ├─ setIntent()
   ├─ addHabit()
   ├─ removeHabit()
   ├─ archiveHabit()
   ├─ duplicateHabit()
   ├─ toggleToday()
   ├─ undo()
   └─ reorderHabits()

useDarkMode()
│
├─ Uses: storageService
│  └─ loadDarkMode()
│  └─ saveDarkMode()
│
└─ Returns:
   ├─ darkMode: boolean
   └─ toggleDarkMode()
```

---

## 🗂️ File Dependencies

```
App.tsx
├─ imports Navigation
├─ imports LeftSidebar
├─ imports RightSidebar
├─ imports HabitList
├─ imports PrintView
├─ imports useHabits
├─ imports useDarkMode
├─ imports dateUtils
└─ imports habitUtils

HabitList.tsx
├─ imports SearchAndFilter
├─ imports AddHabitForm
├─ imports SortableHabitItem
├─ imports types
├─ imports dateUtils
└─ imports habitUtils

useHabits.ts
├─ imports types
├─ imports storageService
├─ imports constants
├─ imports dateUtils
└─ imports confettiUtils

storageService.ts
├─ imports types
└─ imports constants
```

---

## 🎯 Dependency Rules

### ✅ Allowed Dependencies

```
Components → Hooks
Components → Utils
Components → Types
Hooks → Services
Hooks → Utils
Hooks → Types
Services → Types
Utils → Types
```

### ❌ Forbidden Dependencies

```
Utils → Hooks (Utils must be pure)
Utils → Services (Utils must be pure)
Services → Hooks (Services are low-level)
Types → Anything (Types are definitions only)
```

---

## 📊 Complexity Metrics

### Lines of Code per Layer

| Layer | Files | Total Lines | Avg per File |
|-------|-------|-------------|--------------|
| Components | 8 | ~800 | ~100 |
| Hooks | 2 | ~200 | ~100 |
| Utils | 3 | ~150 | ~50 |
| Services | 1 | ~50 | ~50 |
| Types | 1 | ~30 | ~30 |
| Constants | 1 | ~15 | ~15 |
| **Total** | **16** | **~1,245** | **~78** |

### Comparison

| Metric | Before | After |
|--------|--------|-------|
| Total Files | 1 | 16 |
| Largest File | 800 lines | 150 lines |
| Testability | Low | High |
| Coupling | High | Low |
| Cohesion | Low | High |

---

## 🚀 Benefits Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    BEFORE REFACTORING                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │                    App.tsx (800 lines)                  │ │
│  │                                                         │ │
│  │  • All components mixed together                       │ │
│  │  • Business logic scattered                            │ │
│  │  • Hard to test                                        │ │
│  │  • Difficult to maintain                               │ │
│  │  • No clear structure                                  │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                            ↓ REFACTOR ↓

┌─────────────────────────────────────────────────────────────┐
│                    AFTER REFACTORING                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Components│  │  Hooks   │  │  Utils   │  │ Services │   │
│  │          │  │          │  │          │  │          │   │
│  │ • Clear  │  │ • State  │  │ • Pure   │  │ • I/O    │   │
│  │ • Focused│  │ • Logic  │  │ • Tested │  │ • Abstract│  │
│  │ • Reuse  │  │ • Reuse  │  │ • Reuse  │  │ • Mock   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ✅ Easy to understand                                      │
│  ✅ Easy to test                                            │
│  ✅ Easy to maintain                                        │
│  ✅ Easy to extend                                          │
│  ✅ Professional structure                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for building and scaling the Daily Rituals app! 🚀
