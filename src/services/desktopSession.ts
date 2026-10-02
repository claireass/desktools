import { logError } from "@/services/logger";
import { isTauri } from "@/services/platform";

export async function applyLaunchAtStartup(enabled: boolean): Promise<void> {
  if (!isTauri()) {
    return;
  }
  try {
    const { disable, enable, isEnabled } = await import("@tauri-apps/plugin-autostart");
    const current = await isEnabled();
    if (enabled && !current) {
      await enable();
    }
    if (!enabled && current) {
      await disable();
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "autostart failed";
    await logError(`Startup entry failed: ${detail}`);
  }
}

export async function applyCloseToTray(
  enabled: boolean,
  labels: { show: string; quit: string },
): Promise<void> {
  if (!isTauri()) {
    return;
  }
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("set_close_to_tray", {
      enabled,
      showLabel: labels.show,
      quitLabel: labels.quit,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "tray failed";
    await logError(`Tray icon failed: ${detail}`);
  }
}
