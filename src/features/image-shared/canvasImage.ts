export async function encodeImage(
  file: File,
  options: { width: number; height: number; type: string; quality?: number },
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("canvas unavailable");
    }
    if (options.type === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, options.width, options.height);
    }
    context.drawImage(bitmap, 0, 0, options.width, options.height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), options.type, options.quality);
    });
    if (!blob) {
      throw new Error("encode failed");
    }
    return blob;
  } finally {
    bitmap.close();
  }
}
