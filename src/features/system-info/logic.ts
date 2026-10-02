export type SessionInput = {
  language: string;
  languages: readonly string[];
  platform: string;
  userAgent: string;
  cores: number | null;
  memoryGb: number | null;
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  online: boolean;
};

export function normalizeSession(input: SessionInput): SessionInput {
  return {
    language: input.language.trim(),
    languages: input.languages
      .map((language) => language.trim())
      .filter((language) => language !== ""),
    platform: input.platform.trim(),
    userAgent: input.userAgent.trim(),
    cores: Number.isInteger(input.cores) && (input.cores ?? 0) > 0 ? input.cores : null,
    memoryGb:
      typeof input.memoryGb === "number" &&
      Number.isFinite(input.memoryGb) &&
      input.memoryGb > 0
        ? input.memoryGb
        : null,
    screenWidth: positive(input.screenWidth),
    screenHeight: positive(input.screenHeight),
    timezone: input.timezone.trim(),
    online: input.online,
  };
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
}
