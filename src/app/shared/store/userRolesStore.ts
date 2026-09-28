import { create } from "zustand";
import { fetchUserRolesApi } from "../services/api/commonApiServices";
import type { UserRole } from "../services/api/commonApiServices";

interface UserRolesStore {
  userRolesList: UserRole[];
  loading: boolean;
  error: string | null;

  fetchUserRoles: (params?: Record<string, string | number>) => Promise<void>;
  resetUserRoles: () => void;
}

export const useUserRolesStore = create<UserRolesStore>((set) => ({
  userRolesList: [],
  loading: false,
  error: null,

  fetchUserRoles: async (params) => {
    try {
      set({ loading: true, error: null });
      const data = await fetchUserRolesApi(params);
      set({ userRolesList: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: "Failed to fetch user roles",
      });
    }
  },

  resetUserRoles: () => set({ userRolesList: [] }),
}));