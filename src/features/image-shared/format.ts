import { splitFileName } from "@/utils/fileName";

export const imageFormats = ["png", "jpeg", "webp"] as const;
export type ImageFormat = (typeof imageFormats)[number];

export const compressFormats = ["jpeg", "webp"] as const;
export type CompressFormat = (typeof compressFormats)[number];

export function mimeForFormat(format: ImageFormat): string {
  if (format === "png") {
    return "image/png";
  }
  if (format === "webp") {
    return "image/webp";
  }
  return "image/jpeg";
}

export function extensionForFormat(format: ImageFormat): string {
  return format === "jpeg" ? "jpg" : format;
}

export function outputName(name: string, format: ImageFormat): string {
  const base = splitFileName(name).base;
  return `${base === "" ? "image" : base}.${extensionForFormat(format)}`;
}

export function qualityFromPercent(percent: number): number {
  if (!Number.isInteger(percent) || percent < 10 || percent > 100) {
    return 0.8;
  }
  return percent / 100;
}
