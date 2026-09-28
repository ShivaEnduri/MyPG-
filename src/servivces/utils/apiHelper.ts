
// ==================== CONSTANTS ====================
export const API_BASE = import.meta.env.VITE_API_URL as string;


export const apiPrefixes = {
  // =========================
  // App Modules
  // =========================
  common: "common",
  user: "user",
  admin: "admin",
  rm: "rm",
  fm: "fm",
  studio: "studio",

  // =========================
  // Authentication
  // =========================
  auth: "fire",
  otp: "otp",

  // =========================
  // Payments
  // =========================
  pay: "pay",
  payment: "payment",
  invoice: "invoice",
  vendorInvoice: "vendor-invoices",
  userPayment: "user-payment-plan",

  // =========================
  // Vendors
  // =========================
  vendors: "vendors",
  vendorCategory: "vendor-category",

  // =========================
  // Tasks
  // =========================
  project: "project",
  mainTask: "main-tasks",
  subTask: "sub-tasks",

  // =========================
  // Notifications
  // =========================
  notification: "noti",

  // =========================
  // Utilities
  // =========================
  regions: "regions",
  crud: "",
  test: "test",

  // =========================
  // PG Resources
  // =========================
  pgUserInfo: "user-info",
  pgInfo: "pg-info",
  pgAlerts: "pg-alerts",
  pgRooms: "pg-room-info",
  guestInfo: "pg-guest-info",
  guestHistory: "guest-history",
  guestType: "pg-gst-typ",
  bedInfo: "pg-bed-info",
  pgAmenitiesMap: "amenities-map",
  pgServiceRequests: "pg-srv-reqs",
  pgServiceCategory: "pg-srv-cat",
    pgTypes: "pg-type",
  pgAmenities: "pg-amns",
  pgDescriptions: "pg-description",
  pgCategories: "pg-cat",
   alertCategories: "pg-alrt-cat",
  alertPriorities: "pg-alert-priority",
   events: "pg-events-info",
   pgRequests: "pg-requests",
   roles: "pg-roles",
   userRoles:"user-roles",
   bookings: "pg_bookings",
   aggregations: "aggregate/owner",
   rentStatusResidents: "aggregate/owner/rentStatus",
   bedmapResidents:"aggregate/owner/getbedmaps",
  //  userBooking:"user-info",
   issuesAndResidentHappiness:"aggregate/owner/getIssuesAndResidentHappiness",
   serviceRequests:"aggregate/servicerequest",
   managerDashboard:"aggregate/manager/getTodayDashboardTasksformanager",
   paymentsInfo:"pg_payments_info",
   checkinCheckout:"aggregate/manager/getCheckInCheckoutAggregate",
   updateCheckinCheckout:"aggregate/manager/updateCheckInCheckout",
   residentDashboard:"aggregate/resident/getResidentHome",
   mystay:"aggregate/resident/getResidentMyStay",
   residentRentStatus:"aggregate/resident/getResidentRentStatus",
  profileSupport:"aggregate/getProfileSupport",
  announcements:"aggregate/resident/getAnnouncements",
  userPgMap:"pg-usr-map",

  // =========================
  // Common Master Tables
  // =========================
 states: "pg-state",
cities: "pg-ctys",
// roles: "common/roles",
genders: "pg-gender",
// userRoles: "common/user-roles",

  pgCurrentStatuses: "pg-cur-sts",
 
} as const;

export type ApiRole = keyof typeof apiPrefixes;




// // ==================== MAIN FUNCTION ====================
// import { useRoleStore } from "../../store/roleStore";
// import { useAppStore } from "@packages/store/appStore";


export const buildApiUrl = (
  endpoint: string,
  module: ApiRole
): string => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const prefix = apiPrefixes[module] ? `/${apiPrefixes[module]}` : "";

  return `${prefix}${path}`;
};



// export const API_BASE =
//   import.meta.env.VITE_API_URL as string;

// /* ============================================================
//    PG API PREFIXES
// ============================================================ */

// export const apiPrefixes = {

//   /* =========================
//      Authentication
//   ========================= */

//   otp: "otp",

//   auth: "auth",

//   /* =========================
//      User
//   ========================= */

//   user: "user",

//   userRoles: "user-roles",

//   /* =========================
//      PG
//   ========================= */

//   pgInfo: "pg-info",

//   pgUserInfo: "pg-user-info",

//   pgAlerts: "pg-alerts",

//   pgRooms: "pg-room-info",

//   guestInfo: "pg-guest-info",

//   guestHistory: "guest-history",

//   guestType: "pg-gst-typ",

//   bedInfo: "pg-bed-info",

//   pgAmenitiesMap: "amenities-map",

//   pgServiceRequests: "pg-srv-reqs",

//   pgServiceCategory: "pg-srv-cat",

//   pgTypes: "pg-type",

//   pgAmenities: "pg-amns",

//   pgDescriptions: "pg-description",

//   pgCategories: "pg-cat",

//   alertCategories: "pg-alrt-cat",

//   alertPriorities: "pg-alert-priority",

//   events: "pg-events-info",

//   pgRequests: "pg-requests",

//   bookings: "pg_bookings",

//   pgCurrentStatuses: "pg-cur-sts",

//   /* =========================
//      Aggregations
//   ========================= */

//   aggregations:
//     "aggregate/owner",

//   rentStatusResidents:
//     "aggregate/owner/rentStatus",

//   /* =========================
//      Masters
//   ========================= */

//   states: "pg-state",

//   cities: "pg-ctys",

//   genders: "pg-gender",

//   roles: "roles",

// } as const;

// export type ApiRole =
//   keyof typeof apiPrefixes;

// /* ============================================================
//    BUILD API URL
// ============================================================ */

// export const buildApiUrl = (
//   endpoint: string,
//   module: ApiRole
// ): string => {

//   const path =
//     endpoint.startsWith("/")
//       ? endpoint
//       : `/${endpoint}`;

//   const prefix =
//     apiPrefixes[module];

//   if (!prefix) {
//     return path;
//   }

//   return `/${prefix}${path}`;
// };