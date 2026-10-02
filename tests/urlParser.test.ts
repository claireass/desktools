import { describe, expect, it } from "vitest";
import { parseUrl } from "@/features/url-parser/logic";

describe("parseUrl", () => {
  it("splits a full address", () => {
    const result = parseUrl("https://ada:secret@example.com:8443/a/b?x=1&x=2#top");
    expect(result).toEqual({
      ok: true,
      parts: {
        scheme: "https",
        username: "ada",
        password: "secret",
        hostname: "example.com",
        port: "8443",
        pathname: "/a/b",
        search: "?x=1&x=2",
        hash: "#top",
        origin: "https://example.com:8443",
        params: [
          { key: "x", value: "1" },
          { key: "x", value: "2" },
        ],
      },
    });
  });

  it("rejects an empty value and an address without a scheme", () => {
    expect(parseUrl("  ")).toEqual({ ok: false, reason: "empty" });
    expect(parseUrl("example.com")).toEqual({ ok: false, reason: "invalid" });
  });
});
