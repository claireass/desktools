import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import { describeSubnet } from "@/features/subnet-calculator/logic";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";

export function SubnetCalculator() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const result = useMemo(() => describeSubnet(input), [input]);
  const rows: [MessageKey, string][] = result.ok
    ? [
        ["tool.subnet.address", result.report.address],
        ["tool.subnet.prefix", String(result.report.prefix)],
        ["tool.subnet.netmask", result.report.netmask],
        ["tool.subnet.network", result.report.network],
        ["tool.subnet.broadcast", result.report.broadcast ?? "—"],
        ["tool.subnet.first", result.report.firstHost ?? "—"],
        ["tool.subnet.last", result.report.lastHost ?? "—"],
        ["tool.subnet.usable", String(result.report.usable)],
      ]
    : [];

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.internet.offline")}</p>
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.subnet.input")}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} font-mono`}
          spellCheck={false}
          placeholder="192.168.1.10/24"
        />
      </label>
      {result.ok ? (
        <>
          <p className="text-sm text-muted">
            {t(`tool.subnet.kind.${result.report.kind}`)}
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-surface px-3 py-3"
              >
                <dt className="text-xs text-muted">{t(label)}</dt>
                <dd className="mt-1 font-mono text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p
          className={`text-sm ${result.reason === "invalid" ? "text-danger" : "text-muted"}`}
          role={result.reason === "invalid" ? "alert" : undefined}
        >
          {t(result.reason === "empty" ? "tool.subnet.empty" : "tool.subnet.invalid")}
        </p>
      )}
    </div>
  );
}
