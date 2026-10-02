import { Star } from "lucide-react";
import { Link } from "react-router";
import { categoryIcons } from "@/components/icons/categoryIcons";
import { categoryMessageKeys } from "@/constants/categories";
import { useI18n } from "@/hooks/useI18n";
import { isMessageKey } from "@/i18n/translate";
import type { ToolDefinition } from "@/services/toolRegistry";
import { useFavoritesStore } from "@/stores/favoritesStore";

type ToolCardProps = {
  tool: ToolDefinition;
};

export function ToolCard({ tool }: ToolCardProps) {
  const { t } = useI18n();
  const favorite = useFavoritesStore((state) => state.ids.includes(tool.id));
  const toggle = useFavoritesStore((state) => state.toggle);
  const Icon = categoryIcons[tool.category];
  const name = isMessageKey(tool.nameKey) ? t(tool.nameKey) : tool.nameKey;
  const description = isMessageKey(tool.descriptionKey)
    ? t(tool.descriptionKey)
    : tool.descriptionKey;

  return (
    <article className="relative flex gap-3 rounded-2xl border border-border bg-surface p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <Link to={`/tool/${tool.id}`} className="text-sm font-semibold hover:underline">
          {name}
        </Link>
        <p className="mt-1 text-xs text-muted">
          {t(categoryMessageKeys[tool.category].name)}
        </p>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-pressed={favorite}
        aria-label={favorite ? t("tool.favoriteRemove") : t("tool.favoriteAdd")}
        className="absolute top-3 right-3 rounded-md p-1 text-muted hover:text-foreground"
        onClick={() => toggle(tool.id)}
      >
        <Star
          aria-hidden="true"
          className={`size-4 ${favorite ? "fill-current text-warning" : ""}`}
        />
      </button>
    </article>
  );
}
