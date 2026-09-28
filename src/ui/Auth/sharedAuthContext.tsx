import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import { firebaseAuth, firebaseProviders } from "@/config/firebase";
import {
  socialLoginApi,
  getMeApi,
  updateProfileApi,
} from "../../servivces/api/authApiServices";

// ── Context ───────────────────────────────────────────────────────────────────

const SharedAuthContext = createContext<any>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export const SharedAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser]       = useState<any>(null);
  const [dbUser, setDbUser]                   = useState<any>(null);
  const [user, setUser]                       = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [socialAuthError, setSocialAuthError] = useState({ provider: "", message: "" });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const skipAuthListenerRef = useRef(false);

  // ── Build user for navbar ─────────────────────────────────────────────────

  const buildUser = (fbUser: any, db: any) => {
    if (!fbUser || !db) return null;
    return {
      uid:      fbUser.uid,
      name:     `${db.first_name || ""} ${db.last_name || ""}`.trim() || fbUser.displayName || "User",
      email:    db.email || fbUser.email || "",
      role:     db.role_id,
      mobile:   db.mobile_no,
      photoURL: fbUser.photoURL,
    };
  };

  const isProfileComplete = (db: any) =>
    !!db?.mobile_no && !!db?.gender_id && !!db?.first_name && !!db?.last_name;

  // ── Firebase auth state listener ──────────────────────────────────────────
  // Runs on page refresh — restores session across ALL apps automatically

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      setFirebaseUser(fbUser || null);

      if (!fbUser || skipAuthListenerRef.current) return;

      try {
        const idToken = await fbUser.getIdToken(false);
        const res = await getMeApi(idToken);
        const db = res.data.user;
        setDbUser(db);
        setUser(buildUser(fbUser, db));
        setShowProfileForm(!isProfileComplete(db));
      } catch (err) {
        console.error("SharedAuth GET ME ERROR:", err);
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  // ── Social login ──────────────────────────────────────────────────────────

  const socialLogin = async (type: keyof typeof firebaseProviders) => {
    try {
      setSocialAuthError({ provider: "", message: "" });
      setIsAuthenticating(true);
      skipAuthListenerRef.current = true;

      const result = await signInWithPopup(firebaseAuth, firebaseProviders[type]);
      const idToken = await result.user.getIdToken();

      const res = await socialLoginApi({ idToken });
      const data = res.data;

      if (data?.mergedAccount && data?.customToken) {
        await signOut(firebaseAuth);
        await signInWithCustomToken(firebaseAuth, data.customToken);
        return;
      }

      // Always fetch fresh DB user after login
      const meRes = await getMeApi(idToken);
      const db = meRes.data.user;
      setDbUser(db);
      setUser(buildUser(result.user, db));
      setShowProfileForm(!isProfileComplete(db));

    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") return;

      if (err.code === "auth/account-exists-with-different-credential") {
        setSocialAuthError({
          provider: err.customData?.providerId ?? "",
          message: "This email is already registered with a different provider.",
        });
        return;
      }

      setSocialAuthError({
        provider: "",
        message: err.message || "Login failed. Please try again.",
      });
    } finally {
      skipAuthListenerRef.current = false;
      setIsAuthenticating(false);
    }
  };

  // ── Profile update ────────────────────────────────────────────────────────

  const updateProfile = async (formData: any) => {
    const idToken = await firebaseAuth.currentUser?.getIdToken(false);
    await updateProfileApi(formData);

    const meRes = await getMeApi(idToken);
    const db = meRes.data.user;
    setDbUser(db);
    setUser(buildUser(firebaseAuth.currentUser, db));
    setShowProfileForm(!isProfileComplete(db));
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = async () => {
    try {
      if (firebaseAuth.currentUser) await signOut(firebaseAuth);
    } finally {
      setFirebaseUser(null);
      setDbUser(null);
      setUser(null);
      setShowProfileForm(false);
      setSocialAuthError({ provider: "", message: "" });
    }
  };

  return (
    <SharedAuthContext.Provider value={{
      firebaseUser,
      dbUser,
      user,
      showProfileForm,
      setShowProfileForm,
      socialAuthError,
      isAuthenticating,
      socialLogin,
      updateProfile,
      logout,
    }}>
      {children}
    </SharedAuthContext.Provider>
  );
};

export const useSharedAuth = () => useContext(SharedAuthContext);