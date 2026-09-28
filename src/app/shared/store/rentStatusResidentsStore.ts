import { create } from "zustand";
import {
  fetchRentStatusResidentsApi,
  RentStatusResident,
} from "@/app/shared/services/api/ownerApiServices";

interface RentStatusResidentsState {
  residents: RentStatusResident[];
  loading: boolean;
  error: string | null;

  fetchResidents: (pgId: number) => Promise<void>;
  clearResidents: () => void;
}

export const useRentStatusResidentsStore =
  create<RentStatusResidentsState>((set) => ({
    residents: [],
    loading: false,
    error: null,

    fetchResidents: async (pgId) => {
      if (!pgId) {
        set({
          residents: [],
          loading: false,
          error: null,
        });
        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        const data = await fetchRentStatusResidentsApi(pgId);

        set({
          residents: data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        set({
          residents: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            "Failed to fetch rent status residents",
        });
      }
    },

    clearResidents: () => {
      set({
        residents: [],
        loading: false,
        error: null,
      });
    },
  }));