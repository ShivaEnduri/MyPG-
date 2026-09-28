import { create } from "zustand";
import {
  fetchPgDescriptions,
  PgDescription,
} from "../services/api/commonApiServices";

interface PgDescriptionState {
  descriptions: PgDescription[];
  loading: boolean;
  error: string | null;
  fetchDescriptions: () => Promise<void>;
}

export const usePgDescriptionStore = create<PgDescriptionState>((set) => ({
  descriptions: [],
  loading: false,
  error: null,

  fetchDescriptions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPgDescriptions();
      set({ descriptions: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch PG Descriptions", err);
      set({
        loading: false,
        error: "Unable to load PG descriptions",
      });
    }
  },
}));
