import { create } from "zustand";
import {
  fetchAlertCategoriesApi,
  AlertCategory,
} from "../services/api/commonApiServices";

interface AlertMasterStore {
  alertCategories: AlertCategory[];
  fetchAlertCategories: () => Promise<void>;
}

export const useAlertMasterStore = create<AlertMasterStore>((set) => ({
  alertCategories: [],

  fetchAlertCategories: async () => {
    try {
      const data = await fetchAlertCategoriesApi();
      set({ alertCategories: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Failed to fetch alert categories", error);
      set({ alertCategories: [] });
    }
  },
}));
