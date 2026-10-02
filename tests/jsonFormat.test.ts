import { describe, expect, it } from "vitest";
import { formatJson } from "@/features/json-formatter/logic";

describe("formatJson", () => {
  it("pretty-prints valid JSON", () => {
    expect(formatJson('{"b":1,"a":[true,null]}')).toEqual({
      ok: true,
      output: '{\n  "b": 1,\n  "a": [\n    true,\n    null\n  ]\n}',
    });
  });

  it("minifies valid JSON onto one line", () => {
    expect(formatJson('{\n  "b": 1\n}', 0)).toEqual({
      ok: true,
      output: '{"b":1}',
    });
  });

  it("rejects empty and invalid input", () => {
    expect(formatJson("   ")).toEqual({ ok: false, reason: "empty" });
    const invalid = formatJson("{");
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.reason).toBe("invalid");
      expect(invalid.detail).toBeTruthy();
    }
  });
});
