
import {axiosInstance} from "@/network/axiosInstance";
import { buildApiUrl } from "@/servivces/utils/apiHelper";
import { buildPayload } from "@/servivces/utils/payloadHelper";
import { AxiosResponse } from "axios";
//import { ServiceRequestFormState } from "@/app/shared/features/maintenance/types/serviceRequest";


/* ===================== TYPES ===================== */


export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface MobileLoginUser {
  id: number;
  univ_user_id?: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  mobile_no: string;
  mobile_verified?: number;
}

export interface MobileLoginResponse {
  success: boolean;
  login: boolean;
  message: string;
  token: string;
  tokenType: string;
  expiresIn: string;
  user: MobileLoginUser;
  profileIncomplete?: boolean;
}

export interface PgState {
  id: string;
  name: string;
}

export interface PgCity {
  id: string;
  city: string;
  state_id: string;
}

export interface GenderMaster {
  id: number;
  row_id: number;
  gender_type: string;
}

export interface RoleMaster {
  id: number;
  row_id: number;
  role: string;
}

// src/types/alert.ts
export interface AlertCategory {
  id: number;
  row_id: number;
  alert_category: string;
}

/* ===================== PG INFO TYPE ===================== */

export interface PgInfo {
  id: number;
  pg_id: string;
  pg_name: string;
  pg_owner: number;
  pg_address: string;
  pg_city: number;
  city:string;
  pg_state: number;
  pg_landmark: string;
  pg_pincode: number;
  pg_major_area: string;
  pg_primary_contact_no: string;
  pg_alternate_contact_no: string;
  pg_email: string;
  pg_map_url: string | null;
  pg_documents_path: string;
  pg_status: number;
  rstatus:number;
  // Category (was: st_pg_cat.category)
  pg_cat: number;
  category: string;

  // Description (was: st_pg_description.pg_desc)
  pg_description_id: number;
  pg_desc: string;

  // State (was: st_pg_state.name / scode)
  pg_state_id: number;
  pg_state_scode: string;
  pg_state_name: string;

  // PG Type (was: st_pg_type.pg_type)
  pg_type_id: number;
  pg_type: string;

  // Owner (was: separate owner object)
  user_info_id: number;
  user_info_first_name: string;
  user_info_last_name: string;
  user_info_email_id: string;
  user_info_mobile_no: string;

  // Amenity — optional, first match only
  amenities_map_id?: number;
  amenities_map_amenity_name?: string;
}

export interface PgUser {
  id: number;
  first_name: string;
  last_name: string;
  user_role: number;
  pg_info_id: number | null;
  email_id: string;
}

export interface PgAmenity {
  id: number;
  row_id: number;
  amenity_name: string;
  rstatus: number;
}

export interface PgDescription {
  id: number;
  row_id: number;
  pg_desc: string;
  rstatus: number;
}

export interface PgCategory {
  id: number;
  row_id: number;
  category: string;
}

export interface PgEvent {
  id: number;
  event_date: string;
  event_title: string;
  event_description: string;
  pg_id: number;
}

export interface AddPgEventPayload {
  event_date: string; // ISO string
  event_title: string;
  event_description: string;
  pg_id: number;
}


export interface PgCurrentStatus {
  id: number;
  name: string;
  status_code: string;
}

export interface PgBedInfo {
  id: number;
  name: string;
  bed_number:number;
}

export interface PgGuestType {
  id: number;
  name: string;
}

export interface ServiceCategory {
  id: number;
  category_name: string;
  status?: number;
}

export interface BedInfoUpdateFields {
  room_info?: number;
  bed_number?: string;
  bed_status?: number;
}

export interface BedInfoUpdatePayload {
  id: number;
  fields: BedInfoUpdateFields;
}


export interface GuestHistoryPayload {
  guest_info: number;
  pg_info: number;
  checkin_time: string;   // ISO datetime
  checkout_time?: string | null;
}

export interface BookingPayload {
  bkg_no: string;
  id: number;
  pg_id: number;
  room_id: number;
  bed_id: number;
  guest_id: number;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email_id: string;
  room_name: string;
  bed_number:number;
  bkg_date: string; // YYYY-MM-DD HH:mm:ss
  planned_check_in_date: string; // YYYY-MM-DD HH:mm:ss
  planned_check_out_date: string; // YYYY-MM-DD HH:mm:ss
  actual_check_in_date?: string | null; // YYYY-MM-DD HH:mm:ss
  actual_check_out_date?: string | null; // YYYY-MM-DD HH:mm:ss
  bkg_status: number;
  created_by: number;
  monthly_rent: number;
  secuirty_deposit: number;
  ac_charge: number;
  dth_charge: number;
  oven_charge: number;
  water_charge: number;
  laundry_charge: number;
  parking_charge: number;
  refrigerator_charge: number;
  electricity_fixed_charge: number;
  electricity_meter_charge: number;
  notice_period_time: number;
  remarks?: string;
  guest_status: number;
}

export type PgBookingQuery = Record<
  string,
  string | number | boolean | null | undefined
>;







export interface PgAlertUpdatePayload {
  id: number;
  fields: {
    alert_status: number;
  };
}

export interface PgServiceRequestUpdatePayload {
  id: number;
  fields: {
    request_assigned_to: number | string;
  };
}

export interface PgMedia {
  images: string[];
  videos: string[];
}

export interface PgInfoMedia {
  pg_id: string;
  media: PgMedia;
}

export interface PgInfoMediaRaw {
  pg_id: string;
  media_images: string | null;
  media_videos: string | null;
}

export interface PgInfoMediaResponse {
  success: boolean;
  source: string;
  count: number;
  result: PgInfoMediaRaw[];
}

export interface UserRole {
  id: number;
  is_active: number;
  user_id: number;
  univ_user_id: string;
  first_name: string;
  last_name: string | null;
  email_id: string | null;
  mobile_no: string | null;
  ref_code: string | null;
  mobile_verified: number;
  email_verified: number;
  passwd: string | null;
  signuptime: string | null;
  gender_id: number | null;
  last_updated: string | null;
  customer_id: string | null;
  rstatus: number;
  project_category: string | null;
  role_id: number;
  app_id: number;
  role_name: string;
  role:string;
  role_description: string;
}

export interface RoleCatalogEntry {
  id: number;
  role_name: string;
  role_description: string;
  is_active: number;
  rstatus: number;
  app_id: number;
  app_name: string;
  description: string;
}

export type PgInfoUpdatePayload = {
  id: number;
 
  pg_id?: string;
  pg_name?: string;
  pg_owner?: number;
  pg_cat?: number;
  pg_type?: number;
  pg_desc?: number;
  pg_address?: string;
  pg_city?: number;
  pg_state?: number;
  pg_landmark?: string | null;
  pg_pincode?: number;
  pg_major_area?: string | null;
  pg_primary_contact_no?: string;
  pg_alternate_contact_no?: string | null;
  pg_email?: string;
  pg_map_url?: string | null;
 
  // ── File fields (optional — only sent when user picks new files) ──
  pg_documents?: File[];
  images?: File[];
  videos?: File[];
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface SocialLoginPayload {
  idToken: string;
}

export interface SocialLoginResponse {
  isProfileIncomplete?: boolean;
  mergedAccount?: boolean;
  customToken?: string;
  user?: Record<string, unknown>;
}
 
export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  gender_id: string;
  dob: string;
  location: string;
}


export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface SocialLoginResponse {
  isProfileIncomplete?: boolean;
  mergedAccount?: boolean;
  customToken?: string;
  user?: Record<string, unknown>;
}

export interface GetMeResponse {
  user: {
    mobile_no?: string;
    gender_id?: string;
    [key: string]: unknown;
  };
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

export interface BookingUpdateFields {
  bkg_status?: number;
  actual_check_in_date?: string | null;
  actual_check_out_date?: string | null;
  modified_time?: string;
  modified_by?: number;
}

export interface BookingUpdatePayload {
  id: number;
  fields: BookingUpdateFields;
}

export interface BedMapUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string | null;
  mobileNo: string | null;
}

export interface BedMapGuest {
  guestId: number;
  guestStatus: number;
  user: BedMapUser;
}

export interface BedMapBooking {
  bookingId: number;
  bookingNo: string;
  plannedCheckInDate: string;
  plannedCheckOutDate: string;
  actualCheckInDate: string | null;
  actualCheckOutDate: string | null;
  bookingStatus: number;
  monthlyRent: string;
  guest: BedMapGuest;
}

export interface BedMapBed {
  bedId: number;
  bedNumber: number;
  bedStatus: number;
  booking: BedMapBooking | null;
}

export interface BedMapRoom {
  roomId: number;
  roomName: string;
  floor: number;
  roomType: number;
  bathroomType: number;
  hasTv: number;
  hasAc: number;
  hasBalcony: number;
  beds: BedMapBed[];
}

export interface BedMapSummary {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
}

export interface BedMapResidentsResponse {
  pgId: number;
  summary: BedMapSummary;
  rooms: BedMapRoom[];
}

export interface AddPgUserBookingPayload {
  first_name: string;
  last_name: string;
  email_id: string;
  mobile_no: string;
  gender_id: number;
  is_active: number;
  rstatus: number;
 

  guest: {
    guest_type: number;
    guest_status: number;
    pg_id: number;
    perm_address: string;
    emergency_contact: string;
    emergency_contact_name: string;
  };

  booking: {
    pg_id: number;
    room_id: number;
    bed_id: number;
    bkg_date: string;
    planned_check_in_date: string;
    actual_check_in_date: string;
    planned_check_out_date: string;
    bkg_status: number;
    monthly_rent: number;
    secuirty_deposit: number;
    notice_period_time: number;
    remarks: string;
  };
}


export interface BookingUpdatePayload {
  id: number;
  fields: BookingUpdateFields;
}

export interface SatisfactionTrendItem {
  date: string;
  avgRating: number;
  responses: number;
}

export interface IssuesSummary {
  open: number;
  overdue: number;
  highPriority: number;
  resolvedToday: number;
}

export interface IssuesCounts {
  all: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface ResidentHappinessSummary {
  avgRating: number;
  resolvedThisWeek: number;
}

export interface ResidentHappiness {
  summary: ResidentHappinessSummary;
  satisfactionTrend: {
    last7Days: SatisfactionTrendItem[];
    last14Days: SatisfactionTrendItem[];
    last28Days: SatisfactionTrendItem[];
  };
}

export interface IssuesAndHappinessAggregates {
  issues: {
    summary: IssuesSummary;
    counts: IssuesCounts;
  };

  residentHappiness: ResidentHappiness;
}

export interface ServiceRequestRecord {
  serviceRequest: {
    id: number;
    requestorInfo: number;
    requestAssignedTo:
      | {
          id: number;
          firstName: string;
          lastName: string;
        }
      | number
      | null;
    serviceTitle: string;
    serviceDescription: string;
    SLA: number;
    feedback: number;
    serviceStatus: number;
    pgId: number;
    requestEtaDate: string | null;
    overdueDays: number;
  };

  requestor: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;

  guest: {
    id: number;
    userId: number;
  } | null;

  booking: any | null;
  room: any | null;
}

export type ServiceRequestsResponse = ServiceRequestRecord[];

export interface ManagerDashboardSummary {
  todayCheckIns: number;
  todayCheckOuts: number;
}

export interface ManagerDashboardTask {
  taskType: "CHECK_IN" | "CHECK_OUT";
  taskTitle: string;

  guestId: number;
  userId: number;

  guestName: string;
  firstName: string;
  lastName: string;

  bookingId: number;
  bookingNo: string;

  roomId: number;
  room: string;

  bedId: number;

  date: string;
  time: string;
}

export interface ManagerDashboardResponse {
  summary: ManagerDashboardSummary;
  todayTasks: ManagerDashboardTask[];
}

export interface AddPgAlertPayload {
  alert_cat: number;              // category id
  alert_receiver_role: number;    // managers / guests / both
  alert_receiver: number;         // user id OR 0 for all
  alert_title: string;
  alert_description: string;
  alert_status: number;
  alert_priority: number;         // priority id
  pg_id: number;                  // selected PG
}

export interface PaymentUpdateFields {
  payment_status?: number;
  cash_payment?: number;
  [key: string]: any;
}

export interface SinglePaymentUpdate {
  id: number;
  fields: PaymentUpdateFields;
}

export interface BulkPaymentUpdate {
  updates: SinglePaymentUpdate[];
}

export type UpdatePaymentRecordsPayload =
  | SinglePaymentUpdate
  | BulkPaymentUpdate;


  export interface AddPgPaymentInfoPayload {
  cash_payment: number;
  inv_id: number;
  payment_mode_id: number;
  payment_status: number;
  actual_payment: number;
  remarks?: string | null;
}


// ============================================================
// PROFILE & SUPPORT TYPES
// ============================================================

export interface ProfileSupportProfile {
  userId: number;
  guestId: number;

  name: string;
  firstName: string;
  lastName: string;

  mobile: string;
  email: string;

  mobileVerified: boolean;
  emailVerified: boolean;
  isActive: boolean;

  profile: {
    profileId: number | null;
    currentCity: string | null;
    alternateEmail: string | null;
    alternateMobile: string | null;
    interests: string | null;
    allowPromotionCampaign: boolean;
  };
}

export interface ProfileSupportStay {
  bookingId: number;
  bookingNo: string;

  room: {
    id: number;
    name: string;
  };

  bed: {
    id: number;
    number: number;
    status: number;
  };

  checkIn: string;
  expectedCheckout: string;
  actualCheckout: string | null;

  bookingStatus: number;
  monthlyRent: number;
  noticePeriod: number;
}

export interface ProfileSupportContact {
  id?: number;
  name: string;
  mobile: string;
  email?: string;
}

export interface ProfileSupportManager extends ProfileSupportContact {
  id: number;
  email: string;
}

export interface ProfileSupportTicket {
  id: number;
  requestorInfo: number;
  assignedTo: number | null;

  title: string;
  description: string;

  createdAt: string;
  eta: string | null;
  sla: number | null;

  categoryId: number;
  statusId: number;

  status: string;
  statusDescription: number;

  feedback: number | null;
  feedbackSummary: string | null;
}

export interface ProfileSupportNotification {
  id: number;

  title: string;
  description: string;

  categoryId: number;
  category: string;

  priorityId: number;
  priority: string;
  priorityDescription: string;

  receiver: number | null;
  receiverRole: number;

  statusId: number;
  status: string;
}

export interface ProfileSupportData {
  profile: ProfileSupportProfile;

  stay: ProfileSupportStay;

  emergencyContact: ProfileSupportContact | null;

  managerContact: ProfileSupportManager | null;

  managers: {
    count: number;
    items: ProfileSupportManager[];
  };

  pg: {
    id: number;
    pgCode: string;
    name: string;
    address: string;
    landmark: string;
    pincode: number;
    primaryContact: string;
    alternateContact: string;
    email: string;
    status: number;
  };

  support: {
    summary: {
      totalRequests: number;
      openRequests: number;
      inProgressRequests: number;
      resolvedRequests: number;
    };

    tickets: ProfileSupportTicket[];
  };

  notifications: {
    summary: {
      total: number;
      important: number;
      active: number;
    };

    items: ProfileSupportNotification[];
  };

  supportLinks: {
    personalDetails: boolean;
    emergencyContact: boolean;
    managerContact: boolean;
    pgRulesAndPolicies: boolean;
    faq: boolean;
    raiseSupportTicket: boolean;
  };

  importantContacts: {
    manager: ProfileSupportManager | null;

    pgPrimary: {
      name: string;
      mobile: string;
      email: string;
    } | null;

    pgAlternate: {
      name: string;
      mobile: string;
    } | null;

    security: ProfileSupportContact | null;

    housekeeping: ProfileSupportContact | null;
  };

  settings: {
    notifications: string | boolean | null;
    language: string | null;
    privacy: string | boolean | null;

    logout: {
      supportedByApi: boolean;
      note: string;
    };
  };
}


// ============================================================
// UPDATE PG USER INFO
// ============================================================

export interface PgUserInfoUpdatePayload {
  id: number;
  fields: {
    first_name?: string;
    last_name?: string;
    email_id?: string;
    mobile_no?: string;
  };
}

// ============================================================
// UPDATE EMERGENCY / GUEST INFO
// ============================================================

export interface GuestInfoUpdatePayload {
  id: number;
  fields: {
    "emergency_contact"?: string;
    emergency_contact_name?: string;
  };
}



/* =========================================================
   USER PG MAP
========================================================= */

export interface UserPgMap {
  id: number;
  user_id: number;
  pg_id: number;
  pg_name: string;

  pg_owner: number;
  pg_cat: number | null;
  pg_type_id: number | null;
  pg_desc_id: number | null;

  pg_address: string | null;
  pg_city: number | null;
  pg_state: number | null;
  pg_landmark: string | null;
  pg_pincode: number | null;
  pg_major_area: string | null;

  pg_primary_contact_no: string | null;
  pg_alternate_contact_no: string | null;
  pg_email: string | null;
  pg_map_url: string | null;

  pg_create_time: string | null;
  pg_update_time: string | null;

  pg_documents_path: string | null;
  pg_status: number | null;

  univ_user_id: string | null;

  first_name: string | null;
  last_name: string | null;
  email_id: string | null;
  mobile_no: string | null;

  ref_code: string | null;

  mobile_verified: number | null;
  email_verified: number | null;

  passwd: string | null;

  signuptime: string | null;
  gender_id: number | null;
  last_updated: string | null;

  customer_id: number | null;

  is_active: number | null;
  rstatus: number | null;

  project_category: number | null;
}






/* ===================== HELPERS ===================== */

type QueryParams = Record<string, string | number | undefined>;

/* ===================== API CALLS ===================== */

/* ============================================================
   SEND MOBILE LOGIN OTP
============================================================ */

export const sendMobileLoginOtpApi = async (
  payload: SendOtpPayload
) => {

  return axiosInstance.post(
    "/otp/mobile-login/send-otp",
    payload
  );
};

/* ============================================================
   VERIFY MOBILE LOGIN OTP
============================================================ */

export const verifyMobileLoginOtpApi = async (
  payload: VerifyOtpPayload
) => {

  return axiosInstance.post<MobileLoginResponse>(
    "/otp/mobile-login/verify-otp",
    payload
  );
};

/* ============================================================
   FETCH USER ROLES
============================================================ */

// export const fetchUserRolesApi = async ({
//   user_id,
// }: {
//   user_id: number | string;
// }) => {

//   const url = buildApiUrl(
//     "/getAllRecords",
//     "userRoles"
//   );

//   return axiosInstance.get(url, {
//     params: {
//       user_id,
//     },
//   });
// };

/* ============================================================
   GET CURRENT USER
============================================================ */

// export const getMeApi = async (
//   token: string
// ) => {
//   return api.get("/me", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

/* ============================================================
   LOGOUT
============================================================ */

export const logoutApi = async (
  token: string
) => {
  return axiosInstance.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//get user roles from dy_user_roles 

export const fetchUserRolesApi = async (
  queryParams?: Record<string, string | number>
): Promise<UserRole[]> => {
  const url = buildApiUrl("/getAllRecords", "userRoles"); 
  const res = await axiosInstance.get(url, { params: queryParams });
  return res.data.result as UserRole[];
};




// full roles catalog (the one that returns the 13-row list with app_id/app_name).
export const fetchRoleCatalogApi = async (): Promise<RoleCatalogEntry[]> => {
  const url = buildApiUrl("/getAllRecords", "roles");
  const res = await axiosInstance.get(url);
  return res.data.result as RoleCatalogEntry[];
};

// GET STATES
export const getPgStates = () => {
  const url = buildApiUrl("/getAllRecords", "states");
  return axiosInstance.get(url);
};

// GET CITIES
// export const getPgCities = () => {
//   const url = buildApiUrl("/getAllRecords", "pgCities");
//   return axiosInstance.get(url);
// };


// commonApiServices.ts

// export const getPgCities = (stateId: number) => {
//   const url = buildApiUrl(
//     `/getAllRecords?state_id=${stateId}`,
//     "cities"
//   );
//   return axiosInstance.get(url);
// };

export const getPgCities = async (stateId: number) => {
  const url = buildApiUrl(
    `/getAllRecords?state_id=${stateId}`,
    "cities"
  );

  console.log("URL:", url);
  console.log("State ID:", stateId);

  const response = await axiosInstance.get(url);

  console.log("Response:", response.data);

  return response;
};


export const fetchGendersApi = async (): Promise<GenderMaster[]> => {
  const url = buildApiUrl("/getAllRecords", "genders");
  const res = await axiosInstance.get(url);
  return res.data.result; // ✅ return array only
};

export const fetchRolesApi = async (): Promise<RoleMaster[]> => {
  const url = buildApiUrl("/getAllRecords", "roles");
  const res = await axiosInstance.get(url);
  return res.data.result;
};


export const fetchAlertCategoriesApi = async (): Promise<AlertCategory[]> => {
  const url = buildApiUrl("/getAllRecords", "alertCategories");
  const res = await axiosInstance.get(url);
  return res.data.result; // ✅ return array only
};


/* ===================== PG INFO API ===================== */

// export const fetchPgInfoApi = async (
//   queryParams?: Record<string, string | number>
// ): Promise<PgInfo[]> => {
//   const url = buildApiUrl("/getAllRecords", "pgInfo");

//   const res = await axiosInstance.get(url, {
//     params: queryParams, 
//   });

//   return res.data.result; 
// };
//above code is commented because of response change on backend on 09-04-2026

export const fetchPgInfoApi = async (
  queryParams?: Record<string, string | number>
): Promise<PgInfo[]> => {
  const url = buildApiUrl("/getAllRecords", "pgInfo");
  const res = await axiosInstance.get(url, { params: queryParams });
  return res.data.result as PgInfo[];
};


// export const fetchPgUsersApi = async (
//   queryParams?: Record<string, string | number>
// ): Promise<PgUser[]> => {
//   const url = buildApiUrl("/getAllRecords", "pgUserInfo");

//   const res = await axiosInstance.get(url, {
//     params: queryParams,
//   });

//   return res.data.result;
// };


// In your commonApiServices.ts file, update the fetchPgUsersApi function:

export const fetchPgUsersApi = async (
  queryParams?: {
    pg_id?: number;
    pg_info_id?: number; 
    user_role?: number;
    [key: string]: string | number | undefined;
  }
): Promise<PgUser[]> => {
  const url = buildApiUrl("/getAllRecords", "pgUserInfo");

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data.result;
};


// ✅ PG AMENITIES
export const fetchPgAmenities = async (): Promise<PgAmenity[]> => {
  const url = buildApiUrl("/getAllRecords", "pgAmenities");
  const res = await axiosInstance.get(url);
  return res.data.result;
};

// ✅ PG DESCRIPTIONS (Furnishing)
export const fetchPgDescriptions = async (): Promise<PgDescription[]> => {
  const url = buildApiUrl("/getAllRecords", "pgDescriptions");
  const res = await axiosInstance.get(url);
  return res.data.result;
};


export const fetchPgCategories = async (): Promise<PgCategory[]> => {
  const url = buildApiUrl("/getAllRecords", "pgCategories");
  const res: AxiosResponse<any> = await axiosInstance.get(url);
  return res.data.result;
};


// GET EVENTS (PG-based)
export const fetchPgEventsApi = async (
  params: { pg_id: number }
): Promise<PgEvent[]> => {
  const url = buildApiUrl("/getAllRecords", "events");
  const res = await axiosInstance.get(url, { params });
  return res.data.result;
};

// ADD EVENT
export const addPgEventApi = async (
  payload: AddPgEventPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "events");
  return axiosInstance.post(url, buildPayload(payload));
};

// DELETE EVENT
export const deletePgEventApi = async (
  id: number
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/deleteRecord", "events");
  return axiosInstance.delete(url, { data: { id } });
};



export const getPgCurrentStatus = (
  params?: QueryParams
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getAllRecords", "pgCurrentStatuses");
  return axiosInstance.get(url, { params });
};

/**
 * /getAllRecords → bedInfo
 * Example:
 * /api/pg/bed_info/getAllRecords?room_type=2
 */
export const getPgBedInfo = (
  params?: QueryParams
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getAllRecords", "bedInfo");
  return axiosInstance.get(url, { params });
};

 // Update bedInfo record(s)
 
 
export const updateBedInfo = (
  payload: BedInfoUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "bedInfo");

  return axiosInstance.put(url, {
    payload: {
      id: payload.id,
      fields: payload.fields, 
    },
  });
};
/**
 * /getAllRecords → guestType
 * Example:
 * /api/pg/guest_type/getAllRecords?gender=male
 */
export const getPgGuestTypes = async (
  params?: Record<string, any>
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "guestType"
  );

  return axiosInstance.get(url, {
    params,
  });
};


/* Fetch Requests */
export const getServiceRequests = (params?: Record<string, any>) => {
  const url = buildApiUrl("/getAllRecords", "pgServiceRequests");
  return axiosInstance.get(url, { params });
};

/* Create Request */
export const createServiceRequest = (
  data: Record<string, any>
) => {
  const url = buildApiUrl("/addRecord", "pgServiceRequests");

  return axiosInstance.post(
    url,
    buildPayload(data)   
  );
};


export const getServiceCategories = (
  query?: Record<string, any>
): Promise<AxiosResponse<ServiceCategory[]>> => {
  const url = buildApiUrl("/getAllRecords", "pgServiceCategory");

  return axiosInstance.get(url, {
    params: query,
  });
};


export const addGuestHistory = (
  data: GuestHistoryPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "guestHistory");

  return axiosInstance.post(url, buildPayload(data));
};



export const updatePgAlert = (
  payload: PgAlertUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "pgAlerts");

  return axiosInstance.put(url, {
    payload,
  });
};


export const getPgRooms = (
  params?: QueryParams
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getAllRecords", "pgRooms");
  return axiosInstance.get(url, { params });
};

export const getPgInfoDocuments = (
  params: QueryParams
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getPgInfoMedia", "pgInfo");
  return axiosInstance.get(url, { params });
};

// services/api/pgInfoApi.ts

export const getPgInfoMedia = (
  params?: QueryParams
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getPgInfoMedia", "pgInfo");
  return axiosInstance.get(url, { params });
};



export const updatePgServiceRequest = (
  payload: PgServiceRequestUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "pgServiceRequests");

  return axiosInstance.put(url, {
    payload,
  });
};

// export const updatePgInfo = (
//   payload: PgInfoUpdatePayload
// ): Promise<AxiosResponse<any>> => {
//   const url = buildApiUrl("/updateRecord", "pgInfo");

//   const { id, ...rest } = payload;

//   return axiosInstance.put(url, {
//     payload: {
//       id,        // → payload.id  (primary lookup)
//       fields: rest, // → payload.fields (columns to update)
//     },
//   });
// };


export const updatePgInfo = (
  payload: PgInfoUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "pgInfo");
 
  const {
    id,
    pg_documents = [],
    images = [],
    videos = [],
    ...rest
  } = payload;
 
  const formData = new FormData();
 
  // Append scalar fields as JSON — same structure the backend expects
  formData.append(
    "payload",
    JSON.stringify({
      id,          // primary key for WHERE clause
      fields: rest // columns to update
    })
  );
 
  // Append PDF documents (same key as addPgInfo)
  pg_documents.forEach((file) => {
    formData.append("pg_documents_path", file);
  });
 
  // Append images (max 5, same key as addPgInfo)
  images.forEach((file) => {
    formData.append("images", file);
  });
 
  // Append videos (max 2, same key as addPgInfo)
  videos.forEach((file) => {
    formData.append("videos", file);
  });
 
  return axiosInstance.put(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE PG
export const deletePgInfo = async (
  id: number
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/deleteRecord", "pgInfo");
  return axiosInstance.delete(url, { params: { id } });
};


export const socialLoginApi = async (
  payload: SocialLoginPayload
): Promise<AxiosResponse<SocialLoginResponse>> => {
  const url = buildApiUrl("/social-login", "auth");
  return axiosInstance.post(url, payload);
};
export const getMeApi = async (idToken?: string) => {
  const url = buildApiUrl("/me", "auth");
  
  return axiosInstance.get(url, {
    // If token passed explicitly, use it — otherwise interceptor handles it
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
  });
};

export const updateProfileApi = async (
  payload: UpdateProfilePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/profile", "auth");
  return axiosInstance.patch(url, payload);
};

export const sendOtpApi = async (
  payload: SendOtpPayload
): Promise<AxiosResponse<OtpResponse>> => {
  const url = buildApiUrl("/send-otp", "otp");
  return axiosInstance.post(url, payload);
};

export const verifyOtpApi = async (
  payload: VerifyOtpPayload
): Promise<AxiosResponse<OtpResponse>> => {
  const url = buildApiUrl("/verify-otp", "otp");
  return axiosInstance.post(url, payload);
};


export const addPgBooking = (
  data: BookingPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "bookings");

  return axiosInstance.post(url, buildPayload(data));
};


export const fetchPgBookingsApi = async (queryParams?: PgBookingQuery) => {
  const url = buildApiUrl("/getAllRecords", "bookings");

  console.log("Query Params:", queryParams);

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  console.log("API Response:", res.data);

  return res.data.result;
};



export const deleteBooking = async (
  id: number
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/deleteRecord", "bookings");

  return axiosInstance.delete(url, {
    params: { id },
  });
};


/* ============================================================
   FETCH BED MAP RESIDENTS
============================================================ */

export const fetchBedMapResidentsApi = async (
  pgId: number
): Promise<BedMapResidentsResponse> => {
  const url = buildApiUrl("/getAllRecords", "bedmapResidents");

  const res = await axiosInstance.get(url, {
    params: {
      pgId,
    },
  });

  return res.data.data as BedMapResidentsResponse;
};


export const addPgUserBookingApi = async (
  payload: AddPgUserBookingPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "pgUserInfo");

  return axiosInstance.post(
    url,
    buildPayload(payload)
  );
};


export const updateBooking = (
  payload: BookingUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "bookings");

  return axiosInstance.put(url, {
    payload: {
      id: payload.id,
      fields: payload.fields,
    },
  });
};


export const fetchIssuesAndResidentHappinessApi = async (
  pgId: string | number
): Promise<IssuesAndHappinessAggregates> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "issuesAndResidentHappiness"
  );

  const res = await axiosInstance.get(url, {
    params: {
      pgId,
    },
  });

  return res.data.data as IssuesAndHappinessAggregates;
};

export const fetchServiceRequestsApi = async (
  pgId: number
): Promise<ServiceRequestsResponse> => {
  const url = buildApiUrl("/getAllRecords", "serviceRequests");

  const res = await axiosInstance.get(url, {
    params: {
      pgId,
    },
  });

  return res.data.data as ServiceRequestsResponse;
};

export const fetchManagerDashboardApi = async (
  pgId: number
): Promise<ManagerDashboardResponse> => {
  const url = buildApiUrl("/getAllRecords", "managerDashboard");

  const res = await axiosInstance.get(url, {
    params: {
      pgId,
    },
  });

  return res.data.data as ManagerDashboardResponse;
};

export const addPgAlert = async (
  fields: AddPgAlertPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "pgAlerts");
  return axiosInstance.post(url, buildPayload(fields));
};

export const updatePaymentRecords = (
  payload: UpdatePaymentRecordsPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "paymentsInfo");

  return axiosInstance.put(url, payload);
};



export const addPgPaymentInfoApi = async (
  payload: AddPgPaymentInfoPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "paymentsInfo");

  return axiosInstance.post(url, buildPayload(payload));
};


// ============================================================
// FETCH PROFILE SUPPORT
// ============================================================

export const fetchProfileSupportApi = async (
  queryParams?: Record<string, string | number>
): Promise<ProfileSupportData> => {
  const url = buildApiUrl("/getAllRecords", "profileSupport");

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data.data as ProfileSupportData;
};


export const updateGuestInfo = (
  payload: GuestInfoUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "guestInfo");

  return axiosInstance.put(url, {
    id: payload.id,
    fields: payload.fields,
  });
};

export const updatePgUserInfo = (
  payload: PgUserInfoUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "pgUserInfo");

  return axiosInstance.put(url, {
    id: payload.id,
    fields: payload.fields,
  });
};


export const fetchUserPgMapApi = async (
  queryParams?: Record<
    string,
    string | number
  >
): Promise<UserPgMap[]> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "userPgMap"
  );

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data.result as UserPgMap[];
};