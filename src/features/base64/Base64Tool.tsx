import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { decodeBase64, encodeBase64 } from "@/features/base64/logic";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

export function Base64Tool() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);

  function show(next: string | null) {
    setCopied(false);
    setCopyDetail(null);
    if (next === null) {
      setOutput("");
      setInvalid(true);
      return;
    }
    setOutput(next);
    setInvalid(false);
  }

  return (
    <div className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        {t("tool.base64.input")}
        <textarea
          className={`${fieldClass} min-h-28 font-mono`}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => show(encodeBase64(input))}>
          {t("tool.base64.encode")}
        </Button>
        <Button type="button" variant="secondary" onClick={() => show(decodeBase64(input))}>
          {t("tool.base64.decode")}
        </Button>
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
      </div>
      <output className={`${fieldClass} block min-h-12 whitespace-pre-wrap font-mono`} aria-live="polite">
        {output}
      </output>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.base64.invalid")}
        </p>
      ) : null}
      {copied ? <p className="text-sm text-success">{t("common.copied")}</p> : null}
      {copyDetail ? (
        <p className="text-sm text-danger" role="alert">
          {t("common.copyFailed")} {copyDetail}
        </p>
      ) : null}
    </div>
  );
}
