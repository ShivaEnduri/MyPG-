import { create } from "zustand";
import { fetchPgTypes, PgType } from "../services/api/ownerApiServices";

interface PgTypeState {
  pgTypes: PgType[];
  loading: boolean;
  error: string | null;
  fetchPgTypes: () => Promise<void>;
}

export const usePgTypeStore = create<PgTypeState>((set) => ({
  pgTypes: [],
  loading: false,
  error: null,

  fetchPgTypes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPgTypes();
      set({ pgTypes: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch PG Types", err);
      set({ loading: false, error: "Unable to load PG Types" });
    }
  },
}));
