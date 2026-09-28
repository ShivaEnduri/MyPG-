import '../../../shared/styles/admin-tokens.css';
// // src/admin/AdminLayout.tsx
// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "../Shared/Components/AdminNavbar";

// interface AdminLayoutProps {}

// export default function AdminLayout({}: AdminLayoutProps) {
//   const [isOpen, setIsOpen] = useState<boolean>(true);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 640);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="flex app-shell">
//       {/* Only admins see this sidebar navbar */}
//       <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

//       {/* Main content for admin pages */}
//       <main
//         className={`transition-all duration-300 flex-1 ${
//           isMobile ? "pt-16 ml-0" : isOpen ? "ml-56" : "ml-16"
//         }`}
//       >
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// apps/pg/src/app/roles/admin/Layout/AdminLayout.tsx
// CSS imports removed from here — theme is loaded globally in rentals/src/main.tsx
// so Vite's Tailwind v4 plugin can process @theme inline correctly.
// Importing CSS inside a component doesn't give Tailwind the chance to
// generate utility classes like bg-primary, bg-card at build time.

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Table,
  Plus,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Database
} from "lucide-react";

import { PG_BASE } from "@/config/constants";
import { useState } from "react";
import { useTables } from "../contexts/TablesContext";
import "../../../shared/styles/admin-tokens.css"

const navItems = [
  { path: "/base/pg/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/base/pg/admin/pgs", label: "PGs", icon: Building2 },
  { path: "/base/pg/admin/requests", label: "Requests", icon: ClipboardList },
  {
    path: "/base/pg/admin/tables",
    label: "Users",
    icon: Table,
    subItems: [
      { path: "/base/pg/admin/tables/owners", label: "Owners" },
      { path: "/base/pg/admin/tables/managers", label: "Managers" },
      { path: "/base/pg/admin/tables/guests", label: "Guests" },
      { path: "/base/pg/admin/tables/staff", label: "Staff" },
      { path: "/base/pg/admin/tables/vendors", label: "Vendors" },
    ]
  },
  { path: "/base/pg/admin/add-amenities", label: "Add Amenities", icon: Plus },
  { path: "/base/pg/admin/payments", label: "Payments", icon: CreditCard },
  { path: "/base/pg/admin/reports", label: "Reports", icon: BarChart3 },
  { path: "/base/pg/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tables } = useTables();
  const [tablesOpen, setTablesOpen] = useState(location.pathname.startsWith("/base/pg/admin/tables"));
  const [customTablesOpen, setCustomTablesOpen] = useState(location.pathname.startsWith("/base/pg/admin/custom-table"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#001433] border-b border-blue-900 z-30 px-4 py-3 flex items-center justify-between">
        <img src="/RUFRENT6.png" alt="RUFRENT" className="h-6" onClick={() => navigate(`${PG_BASE}`)}/>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#001433] border-r border-blue-900 flex flex-col
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <img src="/RUFRENT6.png" alt="RUFRENT" className="h-8" onClick={() => navigate(`${PG_BASE}`)}/>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isParentActive = item.subItems && location.pathname.startsWith(item.path);

              if (item.subItems) {
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => setTablesOpen(!tablesOpen)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isParentActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {tablesOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {tablesOpen && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.path;
                          return (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                                  isSubActive
                                    ? "bg-blue-700 text-white"
                                    : "text-blue-100 hover:bg-blue-800"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* Custom Tables Section */}
            {tables.length > 0 && (
              <li>
                <button
                  onClick={() => setCustomTablesOpen(!customTablesOpen)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname.startsWith("/admin/custom-table")
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5" />
                    <span className="font-medium">Custom Tables</span>
                  </div>
                  {customTablesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {customTablesOpen && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {tables.map((table) => {
                      const isSubActive = location.pathname === `/admin/custom-table/${table.id}`;
                      return (
                        <li key={table.id}>
                          <Link
                            to={`/admin/custom-table/${table.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                              isSubActive
                                ? "bg-blue-700 text-white"
                                : "text-blue-100 hover:bg-blue-800"
                            }`}
                          >
                            {table.tableName}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto mt-14 lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
}
