import { describe, expect, it } from "vitest";
import { describeFile } from "@/features/file-info/logic";

describe("describeFile", () => {
  it("reads the extension, type, and size", () => {
    expect(
      describeFile({
        name: "notes.txt",
        type: "text/plain",
        size: 5,
        lastModified: 1700000000000,
      }),
    ).toEqual({
      name: "notes.txt",
      extension: "txt",
      type: "text/plain",
      size: 5,
      sizeLabel: "5 B",
      lastModified: 1700000000000,
    });
  });

  it("leaves the extension empty when the name has none", () => {
    expect(describeFile({ name: "README", type: "", size: 0, lastModified: 0 }).extension).toBe(
      "",
    );
    expect(describeFile({ name: ".gitignore", type: "", size: 0, lastModified: 0 }).extension).toBe(
      "",
    );
  });
});
