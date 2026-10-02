import { describe, expect, it } from "vitest";
import { orderByIds, toggleFavorite } from "@/services/favorites";

describe("toggleFavorite", () => {
  it("adds and removes a tool id without duplicating it", () => {
    const added = toggleFavorite([], "json-formatter");
    expect(added).toEqual(["json-formatter"]);
    expect(toggleFavorite(added, "hash")).toEqual(["json-formatter", "hash"]);
    expect(toggleFavorite(added, "json-formatter")).toEqual([]);
  });
});

describe("orderByIds", () => {
  it("keeps favorite order and skips unknown ids", () => {
    const tools = [
      { id: "b", name: "B" },
      { id: "a", name: "A" },
    ];
    expect(orderByIds(["missing", "a", "b"], tools).map((tool) => tool.id)).toEqual([
      "a",
      "b",
    ]);
  });
});
