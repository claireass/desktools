import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { moveItem, pdfCopyName } from "@/features/pdf-shared/pages";
import {
  countPdfPages,
  downloadPdf,
  isPdfReadError,
  mergePdfBytes,
} from "@/features/pdf-shared/pdfBytes";
import { useI18n } from "@/hooks/useI18n";

type MergeItem = {
  key: string;
  name: string;
  bytes: ArrayBuffer;
  pageCount: number;
};

export function PdfMerge() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MergeItem[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<"read" | "write" | null>(null);
  const [result, setResult] = useState<{
    name: string;
    bytes: Uint8Array;
    pages: number;
  } | null>(null);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.pdf.note")}</p>
      <FileSelect
        multiple
        accept="application/pdf,.pdf"
        label={t("tool.pdf.pickMany")}
        inputRef={inputRef}
        onFiles={(files) => {
          setProblem(null);
          setResult(null);
          void addFiles(files).then((loaded) => {
            setItems((current) => [...current, ...loaded.items]);
            setFailed(loaded.failed);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          });
        }}
      />
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t("tool.pdf.empty")}</p>
      ) : null}
      {items.length === 1 ? (
        <p className="text-sm text-muted">{t("tool.pdfMerge.needTwo")}</p>
      ) : null}
      {items.length > 0 ? (
        <ol className="grid gap-2">
          {items.map((item, index) => (
            <li
              key={item.key}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            >
              <span className="min-w-0 break-all">
                {item.name}{" "}
                <span className="text-muted">
                  {t("tool.pdf.pageCount")} {item.pageCount}
                </span>
              </span>
              <span className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setItems((current) => moveItem(current, index, -1))}
                >
                  {t("tool.pdfMerge.up")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setItems((current) => moveItem(current, index, 1))}
                >
                  {t("tool.pdfMerge.down")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setItems((current) =>
                      current.filter((entry) => entry.key !== item.key),
                    )
                  }
                >
                  {t("tool.pdfMerge.remove")}
                </Button>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {failed.length > 0 ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.pdf.unsupported")} {failed.join(", ")}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={items.length < 2 || pending}
          onClick={() => {
            setPending(true);
            setProblem(null);
            const buffers = items.map((item) => item.bytes);
            void mergePdfBytes(buffers)
              .then(async (bytes) => {
                const pages = await countPdfPages(toArrayBuffer(bytes));
                setResult({
                  name: pdfCopyName(items[0]?.name ?? "document", "merged"),
                  bytes,
                  pages,
                });
              })
              .catch((error: unknown) => {
                setResult(null);
                setProblem(isPdfReadError(error) ? "read" : "write");
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.pdf.working") : t("tool.pdfMerge.merge")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setItems([]);
            setFailed([]);
            setResult(null);
            setProblem(null);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.pdf.clear")}
        </Button>
      </div>
      {problem ? (
        <p className="text-sm text-danger" role="alert">
          {t(problem === "read" ? "tool.pdf.unsupported" : "tool.pdf.writeFailed")}
        </p>
      ) : null}
      {result ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <p>
            {result.name}{" "}
            <span className="text-muted">
              {t("tool.pdf.pageCount")} {result.pages}
            </span>
          </p>
          <Button
            variant="secondary"
            onClick={() => downloadPdf(result.bytes, result.name)}
          >
            {t("tool.pdf.download")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

async function addFiles(
  files: File[],
): Promise<{ items: MergeItem[]; failed: string[] }> {
  const items: MergeItem[] = [];
  const failed: string[] = [];
  for (const file of files) {
    try {
      const bytes = await file.arrayBuffer();
      const pageCount = await countPdfPages(bytes);
      if (pageCount < 1) {
        failed.push(file.name);
        continue;
      }
      items.push({ key: crypto.randomUUID(), name: file.name, bytes, pageCount });
    } catch {
      failed.push(file.name);
    }
  }
  return { items, failed };
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}
