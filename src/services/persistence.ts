import { load } from "@tauri-apps/plugin-store";
import { detectLocale, isTauri } from "@/services/platform";
import { isRecentEntry, type RecentEntry } from "@/services/recent";
import { isLocale, isTheme, type Locale, type Settings } from "@/types/settings";

const SETTINGS_FILE = "settings.json";
const FAVORITES_FILE = "favorites.json";
const RECENT_FILE = "recent.json";

export type PersistenceMode = "desktop" | "session";

export type UserData = {
  mode: PersistenceMode;
  settings: Settings;
  favorites: string[];
  recent: RecentEntry[];
};

type MemoryFile = Map<string, unknown>;

const memoryFiles = new Map<string, MemoryFile>();

function memoryFile(path: string): MemoryFile {
  const existing = memoryFiles.get(path);
  if (existing) {
    return existing;
  }
  const created = new Map<string, unknown>();
  memoryFiles.set(path, created);
  return created;
}

type KeyStore = {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
};

function createMemoryStore(path: string): KeyStore {
  const file = memoryFile(path);
  return {
    async get(key) {
      return file.get(key);
    },
    async set(key, value) {
      file.set(key, value);
    },
  };
}

async function createDesktopStore(path: string): Promise<KeyStore> {
  const store = await load(path, { autoSave: false });
  return {
    get: (key) => store.get(key),
    set: async (key, value) => {
      await store.set(key, value);
      await store.save();
    },
  };
}

async function openStore(path: string, mode: PersistenceMode): Promise<KeyStore> {
  if (mode === "session") {
    return createMemoryStore(path);
  }
  return createDesktopStore(path);
}

function defaultSettings(locale: Locale = detectLocale()): Settings {
  return {
    theme: "system",
    locale,
    sidebarCollapsed: false,
    hasCompletedOnboarding: false,
    launchAtStartup: false,
    closeToTray: false,
    checkForUpdates: false,
  };
}

function invalid(file: string, reason: string): Error {
  return new Error(`${file} ${reason}`);
}

export function parseStoredSettings(value: unknown): Settings {
  if (value === undefined || value === null) {
    return defaultSettings();
  }
  if (typeof value !== "object") {
    throw invalid("settings.json", "is not an object");
  }

  const record = value as Record<string, unknown>;
  const settings = defaultSettings();

  if ("theme" in record) {
    if (!isTheme(record.theme)) {
      throw invalid("settings.json", "has an invalid theme");
    }
    settings.theme = record.theme;
  }
  if ("locale" in record) {
    if (!isLocale(record.locale)) {
      throw invalid("settings.json", "has an invalid locale");
    }
    settings.locale = record.locale;
  }
  if ("sidebarCollapsed" in record) {
    if (typeof record.sidebarCollapsed !== "boolean") {
      throw invalid("settings.json", "has an invalid sidebar state");
    }
    settings.sidebarCollapsed = record.sidebarCollapsed;
  }
  if ("hasCompletedOnboarding" in record) {
    if (typeof record.hasCompletedOnboarding !== "boolean") {
      throw invalid("settings.json", "has an invalid onboarding flag");
    }
    settings.hasCompletedOnboarding = record.hasCompletedOnboarding;
  }
  settings.launchAtStartup = readBoolean(record, "launchAtStartup");
  settings.closeToTray = readBoolean(record, "closeToTray");
  settings.checkForUpdates = readBoolean(record, "checkForUpdates");

  return settings;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  if (!(key in record)) {
    return false;
  }
  const value = record[key];
  if (typeof value !== "boolean") {
    throw invalid("settings.json", `has an invalid ${key}`);
  }
  return value;
}

function readFavorites(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw invalid("favorites.json", "is not a list of tool ids");
  }
  return value;
}

function readRecent(value: unknown): RecentEntry[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => !isRecentEntry(item))) {
    throw invalid("recent.json", "is not a list of recent tools");
  }
  return value;
}

export async function readUserData(): Promise<UserData> {
  const mode: PersistenceMode = isTauri() ? "desktop" : "session";
  const settingsStore = await openStore(SETTINGS_FILE, mode);
  const favoritesStore = await openStore(FAVORITES_FILE, mode);
  const recentStore = await openStore(RECENT_FILE, mode);

  const [storedSettings, storedFavorites, storedRecent] = await Promise.all([
    settingsStore.get("settings"),
    favoritesStore.get("ids"),
    recentStore.get("entries"),
  ]);

  const settings = parseStoredSettings(storedSettings);
  const favorites = readFavorites(storedFavorites);
  const recent = readRecent(storedRecent);

  if (storedSettings === undefined || storedSettings === null) {
    await settingsStore.set("settings", settings);
  }

  return { mode, settings, favorites, recent };
}

export async function writeSettings(settings: Settings): Promise<void> {
  const mode: PersistenceMode = isTauri() ? "desktop" : "session";
  const store = await openStore(SETTINGS_FILE, mode);
  await store.set("settings", settings);
}

export async function writeFavorites(ids: readonly string[]): Promise<void> {
  const mode: PersistenceMode = isTauri() ? "desktop" : "session";
  const store = await openStore(FAVORITES_FILE, mode);
  await store.set("ids", [...ids]);
}

export async function writeRecent(entries: readonly RecentEntry[]): Promise<void> {
  const mode: PersistenceMode = isTauri() ? "desktop" : "session";
  const store = await openStore(RECENT_FILE, mode);
  await store.set("entries", [...entries]);
}
