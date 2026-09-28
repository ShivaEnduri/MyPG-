import { create } from "zustand";

import {
  getPgGuestTypes,
  PgGuestType,
} from "../services/api/commonApiServices";

interface PgGuestTypeStore {
  guestTypes: PgGuestType[];
  loading: boolean;

  fetchGuestTypes: (
    params?: Record<string, any>
  ) => Promise<void>;
}

export const usePgGuestTypeStore =
  create<PgGuestTypeStore>((set) => ({
    guestTypes: [],
    loading: false,

    fetchGuestTypes: async (params) => {
      set({
        loading: true,
      });

      try {
        const res =
          await getPgGuestTypes(params);

        const result =
          res?.data?.result;

        set({
          guestTypes: Array.isArray(result)
            ? result
            : [],
        });
      } catch (error) {
        console.error(
          "Failed to fetch guest types:",
          error
        );

        set({
          guestTypes: [],
        });
      } finally {
        set({
          loading: false,
        });
      }
    },
  }));