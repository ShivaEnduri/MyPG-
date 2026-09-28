import { create } from "zustand";

import {
  fetchResidentRentStatusApi,
  ResidentRentStatusData,
} from "../services/api/residentApiServices";

interface ResidentRentStatusStore {
  data: ResidentRentStatusData | null;

  loading: boolean;
  error: string | null;

  fetchResidentRentStatus: (
    queryParams?: Record<string, string | number>
  ) => Promise<void>;

  clearResidentRentStatus: () => void;
}

export const useResidentRentStatusStore =
  create<ResidentRentStatusStore>((set) => ({
    data: null,

    loading: false,
    error: null,

    fetchResidentRentStatus: async (queryParams) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const data = await fetchResidentRentStatusApi(queryParams);

        set({
          data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch resident rent status:",
          error
        );

        set({
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch resident rent status",
        });
      }
    },

    clearResidentRentStatus: () => {
      set({
        data: null,
        loading: false,
        error: null,
      });
    },
  }));