import { describe, expect, it } from "vitest";
import { planResize, scaleSide } from "@/features/image-shared/resize";

describe("scaleSide", () => {
  it("keeps the aspect ratio from either edge", () => {
    expect(scaleSide(100, 50, "width", 50)).toEqual({ width: 50, height: 25 });
    expect(scaleSide(100, 50, "height", 25)).toEqual({ width: 50, height: 25 });
    expect(scaleSide(3, 2, "width", 2)).toEqual({ width: 2, height: 1 });
  });

  it("rejects sizes that are not positive integers", () => {
    expect(scaleSide(100, 50, "width", 1.5)).toBeNull();
    expect(scaleSide(0, 50, "width", 10)).toBeNull();
  });
});

describe("planResize", () => {
  it("accepts edges up to 8192", () => {
    expect(planResize({ width: 8192, height: 1 })).toEqual({
      ok: true,
      width: 8192,
      height: 1,
    });
  });

  it("rejects empty and oversized edges", () => {
    expect(planResize({ width: 0, height: 10 })).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(planResize({ width: 8193, height: 1 })).toEqual({
      ok: false,
      reason: "tooLarge",
    });
  });
});
