import { describe, expect, it } from "vitest";
import { decodeUrlText, encodeUrlText } from "@/features/url-codec/logic";

describe("url codec", () => {
  it("encodes and decodes reserved characters", () => {
    expect(encodeUrlText("a b&ç")).toBe("a%20b%26%C3%A7");
    expect(decodeUrlText("a%20b%26%C3%A7")).toBe("a b&ç");
  });

  it("rejects a broken escape", () => {
    expect(decodeUrlText("%")).toBeNull();
    expect(decodeUrlText("%ZZ")).toBeNull();
  });
});
