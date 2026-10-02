const maxTokenLength = 8192;

export type JwtView = {
  header: string;
  payload: string;
  signature: string;
  unsafeAlgorithm: boolean;
  claims: {
    exp: string | null;
    nbf: string | null;
    iat: string | null;
  };
};

export function decodeJwt(token: string): JwtView | null {
  const trimmed = token.trim();
  if (trimmed.length === 0 || trimmed.length > maxTokenLength) {
    return null;
  }
  const parts = trimmed.split(".");
  if (parts.length !== 3 || parts.some((part) => part === undefined)) {
    return null;
  }
  const [headerPart, payloadPart, signature] = parts;
  if (headerPart === undefined || payloadPart === undefined || signature === undefined) {
    return null;
  }
  const header = decodeJsonObject(headerPart);
  const payload = decodeJsonObject(payloadPart);
  if (!header || !payload) {
    return null;
  }
  return {
    header: JSON.stringify(header, null, 2),
    payload: JSON.stringify(payload, null, 2),
    signature,
    unsafeAlgorithm: isUnsafeAlgorithm(header["alg"]) || signature.length === 0,
    claims: {
      exp: claimTime(payload["exp"]),
      nbf: claimTime(payload["nbf"]),
      iat: claimTime(payload["iat"]),
    },
  };
}

function decodeJsonObject(segment: string): Record<string, unknown> | null {
  const text = decodeBase64Url(segment);
  if (text === null) {
    return null;
  }
  try {
    const value: unknown = JSON.parse(text);
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }
    return Object.fromEntries(Object.entries(value));
  } catch {
    return null;
  }
}

function decodeBase64Url(segment: string): string | null {
  if (segment.length === 0 || !/^[A-Za-z0-9_-]+$/.test(segment)) {
    return null;
  }
  const padded = segment.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  try {
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function isUnsafeAlgorithm(value: unknown): boolean {
  return typeof value !== "string" || value.trim().toLowerCase() === "none";
}

function claimTime(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}
