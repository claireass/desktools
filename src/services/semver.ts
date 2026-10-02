export type SemVer = {
  major: number;
  minor: number;
  patch: number;
};

const SEMVER_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)$/;

export function parseSemver(value: string): SemVer | null {
  const match = SEMVER_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (![major, minor, patch].every(Number.isInteger)) {
    return null;
  }

  return { major, minor, patch };
}

export function compareSemver(left: string, right: string): -1 | 0 | 1 | null {
  const a = parseSemver(left);
  const b = parseSemver(right);
  if (!a || !b) {
    return null;
  }

  if (a.major !== b.major) {
    return a.major > b.major ? 1 : -1;
  }
  if (a.minor !== b.minor) {
    return a.minor > b.minor ? 1 : -1;
  }
  if (a.patch !== b.patch) {
    return a.patch > b.patch ? 1 : -1;
  }
  return 0;
}
