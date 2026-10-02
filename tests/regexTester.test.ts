import { describe, expect, it } from "vitest";
import { testRegex } from "@/features/regex-tester/logic";

describe("regex tester", () => {
  it("returns the first match and its groups", () => {
    const result = testRegex("(\\w+)-(\\d+)", "", "id-7");
    expect(result).toEqual({
      ok: true,
      truncated: false,
      matches: [{ index: 0, text: "id-7", groups: ["id", "7"] }],
    });
  });

  it("finds every match when g is set", () => {
    const result = testRegex("a+", "g", "baac");
    expect(result.ok && result.matches.map((match) => match.text)).toEqual(["aa"]);
  });

  it("rejects an empty pattern, a broken pattern, repeated flags, and a huge sample", () => {
    expect(testRegex("", "g", "a").ok).toBe(false);
    expect(testRegex("[", "g", "a").ok).toBe(false);
    expect(testRegex("a", "gg", "a").ok).toBe(false);
    expect(testRegex("a", "g", "a".repeat(10_001)).ok).toBe(false);
  });
});
