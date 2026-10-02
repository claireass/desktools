import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import {
  nextCronRuns,
  parseCron,
  type CronField,
  type CronSchedule,
} from "@/features/cron/logic";
import { useI18n } from "@/hooks/useI18n";

const fieldNames: CronField[] = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];
const fullCount: Record<CronField, number> = {
  minute: 60,
  hour: 24,
  dayOfMonth: 31,
  month: 12,
  dayOfWeek: 7,
};

export function CronTool() {
  const { t } = useI18n();
  const [expression, setExpression] = useState("0 9 * * 1");
  const [schedule, setSchedule] = useState<CronSchedule | null>(null);
  const [runs, setRuns] = useState<string[] | null>(null);
  const [invalid, setInvalid] = useState(false);

  return (
    <div className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        {t("tool.cron.input")}
        <input
          className={`${fieldClass} font-mono`}
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
        />
      </label>
      <Button
        type="button"
        onClick={() => {
          const parsed = parseCron(expression);
          const next = nextCronRuns(expression, new Date().toISOString(), 5);
          setInvalid(parsed === null || next === null);
          setSchedule(parsed);
          setRuns(next);
        }}
      >
        {t("tool.cron.show")}
      </Button>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.cron.invalid")}
        </p>
      ) : null}
      {schedule ? (
        <dl className="grid gap-2 text-sm">
          {fieldNames.map((name) => (
            <div key={name}>
              <dt className="font-medium">{t(`tool.cron.${name}`)}</dt>
              <dd className="font-mono">
                {schedule.fields[name].length === fullCount[name]
                  ? t("tool.cron.every")
                  : schedule.fields[name].join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {schedule && !schedule.dayOfMonthAny && !schedule.dayOfWeekAny ? (
        <p className="text-sm">{t("tool.cron.either")}</p>
      ) : null}
      {schedule ? <p className="text-sm text-muted">{t("tool.cron.sunday")}</p> : null}
      {runs?.length === 0 ? <p className="text-sm">{t("tool.cron.none")}</p> : null}
      {runs && runs.length > 0 ? (
        <ol className="grid gap-2">
          {runs.map((run) => (
            <li key={run} className={`${fieldClass} font-mono text-sm`}>
              {run}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
