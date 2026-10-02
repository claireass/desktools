export const toolCategories = [
  "file",
  "image",
  "pdf",
  "developer",
  "internet",
  "system",
  "text",
  "calculator",
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export function isToolCategory(value: string): value is ToolCategory {
  return (toolCategories as readonly string[]).includes(value);
}
