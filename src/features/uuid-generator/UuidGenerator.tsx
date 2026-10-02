import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { createUuid } from "@/features/uuid-generator/logic";
import { useI18n } from "@/hooks/useI18n";
import { copyText } from "@/utils/copyText";

export function UuidGenerator() {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);

  return (
    <div className="grid max-w-xl gap-4">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => {
            setValue(createUuid());
            setCopied(false);
            setCopyDetail(null);
          }}
        >
          {t("tool.uuid.generate")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={value === ""}
          onClick={() => {
            void copyText(value)
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
      <output className={`${fieldClass} block min-h-12 font-mono`} aria-live="polite">
        {value || t("tool.uuid.empty")}
      </output>
      {copied ? <p className="text-sm text-success">{t("common.copied")}</p> : null}
      {copyDetail ? (
        <p className="text-sm text-danger" role="alert">
          {t("common.copyFailed")} {copyDetail}
        </p>
      ) : null}
    </div>
  );
}
