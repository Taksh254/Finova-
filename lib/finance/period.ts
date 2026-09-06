/**
 * Deterministic "which payroll/reporting period does this text mean" parser.
 * Anchored to REFERENCE_DATE (not wall-clock time) for the same reason the
 * rest of the app is - the seed data is frozen to Sept 2025 (see
 * referenceDate.ts) - so "this month" always resolves to a period real data
 * exists for. No LLM involved: this is intentionally a small, testable,
 * literal parser rather than a free-text date library.
 */

import { REFERENCE_DATE } from "./referenceDate";

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export function currentPeriod(): string {
  return toPeriod(REFERENCE_DATE.getUTCFullYear(), REFERENCE_DATE.getUTCMonth() + 1);
}

export function toPeriod(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function periodBounds(period: string): { start: Date; end: Date } {
  const [year, month] = period.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    throw new Error(`Invalid period "${period}" - expected "YYYY-MM"`);
  }
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { start, end };
}

/**
 * Resolves a period ("YYYY-MM") from free text, e.g. "Calculate September
 * payroll" -> "2025-09". Falls back to the current (REFERENCE_DATE) period
 * when nothing recognizable is found, rather than guessing.
 */
export function resolvePeriodFromText(text: string): string {
  const lower = text.toLowerCase();

  const explicit = lower.match(/(20\d{2})-(0[1-9]|1[0-2])/);
  if (explicit) return `${explicit[1]}-${explicit[2]}`;

  if (/\blast month\b/.test(lower)) {
    const d = new Date(Date.UTC(REFERENCE_DATE.getUTCFullYear(), REFERENCE_DATE.getUTCMonth() - 1, 1));
    return toPeriod(d.getUTCFullYear(), d.getUTCMonth() + 1);
  }
  if (/\bthis month\b|\bcurrent month\b/.test(lower)) {
    return currentPeriod();
  }

  for (let i = 0; i < MONTH_NAMES.length; i++) {
    const name = MONTH_NAMES[i];
    if (lower.includes(name)) {
      const yearMatch = lower.match(new RegExp(`${name}[,\\s]+(20\\d{2})`));
      const year = yearMatch ? Number(yearMatch[1]) : REFERENCE_DATE.getUTCFullYear();
      return toPeriod(year, i + 1);
    }
  }

  return currentPeriod();
}

/** Weekdays (Mon-Fri) in a given month - the deterministic "working days" basis for proration. */
export function weekdaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const dow = date.getUTCDay();
    if (dow !== 0 && dow !== 6) days.push(date);
  }
  return days;
}
