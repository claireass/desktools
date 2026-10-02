import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import {
  convertUnit,
  unitGroups,
  unitsFor,
  type Unit,
  type UnitGroup,
} from "@/features/unit-converter/logic";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";
import { formatDecimal, parseDecimal } from "@/utils/decimal";

const groupKeys: Record<UnitGroup, MessageKey> = {
  length: "tool.unitConverter.length",
  mass: "tool.unitConverter.mass",
  temperature: "tool.unitConverter.temperature",
};

const unitLabels: Record<Unit, string> = {
  mm: "mm",
  cm: "cm",
  m: "m",
  km: "km",
  in: "in",
  ft: "ft",
  g: "g",
  kg: "kg",
  lb: "lb",
  oz: "oz",
  C: "°C",
  F: "°F",
  K: "K",
};

export function UnitConverter() {
  const { t } = useI18n();
  const [group, setGroup] = useState<UnitGroup>("length");
  const [from, setFrom] = useState<Unit>("m");
  const [to, setTo] = useState<Unit>("cm");
  const [input, setInput] = useState("");
  const units = unitsFor(group);
  const result = useMemo(() => {
    if (input.trim() === "") {
      return "empty" as const;
    }
    const value = parseDecimal(input);
    if (value === null) {
      return "invalid" as const;
    }
    const converted = convertUnit(value, from, to);
    if (!converted.ok) {
      return converted.reason;
    }
    return formatDecimal(converted.value);
  }, [from, input, to]);

  return (
    <div className="grid max-w-3xl gap-4">
      <fieldset>
        <legend className="text-sm font-medium">{t("tool.unitConverter.group")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {unitGroups.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="unit-group"
                checked={group === item}
                onChange={() => {
                  const next = unitsFor(item);
                  setGroup(item);
                  setFrom(next[0] ?? "m");
                  setTo(next[1] ?? next[0] ?? "m");
                }}
              />
              {t(groupKeys[item])}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.unitConverter.value")}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={fieldClass}
          inputMode="decimal"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <UnitSelect
          label={t("tool.unitConverter.from")}
          value={from}
          units={units}
          onChange={setFrom}
        />
        <UnitSelect
          label={t("tool.unitConverter.to")}
          value={to}
          units={units}
          onChange={setTo}
        />
      </div>
      {result === "empty" ? (
        <p className="text-sm text-muted">{t("tool.unitConverter.empty")}</p>
      ) : null}
      {result === "invalid" || result === "mismatch" ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.unitConverter.invalid")}
        </p>
      ) : null}
      {result === "belowAbsoluteZero" ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.unitConverter.belowAbsoluteZero")}
        </p>
      ) : null}
      {result !== "empty" &&
      result !== "invalid" &&
      result !== "belowAbsoluteZero" &&
      result !== "mismatch" ? (
        <p className="font-mono text-sm" aria-live="polite">
          {result} {unitLabels[to]}
        </p>
      ) : null}
    </div>
  );
}

function UnitSelect({
  label,
  value,
  units,
  onChange,
}: {
  label: string;
  value: Unit;
  units: readonly Unit[];
  onChange: (unit: Unit) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Unit)}
        className={fieldClass}
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unitLabels[unit]}
          </option>
        ))}
      </select>
    </label>
  );
}
