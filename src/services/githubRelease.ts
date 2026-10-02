import { compareSemver } from "@/services/semver";

const GITHUB_NAME = /^[A-Za-z0-9_.-]+$/;

export type ReleaseLookup =
  | { status: "upToDate" }
  | { status: "available"; version: string }
  | { status: "installed"; version: string }
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "failed"; detail: string };

export function githubRepositoryUrl(owner: string, name: string): string | null {
  const safeOwner = owner.trim();
  const safeName = name.trim();
  if (!GITHUB_NAME.test(safeOwner) || !GITHUB_NAME.test(safeName)) {
    return null;
  }
  return `https://github.com/${safeOwner}/${safeName}`;
}

export function githubLatestReleaseUrl(owner: string, name: string): string | null {
  const repositoryUrl = githubRepositoryUrl(owner, name);
  if (!repositoryUrl) {
    return null;
  }
  const safeOwner = owner.trim();
  const safeName = name.trim();
  return `https://api.github.com/repos/${safeOwner}/${safeName}/releases/latest`;
}

export function interpretLatestRelease(
  currentVersion: string,
  tagName: string,
): "upToDate" | "available" | "invalid" {
  const comparison = compareSemver(tagName, currentVersion);
  if (comparison === null) {
    return "invalid";
  }
  if (comparison > 0) {
    return "available";
  }
  return "upToDate";
}

export async function lookupLatestRelease(
  currentVersion: string,
  owner: string,
  name: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ReleaseLookup> {
  const url = githubLatestReleaseUrl(owner, name);
  if (!url) {
    return { status: "invalid" };
  }

  let response: Response;
  try {
    response = await fetchImpl(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error: unknown) {
    return {
      status: "failed",
      detail: error instanceof Error ? error.message : "network request failed",
    };
  }

  if (response.status === 404) {
    return { status: "missing" };
  }
  if (!response.ok) {
    return { status: "failed", detail: `HTTP ${response.status}` };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { status: "invalid" };
  }

  const tagName = readTagName(body);
  if (!tagName) {
    return { status: "invalid" };
  }

  const interpreted = interpretLatestRelease(currentVersion, tagName);
  if (interpreted === "available") {
    return { status: "available", version: tagName.replace(/^v/, "") };
  }
  return { status: interpreted };
}

function readTagName(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("tag_name" in body)) {
    return null;
  }
  const tagName = body.tag_name;
  return typeof tagName === "string" ? tagName : null;
}
