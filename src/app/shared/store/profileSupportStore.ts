import { create } from "zustand";

import {
  fetchProfileSupportApi,
  type ProfileSupportData,
} from "../services/api/commonApiServices";

interface ProfileSupportStore {
  profileSupport: ProfileSupportData | null;

  loading: boolean;
  error: string | null;

  fetchProfileSupport: (
    userId: string | number
  ) => Promise<void>;

  clearProfileSupport: () => void;
}

export const useProfileSupportStore = create<ProfileSupportStore>(
  (set) => ({
    profileSupport: null,

    loading: false,
    error: null,

    // ========================================================
    // FETCH
    // ========================================================

    fetchProfileSupport: async (userId) => {
      if (!userId) {
        set({
          profileSupport: null,
          loading: false,
          error: "User ID is required",
        });

        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        const data = await fetchProfileSupportApi({
          user_id: userId,
        });

        set({
          profileSupport: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(
          "Failed to fetch profile support:",
          error
        );

        set({
          profileSupport: null,
          loading: false,
          error: "Failed to load profile information",
        });
      }
    },

    // ========================================================
    // CLEAR
    // ========================================================

    clearProfileSupport: () => {
      set({
        profileSupport: null,
        loading: false,
        error: null,
      });
    },
  })
);