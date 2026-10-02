import {
  Calculator,
  Code,
  FileText,
  Folder,
  Globe,
  Image,
  Monitor,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { ToolCategory } from "@/types/tool";

export const categoryIcons: Record<ToolCategory, LucideIcon> = {
  file: Folder,
  image: Image,
  pdf: FileText,
  developer: Code,
  internet: Globe,
  system: Monitor,
  text: Type,
  calculator: Calculator,
};
