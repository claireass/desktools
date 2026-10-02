import { describe, expect, it } from "vitest";
import { addDays, daysBetween, parseIsoDate } from "@/features/date-calculator/logic";

describe("date calculator", () => {
  it("counts calendar days and adds them", () => {
    expect(daysBetween("2024-01-01", "2024-01-03")).toBe(2);
    expect(daysBetween("2024-01-03", "2024-01-01")).toBe(-2);
    expect(addDays("2024-01-31", 1)).toBe("2024-02-01");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2023-02-28", 1)).toBe("2023-03-01");
  });

  it("rejects dates that are not real calendar days", () => {
    expect(parseIsoDate("2023-02-29")).toBeNull();
    expect(daysBetween("2023-02-29", "2023-03-01")).toBeNull();
    expect(addDays("2024-01-01", 365001)).toBeNull();
  });
});
