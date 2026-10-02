import type { JsonFormatResult } from "@/features/json-formatter/types";

export function formatJson(input: string): JsonFormatResult {
  if (input.trim() === "") {
    return { ok: false, reason: "empty" };
  }

  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (error) {
    return {
      ok: false,
      reason: "invalid",
      detail: error instanceof Error ? error.message : undefined,
    };
  }
}
