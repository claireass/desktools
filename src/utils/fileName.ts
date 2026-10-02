export function splitFileName(name: string): { base: string; extension: string } {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) {
    return { base: name, extension: "" };
  }

  return { base: name.slice(0, dot), extension: name.slice(dot + 1) };
}
