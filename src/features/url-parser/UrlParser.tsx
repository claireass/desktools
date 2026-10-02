import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import { parseUrl } from "@/features/url-parser/logic";
import { useI18n } from "@/hooks/useI18n";

const fields = [
  ["tool.urlParser.scheme", "scheme"],
  ["tool.urlParser.username", "username"],
  ["tool.urlParser.password", "password"],
  ["tool.urlParser.hostname", "hostname"],
  ["tool.urlParser.port", "port"],
  ["tool.urlParser.path", "pathname"],
  ["tool.urlParser.search", "search"],
  ["tool.urlParser.hash", "hash"],
  ["tool.urlParser.origin", "origin"],
] as const;

export function UrlParser() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const result = useMemo(() => parseUrl(input), [input]);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.internet.offline")}</p>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.urlParser.input")}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} font-mono`}
          spellCheck={false}
          placeholder="https://example.com/path?q=1"
        />
      </label>
      {result.ok ? (
        <>
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map(([label, key]) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-surface px-3 py-3"
              >
                <dt className="text-xs text-muted">{t(label)}</dt>
                <dd className="mt-1 break-all font-mono text-sm">
                  {result.parts[key] === "" ? "—" : result.parts[key]}
                </dd>
              </div>
            ))}
          </dl>
          {result.parts.params.length > 0 ? (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {result.parts.params.map((param, index) => (
                <li
                  key={`${index}-${param.key}`}
                  className="grid gap-1 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{param.key}</span>
                  <span className="break-all font-mono text-muted">{param.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p
          className={`text-sm ${result.reason === "invalid" ? "text-danger" : "text-muted"}`}
          role={result.reason === "invalid" ? "alert" : undefined}
        >
          {t(
            result.reason === "empty" ? "tool.urlParser.empty" : "tool.urlParser.invalid",
          )}
        </p>
      )}
    </div>
  );
}
