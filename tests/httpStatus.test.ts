import { describe, expect, it } from "vitest";
import { describeStatus } from "@/features/http-status/logic";

describe("describeStatus", () => {
  it("names known codes and classes", () => {
    expect(describeStatus("404")).toEqual({
      ok: true,
      code: 404,
      phrase: "Not Found",
      klass: "client",
    });
    expect(describeStatus("200").ok && describeStatus("200")).toMatchObject({
      phrase: "OK",
      klass: "success",
    });
    expect(describeStatus("301").ok && describeStatus("301")).toMatchObject({
      klass: "redirect",
    });
    expect(describeStatus("500").ok && describeStatus("500")).toMatchObject({
      klass: "server",
    });
  });

  it("keeps an unknown code inside the valid range", () => {
    expect(describeStatus("499")).toEqual({
      ok: true,
      code: 499,
      phrase: null,
      klass: "client",
    });
  });

  it("rejects empty and out-of-range codes", () => {
    expect(describeStatus(" ")).toEqual({ ok: false, reason: "empty" });
    expect(describeStatus("99")).toEqual({ ok: false, reason: "invalid" });
    expect(describeStatus("600")).toEqual({ ok: false, reason: "invalid" });
  });
});
