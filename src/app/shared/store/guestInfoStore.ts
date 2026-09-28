import { create } from "zustand";
import {
  getGuestInfo,
  GuestInfo,
  GuestInfoQuery,
} from "@/app/shared/services/api/ownerApiServices";

interface GuestInfoStore {
  guests: GuestInfo[];
  loading: boolean;

  fetchGuests: (query?: GuestInfoQuery) => Promise<void>;
  clearGuests: () => void;
}

export const useGuestInfoStore = create<GuestInfoStore>((set) => ({
  guests: [],
  loading: false,

  fetchGuests: async (query) => {
    set({ loading: true });
    try {
      const res = await getGuestInfo(query);
      set({ guests: res.data?.result || [] });
    } catch (error) {
      console.error("Failed to fetch guest info", error);
    } finally {
      set({ loading: false });
    }
  },

  clearGuests: () => set({ guests: [] }),
}));
