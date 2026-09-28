// src/shared/store/pgCategoryStore.ts
import { create } from "zustand";
import { fetchPgCategories, PgCategory } from "../services/api/commonApiServices";

interface PgCategoryStore {
  categories: PgCategory[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
}

export const usePgCategoryStore = create<PgCategoryStore>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await fetchPgCategories();
      set({ categories: data });
    } finally {
      set({ loading: false });
    }
  },
}));
