import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted">
      {children}
    </kbd>
  );
}
