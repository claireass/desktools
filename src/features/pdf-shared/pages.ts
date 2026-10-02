import { splitFileName } from "@/utils/fileName";

export const maxExtractedPages = 200;
export const maxSplitPages = 100;

export type PageSelection =
  | { ok: true; pages: number[] }
  | { ok: false; reason: "empty" | "invalid" | "outOfRange" | "tooMany" };

export function parsePageSelection(input: string, pageCount: number): PageSelection {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    return { ok: false, reason: "outOfRange" };
  }

  const pages: number[] = [];
  for (const token of trimmed.split(",")) {
    const part = token.trim();
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < start) {
        return { ok: false, reason: "invalid" };
      }
      if (end > pageCount) {
        return { ok: false, reason: "outOfRange" };
      }
      if (pages.length + (end - start + 1) > maxExtractedPages) {
        return { ok: false, reason: "tooMany" };
      }
      for (let page = start; page <= end; page += 1) {
        pages.push(page - 1);
      }
      continue;
    }

    if (!/^\d+$/.test(part)) {
      return { ok: false, reason: "invalid" };
    }
    const page = Number(part);
    if (page < 1) {
      return { ok: false, reason: "invalid" };
    }
    if (page > pageCount) {
      return { ok: false, reason: "outOfRange" };
    }
    if (pages.length + 1 > maxExtractedPages) {
      return { ok: false, reason: "tooMany" };
    }
    pages.push(page - 1);
  }

  return { ok: true, pages };
}

export function planSplitAfter(
  pageCount: number,
  after: number,
):
  | { ok: true; first: number; second: number }
  | { ok: false; reason: "tooSmall" | "invalid" } {
  if (!Number.isInteger(pageCount) || pageCount < 2) {
    return { ok: false, reason: "tooSmall" };
  }
  if (!Number.isInteger(after) || after < 1 || after >= pageCount) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, first: after, second: pageCount - after };
}

export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const nextIndex = index + direction;
  if (index < 0 || index >= items.length || nextIndex < 0 || nextIndex >= items.length) {
    return [...items];
  }
  const next = [...items];
  const current = next[index];
  const neighbor = next[nextIndex];
  if (current === undefined || neighbor === undefined) {
    return [...items];
  }
  next[index] = neighbor;
  next[nextIndex] = current;
  return next;
}

export function pdfCopyName(original: string, suffix: string): string {
  const base = splitFileName(original).base;
  let cleaned = "";
  for (const char of base) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || '<>:"/\\|?*'.includes(char)) {
      continue;
    }
    cleaned += char;
  }
  const stem = cleaned.trim().replace(/[. ]+$/g, "");
  return `${stem === "" ? "document" : stem}-${suffix}.pdf`;
}
