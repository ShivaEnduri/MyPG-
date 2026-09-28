import { create } from "zustand";
import {
  fetchGendersApi,
  fetchRolesApi,
  GenderMaster,
  RoleMaster,
} from "../services/api/commonApiServices";

/* ===================== STORE TYPE ===================== */

interface MasterDataStore {
  genders: GenderMaster[];
  roles: RoleMaster[];
  fetchGenders: () => Promise<void>;
  fetchRoles: () => Promise<void>;
}

/* ===================== STORE ===================== */

export const useUserDetailsStore = create<MasterDataStore>((set) => ({
  genders: [],
  roles: [],

  fetchGenders: async () => {
    try {
      const data = await fetchGendersApi();
      set({ genders: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Failed to fetch genders", error);
      set({ genders: [] });
    }
  },

  fetchRoles: async () => {
    try {
      const data = await fetchRolesApi();
      set({ roles: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Failed to fetch roles", error);
      set({ roles: [] });
    }
  },
}));
