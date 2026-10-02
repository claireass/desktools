const dayLimit = 365_000;

export function daysBetween(start: string, end: string): number | null {
  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  if (!from || !to) {
    return null;
  }
  return Math.round((utc(to) - utc(from)) / 86_400_000);
}

export function addDays(start: string, days: number): string | null {
  const date = parseIsoDate(start);
  if (!date || !Number.isSafeInteger(days) || Math.abs(days) > dayLimit) {
    return null;
  }
  const next = new Date(utc(date) + days * 86_400_000);
  return formatUtc(next);
}

export function parseIsoDate(
  input: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function parseDayCount(input: string): number | null {
  const trimmed = input.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value) || Math.abs(value) > dayLimit) {
    return null;
  }
  return value;
}

function utc(date: { year: number; month: number; day: number }): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function formatUtc(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
