const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decodeBase64(value: string): string | null {
  const compact = value.replace(/\s/g, "");
  if (compact.length % 4 !== 0 || !BASE64_PATTERN.test(compact)) {
    return null;
  }

  try {
    const binary = atob(compact);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}
