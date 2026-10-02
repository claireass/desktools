import { useMemo, useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { previewRename } from "@/features/file-renamer/logic";
import type { RenameProblem } from "@/features/file-renamer/types";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";
import { copyText } from "@/utils/copyText";

const problemKeys: Record<RenameProblem, MessageKey> = {
  empty: "tool.fileRenamer.problem.empty",
  invalid: "tool.fileRenamer.problem.invalid",
  reserved: "tool.fileRenamer.problem.reserved",
  duplicate: "tool.fileRenamer.problem.duplicate",
  tooLong: "tool.fileRenamer.problem.tooLong",
};

export function FileRenamer() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [template, setTemplate] = useState("{name}.{ext}");
  const [start, setStart] = useState(1);
  const [pad, setPad] = useState(2);
  const [copied, setCopied] = useState(false);
  const [copyDetail, setCopyDetail] = useState<string | null>(null);
  const rows = useMemo(
    () => previewRename(files.map((file) => file.name), { template, start, pad }),
    [files, pad, start, template],
  );
  const ready = rows.filter((row) => row.problem === null);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.fileRenamer.note")}</p>
      <FileSelect
        multiple
        label={t("tool.fileRenamer.pick")}
        inputRef={inputRef}
        onFiles={(selected) => {
          setFiles(selected);
          setCopied(false);
          setCopyDetail(null);
        }}
      />
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.fileRenamer.template")}
        <input
          value={template}
          onChange={(event) => setTemplate(event.target.value)}
          className={`${fieldClass} font-mono`}
          spellCheck={false}
        />
      </label>
      <p className="text-xs text-muted">{t("tool.fileRenamer.templateHelp")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {t("tool.fileRenamer.start")}
          <input
            type="number"
            min={0}
            max={1000000}
            value={start}
            onChange={(event) => setStart(event.target.valueAsNumber)}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("tool.fileRenamer.pad")}
          <input
            type="number"
            min={1}
            max={6}
            value={pad}
            onChange={(event) => setPad(event.target.valueAsNumber)}
            className={fieldClass}
          />
        </label>
      </div>
      {files.length === 0 ? (
        <p className="text-sm text-muted">{t("tool.fileRenamer.empty")}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {rows.map((row, index) => (
            <li key={`${index}-${row.original}`} className="grid gap-1 px-3 py-2 text-sm">
              <span className="break-all text-muted">{row.original}</span>
              <span className="break-all font-medium">{row.next === "" ? "—" : row.next}</span>
              {row.problem ? (
                <span className="text-danger" role="alert">
                  {t(problemKeys[row.problem])}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={ready.length === 0}
          onClick={() => {
            rows.forEach((row, index) => {
              const file = files[index];
              if (file && row.problem === null) {
                downloadCopy(file, row.next);
              }
            });
          }}
        >
          {t("tool.fileRenamer.download")}
        </Button>
        <Button
          variant="secondary"
          disabled={ready.length === 0}
          onClick={() => {
            void copyText(ready.map((row) => row.next).join("\n"))
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
        <Button
          variant="secondary"
          onClick={() => {
            setFiles([]);
            setCopied(false);
            setCopyDetail(null);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.fileRenamer.clear")}
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

function downloadCopy(file: File, name: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
