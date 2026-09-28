


import React, { JSX, useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Megaphone,
  MessageSquare,
  PlayCircle,
  Search,
  Settings,
  UserCog,
  Users,
  Wallet,
  Wrench,
  X,
  CalendarDays,
  ClipboardCheck,
  FileText,
  User,
} from "lucide-react";

import MobileBottomNav from "@/app/shared/components/MobileBottomNav";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assests/logo.png";

import { PG_BASE } from "@/config/constants";

import { useAuth } from "@/hooks/context/AuthContext";

// import { useTaskFilter } from "../../roles/staff/context/TaskFilterContext";
// import type { FilterType } from "../../roles/staff/context/TaskFilterContext";

import { usePgInfoStore } from "../store/pgInfoStore";
import { useSelectedPgStore } from "../store/selectedPgStore";

import type { PgInfo } from "../services/api/commonApiServices";

/* ========================================================================= */
/* PG Dropdown — Owner only                                                   */
/* ========================================================================= */

function PgSelectorDropdown({
  isOpen: sidebarOpen,
}: {
  isOpen: boolean;
}) {
  const { user } = useAuth() as { user: any };

  const {
    pgInfoList,
    loading,
    fetchPgInfo,
  } = usePgInfoStore();

  const {
    selectedPg,
    setSelectedPg,
  } = useSelectedPgStore();

  const [dropOpen, setDropOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const dropRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /* ----------------------------------------------------------------------- */
  /* Fetch owner's PGs                                                       */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (user?.id) {
      fetchPgInfo({
        pg_owner: Number(user.id),
      });
    }
  }, [user?.id, fetchPgInfo]);

  /* ----------------------------------------------------------------------- */
  /* Restore selected PG                                                     */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (pgInfoList.length === 0) {
      return;
    }

    const {
      selectedPgId,
    } = useSelectedPgStore.getState();

    if (selectedPgId) {
      const match =
        pgInfoList.find(
          (p) =>
            p.id === selectedPgId
        );

      if (match) {
        setSelectedPg(match);
        return;
      }
    }

    if (!selectedPg) {
      setSelectedPg(
        pgInfoList[0]
      );
    }
  }, [
    pgInfoList,
    selectedPg,
    setSelectedPg,
  ]);

  /* ----------------------------------------------------------------------- */
  /* Close dropdown on outside click                                         */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropRef.current &&
        !dropRef.current.contains(
          e.target as Node
        )
      ) {
        setDropOpen(false);
        setQuery("");
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  /* ----------------------------------------------------------------------- */
  /* Focus search input                                                      */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (dropOpen) {
      setTimeout(
        () =>
          inputRef.current?.focus(),
        50
      );
    }
  }, [dropOpen]);

  /* ----------------------------------------------------------------------- */
  /* Filter PGs                                                              */
  /* ----------------------------------------------------------------------- */

  const filtered =
    pgInfoList.filter(
      (pg) =>
        pg.pg_name
          ?.toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
        pg.city
          ?.toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
        pg.pg_major_area
          ?.toLowerCase()
          .includes(
            query.toLowerCase()
          )
    );

  /* ----------------------------------------------------------------------- */
  /* Select PG                                                               */
  /* ----------------------------------------------------------------------- */

  const handleSelect = (
    pg: PgInfo
  ) => {
    setSelectedPg(pg);
    setDropOpen(false);
    setQuery("");
  };

  /* ----------------------------------------------------------------------- */
  /* Collapsed sidebar                                                       */
  /* ----------------------------------------------------------------------- */

  if (!sidebarOpen) {
    return (
      <div
        className="relative flex justify-center"
        ref={dropRef}
      >
        <button
          onClick={() =>
            setDropOpen(
              (s) => !s
            )
          }
          title={
            selectedPg?.pg_name ??
            "Select PG"
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 transition-colors hover:bg-blue-100"
        >
          <Building2
            size={16}
            className="text-blue-600"
          />
        </button>

        {dropOpen && (
          <div className="absolute left-14 top-0 z-[200] w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            <PgDropdownContent
              query={query}
              setQuery={setQuery}
              filtered={filtered}
              loading={loading}
              selectedPg={selectedPg}
              onSelect={handleSelect}
              inputRef={inputRef}
            />
          </div>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------------------------- */
  /* Expanded sidebar                                                        */
  /* ----------------------------------------------------------------------- */

  return (
    <div
      className="relative"
      ref={dropRef}
    >
      <button
        onClick={() =>
          setDropOpen(
            (s) => !s
          )
        }
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-xl
          border
          border-gray-200
          bg-white
          px-2.5
          py-[clamp(0.3rem,0.8vh,0.5rem)]
          shadow-sm
          transition-colors
          hover:bg-gray-50
        "
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Building2
            size={14}
            className="text-blue-600"
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          {loading ? (
            <span className="text-xs text-gray-400">
              Loading…
            </span>
          ) : selectedPg ? (
            <p className="truncate text-sm font-semibold leading-tight text-gray-900">
              {selectedPg.pg_name}
            </p>
          ) : (
            <span className="text-xs text-gray-400">
              Select a PG
            </span>
          )}
        </div>

        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            dropOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {dropOpen && (
        <div className="absolute left-0 right-0 top-full z-[200] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <PgDropdownContent
            query={query}
            setQuery={setQuery}
            filtered={filtered}
            loading={loading}
            selectedPg={selectedPg}
            onSelect={handleSelect}
            inputRef={inputRef}
          />
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* PG Dropdown Content                                                       */
/* ========================================================================= */

function PgDropdownContent({
  query,
  setQuery,
  filtered,
  loading,
  selectedPg,
  onSelect,
  inputRef,
}: {
  query: string;
  setQuery: (q: string) => void;
  filtered: PgInfo[];
  loading: boolean;
  selectedPg: PgInfo | null;
  onSelect: (pg: PgInfo) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      <div className="relative px-2 pb-1 pt-2">
        <Search
          size={12}
          className="pointer-events-none absolute left-4 top-[14px] text-gray-400"
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search PGs…"
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-7 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {query && (
          <button
            onClick={() =>
              setQuery("")
            }
            className="absolute right-4 top-[14px] text-gray-400 hover:text-gray-600"
          >
            <X size={11} />
          </button>
        )}
      </div>

      <ul className="max-h-52 overflow-y-auto py-1">
        {loading ? (
          <li className="px-3 py-3 text-center text-xs text-gray-400">
            Loading…
          </li>
        ) : filtered.length ===
          0 ? (
          <li className="px-3 py-3 text-center text-xs text-gray-400">
            No PGs found
          </li>
        ) : (
          filtered.map(
            (pg) => {
              const isSelected =
                selectedPg?.id ===
                pg.id;

              return (
                <li
                  key={pg.id}
                >
                  <button
                    onClick={() =>
                      onSelect(pg)
                    }
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        pg.rstatus ===
                        1
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-xs font-medium ${
                          isSelected
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {
                          pg.pg_name
                        }
                      </p>

                      {(
                        pg.city ||
                        pg.pg_major_area
                      ) && (
                        <p className="truncate text-[10px] text-gray-500">
                          {[
                            pg.pg_major_area,
                            pg.city,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            )}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        size={11}
                        className="ml-auto flex-shrink-0 text-blue-600"
                      />
                    )}
                  </button>
                </li>
              );
            }
          )
        )}
      </ul>

      {!loading &&
        filtered.length >
          0 && (
          <div className="border-t border-gray-100 px-3 py-1.5 text-[10px] text-gray-400">
            {filtered.length} PG
            {filtered.length !==
            1
              ? "s"
              : ""}
            {query
              ? " matched"
              : " total"}
          </div>
        )}
    </>
  );
}

/* ========================================================================= */
/* Types                                                                     */
/* ========================================================================= */

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

/* ========================================================================= */
/* Main Navbar                                                               */
/* ========================================================================= */

export default function Navbar({
  isOpen,
  setIsOpen,
}: NavbarProps) {
  const [
    viewportW,
    setViewportW,
  ] = useState<number>(
    typeof window !==
      "undefined"
      ? window.innerWidth
      : 1024
  );

  const isDesktop =
    viewportW >= 1024;

  const {
    user,
    logout,
  } = useAuth() as {
    user: any;
    logout?: () => void;
  };

  /* ----------------------------------------------------------------------- */
  /* Role                                                                    */
  /* ----------------------------------------------------------------------- */

  const roleName = (
    user?.roleName || ""
  ).toUpperCase();

  const userRole =
    roleName.toLowerCase();

  const isOwnerUser =
    roleName === "OWNER";

  const isResidentUser =
    roleName === "RESIDENT";

  const isManagerUser =
    roleName === "MANAGER";

  

  /* ----------------------------------------------------------------------- */
  /* User information                                                        */
  /* ----------------------------------------------------------------------- */

  const displayName: string =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const displayRole: string =
    roleName
      ? roleName.charAt(0) +
        roleName
          .slice(1)
          .toLowerCase()
      : "";

  const avatarUrl:
    | string
    | undefined =
    user?.profileImage ||
    user?.avatarUrl;

  // /* ----------------------------------------------------------------------- */
  // /* Task filter                                                              */
  // /* ----------------------------------------------------------------------- */

  // const taskFilter =
  //   useTaskFilter();

  // const currentFilter =
  //   taskFilter?.currentFilter ??
  //   "my-tasks";

  // const setCurrentFilter =
  //   taskFilter?.setCurrentFilter ??
  //   (() => {});

  // const taskCounts =
  //   taskFilter?.taskCounts ?? {
  //     pending: 0,
  //     inProgress: 0,
  //     completed: 0,
  //   };

  /* ----------------------------------------------------------------------- */
  /* Navigation                                                               */
  /* ----------------------------------------------------------------------- */

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    isMyTasksExpanded,
    setIsMyTasksExpanded,
  ] = useState<boolean>(true);

  const [
    showMoreSheet,
    setShowMoreSheet,
  ] = useState<boolean>(false);

  /* ----------------------------------------------------------------------- */
  /* Resize                                                                   */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    const handleResize =
      () =>
        setViewportW(
          window.innerWidth
        );

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  /* ----------------------------------------------------------------------- */
  /* Close desktop sidebar when switching to mobile                          */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !isDesktop &&
      isOpen
    ) {
      setIsOpen(false);
    }
  }, [
    viewportW,
    isOpen,
    isDesktop,
    setIsOpen,
  ]);

  /* ========================================================================= */
  /* ROLE-BASED NAVIGATION                                                     */
  /* ========================================================================= */

  /*
   * OWNER
   * -----
   * Existing owner navigation remains unchanged.
   */
  const ownerNavItems: NavItem[] =
    [
      {
        to: `/owner/dashboard`,
        label: "Dashboard",
        icon: (
          <Home className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/bedmap`,
        label: "Beds & Rooms",
        icon: (
          <BedDouble className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/vacancy-pipeline`,
        label: "Enquiries",
        icon: (
          <MessageSquare className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/residents`,
        label: "Residents",
        icon: (
          <Users className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/rent-status`,
        label: "Rent Status",
        icon: (
          <Wallet className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/issues`,
        label: "Issues",
        icon: (
          <AlertTriangle className="w-5 h-5" />
        ),
      },
     
      {
        to: `/owner/broadcast`,
        label: "Broadcast",
        icon: (
          <Megaphone className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/reports`,
        label: "Reports",
        icon: (
          <ClipboardList className="w-5 h-5" />
        ),
      },
      {
        to: `/owner/settings`,
        label: "Settings",
        icon: (
          <Settings className="w-5 h-5" />
        ),
      },
    ];

  /*
   * RESIDENT
   * --------
   * Resident-specific navigation.
   */
  const residentNavItems: NavItem[] =
    [
      {
        to: `/resident/dashboard`,
        label: "Dashboard",
        icon: (
          <Home className="w-5 h-5" />
        ),
      },
      {
        to: `/resident/mystay`,
        label: "My Stay",
        icon: (
          <BedDouble className="w-5 h-5" />
        ),
      },
      {
        to: `/resident/requests`,
        label: "My Requests",
        icon: (
          <Wrench className="w-5 h-5" />
        ),
      },
      {
        to: `/resident/announcements`,
        label: "Announcements",
        icon: (
          <Megaphone className="w-5 h-5" />
        ),
      },
      {
        to: `/resident/rent`,
        label: "Rent Status",
        icon: (
          <Wallet className="w-5 h-5" />
        ),
      },
      
    ];

  /*
   * MANAGER
   * -------
   * Manager-specific navigation.
   */
  const managerNavItems: NavItem[] =
    [
      {
        to: `/manager/dashboard`,
        label: "Dashboard",
        icon: (
          <Home className="w-5 h-5" />
        ),
      },
      {
        to: `/manager/check-ins-checkouts`,
        label: "Check-ins & Check-outs",
        icon: (
          <CalendarDays className="w-5 h-5" />
        ),
      },
      {
        to: `/manager/rent-status`,
        label: "Rent Status",
        icon: (
          <Wallet className="w-5 h-5" />
        ),
      },
      {
        to: `/manager/broadcast`,
        label: "Broadcast",
        icon: (
          <Megaphone className="w-5 h-5" />
        ),
      },
      {
        to: `/manager/issues`,
        label: "Issues",
        icon: (
          <AlertTriangle className="w-5 h-5" />
        ),
      },
      {
        to: `/manager/bedmap`,
        label: "Beds & Rooms",
        icon: (
          <BedDouble className="w-5 h-5" />
        ),
      },
    ];

  /*
   * Select navigation based on role.
   *
   * OWNER  -> ownerNavItems
   * RESIDENT -> residentNavItems
   * MANAGER -> managerNavItems
   */
  const fullNavItems: NavItem[] =
    isResidentUser
      ? residentNavItems
      : isManagerUser
      ? managerNavItems
      : ownerNavItems;

  /*
   * Guests get only Dashboard.
   *
   * Keeping this here means the old behavior remains available
   * if GUEST still exists in the application.
   */
  const sidebarNavItems: NavItem[] =
    roleName === "GUEST"
      ? fullNavItems.filter(
          (item) =>
            item.label ===
            "Dashboard"
        )
      : fullNavItems;

  /* ========================================================================= */
  /* Bottom items                                                              */
  /* ========================================================================= */

  const bottomStaticItems: NavItem[] =
    isResidentUser
      ? [
          {
            to: `/resident/profile-settings`,
            label: "Profile & Support",
            icon: (
              <User className="w-5 h-5" />
            ),
          },
        ]
      : [
          {
            to: `/${userRole}/help-support`,
            label: "Help & Support",
            icon: (
              <HelpCircle className="w-5 h-5" />
            ),
          },
        ];

 
  /* ========================================================================= */
  /* More sheet                                                                */
  /* ========================================================================= */

 const moreSheetItems: NavItem[] = isResidentUser
  ? [
      {
        to: "/resident/rent",
        label: "Rent",
        icon: <Wallet className="w-5 h-5" />,
      },
      {
        to: "/resident/profile-settings",
        label: "Profile & Support",
        icon: <UserCog className="w-5 h-5" />,
      },
    ]
  : isManagerUser
    ? [
        {
          to: "/manager/rent-status",
          label: "Rent Status",
          icon: <Wallet className="w-5 h-5" />,
        },
        {
          to: "/manager/broadcast",
          label: "Broadcast",
          icon: <Megaphone className="w-5 h-5" />,
        },
        {
          to: "/manager/bedmap",
          label: "Bedmap",
          icon: <BedDouble className="w-5 h-5" />,
        },
      ]
    : [
        {
          to: `/${userRole}/vacancy-pipeline`,
          label: "Enquiries",
          icon: <MessageSquare className="w-5 h-5" />,
        },
        {
          to: `/${userRole}/rent-status`,
          label: "Rent Status",
          icon: <Wallet className="w-5 h-5" />,
        },
       
        {
          to: `/${userRole}/broadcast`,
          label: "Broadcast",
          icon: <Megaphone className="w-5 h-5" />,
        },
        {
          to: `/${userRole}/reports`,
          label: "Reports",
          icon: <ClipboardList className="w-5 h-5" />,
        },
        {
          to: `/${userRole}/settings`,
          label: "Settings",
          icon: <Settings className="w-5 h-5" />,
        },
      ];

  /* ========================================================================= */
  /* Logout                                                                    */
  /* ========================================================================= */

  const handleLogout = () => {
    setShowMoreSheet(false);
    logout?.();
  };

  /* ========================================================================= */
  /* Avatar                                                                    */
  /* ========================================================================= */

  const AvatarCircle = ({
    size = "w-14 h-14",
    textSize = "text-lg",
  }: {
    size?: string;
    textSize?: string;
  }) => (
    <div
      className={`${size} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600 ${textSize}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        displayName
          .charAt(0)
          .toUpperCase()
      )}
    </div>
  );

  /* ========================================================================= */
  /* MOBILE                                                                    */
  /* ========================================================================= */

  if (!isDesktop) {
    const currentPath =
      location.pathname;

    /*
     * Mobile active tab is also role-aware.
     */
    const activeMobileTab =
      currentPath.includes(
        "/dashboard"
      )
        ? "home"
        : currentPath.includes(
            "/bedmap"
          ) ||
          currentPath.includes(
            "/beds-rooms"
          )
        ? "beds"
        : currentPath.includes(
            "/issues"
          )
        ? "issues"
        : currentPath.includes(
            "/residents"
          )
        ? "residents"
        : "more";

    /*
     * Resident mobile navigation
     */
    if (isResidentUser) {
      return (
        <>
          <MobileBottomNav
            active={
              activeMobileTab
            }
            onHome={() =>
              navigate(
                "/resident/dashboard"
              )
            }
            onBeds={() =>
              navigate(
                "/resident/mystay"
              )
            }
            onIssues={() =>
              navigate(
                "/resident/requests"
              )
            }
            onResidents={() =>
              navigate(
                "/resident/announcements"
              )
            }
            onMore={() =>
              setShowMoreSheet(
                true
              )
            }
          />

          {showMoreSheet && (
  <div className="fixed inset-0 z-[60]">
    {/* backdrop */}
    
    <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white">
      
      {moreSheetItems.map((item) => (
        <button
  key={item.to}
  type="button"
  onClick={() => {
    setShowMoreSheet(false);
    navigate(item.to);
  }}
  className="
    flex
    w-full
    items-center
    gap-3
    px-4
    py-2.5
    text-left
    transition-colors
    hover:bg-gray-50
  "
>
  <span className="text-gray-600">
    {React.cloneElement(item.icon, {
      className: "h-3 w-3",
    })}
  </span>

  <span className="text-[13px] font-medium text-gray-700">
    {item.label}
  </span>
</button>
      ))}

      {/* Logout */}
    <button
  type="button"
  onClick={() => {
    setShowMoreSheet(false);
    handleLogout();
  }}
  className="
    flex
    w-full
    items-center
    gap-3
    border-t
    border-gray-100
    px-4
    py-2.5
    text-left
    transition-colors
    hover:bg-gray-50
  "
>
  <LogOut className="h-4 w-4 text-red-500" />

  <span className="text-[13px] font-medium text-red-500">
    Logout
  </span>
</button>

    </div>
  </div>
)}
        </>
      );
    }

    /*
     * Manager / Owner mobile navigation.
     *
     * Existing MobileBottomNav is retained.
     */
    return (
      <>
        <MobileBottomNav
          active={
            activeMobileTab
          }
          onHome={() =>
            navigate(
              `/${userRole}/dashboard`
            )
          }
          onBeds={() =>
            navigate(
              `/${userRole}/bedmap`
            )
          }
          onIssues={() =>
            navigate(
              `/${userRole}/issues`
            )
          }
          onResidents={() =>
            navigate(
              `/${userRole}/residents`
            )
          }
          onRent={() => navigate("/manager/rent-status")}
           onCheckIns={() => navigate("/manager/check-ins-checkouts")}
          onMore={() =>
            setShowMoreSheet(
              true
            )
          }
        />

      
{showMoreSheet && (
  <div className="fixed inset-0 z-[100]">
    {/* ============================================================
        BACKDROP
        - Clicking outside closes the sheet
       ============================================================ */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowMoreSheet(false)}
    />

    {/* ============================================================
        MORE SHEET
        - 57% viewport height
        - No scrolling
        - Compact spacing
        - All remaining role-specific items visible
       ============================================================ */}
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0

        h-[57vh]
        max-h-[60vh]

        overflow-hidden

        rounded-t-2xl
        border-t
        border-gray-100
        bg-white
        shadow-2xl

        pb-[env(safe-area-inset-bottom)]
      "
    >
      {/* ==========================================================
          HEADER
         ========================================================== */}
      <div
        className="
          flex
          h-[44px]
          items-center
          justify-between
          border-b
          border-gray-100
          px-3
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <AvatarCircle
            size="w-7 h-7"
            textSize="text-[10px]"
          />

          <div className="min-w-0">
            <p
              className="
                max-w-[180px]
                truncate
                text-[11px]
                font-semibold
                leading-none
                text-gray-900
              "
            >
              {displayName}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                leading-none
                text-gray-400
              "
            >
              {displayRole}
            </p>
          </div>
        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => setShowMoreSheet(false)}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            text-gray-500
            hover:bg-gray-100
            active:bg-gray-100
          "
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ==========================================================
          MORE ITEMS
          - Compact old design
          - No scrolling
          - Only remaining items for current role
         ========================================================== */}
      <div className="px-2 py-1">
        <ul className="flex flex-col gap-0">
          {moreSheetItems.map((item, idx) => (
            <li key={`${item.to}-${idx}`}>
              <button
                type="button"
                onClick={() => {
                  setShowMoreSheet(false);
                  navigate(item.to);
                }}
                className="
                  flex
                  h-[28px]
                  w-full
                  items-center
                  gap-2
                  rounded-md
                  px-2

                  text-left
                  text-gray-700

                  transition-colors
                  hover:bg-gray-50
                  active:bg-gray-100
                "
              >
                {/* ICON */}
                <span
                  className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-gray-50
                    text-gray-500
                  "
                >
                  {React.cloneElement(item.icon, {
                    className: "h-3 w-3",
                  })}
                </span>

                {/* LABEL */}
                <span
                  className="
                    truncate
                    text-[10px]
                    font-medium
                    leading-none
                  "
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}

          {/* ========================================================
              LOGOUT
             ======================================================== */}
          <li className="mt-1 border-t border-gray-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                h-[28px]
                w-full
                items-center
                gap-2
                rounded-md
                px-2

                text-red-500

                transition-colors
                hover:bg-red-50
                active:bg-red-50
              "
            >
              <span
                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  bg-red-50
                "
              >
                <LogOut className="h-3 w-3" />
              </span>

              <span
                className="
                  text-[10px]
                  font-medium
                  leading-none
                "
              >
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
)}

         



      </>
    );
  }

  /* ========================================================================= */
  /* DESKTOP                                                                    */
  /* ========================================================================= */

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        max-h-screen
        flex-col
        overflow-hidden
        border-r
        border-gray-100
        bg-white
        text-gray-900
        transition-all
        duration-300
        ${isOpen ? "w-60" : "w-16"}
      `}
    >
      {/* =================================================================== */}
      {/* Logo                                                                */}
      {/* =================================================================== */}

      <div className="p-3">
        {isOpen ? (
          <div className="flex items-center justify-between">
            <span
              className="cursor-pointer text-xl font-extrabold tracking-tight text-blue-600"
              onClick={() =>
                navigate(`/`)
              }
            >
              MyPG
            </span>

            <button
              onClick={() =>
                setIsOpen(
                  false
                )
              }
              className="rounded p-1 text-gray-400 transition hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span
              className="cursor-pointer text-xl font-extrabold text-blue-600"
              onClick={() =>
                navigate(`/`)
              }
            >
              M
            </span>

            <button
              onClick={() =>
                setIsOpen(
                  true
                )
              }
              className="flex cursor-pointer flex-col items-center justify-center space-y-1 rounded-lg p-2 transition hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <span className="block h-0.5 w-5 bg-gray-400" />
              <span className="block h-0.5 w-5 bg-gray-400" />
              <span className="block h-0.5 w-5 bg-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* Profile                                                             */}
      {/* =================================================================== */}

      <div
        className={`
          flex
          flex-col
          items-center
          border-b
          border-gray-100
          ${
            isOpen
              ? "pb-[clamp(0.4rem,1vh,1rem)]"
              : "pb-1"
          }
        `}
      >
        <AvatarCircle
          size="w-[clamp(2.25rem,5vh,3.5rem)] h-[clamp(2.25rem,5vh,3.5rem)]"
          textSize="text-[clamp(0.8rem,1.5vh,1.125rem)]"
        />

        {isOpen && (
          <>
            <p className="mt-[clamp(0.15rem,0.5vh,0.5rem)] max-w-[190px] truncate text-[clamp(0.7rem,1.5vh,0.875rem)] font-semibold text-gray-900">
              {displayName}
            </p>

            <p className="text-[clamp(0.6rem,1.2vh,0.75rem)] text-gray-400">
              {displayRole}
            </p>
          </>
        )}
      </div>

      {/* =================================================================== */}
      {/* PG Selector — OWNER ONLY                                            */}
      {/* =================================================================== */}

      {isOwnerUser && (
        <>
          <div
            className={`px-2 pb-2 pt-2 ${
              isOpen
                ? ""
                : "flex justify-center"
            }`}
          >
            <PgSelectorDropdown
              isOpen={isOpen}
            />
          </div>

          <div className="mx-3 mb-1 border-t border-gray-100" />
        </>
      )}

      {/* =================================================================== */}
      {/* Navigation                                                          */}
      {/* =================================================================== */}

      {/* <nav className="mt-1 min-h-0 flex-1 overflow-hidden">
        {canViewTaskFilters ? (
          <ul className="flex flex-col gap-[clamp(1px,0.35vh,4px)] px-2">
            <li>
              <button
                onClick={() => {
                  if (isOpen) {
                    setIsMyTasksExpanded(
                      (s) => !s
                    );
                  }

                  setCurrentFilter(
                    "my-tasks"
                  );
                }}
                className={`
                  relative
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  transition
                  hover:bg-gray-50
                  focus:outline-none
                  ${
                    !isOpen
                      ? "justify-center"
                      : "justify-between"
                  }
                  ${
                    currentFilter ===
                    "my-tasks"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  {isOpen && (
                    <span>
                      {isMyTasksExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}

                  <span>
                    <ClipboardList className="h-5 w-5" />
                  </span>

                  {isOpen && (
                    <span className="text-sm font-medium">
                      My Tasks
                    </span>
                  )}
                </span>
              </button>

              {isOpen &&
                isMyTasksExpanded && (
                  <ul className="ml-4 mt-1 flex flex-col space-y-1">
                    {myTasksSubItems.map(
                      (
                        sub,
                        idx
                      ) => {
                        const isActive =
                          currentFilter ===
                          sub.id;

                        return (
                          <li
                            key={
                              idx
                            }
                          >
                            <button
                              onClick={() =>
                                setCurrentFilter(
                                  sub.id
                                )
                              }
                              className={`
                                relative
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-3
                                py-2
                                transition
                                hover:bg-gray-50
                                focus:outline-none
                                ${
                                  isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600"
                                }
                              `}
                            >
                              <span className="flex items-center gap-3">
                                <span>
                                  {
                                    sub.icon
                                  }
                                </span>

                                <span className="text-sm">
                                  {
                                    sub.label
                                  }
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
            </li>
          </ul>
        ) : (
          <ul className="flex flex-col space-y-1 px-2">
            {sidebarNavItems.map(
              (
                item,
                idx
              ) => {
                const isActive =
                  location.pathname ===
                  item.to;

                return (
                  <li
                    key={
                      idx
                    }
                  >
                    <NavLink
                      to={item.to}
                      end={
                        item.label ===
                        "Dashboard"
                      }
                      title={
                        !isOpen
                          ? item.label
                          : undefined
                      }
                      className={`
                        flex
                        items-center
                        gap-[clamp(0.45rem,0.8vh,0.75rem)]
                        rounded-lg
                        px-3
                        py-[clamp(0.28rem,0.8vh,0.625rem)]
                        text-[clamp(0.7rem,1.6vh,0.875rem)]
                        font-medium
                        transition-colors
                        ${
                          !isOpen
                            ? "justify-center"
                            : ""
                        }
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <span className="flex-shrink-0 [&>svg]:h-[clamp(1rem,2vh,1.25rem)] [&>svg]:w-[clamp(1rem,2vh,1.25rem)]">
                        {
                          item.icon
                        }
                      </span>

                      {isOpen && (
                        <span>
                          {
                            item.label
                          }
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              }
            )}
          </ul>
        )}
      </nav> */}

      {/* =================================================================== */}
      {/* Bottom Navigation                                                    */}
      {/* =================================================================== */}

      <div className="border-t border-gray-100 px-2 py-[clamp(0.2rem,0.6vh,0.5rem)]">
        <ul className="flex flex-col gap-[clamp(1px,0.25vh,3px)]">

          {bottomStaticItems.map(
            (
              item,
              idx
            ) => (
              <li
                key={idx}
              >
                <NavLink
                  to={item.to}
                  title={
                    !isOpen
                      ? item.label
                      : undefined
                  }
                  className={`
                    flex
                    items-center
                    gap-[clamp(0.45rem,0.8vh,0.75rem)]
                    rounded-lg
                    px-3
                    py-[clamp(0.28rem,0.7vh,0.55rem)]
                    text-[clamp(0.7rem,1.5vh,0.875rem)]
                    font-medium
                    text-gray-500
                    transition-colors
                    hover:bg-gray-50
                    ${
                      !isOpen
                        ? "justify-center"
                        : ""
                    }
                  `}
                >
                  <span className="flex-shrink-0 [&>svg]:h-[clamp(1rem,2vh,1.25rem)] [&>svg]:w-[clamp(1rem,2vh,1.25rem)]">
                    {
                      item.icon
                    }
                  </span>

                  {isOpen && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}
                </NavLink>
              </li>
            )
          )}

          {/* Logout */}
          <li>
            <button
              onClick={() =>
                logout?.()
              }
              title={
                !isOpen
                  ? "Logout"
                  : undefined
              }
              className={`
                flex
                w-full
                items-center
                gap-[clamp(0.45rem,0.8vh,0.75rem)]
                rounded-lg
                px-3
                py-[clamp(0.28rem,0.7vh,0.55rem)]
                text-[clamp(0.7rem,1.5vh,0.875rem)]
                font-medium
                text-red-500
                transition-colors
                hover:bg-red-50
                ${
                  !isOpen
                    ? "justify-center"
                    : ""
                }
              `}
            >
              <LogOut className="h-5 w-5" />

              {isOpen && (
                <span>
                  Logout
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}