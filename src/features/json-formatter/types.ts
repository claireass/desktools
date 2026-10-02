export type JsonFormatFailure = "empty" | "invalid";

export type JsonFormatResult =
  | { ok: true; output: string }
  | { ok: false; reason: JsonFormatFailure; detail?: string };
