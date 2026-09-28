
import { create } from "zustand";

import {
  fetchResidentDashboardApi,
  type ResidentDashboardResponse,
} from "@/app/shared/services/api/residentApiServices";

interface ResidentDashboardState {
  dashboard: ResidentDashboardResponse | null;
  loading: boolean;
  error: string | null;

  fetchDashboard: (
    userId: number
  ) => Promise<void>;

  clearDashboard: () => void;
}

export const useResidentDashboardStore =
  create<ResidentDashboardState>((set) => ({
    dashboard: null,
    loading: false,
    error: null,

    fetchDashboard: async (
      userId: number
    ) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data =
          await fetchResidentDashboardApi(
            userId
          );

        console.log(
          "RESIDENT DASHBOARD DATA:",
          data
        );

        set({
          dashboard: data,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error(
          "FETCH RESIDENT DASHBOARD ERROR:",
          err
        );

        set({
          dashboard: null,
          loading: false,
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch resident dashboard",
        });
      }
    },

    clearDashboard: () =>
      set({
        dashboard: null,
        loading: false,
        error: null,
      }),
  }));

