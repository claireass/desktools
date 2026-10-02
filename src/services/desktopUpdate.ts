import { appConfig } from "@/constants/appConfig";
import { lookupLatestRelease, type ReleaseLookup } from "@/services/githubRelease";
import { isTauri } from "@/services/platform";

export async function checkForAppUpdate(): Promise<ReleaseLookup> {
  if (!isTauri()) {
    return lookupLatestRelease(
      appConfig.version,
      appConfig.repositoryOwner,
      appConfig.repositoryName,
    );
  }

  try {
    const { check } = await import("@tauri-apps/plugin-updater");
    const { relaunch } = await import("@tauri-apps/plugin-process");
    const update = await check();
    if (!update) {
      return { status: "upToDate" };
    }
    await update.downloadAndInstall();
    await relaunch();
    return { status: "installed", version: update.version };
  } catch (error: unknown) {
    return {
      status: "failed",
      detail: error instanceof Error ? error.message : "update failed",
    };
  }
}
