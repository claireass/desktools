export const themes = ["light", "dark", "system"] as const;
export const locales = ["tr", "en"] as const;

export type Theme = (typeof themes)[number];
export type Locale = (typeof locales)[number];

export type Settings = {
  theme: Theme;
  locale: Locale;
  sidebarCollapsed: boolean;
  hasCompletedOnboarding: boolean;
  launchAtStartup: boolean;
  closeToTray: boolean;
  checkForUpdates: boolean;
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
