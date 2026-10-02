import type { Locale } from "@/types/settings";

export const lineActions = ["trim", "dropEmpty", "sort", "unique", "reverse"] as const;
export type LineAction = (typeof lineActions)[number];

export function transformLines(
  input: string,
  action: LineAction,
  locale: Locale,
): string {
  const newline = input.includes("\r\n") ? "\r\n" : "\n";
  let lines = input.split(/\r\n|\r|\n/);

  if (action === "trim") {
    lines = lines.map((line) => line.trim());
  } else if (action === "dropEmpty") {
    lines = lines.filter((line) => line.trim() !== "");
  } else if (action === "sort") {
    const tag = locale === "tr" ? "tr" : "en";
    lines = [...lines].sort((left, right) => left.localeCompare(right, tag));
  } else if (action === "unique") {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      if (seen.has(line)) {
        return false;
      }
      seen.add(line);
      return true;
    });
  } else {
    lines = [...lines].reverse();
  }

  return lines.join(newline);
}
