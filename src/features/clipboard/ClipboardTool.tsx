import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

export function ClipboardTool() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.clipboard.note")}</p>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.clipboard.text")}
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={`${fieldClass} min-h-32`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={pending}
          onClick={() => {
            setPending(true);
            setCopied(false);
            setProblem(null);
            void readClipboard()
              .then((value) => setText(value))
              .catch((error: unknown) => {
                setProblem(
                  error instanceof Error ? error.message : "clipboard read failed",
                );
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.clipboard.reading") : t("tool.clipboard.read")}
        </Button>
        <Button
          variant="secondary"
          disabled={text === ""}
          onClick={() => {
            setProblem(null);
            void copyText(text)
              .then(() => setCopied(true))
              .catch((error: unknown) => {
                setCopied(false);
                setProblem(error instanceof Error ? error.message : "copy failed");
              });
          }}
        >
          {t("common.copy")}
        </Button>
        {copied ? <p className="text-sm text-success">{t("common.copied")}</p> : null}
      </div>
      {problem ? (
        <div className="text-sm" role="alert">
          <p>{t("tool.clipboard.failed")}</p>
          <p className="mt-1 break-words text-muted">{problem}</p>
        </div>
      ) : null}
    </div>
  );
}

async function readClipboard(): Promise<string> {
  if (!navigator.clipboard?.readText) {
    throw new Error("Clipboard API is unavailable.");
  }
  return navigator.clipboard.readText();
}
