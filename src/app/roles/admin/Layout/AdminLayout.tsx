// import '../../../shared/styles/admin-tokens.css';
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   Users,
//   ClipboardList,
//   Table,
//   Plus,
//   CreditCard,
//   BarChart3,
//   Settings,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   Database
// } from "lucide-react";

// import { PG_BASE } from "@/config/constants";
// import { useState } from "react";
// import { useTables } from "../contexts/TablesContext";
// import "../../../shared/styles/admin-tokens.css"

// const navItems = [
//   { path: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { path: "pgs", label: "PGs", icon: Building2 },
//   { path: "admin/requests", label: "Requests", icon: ClipboardList },
//   {
//     path: "/base/pg/admin/tables",
//     label: "Users",
//     icon: Table,
//     subItems: [
//       { path: "/base/pg/admin/tables/owners", label: "Owners" },
//       { path: "/base/pg/admin/tables/managers", label: "Managers" },
//       { path: "/base/pg/admin/tables/guests", label: "Guests" },
//       { path: "/base/pg/admin/tables/staff", label: "Staff" },
//       { path: "/base/pg/admin/tables/vendors", label: "Vendors" },
//     ]
//   },
//   { path: "/base/pg/admin/add-amenities", label: "Add Amenities", icon: Plus },
//   { path: "/base/pg/admin/payments", label: "Payments", icon: CreditCard },
//   { path: "/base/pg/admin/reports", label: "Reports", icon: BarChart3 },
//   { path: "/base/pg/admin/settings", label: "Settings", icon: Settings },
// ];

// export function AdminLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { tables } = useTables();
//   const [tablesOpen, setTablesOpen] = useState(location.pathname.startsWith("/base/pg/admin/tables"));
//   const [customTablesOpen, setCustomTablesOpen] = useState(location.pathname.startsWith("/base/pg/admin/custom-table"));
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Mobile Header */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#001433] border-b border-blue-900 z-30 px-4 py-3 flex items-center justify-between">
//         <img src="/RUFRENT6.png" alt="RUFRENT" className="h-6" onClick={() => navigate(`${PG_BASE}`)}/>
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="text-white p-2"
//         >
//           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         w-64 bg-[#001433] border-r border-blue-900 flex flex-col
//         fixed lg:static inset-y-0 left-0 z-50
//         transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         {/* Logo */}
//         <div className="p-6 border-b border-blue-900">
//           <div className="flex items-center gap-2">
//             <img src="/RUFRENT6.png" alt="RUFRENT" className="h-8" onClick={() => navigate(`${PG_BASE}`)}/>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 overflow-y-auto">
//           <ul className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               const isParentActive = item.subItems && location.pathname.startsWith(item.path);

//               if (item.subItems) {
//                 return (
//                   <li key={item.path}>
//                     <button
//                       onClick={() => setTablesOpen(!tablesOpen)}
//                       className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
//                         isParentActive
//                           ? "bg-blue-700 text-white"
//                           : "text-blue-100 hover:bg-blue-800"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <Icon className="w-5 h-5" />
//                         <span className="font-medium">{item.label}</span>
//                       </div>
//                       {tablesOpen ? (
//                         <ChevronDown className="w-4 h-4" />
//                       ) : (
//                         <ChevronRight className="w-4 h-4" />
//                       )}
//                     </button>
//                     {tablesOpen && (
//                       <ul className="mt-1 ml-4 space-y-1">
//                         {item.subItems.map((subItem) => {
//                           const isSubActive = location.pathname === subItem.path;
//                           return (
//                             <li key={subItem.path}>
//                               <Link
//                                 to={subItem.path}
//                                 onClick={() => setSidebarOpen(false)}
//                                 className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
//                                   isSubActive
//                                     ? "bg-blue-700 text-white"
//                                     : "text-blue-100 hover:bg-blue-800"
//                                 }`}
//                               >
//                                 {subItem.label}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               }

//               return (
//                 <li key={item.path}>
//                   <Link
//                     to={item.path}
//                     onClick={() => setSidebarOpen(false)}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                       isActive
//                         ? "bg-blue-700 text-white"
//                         : "text-blue-100 hover:bg-blue-800"
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium">{item.label}</span>
//                   </Link>
//                 </li>
//               );
//             })}

//             {/* Custom Tables Section */}
//             {tables.length > 0 && (
//               <li>
//                 <button
//                   onClick={() => setCustomTablesOpen(!customTablesOpen)}
//                   className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
//                     location.pathname.startsWith("/admin/custom-table")
//                       ? "bg-blue-700 text-white"
//                       : "text-blue-100 hover:bg-blue-800"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Database className="w-5 h-5" />
//                     <span className="font-medium">Custom Tables</span>
//                   </div>
//                   {customTablesOpen ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4" />
//                   )}
//                 </button>
//                 {customTablesOpen && (
//                   <ul className="mt-1 ml-4 space-y-1">
//                     {tables.map((table) => {
//                       const isSubActive = location.pathname === `/admin/custom-table/${table.id}`;
//                       return (
//                         <li key={table.id}>
//                           <Link
//                             to={`/admin/custom-table/${table.id}`}
//                             onClick={() => setSidebarOpen(false)}
//                             className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
//                               isSubActive
//                                 ? "bg-blue-700 text-white"
//                                 : "text-blue-100 hover:bg-blue-800"
//                             }`}
//                           >
//                             {table.tableName}
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </li>
//             )}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto mt-14 lg:mt-0">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

//import { PG_BASE } from "@/config/constants";
import "../../../shared/styles/admin-tokens.css";

const navItems = [
  // {
  //   path: "dashboard",
  //   label: "Dashboard",
  //   icon: LayoutDashboard,
  // },
  {
    path: "add-data",
    label: "Add Data",
    icon: Database,
  },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname.replace(/\/+$/, "").endsWith(`/${path}`);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 text-slate-800">
      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => navigate(`/`)}
          aria-label="Go to MyPG home"
          className="rounded-md"
        >
          <span className="text-2xl font-extrabold tracking-tight text-blue-700">
            MyPG
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={sidebarOpen}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate(`/`)}
          className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-6 text-left"
        >
          <span className="text-3xl font-extrabold tracking-tight text-blue-700">
            MyPG
          </span>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Admin
          </span>
        </button>

        {/* Admin identity */}
        <div className="mx-4 mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              Admin Console
            </p>
            <p className="text-xs text-slate-500">Data management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "dashboard"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive: active }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-3 transition-colors ${
                        active
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-semibold">
                Controlled data access
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Review changes before modifying database records.
            </p>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main className="min-w-0 flex-1 overflow-y-auto pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
