// import { create } from "zustand";
// import { getPgStates, getPgCities } from "../services/api/commonApiServices";
// import type { PgState, PgCity } from "../services/api/commonApiServices";

// interface PgLocationStore {
//   states: PgState[];
//   cities: PgCity[];
//   loading: boolean;

//   fetchStates: () => Promise<void>;
//   fetchCities: () => Promise<void>;
// }

// export const usePgLocationStore = create<PgLocationStore>((set) => ({
//   states: [],
//   cities: [],
//   loading: false,

//   fetchStates: async () => {
//     set({ loading: true });
//     try {
//       const res = await getPgStates();
//       set({ states: res.data?.result || [] });
//     } catch (error) {
//       console.error("Failed to fetch states", error);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchCities: async () => {
//     set({ loading: true });
//     try {
//       const res = await getPgCities();
//       set({ cities: res.data?.result || [] });
//     } catch (error) {
//       console.error("Failed to fetch cities", error);
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));


import { create } from "zustand";
import { getPgStates, getPgCities } from "../services/api/commonApiServices";
import type { PgState, PgCity } from "../services/api/commonApiServices";

interface PgLocationStore {
  states: PgState[];
  cities: PgCity[];
  loading: boolean;

  fetchStates: () => Promise<void>;
  fetchCities: (stateId: number) => Promise<void>;
  clearCities: () => void;
}

export const usePgLocationStore = create<PgLocationStore>((set) => ({
  states: [],
  cities: [],
  loading: false,

  fetchStates: async () => {
    set({ loading: true });
    try {
      const res = await getPgStates();
      set({ states: res.data?.result || [] });
    } catch (error) {
      console.error("Failed to fetch states", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCities: async (stateId: number) => {
    if (!stateId) return;

    set({ loading: true, cities: [] });
    try {
      const res = await getPgCities(stateId);
      set({ cities: res.data?.result || [] });
    } catch (error) {
      console.error("Failed to fetch cities", error);
    } finally {
      set({ loading: false });
    }
  },

  clearCities: () => set({ cities: [] }),
}));
