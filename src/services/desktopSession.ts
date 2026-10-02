import { logError } from "@/services/logger";
import { isTauri } from "@/services/platform";
import { useSettingsStore } from "@/stores/settingsStore";

let trayReady = false;
let quitting = false;
let unlistenClose: (() => void) | null = null;

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
    const { TrayIcon } = await import("@tauri-apps/api/tray");
    if (!enabled) {
      await stopCloseListener();
      if (trayReady) {
        await TrayIcon.removeById("desktools");
        trayReady = false;
      }
      return;
    }
    const menu = await trayMenu(labels);
    const existing = await TrayIcon.getById("desktools");
    if (existing) {
      await existing.setMenu(menu);
      await existing.setShowMenuOnLeftClick(false);
      trayReady = true;
      await ensureCloseListener();
      return;
    }
    const icon = await windowIcon();
    const tray = await TrayIcon.new({
      id: "desktools",
      tooltip: "DeskTools",
      icon,
      menu,
      showMenuOnLeftClick: false,
      action: (event) => {
        const leftClick =
          event.type === "Click" && event.button === "Left" && event.buttonState === "Up";
        if (leftClick || event.type === "DoubleClick") {
          void revealWindow();
        }
      },
    });
    await tray.setShowMenuOnLeftClick(false);
    trayReady = true;
    await ensureCloseListener();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "tray failed";
    await logError(`Tray icon failed: ${detail}`);
  }
}

async function trayMenu(labels: { show: string; quit: string }) {
  const { Menu } = await import("@tauri-apps/api/menu");
  return Menu.new({
    items: [
      { id: "show", text: labels.show, action: () => void revealWindow() },
      { id: "quit", text: labels.quit, action: () => void quitFromTray() },
    ],
  });
}

async function revealWindow(): Promise<void> {
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const window = getCurrentWindow();
  await window.unminimize();
  await window.show();
  await window.setFocus();
}

async function quitFromTray(): Promise<void> {
  quitting = true;
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().destroy();
}

async function windowIcon() {
  try {
    const { defaultWindowIcon } = await import("@tauri-apps/api/app");
    return (await defaultWindowIcon()) ?? undefined;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "icon failed";
    await logError(`Tray icon image failed: ${detail}`);
    return undefined;
  }
}

async function stopCloseListener(): Promise<void> {
  unlistenClose?.();
  unlistenClose = null;
}

async function ensureCloseListener(): Promise<void> {
  if (unlistenClose) {
    return;
  }
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const window = getCurrentWindow();
  unlistenClose = await window.onCloseRequested(async (event) => {
    if (quitting || !useSettingsStore.getState().closeToTray || !trayReady) {
      return;
    }
    event.preventDefault();
    try {
      await window.hide();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "hide failed";
      await logError(`Hide to tray failed: ${detail}`);
      quitting = true;
      await window.destroy();
    }
  });
}
