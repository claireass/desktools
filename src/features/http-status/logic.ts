const phrases: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  206: "Partial Content",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  413: "Content Too Large",
  415: "Unsupported Media Type",
  418: "I'm a teapot",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

export type StatusClass = "info" | "success" | "redirect" | "client" | "server";

export function describeStatus(
  input: string,
):
  | { ok: false; reason: "empty" | "invalid" }
  | { ok: true; code: number; phrase: string | null; klass: StatusClass } {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }
  if (!/^\d{3}$/.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  const code = Number(trimmed);
  if (code < 100 || code > 599) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, code, phrase: phrases[code] ?? null, klass: statusClass(code) };
}

function statusClass(code: number): StatusClass {
  if (code < 200) {
    return "info";
  }
  if (code < 300) {
    return "success";
  }
  if (code < 400) {
    return "redirect";
  }
  if (code < 500) {
    return "client";
  }
  return "server";
}
