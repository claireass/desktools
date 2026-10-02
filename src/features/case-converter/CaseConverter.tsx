import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { caseModes, convertCase, type CaseMode } from "@/features/case-converter/logic";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";
import { copyText } from "@/utils/copyText";

const modeKeys: Record<CaseMode, MessageKey> = {
  upper: "tool.caseConverter.upper",
  lower: "tool.caseConverter.lower",
  title: "tool.caseConverter.title",
  sentence: "tool.caseConverter.sentence",
};

export function CaseConverter() {
  const { locale, t } = useI18n();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseMode>("lower");
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);
  const output = useMemo(() => convertCase(input, mode, locale), [input, locale, mode]);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.caseConverter.localeNote")}</p>
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.caseConverter.mode")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {caseModes.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="case-mode"
                checked={mode === item}
                onChange={() => setMode(item)}
              />
              {t(modeKeys[item])}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.caseConverter.input")}
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} min-h-32`}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.caseConverter.output")}
        <textarea
          readOnly
          value={output}
          className={`${fieldClass} min-h-32`}
          aria-live="polite"
        />
      </label>
      <div className="flex items-center gap-3">
        <Button
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
    </div>
  );
}
