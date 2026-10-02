import { isTauri } from "@/services/platform";

type LogLevel = "info" | "warn" | "error";

async function write(level: LogLevel, message: string): Promise<void> {
  if (!isTauri()) {
    return;
  }

  try {
    const plugin = await import("@tauri-apps/plugin-log");
    await plugin[level](message);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown log failure";
    console.error(`DeskTools log write failed: ${detail}`);
  }
}

export function logInfo(message: string): Promise<void> {
  return write("info", message);
}

export function logWarn(message: string): Promise<void> {
  return write("warn", message);
}

export function logError(message: string): Promise<void> {
  return write("error", message);
}
