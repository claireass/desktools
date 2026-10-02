import { describe, expect, it } from "vitest";
import { formatBytes } from "@/utils/formatBytes";

describe("formatBytes", () => {
  it("formats bytes and binary units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1023)).toBe("1023 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
  });

  it("treats invalid sizes as zero", () => {
    expect(formatBytes(Number.NaN)).toBe("0 B");
    expect(formatBytes(-1)).toBe("0 B");
  });
});
