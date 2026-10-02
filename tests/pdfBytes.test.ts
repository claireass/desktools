import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import {
  PdfReadError,
  countPdfPages,
  extractPdfPages,
  mergePdfBytes,
  onePdfPage,
  splitPdfAfter,
} from "@/features/pdf-shared/pdfBytes";

describe("pdf bytes", () => {
  it("merges, extracts, and splits pages", async () => {
    const first = await blank(1);
    const second = await blank(2);
    const merged = await mergePdfBytes([first, second]);
    expect(await countPdfPages(toBuffer(merged))).toBe(3);

    const extracted = await extractPdfPages(second, [0, 1]);
    expect(await countPdfPages(toBuffer(extracted))).toBe(2);

    const [partOne, partTwo] = await splitPdfAfter(toBuffer(merged), 1);
    expect(await countPdfPages(toBuffer(partOne))).toBe(1);
    expect(await countPdfPages(toBuffer(partTwo))).toBe(2);

    const page = await onePdfPage(second, 1);
    expect(await countPdfPages(toBuffer(page))).toBe(1);
  });

  it("rejects bytes that are not a PDF", async () => {
    const bytes = new Uint8Array([1, 2, 3]).buffer;
    await expect(countPdfPages(bytes)).rejects.toThrow(PdfReadError);
  });
});

async function blank(pages: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  for (let index = 0; index < pages; index += 1) {
    doc.addPage();
  }
  return toBuffer(await doc.save());
}

function toBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}
