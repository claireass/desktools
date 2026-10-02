const reservedStem = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const maxLength = 180;

export function safeDownloadName(name: string, fallback = "download"): string {
  const leaf = name.split(/[/\\]/).pop() ?? "";
  let cleaned = "";
  for (const char of leaf) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || '<>:"/\\|?*'.includes(char)) {
      continue;
    }
    cleaned += char;
  }
  const trimmed = cleaned
    .trim()
    .replace(/[. ]+$/g, "")
    .slice(0, maxLength);
  if (trimmed === "" || trimmed === "." || trimmed === "..") {
    return fallback;
  }
  const stem = trimmed.split(".")[0] ?? trimmed;
  if (reservedStem.test(stem)) {
    return `_${trimmed}`.slice(0, maxLength);
  }
  return trimmed;
}
