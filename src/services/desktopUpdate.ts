import type { Update } from "@tauri-apps/plugin-updater";
import { appConfig } from "@/constants/appConfig";
import { lookupLatestRelease, type ReleaseLookup } from "@/services/githubRelease";
import { isTauri } from "@/services/platform";

let pendingUpdate: Update | null = null;

export async function checkForAppUpdate(): Promise<ReleaseLookup> {
  if (!isTauri()) {
    return lookupLatestRelease(
      appConfig.version,
      appConfig.repositoryOwner,
      appConfig.repositoryName,
    );
  }

  try {
    await dismissPendingUpdate();
    const { check } = await import("@tauri-apps/plugin-updater");
    const update = await check();
    if (!update) {
      return { status: "upToDate" };
    }
    pendingUpdate = update;
    return { status: "available", version: update.version };
  } catch (error: unknown) {
    return failedLookup(error);
  }
}

export async function installPendingUpdate(): Promise<ReleaseLookup> {
  const update = pendingUpdate;
  if (!update) {
    return { status: "failed", detail: "no pending update" };
  }

  try {
    const { relaunch } = await import("@tauri-apps/plugin-process");
    await update.downloadAndInstall();
    pendingUpdate = null;
    await relaunch();
    return { status: "installed", version: update.version };
  } catch (error: unknown) {
    return failedLookup(error);
  }
}

export async function dismissPendingUpdate(): Promise<void> {
  const update = pendingUpdate;
  pendingUpdate = null;
  if (update) {
    await update.close();
  }
}

function failedLookup(error: unknown): ReleaseLookup {
  return {
    status: "failed",
    detail: error instanceof Error ? error.message : "update failed",
  };
}
