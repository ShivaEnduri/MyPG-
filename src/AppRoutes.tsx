

import { Route, Routes } from "react-router-dom";

import "./App.css";

// ============================================================
// LAYOUTS & ROUTE GUARDS
// ============================================================

import { AdminLayout } from "@/app/roles/admin/Layout/AdminLayout";

import { DashboardLayout } from "@/ui/Layout/DashboardLayout";

import { RoleProtectedRoute } from "@/app/shared/hooks/context/RoleProtectedRoute";

// ============================================================
// PUBLIC PAGES
// ============================================================

import { Landingpage } from "@/app/pages/landingPage/LandingPage";

// ============================================================
// DASHBOARDS
// ============================================================

import { AdminDashboard } from "@/app/roles/admin/Dashboard/AdminDashboard";





import OwnDashboard from "@/app/roles/owner/dashboard/OwnerDashboard";



// ============================================================
// PROVIDERS / CONTEXT
// ============================================================

import { TablesProvider } from "@/app/roles/admin/contexts/TablesContext";



// ============================================================
// ADMIN PAGES
// ============================================================

// import { PGsPage } from "@/app/roles/admin/components/PGsPage";

// import { TablesPage } from "@/app/roles/admin/components/TablesPage";

// import { OwnersTable } from "@/app/roles/admin/components/OwnersTable";

// import { ManagersTable } from "@/app/roles/admin/components/ManagersTable";

// import { GuestsTable } from "@/app/roles/admin/components/GuestsTable";



import { VendorTable } from "@/app/roles/admin/components/VendorTable";



import { GuestsPage } from "@/app/roles/admin/components/GuestsPage";

import { PaymentsPage } from "@/app/roles/admin/components/PaymentsPage";

import { ReportsPage } from "@/app/roles/admin/components/ReportsPage";

import { SettingsPage } from "@/app/roles/admin/components/SettingsPage";

import { DynamicTableWrapper } from "@/app/roles/admin/components/DynamicTableWrapper";

// ============================================================
// OWNER PAGES
// ============================================================



import GuestInsights from "@/app/shared/components/GuestInsights";





import { RequestsPage } from "@/app/roles/owner/requests/Requests";
import BedMap from "@/app/shared/bedMap/BedMap";
import ResidentsPage from "@/app/pages/landingPage/residentsPage/ResidentsListing";
import VacancyPipeline from "@/app/roles/owner/enquiries/VacancyPipeline";
import Broadcast from "@/app/shared/broadcast/Broadcast"
import RentStatus from "@/app/roles/owner/rentStatus/RentStatus";
import MyStay from "@/app/roles/user/dashboard/MyStay"
import ResidentRentStatus from "@/app/roles/user/rentStatus/ResidentRentStatus";
import OwnersReportsPage from "@/app/roles/owner/reports/Reports";
import LoginPage from "./ui/Auth/LoginPage";
import IssuesPage from "@/app/shared/issues/Page";
import ResidentHappiness from "./app/roles/owner/residentHappiness/ResidentHappiness";


import ManagerDashboard from "@/app/roles/manager/dashboard/ManagerDashboard";


import ResidentDashboard from "@/app/roles/user/dashboard/ResidentDashboard";
import MyRequests from "@/app/roles/user/myRequests/MyRequests";
import Announcements from "@/app/roles/user/announcements/Announcements";

import ProfileSettings from "@/app/shared/profileSupport/ProfileSupport";


// ============================================================
// AUTH
// ============================================================

import { AuthModal } from "@/app/shared/hooks/context/AuthModal";

// ============================================================
// UNAUTHORIZED PAGE
// ============================================================

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Unauthorized
        </h1>

        <p className="mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

// ============================================================
// APP
// ============================================================

export default function AppRoutes() {
  return (
    <>
     <Routes>

  {/* ==================================================
      PUBLIC ROUTES
  ================================================== */}

  <Route
    path="/"
    element={<Landingpage />}
  />

  <Route
    path="/unauthorized"
    element={<Unauthorized />}
  />

  {/* ==================================================
      COMMON AUTHENTICATED ROUTES
  ================================================== */}

  <Route
    element={
      <RoleProtectedRoute
        // allowedRoles={[
        //   "Admin",
        //   "Owner",
        //   "Manager",      
        //   "Resident",
        // ]}
      />
    }
  >
    <Route
      path="/profile-settings"
      element={<ProfileSettings />}
    />
  </Route>


  {/* ==================================================
      OWNER ROUTES
  ================================================== */}

  <Route
    element={
      <RoleProtectedRoute
        // allowedRoles={["Owner", "Admin"]}
      />
    }
  >
    <Route
      path="/owner"
      element={<DashboardLayout />}
    >
      <Route
        path="dashboard"
        element={<OwnDashboard />}
      />

      <Route
        path="bedmap"
        element={<BedMap />}
      />

      <Route
        path="residents"
        element={<ResidentsPage />}
      />

      <Route
        path="vacancy-pipeline"
        element={<VacancyPipeline />}
      />

      <Route
        path="broadcast"
        element={<Broadcast />}
      />

      <Route
        path="rent-status"
        element={<RentStatus />}
      />

      <Route
        path="issues"
        element={<IssuesPage />}
      />

      <Route
        path="resident-happiness"
        element={<ResidentHappiness />}
      />

      <Route
        path="reports"
        element={<OwnersReportsPage />}
      />

      <Route
        path="manager-dashboard"
        element={<ManagerDashboard />}
      />

      <Route
        path="requests"
        element={<RequestsPage />}
      />

     

   

      <Route
        path="guest-insights"
        element={<GuestInsights />}
      />
    </Route>
  </Route>


  {/* ==================================================
      GUEST ROUTES
  ================================================== */}

  <Route
    element={
      <RoleProtectedRoute
        // allowedRoles={["Guest"]}
      />
    }
  >
    <Route
      path="/resident"
      element={<DashboardLayout />}
    >
      <Route
        path="mystay"
        element={<MyStay />}
      />

      <Route
        path="dashboard"
        element={<ResidentDashboard />}
      />

      <Route
        path="requests"
        element={<MyRequests />}
      />

      <Route
        path="rent"
        element={<ResidentRentStatus />}
      />

      <Route
        path="announcements"
        element={<Announcements />}
      />
    </Route>
  </Route>





  {/* ==================================================
      MANAGER ROUTES
  ================================================== */}

  <Route
    element={
      <RoleProtectedRoute
        // allowedRoles={["Manager", "Admin"]}
      />
    }
  >
    <Route
      path="/manager"
      element={<DashboardLayout />}
    >
      <Route
        path="dashboard"
        element={<ManagerDashboard />}
      />

      <Route
        path="bedmap"
        element={<BedMap />}
      />

      <Route
        path="vacancy-pipeline"
        element={<VacancyPipeline />}
      />

      <Route
        path="broadcast"
        element={<Broadcast />}
      />

      <Route
        path="rent-status"
        element={<RentStatus />}
      />

      <Route
        path="issues"
        element={<IssuesPage />}
      />

     

    
      <Route
        path="guest-insights"
        element={<GuestInsights />}
      />
    </Route>
  </Route>


  {/* ==================================================
      ADMIN ROUTES
  ================================================== */}

  <Route
    element={
      <TablesProvider>
        <RoleProtectedRoute
          // allowedRoles={["Admin"]}
        />
      </TablesProvider>
    }
  >
    <Route
      path="/admin"
      element={<AdminLayout />}
    >

      <Route
        path="dashboard"
        element={<AdminDashboard />}
      />

      {/* <Route
        path="pgs"
        element={<PGsPage />}
      /> */}

      <Route
        path="guests"
        element={<GuestsPage />}
      />

      <Route
        path="requests"
        element={<RequestsPage />}
      />

      {/* <Route
        path="tables"
        element={<TablesPage />}
      /> */}

      {/* <Route
        path="tables/owners"
        element={<OwnersTable />}
      />

      <Route
        path="tables/managers"
        element={<ManagersTable />}
      />

      <Route
        path="tables/guests"
        element={<GuestsTable />}
      /> */}

      {/* <Route
        path="tables/staff"
        element={<StaffTable />}
      /> */}

      <Route
        path="tables/vendors"
        element={<VendorTable />}
      />

      

      <Route
        path="payments"
        element={<PaymentsPage />}
      />

      <Route
        path="admin/reports"
        element={<ReportsPage />}
      />

      <Route
        path="settings"
        element={<SettingsPage />}
      />

      <Route
        path="custom-table/:tableId"
        element={<DynamicTableWrapper />}
      />

    </Route>
  </Route>


  {/* ==================================================
      FALLBACK
  ================================================== */}

  <Route
    path="*"
    element={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            404
          </h1>

          <p className="mt-2 text-gray-600">
            Page not found
          </p>
        </div>
      </div>
    }
  />

</Routes>

      {/* Global Authentication Modal */}

      <AuthModal />

    </>
  );
}