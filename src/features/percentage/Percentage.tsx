import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import { changePercent, percentOf, ratioPercent } from "@/features/percentage/logic";
import { useI18n } from "@/hooks/useI18n";
import { formatDecimal, parseDecimal } from "@/utils/decimal";

export function Percentage() {
  const { t } = useI18n();
  const [percent, setPercent] = useState("");
  const [whole, setWhole] = useState("");
  const [part, setPart] = useState("");
  const [ratioWhole, setRatioWhole] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const ofResult = useMemo(() => pair(percent, whole, percentOf), [percent, whole]);
  const ratioResult = useMemo(
    () => pair(part, ratioWhole, (left, right) => ratioPercent(left, right)),
    [part, ratioWhole],
  );
  const changeResult = useMemo(
    () => pair(from, to, (left, right) => changePercent(left, right)),
    [from, to],
  );

  return (
    <div className="grid max-w-3xl gap-6">
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">{t("tool.percentage.ofTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label={t("tool.percentage.percent")}
            value={percent}
            onChange={setPercent}
          />
          <NumberField
            label={t("tool.percentage.whole")}
            value={whole}
            onChange={setWhole}
          />
        </div>
        <Result
          value={ofResult}
          empty={t("tool.percentage.empty")}
          invalid={t("tool.percentage.invalid")}
        />
      </section>
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">{t("tool.percentage.ratioTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label={t("tool.percentage.part")}
            value={part}
            onChange={setPart}
          />
          <NumberField
            label={t("tool.percentage.whole")}
            value={ratioWhole}
            onChange={setRatioWhole}
          />
        </div>
        <Result
          value={ratioResult}
          empty={t("tool.percentage.empty")}
          invalid={t("tool.percentage.invalid")}
          zero={t("tool.percentage.divideByZero")}
        />
      </section>
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">{t("tool.percentage.changeTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label={t("tool.percentage.from")}
            value={from}
            onChange={setFrom}
          />
          <NumberField label={t("tool.percentage.to")} value={to} onChange={setTo} />
        </div>
        <Result
          value={changeResult}
          empty={t("tool.percentage.empty")}
          invalid={t("tool.percentage.invalid")}
          zero={t("tool.percentage.divideByZero")}
        />
      </section>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
        inputMode="decimal"
      />
    </label>
  );
}

function Result({
  value,
  empty,
  invalid,
  zero,
}: {
  value: "empty" | "invalid" | "zero" | string;
  empty: string;
  invalid: string;
  zero?: string;
}) {
  if (value === "empty") {
    return <p className="text-sm text-muted">{empty}</p>;
  }
  if (value === "invalid") {
    return (
      <p className="text-sm text-danger" role="alert">
        {invalid}
      </p>
    );
  }
  if (value === "zero") {
    return (
      <p className="text-sm text-danger" role="alert">
        {zero}
      </p>
    );
  }
  return (
    <p className="font-mono text-sm" aria-live="polite">
      {value}
    </p>
  );
}

function pair(
  left: string,
  right: string,
  calculate: (left: number, right: number) => number | null,
): "empty" | "invalid" | "zero" | string {
  if (left.trim() === "" && right.trim() === "") {
    return "empty";
  }
  const first = parseDecimal(left);
  const second = parseDecimal(right);
  if (first === null || second === null) {
    return left.trim() === "" || right.trim() === "" ? "empty" : "invalid";
  }
  const result = calculate(first, second);
  return result === null ? "zero" : formatDecimal(result);
}
