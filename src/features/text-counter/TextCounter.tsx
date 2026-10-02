import { useMemo, useState } from "react";
import { fieldClass } from "@/components/tool/ToolIntro";
import { countText } from "@/features/text-counter/logic";
import { useI18n } from "@/hooks/useI18n";

export function TextCounter() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const counts = useMemo(() => countText(input), [input]);
  const items = [
    ["tool.textCounter.characters", counts.characters],
    ["tool.textCounter.words", counts.words],
    ["tool.textCounter.lines", counts.lines],
    ["tool.textCounter.paragraphs", counts.paragraphs],
  ] as const;

  return (
    <div className="grid max-w-3xl gap-4">
      <label className="grid gap-2 text-sm font-medium">
        {t("tool.textCounter.input")}
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${fieldClass} min-h-40`}
        />
      </label>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(([key, value]) => (
          <div key={key} className="rounded-xl border border-border bg-surface px-3 py-3">
            <dt className="text-xs text-muted">{t(key)}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
