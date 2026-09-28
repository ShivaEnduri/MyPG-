import { create } from "zustand";
import {
  getPgCurrentStatus,
  PgCurrentStatus,
} from "../services/api/commonApiServices";

interface PgCurrentStatusStore {
  statuses: PgCurrentStatus[];
  loading: boolean;

  fetchStatuses: (params?: Record<string, any>) => Promise<void>;
}

export const usePgCurrentStatusStore = create<PgCurrentStatusStore>((set) => ({
  statuses: [],
  loading: false,

  fetchStatuses: async (params) => {
    set({ loading: true });
    try {
      const res = await getPgCurrentStatus(params);
      set({ statuses: res.data?.result || [] });
    } catch (error) {
      console.error("Failed to fetch PG current status", error);
    } finally {
      set({ loading: false });
    }
  },
}));
