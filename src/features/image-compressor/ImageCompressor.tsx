import { useRef, useState } from "react";
import { FileSelect } from "@/components/tool/FileSelect";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { encodeImage } from "@/features/image-shared/canvasImage";
import {
  compressFormats,
  mimeForFormat,
  outputName,
  qualityFromPercent,
  type CompressFormat,
} from "@/features/image-shared/format";
import { useImageOutput } from "@/features/image-shared/useImageOutput";
import { useImageSource } from "@/features/image-shared/useImageSource";
import { useI18n } from "@/hooks/useI18n";
import { safeDownloadName } from "@/utils/safeDownloadName";
import { formatBytes } from "@/utils/formatBytes";

const labels = { jpeg: "JPEG", webp: "WebP" } as const;

export function ImageCompressor() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const { source, error, select, clear } = useImageSource();
  const { output, show, reset } = useImageOutput();
  const [format, setFormat] = useState<CompressFormat>("jpeg");
  const [percent, setPercent] = useState(80);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.image.note")}</p>
      <FileSelect
        accept="image/*"
        label={t("tool.image.pick")}
        inputRef={inputRef}
        onFiles={(files) => {
          reset();
          setFailed(false);
          void select(files[0]);
        }}
      />
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.imageCompress.format")}</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
          {compressFormats.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="compress-format"
                value={item}
                checked={format === item}
                onChange={() => setFormat(item)}
              />
              {labels[item]}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.imageCompress.quality")} {percent}
        <input
          type="range"
          min={10}
          max={100}
          value={percent}
          onChange={(event) => setPercent(event.target.valueAsNumber)}
          className={fieldClass}
        />
      </label>
      {format === "jpeg" ? (
        <p className="text-xs text-muted">{t("tool.imageConvert.jpegBackground")}</p>
      ) : null}
      <p className="text-xs text-muted">{t("tool.image.firstFrame")}</p>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {t(error === "tooLarge" ? "tool.image.tooLarge" : "tool.image.unsupported")}
        </p>
      ) : null}
      {source ? (
        <p className="text-sm">
          {t("tool.image.sourceSize")} {formatBytes(source.file.size)} ({source.file.size}
          )
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
            setPending(true);
            setFailed(false);
            void encodeImage(source.file, {
              width: source.width,
              height: source.height,
              type: mimeForFormat(format),
              quality: qualityFromPercent(percent),
            })
              .then((blob) => {
                show(blob, outputName(source.file.name, format));
              })
              .catch(() => {
                reset();
                setFailed(true);
              })
              .finally(() => setPending(false));
          }}
        >
          {pending ? t("tool.image.working") : t("tool.imageCompress.compress")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            clear();
            reset();
            setFailed(false);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          {t("tool.image.clear")}
        </Button>
      </div>
      {failed ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.image.encodeFailed")}
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

function downloadOutput(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = safeDownloadName(name, "image");
  link.click();
}
