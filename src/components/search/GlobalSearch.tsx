import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Kbd } from "@/components/ui/Kbd";
import { categoryMessageKeys } from "@/constants/categories";
import { useI18n } from "@/hooks/useI18n";
import { isMessageKey } from "@/i18n/translate";
import { tools } from "@/services/toolRegistry";
import { searchTools, type SearchableTool } from "@/services/toolSearch";

type GlobalSearchProps = {
  open: boolean;
  onClose: () => void;
};

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  if (!open) {
    return null;
  }

  return <SearchDialog onClose={onClose} />;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const catalog = useMemo<SearchableTool[]>(
    () =>
      tools.map((tool) => ({
        id: tool.id,
        name: isMessageKey(tool.nameKey) ? t(tool.nameKey) : tool.nameKey,
        description: isMessageKey(tool.descriptionKey)
          ? t(tool.descriptionKey)
          : tool.descriptionKey,
        category: tool.category,
        categoryLabel: t(categoryMessageKeys[tool.category].name),
        tags: [...tool.tags],
      })),
    [t],
  );

  const results = useMemo(() => searchTools(catalog, query), [catalog, query]);

  const openTool = (id: string) => {
    onClose();
    void navigate(`/tool/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("search.label")}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow)]"
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          placeholder={t("search.placeholder")}
          aria-label={t("search.label")}
          className="h-12 w-full border-b border-border bg-transparent px-4 text-sm outline-none"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onClose();
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setSelected((current) =>
                Math.min(current + 1, Math.max(results.length - 1, 0)),
              );
              return;
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setSelected((current) => Math.max(current - 1, 0));
              return;
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const tool = results[selected];
              if (tool) {
                openTool(tool.id);
              }
            }
          }}
        />
        <ul
          role="listbox"
          aria-label={t("search.label")}
          className="max-h-80 overflow-y-auto p-2"
        >
          {catalog.length === 0 ? (
            <li className="px-3 py-6 text-sm text-muted">{t("search.noTools")}</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-6 text-sm text-muted">{t("search.empty")}</li>
          ) : (
            results.map((tool, index) => (
              <li key={tool.id} role="option" aria-selected={index === selected}>
                <button
                  type="button"
                  className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left ${index === selected ? "bg-secondary" : "hover:bg-background"}`}
                  onMouseEnter={() => setSelected(index)}
                  onClick={() => openTool(tool.id)}
                >
                  <span className="text-sm font-medium">{tool.name}</span>
                  <span className="text-xs text-muted">
                    {tool.categoryLabel}
                    {tool.description ? ` · ${tool.description}` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center gap-2 border-t border-border px-4 py-2 text-xs text-muted">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
          <span>{t("search.hint")}</span>
        </div>
      </div>
    </div>
  );
}
