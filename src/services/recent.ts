export const MAX_RECENT_TOOLS = 30;

export type RecentEntry = {
  id: string;
  usedAt: number;
};

export function recordRecent(
  entries: readonly RecentEntry[],
  toolId: string,
  usedAt: number,
): RecentEntry[] {
  return [
    { id: toolId, usedAt },
    ...entries.filter((entry) => entry.id !== toolId),
  ].slice(0, MAX_RECENT_TOOLS);
}

export function isRecentEntry(value: unknown): value is RecentEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const entry = value as { id?: unknown; usedAt?: unknown };
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.usedAt === "number"
  );
}
