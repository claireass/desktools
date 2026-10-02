import { create } from "zustand";
import { dismissPendingUpdate, installPendingUpdate } from "@/services/desktopUpdate";
import type { ReleaseLookup } from "@/services/githubRelease";

type UpdateOfferState = {
  lookup: ReleaseLookup | null;
  installing: boolean;
  present: (lookup: ReleaseLookup) => void;
  decline: () => void;
  install: () => Promise<void>;
};

export const useUpdateOfferStore = create<UpdateOfferState>((set, get) => ({
  lookup: null,
  installing: false,
  present: (lookup) => {
    set({ lookup, installing: false });
  },
  decline: () => {
    if (get().installing) {
      return;
    }
    void dismissPendingUpdate();
    set({ lookup: null });
  },
  install: async () => {
    set({ installing: true });
    const lookup = await installPendingUpdate();
    set({ lookup, installing: false });
  },
}));
