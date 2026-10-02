import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { formatJson } from "@/features/json-formatter/logic";
import type { JsonFormatResult } from "@/features/json-formatter/types";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

export function JsonFormatter() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonFormatResult | null>(null);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const output = result?.ok ? result.output : "";

  return (
    <form
      className="grid max-w-3xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setCopied(false);
        setCopyDetail(null);
        setResult(formatJson(input));
      }}
    >
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.jsonFormatter.input")}
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} min-h-40 font-mono`}
          spellCheck={false}
        />
      </label>
      <div className="flex gap-2">
        <Button type="submit">{t("tool.jsonFormatter.format")}</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setCopied(false);
            setCopyDetail(null);
            setResult(formatJson(input, 0));
          }}
        >
          {t("tool.jsonFormatter.minify")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setInput("");
            setResult(null);
            setCopied(false);
            setCopyDetail(null);
          }}
        >
          {t("tool.jsonFormatter.clear")}
        </Button>
      </div>
      {result && !result.ok ? (
        <div role="alert" className="text-sm">
          <p>
            {result.reason === "empty"
              ? t("tool.jsonFormatter.empty")
              : t("tool.jsonFormatter.invalid")}
          </p>
          {result.detail ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-muted">
                {t("error.details")}
              </summary>
              <p className="mt-2 break-words text-muted">{result.detail}</p>
            </details>
          ) : null}
        </div>
      ) : null}
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.jsonFormatter.output")}
        <textarea
          readOnly
          value={output}
          className={`${fieldClass} min-h-40 font-mono`}
          aria-live="polite"
        />
      </label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={output === ""}
          onClick={() => {
            void copyText(output)
              .then(() => {
                setCopied(true);
                setCopyDetail(null);
              })
              .catch((error: unknown) => {
                setCopied(false);
                setCopyDetail(error instanceof Error ? error.message : "copy failed");
              });
          }}
        >
          {t("common.copy")}
        </Button>
        {copied ? <p className="text-sm text-success">{t("common.copied")}</p> : null}
        {copyDetail ? (
          <p className="text-sm text-danger" role="alert">
            {t("common.copyFailed")} {copyDetail}
          </p>
        ) : null}
      </div>
    </form>
  );
}
