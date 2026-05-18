import React from "react";
import type { Habit } from "../../types";

type PrintViewProps = {
  intent: string;
  dateLabel: string;
  habits: Habit[];
  categories: string[];
  total: number;
  onClose: () => void;
};

export const PrintView: React.FC<PrintViewProps> = ({
  intent,
  dateLabel,
  habits,
  categories,
  total,
  onClose,
}) => {
  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between border-b-2 border-black pb-4 print:mb-6">
          <div>
            <h1 className="font-serif text-4xl font-bold">Daily Rituals</h1>
            <p className="mt-2 text-lg text-gray-600">{dateLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-black px-4 py-2 text-white print:hidden"
          >
            Close Print View
          </button>
        </div>

        <div className="mb-6">
          <p className="font-serif text-lg italic text-gray-700">{intent}</p>
        </div>

        {categories.length > 0 ? (
          categories.map((cat) => {
            const categoryHabits = habits.filter(
              (h) => h.category === cat && !h.archived
            );
            if (categoryHabits.length === 0) return null;

            return (
              <div key={cat} className="mb-8">
                <h2 className="mb-4 font-serif text-2xl font-semibold">{cat}</h2>
                <div className="space-y-3">
                  {categoryHabits.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start gap-4 border-b border-gray-300 pb-3"
                    >
                      <div className="mt-1 size-6 rounded border-2 border-black" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{h.name}</h3>
                        {h.detail && (
                          <p className="mt-1 text-sm text-gray-600">{h.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="space-y-3">
            {habits
              .filter((h) => !h.archived)
              .map((h) => (
                <div
                  key={h.id}
                  className="flex items-start gap-4 border-b border-gray-300 pb-3"
                >
                  <div className="mt-1 size-6 rounded border-2 border-black" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{h.name}</h3>
                    {h.detail && (
                      <p className="mt-1 text-sm text-gray-600">{h.detail}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="mt-8 border-t-2 border-black pt-4">
          <p className="text-sm text-gray-600">
            Progress: ___ / {total} rituals completed
          </p>
        </div>
      </div>
    </div>
  );
};
