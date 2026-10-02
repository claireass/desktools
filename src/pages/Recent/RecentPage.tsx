import { Clock3 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "@/components/tool-card/ToolCard";
import { useI18n } from "@/hooks/useI18n";
import { orderByIds } from "@/services/favorites";
import { tools } from "@/services/toolRegistry";
import { useRecentStore } from "@/stores/recentStore";

export function RecentPage() {
  const { t } = useI18n();
  const entries = useRecentStore((state) => state.entries);
  const recentTools = orderByIds(
    entries.map((entry) => entry.id),
    tools,
  );

  return (
    <section>
      <h1 className="text-2xl font-semibold">{t("recent.title")}</h1>
      {recentTools.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Clock3}
            title={t("recent.emptyTitle")}
            body={t("recent.emptyBody")}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {recentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
