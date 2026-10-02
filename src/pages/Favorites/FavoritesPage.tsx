import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "@/components/tool-card/ToolCard";
import { useI18n } from "@/hooks/useI18n";
import { orderByIds } from "@/services/favorites";
import { tools } from "@/services/toolRegistry";
import { useFavoritesStore } from "@/stores/favoritesStore";

export function FavoritesPage() {
  const { t } = useI18n();
  const ids = useFavoritesStore((state) => state.ids);
  const favoriteTools = orderByIds(ids, tools);

  return (
    <section>
      <h1 className="text-2xl font-semibold">{t("favorites.title")}</h1>
      {favoriteTools.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Star}
            title={t("favorites.emptyTitle")}
            body={t("favorites.emptyBody")}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
