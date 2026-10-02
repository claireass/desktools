import type { Locale } from "@/types/settings";

export const caseModes = ["upper", "lower", "title", "sentence"] as const;
export type CaseMode = (typeof caseModes)[number];

export function convertCase(input: string, mode: CaseMode, locale: Locale): string {
  const tag = locale === "tr" ? "tr" : "en";
  if (mode === "upper") {
    return input.toLocaleUpperCase(tag);
  }
  if (mode === "lower") {
    return input.toLocaleLowerCase(tag);
  }
  if (mode === "title") {
    return titleCase(input, tag);
  }
  return sentenceCase(input, tag);
}

function titleCase(input: string, locale: string): string {
  return input
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : capitalize(part, locale)))
    .join("");
}

function sentenceCase(input: string, locale: string): string {
  const lower = input.toLocaleLowerCase(locale);
  let capitalizeNext = true;
  let result = "";
  for (const char of Array.from(lower)) {
    if (capitalizeNext && /^\p{L}$/u.test(char)) {
      result += char.toLocaleUpperCase(locale);
      capitalizeNext = false;
    } else {
      result += char;
    }
    if (char === "." || char === "!" || char === "?") {
      capitalizeNext = true;
    }
  }
  return result;
}

function capitalize(word: string, locale: string): string {
  const chars = Array.from(word);
  const first = chars[0];
  if (!first) {
    return word;
  }
  return (
    first.toLocaleUpperCase(locale) + chars.slice(1).join("").toLocaleLowerCase(locale)
  );
}
