import { create } from "zustand";
import { getPgRooms } from "../services/api/commonApiServices";

/* ===================== TYPES ===================== */

export interface PgRoom {
  id: number;
  room_name: string;
  pg_info: number;
  room_type: number;
  bathroom_type: number;
  floor_info: number;
  nbeds: number;
  occupancy: string;

  // PG related
  pg_id: string;
  pg_name: string;
  pg_owner: number;
  pg_address: string;
  pg_city: number;
  pg_state: number;
  pg_pincode: number;

  // Optional / nullable fields
  has_tv?: number | null;
  has_ac?: number | null;
  has_balcony?: number | null;
}

/* ===================== STORE INTERFACE ===================== */

interface PgRoomsStore {
  rooms: PgRoom[];
  count: number;
  loading: boolean;
  error: string | null;

  fetchRooms: (params?: Record<string, any>) => Promise<void>;
  reset: () => void;
}

/* ===================== STORE ===================== */

export const usePgRoomsStore = create<PgRoomsStore>((set) => ({
  rooms: [],
  count: 0,
  loading: false,
  error: null,

  fetchRooms: async (params) => {
    set({ loading: true, error: null });

    try {
      const res = await getPgRooms(params);

      set({
        rooms: res.data?.result || [],
        count: res.data?.count || 0,
        loading: false,
      });
    } catch (err: any) {
      console.error("Failed to fetch PG rooms:", err);
      set({
        loading: false,
        error: err?.message || "Failed to load PG rooms",
      });
    }
  },

  reset: () => {
    set({
      rooms: [],
      count: 0,
      loading: false,
      error: null,
    });
  },
}));
