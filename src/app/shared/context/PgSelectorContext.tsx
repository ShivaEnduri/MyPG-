/**
 * PgSelectorContext.tsx
 * ---------------------
 * Shared context for the currently-selected PG in the owner dashboard.
 * Wrap the owner layout with <PgSelectorProvider> and consume with usePgSelector().
 *
 * Usage:
 *   import { usePgSelector } from "@pg/app/shared/context/PgSelectorContext";
 *   const { selectedPg, setSelectedPg } = usePgSelector();
 */

import React, { createContext, useContext, useState } from "react";
import type { PgInfo } from "@/app/shared/services/api/commonApiServices";

interface PgSelectorCtx {
  selectedPg: PgInfo | null;
  setSelectedPg: (pg: PgInfo | null) => void;
}

const PgSelectorContext = createContext<PgSelectorCtx>({
  selectedPg: null,
  setSelectedPg: () => {},
});

export function PgSelectorProvider({ children }: { children: React.ReactNode }) {
  const [selectedPg, setSelectedPg] = useState<PgInfo | null>(null);
  return (
    <PgSelectorContext.Provider value={{ selectedPg, setSelectedPg }}>
      {children}
    </PgSelectorContext.Provider>
  );
}

export function usePgSelector() {
  return useContext(PgSelectorContext);
}