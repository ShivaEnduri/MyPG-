import { create } from "zustand";
import {
  PgEvent,
  fetchPgEventsApi,
  addPgEventApi,
  deletePgEventApi,
} from "../services/api/commonApiServices";

interface PgEventState {
  events: PgEvent[];
  loading: boolean;

  fetchEvents: (pgId: number) => Promise<void>;
  addEvent: (payload: {
    event_date: string;
    event_title: string;
    event_description: string;
    pg_id: number;
  }) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const usePgEventStore = create<PgEventState>((set) => ({
  events: [],
  loading: false,

  fetchEvents: async (pgId) => {
    set({ loading: true });
    try {
      const data = await fetchPgEventsApi({ pg_id: pgId });
      set({ events: data });
    } finally {
      set({ loading: false });
    }
  },

  addEvent: async (payload) => {
    await addPgEventApi(payload);
  },

  deleteEvent: async (id) => {
    await deletePgEventApi(id);
  },
}));
