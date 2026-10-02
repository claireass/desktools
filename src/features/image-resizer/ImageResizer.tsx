import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { encodeImage } from "@/features/image-shared/canvasImage";
import {
  mimeForFormat,
  outputName,
  type ImageFormat,
} from "@/features/image-shared/format";
import { planResize, scaleSide } from "@/features/image-shared/resize";
import { useImageOutput } from "@/features/image-shared/useImageOutput";
import { useImageSource } from "@/features/image-shared/useImageSource";
import { useI18n } from "@/hooks/useI18n";
import { formatBytes } from "@/utils/formatBytes";

export function ImageResizer() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const { source, error, select, clear } = useImageSource();
  const { output, show, reset } = useImageOutput();
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [keepAspect, setKeepAspect] = useState(true);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<"invalid" | "tooLarge" | "encode" | null>(null);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.image.note")}</p>
      <FileSelect
        accept="image/*"
        label={t("tool.image.pick")}
        inputRef={inputRef}
        onFiles={(files) => {
          reset();
          setProblem(null);
          void select(files[0]).then((loaded) => {
            if (loaded) {
              setWidth(loaded.width);
              setHeight(loaded.height);
            }
          });
        }}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {t("tool.imageResize.width")}
          <input
            type="number"
            min={1}
            value={width}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              if (!source || !keepAspect) {
                if (Number.isInteger(value)) {
                  setWidth(value);
                }
                return;
              }
              const next = scaleSide(source.width, source.height, "width", value);
              if (next) {
                setWidth(next.width);
                setHeight(next.height);
              }
            }}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("tool.imageResize.height")}
          <input
            type="number"
            min={1}
            value={height}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              if (!source || !keepAspect) {
                if (Number.isInteger(value)) {
                  setHeight(value);
                }
                return;
              }
              const next = scaleSide(source.width, source.height, "height", value);
              if (next) {
                setWidth(next.width);
                setHeight(next.height);
              }
            }}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={keepAspect}
          onChange={(event) => setKeepAspect(event.target.checked)}
        />
        {t("tool.imageResize.keepAspect")}
      </label>
      <p className="text-xs text-muted">{t("tool.image.firstFrame")}</p>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {t(error === "tooLarge" ? "tool.image.tooLarge" : "tool.image.unsupported")}
        </p>
      ) : null}
      {source ? (
        <p className="text-sm">
          {t("tool.image.dimensions")} {source.width} × {source.height}
        </p>
      ) : (
        <p className="text-sm text-muted">{t("tool.image.empty")}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={!source || pending}
          onClick={() => {
            if (!source) {
              return;
            }
            const plan = planResize({ width, height });
            if (!plan.ok) {
              setProblem(plan.reason);
              reset();
              return;
            }
            setPending(true);
            setProblem(null);
            const format = formatFor(source.file.type);
            void encodeImage(source.file, {
              width: plan.width,
              height: plan.height,
              type: mimeForFormat(format),
              quality: format === "png" ? undefined : 0.92,
            })
              .then((blob) => {
                show(blob, outputName(source.file.name, format));
              })
              .catch(() => {
                reset();
                setProblem("encode");
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.image.working") : t("tool.imageResize.resize")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            clear();
            reset();
            setProblem(null);
            setWidth(1);
            setHeight(1);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.image.clear")}
        </Button>
      </div>
      {problem ? (
        <p className="text-sm text-danger" role="alert">
          {t(
            problem === "invalid"
              ? "tool.imageResize.invalid"
              : problem === "tooLarge"
                ? "tool.image.tooLarge"
                : "tool.image.encodeFailed",
          )}
        </p>
      ) : null}
      {output ? (
        <div className="grid gap-2">
          <p className="text-sm">
            {t("tool.image.outputSize")} {output.name}{" "}
            <span className="text-muted">
              {formatBytes(output.size)} ({output.size})
            </span>
          </p>
          <img
            src={output.url}
            alt={output.name}
            className="max-h-48 max-w-full rounded-xl border border-border bg-surface object-contain"
          />
          <div>
            <Button
              variant="secondary"
              onClick={() => downloadOutput(output.url, output.name)}
            >
              {t("tool.image.download")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatFor(type: string): ImageFormat {
  if (type === "image/jpeg") {
    return "jpeg";
  }
  if (type === "image/webp") {
    return "webp";
  }
  return "png";
}

function downloadOutput(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}
