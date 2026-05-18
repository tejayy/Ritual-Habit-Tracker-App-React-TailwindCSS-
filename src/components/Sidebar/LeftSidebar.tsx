import React from "react";
import type { Habit } from "../../types";
import { calculateDayCompletionRatio } from "../../utils/habitUtils";

type LeftSidebarProps = {
  intent: string;
  onIntentChange: (intent: string) => void;
  editIntent: boolean;
  onEditIntentChange: (editing: boolean) => void;
  days: string[];
  habits: Habit[];
  weekRatio: number;
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  intent,
  onIntentChange,
  editIntent,
  onEditIntentChange,
  days,
  habits,
  weekRatio,
}) => {
  return (
    <aside className="col-span-12 space-y-10 lg:col-span-3">
      <section className="space-y-5">
        <h2 className="mini-label">Current Intent</h2>

        <div className="sidebar-card space-y-4 transition-all duration-300 hover:shadow-md">
          {editIntent ? (
            <textarea
              autoFocus
              value={intent}
              onChange={(e) => onIntentChange(e.target.value)}
              onBlur={() => onEditIntentChange(false)}
              rows={3}
              className="w-full resize-none bg-transparent font-serif text-lg font-medium leading-snug tracking-tight outline-none"
            />
          ) : (
            <p
              onClick={() => onEditIntentChange(true)}
              className="cursor-text font-serif text-lg font-medium leading-snug tracking-tight transition-colors hover:text-primary"
            >
              {intent}
            </p>
          )}

          <div className="flex items-center gap-2.5">
            <div className="size-2 animate-pulse rounded-full bg-primary shadow-lg shadow-primary/50" />
            <span className="mini-label text-[10px]">Active Phase</span>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="mini-label">Last 14 Days</h2>

        <div className="sidebar-card">
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const ratio = calculateDayCompletionRatio(habits, d);

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
            You're at{" "}
            <span className="font-semibold text-primary">
              {Math.round(weekRatio * 100)}%
            </span>{" "}
            consistency this week.
          </p>
        </div>
      </section>
    </aside>
  );
};
