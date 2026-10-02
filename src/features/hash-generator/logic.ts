import { md5Hex } from "@/features/hash-generator/md5";
import type { HashAlgorithm } from "@/features/hash-generator/types";

const subtleNames = {
  sha1: "SHA-1",
  sha256: "SHA-256",
  sha512: "SHA-512",
} as const;

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "md5") {
    return md5Hex(input);
  }

  const digest = await crypto.subtle.digest(
    subtleNames[algorithm],
    new TextEncoder().encode(input),
  );
  return toHex(digest);
}
