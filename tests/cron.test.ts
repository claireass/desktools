import { describe, expect, it } from "vitest";
import { nextCronRuns, parseCron } from "@/features/cron/logic";

describe("cron", () => {
  it("lists the next midnight and a Monday morning", () => {
    expect(nextCronRuns("0 0 * * *", "2026-10-02T12:00:00.000Z", 1)).toEqual([
      "2026-10-03T00:00:00.000Z",
    ]);
    expect(nextCronRuns("0 9 * * 1", "2026-10-02T12:00:00.000Z", 1)).toEqual([
      "2026-10-05T09:00:00.000Z",
    ]);
  });

  it("steps minutes and treats 7 as Sunday", () => {
    expect(nextCronRuns("*/15 * * * *", "2026-10-02T12:07:30.000Z", 2)).toEqual([
      "2026-10-02T12:15:00.000Z",
      "2026-10-02T12:30:00.000Z",
    ]);
    expect(parseCron("0 0 * * 7")?.fields.dayOfWeek).toEqual([0]);
  });

  it("returns no runs for a day that never occurs", () => {
    expect(nextCronRuns("0 0 31 2 *", "2026-10-02T00:00:00.000Z", 1)).toEqual([]);
    expect(parseCron("0 0 * *")).toBeNull();
    expect(parseCron("60 0 * * *")).toBeNull();
  });
});
