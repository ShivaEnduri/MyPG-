// // store/pgInfoMediaStore.ts

// import { create } from "zustand";
// import { getPgInfoMedia, PgInfoMedia } from "../services/api/commonApiServices";


// interface PgInfoMediaState {
//   mediaList: PgInfoMedia[];
//   loading: boolean;
//   error: string | null;

//   fetchPgInfoMedia: (params?: any) => Promise<void>;
//   getMediaByPgId: (pgId: string) => PgInfoMedia | undefined;
//   clearMedia: () => void;
// }

// export const usePgInfoMediaStore = create<PgInfoMediaState>((set, get) => ({
//   mediaList: [],
//   loading: false,
//   error: null,

//   fetchPgInfoMedia: async (params) => {
//     try {
//       set({ loading: true, error: null });

//       const response = await getPgInfoMedia(params);

//       set({
//         // mediaList: response.data || [],
//         mediaList: response.data.result || [],
//         loading: false,
//       });
//     } catch (error: any) {
//       set({
//         error: error?.message || "Failed to fetch PG media",
//         loading: false,
//       });
//     }
//   },

//   getMediaByPgId: (pgId: string) => {
//     return get().mediaList.find((item) => item.pg_id === pgId);
//   },

//   clearMedia: () => {
//     set({ mediaList: [] });
//   },
// }));


import { create } from "zustand";
import { getPgInfoMedia } from "../services/api/commonApiServices";

// Raw shape from API
interface PgInfoMediaRaw {
  pg_id: string;
  media_images: string | null;
  media_videos: string | null;
}

// Normalized flat shape
export interface PgInfoMedia {
  pg_id: string;
  images: string[];
  videos: string[];
}

interface PgInfoMediaState {
  mediaList: PgInfoMedia[];
  loading: boolean;
  error: string | null;
  fetchPgInfoMedia: (params?: any) => Promise<void>;
  getMediaByPgId: (pgId: string) => PgInfoMedia | undefined;
  clearMedia: () => void;
}

function normalizeMedia(raw: PgInfoMediaRaw): PgInfoMedia {
  return {
    pg_id: raw.pg_id,
    images: raw.media_images ? [raw.media_images] : [],
    videos: raw.media_videos ? [raw.media_videos] : [],
  };
}

export const usePgInfoMediaStore = create<PgInfoMediaState>((set, get) => ({
  mediaList: [],
  loading: false,
  error: null,

  fetchPgInfoMedia: async (params) => {
    try {
      set({ loading: true, error: null });
      const response = await getPgInfoMedia(params);
      const raw: PgInfoMediaRaw[] = response.data.result || [];
      set({
        mediaList: raw.map(normalizeMedia),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch PG media",
        loading: false,
      });
    }
  },

  getMediaByPgId: (pgId: string) => {
    return get().mediaList.find((item) => item.pg_id === pgId);
  },

  clearMedia: () => set({ mediaList: [] }),
}));