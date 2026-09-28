import { create } from "zustand";
import { getPgInfoDocuments } from "../services/api/commonApiServices";

/* ===================== TYPES ===================== */

export interface PgMedia {
  documents: string[];
  images: string[];
  videos: string[];
}

interface PgInfoDocumentsStore {
  pgId: string | null;
  media: PgMedia;
  loading: boolean;
  error: string | null;

  fetchPgDocuments: (params: { pg_id: string }) => Promise<void>;
  reset: () => void;
}

/* ===================== STORE ===================== */

export const usePgInfoDocumentsStore = create<PgInfoDocumentsStore>((set) => ({
  pgId: null,
  media: {
    documents: [],
    images: [],
    videos: [],
  },
  loading: false,
  error: null,

  fetchPgDocuments: async (params) => {
    set({ loading: true, error: null });

    try {
      const res = await getPgInfoDocuments(params);

      set({
        pgId: res.data?.pg_id || params.pg_id,
        media: {
          documents: res.data?.media?.documents || [],
          images: res.data?.media?.images || [],
          videos: res.data?.media?.videos || [],
        },
        loading: false,
      });
    } catch (err: any) {
      console.error("Failed to fetch PG documents:", err);
      set({
        loading: false,
        error: err?.message || "Failed to load PG documents",
      });
    }
  },

  reset: () =>
    set({
      pgId: null,
      media: {
        documents: [],
        images: [],
        videos: [],
      },
      loading: false,
      error: null,
    }),
}));
