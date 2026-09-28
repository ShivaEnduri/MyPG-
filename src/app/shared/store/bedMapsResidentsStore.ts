import { create } from "zustand";

import {
  fetchBedMapResidentsApi,
  type BedMapResidentsResponse,
} from "@/app/shared/services/api/commonApiServices";

interface BedMapResidentsState {
  bedMapData: BedMapResidentsResponse | null;

  loading: boolean;
  error: string | null;

  fetchBedMapResidents: (pgId: number) => Promise<void>;

  getResidentFirstName: (
    bedId?: number | string,
    bedNumber?: number | string
  ) => string | null;

  setBedMapData: (
    data: BedMapResidentsResponse | null
  ) => void;

  clearBedMapData: () => void;
}

export const useBedMapResidentsStore =
  create<BedMapResidentsState>((set, get) => ({
    /* ======================================================== 
       STATE 
    ======================================================== */

    bedMapData: null,

    loading: false,

    error: null,

    /* ======================================================== 
       FETCH 
    ======================================================== */

    fetchBedMapResidents: async (pgId: number) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data =
          await fetchBedMapResidentsApi(pgId);

        set({
          bedMapData: data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch bed map residents:",
          error
        );

        set({
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch bed map residents",
        });
      }
    },

    /* ======================================================== 
       GET RESIDENT FIRST NAME 
    ======================================================== */

   getResidentFirstName: (bedId, bedNumber) => {
  const { bedMapData } = get();
  if (!bedMapData?.rooms?.length) return null;

  // Flatten once
  const allBeds = bedMapData.rooms.flatMap((room) => room.beds);

  // 1) Prefer a strict bedId match — bedId is the only truly unique key
  let matched =
    bedId !== undefined && bedId !== null
      ? allBeds.find((b) => String(b.bedId) === String(bedId))
      : undefined;

  // 2) Only fall back to bedNumber if no bedId was supplied at all
  //    (bedNumber is NOT unique across rooms, so never use it as a tiebreaker)
  if (!matched && (bedId === undefined || bedId === null) && bedNumber !== undefined && bedNumber !== null) {
    matched = allBeds.find((b) => String(b.bedNumber) === String(bedNumber));
  }

  if (!matched) return null;
  if (Number(matched.bedStatus) !== 5) return null;

  return matched.booking?.guest?.user?.firstName || null;
},
    /* ======================================================== 
       SET DATA 
    ======================================================== */

    setBedMapData: (data) => {
      set({
        bedMapData: data,
      });
    },

    /* ======================================================== 
       CLEAR DATA 
    ======================================================== */

    clearBedMapData: () => {
      set({
        bedMapData: null,
        loading: false,
        error: null,
      });
    },
  }));