import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { isoToUnix, unixToIso, type UnixUnit } from "@/features/timestamp/logic";
import { useI18n } from "@/hooks/useI18n";

export function TimestampTool() {
  const { t } = useI18n();
  const [unit, setUnit] = useState<UnixUnit>("seconds");
  const [unix, setUnix] = useState("");
  const [iso, setIso] = useState("");
  const [invalid, setInvalid] = useState(false);

  return (
    <div className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        {t("tool.timestamp.unit")}
        <select
          className={fieldClass}
          value={unit}
          onChange={(event) => setUnit(event.target.value === "milliseconds" ? "milliseconds" : "seconds")}
        >
          <option value="seconds">{t("tool.timestamp.seconds")}</option>
          <option value="milliseconds">{t("tool.timestamp.milliseconds")}</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        {t("tool.timestamp.unix")}
        <input
          className={`${fieldClass} font-mono`}
          value={unix}
          onChange={(event) => setUnix(event.target.value)}
        />
      </label>
      <Button
        type="button"
        onClick={() => {
          const next = unixToIso(unix, unit);
          setInvalid(next === null);
          if (next) {
            setIso(next);
          }
        }}
      >
        {t("tool.timestamp.toDate")}
      </Button>
      <label className="grid gap-2 text-sm">
        {t("tool.timestamp.iso")}
        <input
          className={`${fieldClass} font-mono`}
          value={iso}
          onChange={(event) => setIso(event.target.value)}
        />
      </label>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const next = isoToUnix(iso, unit);
          setInvalid(next === null);
          if (next) {
            setUnix(next);
          }
        }}
      >
        {t("tool.timestamp.toUnix")}
      </Button>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.timestamp.invalid")}
        </p>
      ) : null}
    </div>
  );
}
