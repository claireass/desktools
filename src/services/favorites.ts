export function toggleFavorite(ids: readonly string[], toolId: string): string[] {
  if (ids.includes(toolId)) {
    return ids.filter((id) => id !== toolId);
  }
  return [...ids, toolId];
}

export function orderByIds<T extends { id: string }>(
  ids: readonly string[],
  tools: readonly T[],
): T[] {
  const byId = new Map(tools.map((tool) => [tool.id, tool]));
  return ids.flatMap((id) => {
    const tool = byId.get(id);
    return tool ? [tool] : [];
  });
}
