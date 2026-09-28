import { create } from "zustand";

import {
  UserPgMap,
  fetchUserPgMapApi,
} from "@/app/shared/services/api/commonApiServices";

interface UserPgMapStore {
  userPgMapList: UserPgMap[];

  loading: boolean;
  error: string | null;

  fetchUserPgMap: (
    userId: number
  ) => Promise<void>;

  clearUserPgMap: () => void;
}

export const useUserPgMapStore =
  create<UserPgMapStore>((set) => ({
    userPgMapList: [],

    loading: false,

    error: null,

    fetchUserPgMap: async (userId) => {
      if (!userId) {
        set({
          userPgMapList: [],
          error: "User ID is required",
        });

        return;
      }

      try {
        set({
          loading: true,
          error: null,
        });

        const data =
          await fetchUserPgMapApi({
            user_id: userId,
          });

        set({
          userPgMapList: data ?? [],
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch user PG map:",
          error
        );

        set({
          userPgMapList: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch PG information",
        });
      }
    },

    clearUserPgMap: () => {
      set({
        userPgMapList: [],
        loading: false,
        error: null,
      });
    },
  }));