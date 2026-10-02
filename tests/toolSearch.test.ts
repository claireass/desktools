import { describe, expect, it } from "vitest";
import { tools } from "@/services/toolRegistry";
import { searchTools, type SearchableTool } from "@/services/toolSearch";

const catalog: SearchableTool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Pretty print JSON",
    category: "developer",
    categoryLabel: "Developer",
    tags: ["json", "format"],
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    description: "Check JSON syntax",
    category: "developer",
    categoryLabel: "Developer",
    tags: ["json", "validate"],
  },
  {
    id: "image-resize",
    name: "Image Resize",
    description: "Change image dimensions",
    category: "image",
    categoryLabel: "Images",
    tags: ["image", "resize"],
  },
];

describe("searchTools", () => {
  it("matches name, description, category, and tags", () => {
    expect(searchTools(catalog, "json").map((tool) => tool.id)).toEqual([
      "json-formatter",
      "json-validator",
    ]);
    expect(searchTools(catalog, "dimensions").map((tool) => tool.id)).toEqual([
      "image-resize",
    ]);
    expect(searchTools(catalog, "images").map((tool) => tool.id)).toEqual([
      "image-resize",
    ]);
    expect(searchTools(catalog, "resize").map((tool) => tool.id)).toEqual([
      "image-resize",
    ]);
  });

  it("returns every tool for an empty query", () => {
    expect(searchTools(catalog, "   ")).toHaveLength(catalog.length);
  });

  it("returns no matches when nothing fits", () => {
    expect(searchTools(catalog, "pdf")).toEqual([]);
  });
});

describe("tool registry", () => {
  it("registers the first offline tools", () => {
    expect(tools.map((tool) => tool.id).sort()).toEqual([
      "base64",
      "calculator",
      "case-converter",
      "clipboard",
      "date-calculator",
      "file-info",
      "file-renamer",
      "hash-generator",
      "http-status",
      "image-compressor",
      "image-converter",
      "image-resizer",
      "json-formatter",
      "line-tools",
      "pdf-extract",
      "pdf-merge",
      "pdf-split",
      "percentage",
      "size-analyzer",
      "subnet-calculator",
      "system-info",
      "text-counter",
      "timestamp",
      "unit-converter",
      "url-codec",
      "url-parser",
      "uuid-generator",
    ]);
  });
});
