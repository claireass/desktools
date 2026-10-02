import { describe, expect, it } from "vitest";
import { previewRename } from "@/features/file-renamer/logic";

const options = { template: "{n}-{name}.{ext}", start: 1, pad: 2 };

describe("previewRename", () => {
  it("applies the sequence, name, and extension", () => {
    expect(previewRename(["a.txt", "b.txt"], options).map((row) => row.next)).toEqual([
      "01-a.txt",
      "02-b.txt",
    ]);
  });

  it("drops a trailing dot when there is no extension", () => {
    expect(previewRename(["README"], { template: "{name}.{ext}", start: 1, pad: 2 })[0]).toEqual({
      original: "README",
      next: "README",
      problem: null,
    });
  });

  it("flags reserved, invalid, duplicate, empty, and long names", () => {
    const rows = previewRename(["CON.txt", "a:b.txt", "A.txt", "a.TXT", ".env"], {
      template: "{name}.{ext}",
      start: 1,
      pad: 1,
    });

    expect(rows.map((row) => row.problem)).toEqual([
      "reserved",
      "invalid",
      "duplicate",
      "duplicate",
      null,
    ]);

    const longName = `${"x".repeat(256)}.txt`;
    expect(previewRename([longName], { template: "{name}.{ext}", start: 1, pad: 1 })[0]?.problem).toBe(
      "tooLong",
    );
    expect(previewRename(["notes.txt"], { template: "{ext}", start: 1, pad: 1 })[0]?.next).toBe(
      "txt",
    );
    expect(previewRename(["notes"], { template: "   ", start: 1, pad: 1 })[0]?.problem).toBe(
      "empty",
    );
  });
});
