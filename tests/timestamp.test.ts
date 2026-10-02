import { describe, expect, it } from "vitest";
import { isoToUnix, unixToIso } from "@/features/timestamp/logic";

describe("timestamp", () => {
  it("converts unix seconds to UTC", () => {
    expect(unixToIso("0", "seconds")).toBe("1970-01-01T00:00:00.000Z");
    expect(isoToUnix("1970-01-01T00:00:00.000Z", "seconds")).toBe("0");
  });

  it("keeps milliseconds distinct from seconds", () => {
    expect(unixToIso("1000", "milliseconds")).toBe("1970-01-01T00:00:01.000Z");
    expect(isoToUnix("1970-01-01T00:00:01.000Z", "milliseconds")).toBe("1000");
  });

  it("rejects values that are not a whole unix time or a date", () => {
    expect(unixToIso("12.5", "seconds")).toBeNull();
    expect(isoToUnix("not-a-date", "seconds")).toBeNull();
  });
});
