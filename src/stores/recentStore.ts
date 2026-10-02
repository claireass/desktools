import { create } from "zustand";
import { logError } from "@/services/logger";
import { writeRecent } from "@/services/persistence";
import { recordRecent, type RecentEntry } from "@/services/recent";
import { useSettingsStore } from "@/stores/settingsStore";

type RecentState = {
  entries: RecentEntry[];
  applyLoaded: (entries: RecentEntry[]) => void;
  record: (toolId: string) => void;
};

export const useRecentStore = create<RecentState>((set, get) => ({
  entries: [],
  applyLoaded: (entries) => {
    set({ entries });
  },
  record: (toolId) => {
    const entries = recordRecent(get().entries, toolId, Date.now());
    set({ entries });
    void writeRecent(entries).catch(async (error: unknown) => {
      const detail = error instanceof Error ? error.message : "recent write failed";
      useSettingsStore.getState().applyError(detail);
      await logError(`Recent write failed: ${detail}`);
    });
  },
}));
