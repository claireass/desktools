const ambiguous = new Set(["0", "O", "1", "l", "I"]);
const minLength = 8;
const maxLength = 128;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
};

export function generatePassword(
  options: PasswordOptions,
  randomBytes: (size: number) => Uint8Array<ArrayBufferLike> = cryptoBytes,
): string | null {
  const groups = characterGroups(options);
  if (
    !Number.isInteger(options.length) ||
    options.length < minLength ||
    options.length > maxLength ||
    groups.length === 0 ||
    groups.length > options.length
  ) {
    return null;
  }
  const alphabet = groups.join("");
  const next = byteSource(randomBytes);
  const chars: string[] = [];
  for (const group of groups) {
    const picked = pick(group, next);
    if (picked === null) {
      return null;
    }
    chars.push(picked);
  }
  while (chars.length < options.length) {
    const picked = pick(alphabet, next);
    if (picked === null) {
      return null;
    }
    chars.push(picked);
  }
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, next);
    if (swapIndex === null) {
      return null;
    }
    const current = chars[index];
    const other = chars[swapIndex];
    if (current === undefined || other === undefined) {
      return null;
    }
    chars[index] = other;
    chars[swapIndex] = current;
  }
  return chars.join("");
}

export function passwordAlphabetSize(options: PasswordOptions): number {
  return characterGroups(options).join("").length;
}

export function passwordEntropyBits(length: number, alphabetSize: number): number | null {
  if (
    !Number.isInteger(length) ||
    length < minLength ||
    length > maxLength ||
    !Number.isInteger(alphabetSize) ||
    alphabetSize < 2
  ) {
    return null;
  }
  return Math.floor(length * Math.log2(alphabetSize));
}

function characterGroups(options: PasswordOptions): string[] {
  const groups: string[] = [];
  if (options.lower) {
    groups.push(filterAmbiguous("abcdefghijklmnopqrstuvwxyz", options.avoidAmbiguous));
  }
  if (options.upper) {
    groups.push(filterAmbiguous("ABCDEFGHIJKLMNOPQRSTUVWXYZ", options.avoidAmbiguous));
  }
  if (options.digits) {
    groups.push(filterAmbiguous("0123456789", options.avoidAmbiguous));
  }
  if (options.symbols) {
    groups.push(filterAmbiguous("!@#$%^&*_-+=?", options.avoidAmbiguous));
  }
  return groups.filter((group) => group.length > 0);
}

function filterAmbiguous(chars: string, avoid: boolean): string {
  if (!avoid) {
    return chars;
  }
  return [...chars].filter((char) => !ambiguous.has(char)).join("");
}

function cryptoBytes(size: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(size));
}

function byteSource(
  randomBytes: (size: number) => Uint8Array<ArrayBufferLike>,
): () => number | null {
  let bytes: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
  let index = 0;
  return () => {
    if (index >= bytes.length) {
      bytes = randomBytes(32);
      index = 0;
      if (bytes.length === 0) {
        return null;
      }
    }
    const value = bytes[index];
    index += 1;
    return value ?? null;
  };
}

function pick(chars: string, nextByte: () => number | null): string | null {
  const index = randomIndex(chars.length, nextByte);
  if (index === null) {
    return null;
  }
  return chars[index] ?? null;
}

function randomIndex(size: number, nextByte: () => number | null): number | null {
  if (size < 1 || size > 256) {
    return null;
  }
  const limit = Math.floor(256 / size) * size;
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const value = nextByte();
    if (value === null) {
      return null;
    }
    if (value < limit) {
      return value % size;
    }
  }
  return null;
}
