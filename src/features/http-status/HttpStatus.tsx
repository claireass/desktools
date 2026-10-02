import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import { describeStatus } from "@/features/http-status/logic";
import { useI18n } from "@/hooks/useI18n";

export function HttpStatus() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const result = useMemo(() => describeStatus(input), [input]);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.internet.offline")}</p>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.httpStatus.input")}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} font-mono`}
          inputMode="numeric"
          spellCheck={false}
          placeholder="404"
        />
      </label>
      {result.ok ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-3">
            <dt className="text-xs text-muted">{t("tool.httpStatus.code")}</dt>
            <dd className="mt-1 font-mono text-sm">{result.code}</dd>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-3">
            <dt className="text-xs text-muted">{t("tool.httpStatus.class")}</dt>
            <dd className="mt-1 text-sm">{t(`tool.httpStatus.class.${result.klass}`)}</dd>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-3 sm:col-span-2">
            <dt className="text-xs text-muted">{t("tool.httpStatus.phrase")}</dt>
            <dd className="mt-1 text-sm">
              {result.phrase ?? t("tool.httpStatus.unknownPhrase")}
            </dd>
          </div>
        </dl>
      ) : (
        <p
          className={`text-sm ${result.reason === "invalid" ? "text-danger" : "text-muted"}`}
          role={result.reason === "invalid" ? "alert" : undefined}
        >
          {t(
            result.reason === "empty"
              ? "tool.httpStatus.empty"
              : "tool.httpStatus.invalid",
          )}
        </p>
      )}
    </div>
  );
}
