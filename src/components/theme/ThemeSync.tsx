import { useEffect } from "react";
import { logWarn } from "@/services/logger";
import { isTauri } from "@/services/platform";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Theme } from "@/types/settings";

function prefersDark(theme: Theme): boolean {
  if (theme === "dark") {
    return true;
  }
  if (theme === "light") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeSync() {
  const theme = useSettingsStore((state) => state.theme);
  const locale = useSettingsStore((state) => state.locale);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const dark = prefersDark(theme);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";

      if (!isTauri()) {
        return;
      }

      void import("@tauri-apps/api/window")
        .then(({ getCurrentWindow }) =>
          getCurrentWindow().setTheme(theme === "system" ? null : theme),
        )
        .catch((error: unknown) => {
          const detail = error instanceof Error ? error.message : "setTheme failed";
          void logWarn(`Window theme was not applied: ${detail}`);
        });
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
