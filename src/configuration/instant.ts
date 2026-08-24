/** Deterministic elapsed-day arithmetic over a supplied configured instant; never reads wall time. */
export const addElapsedCalendarDays = (instant: string, days: number): string => {
  const parsed = Date.parse(instant);
  if (!Number.isFinite(parsed) || !Number.isSafeInteger(days) || days <= 0) {
    throw new Error("Configured elapsed-day arithmetic requires a valid instant and positive whole days.");
  }
  return new Date(parsed + days * 86_400_000).toISOString();
};
