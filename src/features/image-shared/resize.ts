export const maxImageEdge = 8192;

export function scaleSide(
  sourceWidth: number,
  sourceHeight: number,
  changed: "width" | "height",
  value: number,
): { width: number; height: number } | null {
  if (
    !Number.isInteger(sourceWidth) ||
    !Number.isInteger(sourceHeight) ||
    sourceWidth < 1 ||
    sourceHeight < 1 ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    return null;
  }

  if (changed === "width") {
    return {
      width: value,
      height: Math.max(1, Math.round((sourceHeight * value) / sourceWidth)),
    };
  }

  return {
    width: Math.max(1, Math.round((sourceWidth * value) / sourceHeight)),
    height: value,
  };
}

export function planResize(input: {
  width: number;
  height: number;
}):
  | { ok: true; width: number; height: number }
  | { ok: false; reason: "invalid" | "tooLarge" } {
  if (
    !Number.isInteger(input.width) ||
    !Number.isInteger(input.height) ||
    input.width < 1 ||
    input.height < 1
  ) {
    return { ok: false, reason: "invalid" };
  }
  if (input.width > maxImageEdge || input.height > maxImageEdge) {
    return { ok: false, reason: "tooLarge" };
  }
  return { ok: true, width: input.width, height: input.height };
}
