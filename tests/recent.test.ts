import { describe, expect, it } from "vitest";
import { MAX_RECENT_TOOLS, recordRecent } from "@/services/recent";

describe("recordRecent", () => {
  it("moves a repeated tool to the front", () => {
    const first = recordRecent([], "pdf-merge", 1);
    const second = recordRecent(first, "json-formatter", 2);
    const third = recordRecent(second, "pdf-merge", 3);
    expect(third.map((entry) => entry.id)).toEqual(["pdf-merge", "json-formatter"]);
    expect(third[0]?.usedAt).toBe(3);
  });

  it("keeps at most 30 entries", () => {
    let entries = recordRecent([], "tool-0", 0);
    for (let index = 1; index <= MAX_RECENT_TOOLS; index += 1) {
      entries = recordRecent(entries, `tool-${index}`, index);
    }
    expect(entries).toHaveLength(MAX_RECENT_TOOLS);
    expect(entries[0]?.id).toBe(`tool-${MAX_RECENT_TOOLS}`);
    expect(entries.some((entry) => entry.id === "tool-0")).toBe(false);
  });
});
