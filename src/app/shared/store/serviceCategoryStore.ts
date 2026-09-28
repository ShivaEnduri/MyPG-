// pgServiceCategoryStore.ts (fixed version)
import { create } from "zustand";
import {
  getServiceCategories,
  ServiceCategory,
} from "@/app/shared/services/api/commonApiServices";

interface PgServiceCategoryStore {
  categories: ServiceCategory[];
  loading: boolean;

  fetchServiceCategories: (query?: Record<string, any>) => Promise<void>;
  clearCategories: () => void;
}

export const usePgServiceCategoryStore = create<PgServiceCategoryStore>((set) => ({
  categories: [],
  loading: false,

  fetchServiceCategories: async (query) => {
    set({ loading: true });
    try {
      const res = await getServiceCategories(query);

      // Support both direct-array and wrapped response shapes.
      const response = res as unknown as {
        data?: ServiceCategory[] | { result?: ServiceCategory[] };
        result?: ServiceCategory[];
      };
      const categoryList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.result)
        ? response.data.result
        : Array.isArray(response.result)
        ? response.result
        : [];

     
      set({
        categories: categoryList,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch service categories", err);
      set({ loading: false, categories: [] });
    }
  },

  clearCategories: () => set({ categories: [] }),
}));