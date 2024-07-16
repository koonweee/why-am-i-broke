"use client";

/**
 * Returns `curMont`, `startDate` and `endDate`, where `startDate` is the first day of the current month
 * and `endDate` is the end of the current date (ie. current date + 1 day, 12am). Localized to the user's browser timezone.
 */
export function useMonthUpToCurrentDate() {
  const curDate = new Date();
  const startDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    curDate.getDate() + 1,
    0,
    0,
    0,
    0
  );

  const curMonthString = curDate.toLocaleString("default", { month: "long" });
  return { curMonthString, startDate, endDate };
}
