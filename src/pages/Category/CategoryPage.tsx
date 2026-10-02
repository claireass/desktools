import { FolderOpen } from "lucide-react";
import { useParams } from "react-router";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "@/components/tool-card/ToolCard";
import { categoryMessageKeys } from "@/constants/categories";
import { useI18n } from "@/hooks/useI18n";
import { getToolsByCategory } from "@/services/toolRegistry";
import { isToolCategory } from "@/types/tool";

export function CategoryPage() {
  const { t } = useI18n();
  const { categoryId = "" } = useParams();

  if (!isToolCategory(categoryId)) {
    return (
      <EmptyState
        icon={FolderOpen}
        title={t("category.notFound")}
        body={t("category.emptyBody")}
      />
    );
  }

  const categoryTools = getToolsByCategory(categoryId);
  const copy = categoryMessageKeys[categoryId];

  return (
    <section>
      <h1 className="text-2xl font-semibold">{t(copy.name)}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{t(copy.description)}</p>
      {categoryTools.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={FolderOpen}
            title={t("category.emptyTitle")}
            body={t("category.emptyBody")}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
