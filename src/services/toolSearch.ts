export type SearchableTool = {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  tags: string[];
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function scoreTool(tool: SearchableTool, query: string): number {
  const name = normalize(tool.name);
  const description = normalize(tool.description);
  const category = normalize(tool.category);
  const categoryLabel = normalize(tool.categoryLabel);
  const tags = tool.tags.map(normalize);

  if (name === query) {
    return 100;
  }
  if (name.startsWith(query)) {
    return 80;
  }
  if (name.includes(query)) {
    return 60;
  }
  if (tags.some((tag) => tag === query || tag.startsWith(query))) {
    return 50;
  }
  if (tags.some((tag) => tag.includes(query))) {
    return 40;
  }
  if (categoryLabel.includes(query) || category.includes(query)) {
    return 30;
  }
  if (description.includes(query)) {
    return 20;
  }
  return 0;
}

export function searchTools(
  tools: readonly SearchableTool[],
  query: string,
): SearchableTool[] {
  const normalized = normalize(query);
  if (!normalized) {
    return [...tools];
  }

  return tools
    .map((tool) => ({ tool, score: scoreTool(tool, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.tool.name.localeCompare(right.tool.name),
    )
    .map((entry) => entry.tool);
}
