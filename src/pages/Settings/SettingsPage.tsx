import { useState } from "react";
import { appConfig } from "@/constants/appConfig";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/hooks/useI18n";
import { checkForAppUpdate } from "@/services/desktopUpdate";
import { describeUpdatePreference } from "@/services/desktopPreferences";
import { githubRepositoryUrl, type ReleaseLookup } from "@/services/githubRelease";
import { useSettingsStore } from "@/stores/settingsStore";
import { locales, themes, type Locale, type Theme } from "@/types/settings";

export function SettingsPage() {
  const { t } = useI18n();
  const theme = useSettingsStore((state) => state.theme);
  const locale = useSettingsStore((state) => state.locale);
  const launchAtStartup = useSettingsStore((state) => state.launchAtStartup);
  const closeToTray = useSettingsStore((state) => state.closeToTray);
  const checkForUpdates = useSettingsStore((state) => state.checkForUpdates);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLocale = useSettingsStore((state) => state.setLocale);
  const setLaunchAtStartup = useSettingsStore((state) => state.setLaunchAtStartup);
  const setCloseToTray = useSettingsStore((state) => state.setCloseToTray);
  const setCheckForUpdates = useSettingsStore((state) => state.setCheckForUpdates);
  const updates = describeUpdatePreference(checkForUpdates, appConfig.repositoryOwner);
  const repositoryUrl =
    githubRepositoryUrl(appConfig.repositoryOwner, appConfig.repositoryName) ?? "";
  const [checking, setChecking] = useState(false);
  const [lookup, setLookup] = useState<ReleaseLookup | null>(null);

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">{t("settings.appearance")}</legend>
        <p className="mt-3 text-sm text-muted">{t("settings.theme")}</p>
        <div
          className="mt-2 grid gap-2"
          role="radiogroup"
          aria-label={t("settings.theme")}
        >
          {themes.map((value) => (
            <ThemeOption
              key={value}
              value={value}
              current={theme}
              onSelect={setTheme}
              label={t(`settings.theme.${value}`)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold">{t("settings.language")}</legend>
        <div
          className="mt-3 grid gap-2"
          role="radiogroup"
          aria-label={t("settings.language")}
        >
          {locales.map((value) => (
            <LanguageOption
              key={value}
              value={value}
              current={locale}
              onSelect={setLocale}
              label={t(`settings.language.${value}`)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold">{t("settings.desktop")}</legend>
        <p className="mt-3 text-sm text-muted">{t("settings.desktop.note")}</p>
        <div className="mt-3 grid gap-2">
          <CheckOption
            name="launch-at-startup"
            checked={launchAtStartup}
            onChange={setLaunchAtStartup}
            label={t("settings.launchAtStartup")}
          />
          <CheckOption
            name="close-to-tray"
            checked={closeToTray}
            onChange={setCloseToTray}
            label={t("settings.closeToTray")}
          />
          <CheckOption
            name="check-for-updates"
            checked={checkForUpdates}
            onChange={setCheckForUpdates}
            label={t("settings.checkForUpdates")}
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          {t("settings.updateChannel")} {appConfig.updateChannel}
        </p>
        <p className="mt-2 text-sm" role="status">
          {t(
            updates === "off"
              ? "settings.updates.off"
              : updates === "noRepository"
                ? "settings.updates.noRepository"
                : "settings.updates.inactive",
          )}
        </p>
        {updates === "inactive" && repositoryUrl ? (
          <div className="mt-3 grid gap-3">
            <p className="break-all text-sm text-muted">{repositoryUrl}</p>
            <Button
              variant="secondary"
              disabled={checking}
              onClick={() => {
                setChecking(true);
                setLookup(null);
                void checkForAppUpdate()
                  .then(setLookup)
                  .finally(() => setChecking(false));
              }}
            >
              {checking ? t("settings.updates.checking") : t("settings.updates.check")}
            </Button>
            {lookup ? <ReleaseResult lookup={lookup} /> : null}
          </div>
        ) : null}
      </fieldset>
    </section>
  );
}

function ReleaseResult({ lookup }: { lookup: ReleaseLookup }) {
  const { t } = useI18n();
  const summary =
    lookup.status === "available"
      ? `${t("settings.updates.available")} v${lookup.version}`
      : lookup.status === "installed"
        ? `${t("settings.updates.installed")} v${lookup.version}`
        : t(`settings.updates.${lookup.status}`);

  return (
    <div className="text-sm" role="status">
      <p>{summary}</p>
      {lookup.status === "failed" ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-muted">{t("error.details")}</summary>
          <p className="mt-2 break-words text-muted">{lookup.detail}</p>
        </details>
      ) : null}
    </div>
  );
}

function CheckOption({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function ThemeOption({
  value,
  current,
  onSelect,
  label,
}: {
  value: Theme;
  current: Theme;
  onSelect: (theme: Theme) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
      <input
        type="radio"
        name="theme"
        value={value}
        checked={current === value}
        onChange={() => onSelect(value)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function LanguageOption({
  value,
  current,
  onSelect,
  label,
}: {
  value: Locale;
  current: Locale;
  onSelect: (locale: Locale) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
      <input
        type="radio"
        name="locale"
        value={value}
        checked={current === value}
        onChange={() => onSelect(value)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
