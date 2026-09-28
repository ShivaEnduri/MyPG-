
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PgInfo } from "@/app/shared/services/api/commonApiServices";

interface SelectedPgStore {
  /** The full PgInfo object for the currently selected PG. */
  selectedPg: PgInfo | null;

  /** Convenience accessor — avoids null-checks when you just need the id. */
  selectedPgId: number | null;

  /** Call this when the user picks a PG in the sidebar dropdown. */
  setSelectedPg: (pg: PgInfo | null) => void;

  /** Called on logout / when the owner's PG list changes. */
  clearSelectedPg: () => void;
}



export const useSelectedPgStore = create<SelectedPgStore>()(
  persist(
    (set) => ({
      selectedPg: null,
      selectedPgId: null,

      setSelectedPg: (pg) =>
        set({
          selectedPg: pg,
          selectedPgId: pg?.id ?? null,
        }),

      clearSelectedPg: () =>
        set({
          selectedPg: null,
          selectedPgId: null,
        }),
    }),
    {
      name: "owner-selected-pg",
    }
  )
);