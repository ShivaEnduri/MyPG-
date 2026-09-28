// import { create } from "zustand";
// import { fetchPgInfoApi } from "../services/api/commonApiServices";
// import type { PgInfo } from "../services/api/commonApiServices";

// /* ===================== STORE ===================== */

// interface PgInfoStore {
//   pgInfoList: PgInfo[];
//   loading: boolean;
//   error: string | null;

//   fetchPgInfo: (params?: Record<string, string | number>) => Promise<void>;
//   resetPgInfo: () => void;
// }

// export const usePgInfoStore = create<PgInfoStore>((set) => ({
//   pgInfoList: [],
//   loading: false,
//   error: null,

//   fetchPgInfo: async (params) => {
//     try {
//       set({ loading: true, error: null });
//       const data = await fetchPgInfoApi(params);
//       set({ pgInfoList: data, loading: false });
//     } catch (err) {
//       set({
//         loading: false,
//         error: "Failed to fetch PG info",
//       });
//     }
//   },

//   resetPgInfo: () => set({ pgInfoList: [] }),
// }));
//commented above code because of fetching pgs without owner id in issues page 

import { create } from "zustand";
import {
  fetchPgInfoApi,
} from "../services/api/commonApiServices";
import type {
  PgInfo,
} from "../services/api/commonApiServices";

interface PgInfoStore {
  pgInfoList: PgInfo[];
  loading: boolean;
  error: string | null;

  fetchPgInfo: (
    params?: Record<string, string | number>,
  ) => Promise<void>;

  resetPgInfo: () => void;
}

export const usePgInfoStore = create<PgInfoStore>(
  (set) => ({
    pgInfoList: [],
    loading: false,
    error: null,

    fetchPgInfo: async (params) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await fetchPgInfoApi(params);

        set({
          pgInfoList: Array.isArray(data)
            ? data
            : [],
          loading: false,
        });
      } catch (err) {
        console.error(
          "FETCH PG INFO ERROR:",
          err,
        );

        set({
          pgInfoList: [],
          loading: false,
          error: "Failed to fetch PG info",
        });
      }
    },

    resetPgInfo: () =>
      set({
        pgInfoList: [],
        loading: false,
        error: null,
      }),
  }),
);