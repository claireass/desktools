import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ShellContext } from "@/components/shell/shellContext";
import { Header } from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { UpdateOffer } from "@/components/update/UpdateOffer";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useI18n } from "@/hooks/useI18n";
import { applyCloseToTray, applyLaunchAtStartup } from "@/services/desktopSession";
import { checkForAppUpdate } from "@/services/desktopUpdate";
import { requestHydrate } from "@/services/userData";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUpdateOfferStore } from "@/stores/updateOfferStore";

export function AppShell() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const status = useSettingsStore((state) => state.status);
  const onboarded = useSettingsStore((state) => state.hasCompletedOnboarding);
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const launchAtStartup = useSettingsStore((state) => state.launchAtStartup);
  const closeToTray = useSettingsStore((state) => state.closeToTray);
  const checkForUpdates = useSettingsStore((state) => state.checkForUpdates);
  const locale = useSettingsStore((state) => state.locale);
  const startupCheckStarted = useRef(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const ready = status.state === "ready" || status.state === "error";
  const showWelcome = status.state === "ready" && !onboarded;
  const desktopReady = status.state === "ready" && status.mode === "desktop";

  useEffect(() => {
    if (!desktopReady) {
      return;
    }
    void applyLaunchAtStartup(launchAtStartup);
  }, [desktopReady, launchAtStartup]);

  useEffect(() => {
    if (!desktopReady) {
      return;
    }
    void applyCloseToTray(closeToTray, { show: t("tray.show"), quit: t("tray.quit") });
  }, [closeToTray, desktopReady, locale, t]);

  useEffect(() => {
    if (!desktopReady || startupCheckStarted.current) {
      return;
    }
    startupCheckStarted.current = true;
    if (!checkForUpdates) {
      return;
    }
    void checkForAppUpdate().then((lookup) => {
      if (lookup.status === "available") {
        useUpdateOfferStore.getState().present(lookup);
      }
    });
  }, [checkForUpdates, desktopReady]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        if (!showWelcome) {
          setSearchOpen(true);
        }
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === ",") {
        event.preventDefault();
        if (!showWelcome) {
          void navigate("/settings");
        }
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "w") {
        if (searchOpen) {
          event.preventDefault();
          setSearchOpen(false);
          return;
        }
        if (location.pathname.startsWith("/tool/")) {
          event.preventDefault();
          void navigate("/");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [location.pathname, navigate, searchOpen, showWelcome]);

  if (!ready) {
    return (
      <div className="grid h-full place-items-center bg-background text-sm text-muted">
        {t("status.loading")}
      </div>
    );
  }

  return (
    <ShellContext.Provider value={{ openSearch, closeSearch }}>
      <div className="flex h-full min-h-0 bg-background text-foreground">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          {status.state === "error" ? (
            <div
              role="alert"
              className="mx-6 mt-4 rounded-xl border border-danger/40 bg-surface px-4 py-3"
            >
              <p className="font-medium">{t("error.persistenceTitle")}</p>
              <p className="mt-1 text-sm text-muted">{t("error.persistenceBody")}</p>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-muted">
                  {t("error.details")}
                </summary>
                <p className="mt-2 break-words text-muted">{status.detail}</p>
              </details>
              <Button
                className="mt-3"
                variant="secondary"
                onClick={() => void requestHydrate(true)}
              >
                {t("error.retry")}
              </Button>
            </div>
          ) : null}
          {status.state === "ready" && status.mode === "session" ? (
            <p className="mx-6 mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
              {t("status.session")}
            </p>
          ) : null}
          <main className="min-h-0 flex-1 overflow-auto px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
      <GlobalSearch open={searchOpen && !showWelcome} onClose={closeSearch} />
      <UpdateOffer />
      <Dialog
        open={showWelcome}
        title={t("welcome.title")}
        onClose={completeOnboarding}
        closeOnEscape={false}
        closeOnBackdrop={false}
      >
        <p className="text-sm leading-6 text-muted">{t("welcome.body")}</p>
        <Button className="mt-5" onClick={completeOnboarding}>
          {t("welcome.start")}
        </Button>
      </Dialog>
    </ShellContext.Provider>
  );
}
