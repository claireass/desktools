export function ToolIntro({ children }: { children: string }) {
  return <p className="max-w-2xl text-sm leading-6 text-muted">{children}</p>;
}

export const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground";
