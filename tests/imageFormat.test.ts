import { describe, expect, it } from "vitest";
import {
  extensionForFormat,
  mimeForFormat,
  outputName,
  qualityFromPercent,
} from "@/features/image-shared/format";

describe("image format", () => {
  it("maps formats to mime types and extensions", () => {
    expect(mimeForFormat("png")).toBe("image/png");
    expect(mimeForFormat("jpeg")).toBe("image/jpeg");
    expect(mimeForFormat("webp")).toBe("image/webp");
    expect(extensionForFormat("jpeg")).toBe("jpg");
    expect(extensionForFormat("webp")).toBe("webp");
  });

  it("replaces the extension and keeps a hidden-file name", () => {
    expect(outputName("photo.PNG", "jpeg")).toBe("photo.jpg");
    expect(outputName("a.tar.gz", "webp")).toBe("a.tar.webp");
    expect(outputName(".hidden", "png")).toBe(".hidden.png");
  });

  it("keeps quality percents from 10 through 100", () => {
    expect(qualityFromPercent(10)).toBe(0.1);
    expect(qualityFromPercent(80)).toBe(0.8);
    expect(qualityFromPercent(100)).toBe(1);
    expect(qualityFromPercent(9)).toBe(0.8);
    expect(qualityFromPercent(1.5)).toBe(0.8);
  });
});
