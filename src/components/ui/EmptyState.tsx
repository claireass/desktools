import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function EmptyState({ icon: Icon, title, body }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-8">
      <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
