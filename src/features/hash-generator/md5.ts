const SHIFT = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20,
  5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
] as const;

const SINE = [
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
  0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193,
  0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d,
  0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
  0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
  0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244,
  0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
  0xeb86d391,
] as const;

function add32(left: number, right: number): number {
  const low = (left & 0xffff) + (right & 0xffff);
  const high = (left >>> 16) + (right >>> 16) + (low >>> 16);
  return ((high << 16) | (low & 0xffff)) >>> 0;
}

function rotateLeft(value: number, shift: number): number {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

function mix(
  index: number,
  b: number,
  c: number,
  d: number,
): { value: number; source: number } {
  if (index < 16) {
    return { value: (b & c) | (~b & d), source: index };
  }
  if (index < 32) {
    return { value: (b & d) | (c & ~d), source: (5 * index + 1) % 16 };
  }
  if (index < 48) {
    return { value: b ^ c ^ d, source: (3 * index + 5) % 16 };
  }
  return { value: c ^ (b | ~d), source: (7 * index) % 16 };
}

export function md5Hex(input: string): string {
  const data = new TextEncoder().encode(input);
  const bitLength = data.length * 8;
  const paddingLength = (56 - ((data.length + 1) % 64) + 64) % 64;
  const total = data.length + 1 + paddingLength + 8;
  const buffer = new Uint8Array(total);
  buffer.set(data);
  buffer[data.length] = 0x80;
  const view = new DataView(buffer.buffer);
  view.setUint32(total - 8, bitLength >>> 0, true);
  view.setUint32(total - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < buffer.length; offset += 64) {
    const words: number[] = [];
    for (let index = 0; index < 16; index += 1) {
      words.push(view.getUint32(offset + index * 4, true));
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      const step = mix(index, b, c, d);
      const sum = add32(
        add32(add32(a, step.value), SINE[index] ?? 0),
        words[step.source] ?? 0,
      );
      const next = add32(b, rotateLeft(sum, SHIFT[index] ?? 0));
      a = d;
      d = c;
      c = b;
      b = next;
    }

    a0 = add32(a0, a);
    b0 = add32(b0, b);
    c0 = add32(c0, c);
    d0 = add32(d0, d);
  }

  const output = new DataView(new ArrayBuffer(16));
  output.setUint32(0, a0, true);
  output.setUint32(4, b0, true);
  output.setUint32(8, c0, true);
  output.setUint32(12, d0, true);
  return [...new Uint8Array(output.buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
