import { create } from "zustand";
import { getPgAmenitiesMap } from "../services/api/adminApiServices";

type PgAmenitiesMap = {
  id: number;
  pg_info: number;
  amns_info: number;
};

type PgAmenitiesMapQueryParams = {
  id?: number;
  pg_info?: number;
  amns_info?: number;
};

type PgAmenitiesStore = {
  amenitiesMap: PgAmenitiesMap[];
  loading: boolean;
  fetchAmenitiesMap: (params?: PgAmenitiesMapQueryParams) => Promise<void>;
};

export const usePgAmenitiesMapStore = create<PgAmenitiesStore>((set) => ({
  amenitiesMap: [],
  loading: false,

  fetchAmenitiesMap: async (params) => {
    set({ loading: true });

    try {
      const res = await getPgAmenitiesMap(params);

      set({
        amenitiesMap: res.data || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching amenities map:", error);
      set({ loading: false });
    }
  },
}));