import type { RenameOptions, RenameRow } from "@/features/file-renamer/types";
import { splitFileName } from "@/utils/fileName";

const reservedStem = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const maxNameLength = 255;

export function previewRename(names: readonly string[], options: RenameOptions): RenameRow[] {
  const start = normalizeStart(options.start);
  const pad = normalizePad(options.pad);
  const template = options.template;
  const rows: RenameRow[] = names.map((original, index) => {
    const next = buildName(original, template, start + index, pad);
    return { original, next, problem: problemFor(next) };
  });

  const groups = new Map<string, number[]>();
  rows.forEach((row, index) => {
    if (row.problem) {
      return;
    }
    const key = row.next.toLowerCase();
    const indexes = groups.get(key) ?? [];
    indexes.push(index);
    groups.set(key, indexes);
  });

  for (const indexes of groups.values()) {
    if (indexes.length < 2) {
      continue;
    }
    for (const index of indexes) {
      const row = rows[index];
      if (row) {
        row.problem = "duplicate";
      }
    }
  }

  return rows;
}

function buildName(original: string, template: string, number: number, pad: number): string {
  const { base, extension } = splitFileName(original);
  const sequence = String(number).padStart(pad, "0");
  const applied = template.replace(/\{(name|ext|n)\}/g, (_match, token: string) => {
    if (token === "name") {
      return base;
    }
    if (token === "ext") {
      return extension;
    }
    return sequence;
  });

  return applied.trim().replace(/[. ]+$/g, "");
}

function problemFor(name: string): RenameRow["problem"] {
  if (name === "" || name === "." || name === "..") {
    return "empty";
  }
  if (hasInvalidCharacter(name)) {
    return "invalid";
  }
  const stem = name.split(".")[0] ?? name;
  if (reservedStem.test(stem)) {
    return "reserved";
  }
  if (name.length > maxNameLength) {
    return "tooLong";
  }
  return null;
}

function hasInvalidCharacter(name: string): boolean {
  for (const char of name) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || "<>:\"/\\|?*".includes(char)) {
      return true;
    }
  }
  return false;
}

function normalizeStart(start: number): number {
  if (!Number.isInteger(start) || start < 0 || start > 1_000_000) {
    return 1;
  }
  return start;
}

function normalizePad(pad: number): number {
  if (!Number.isInteger(pad) || pad < 1 || pad > 6) {
    return 1;
  }
  return pad;
}
