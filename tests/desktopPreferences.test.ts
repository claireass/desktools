import { describe, expect, it } from "vitest";
import { describeUpdatePreference } from "@/services/desktopPreferences";
import { parseStoredSettings } from "@/services/persistence";

describe("describeUpdatePreference", () => {
  it("stays off until checking is requested", () => {
    expect(describeUpdatePreference(false, "")).toBe("off");
    expect(describeUpdatePreference(false, "desktools")).toBe("off");
  });

  it("cannot build a check address without a repository owner", () => {
    expect(describeUpdatePreference(true, "  ")).toBe("noRepository");
  });

  it("keeps a requested check inactive until the updater exists", () => {
    expect(describeUpdatePreference(true, "desktools")).toBe("inactive");
  });
});

describe("parseStoredSettings", () => {
  it("defaults the desktop choices to off", () => {
    expect(parseStoredSettings(null)).toMatchObject({
      launchAtStartup: false,
      closeToTray: false,
      checkForUpdates: false,
    });
  });

  it("reads saved desktop choices", () => {
    expect(
      parseStoredSettings({
        launchAtStartup: true,
        closeToTray: true,
        checkForUpdates: true,
      }),
    ).toMatchObject({
      launchAtStartup: true,
      closeToTray: true,
      checkForUpdates: true,
    });
  });

  it("rejects a desktop choice that is not true or false", () => {
    expect(() => parseStoredSettings({ closeToTray: "yes" })).toThrow(/closeToTray/);
  });
});
