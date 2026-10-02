import { describe, expect, it } from "vitest";
import {
  moveItem,
  parsePageSelection,
  pdfCopyName,
  planSplitAfter,
} from "@/features/pdf-shared/pages";

describe("parsePageSelection", () => {
  it("reads single pages and inclusive ranges", () => {
    expect(parsePageSelection("1-3, 5", 6)).toEqual({ ok: true, pages: [0, 1, 2, 4] });
    expect(parsePageSelection("1,1", 2)).toEqual({ ok: true, pages: [0, 0] });
  });

  it("rejects empty, broken, reversed, and missing pages", () => {
    expect(parsePageSelection("  ", 3).ok).toBe(false);
    expect(parsePageSelection("1-", 3)).toEqual({ ok: false, reason: "invalid" });
    expect(parsePageSelection("3-1", 3)).toEqual({ ok: false, reason: "invalid" });
    expect(parsePageSelection("4", 3)).toEqual({ ok: false, reason: "outOfRange" });
    expect(parsePageSelection("1-201", 300)).toEqual({ ok: false, reason: "tooMany" });
  });
});

describe("planSplitAfter", () => {
  it("keeps both parts non-empty", () => {
    expect(planSplitAfter(3, 1)).toEqual({ ok: true, first: 1, second: 2 });
    expect(planSplitAfter(1, 1)).toEqual({ ok: false, reason: "tooSmall" });
    expect(planSplitAfter(3, 3)).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("pdf list helpers", () => {
  it("moves an item and keeps the ends in place", () => {
    expect(moveItem(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
  });

  it("builds a Windows-safe copy name", () => {
    expect(pdfCopyName("report.pdf", "merged")).toBe("report-merged.pdf");
    expect(pdfCopyName("a:b.pdf", "page-1")).toBe("ab-page-1.pdf");
    expect(pdfCopyName(".hidden", "pages")).toBe(".hidden-pages.pdf");
  });
});
