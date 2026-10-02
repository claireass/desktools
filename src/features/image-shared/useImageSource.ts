import { useEffect, useRef, useState } from "react";
import { maxImageEdge } from "@/features/image-shared/resize";

export type ImageSource = {
  file: File;
  width: number;
  height: number;
  url: string;
};

export type ImageSourceError = "unsupported" | "tooLarge";

export function useImageSource() {
  const request = useRef(0);
  const [source, setSource] = useState<ImageSource | null>(null);
  const [error, setError] = useState<ImageSourceError | null>(null);

  useEffect(() => {
    if (!source) {
      return;
    }
    return () => URL.revokeObjectURL(source.url);
  }, [source]);

  async function select(file: File | undefined): Promise<ImageSource | null> {
    const current = request.current + 1;
    request.current = current;

    if (!file) {
      setSource(null);
      setError(null);
      return null;
    }

    if (!file.type.startsWith("image/")) {
      setSource(null);
      setError("unsupported");
      return null;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const width = bitmap.width;
      const height = bitmap.height;
      bitmap.close();
      if (request.current !== current) {
        return null;
      }
      if (width < 1 || height < 1 || width > maxImageEdge || height > maxImageEdge) {
        setSource(null);
        setError(
          width > maxImageEdge || height > maxImageEdge ? "tooLarge" : "unsupported",
        );
        return null;
      }
      const next = { file, width, height, url: URL.createObjectURL(file) };
      setSource(next);
      setError(null);
      return next;
    } catch {
      if (request.current === current) {
        setSource(null);
        setError("unsupported");
      }
      return null;
    }
  }

  function clear() {
    request.current += 1;
    setSource(null);
    setError(null);
  }

  return { source, error, select, clear };
}
