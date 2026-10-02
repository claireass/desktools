import { describe, expect, it } from "vitest";
import { convertUnit } from "@/features/unit-converter/logic";
import { formatDecimal } from "@/utils/decimal";

describe("convertUnit", () => {
  it("converts length, mass, and temperature", () => {
    expect(convertUnit(1, "m", "cm")).toEqual({ ok: true, value: 100 });
    const inches = convertUnit(1, "in", "cm");
    expect(inches.ok && formatDecimal(inches.value)).toBe("2.54");
    expect(convertUnit(0, "C", "F")).toEqual({ ok: true, value: 32 });
    expect(convertUnit(100, "C", "F")).toEqual({ ok: true, value: 212 });
    const kelvin = convertUnit(-273.15, "C", "K");
    expect(kelvin.ok && formatDecimal(kelvin.value)).toBe("0");
  });

  it("rejects a temperature below absolute zero and mixed dimensions", () => {
    expect(convertUnit(-274, "C", "K")).toEqual({
      ok: false,
      reason: "belowAbsoluteZero",
    });
    expect(convertUnit(1, "m", "kg")).toEqual({ ok: false, reason: "mismatch" });
  });
});
