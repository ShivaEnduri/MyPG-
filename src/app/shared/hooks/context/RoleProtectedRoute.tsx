

//testing
import React from "react";
import { Outlet } from "react-router-dom";

export const RoleProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return children ? children : <Outlet />;
};



// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useUserRolesStore } from "@/app/shared/store/userRolesStore";

// interface RoleProtectedRouteProps {
//   allowedRoles: string[];
// }

// export const RoleProtectedRoute = ({
//   allowedRoles,
// }: RoleProtectedRouteProps) => {
//   const location = useLocation();

//   const { userRolesList, loading } = useUserRolesStore();

//   if (loading) {
//     return null;
//   }

//   const hasAccess = userRolesList.some((role) =>
//     allowedRoles.includes(role.role_name)
//   );

//   if (!hasAccess) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         replace
//         state={{ from: location.pathname }}
//       />
//     );
//   }

//   return <Outlet />;
// };