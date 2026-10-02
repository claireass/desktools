import { Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { useShell } from "@/components/shell/shellContext";
import { useI18n } from "@/hooks/useI18n";

export function Header() {
  const { t } = useI18n();
  const { openSearch } = useShell();

  return (
    <header className="flex items-center justify-end border-b border-border px-4 py-3">
      <button
        type="button"
        onClick={openSearch}
        className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm text-muted"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="flex-1">{t("search.placeholder")}</span>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </button>
    </header>
  );
}
