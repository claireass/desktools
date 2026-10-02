export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function detectLocale(): "tr" | "en" {
  if (typeof navigator === "undefined") {
    return "en";
  }
  return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
}
