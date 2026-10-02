import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import {
  addDays,
  daysBetween,
  parseDayCount,
  parseIsoDate,
} from "@/features/date-calculator/logic";
import { useI18n } from "@/hooks/useI18n";

export function DateCalculator() {
  const { t } = useI18n();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [base, setBase] = useState("");
  const [days, setDays] = useState("");
  const between = useMemo(() => {
    if (start === "" && end === "") {
      return "empty" as const;
    }
    if (!parseIsoDate(start) || !parseIsoDate(end)) {
      return start === "" || end === "" ? ("empty" as const) : ("invalid" as const);
    }
    return daysBetween(start, end);
  }, [end, start]);
  const shifted = useMemo(() => {
    if (base === "" && days.trim() === "") {
      return "empty" as const;
    }
    const count = parseDayCount(days);
    if (!parseIsoDate(base) || count === null) {
      return base === "" || days.trim() === ""
        ? ("empty" as const)
        : ("invalid" as const);
    }
    return addDays(base, count);
  }, [base, days]);

  return (
    <div className="grid max-w-3xl gap-6">
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">{t("tool.dateCalculator.betweenTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <DateField
            label={t("tool.dateCalculator.start")}
            value={start}
            onChange={setStart}
          />
          <DateField label={t("tool.dateCalculator.end")} value={end} onChange={setEnd} />
        </div>
        {between === "empty" ? (
          <p className="text-sm text-muted">{t("tool.dateCalculator.empty")}</p>
        ) : null}
        {between === "invalid" ? (
          <p className="text-sm text-danger" role="alert">
            {t("tool.dateCalculator.invalid")}
          </p>
        ) : null}
        {typeof between === "number" ? (
          <p className="font-mono text-sm" aria-live="polite">
            {t("tool.dateCalculator.days")} {between}
          </p>
        ) : null}
      </section>
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">{t("tool.dateCalculator.addTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <DateField
            label={t("tool.dateCalculator.start")}
            value={base}
            onChange={setBase}
          />
          <label className="grid gap-2 text-sm font-medium">
            {t("tool.dateCalculator.dayCount")}
            <input
              value={days}
              onChange={(event) => setDays(event.target.value)}
              className={fieldClass}
              inputMode="numeric"
            />
          </label>
        </div>
        {shifted === "empty" ? (
          <p className="text-sm text-muted">{t("tool.dateCalculator.empty")}</p>
        ) : null}
        {shifted === "invalid" || shifted === null ? (
          <p className="text-sm text-danger" role="alert">
            {t("tool.dateCalculator.invalid")}
          </p>
        ) : null}
        {typeof shifted === "string" && shifted !== "empty" && shifted !== "invalid" ? (
          <p className="font-mono text-sm" aria-live="polite">
            {shifted}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function DateField({
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
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}
