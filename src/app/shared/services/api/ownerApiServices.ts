// ==================== Imports ====================
import { AxiosResponse } from "axios";
import { axiosInstance } from "@/network/axiosInstance";
import { buildApiUrl } from "@/servivces/utils/apiHelper";
import { buildPayload } from "@/servivces/utils/payloadHelper";

// ==================== Types ====================

// export interface AddPgManagerPayload {
//   first_name: string;
//   last_name: string;
//   user_gender: string;
//   dob: string;
//   user_role: number;
//   mobile_no: string;
//   email_id: string;
//   user_password: string;
//   perm_address: string;
//   user_city: string;
//   user_state: string;
//   user_pincode: string;
//   pg_info_id: string;
//   user_unique_id: string;
//   logincount: number;
// }

export interface AddPgManagerPayload {
  first_name: string;
  last_name: string;
  user_gender: number;     // was string
  user_role: number;
  mobile_no: string;
  email_id: string;
  user_password: string;
  perm_address: string;
  user_city: number;       // was string
  user_state: number;      // was string
  user_pincode: number;    // was string
  pg_info_id: number;      // was string
  user_unique_id: string;
  logincount: number;
}



export interface PgAlertPriority {
  id: number;
  row_id: number;
  priority: string;
  priority_desc: string;
}


export interface AddPgInfoPayload {
  fields: {
    pg_name: string;
    pg_owner: number;
    pg_type: number;
    pg_desc: number;
    pg_cat: number;
    pg_address: string;
    pg_state: number;
    pg_city: number;
    pg_pincode: number;
    pg_landmark: string | null;
    pg_major_area: string | null;
    pg_primary_contact_no: string;
    pg_alternate_contact_no: string | null;
    pg_email: string;
    pg_map_url: string | null;
  };
  pg_documents: File[];
  images: File[];
  videos: File[];
}

export interface PgType {
  id: number;
  row_id: number;
  pg_type: string;
  rstatus: number;
}


export interface GuestInfo {
  id: number;
  row_id: number;

  /* guest table */
  user_info: number;
  bed_info: number;
  guest_dob: string;
  guest_type: string;
  emergency_contact_name: string;
  emergency_contact_no: string;
  guest_status: number;
  security_deposit: number;
  checkin_time: string;
  checkout_time: string | null;
  guest_preference: Record<string, any>;

  /* bed / room */
  room_info: number;
  bed_number: string;
  bed_status: number;

  /* status */
  status_code: string;
  rstatus: number;

  /* user */
  first_name: string;
  last_name: string;
  

  /* pg */
  pg_info_id: number | null;
}

export interface GuestInfoQuery {
  id?: number;
  user_info?: number;
  bed_info?: number;
  guest_type?: string;
  guest_status?: number;
  pg_id?: number;
}

export interface PgAlertsParams {
  alert_receiver_role?: number;
  alert_receiver?: number;
  pg_id?: number;
  alert_cat?: number;
  alert_priority?: number;
}


export interface PgAggregations {
  dashboard: {
    occupancy: {
      occupied: number;
      total: number;
      percentage: number;
    };
    vacantBeds: number;
    upcomingVacancy: number;
    openIssues: number;
  };

  bedMap: {
    totalBeds: number;
    occupiedBeds: number;
    vacantBeds: number;
    noticeBeds: number;
    reservedBeds: number;
  };

  vacancyPipeline: {
    upcomingVacancy: number;
    enquiriesOpen: number;
  };

  residents: {
    totalResidents: number;
    activeResidents: number;
  };

  rentStatus: {
    totalRent: number;
    paid: number;
    due: number;
    partial: number;
    overdue: number;
  };

  happiness: {
    rating: number;
  };
}

export interface RentStatusResident {
  invoiceId: number;
  bookingId: number;
  guestId: number;
  userId: number;

  booking: {
    id: number;
    room_id: number;
    room_name: string;
    bed_id: number;
    bed_number: number;
  };

  resident: {
    firstName: string;
    lastName: string;
  };

  invoice: {
    totalAmount: string;
    dueDate: string;
  };

  payment: {
    status: "paid" | "due" | "partial" | string;
  };
}

// ==================== API ====================

export const addPgUser = async (
  fields: AddPgManagerPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "guestInfo");
  return axiosInstance.post(url, buildPayload(fields));
};




// export const getPgAlerts = (
//   params?: PgAlertsParams
// ): Promise<AxiosResponse<any>> => {
//   const url = buildApiUrl("/getAllRecords", "pgAlerts");

//   // If params exist → send as query params
//   // If not → axios will fetch all records
//   return axiosInstance.get(url, {
//     params,
//   });
// };

export const getPgAlerts = (
  params?: Record<string, any>
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/getAllRecords", "pgAlerts");

  return axiosInstance.get(url, {
    params,
  });
};



export const fetchPgAlertPriorities = async (): Promise<PgAlertPriority[]> => {
  const url = buildApiUrl("/getAllRecords", "alertPriorities");
  const res = await axiosInstance.get(url);
  return res.data.result;
};


// export const addPgInfo = async (
//   payload: AddPgInfoPayload
// ): Promise<AxiosResponse<any>> => {
//   const url = buildApiUrl("/addRecord", "pgInfo");
//   const formData = new FormData();

//   // ✅ EXACTLY LIKE POSTMAN
//   formData.append("payload", JSON.stringify({ fields: payload.fields }));

//   // ✅ Append files with SAME KEY backend expects
//   payload.pg_documents.forEach((file) => {
//     formData.append("pg_documents_path", file);
//   });

//   return axiosInstance.post(url, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };




// ✅ PG TYPES

export const addPgInfo = async (
  payload: AddPgInfoPayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/addRecord", "pgInfo");
  const formData = new FormData();

  // Append the payload as JSON
  formData.append("payload", JSON.stringify({ data: payload.fields }));
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
}
  // Append PDF documents
  payload.pg_documents.forEach((file) => {
    formData.append("pg_documents_path", file);
  });

  // Append images (max 5)
  payload.images.forEach((file) => {
    formData.append("images", file);
  });

  // Append videos (max 2)
  payload.videos.forEach((file) => {
    formData.append("videos", file);
  });

  return axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const fetchPgTypes = async (): Promise<PgType[]> => {
  const url = buildApiUrl("/getAllRecords", "pgTypes");
  const res = await axiosInstance.get(url);
  return res.data.result;
};

export const addPgGuestInfo = async (payload: any) => {
  const url = buildApiUrl("/addRecord", "guestInfo");
  return axiosInstance.post(url, buildPayload(payload));
};


export const getGuestInfo = (
  params?: GuestInfoQuery
): Promise<AxiosResponse<{ result: GuestInfo[] }>> => {
  const url = buildApiUrl("/getAllRecords", "guestInfo");

  return axiosInstance.get(url, { params });
};


export const getPgAggregations = (
  pgId: number,
  days: number = 15
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "aggregations"
  );

  return axiosInstance.get(url, {
    params: {
      pgId,
      days,
    },
  });
};


export const fetchRentStatusResidentsApi = async (
  pgId: number
): Promise<RentStatusResident[]> => {
  const url = buildApiUrl("/getAllRecords", "rentStatusResidents");

  const res = await axiosInstance.get(url, {
    params: {
      pgId,
    },
  });

  return res.data.data;
};