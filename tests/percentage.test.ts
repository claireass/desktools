import { describe, expect, it } from "vitest";
import { changePercent, percentOf, ratioPercent } from "@/features/percentage/logic";

describe("percentage", () => {
  it("calculates a part, a ratio, and a change", () => {
    expect(percentOf(10, 200)).toBe(20);
    expect(ratioPercent(50, 200)).toBe(25);
    expect(changePercent(100, 150)).toBe(50);
  });

  it("refuses to divide by zero", () => {
    expect(ratioPercent(5, 0)).toBeNull();
    expect(changePercent(0, 10)).toBeNull();
  });
});
