/**
 * Date helpers for the booking flow.
 * All dates are handled as `YYYY-MM-DD` strings to match the DRF DateField
 * contract and avoid timezone drift from full Date objects.
 */

/** Returns today's date as a `YYYY-MM-DD` string in the user's local timezone. */
export function todayISO(): string {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

/** Adds `days` to a `YYYY-MM-DD` string and returns a new `YYYY-MM-DD` string. */
export function addDaysISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + days);
  const tzOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

/**
 * Number of rental days between two `YYYY-MM-DD` strings.
 * Matches the backend calculation: (end - start).days.
 * Returns 0 when the range is invalid (end <= start).
 */
export function daysBetween(startISO: string, endISO: string): number {
  if (!startISO || !endISO) return 0;
  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.round(diffMs / 86_400_000);
  return days > 0 ? days : 0;
}

/** Human-friendly date, e.g. "Aug 12, 2026". Falls back to the raw string. */
export function formatDate(dateISO: string): string {
  if (!dateISO) return "";
  const date = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateISO;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
