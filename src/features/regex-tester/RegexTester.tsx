import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClass } from "@/components/tool/ToolIntro";
import { type RegexMatch, type RegexTest } from "@/features/regex-tester/logic";
import { useI18n } from "@/hooks/useI18n";

const flagOptions = ["g", "i", "m", "s", "u"] as const;

export function RegexTester() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [sample, setSample] = useState("");
  const [matches, setMatches] = useState<RegexMatch[] | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  function toggleFlag(flag: string) {
    setFlags((current) =>
      current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`,
    );
  }

  return (
    <div className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        {t("tool.regex.pattern")}
        <input
          className={`${fieldClass} font-mono`}
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
        />
      </label>
      <fieldset className="grid gap-2 text-sm">
        <legend>{t("tool.regex.flags")}</legend>
        <div className="flex flex-wrap gap-3">
          {flagOptions.map((flag) => (
            <label key={flag} className="flex items-center gap-2 font-mono">
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={() => toggleFlag(flag)}
              />
              {flag}
            </label>
          ))}
        </div>
        <p className="text-muted">{t("tool.regex.flagHint")}</p>
      </fieldset>
      <label className="grid gap-2 text-sm">
        {t("tool.regex.sample")}
        <textarea
          className={`${fieldClass} min-h-28 font-mono`}
          value={sample}
          onChange={(event) => setSample(event.target.value)}
        />
      </label>
      <Button
        type="button"
        onClick={() => {
          void testInWorker(pattern, flags, sample)
            .then((result) => {
              setTimedOut(false);
              setInvalid(!result.ok);
              setMatches(result.ok ? result.matches : null);
              setTruncated(result.ok && result.truncated);
            })
            .catch(() => {
              setTimedOut(true);
              setInvalid(false);
              setMatches(null);
              setTruncated(false);
            });
        }}
      >
        {t("tool.regex.test")}
      </Button>
      {invalid ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.regex.invalid")}
        </p>
      ) : null}
      {timedOut ? (
        <p className="text-sm text-danger" role="alert">
          {t("tool.regex.timeout")}
        </p>
      ) : null}
      {matches?.length === 0 ? <p className="text-sm">{t("tool.regex.empty")}</p> : null}
      {truncated ? <p className="text-sm">{t("tool.regex.truncated")}</p> : null}
      {matches && matches.length > 0 ? (
        <ol className="grid gap-2">
          {matches.map((match, index) => (
            <li
              key={`${match.index}-${index}`}
              className={`${fieldClass} font-mono text-sm`}
            >
              <span>
                {t("tool.regex.match")} {match.index}: {match.text}
              </span>
              {match.groups.length > 0 ? (
                <span className="mt-1 block">
                  {t("tool.regex.groups")}: {match.groups.join(", ")}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function testInWorker(
  pattern: string,
  flags: string,
  sample: string,
): Promise<RegexTest> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./regexWorker.ts", import.meta.url), {
      type: "module",
    });
    const timer = window.setTimeout(() => {
      worker.terminate();
      reject(new Error("timeout"));
    }, 1000);
    worker.onmessage = (event: MessageEvent<RegexTest>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      worker.terminate();
      reject(new Error("worker"));
    };
    worker.postMessage({ pattern, flags, sample });
  });
}
