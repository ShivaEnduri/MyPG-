


// import { create } from "zustand";
// import { getPgBedInfo, PgBedInfo } from "../services/api/commonApiServices";

// interface PgBedInfoStore {
//   bedInfoList: PgBedInfo[];
//   loading: boolean;
//   fetchBedInfo: (params?: Record<string, any>) => Promise<void>;
// }

// export const usePgBedInfoStore = create<PgBedInfoStore>((set) => ({
//   bedInfoList: [],
//   loading: false,

//   fetchBedInfo: async (params = {}) => {
//   // ✅ Clear previous PG's beds immediately before fetching
//   set({ loading: true, bedInfoList: [] });
//   try {
//     const res = await getPgBedInfo({ ...params });
//     console.log("API:", res.data.result);
   
//     set({ bedInfoList: res.data?.result || [] });
//   } catch (error) {
//     console.error("Failed to fetch bed info", error);
//   } finally {
//     set({ loading: false });
//   }
// },
// }));


import { create } from "zustand";
import {
  getPgBedInfo,
  PgBedInfo,
} from "../services/api/commonApiServices";

interface PgBedInfoStore {
  bedInfoList: PgBedInfo[];
  loading: boolean;
  error: string | null;

  fetchBedInfo: (
    params?: Record<string, any>
  ) => Promise<void>;

  reset: () => void;
}

export const usePgBedInfoStore =
  create<PgBedInfoStore>((set) => ({
    bedInfoList: [],
    loading: false,
    error: null,

    fetchBedInfo: async (params = {}) => {
      set({
        loading: true,
        error: null,
        bedInfoList: [],
      });

      try {
        const res = await getPgBedInfo({
          ...params,
        });

        set({
          bedInfoList: res.data?.result || [],
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch bed info:",
          error
        );

        set({
          bedInfoList: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load bed information",
        });
      }
    },

    reset: () => {
      set({
        bedInfoList: [],
        loading: false,
        error: null,
      });
    },
  }));