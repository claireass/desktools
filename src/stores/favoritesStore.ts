import { create } from "zustand";
import { toggleFavorite } from "@/services/favorites";
import { logError } from "@/services/logger";
import { writeFavorites } from "@/services/persistence";
import { useSettingsStore } from "@/stores/settingsStore";

type FavoritesState = {
  ids: string[];
  applyLoaded: (ids: string[]) => void;
  toggle: (toolId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  applyLoaded: (ids) => {
    set({ ids });
  },
  toggle: (toolId) => {
    const ids = toggleFavorite(get().ids, toolId);
    set({ ids });
    void writeFavorites(ids).catch(async (error: unknown) => {
      const detail = error instanceof Error ? error.message : "favorites write failed";
      useSettingsStore.getState().applyError(detail);
      await logError(`Favorites write failed: ${detail}`);
    });
  },
}));
