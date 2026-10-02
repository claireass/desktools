export type UrlParam = {
  key: string;
  value: string;
};

export type UrlParts = {
  scheme: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: UrlParam[];
};

export function parseUrl(
  input: string,
): { ok: true; parts: UrlParts } | { ok: false; reason: "empty" | "invalid" } {
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, reason: "empty" };
  }

  try {
    const url = new URL(trimmed);
    const params: UrlParam[] = [];
    url.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    return {
      ok: true,
      parts: {
        scheme: url.protocol.replace(/:$/, ""),
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        params,
      },
    };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
