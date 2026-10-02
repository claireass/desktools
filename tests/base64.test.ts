import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "@/features/base64/logic";

describe("base64", () => {
  it("encodes and decodes utf-8 text", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=");
    expect(encodeBase64("ç")).toBe("w6c=");
    expect(decodeBase64("aGVsbG8=")).toBe("hello");
    expect(decodeBase64("w6c=")).toBe("ç");
  });

  it("ignores whitespace in a valid value", () => {
    expect(decodeBase64("aGVs\nbG8=")).toBe("hello");
  });

  it("rejects a value that is not base64", () => {
    expect(decodeBase64("hello")).toBeNull();
    expect(decodeBase64("****")).toBeNull();
  });
});
