import { useEffect, useMemo, useState } from "react";
import { normalizeSession, type SessionInput } from "@/features/system-info/logic";
import { useI18n } from "@/hooks/useI18n";
import type { MessageKey } from "@/i18n/messages";
import { fetchAppInfo, type AppInfo } from "@/services/appInfo";
import { isTauri } from "@/services/platform";

export function SystemInfo() {
  const { t } = useI18n();
  const session = useMemo(() => normalizeSession(readSession()), []);
  const [native, setNative] = useState<AppInfo | null>(null);
  const [nativeDetail, setNativeDetail] = useState<string | null>(null);
  const desktop = isTauri();

  useEffect(() => {
    if (!desktop) {
      return;
    }
    let active = true;
    void fetchAppInfo()
      .then((info) => {
        if (active) {
          setNative(info);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setNativeDetail(error instanceof Error ? error.message : "app info failed");
        }
      });
    return () => {
      active = false;
    };
  }, [desktop]);

  const rows: [MessageKey, string][] = [
    ["tool.systemInfo.language", session.language || "—"],
    ["tool.systemInfo.languages", session.languages.join(", ") || "—"],
    ["tool.systemInfo.platform", session.platform || "—"],
    ["tool.systemInfo.cores", session.cores === null ? "—" : String(session.cores)],
    [
      "tool.systemInfo.memory",
      session.memoryGb === null ? "—" : String(session.memoryGb),
    ],
    ["tool.systemInfo.screen", screenText(session)],
    ["tool.systemInfo.timezone", session.timezone || "—"],
    [
      "tool.systemInfo.online",
      session.online ? t("tool.systemInfo.yes") : t("tool.systemInfo.no"),
    ],
    ["tool.systemInfo.userAgent", session.userAgent || "—"],
  ];

  return (
    <div className="grid max-w-3xl gap-4">
      <p className="text-sm text-muted">{t("tool.systemInfo.note")}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface px-3 py-3"
          >
            <dt className="text-xs text-muted">{t(label)}</dt>
            <dd className="mt-1 break-all text-sm">{value}</dd>
          </div>
        ))}
        {native ? (
          <div className="rounded-xl border border-border bg-surface px-3 py-3">
            <dt className="text-xs text-muted">{t("tool.systemInfo.native")}</dt>
            <dd className="mt-1 text-sm">
              {native.os} · {native.arch}
            </dd>
          </div>
        ) : null}
      </dl>
      {!desktop ? (
        <p className="text-sm text-muted">{t("tool.systemInfo.desktopOnly")}</p>
      ) : null}
      {nativeDetail ? (
        <div className="text-sm">
          <p>{t("about.nativeUnavailable")}</p>
          <p className="mt-1 break-words text-muted">{nativeDetail}</p>
        </div>
      ) : null}
    </div>
  );
}

function readSession(): SessionInput {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return {
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    cores: navigator.hardwareConcurrency,
    memoryGb: typeof memory === "number" ? memory : null,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    online: navigator.onLine,
  };
}

function screenText(session: SessionInput): string {
  if (session.screenWidth < 1 || session.screenHeight < 1) {
    return "—";
  }
  return `${session.screenWidth} × ${session.screenHeight}`;
}
