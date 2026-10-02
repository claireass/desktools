import { useMemo, useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { analyzeSizes } from "@/features/size-analyzer/logic";
import type { SizeInput } from "@/features/size-analyzer/types";
import { useI18n } from "@/hooks/useI18n";

export function SizeAnalyzer() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<SizeInput[]>([]);
  const report = useMemo(() => analyzeSizes(files), [files]);

  return (
    <div className="grid max-w-3xl gap-4">
      <FileSelect
        multiple
        label={t("tool.sizeAnalyzer.pick")}
        inputRef={inputRef}
        onFiles={(selected) => {
          setFiles(selected.map((file) => ({ name: file.name, size: file.size })));
        }}
      />
      {report.count === 0 ? (
        <p className="text-sm text-muted">{t("tool.sizeAnalyzer.empty")}</p>
      ) : (
        <>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface px-3 py-3">
              <dt className="text-xs text-muted">{t("tool.sizeAnalyzer.count")}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{report.count}</dd>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-3">
              <dt className="text-xs text-muted">{t("tool.sizeAnalyzer.total")}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{report.totalLabel}</dd>
              <dd className="text-xs text-muted tabular-nums">{report.total}</dd>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-3">
              <dt className="text-xs text-muted">{t("tool.sizeAnalyzer.largest")}</dt>
              <dd className="mt-1 break-all text-sm font-medium">{report.largest?.name}</dd>
              <dd className="text-xs text-muted">{report.largest?.sizeLabel}</dd>
            </div>
          </dl>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {report.items.map((item, index) => (
              <li
                key={`${index}-${item.name}`}
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
              >
                <span className="min-w-0 break-all">{item.name}</span>
                <span className="shrink-0 tabular-nums text-muted">{item.sizeLabel}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            setFiles([]);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.sizeAnalyzer.clear")}
        </Button>
      </div>
    </div>
  );
}
