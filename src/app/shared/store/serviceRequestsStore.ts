


// import { create } from "zustand";
// import {
//   getServiceRequests,
//   createServiceRequest,
// } from "../services/api/commonApiServices";
// import type { ServiceRequestFormState } from "../features/maintenance/types/serviceRequest";

// interface ServiceRequestStore {
//   requests: any[]; // temporary any – we’ll map later
//   loading: boolean;
//   error: string | null;

//   fetchRequests: (params?: Record<string, any>) => Promise<void>;
//   addRequest: (data: Partial<ServiceRequestFormState>) => Promise<void>;
// }

// export const useServiceRequestStore = create<ServiceRequestStore>((set) => ({
//   requests: [],
//   loading: false,
//   error: null,

//   fetchRequests: async (params) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await getServiceRequests(params);
     

//       const resultArray = res.data?.result || [];

//       set({
//         requests: resultArray,
//         loading: false,
//       });
//     } catch (err: any) {
//       console.error("Fetch requests failed:", err);
//       set({
//         loading: false,
//         error: err.message || "Failed to load service requests",
//       });
//     }
//   },

//   addRequest: async (data) => {
//     try {
//       await createServiceRequest(data);
//       // Optionally refetch after create
//       // await fetchRequests({ pg_id: currentPgId });
//     } catch (err) {
//       console.error("Create request failed:", err);
//       throw err;
//     }
//   },
// }));