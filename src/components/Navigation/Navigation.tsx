import React from "react";

type NavigationProps = {
  dateLabel: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowPrintView: () => void;
};

export const Navigation: React.FC<NavigationProps> = ({
  dateLabel,
  darkMode,
  onToggleDarkMode,
  onShowPrintView,
}) => {
  return (
    <nav className="sticky top-0 z-10 flex items-baseline justify-between border-b border-border/60 bg-background/95 px-6 py-6 backdrop-blur-xl md:px-10">
      <div className="flex items-baseline gap-4">
        <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          {dateLabel}
        </h1>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={onShowPrintView}
          className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
          title="Print View"
        >
          Print
        </button>

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
          onClick={onToggleDarkMode}
          className="grid size-9 place-items-center rounded-full bg-muted transition-all hover:bg-muted/80"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              className="size-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="size-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/20">
          JD
        </div>
      </div>
    </nav>
  );
};
