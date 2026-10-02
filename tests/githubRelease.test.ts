import { describe, expect, it } from "vitest";
import { appConfig } from "@/constants/appConfig";
import {
  githubLatestReleaseUrl,
  githubRepositoryUrl,
  interpretLatestRelease,
  lookupLatestRelease,
} from "@/services/githubRelease";

describe("github repository address", () => {
  it("uses the configured owner and repository name", () => {
    expect(githubRepositoryUrl(appConfig.repositoryOwner, appConfig.repositoryName)).toBe(
      "https://github.com/claireass/desktools",
    );
    expect(githubLatestReleaseUrl(appConfig.repositoryOwner, appConfig.repositoryName)).toBe(
      "https://api.github.com/repos/claireass/desktools/releases/latest",
    );
  });

  it("rejects an owner that could change the address", () => {
    expect(githubRepositoryUrl("claireass/other", "desktools")).toBeNull();
    expect(githubLatestReleaseUrl(" claireass ", "desk tools")).toBeNull();
  });
});

describe("interpretLatestRelease", () => {
  it("treats a higher tag as a newer release", () => {
    expect(interpretLatestRelease("0.1.0", "v0.2.0")).toBe("available");
    expect(interpretLatestRelease("0.1.0", "0.1.0")).toBe("upToDate");
    expect(interpretLatestRelease("0.1.0", "v0.0.9")).toBe("upToDate");
  });

  it("rejects a tag that is not a version", () => {
    expect(interpretLatestRelease("0.1.0", "latest")).toBe("invalid");
  });
});

describe("lookupLatestRelease", () => {
  it("reports a missing release without treating it as success", async () => {
    const fetchImpl = async () => new Response("missing", { status: 404 });
    await expect(lookupLatestRelease("0.1.0", "claireass", "desktools", fetchImpl)).resolves.toEqual({
      status: "missing",
    });
  });

  it("reports a newer tag and does not include a download", async () => {
    const fetchImpl = async () =>
      Response.json({
        tag_name: "v0.2.0",
        assets: [{ browser_download_url: "https://example.invalid/setup.exe" }],
      });
    await expect(lookupLatestRelease("0.1.0", "claireass", "desktools", fetchImpl)).resolves.toEqual({
      status: "available",
      version: "0.2.0",
    });
  });

  it("reports a failed connection", async () => {
    const fetchImpl = async () => {
      throw new Error("offline");
    };
    await expect(lookupLatestRelease("0.1.0", "claireass", "desktools", fetchImpl)).resolves.toEqual({
      status: "failed",
      detail: "offline",
    });
  });
});
