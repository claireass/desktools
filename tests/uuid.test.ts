import { describe, expect, it } from "vitest";
import { createUuid, isUuid } from "@/features/uuid-generator/logic";

describe("createUuid", () => {
  it("returns a version 4 uuid", () => {
    expect(isUuid(createUuid())).toBe(true);
  });

  it("builds a uuid when randomUUID is missing", () => {
    const original = crypto.randomUUID;
    Object.defineProperty(crypto, "randomUUID", { configurable: true, value: undefined });
    try {
      expect(isUuid(createUuid())).toBe(true);
    } finally {
      Object.defineProperty(crypto, "randomUUID", {
        configurable: true,
        value: original,
      });
    }
  });
});
