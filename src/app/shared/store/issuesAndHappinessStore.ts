import { create } from "zustand";

import {
  fetchIssuesAndResidentHappinessApi,
  IssuesAndHappinessAggregates,
} from "@/app/shared/services/api/commonApiServices";

interface IssuesAndResidentHappinessState {
  data: IssuesAndHappinessAggregates | null;

  loading: boolean;
  error: string | null;

  fetchAggregates: (
    pgId: string | number
  ) => Promise<void>;

  clearAggregates: () => void;
}

export const useIssuesAndResidentHappinessStore =
  create<IssuesAndResidentHappinessState>(
    (set) => ({
      data: null,

      loading: false,

      error: null,

      fetchAggregates: async (
        pgId
      ) => {
        if (
          pgId === null ||
          pgId === undefined ||
          pgId === ""
        ) {
          set({
            data: null,
            loading: false,
            error: null,
          });

          return;
        }

        set({
          loading: true,
          error: null,
        });

        try {
          const data =
            await fetchIssuesAndResidentHappinessApi(
              pgId
            );

          set({
            data,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          console.error(
            "Failed to fetch Issues and Resident Happiness aggregates:",
            error
          );

          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch Issues and Resident Happiness aggregates.";

          set({
            data: null,
            loading: false,
            error: message,
          });
        }
      },

      clearAggregates: () => {
        set({
          data: null,
          loading: false,
          error: null,
        });
      },
    })
  );