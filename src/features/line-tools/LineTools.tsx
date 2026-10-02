import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import {
  lineActions,
  transformLines,
  type LineAction,
} from "@/features/line-tools/logic";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";
import { copyText } from "@/utils/copyText";

const actionKeys: Record<LineAction, MessageKey> = {
  trim: "tool.lineTools.trim",
  dropEmpty: "tool.lineTools.dropEmpty",
  sort: "tool.lineTools.sort",
  unique: "tool.lineTools.unique",
  reverse: "tool.lineTools.reverse",
};

export function LineTools() {
  const { locale, t } = useI18n();
  const [input, setInput] = useState("");
  const [action, setAction] = useState<LineAction>("sort");
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);
  const output = useMemo(
    () => transformLines(input, action, locale),
    [action, input, locale],
  );

  return (
    <div className="grid max-w-3xl gap-4">
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.lineTools.action")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {lineActions.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="line-action"
                checked={action === item}
                onChange={() => setAction(item)}
              />
              {t(actionKeys[item])}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.lineTools.input")}
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} min-h-32 font-mono`}
          spellCheck={false}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.lineTools.output")}
        <textarea
          readOnly
          value={output}
          className={`${fieldClass} min-h-32 font-mono`}
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
