import { create } from "zustand";

import { fetchManagerDashboardApi } from "@/app/shared/services/api/commonApiServices";
import type {
  ManagerDashboardResponse,
} from "@/app/shared/services/api/commonApiServices";

interface ManagerDashboardState {
  managerDashboard: ManagerDashboardResponse | null;
  loading: boolean;
  error: string | null;

  fetchManagerDashboard: (pgId: number) => Promise<void>;
  clearManagerDashboard: () => void;
}

export const useManagerDashboardStore = create<ManagerDashboardState>(
  (set) => ({
    managerDashboard: null,
    loading: false,
    error: null,

    fetchManagerDashboard: async (pgId: number) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await fetchManagerDashboardApi(pgId);

        set({
          managerDashboard: data,
          loading: false,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch manager dashboard:",
          error
        );

        set({
          managerDashboard: null,
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch manager dashboard",
        });
      }
    },

    clearManagerDashboard: () => {
      set({
        managerDashboard: null,
        loading: false,
        error: null,
      });
    },
  })
);