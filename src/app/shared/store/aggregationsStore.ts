import { create } from "zustand";
import {
  getPgAggregations,
} from "@/app/shared/services/api/ownerApiServices";

interface PgAggregations {
  dashboard: {
    occupancy: {
      occupied: number;
      total: number;
      percentage: number;
    };
    vacantBeds: number;
    upcomingVacancy: number;
    openIssues: number;
  };

  bedMap: {
    totalBeds: number;
    occupiedBeds: number;
    vacantBeds: number;
    noticeBeds: number;
    reservedBeds: number;
  };

  vacancyPipeline: {
    upcomingVacancy: number;
    enquiriesOpen: number;
    followUpsToday?: number;
  };

  // ============================================================
  // UPCOMING VACANCY CALENDAR
  // ============================================================

  vacancyCalendar: {
    days: number;
    range: {
      from: string;
      to: string;
    };
    totalVacancies: number;
    dates: Array<{
      date: string;
      vacancyCount: number;
      bookings: Array<{
        bookingId: number;
        bookingNo: string;
        roomId: number;
        bedId: number;
        guestId: number;
        plannedCheckInDate: string;
        plannedCheckOutDate: string;
        actualCheckInDate: string | null;
        actualCheckOutDate: string | null;
        bookingStatus: number;
      }>;
    }>;
  };

  residents: {
    totalResidents: number;
    activeResidents: number;
  };

  rentStatus: {
    totalRent: number;
    paid: number;
    due: number;
    partial: number;
    overdue: number;
  };

  happiness: {
    rating: number;
  };
}

interface PgAggregationsStore {
  aggregations: PgAggregations | null;
  loading: boolean;
  error: string | null;

  fetchAggregations: (
    pgId: number,
    days?: number
  ) => Promise<void>;

  clearAggregations: () => void;
}

export const usePgAggregationsStore =
  create<PgAggregationsStore>((set) => ({
    aggregations: null,
    loading: false,
    error: null,

    fetchAggregations: async (
      pgId,
      days = 15
    ) => {
      if (!pgId) {
        set({
          aggregations: null,
          error: "Valid pgId is required",
        });

        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        const response =
          await getPgAggregations(
            pgId,
            days
          );

        set({
          aggregations:
            response.data?.data ?? null,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        set({
          aggregations: null,
          loading: false,
          error:
            error?.response?.data?.message ??
            error?.message ??
            "Failed to fetch PG aggregations",
        });
      }
    },

    clearAggregations: () =>
      set({
        aggregations: null,
        loading: false,
        error: null,
      }),
  }));