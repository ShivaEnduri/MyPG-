import { create } from "zustand";
import {
  fetchServiceRequestsApi,
  ServiceRequestRecord,
} from "@/app/shared/services/api/commonApiServices";

interface ServiceRequestsState {
  data: ServiceRequestRecord[];
  loading: boolean;
  error: string | null;
  currentPgId: number | null;

  fetchServiceRequests: (pgId: number) => Promise<void>;
  clearServiceRequests: () => void;
}

export const useServiceRequestsStore =
  create<ServiceRequestsState>((set) => ({
    data: [],
    loading: false,
    error: null,
    currentPgId: null,

    fetchServiceRequests: async (pgId: number) => {
      if (!Number.isFinite(pgId) || pgId <= 0) {
        return;
      }

      set({
        loading: true,
        error: null,
        currentPgId: pgId,
      });

      try {
        const data = await fetchServiceRequestsApi(pgId);

        set({
          data: Array.isArray(data) ? data : [],
          loading: false,
          error: null,
          currentPgId: pgId,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch service requests:",
          error,
        );

        set({
          data: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch service requests",
          currentPgId: pgId,
        });
      }
    },

    clearServiceRequests: () => {
      set({
        data: [],
        loading: false,
        error: null,
        currentPgId: null,
      });
    },
  }));