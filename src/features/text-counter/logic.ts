import type { TextCounts } from "@/features/text-counter/types";

export function countText(input: string): TextCounts {
  const characters = Array.from(input).length;
  const words = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
  const lines = input === "" ? 0 : input.split(/\r\n|\r|\n/).length;
  const paragraphs =
    input.trim() === ""
      ? 0
      : input
          .trim()
          .split(/\r?\n\s*\r?\n/)
          .filter(Boolean).length;

  return { characters, words, lines, paragraphs };
}
