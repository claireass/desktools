export type SubnetKind = "normal" | "pointToPoint" | "single";

export type SubnetReport = {
  address: string;
  prefix: number;
  netmask: string;
  network: string;
  broadcast: string | null;
  firstHost: string | null;
  lastHost: string | null;
  usable: number;
  kind: SubnetKind;
};

export function describeSubnet(
  input: string,
): { ok: true; report: SubnetReport } | { ok: false; reason: "empty" | "invalid" } {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }

  const parsed = parseCidr(trimmed);
  if (!parsed) {
    return { ok: false, reason: "invalid" };
  }

  const address = toInt(parsed.octets);
  const mask = parsed.prefix === 0 ? 0 : (0xffffffff << (32 - parsed.prefix)) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const dotted = fromInt(address);

  if (parsed.prefix === 32) {
    return {
      ok: true,
      report: {
        address: dotted,
        prefix: 32,
        netmask: fromInt(mask),
        network: dotted,
        broadcast: null,
        firstHost: dotted,
        lastHost: dotted,
        usable: 1,
        kind: "single",
      },
    };
  }

  if (parsed.prefix === 31) {
    return {
      ok: true,
      report: {
        address: dotted,
        prefix: 31,
        netmask: fromInt(mask),
        network: fromInt(network),
        broadcast: null,
        firstHost: fromInt(network),
        lastHost: fromInt(broadcast),
        usable: 2,
        kind: "pointToPoint",
      },
    };
  }

  return {
    ok: true,
    report: {
      address: dotted,
      prefix: parsed.prefix,
      netmask: fromInt(mask),
      network: fromInt(network),
      broadcast: fromInt(broadcast),
      firstHost: fromInt(network + 1),
      lastHost: fromInt(broadcast - 1),
      usable: 2 ** (32 - parsed.prefix) - 2,
      kind: "normal",
    },
  };
}

function parseCidr(
  input: string,
): { octets: [number, number, number, number]; prefix: number } | null {
  const match = /^(\d{1,3}(?:\.\d{1,3}){3})\s*\/\s*(\d{1,2})$/.exec(input);
  if (!match) {
    return null;
  }
  const address = match[1];
  const prefixText = match[2];
  if (!address || !prefixText || !/^(0|[1-9]\d?)$/.test(prefixText)) {
    return null;
  }
  const prefix = Number(prefixText);
  if (prefix > 32) {
    return null;
  }
  const octets = address.split(".").map(parseOctet);
  const first = octets[0];
  const second = octets[1];
  const third = octets[2];
  const fourth = octets[3];
  if (first == null || second == null || third == null || fourth == null) {
    return null;
  }
  return { octets: [first, second, third, fourth], prefix };
}

function parseOctet(value: string | undefined): number | null {
  if (value === undefined || !/^(0|[1-9]\d{0,2})$/.test(value)) {
    return null;
  }
  const octet = Number(value);
  return octet <= 255 ? octet : null;
}

function toInt(octets: readonly [number, number, number, number]): number {
  return (octets[0] * 16777216 + octets[1] * 65536 + octets[2] * 256 + octets[3]) >>> 0;
}

function fromInt(value: number): string {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}
