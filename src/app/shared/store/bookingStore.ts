// import { create } from "zustand";
// import {
//   fetchPgBookingsApi,
//   BookingPayload,
// } from "../services/api/commonApiServices";

// type PgBookingQuery = {
//   pg_id?: number;
//   room_id?: number;
//   bed_id?: number;
//   guest_id?: number;
//   bkg_status?: number;
//   created_by?: number;
//   planned_check_in_date?: string;
// };

// interface PgBookingState {
//   bookings: BookingPayload[];
//   loading: boolean;

//   fetchBookings: (params?: PgBookingQuery) => Promise<void>;
// }

// export const usePgBookingsStore = create<PgBookingState>((set) => ({
//   bookings: [],
//   loading: false,

//   fetchBookings: async (params) => {
//     set({ loading: true });

//     try {
//       const data = await fetchPgBookingsApi(params);

//       set({
//         bookings: data,
//       });
//     } catch (error) {
//       console.error("Failed to fetch bookings", error);
//     } finally {
//       set({
//         loading: false,
//       });
//     }
//   },
// }));


import { create } from "zustand";
import {
  fetchPgBookingsApi,
  BookingPayload,
} from "../services/api/commonApiServices";

export type PgBookingQuery = {
  pg_id?: number;
  room_id?: number;
  bed_id?: number;
  guest_id?: number;
  bkg_status?: number;
  created_by?: number;
  planned_check_in_date?: string;
};

interface PgBookingState {
  bookings: BookingPayload[];
  loading: boolean;
  error: string | null;

  fetchBookings: (
    params?: PgBookingQuery
  ) => Promise<void>;

  reset: () => void;
}

export const usePgBookingsStore =
  create<PgBookingState>((set) => ({
    bookings: [],
    loading: false,
    error: null,

    fetchBookings: async (params) => {
      set({
        loading: true,
        error: null,
        bookings: [],
      });

      try {
        const data =
          await fetchPgBookingsApi(params);

        set({
          bookings: data || [],
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch bookings:",
          error
        );

        set({
          bookings: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load bookings",
        });
      }
    },

    reset: () => {
      set({
        bookings: [],
        loading: false,
        error: null,
      });
    },
  }));