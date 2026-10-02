const allowedFlags = new Set(["g", "i", "m", "s", "u"]);
const matchLimit = 50;
const maxPatternLength = 200;
const maxSampleLength = 10_000;

export type RegexMatch = {
  index: number;
  text: string;
  groups: string[];
};

export type RegexTest =
  { ok: true; matches: RegexMatch[]; truncated: boolean } | { ok: false };

export function testRegex(pattern: string, flags: string, sample: string): RegexTest {
  if (
    pattern.length === 0 ||
    pattern.length > maxPatternLength ||
    sample.length > maxSampleLength ||
    !isFlagList(flags)
  ) {
    return { ok: false };
  }
  const global = flags.includes("g");
  let expression: RegExp;
  try {
    expression = new RegExp(pattern, global ? flags : `${flags}g`);
  } catch {
    return { ok: false };
  }
  const found: RegexMatch[] = [];
  while (found.length <= matchLimit) {
    const match = expression.exec(sample);
    if (!match) {
      break;
    }
    if (found.length === matchLimit) {
      return { ok: true, matches: found, truncated: true };
    }
    found.push({
      index: match.index,
      text: match[0],
      groups: match.slice(1).map((group) => group ?? ""),
    });
    if (!global) {
      break;
    }
    if (match[0].length === 0) {
      expression.lastIndex += 1;
    }
  }
  return { ok: true, matches: found, truncated: false };
}

function isFlagList(flags: string): boolean {
  const seen = new Set<string>();
  for (const flag of flags) {
    if (!allowedFlags.has(flag) || seen.has(flag)) {
      return false;
    }
    seen.add(flag);
  }
  return true;
}
