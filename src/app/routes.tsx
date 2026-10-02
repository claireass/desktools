import { Route, Routes } from "react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AboutPage } from "@/pages/About/AboutPage";
import { CategoryPage } from "@/pages/Category/CategoryPage";
import { FavoritesPage } from "@/pages/Favorites/FavoritesPage";
import { HomePage } from "@/pages/Home/HomePage";
import { RecentPage } from "@/pages/Recent/RecentPage";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { ToolPage } from "@/pages/Tool/ToolPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="recent" element={<RecentPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="tool/:toolId" element={<ToolPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
