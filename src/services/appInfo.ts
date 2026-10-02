import { invoke } from "@tauri-apps/api/core";
import { isTauri } from "@/services/platform";

export type AppInfo = {
  name: string;
  version: string;
  os: string;
  arch: string;
};

export async function fetchAppInfo(): Promise<AppInfo> {
  if (!isTauri()) {
    throw new Error("Native app info is available in the desktop app.");
  }

  return invoke<AppInfo>("get_app_info");
}
