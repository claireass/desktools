import { Link } from "react-router";
import { categoryIcons } from "@/components/icons/categoryIcons";
import { appConfig } from "@/constants/appConfig";
import { categoryIds, categoryMessageKeys } from "@/constants/categories";
import { useI18n } from "@/hooks/useI18n";

export function HomePage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-full flex-col">
      <h1 className="text-3xl font-semibold tracking-tight">{appConfig.name}</h1>
      <p className="mt-2 max-w-xl text-muted">{t("app.tagline")}</p>

      <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted">
        {t("home.categories")}
      </h2>
      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {categoryIds.map((categoryId) => {
          const Icon = categoryIcons[categoryId];
          const copy = categoryMessageKeys[categoryId];
          return (
            <Link
              key={categoryId}
              to={`/category/${categoryId}`}
              className="rounded-2xl border border-border bg-surface p-4 hover:border-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="mt-4 block font-semibold">{t(copy.name)}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">
                {t(copy.description)}
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-8 text-right text-sm text-muted">v{appConfig.version}</p>
    </div>
  );
}
