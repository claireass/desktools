import { describe, expect, it } from "vitest";
import { convertCase } from "@/features/case-converter/logic";

describe("convertCase", () => {
  it("follows Turkish casing when the locale is Turkish", () => {
    expect(convertCase("istanbul", "title", "tr")).toBe("İstanbul");
    expect(convertCase("IĞDIR", "lower", "tr")).toBe("ığdır");
    expect(convertCase("istanbul. ankara", "sentence", "tr")).toBe("İstanbul. Ankara");
  });

  it("uses English casing for the English locale", () => {
    expect(convertCase("hello world", "title", "en")).toBe("Hello World");
    expect(convertCase("hello. world", "sentence", "en")).toBe("Hello. World");
    expect(convertCase("Hello", "upper", "en")).toBe("HELLO");
  });
});
