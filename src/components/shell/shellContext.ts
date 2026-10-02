import { createContext, useContext } from "react";

type ShellContextValue = {
  openSearch: () => void;
  closeSearch: () => void;
};

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const value = useContext(ShellContext);
  if (!value) {
    throw new Error("useShell must be used within AppShell");
  }
  return value;
}
