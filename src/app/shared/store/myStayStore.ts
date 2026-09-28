import { create } from "zustand";

import {
  fetchMyStayApi,
  MyStayData,
} from "@/app/shared/services/api/residentApiServices";

interface MyStayState {
  myStay: MyStayData | null;
  isLoading: boolean;
  error: string | null;

  fetchMyStay: (userId: number) => Promise<void>;
  clearMyStay: () => void;
}

export const useMyStayStore = create<MyStayState>((set) => ({
  myStay: null,
  isLoading: false,
  error: null,

  fetchMyStay: async (userId: number) => {
    if (!userId) {
      set({
        myStay: null,
        error: "User ID is required",
        isLoading: false,
      });
      return;
    }

    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await fetchMyStayApi({
        user_id: userId,
      });

      set({
        myStay: data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("FETCH MY STAY ERROR:", error);

      set({
        myStay: null,
        isLoading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch stay details",
      });
    }
  },

  clearMyStay: () => {
    set({
      myStay: null,
      isLoading: false,
      error: null,
    });
  },
}));