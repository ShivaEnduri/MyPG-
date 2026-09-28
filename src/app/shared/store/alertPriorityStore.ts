

import { create } from "zustand";
import {
  fetchPgAlertPriorities,
  PgAlertPriority,
} from "../services/api/ownerApiServices";

interface PgAlertPriorityState {
  priorities: PgAlertPriority[];
  loading: boolean;
  error: string | null;
  fetchPriorities: () => Promise<void>;
}

export const usePgAlertPriorityStore = create<PgAlertPriorityState>((set) => ({
  priorities: [],
  loading: false,
  error: null,

  fetchPriorities: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPgAlertPriorities();
      set({ priorities: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch alert priorities", err);
      set({
        loading: false,
        error: "Unable to load alert priorities",
      });
    }
  },
}));


// import { create } from "zustand";
// import {
//   fetchPgAlertPriorities,
//   PgAlertPriority,
// } from "../services/api/ownerApiServices";

// interface PgAlertPriorityState {
//   priorities: PgAlertPriority[];
//   loading: boolean;
//   error: string | null;

//   fetchPriorities: () => Promise<void>;

//   /** Helpers */
//   getByRowId: (rowId: number) => PgAlertPriority | undefined;
// }

// export const usePgAlertPriorityStore = create<PgAlertPriorityState>((set, get) => ({
//   priorities: [],
//   loading: false,
//   error: null,

//   fetchPriorities: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetchPgAlertPriorities();
//       set({
//         priorities: res?.result ?? [],
//         loading: false,
//       });
//     } catch (err) {
//       console.error("Failed to fetch alert priorities", err);
//       set({
//         loading: false,
//         error: "Unable to load alert priorities",
//       });
//     }
//   },

//   getByRowId: (rowId) =>
//     get().priorities.find((p) => p.row_id === rowId),
// }));

