const units = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    return "0 B";
  }

  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const unit = units[unitIndex] ?? "B";
  if (unitIndex === 0) {
    return `${Math.round(value)} ${unit}`;
  }

  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  const text = value.toFixed(digits).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  return `${text} ${unit}`;
}
