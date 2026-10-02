import { describe, expect, it } from "vitest";
import { analyzeSizes } from "@/features/size-analyzer/logic";

describe("analyzeSizes", () => {
  it("totals the files and lists the largest first", () => {
    const report = analyzeSizes([
      { name: "small.txt", size: 5 },
      { name: "large.bin", size: 2048 },
      { name: "mid.txt", size: 100 },
    ]);

    expect(report.count).toBe(3);
    expect(report.total).toBe(2153);
    expect(report.totalLabel).toBe("2.1 KB");
    expect(report.largest?.name).toBe("large.bin");
    expect(report.items.map((item) => item.name)).toEqual(["large.bin", "mid.txt", "small.txt"]);
  });

  it("keeps the earlier file when sizes match", () => {
    const report = analyzeSizes([
      { name: "a.txt", size: 10 },
      { name: "b.txt", size: 10 },
    ]);

    expect(report.largest?.name).toBe("a.txt");
  });

  it("returns an empty report when nothing is selected", () => {
    expect(analyzeSizes([])).toEqual({
      count: 0,
      total: 0,
      totalLabel: "0 B",
      largest: null,
      items: [],
    });
  });
});
