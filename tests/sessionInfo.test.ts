import { describe, expect, it } from "vitest";
import { normalizeSession } from "@/features/system-info/logic";

describe("normalizeSession", () => {
  it("drops missing hardware values and blank languages", () => {
    expect(
      normalizeSession({
        language: " en ",
        languages: ["en", " "],
        platform: " Win32 ",
        userAgent: " agent ",
        cores: 0,
        memoryGb: 0,
        screenWidth: 1920.2,
        screenHeight: 0,
        timezone: " Europe/Istanbul ",
        online: true,
      }),
    ).toEqual({
      language: "en",
      languages: ["en"],
      platform: "Win32",
      userAgent: "agent",
      cores: null,
      memoryGb: null,
      screenWidth: 1920,
      screenHeight: 0,
      timezone: "Europe/Istanbul",
      online: true,
    });
  });
});
