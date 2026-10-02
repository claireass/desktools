import { describe, expect, it } from "vitest";
import { transformLines } from "@/features/line-tools/logic";

describe("transformLines", () => {
  it("sorts, trims, drops empty lines, and keeps the first duplicate", () => {
    expect(transformLines("b\na", "sort", "en")).toBe("a\nb");
    expect(transformLines(" a \n b ", "trim", "en")).toBe("a\nb");
    expect(transformLines("a\n\nb", "dropEmpty", "en")).toBe("a\nb");
    expect(transformLines("a\na\nb", "unique", "en")).toBe("a\nb");
    expect(transformLines("A\na", "unique", "en")).toBe("A\na");
    expect(transformLines("a\nb", "reverse", "en")).toBe("b\na");
  });
});
