import type { MessageKey } from "@/i18n/messages";
import { toolCategories, type ToolCategory } from "@/types/tool";

export const categoryMessageKeys: Record<
  ToolCategory,
  { name: MessageKey; description: MessageKey }
> = {
  file: { name: "category.file", description: "category.file.description" },
  image: { name: "category.image", description: "category.image.description" },
  pdf: { name: "category.pdf", description: "category.pdf.description" },
  developer: {
    name: "category.developer",
    description: "category.developer.description",
  },
  internet: { name: "category.internet", description: "category.internet.description" },
  system: { name: "category.system", description: "category.system.description" },
  text: { name: "category.text", description: "category.text.description" },
  calculator: {
    name: "category.calculator",
    description: "category.calculator.description",
  },
};

export const categoryIds: readonly ToolCategory[] = toolCategories;
