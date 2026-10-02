import { describe, expect, it } from "vitest";
import { safeDownloadName } from "@/utils/safeDownloadName";

describe("safe download names", () => {
  it("keeps only the file name and drops reserved device names", () => {
    expect(safeDownloadName("..\\..\\notes.txt")).toBe("notes.txt");
    expect(safeDownloadName("folder/report.pdf")).toBe("report.pdf");
    expect(safeDownloadName("con.txt")).toBe("_con.txt");
    expect(safeDownloadName("   ")).toBe("download");
  });
});
