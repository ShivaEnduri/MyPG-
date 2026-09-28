import { create } from "zustand";

import {
  CheckinCheckoutResponse,
  fetchCheckinCheckoutApi,
} from "@/app/shared/services/api/managerApiServices";

interface CheckinCheckoutStore {
  data: CheckinCheckoutResponse | null;
  loading: boolean;
  error: string | null;

  fetchCheckinCheckout: (pgId: number) => Promise<void>;
  clearCheckinCheckout: () => void;
}

export const useCheckinCheckoutStore = create<CheckinCheckoutStore>(
  (set) => ({
    data: null,
    loading: false,
    error: null,

    fetchCheckinCheckout: async (pgId: number) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await fetchCheckinCheckoutApi(pgId);

        set({
          data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        set({
          data: null,
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch check-in/check-out data",
        });
      }
    },

    clearCheckinCheckout: () => {
      set({
        data: null,
        loading: false,
        error: null,
      });
    },
  })
);