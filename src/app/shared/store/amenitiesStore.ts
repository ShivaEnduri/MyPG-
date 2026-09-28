import { create } from "zustand";
import {
  fetchPgAmenities,
  PgAmenity,
} from "../services/api/commonApiServices";

interface PgAmenitiesState {
  amenities: PgAmenity[];
  loading: boolean;
  error: string | null;
  fetchAmenities: () => Promise<void>;
}

export const usePgAmenitiesStore = create<PgAmenitiesState>((set) => ({
  amenities: [],
  loading: false,
  error: null,

  fetchAmenities: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPgAmenities();
      set({ amenities: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch PG Amenities", err);
      set({ loading: false, error: "Unable to load amenities" });
    }
  },
}));
