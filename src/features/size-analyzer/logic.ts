import type { SizeInput, SizeItem, SizeReport } from "@/features/size-analyzer/types";
import { formatBytes } from "@/utils/formatBytes";

export function analyzeSizes(files: readonly SizeInput[]): SizeReport {
  const ranked = files
    .map((file, index) => ({ file, index }))
    .sort((left, right) => right.file.size - left.file.size || left.index - right.index)
    .map(({ file }): SizeItem => ({
      name: file.name,
      size: file.size,
      sizeLabel: formatBytes(file.size),
    }));

  const total = files.reduce((sum, file) => sum + file.size, 0);

  return {
    count: files.length,
    total,
    totalLabel: formatBytes(total),
    largest: ranked[0] ?? null,
    items: ranked,
  };
}
