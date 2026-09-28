

// import { useAuthModal, useAuth } from "@/hooks/context/AuthContext";
// import AppNavbar from "@/ui/navbar/AppNavbar";
// import tailwindStyles from "@/styles/tailwindStyles";
// import { PG_BASE } from "@/config/constants";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// //import AddPgModal from "../../roles/owner/addPg/AddNewPG";
// import SuccessModal from "@/ui/Shared/SuccessModal";

// const ROUTE_STORAGE_KEY = "pg_last_route";

// // Pages we should NOT restore to (public/auth pages that don't need persistence)
// const EXCLUDED_RESTORE_PATHS = [`${PG_BASE}/`, `${PG_BASE}`];


// const PG_ROLE_NAME_TO_DASHBOARD_PATH: Record<string, string> = {
//   Admin: `/admin/dashboard`,
//   Owner: `/owner/dashboard`,
//   Manager:`/manager/dashboard`,
//   Guest: `/resident/dashboard`,
//   Staff: `${PG_BASE}/staff/dashboard`,
// };

// const PGNavbar = () => {
//   const { openModal, loginIntent, clearIntent } = useAuthModal();
//   const { user, logout, refreshUser } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [addPgOpen, setAddPgOpen] = useState(false);
//   const [pgSuccessOpen, setPgSuccessOpen] = useState(false);

//   // Dashboard is only visible if AuthContext found a PG-app role row for this user
//   const hasPg = !!user?.hasPgAccess;

//   useEffect(() => {
//   console.log("USER:", user);
// }, [user]);

//   /* ── Fix: Persist + restore route across refreshes ───────────────────────── */

//   // On mount: if user is logged in and there's a saved path, restore it
//   useEffect(() => {
//     const savedPath = sessionStorage.getItem(ROUTE_STORAGE_KEY);

//     if (
//       savedPath &&
//       savedPath !== location.pathname &&
//       !EXCLUDED_RESTORE_PATHS.includes(savedPath)
//     ) {
//       navigate(savedPath, { replace: true });
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // Save current path on every route change (skip root/landing)
//   useEffect(() => {
//     if (!EXCLUDED_RESTORE_PATHS.includes(location.pathname)) {
//       sessionStorage.setItem(ROUTE_STORAGE_KEY, location.pathname);
//     }
//   }, [location.pathname]);

//   // Clear saved route on logout (logout navigates to PG_BASE/)
//   useEffect(() => {
//     if (!user) {
//       sessionStorage.removeItem(ROUTE_STORAGE_KEY);
//     }
//   }, [user]);

//   /* ── Fix: Post-login intent handler ──────────────────────────────────────── */

//   useEffect(() => {
//     // Only fire when user just logged in (user is set) AND there's a pending intent
//     if (!user || loginIntent === null) return;

//     if (loginIntent === "list_pg") {
//       // Came from "List PG" button → stay on landing page, open AddPg modal
//       clearIntent();
//       setAddPgOpen(true);
//     } else if (loginIntent === "normal") {
//       // Normal login → navigate to role dashboard (only meaningful if user has PG access)
//       clearIntent();
//       const dashboardPath = getDashboardPath(user.roleName);   // ← change to user.roleName
//       if (dashboardPath) navigate(dashboardPath);
//     }
//   }, [user, loginIntent]); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ── Helpers ─────────────────────────────────────────────────────────────── */

//   // const getDashboardPath = (roleId: number | null) => {
//   //   if (roleId === null || roleId === undefined) return null;
//   //   return ROLE_ID_TO_DASHBOARD_PATH[roleId] ?? null;
//   // };

// const getDashboardPath = (roleName: string | null) => {
//     if (!roleName) return null;
//     return PG_ROLE_NAME_TO_DASHBOARD_PATH[roleName] ?? null;
//   };

//   /* ── List PG click ───────────────────────────────────────────────────────── */

//   const handleListPgClick = () => {
//     if (!user) {
//       // Not logged in → open login modal with 'list_pg' intent
//       openModal("list_pg");
//     } else {
//       // Already logged in → open AddPg modal directly
//       setAddPgOpen(true);
//     }
//   };

//   /* ── Navbar items ────────────────────────────────────────────────────────── */

//   const getMenuItems = () => {
//     // Only show Dashboard when logged in AND user has a PG-app role row
//     if (!user || !hasPg) return [];

//     return [
//       {
//         label: "Dashboard",
//         onClick: () => {
//           const path = getDashboardPath(user.roleName);
//           if (path) navigate(path);
//         },
//         className: "text-white hover:text-gray-300 font-medium",
//       },
//     ];
//   };

//   const listPgButton = {
//     label: (
//       <span
//         onClick={handleListPgClick}
//         className="bg-gradient-to-r from-[#605BFF] to-[#4f46e5] text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:opacity-90 transition cursor-pointer select-none"
//       >
//         List Your PG
//       </span>
//     ),
//   };

//   const getRightItems = () => {
//     if (user) {
//       return [
//         {
//           label: `Welcome, ${user.name}`,
//           className: "text-white font-medium",
//         },
//         listPgButton,
//         {
//           label: "Logout",
//           onClick: logout,
//           className: "text-white hover:text-gray-300 cursor-pointer",
//         },
//       ];
//     }

//     return [
//       {
//         label: "Login",
//         onClick: () => openModal("normal"), // normal login → navigate to dashboard
//         className: "text-white hover:text-gray-300 cursor-pointer",
//       },
//       listPgButton,
//     ];
//   };

//   /* ── Render ──────────────────────────────────────────────────────────────── */

//   return (
//     <>
//       <AppNavbar
//         logoText="PG"
//         bgClass="bg-[#181C3A]"
//         menuItems={getMenuItems()}
//         rightItems={getRightItems()}
//         ProfileDropdown={null}
//         MenuDropdown={null}
//         tailwind={tailwindStyles}
//         isLoggedIn={!!user}
//         basePath={PG_BASE}
//       />

//       {/* AddPgModal — only mounted when user is logged in */}
//       {/* {user && (
//         // <AddPgModal
//         //   open={addPgOpen}
//         //   onClose={() => setAddPgOpen(false)}
//         //   defaultStatusId={1}
//         //   onSuccess={() => {
//         //     setAddPgOpen(false);
//         //     setPgSuccessOpen(true);
//         //     refreshUser(); // ← re-fetches roles so Dashboard appears immediately, no re-login needed
//         //   }}
//         // />
//       )}
//       {/* <SuccessModal
//         open={pgSuccessOpen}
//         title="PG Listed!"
//         message="Your PG has been successfully submitted for review."
//         onClose={() => setPgSuccessOpen(false)}
//       /> */} 
//     </>
//   );
// };

// export default PGNavbar;





import { useAuthModal, useAuth } from "@/hooks/context/AuthContext";
import AppNavbar from "@/ui/navbar/AppNavbar";
import tailwindStyles from "@/styles/tailwindStyles";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { useUserRolesStore } from "@/app/shared/store/userRolesStore";

const ROUTE_STORAGE_KEY = "pg_last_route";

/* ============================================================
   ROUTES THAT SHOULD NOT BE RESTORED
============================================================ */

const EXCLUDED_RESTORE_PATHS = [
  "/",
];

/* ============================================================
   ROLE → DASHBOARD PATH
============================================================ */

const ROLE_TO_DASHBOARD_PATH: Record<string, string> = {
  admin: "/admin/dashboard",
  owner: "/owner/dashboard",
  manager: "/manager/dashboard",
  resident: "/resident/dashboard",
  guest: "/resident/dashboard",
  staff: "/staff/dashboard",
};

/* ============================================================
   NORMALIZE ROLE
============================================================ */

const normalizeRole = (
  role: string | null | undefined
): string => {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");
};

/* ============================================================
   GET DASHBOARD PATH
============================================================ */

const getDashboardPath = (
  roleName: string | null | undefined
): string | null => {
  const normalizedRole = normalizeRole(roleName);

  return (
    ROLE_TO_DASHBOARD_PATH[normalizedRole] ??
    null
  );
};

/* ============================================================
   COMPONENT
============================================================ */

const PGNavbar = () => {
  const {
    openModal,
    loginIntent,
    clearIntent,
  } = useAuthModal();

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  /* ==========================================================
     USER ROLES STORE
  ========================================================== */

  const {
    userRolesList,
    loading: rolesLoading,
    fetchUserRoles,
    resetUserRoles,
  } = useUserRolesStore();

  /* ==========================================================
     LOCAL STATE
  ========================================================== */

  const [addPgOpen, setAddPgOpen] = useState(false);

  /* ============================================================
     FETCH USER ROLES
  ============================================================ */

  useEffect(() => {
    if (!user?.id) {
      resetUserRoles();
      return;
    }

    fetchUserRoles({
      user_id: user.id,
    });
  }, [
    user?.id,
    fetchUserRoles,
    resetUserRoles,
  ]);

  /* ============================================================
     DEBUG
  ============================================================ */

  useEffect(() => {
    console.log(
      "========== PG NAVBAR =========="
    );

    console.log("USER:", user);

    console.log(
      "USER ID:",
      user?.id
    );

    console.log(
      "USER ROLES:",
      userRolesList
    );

    console.log(
      "ROLE:",
      userRolesList?.[0]?.role
    );

    console.log(
      "ROLE ID:",
      userRolesList?.[0]?.role_id
    );

    console.log(
      "ROLES LOADING:",
      rolesLoading
    );

    console.log(
      "================================"
    );
  }, [
    user,
    userRolesList,
    rolesLoading,
  ]);

  /* ============================================================
     ACTIVE ROLE
  ============================================================ */

  const activePgRole =
    userRolesList.find(
      (role) =>
        Number(role.is_active) === 1
    ) ||
    userRolesList[0] ||
    null;

  const roleName =
    activePgRole?.role || null;

  const dashboardPath =
    getDashboardPath(roleName);

  const hasPgRole =
    !!activePgRole &&
    !!dashboardPath;

  /* ============================================================
     RESTORE LAST ROUTE
  ============================================================ */

  useEffect(() => {
    const savedPath =
      sessionStorage.getItem(
        ROUTE_STORAGE_KEY
      );

    if (
      savedPath &&
      savedPath !== location.pathname &&
      !EXCLUDED_RESTORE_PATHS.includes(
        savedPath
      )
    ) {
      navigate(savedPath, {
        replace: true,
      });
    }
  }, []);

  /* ============================================================
     SAVE CURRENT ROUTE
  ============================================================ */

  useEffect(() => {
    if (
      !EXCLUDED_RESTORE_PATHS.includes(
        location.pathname
      )
    ) {
      sessionStorage.setItem(
        ROUTE_STORAGE_KEY,
        location.pathname
      );
    }
  }, [location.pathname]);

  /* ============================================================
     CLEAR ROUTE ON LOGOUT
  ============================================================ */

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem(
        ROUTE_STORAGE_KEY
      );
    }
  }, [user]);

  /* ============================================================
     NAVIGATE TO DASHBOARD
  ============================================================ */

  const navigateToDashboard = async () => {
    if (!user?.id) {
      return;
    }

    /*
      Get the latest roles from the store.
    */

    let roles =
      useUserRolesStore.getState()
        .userRolesList;

    /*
      If roles haven't loaded yet, fetch them.
    */

    if (!roles.length) {
      await fetchUserRoles({
        user_id: user.id,
      });

      roles =
        useUserRolesStore.getState()
          .userRolesList;
    }

    /*
      Find active role.
    */

    const activeRole =
      roles.find(
        (role) =>
          Number(role.is_active) === 1
      ) ||
      roles[0];

    if (!activeRole) {
      console.warn(
        "No user role found."
      );

      return;
    }

    /*
      Get dashboard path.

      Example:

      Resident → /resident/dashboard
      Owner    → /owner/dashboard
      Manager  → /manager/dashboard
      Staff    → /staff/dashboard
      Admin    → /admin/dashboard
    */

    const path =
      getDashboardPath(
        activeRole.role
      );

    if (!path) {
      console.warn(
        "No dashboard route found for role:",
        activeRole.role
      );

      return;
    }

    console.log(
      "Navigating to:",
      path
    );

    navigate(path);
  };

  /* ============================================================
     POST LOGIN INTENT
  ============================================================ */

  useEffect(() => {
    if (
      !user ||
      loginIntent === null
    ) {
      return;
    }

    /*
      LIST PG
    */

    if (
      loginIntent === "list_pg"
    ) {
      clearIntent();

      setAddPgOpen(true);

      return;
    }

    /*
      NORMAL LOGIN
    */

    if (
      loginIntent === "normal"
    ) {
      /*
        Don't clear the intent until roles are ready.
      */

      if (rolesLoading) {
        return;
      }

      clearIntent();

      navigateToDashboard();
    }
  }, [
    user,
    loginIntent,
    rolesLoading,
    userRolesList,
  ]);

  /* ============================================================
     LIST PG
  ============================================================ */

  const handleListPgClick = () => {
    if (!user) {
      openModal("list_pg");
      return;
    }

    setAddPgOpen(true);
  };

  /* ============================================================
     NAVBAR MENU ITEMS
  ============================================================ */

  const getMenuItems = () => {
    if (
      !user ||
      rolesLoading ||
      !hasPgRole
    ) {
      return [];
    }

    return [
      {
        label: "Dashboard",

        onClick: navigateToDashboard,

        className:
          "text-white hover:text-gray-300 font-medium cursor-pointer",
      },
    ];
  };

  /* ============================================================
     LIST PG BUTTON
  ============================================================ */

  const listPgButton = {
    label: (
      <span
        onClick={handleListPgClick}
        className="
          bg-gradient-to-r
          from-[#605BFF]
          to-[#4f46e5]
          text-white
          font-semibold
          px-6
          py-2
          rounded-xl
          shadow-md
          hover:opacity-90
          transition
          cursor-pointer
          select-none
        "
      >
        List Your PG
      </span>
    ),
  };

  /* ============================================================
     RIGHT ITEMS
  ============================================================ */

  const getRightItems = () => {
    if (user) {
      return [
        {
          label: `Welcome, ${user.name}`,

          className:
            "text-white font-medium",
        },

        listPgButton,

        {
          label: "Logout",

          onClick: logout,

          className:
            "text-white hover:text-gray-300 cursor-pointer",
        },
      ];
    }

    return [
      {
        label: "Login",

        onClick: () =>
          openModal("normal"),

        className:
          "text-white hover:text-gray-300 cursor-pointer",
      },

      listPgButton,
    ];
  };

  /* ============================================================
     RENDER
  ============================================================ */

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
      />

      {/*
        Add PG modal can be added here when required.

        Example:

        {user && (
          <AddPgModal
            open={addPgOpen}
            onClose={() => setAddPgOpen(false)}
            defaultStatusId={1}
            onSuccess={() => {
              setAddPgOpen(false);
            }}
          />
        )}
      */}
    </>
  );
};

export default PGNavbar;
