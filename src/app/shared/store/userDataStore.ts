import { create } from "zustand";
import { fetchPgUsersApi, PgUser } from "../services/api/commonApiServices";

type PgUserQuery = {
  pg_id?: number;
  user_role?: number;
};

interface PgUserState {
  users: PgUser[];
  loading: boolean;
  fetchUsers: (params?: PgUserQuery) => Promise<void>;
}

export const usePgUserStore = create<PgUserState>((set) => ({
  users: [],
  loading: false,

  fetchUsers: async (params) => {
    set({ loading: true });
    try {
      const data = await fetchPgUsersApi(params);
      set({ users: data });
    } finally {
      set({ loading: false });
    }
  },
}));
