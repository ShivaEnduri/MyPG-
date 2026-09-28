

import { useAuthModal, useAuth } from "@/hooks/context/AuthContext";
import AppNavbar from "@/ui/navbar/AppNavbar";
import tailwindStyles from "@/styles/tailwindStyles";
import { PG_BASE } from "@/config/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
//import AddPgModal from "../../roles/owner/addPg/AddNewPG";
import SuccessModal from "@/ui/Shared/SuccessModal";

const ROUTE_STORAGE_KEY = "pg_last_route";

// Pages we should NOT restore to (public/auth pages that don't need persistence)
const EXCLUDED_RESTORE_PATHS = [`${PG_BASE}/`, `${PG_BASE}`];


const PG_ROLE_NAME_TO_DASHBOARD_PATH: Record<string, string> = {
  Admin: `${PG_BASE}/admin/dashboard`,
  Owner: `${PG_BASE}/owner/dashboard`,
  Manager: `${PG_BASE}/manager/dashboard`,
  Guest: `${PG_BASE}/guest/dashboard`,
  Staff: `${PG_BASE}/staff/dashboard`,
};

const PGNavbar = () => {
  const { openModal, loginIntent, clearIntent } = useAuthModal();
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [addPgOpen, setAddPgOpen] = useState(false);
  const [pgSuccessOpen, setPgSuccessOpen] = useState(false);

  // Dashboard is only visible if AuthContext found a PG-app role row for this user
  const hasPg = !!user?.hasPgAccess;

  useEffect(() => {
  console.log("USER:", user);
}, [user]);

  /* ── Fix: Persist + restore route across refreshes ───────────────────────── */

  // On mount: if user is logged in and there's a saved path, restore it
  useEffect(() => {
    const savedPath = sessionStorage.getItem(ROUTE_STORAGE_KEY);

    if (
      savedPath &&
      savedPath !== location.pathname &&
      !EXCLUDED_RESTORE_PATHS.includes(savedPath)
    ) {
      navigate(savedPath, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save current path on every route change (skip root/landing)
  useEffect(() => {
    if (!EXCLUDED_RESTORE_PATHS.includes(location.pathname)) {
      sessionStorage.setItem(ROUTE_STORAGE_KEY, location.pathname);
    }
  }, [location.pathname]);

  // Clear saved route on logout (logout navigates to PG_BASE/)
  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem(ROUTE_STORAGE_KEY);
    }
  }, [user]);

  /* ── Fix: Post-login intent handler ──────────────────────────────────────── */

  useEffect(() => {
    // Only fire when user just logged in (user is set) AND there's a pending intent
    if (!user || loginIntent === null) return;

    if (loginIntent === "list_pg") {
      // Came from "List PG" button → stay on landing page, open AddPg modal
      clearIntent();
      setAddPgOpen(true);
    } else if (loginIntent === "normal") {
      // Normal login → navigate to role dashboard (only meaningful if user has PG access)
      clearIntent();
      const dashboardPath = getDashboardPath(user.roleName);   // ← change to user.roleName
      if (dashboardPath) navigate(dashboardPath);
    }
  }, [user, loginIntent]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Helpers ─────────────────────────────────────────────────────────────── */

  // const getDashboardPath = (roleId: number | null) => {
  //   if (roleId === null || roleId === undefined) return null;
  //   return ROLE_ID_TO_DASHBOARD_PATH[roleId] ?? null;
  // };

const getDashboardPath = (roleName: string | null) => {
    if (!roleName) return null;
    return PG_ROLE_NAME_TO_DASHBOARD_PATH[roleName] ?? null;
  };

  /* ── List PG click ───────────────────────────────────────────────────────── */

  const handleListPgClick = () => {
    if (!user) {
      // Not logged in → open login modal with 'list_pg' intent
      openModal("list_pg");
    } else {
      // Already logged in → open AddPg modal directly
      setAddPgOpen(true);
    }
  };

  /* ── Navbar items ────────────────────────────────────────────────────────── */

  const getMenuItems = () => {
    // Only show Dashboard when logged in AND user has a PG-app role row
    if (!user || !hasPg) return [];

    return [
      {
        label: "Dashboard",
        onClick: () => {
          const path = getDashboardPath(user.roleName);
          if (path) navigate(path);
        },
        className: "text-white hover:text-gray-300 font-medium",
      },
    ];
  };

  const listPgButton = {
    label: (
      <span
        onClick={handleListPgClick}
        className="bg-gradient-to-r from-[#605BFF] to-[#4f46e5] text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:opacity-90 transition cursor-pointer select-none"
      >
        List Your PG
      </span>
    ),
  };

  const getRightItems = () => {
    if (user) {
      return [
        {
          label: `Welcome, ${user.name}`,
          className: "text-white font-medium",
        },
        listPgButton,
        {
          label: "Logout",
          onClick: logout,
          className: "text-white hover:text-gray-300 cursor-pointer",
        },
      ];
    }

    return [
      {
        label: "Login",
        onClick: () => openModal("normal"), // normal login → navigate to dashboard
        className: "text-white hover:text-gray-300 cursor-pointer",
      },
      listPgButton,
    ];
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <>
      <AppNavbar
        logoText="PG"
        bgClass="bg-[#181C3A]"
        menuItems={getMenuItems()}
        rightItems={getRightItems()}
        ProfileDropdown={null}
        MenuDropdown={null}
        tailwind={tailwindStyles}
        isLoggedIn={!!user}
        basePath={PG_BASE}
      />

      {/* AddPgModal — only mounted when user is logged in */}
      {/* {user && (
        // <AddPgModal
        //   open={addPgOpen}
        //   onClose={() => setAddPgOpen(false)}
        //   defaultStatusId={1}
        //   onSuccess={() => {
        //     setAddPgOpen(false);
        //     setPgSuccessOpen(true);
        //     refreshUser(); // ← re-fetches roles so Dashboard appears immediately, no re-login needed
        //   }}
        // />
      )}
      {/* <SuccessModal
        open={pgSuccessOpen}
        title="PG Listed!"
        message="Your PG has been successfully submitted for review."
        onClose={() => setPgSuccessOpen(false)}
      /> */} 
    </>
  );
};

export default PGNavbar;