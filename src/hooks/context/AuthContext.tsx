

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithCustomToken,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

import { PG_BASE } from "@/config/constants";

import {
  firebaseAuth,
  firebaseProviders,
} from "@/config/firebase";

import {
  socialLoginApi,
  getMeApi,
  updateProfileApi,
  fetchUserRolesApi,
} from "@/app/shared/services/api/commonApiServices";

/* =========================================================
   TYPES
========================================================= */

export interface DbUser {
  id: number;

  first_name?: string | null;
  last_name?: string | null;

  email_id?: string | null;
  email?: string | null;

  mobile_no?: string | null;

  gender_id?: number | null;

  [key: string]: unknown;
}

interface AuthUser {
  uid: string;
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string | null;
  hasPgAccess: boolean;
  mobile?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  firebaseUser: any;
  user: AuthUser | null;
  dbUser: any;
  socialLogin: (type: keyof typeof firebaseProviders) => Promise<void>;
  showProfileForm: boolean;
  setShowProfileForm: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  updateProfile: (formData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  socialAuthError: {
    provider: string;
    message: string;
  };
  isAuthenticating: boolean;
  logout: () => Promise<void>;
}



export interface AuthModalContextType {
  isModalOpen: boolean;

  loginIntent: string | null;

  openModal: (
    intent?: string
  ) => void;

  closeModal: () => void;

  clearIntent: () => void;
}

/* =========================================================
   CONTEXTS
========================================================= */

const AuthModalContext =
  createContext<AuthModalContextType | null>(
    null
  );

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

/* =========================================================
   PROVIDER PROPS
========================================================= */

interface AuthProviderProps {
  children: ReactNode;
}

/* =========================================================
   PROVIDER
========================================================= */

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [loginIntent, setLoginIntent] =
    useState<string | null>(null);

  const [firebaseUser, setFirebaseUser] =
    useState<FirebaseUser | null>(null);

  const [showProfileForm, setShowProfileForm] =
    useState(false);

  const [socialAuthError, setSocialAuthError] =
    useState({
      provider: "",
      message: "",
    });

  const [isAuthenticating, setIsAuthenticating] =
    useState(false);

  const [dbUser, setDbUser] =
    useState<DbUser | null>(null);

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const skipAuthListenerRef =
    useRef(false);

  const navigate = useNavigate();

  /* =========================================================
     LOAD USER WITH ROLE
  ========================================================= */

  const loadUserWithRole = async (
    fbUser: FirebaseUser | null,
    dbUserData: DbUser | null
  ): Promise<AuthUser | null> => {
    if (!fbUser || !dbUserData) {
      return null;
    }

    let roleId: number | null = null;
    let roleName: string | null = null;

    try {
      const roles = await fetchUserRolesApi({
        user_id: dbUserData.id,
      });

     

      const assignedRole =
        roles?.[0];

      if (assignedRole) {
        roleId = assignedRole.id;
        roleName = assignedRole.role;
      }
    } catch (err) {
      console.error(
        "FETCH USER ROLES ERROR:",
        err
      );
    }

    return {
      uid: fbUser.uid,

      id: dbUserData.id,

      name:
        `${dbUserData.first_name || ""} ${
          dbUserData.last_name || ""
        }`.trim() ||
        fbUser.displayName ||
        "User",

      email:
        dbUserData.email_id ||
        dbUserData.email ||
        fbUser.email ||
        "",

      roleId,

      roleName,

      hasPgAccess:
        roleId !== null,

      mobile:
        dbUserData.mobile_no,

      photoURL:
        fbUser.photoURL,
    };
  };

  /* =========================================================
     FIREBASE AUTH STATE LISTENER
  ========================================================= */

  useEffect(() => {
    const unsub =
      onAuthStateChanged(
        firebaseAuth,
        async (fbUser) => {
          setFirebaseUser(
            fbUser || null
          );

          if (
            !fbUser ||
            skipAuthListenerRef.current
          ) {
            return;
          }

          try {
            const idToken =
              await fbUser.getIdToken(
                true
              );

            const res =
              await getMeApi(
                idToken
              );

            const dbUserData =
              res.data.user as DbUser;

            setDbUser(
              dbUserData
            );

            const builtUser =
              await loadUserWithRole(
                fbUser,
                dbUserData
              );

            setUser(
              builtUser
            );

            setShowProfileForm(
              !dbUserData.mobile_no ||
                !dbUserData.gender_id
            );
          } catch (err) {
            console.error(
              "GET ME ERROR:",
              err
            );

            setUser(null);
            setDbUser(null);
          }
        }
      );

    return () => unsub();
  }, []);

  /* =========================================================
     SOCIAL LOGIN
  ========================================================= */

  const socialLogin = async (
    type: keyof typeof firebaseProviders
  ) => {
    try {
      setSocialAuthError({
        provider: "",
        message: "",
      });

      setIsAuthenticating(
        true
      );

      skipAuthListenerRef.current =
        true;

      const result =
        await signInWithPopup(
          firebaseAuth,
          firebaseProviders[type]
        );

      const idToken =
        await result.user.getIdToken();

      const res =
        await socialLoginApi({
          idToken,
        });

      const data =
        res.data;

      if (
        data?.mergedAccount &&
        data?.customToken
      ) {
        await signOut(
          firebaseAuth
        );

        await signInWithCustomToken(
          firebaseAuth,
          data.customToken
        );

        return;
      }

      if (
        data?.isProfileIncomplete
      ) {
        setShowProfileForm(
          true
        );
      } else {
        const meRes =
          await getMeApi(
            idToken
          );

        const dbUserData =
          meRes.data.user as DbUser;

        setDbUser(
          dbUserData
        );

        const builtUser =
          await loadUserWithRole(
            result.user,
            dbUserData
          );

        setUser(
          builtUser
        );

        const incomplete =
          !dbUserData.mobile_no ||
          !dbUserData.gender_id ||
          !dbUserData.first_name ||
          !dbUserData.last_name;

        if (incomplete) {
          setShowProfileForm(
            true
          );
        } else {
          setShowProfileForm(
            false
          );

          setIsModalOpen(
            false
          );
        }
      }
    } catch (err: any) {
      if (
        err.code ===
        "auth/popup-closed-by-user"
      ) {
        return;
      }

      if (
        err.code ===
        "auth/account-exists-with-different-credential"
      ) {
        setSocialAuthError({
          provider: type,
          message:
            "This email is already registered with a different provider. Please use that provider to sign in.",
        });

        return;
      }

      setSocialAuthError({
        provider: type,
        message:
          err.message ||
          "Login failed. Please try again.",
      });
    } finally {
      skipAuthListenerRef.current =
        false;

      setIsAuthenticating(
        false
      );
    }
  };

  /* =========================================================
     PROFILE UPDATE
  ========================================================= */

  const updateProfile = async (
    formData: any
  ) => {
    try {
      const idToken =
        await firebaseAuth.currentUser?.getIdToken(
          false
        );

      await updateProfileApi(
        formData
      );

      const meRes =
        await getMeApi(
          idToken
        );

      const updatedDbUser =
        meRes.data.user as DbUser;

      setDbUser(
        updatedDbUser
      );

      const builtUser =
        await loadUserWithRole(
          firebaseAuth.currentUser,
          updatedDbUser
        );

      setUser(
        builtUser
      );

      setShowProfileForm(
        false
      );

      setIsModalOpen(
        false
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      throw err;
    }
  };

  /* =========================================================
     REFRESH USER
  ========================================================= */

  const refreshUser =
    async () => {
      try {
        const idToken =
          await firebaseAuth.currentUser?.getIdToken(
            true
          );

        if (!idToken) {
          return;
        }

        const meRes =
          await getMeApi(
            idToken
          );

        const refreshedDbUser =
          meRes.data.user as DbUser;

        setDbUser(
          refreshedDbUser
        );

        const builtUser =
          await loadUserWithRole(
            firebaseAuth.currentUser,
            refreshedDbUser
          );

        setUser(
          builtUser
        );
      } catch (err) {
        console.error(
          "Refresh user error:",
          err
        );
      }
    };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout =
    async () => {
      try {
        if (
          firebaseAuth.currentUser
        ) {
          await signOut(
            firebaseAuth
          );
        }
      } catch (err) {
        console.error(
          "Logout error:",
          err
        );
      } finally {
        setFirebaseUser(
          null
        );

        setUser(null);

        setDbUser(null);

        setShowProfileForm(
          false
        );

        setSocialAuthError({
          provider: "",
          message: "",
        });

        navigate(
          `/`,
          {
            replace: true,
          }
        );
      }
    };

  /* =========================================================
     AUTH CONTEXT VALUE
  ========================================================= */

  const authValue: AuthContextType =
    {
      firebaseUser,
      user,
      dbUser,

      socialLogin,

      showProfileForm,
      setShowProfileForm,

      updateProfile,
      refreshUser,

      socialAuthError,

      isAuthenticating,

      logout,
    };

  /* =========================================================
     MODAL CONTEXT VALUE
  ========================================================= */

  const modalValue: AuthModalContextType =
    {
      isModalOpen,

      loginIntent,

      openModal: (
        intent = "normal"
      ) => {
        setLoginIntent(
          intent
        );

        setIsModalOpen(
          true
        );
      },

      closeModal: () => {
        setLoginIntent(
          null
        );

        setIsModalOpen(
          false
        );
      },

      clearIntent: () => {
        setLoginIntent(
          null
        );
      },
    };

  /* =========================================================
     PROVIDERS
  ========================================================= */

  return (
    <AuthContext.Provider
      value={authValue}
    >
      <AuthModalContext.Provider
        value={modalValue}
      >
        {children}
      </AuthModalContext.Provider>
    </AuthContext.Provider>
  );
};

/* =========================================================
   HOOKS
========================================================= */

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used within an AuthProvider"
      );
    }

    return context;
  };

export const useAuthModal =
  (): AuthModalContextType => {
    const context =
      useContext(
        AuthModalContext
      );

    if (!context) {
      throw new Error(
        "useAuthModal must be used within an AuthProvider"
      );
    }

    return context;
  };