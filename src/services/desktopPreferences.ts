export type UpdatePreference = "off" | "noRepository" | "inactive";

export function describeUpdatePreference(
  checkForUpdates: boolean,
  repositoryOwner: string,
): UpdatePreference {
  if (!checkForUpdates) {
    return "off";
  }
  if (repositoryOwner.trim() === "") {
    return "noRepository";
  }
  return "inactive";
}
