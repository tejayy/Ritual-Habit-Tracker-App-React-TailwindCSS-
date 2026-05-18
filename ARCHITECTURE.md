# Clean Architecture Documentation

## 📁 Project Structure

```
src/
├── components/          # React components (Presentation Layer)
│   ├── Navigation/
│   │   └── Navigation.tsx
│   ├── Sidebar/
│   │   ├── LeftSidebar.tsx
│   │   └── RightSidebar.tsx
│   ├── HabitList/
│   │   ├── HabitList.tsx
│   │   ├── SortableHabitItem.tsx
│   │   ├── AddHabitForm.tsx
│   │   └── SearchAndFilter.tsx
│   └── PrintView/
│       └── PrintView.tsx
│
├── hooks/              # Custom React hooks (Application Layer)
│   ├── useHabits.ts
│   └── useDarkMode.ts
│
├── services/           # External services (Infrastructure Layer)
│   └── storageService.ts
│
├── utils/              # Pure utility functions (Domain Layer)
│   ├── dateUtils.ts
│   ├── habitUtils.ts
│   └── confettiUtils.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── constants/          # Application constants
│   └── index.ts
│
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

---

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (`components/`)
**Responsibility**: UI rendering and user interactions

- **Navigation**: Top navigation bar with theme toggle and print button
- **Sidebar**: Left (intent & heatmap) and Right (progress & reflection)
- **HabitList**: Main ritual list with drag-drop, search, and filters
- **PrintView**: Printable checklist view

**Principles**:
- Components are pure and receive data via props
- No business logic in components
- Event handlers passed down from parent
- Focused, single-responsibility components

---

### 2. **Application Layer** (`hooks/`)
**Responsibility**: Application state and business logic orchestration

#### `useHabits.ts`
- Manages habit state (CRUD operations)
- Handles localStorage persistence
- Implements undo functionality
- Triggers confetti on completion
- Coordinates habit reordering

#### `useDarkMode.ts`
- Manages theme state
- Persists theme preference
- Applies theme to DOM

**Principles**:
- Encapsulates complex state logic
- Provides clean API to components
- Handles side effects (localStorage, DOM)
- Reusable across components

---

### 3. **Domain Layer** (`utils/`)
**Responsibility**: Pure business logic and calculations

#### `habitUtils.ts`
- `calculateStreak()`: Computes consecutive completion days
- `calculateDayCompletionRatio()`: Daily completion percentage
- `calculateWeekRatio()`: Weekly consistency metric
- `getUniqueCategories()`: Extracts unique categories
- `filterHabits()`: Filters habits by search/category/archive

#### `dateUtils.ts`
- `getTodayString()`: Returns ISO date string
- `generateDays()`: Creates array of date strings
- `getDateLabel()`: Formats date for display

#### `confettiUtils.ts`
- `triggerConfetti()`: Celebration animation

**Principles**:
- Pure functions (no side effects)
- Testable in isolation
- No dependencies on React or external services
- Single responsibility per function

---

### 4. **Infrastructure Layer** (`services/`)
**Responsibility**: External integrations and I/O

#### `storageService.ts`
- `loadState()`: Reads from localStorage
- `saveState()`: Writes to localStorage
- `loadDarkMode()`: Reads theme preference
- `saveDarkMode()`: Writes theme preference

**Principles**:
- Abstracts external dependencies
- Error handling for I/O operations
- Easy to mock for testing
- Can be swapped (e.g., localStorage → API)

---

### 5. **Types Layer** (`types/`)
**Responsibility**: Type definitions and contracts

```typescript
type Habit = {
  id: string;
  name: string;
  detail: string;
  completions: Record<string, boolean>;
  category?: string;
  archived?: boolean;
  order?: number;
};

type State = {
  intent: string;
  habits: Habit[];
  undoStack: UndoAction[];
};
```

**Principles**:
- Centralized type definitions
- Shared across all layers
- Type safety throughout app

---

### 6. **Constants Layer** (`constants/`)
**Responsibility**: Application-wide constants

- `STORAGE_KEY`: localStorage key for habits
- `DARK_MODE_KEY`: localStorage key for theme
- `DEFAULT_STATE`: Initial application state
- `MAX_UNDO_STACK_SIZE`: Undo history limit

**Principles**:
- Single source of truth
- Easy to modify
- No magic strings/numbers

---

## 🔄 Data Flow

```
User Action
    ↓
Component (Presentation)
    ↓
Hook (Application)
    ↓
Utils (Domain Logic)
    ↓
Service (Infrastructure)
    ↓
localStorage / External API
```

### Example: Completing a Ritual

1. **User clicks checkbox** → `SortableHabitItem.tsx`
2. **Component calls** → `onToggle(habitId)`
3. **Hook receives** → `useHabits.toggleToday(id)`
4. **Hook updates state** → Uses `getTodayString()` from utils
5. **Hook checks completion** → Calls `triggerConfetti()` if all done
6. **Hook persists** → `storageService.saveState()`
7. **Component re-renders** → With updated state

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
Each layer has a distinct responsibility and doesn't leak into others.

### 2. **Dependency Inversion**
- High-level modules (hooks) don't depend on low-level modules (services)
- Both depend on abstractions (types)

### 3. **Single Responsibility**
- Each file/function has one reason to change
- Components only render UI
- Hooks only manage state
- Utils only compute values

### 4. **Open/Closed Principle**
- Easy to extend (add new features)
- Closed for modification (existing code stable)

### 5. **DRY (Don't Repeat Yourself)**
- Shared logic extracted to utils
- Reusable components
- Centralized constants

---

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Test pure functions in isolation
- **Services**: Mock localStorage
- **Hooks**: Use React Testing Library

### Integration Tests
- **Components**: Test with real hooks
- **User flows**: Complete ritual, undo, search

### E2E Tests
- **Critical paths**: Add ritual → Complete → View stats

---

## 🚀 Benefits of This Architecture

### 1. **Maintainability**
- Easy to locate code
- Clear responsibilities
- Minimal coupling

### 2. **Testability**
- Pure functions easy to test
- Services can be mocked
- Components isolated

### 3. **Scalability**
- Add features without breaking existing code
- Easy to refactor individual layers
- Team can work on different layers

### 4. **Readability**
- Consistent structure
- Self-documenting organization
- Clear data flow

### 5. **Reusability**
- Utils can be used anywhere
- Hooks can be shared
- Components are composable

---

## 📝 Adding New Features

### Example: Add "Ritual Notes" Feature

1. **Update Types** (`types/index.ts`)
```typescript
type Habit = {
  // ... existing fields
  notes?: Record<string, string>; // date → note
};
```

2. **Add Util Function** (`utils/habitUtils.ts`)
```typescript
export const getNotesForDate = (habit: Habit, date: string): string => {
  return habit.notes?.[date] || "";
};
```

3. **Update Hook** (`hooks/useHabits.ts`)
```typescript
const addNote = (habitId: string, date: string, note: string) => {
  setState(prev => ({
    ...prev,
    habits: prev.habits.map(h =>
      h.id === habitId
        ? { ...h, notes: { ...h.notes, [date]: note } }
        : h
    )
  }));
};
```

4. **Create Component** (`components/HabitList/NoteModal.tsx`)
```typescript
export const NoteModal: React.FC<Props> = ({ ... }) => {
  // UI for adding notes
};
```

5. **Integrate** (`App.tsx`)
```typescript
// Pass addNote to HabitList
```

---

## 🔧 Refactoring Guidelines

### When to Extract a Component
- Component > 200 lines
- Repeated UI patterns
- Complex conditional rendering

### When to Create a Hook
- Stateful logic used in multiple components
- Complex side effects
- Reusable business logic

### When to Add a Util
- Pure calculation used multiple times
- Complex algorithm
- Testable logic

### When to Create a Service
- External API calls
- Browser API interactions
- Third-party integrations

---

## 📚 Further Reading

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 🎉 Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable for future features
- ✅ Type-safe throughout
- ✅ Reusable components and logic
- ✅ Clean, readable codebase

The modular structure makes it easy for developers to understand, extend, and maintain the application over time.
