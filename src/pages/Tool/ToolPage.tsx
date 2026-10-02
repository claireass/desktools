import { useEffect, useState, type ComponentType } from "react";
import { SearchX } from "lucide-react";
import { useParams } from "react-router";
import { EmptyState } from "@/components/ui/EmptyState";
import { useI18n } from "@/hooks/useI18n";
import { isMessageKey } from "@/i18n/translate";
import { getToolById, type ToolDefinition } from "@/services/toolRegistry";
import { useRecentStore } from "@/stores/recentStore";

const loadedTools = new Map<string, ComponentType>();

export function ToolPage() {
  const { t } = useI18n();
  const { toolId = "" } = useParams();
  const tool = getToolById(toolId);
  const record = useRecentStore((state) => state.record);

  useEffect(() => {
    if (tool) {
      record(tool.id);
    }
  }, [record, tool]);

  if (!tool) {
    return (
      <EmptyState
        icon={SearchX}
        title={t("tool.notFoundTitle")}
        body={t("tool.notFoundBody")}
      />
    );
  }

  const name = isMessageKey(tool.nameKey) ? t(tool.nameKey) : tool.nameKey;
  const description = isMessageKey(tool.descriptionKey)
    ? t(tool.descriptionKey)
    : tool.descriptionKey;

  return (
    <section>
      <h1 className="text-2xl font-semibold">{name}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      ) : null}
      <LoadedTool tool={tool} />
    </section>
  );
}

function LoadedTool({ tool }: { tool: ToolDefinition }) {
  /* Tool modules are cached when the import resolves. The lookup does not create a component. */
  /* eslint-disable react-hooks/static-components */
  const { t } = useI18n();
  const [version, setVersion] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const View = loadedTools.get(tool.id);

  useEffect(() => {
    if (loadedTools.has(tool.id)) {
      return;
    }

    let active = true;
    void tool
      .load()
      .then((module) => {
        loadedTools.set(tool.id, module.default);
        if (active) {
          setVersion((current) => current + 1);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setDetail(error instanceof Error ? error.message : "tool load failed");
        }
      });

    return () => {
      active = false;
    };
  }, [tool]);

  if (detail) {
    return (
      <div className="mt-4 text-sm" role="alert">
        <p>{t("tool.loadFailed")}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-muted">{t("error.details")}</summary>
          <p className="mt-2 break-words text-muted">{detail}</p>
        </details>
      </div>
    );
  }

  if (!View) {
    return <p className="mt-4 text-sm text-muted">{t("tool.loading")}</p>;
  }

  return (
    <div className="mt-4" data-tool-load={version}>
      <View />
    </div>
  );
}
/* eslint-enable react-hooks/static-components */
