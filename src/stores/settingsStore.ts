import { create } from "zustand";
import { writeSettings } from "@/services/persistence";
import { logError } from "@/services/logger";
import { detectLocale } from "@/services/platform";
import type { Locale, Settings, Theme } from "@/types/settings";

export type PersistenceStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; mode: "desktop" | "session" }
  | { state: "error"; detail: string };

type SettingsState = Settings & {
  status: PersistenceStatus;
  applyLoaded: (settings: Settings, mode: "desktop" | "session") => void;
  applyError: (detail: string) => void;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setSidebarCollapsed: (sidebarCollapsed: boolean) => void;
  setLaunchAtStartup: (launchAtStartup: boolean) => void;
  setCloseToTray: (closeToTray: boolean) => void;
  setCheckForUpdates: (checkForUpdates: boolean) => void;
  completeOnboarding: () => void;
};

const initialSettings: Settings = {
  theme: "system",
  locale: detectLocale(),
  sidebarCollapsed: false,
  hasCompletedOnboarding: false,
  launchAtStartup: false,
  closeToTray: false,
  checkForUpdates: false,
};

function currentSettings(state: SettingsState): Settings {
  return {
    theme: state.theme,
    locale: state.locale,
    sidebarCollapsed: state.sidebarCollapsed,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    launchAtStartup: state.launchAtStartup,
    closeToTray: state.closeToTray,
    checkForUpdates: state.checkForUpdates,
  };
}

async function persist(settings: Settings): Promise<void> {
  try {
    await writeSettings(settings);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "settings write failed";
    useSettingsStore.setState({ status: { state: "error", detail } });
    await logError(`Settings write failed: ${detail}`);
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initialSettings,
  status: { state: "idle" },
  applyLoaded: (settings, mode) => {
    set({ ...settings, status: { state: "ready", mode } });
  },
  applyError: (detail) => {
    set({ status: { state: "error", detail } });
  },
  setTheme: (theme) => {
    set({ theme });
    void persist(currentSettings(get()));
  },
  setLocale: (locale) => {
    set({ locale });
    void persist(currentSettings(get()));
  },
  setSidebarCollapsed: (sidebarCollapsed) => {
    set({ sidebarCollapsed });
    void persist(currentSettings(get()));
  },
  setLaunchAtStartup: (launchAtStartup) => {
    set({ launchAtStartup });
    void persist(currentSettings(get()));
  },
  setCloseToTray: (closeToTray) => {
    set({ closeToTray });
    void persist(currentSettings(get()));
  },
  setCheckForUpdates: (checkForUpdates) => {
    set({ checkForUpdates });
    void persist(currentSettings(get()));
  },
  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
    void persist(currentSettings(get()));
  },
}));
