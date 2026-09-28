import { create } from "zustand";

import {
  AnnouncementRecord,
  AnnouncementsData,
  fetchAnnouncementsApi,
} from "@/app/shared/services/api/residentApiServices";

interface AnnouncementsStore {
  announcementsData: AnnouncementsData | null;

  announcements: AnnouncementRecord[];

  loading: boolean;
  error: string | null;

  fetchAnnouncements: (
    pgId: number
  ) => Promise<void>;

  clearAnnouncements: () => void;
}

export const useAnnouncementsStore =
  create<AnnouncementsStore>((set) => ({
    announcementsData: null,

    announcements: [],

    loading: false,

    error: null,

    fetchAnnouncements: async (pgId) => {
      if (!pgId) {
        set({
          announcementsData: null,
          announcements: [],
          error: "PG ID is required",
          loading: false,
        });

        return;
      }

      try {
        set({
          loading: true,
          error: null,
        });

        const data =
          await fetchAnnouncementsApi({
            pgId,
          });

        set({
          announcementsData: data,
          announcements:
            data?.announcements ?? [],
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error(
          "Failed to fetch announcements:",
          error
        );

        set({
          announcementsData: null,
          announcements: [],
          loading: false,
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch announcements",
        });
      }
    },

    clearAnnouncements: () => {
      set({
        announcementsData: null,
        announcements: [],
        loading: false,
        error: null,
      });
    },
  }));