import { logError, logInfo } from "@/services/logger";
import { readUserData } from "@/services/persistence";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useRecentStore } from "@/stores/recentStore";
import { useSettingsStore } from "@/stores/settingsStore";

let hydratePromise: Promise<void> | null = null;

async function hydrate(): Promise<void> {
  const status = useSettingsStore.getState().status.state;
  if (status === "loading" || status === "ready") {
    return;
  }

  useSettingsStore.setState({ status: { state: "loading" } });

  try {
    const data = await readUserData();
    useSettingsStore.getState().applyLoaded(data.settings, data.mode);
    useFavoritesStore.getState().applyLoaded(data.favorites);
    useRecentStore.getState().applyLoaded(data.recent);
    await logInfo(`DeskTools ready (${data.mode})`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "user data load failed";
    useSettingsStore.getState().applyError(detail);
    await logError(`User data load failed: ${detail}`);
  }
}

export function requestHydrate(force = false): Promise<void> {
  if (force) {
    hydratePromise = null;
    useSettingsStore.setState({ status: { state: "idle" } });
  }

  if (!hydratePromise) {
    hydratePromise = hydrate();
  }

  return hydratePromise;
}
