import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { maxSplitPages, pdfCopyName, planSplitAfter } from "@/features/pdf-shared/pages";
import {
  countPdfPages,
  downloadPdf,
  isPdfReadError,
  onePdfPage,
  splitPdfAfter,
} from "@/features/pdf-shared/pdfBytes";
import { useI18n } from "@/hooks/useI18n";

type LoadedPdf = {
  name: string;
  bytes: ArrayBuffer;
  pageCount: number;
};

type Piece = {
  name: string;
  bytes: Uint8Array;
  pages: number;
};

export function PdfSplit() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pdf, setPdf] = useState<LoadedPdf | null>(null);
  const [mode, setMode] = useState<"each" | "after">("each");
  const [after, setAfter] = useState(1);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [readError, setReadError] = useState(false);

  const tooMany = pdf !== null && mode === "each" && pdf.pageCount > maxSplitPages;

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.pdf.note")}</p>
      <FileSelect
        accept="application/pdf,.pdf"
        label={t("tool.pdf.pick")}
        inputRef={inputRef}
        onFiles={(files) => {
          setPieces([]);
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
              setAfter(1);
            } catch {
              setPdf(null);
              setReadError(true);
            }
          });
        }}
      />
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.pdfSplit.mode")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <input
              type="radio"
              name="pdf-split-mode"
              checked={mode === "each"}
              onChange={() => {
                setMode("each");
                setPieces([]);
                setProblem(null);
              }}
            />
            {t("tool.pdfSplit.each")}
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <input
              type="radio"
              name="pdf-split-mode"
              checked={mode === "after"}
              onChange={() => {
                setMode("after");
                setPieces([]);
                setProblem(null);
              }}
            />
            {t("tool.pdfSplit.after")}
          </label>
        </div>
      </fieldset>
      {mode === "after" ? (
        <label className="grid max-w-xs gap-2 text-sm font-medium">
          {t("tool.pdfSplit.afterPage")}
          <input
            type="number"
            min={1}
            value={after}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              if (Number.isInteger(value)) {
                setAfter(value);
              }
            }}
            className={fieldClass}
          />
        </label>
      ) : null}
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
      {tooMany ? (
        <p className="text-sm text-muted">{t("tool.pdfSplit.tooMany")}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={!pdf || pending || tooMany}
          onClick={() => {
            if (!pdf) {
              return;
            }
            setProblem(null);
            if (mode === "each") {
              setPending(true);
              void Promise.all(
                Array.from({ length: pdf.pageCount }, (_, index) =>
                  onePdfPage(pdf.bytes, index).then((bytes) => ({
                    name: pdfCopyName(pdf.name, `page-${index + 1}`),
                    bytes,
                    pages: 1,
                  })),
                ),
              )
                .then((next) => setPieces(next))
                .catch((error: unknown) => {
                  setPieces([]);
                  setProblem(isPdfReadError(error) ? "read" : "write");
                })
                .finally(() => setPending(false));
              return;
            }
            const plan = planSplitAfter(pdf.pageCount, after);
            if (!plan.ok) {
              setPieces([]);
              setProblem(plan.reason);
              return;
            }
            setPending(true);
            void splitPdfAfter(pdf.bytes, after)
              .then(async ([first, second]) => {
                setPieces([
                  {
                    name: pdfCopyName(pdf.name, "part-1"),
                    bytes: first,
                    pages: await countPdfPages(toArrayBuffer(first)),
                  },
                  {
                    name: pdfCopyName(pdf.name, "part-2"),
                    bytes: second,
                    pages: await countPdfPages(toArrayBuffer(second)),
                  },
                ]);
              })
              .catch((error: unknown) => {
                setPieces([]);
                setProblem(isPdfReadError(error) ? "read" : "write");
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.pdf.working") : t("tool.pdfSplit.split")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setPdf(null);
            setPieces([]);
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
          {t(problemText(problem))}
        </p>
      ) : null}
      {pieces.length > 0 ? (
        <ul className="grid gap-2">
          {pieces.map((piece) => (
            <li
              key={piece.name}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            >
              <span>
                {piece.name}{" "}
                <span className="text-muted">
                  {t("tool.pdf.pageCount")} {piece.pages}
                </span>
              </span>
              <Button
                variant="secondary"
                onClick={() => downloadPdf(piece.bytes, piece.name)}
              >
                {t("tool.pdf.download")}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function problemText(problem: string) {
  if (problem === "tooSmall") {
    return "tool.pdfSplit.tooSmall" as const;
  }
  if (problem === "invalid") {
    return "tool.pdfSplit.invalid" as const;
  }
  if (problem === "read") {
    return "tool.pdf.unsupported" as const;
  }
  return "tool.pdf.writeFailed" as const;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}
