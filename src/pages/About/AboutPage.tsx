import { useEffect, useState } from "react";
import { appConfig } from "@/constants/appConfig";
import { useI18n } from "@/hooks/useI18n";
import { fetchAppInfo, type AppInfo } from "@/services/appInfo";
import { isTauri } from "@/services/platform";
import { githubRepositoryUrl } from "@/services/githubRelease";
import { compareSemver } from "@/services/semver";

export function AboutPage() {
  const { t } = useI18n();
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAppInfo()
      .then((next) => {
        if (active) {
          setInfo(next);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setDetail(error instanceof Error ? error.message : "app info failed");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const versionComparison = info ? compareSemver(appConfig.version, info.version) : 0;
  const mismatch = versionComparison !== null && versionComparison !== 0;
  const repositoryUrl =
    githubRepositoryUrl(appConfig.repositoryOwner, appConfig.repositoryName) ?? "";

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold">{appConfig.name}</h1>
      <p className="mt-2 text-sm text-muted">{t("about.description")}</p>
      <dl className="mt-6 grid gap-3 text-sm">
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <dt className="text-muted">{t("about.version")}</dt>
          <dd className="mt-1 font-medium">v{appConfig.version}</dd>
        </div>
        {info ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <dt className="text-muted">{t("about.system")}</dt>
            <dd className="mt-1 font-medium">
              {info.os} · {info.arch}
            </dd>
          </div>
        ) : null}
      </dl>
      {mismatch ? (
        <p className="mt-4 text-sm text-danger">{t("about.versionMismatch")}</p>
      ) : null}
      {detail ? (
        <div className="mt-4 text-sm">
          <p>{t("about.nativeUnavailable")}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-muted">{t("error.details")}</summary>
            <p className="mt-2 break-words text-muted">{detail}</p>
          </details>
        </div>
      ) : null}
      <div className="mt-6 grid gap-2 text-sm">
        {repositoryUrl ? (
          <button
            type="button"
            className="w-fit text-primary underline"
            onClick={() => {
              void openRepository(repositoryUrl).catch((error: unknown) => {
                setDetail(
                  error instanceof Error ? error.message : "repository open failed",
                );
              });
            }}
          >
            GitHub
          </button>
        ) : (
          <p className="text-muted">{t("about.repositoryUnset")}</p>
        )}
        <p className="text-muted">{t("about.licenseUnset")}</p>
      </div>
    </section>
  );
}

async function openRepository(url: string): Promise<void> {
  const allowed = githubRepositoryUrl(
    appConfig.repositoryOwner,
    appConfig.repositoryName,
  );
  if (url !== allowed) {
    throw new Error("repository open refused");
  }
  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
