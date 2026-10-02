const fieldOrder = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"] as const;
const bounds = {
  minute: [0, 59],
  hour: [0, 23],
  dayOfMonth: [1, 31],
  month: [1, 12],
  dayOfWeek: [0, 7],
} as const;
const yearInMinutes = 366 * 24 * 60;

export type CronField = (typeof fieldOrder)[number];

export type CronSchedule = {
  fields: Record<CronField, number[]>;
  dayOfMonthAny: boolean;
  dayOfWeekAny: boolean;
};

export function parseCron(expression: string): CronSchedule | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return null;
  }
  const fields = {} as Record<CronField, number[]>;
  for (const [index, name] of fieldOrder.entries()) {
    const part = parts[index];
    if (part === undefined) {
      return null;
    }
    const [min, max] = bounds[name];
    const parsed = parseField(part, min, max, name === "dayOfWeek");
    if (!parsed) {
      return null;
    }
    fields[name] = parsed;
  }
  const dayOfMonth = parts[2];
  const dayOfWeek = parts[4];
  if (dayOfMonth === undefined || dayOfWeek === undefined) {
    return null;
  }
  return {
    fields,
    dayOfMonthAny: dayOfMonth === "*",
    dayOfWeekAny: dayOfWeek === "*",
  };
}

export function nextCronRuns(
  expression: string,
  fromIso: string,
  count: number,
): string[] | null {
  const schedule = parseCron(expression);
  if (!schedule || !Number.isInteger(count) || count < 1 || count > 20) {
    return null;
  }
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) {
    return null;
  }
  const cursor = new Date(from);
  cursor.setUTCSeconds(0, 0);
  cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
  const runs: string[] = [];
  for (let step = 0; step < yearInMinutes && runs.length < count; step += 1) {
    if (matches(cursor, schedule)) {
      runs.push(cursor.toISOString());
    }
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
  }
  return runs;
}

function matches(date: Date, schedule: CronSchedule): boolean {
  const { fields } = schedule;
  if (
    !fields.minute.includes(date.getUTCMinutes()) ||
    !fields.hour.includes(date.getUTCHours())
  ) {
    return false;
  }
  if (!fields.month.includes(date.getUTCMonth() + 1)) {
    return false;
  }
  const dayMatches =
    schedule.dayOfMonthAny || fields.dayOfMonth.includes(date.getUTCDate());
  const weekMatches =
    schedule.dayOfWeekAny || fields.dayOfWeek.includes(date.getUTCDay());
  if (schedule.dayOfMonthAny) {
    return weekMatches;
  }
  if (schedule.dayOfWeekAny) {
    return dayMatches;
  }
  return dayMatches || weekMatches;
}

function parseField(
  field: string,
  min: number,
  max: number,
  sunday: boolean,
): number[] | null {
  const values = new Set<number>();
  for (const item of field.split(",")) {
    if (item.length === 0) {
      return null;
    }
    const [span, stepText, extra] = item.split("/");
    if (span === undefined || extra !== undefined) {
      return null;
    }
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) {
      return null;
    }
    const range = readRange(span, min, max, stepText !== undefined);
    if (!range) {
      return null;
    }
    for (let value = range.start; value <= range.end; value += step) {
      const normalized = sunday && value === 7 ? 0 : value;
      if (sunday && normalized > 6) {
        return null;
      }
      values.add(normalized);
    }
  }
  return values.size === 0 ? null : [...values].sort((left, right) => left - right);
}

function readRange(
  span: string,
  min: number,
  max: number,
  stepped: boolean,
): { start: number; end: number } | null {
  if (span === "*") {
    return { start: min, end: max };
  }
  const [startText, endText, extra] = span.split("-");
  if (startText === undefined || extra !== undefined || startText.length === 0) {
    return null;
  }
  const start = Number(startText);
  const end = endText === undefined ? (stepped ? max : start) : Number(endText);
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < min ||
    end > max ||
    start > end
  ) {
    return null;
  }
  if (endText !== undefined && endText.length === 0) {
    return null;
  }
  return { start, end };
}
