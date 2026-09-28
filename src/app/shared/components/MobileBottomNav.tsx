// import React from "react";
// import {
//   Home,
//   BedDouble,
//   TriangleAlert,
//   Users,
//   MoreHorizontal,
// } from "lucide-react";

// interface MobileBottomNavProps {
//   active?: "home" | "beds" | "issues" | "residents" | "more";
//   onHome?: () => void;
//   onBeds?: () => void;
//   onIssues?: () => void;
//   onResidents?: () => void;
//   onMore?: () => void;
// }

// const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
//   active = "home",
//   onHome,
//   onBeds,
//   onIssues,
//   onResidents,
//   onMore,
// }) => {
//   const items = [
//     {
//       id: "home" as const,
//       label: "Dashboard",
//       icon: Home,
//       onClick: onHome,
//     },
//     {
//       id: "beds" as const,
//       label: "Beds",
//       icon: BedDouble,
//       onClick: onBeds,
//     },
//     {
//       id: "issues" as const,
//       label: "Issues",
//       icon: TriangleAlert,
//       onClick: onIssues,
//     },
//     {
//       id: "residents" as const,
//       label: "Residents",
//       icon: Users,
//       onClick: onResidents,
//     },
//     {
//       id: "more" as const,
//       label: "More",
//       icon: MoreHorizontal,
//       onClick: onMore,
//     },
//   ];

//   return (
//     <nav
//   className="
//     fixed
//     bottom-0
//     left-0
//     right-0
//     z-50
//     border-t
//     border-[#E2E5EA]
//     bg-white
//     pb-[env(safe-area-inset-bottom)]
//   "
// >
//   <div
//     className="
//       mx-auto
//       flex
//       h-[53px]
//       max-w-[900px]
//       items-center
//       justify-around
//       px-2
//     "
//   >

//     {items.map((item) => {
//       const Icon = item.icon;
//       const isActive = active === item.id;

//       return (
//         <button
//           key={item.id}
//           type="button"
//           onClick={item.onClick}
//           className="
//             flex
//             min-w-[45px]
//             flex-col
//             items-center
//             justify-center
//             gap-0.5
//           "
//         >

//           <Icon
//             size={19}
//             strokeWidth={isActive ? 2.4 : 1.9}
//             className={
//               isActive
//                 ? "text-[#2563D9]"
//                 : "text-[#707782]"
//             }
//             fill={
//               item.id === "home" && isActive
//                 ? "#2563D9"
//                 : "none"
//             }
//           />

//           <span
//             className={`
//               text-[8px]

//               ${
//                 isActive
//                   ? "font-medium text-[#2563D9]"
//                   : "text-[#707782]"
//               }
//             `}
//           >
//             {item.label}
//           </span>

//         </button>
//       );
//     })}

//   </div>
// </nav>
//   );
// };

// export default MobileBottomNav;






import React from "react";
import {
  Home,
  BedDouble,
  TriangleAlert,
  Users,
  MoreHorizontal,
  ClipboardList,
  Megaphone,
  Wallet,
  LogIn,
} from "lucide-react";

import { useAuth } from "@/hooks/context/AuthContext";

interface MobileBottomNavProps {
  active?: "home" | "beds" | "issues" | "residents" | "more";

  onHome?: () => void;
  onBeds?: () => void;
  onIssues?: () => void;
  onResidents?: () => void;
   onRent?: () => void;
   onCheckIns?: () => void;
  onMore?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  active = "home",
  onHome,
  onBeds,
  onIssues,
  onResidents,
    onRent,
  onCheckIns,
  onMore,
}) => {
  const { user } = useAuth() as {
    user?: {
      roleName?: string;
    };
  };

  const roleName = (user?.roleName || "").toUpperCase();

  /*
   * OWNER
   * Dashboard | Beds | Issues | Residents | More
   */
  const ownerItems = [
    {
      id: "home" as const,
      label: "Dashboard",
      icon: Home,
      onClick: onHome,
    },
    {
      id: "beds" as const,
      label: "Beds",
      icon: BedDouble,
      onClick: onBeds,
    },
    {
      id: "issues" as const,
      label: "Issues",
      icon: TriangleAlert,
      onClick: onIssues,
    },
    {
      id: "residents" as const,
      label: "Residents",
      icon: Users,
      onClick: onResidents,
    },
    {
      id: "more" as const,
      label: "More",
      icon: MoreHorizontal,
      onClick: onMore,
    },
  ];

  /*
   * RESIDENT
   * Dashboard | My Stay | Requests | Announcements | More
   */
  const residentItems = [
    {
      id: "home" as const,
      label: "Dashboard",
      icon: Home,
      onClick: onHome,
    },
    {
      id: "beds" as const,
      label: "My Stay",
      icon: BedDouble,
      onClick: onBeds,
    },
    {
      id: "issues" as const,
      label: "My Requests",
      icon: ClipboardList,
      onClick: onIssues,
    },
    {
      id: "residents" as const,
      label: "Announcements",
      icon: Megaphone,
      onClick: onResidents,
    },
    {
      id: "more" as const,
      label: "More",
      icon: MoreHorizontal,
      onClick: onMore,
    },
  ];

  /*
   * MANAGER
   * Dashboard | Check-ins | Rent | Issues | More
   */
  const managerItems = [
    {
      id: "home" as const,
      label: "Dashboard",
      icon: Home,
      onClick: onHome,
    },
    {
      id: "beds" as const,
      label: "Check-ins",
      icon: LogIn,
      onClick: onCheckIns,
    },
    {
      id: "issues" as const,
      label: "Issues",
      icon: TriangleAlert,
      onClick: onIssues,
    },
    {
    id: "residents" as const,
    label: "Rent",
    icon: Wallet,
    onClick: onRent,
  },
    {
      id: "more" as const,
      label: "More",
      icon: MoreHorizontal,
      onClick: onMore,
    },
  ];

  /*
   * Select navigation based on the actual logged-in user's role.
   */
  let items;

  if (roleName === "RESIDENT") {
    items = residentItems;
  } else if (roleName === "MANAGER") {
    items = managerItems;
  } else {
    items = ownerItems;
  }

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-[#E2E5EA]
        bg-white
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[53px]
          max-w-[900px]
          items-center
          justify-around
          px-2
        "
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="
                flex
                min-w-[45px]
                flex-col
                items-center
                justify-center
                gap-0.5
              "
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.4 : 1.9}
                className={
                  isActive
                    ? "text-[#2563D9]"
                    : "text-[#707782]"
                }
                fill={
                  item.id === "home" && isActive
                    ? "#2563D9"
                    : "none"
                }
              />

              <span
                className={`
                  text-[8px]
                  ${
                    isActive
                      ? "font-medium text-[#2563D9]"
                      : "text-[#707782]"
                  }
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
