import { create } from "zustand";
import CryptoJS from "crypto-js";

// ---------- Types ----------
export interface UserData {
  id: string | number | null;
  role: string | null;
  userName: string | null;
}

export interface RoleStoreState {
  userData: UserData;
  setUserData: (data: UserData) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  resetStore: () => void;
  loadUserData: () => void;
}

// ---------- Crypto Utilities ----------
const secretKey = `${import.meta.env.VITE_CRYPTO_SECRET_KEY}`;

const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (data: string): any => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted ? JSON.parse(decrypted) : null;
};

// ---------- Zustand Store ----------

export const useRoleStore = create<RoleStoreState>((set) => ({
  userData: {
    id: null,
    role: null,
    userName: null,
  },

  setUserData: (data) => {
    const encrypted = encryptData(data);
    localStorage.setItem("userData", encrypted);

    set({ userData: { ...data } });
  },

  updateUserData: (updates) =>
    set((state) => {
      const updated = { ...state.userData, ...updates };
      const encrypted = encryptData(updated);
      localStorage.setItem("userData", encrypted);

      return { userData: updated };
    }),

  resetStore: () => {
    localStorage.removeItem("userData");

    set({
      userData: {
        id: null,
        role: null,
        userName: null,
      },
    });
  },

  loadUserData: () => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;

    try {
      const decrypted = decryptData(stored);
      if (decrypted) {
        set({ userData: decrypted });
      }
    } catch (error) {
      console.error("Failed to decrypt userData:", error);
    }
  },
}));

// Load data when initialized
useRoleStore.getState().loadUserData();
