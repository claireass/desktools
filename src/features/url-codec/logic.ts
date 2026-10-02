export function encodeUrlText(value: string): string {
  return encodeURIComponent(value);
}

export function decodeUrlText(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
