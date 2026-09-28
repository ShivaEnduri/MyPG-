// // packages/store/src/transactionsStore.ts
// import { create } from "zustand";
// import { fetchTransactionsData } from "../../apps/rentals/src/app/shared/services/api/userApi";
// import { encryptData, decryptData } from "../utils/crypto";

// interface Invoice {
//   id: string | number;
//   amount: number;
//   dueDate: string;
//   status: string;
//   [key: string]: any;
// }

// interface Receipt {
//   id: string | number;
//   amount: number;
//   paymentDate: string;
//   [key: string]: any;
// }

// interface TransactionsStore {
//   invoices: Invoice[];
//   receipts: Receipt[];
//   transactionsLoading: boolean;
//   transactionsError: string | null;

//   fetchUserTransactions: (tenantId: string | number) => Promise<void>;
//   loadTransactions: () => void;
//   clearTransactions: () => void;
//   resetStore: () => void;
//   initializeStore: () => void;
// }

// export const useTransactionsStore = create<TransactionsStore>((set, get) => ({
//   invoices: [],
//   receipts: [],
//   transactionsLoading: false,
//   transactionsError: null,

//   fetchUserTransactions: async (tenantId) => {
//     set({ transactionsLoading: true, transactionsError: null });

//     try {
//       const response = await fetchTransactionsData(tenantId);

//       if (response.status && response.data) {
//         const { invoices, receipts } = response.data;

//         // Encrypt and persist to localStorage
//         const encrypted = encryptData({ invoices, receipts });
//         localStorage.setItem("userTransactions", encrypted);

//         set({
//           invoices,
//           receipts,
//           transactionsLoading: false,
//           transactionsError: null,
//         });
//       } else {
//         set({
//           transactionsError: response.data?.detail || "Failed to fetch transactions",
//           transactionsLoading: false,
//         });
//       }
//     } catch (error: any) {
//       console.error("Error fetching transactions:", error);
//       set({
//         transactionsError: error.message || "Network error",
//         transactionsLoading: false,
//       });
//     }
//   },

//   loadTransactions: () => {
//     const encrypted = localStorage.getItem("userTransactions");
//     if (!encrypted) return;

//     const data = decryptData(encrypted);
//     if (data && (data.invoices || data.receipts)) {
//       set({
//         invoices: data.invoices || [],
//         receipts: data.receipts || [],
//       });
//     }
//   },

//   clearTransactions: () => {
//     localStorage.removeItem("userTransactions");
//     set({
//       invoices: [],
//       receipts: [],
//       transactionsLoading: false,
//       transactionsError: null,
//     });
//   },

//   resetStore: () => {
//     localStorage.removeItem("userTransactions");
//     set({
//       invoices: [],
//       receipts: [],
//       transactionsLoading: false,
//       transactionsError: null,
//     });
//   },

//   initializeStore: () => {
//     get().loadTransactions();
//   },
// }));

// // Auto-initialize on app load
// useTransactionsStore.getState().initializeStore();

// export default useTransactionsStore;