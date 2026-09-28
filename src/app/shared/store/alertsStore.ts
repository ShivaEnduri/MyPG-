import { create } from "zustand";
import { getPgAlerts } from "../services/api/ownerApiServices";
import { updatePgAlert } from "../services/api/commonApiServices";

/* ===================== TYPES ===================== */

export interface PgAlert {
  id: number;
  alert_cat: number;
  alert_title?: string;
  alert_message?: string;
  pg_update_time?: string;

  // Optional fields returned by the API
  alert_description?: string;
  alert_status?: number;
  alert_category?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  alert_create_time?: string;
  created_at?: string;
  pg_id?: number;
}

interface PgAlertsState {
  alerts: PgAlert[];
  loading: boolean;
  error: string | null;

  fetchAlerts: (params?: Record<string, any>) => Promise<void>;
  resolveAlert: (alertId: number) => Promise<void>;
  clearAlerts: () => void;
}

/* ===================== STORE ===================== */

export const usePgAlertsStore = create<PgAlertsState>((set) => ({
  alerts: [],
  loading: false,
  error: null,

  /* ===================== FETCH ALERTS ===================== */

  fetchAlerts: async (params) => {
    set({
      loading: true,
      error: null,
      alerts: [],
    });

    try {
      const res = await getPgAlerts(params);

      const payload = res.data;

      console.log("PG Alerts API Response:", payload);

      // Handle the API response safely
      const alerts = Array.isArray(payload?.result)
        ? payload.result
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      set({
        alerts,
        loading: false,
      });
    } catch (err: any) {
      console.error("Fetch alerts error:", err);

      set({
        loading: false,
        error: err?.message || "Failed to load alerts",
        alerts: [],
      });
    }
  },

  /* ===================== RESOLVE ALERT ===================== */

  resolveAlert: async (alertId: number) => {
    try {
      await updatePgAlert({
        id: alertId,
        fields: {
          alert_status: 10,
        },
      });

      // Remove resolved alert from UI
      set((state) => ({
        alerts: state.alerts.filter(
          (alert) => alert.id !== alertId
        ),
      }));
    } catch (err) {
      console.error("Resolve alert failed", err);
    }
  },

  /* ===================== CLEAR ALERTS ===================== */

  clearAlerts: () => {
    set({
      alerts: [],
      error: null,
    });
  },
}));