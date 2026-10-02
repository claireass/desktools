import { useEffect, type ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { ThemeSync } from "@/components/theme/ThemeSync";
import { requestHydrate } from "@/services/userData";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    void requestHydrate();
  }, []);

  return (
    <BrowserRouter>
      <ThemeSync />
      {children}
    </BrowserRouter>
  );
}
