import { useEffect, useRef, useState } from "react";

export type ImageOutput = {
  url: string;
  name: string;
  size: number;
};

export function useImageOutput() {
  const urlRef = useRef<string | null>(null);
  const [output, setOutput] = useState<ImageOutput | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  function show(blob: Blob, name: string) {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    setOutput({ url, name, size: blob.size });
  }

  function reset() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setOutput(null);
  }

  return { output, show, reset };
}
