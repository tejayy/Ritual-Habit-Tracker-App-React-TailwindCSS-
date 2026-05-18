import React from "react";

type RightSidebarProps = {
  completedToday: number;
  total: number;
};

export const RightSidebar: React.FC<RightSidebarProps> = ({
  completedToday,
  total,
}) => {
  return (
    <aside className="col-span-12 space-y-10 lg:col-span-3">
      <section className="space-y-5">
        <h2 className="mini-label">Today's Progress</h2>

        <div className="sidebar-card bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-6xl font-bold text-primary">
              {completedToday}
            </span>
            <span className="text-lg text-muted-foreground">/ {total}</span>
          </div>

          <p className="mini-label mt-3 text-[10px]">Rituals Completed</p>

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
        <h2 className="mini-label">Reflection</h2>

        <div className="sidebar-card">
          <p className="font-serif text-base leading-relaxed text-muted-foreground">
            {completedToday === 0
              ? "A quiet start. The first check-in unlocks momentum."
              : completedToday === total
                ? "Full alignment today. Notice what made it possible."
                : `${total - completedToday} ritual${
                    total - completedToday > 1 ? "s" : ""
                  } remaining.`}
          </p>
        </div>
      </section>
    </aside>
  );
};
