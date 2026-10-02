import { describe, expect, it } from "vitest";
import { countText } from "@/features/text-counter/logic";

describe("countText", () => {
  it("counts an empty string as zero", () => {
    expect(countText("")).toEqual({ characters: 0, words: 0, lines: 0, paragraphs: 0 });
  });

  it("counts characters, words, lines, and paragraphs", () => {
    expect(countText("one two\nthree\n\nfour")).toEqual({
      characters: 19,
      words: 4,
      lines: 4,
      paragraphs: 2,
    });
  });

  it("counts emoji as one character", () => {
    expect(countText("👍").characters).toBe(1);
  });
});
