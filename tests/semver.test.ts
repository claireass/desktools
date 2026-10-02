import { describe, expect, it } from "vitest";
import { compareSemver, parseSemver } from "@/services/semver";

describe("parseSemver", () => {
  it("accepts a stable version with an optional v prefix", () => {
    expect(parseSemver("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseSemver("v1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it("rejects incomplete or pre-release versions", () => {
    expect(parseSemver("1.2")).toBeNull();
    expect(parseSemver("1.2.3-beta")).toBeNull();
    expect(parseSemver("")).toBeNull();
  });
});

describe("compareSemver", () => {
  it("orders versions numerically", () => {
    expect(compareSemver("1.0.0", "1.0.1")).toBe(-1);
    expect(compareSemver("1.0.1", "1.1.0")).toBe(-1);
    expect(compareSemver("1.1.0", "2.0.0")).toBe(-1);
    expect(compareSemver("1.9.0", "1.10.0")).toBe(-1);
    expect(compareSemver("v1.2.0", "1.2.0")).toBe(0);
    expect(compareSemver("2.0.0", "1.9.9")).toBe(1);
  });

  it("does not compare invalid versions as strings", () => {
    expect(compareSemver("1.10.0", "1.9")).toBeNull();
  });
});
