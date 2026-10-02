export function parseDecimal(input: string): number | null {
  const trimmed = input.trim().replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }
  const text = value
    .toFixed(10)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
  return text === "-0" ? "0" : text;
}
