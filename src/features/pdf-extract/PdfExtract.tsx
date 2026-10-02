import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { parsePageSelection, pdfCopyName } from "@/features/pdf-shared/pages";
import {
  countPdfPages,
  downloadPdf,
  extractPdfPages,
  isPdfReadError,
} from "@/features/pdf-shared/pdfBytes";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";

type LoadedPdf = {
  name: string;
  bytes: ArrayBuffer;
  pageCount: number;
};

const selectionProblems = {
  empty: "tool.pdfExtract.empty",
  invalid: "tool.pdfExtract.invalid",
  outOfRange: "tool.pdfExtract.outOfRange",
  tooMany: "tool.pdfExtract.tooMany",
} as const satisfies Record<string, MessageKey>;

export function PdfExtract() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pdf, setPdf] = useState<LoadedPdf | null>(null);
  const [selection, setSelection] = useState("1");
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<MessageKey | null>(null);
  const [readError, setReadError] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    bytes: Uint8Array;
    pages: number;
  } | null>(null);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.pdf.note")}</p>
      <FileSelect
        accept="application/pdf,.pdf"
        label={t("tool.pdf.pick")}
        inputRef={inputRef}
        onFiles={(files) => {
          setResult(null);
          setProblem(null);
          setReadError(false);
          const file = files[0];
          if (!file) {
            setPdf(null);
            return;
          }
          void file.arrayBuffer().then(async (bytes) => {
            try {
              const pageCount = await countPdfPages(bytes);
              if (pageCount < 1) {
                setPdf(null);
                setReadError(true);
                return;
              }
              setPdf({ name: file.name, bytes, pageCount });
            } catch {
              setPdf(null);
              setReadError(true);
            }
          });
        }}
      />
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.pdfExtract.pages")}
        <input
          value={selection}
          onChange={(event) => setSelection(event.target.value)}
          className={`${fieldClass} font-mono`}
          spellCheck={false}
        />
      </label>
      <p className="text-xs text-muted">{t("tool.pdfExtract.help")}</p>
      {pdf ? (
        <p className="text-sm">
          {pdf.name}{" "}
          <span className="text-muted">
            {t("tool.pdf.pageCount")} {pdf.pageCount}
          </span>
        </p>
      ) : (
        <p className="text-sm text-muted">{t("tool.pdf.empty")}</p>
      )}
      {readError ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.pdf.unsupported")}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={!pdf || pending}
          onClick={() => {
            if (!pdf) {
              return;
            }
            const parsed = parsePageSelection(selection, pdf.pageCount);
            if (!parsed.ok) {
              setResult(null);
              setProblem(selectionProblems[parsed.reason]);
              return;
            }
            setPending(true);
            setProblem(null);
            void extractPdfPages(pdf.bytes, parsed.pages)
              .then(async (bytes) => {
                const pages = await countPdfPages(toArrayBuffer(bytes));
                setResult({ name: pdfCopyName(pdf.name, "pages"), bytes, pages });
              })
              .catch((error: unknown) => {
                setResult(null);
                setProblem(
                  isPdfReadError(error) ? "tool.pdf.unsupported" : "tool.pdf.writeFailed",
                );
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.pdf.working") : t("tool.pdfExtract.extract")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setPdf(null);
            setResult(null);
            setProblem(null);
            setReadError(false);
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
          {t(problem)}
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

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}
