export type UnixUnit = "seconds" | "milliseconds";

export function unixToIso(value: string, unit: UnixUnit): string | null {
  const trimmed = value.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    return null;
  }
  const raw = Number(trimmed);
  if (!Number.isSafeInteger(raw)) {
    return null;
  }
  const milliseconds = unit === "seconds" ? raw * 1000 : raw;
  if (!Number.isSafeInteger(milliseconds)) {
    return null;
  }
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export function isoToUnix(value: string, unit: UnixUnit): string | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const milliseconds = Date.parse(trimmed);
  if (Number.isNaN(milliseconds)) {
    return null;
  }
  if (unit === "seconds") {
    return String(Math.trunc(milliseconds / 1000));
  }
  return String(milliseconds);
}
