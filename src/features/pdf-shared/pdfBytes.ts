import { PDFDocument } from "pdf-lib";
import { safeDownloadName } from "@/utils/safeDownloadName";

export class PdfReadError extends Error {
  constructor() {
    super("pdf read failed");
    this.name = "PdfReadError";
  }
}

export function isPdfReadError(error: unknown): boolean {
  return error instanceof PdfReadError;
}

export async function countPdfPages(bytes: ArrayBuffer): Promise<number> {
  return (await openPdf(bytes)).getPageCount();
}

export async function mergePdfBytes(parts: ArrayBuffer[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const part of parts) {
    const source = await openPdf(part);
    const copied = await merged.copyPages(source, source.getPageIndices());
    for (const page of copied) {
      merged.addPage(page);
    }
  }
  return merged.save();
}

export async function extractPdfPages(
  bytes: ArrayBuffer,
  pages: number[],
): Promise<Uint8Array> {
  if (pages.length === 0) {
    throw new PdfReadError();
  }
  const source = await openPdf(bytes);
  return savePages(source, pages);
}

export async function splitPdfAfter(
  bytes: ArrayBuffer,
  after: number,
): Promise<[Uint8Array, Uint8Array]> {
  const source = await openPdf(bytes);
  const count = source.getPageCount();
  const first = Array.from({ length: after }, (_, index) => index);
  const second = Array.from({ length: count - after }, (_, index) => index + after);
  return [await savePages(source, first), await savePages(source, second)];
}

export async function onePdfPage(bytes: ArrayBuffer, index: number): Promise<Uint8Array> {
  const source = await openPdf(bytes);
  return savePages(source, [index]);
}

async function openPdf(bytes: ArrayBuffer): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes);
  } catch (error) {
    if (error instanceof PdfReadError) {
      throw error;
    }
    throw new PdfReadError();
  }
}

async function savePages(source: PDFDocument, indexes: number[]): Promise<Uint8Array> {
  const next = await PDFDocument.create();
  const copied = await next.copyPages(source, indexes);
  if (copied.length !== indexes.length) {
    throw new PdfReadError();
  }
  for (const page of copied) {
    next.addPage(page);
  }
  return next.save();
}

export function downloadPdf(bytes: Uint8Array, name: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const url = URL.createObjectURL(new Blob([copy], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = safeDownloadName(name, "document.pdf");
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
