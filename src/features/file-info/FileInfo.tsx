import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { describeFile } from "@/features/file-info/logic";
import type { FileFacts } from "@/features/file-info/types";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";

export function FileInfo() {
  const { locale, t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [facts, setFacts] = useState<FileFacts | null>(null);

  const modified =
    facts && Number.isFinite(facts.lastModified)
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(facts.lastModified),
        )
      : "";

  const rows: [MessageKey, string][] = facts
    ? [
        ["tool.fileInfo.fileName", facts.name],
        [
          "tool.fileInfo.extension",
          facts.extension === "" ? t("tool.fileInfo.noExtension") : facts.extension,
        ],
        ["tool.fileInfo.type", facts.type === "" ? t("tool.fileInfo.unknownType") : facts.type],
        ["tool.fileInfo.size", `${facts.sizeLabel} (${facts.size})`],
        ["tool.fileInfo.modified", modified === "" ? t("tool.fileInfo.unknownModified") : modified],
      ]
    : [];

  return (
    <div className="grid max-w-3xl gap-4">
      <FileSelect
        label={t("tool.fileInfo.pick")}
        inputRef={inputRef}
        onFiles={(files) => {
          const file = files[0];
          setFacts(
            file
              ? describeFile({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  lastModified: file.lastModified,
                })
              : null,
          );
        }}
      />
      {facts ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-surface px-3 py-3">
              <dt className="text-xs text-muted">{t(label)}</dt>
              <dd className="mt-1 break-all text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted">{t("tool.fileInfo.empty")}</p>
      )}
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            setFacts(null);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.fileInfo.clear")}
        </Button>
      </div>
    </div>
  );
}
