import type { FileFacts, FileFactsInput } from "@/features/file-info/types";
import { splitFileName } from "@/utils/fileName";
import { formatBytes } from "@/utils/formatBytes";

export function describeFile(input: FileFactsInput): FileFacts {
  return {
    name: input.name,
    extension: splitFileName(input.name).extension,
    type: input.type,
    size: input.size,
    sizeLabel: formatBytes(input.size),
    lastModified: input.lastModified,
  };
}
