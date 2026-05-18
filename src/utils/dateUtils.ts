export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const generateDays = (count: number): string[] => {
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (count - 1 - i));
    return d.toISOString().split("T")[0];
  });
};

export const getDateLabel = (): string => {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
