import {
  Clock3,
  House,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Star,
} from "lucide-react";
import { NavLink } from "react-router";
import { BrandMark } from "@/components/brand/BrandMark";
import { categoryIcons } from "@/components/icons/categoryIcons";
import { categoryIds, categoryMessageKeys } from "@/constants/categories";
import { useI18n } from "@/hooks/useI18n";
import { appConfig } from "@/constants/appConfig";
import { useSettingsStore } from "@/stores/settingsStore";

function itemClass(active: boolean, collapsed: boolean): string {
  const layout = collapsed ? "justify-center px-2" : "gap-3 px-3";
  const state = active
    ? "bg-secondary text-secondary-foreground"
    : "text-foreground hover:bg-background";
  return `flex h-10 items-center rounded-lg text-sm font-medium ${layout} ${state}`;
}

export function Sidebar() {
  const { t } = useI18n();
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);
  const setCollapsed = useSettingsStore((state) => state.setSidebarCollapsed);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-border bg-sidebar ${collapsed ? "w-[4.5rem]" : "w-60"}`}
    >
      <div
        className={`flex items-center gap-3 px-3 py-4 ${collapsed ? "justify-center" : ""}`}
      >
        <BrandMark />
        {collapsed ? null : (
          <span className="text-base font-semibold">{appConfig.name}</span>
        )}
      </div>

      <nav
        aria-label={t("nav.label")}
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) => itemClass(isActive, collapsed)}
          title={collapsed ? t("nav.home") : undefined}
        >
          <House aria-hidden="true" className="size-4 shrink-0" />
          {collapsed ? <span className="sr-only">{t("nav.home")}</span> : t("nav.home")}
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => itemClass(isActive, collapsed)}
          title={collapsed ? t("nav.favorites") : undefined}
        >
          <Star aria-hidden="true" className="size-4 shrink-0" />
          {collapsed ? (
            <span className="sr-only">{t("nav.favorites")}</span>
          ) : (
            t("nav.favorites")
          )}
        </NavLink>
        <NavLink
          to="/recent"
          className={({ isActive }) => itemClass(isActive, collapsed)}
          title={collapsed ? t("nav.recent") : undefined}
        >
          <Clock3 aria-hidden="true" className="size-4 shrink-0" />
          {collapsed ? (
            <span className="sr-only">{t("nav.recent")}</span>
          ) : (
            t("nav.recent")
          )}
        </NavLink>

        <p
          className={`px-3 pb-1 pt-4 text-xs font-semibold tracking-wide text-muted ${collapsed ? "sr-only" : ""}`}
        >
          {t("nav.tools")}
        </p>
        {categoryIds.map((categoryId) => {
          const Icon = categoryIcons[categoryId];
          const label = t(categoryMessageKeys[categoryId].name);
          return (
            <NavLink
              key={categoryId}
              to={`/category/${categoryId}`}
              className={({ isActive }) => itemClass(isActive, collapsed)}
              title={collapsed ? label : undefined}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {collapsed ? <span className="sr-only">{label}</span> : label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => itemClass(isActive, collapsed)}
          title={collapsed ? t("nav.settings") : undefined}
        >
          <Settings aria-hidden="true" className="size-4 shrink-0" />
          {collapsed ? (
            <span className="sr-only">{t("nav.settings")}</span>
          ) : (
            t("nav.settings")
          )}
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => itemClass(isActive, collapsed)}
          title={collapsed ? t("nav.about") : undefined}
        >
          <Info aria-hidden="true" className="size-4 shrink-0" />
          {collapsed ? <span className="sr-only">{t("nav.about")}</span> : t("nav.about")}
        </NavLink>
        <button
          type="button"
          className={itemClass(false, collapsed)}
          aria-pressed={collapsed}
          aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" className="size-4" />
          ) : (
            <>
              <PanelLeftClose aria-hidden="true" className="size-4" />
              {t("nav.collapse")}
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
