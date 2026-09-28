
import {axiosInstance} from "@/network/axiosInstance";
import { buildApiUrl } from "@/servivces/utils/apiHelper";
import { buildPayload } from "@/servivces/utils/payloadHelper";
import { AxiosResponse } from "axios";

export interface CheckinCheckoutBooking {
  booking_id: number;
  booking_no: string;
  guest_id: number;
  room_id: number;
  bed_id: number;
  planned_check_in_date: string;
  actual_check_in_date: string | null;
  planned_check_out_date: string;
  actual_check_out_date: string | null;
  booking_status: number;
  status: string;
}

export interface CheckinCheckoutSummary {
  todaysCheckIns: number;
  todaysCheckOuts: number;
  pendingKyc: number;
  vacantReady: number;
}

export interface CheckinCheckoutToday {
  arrivals: CheckinCheckoutBooking[];
  checkouts: CheckinCheckoutBooking[];
}

export interface CheckinCheckoutUpcoming {
  arrivals: CheckinCheckoutBooking[];
  checkouts: CheckinCheckoutBooking[];
}

export interface CheckinCheckoutCompleted {
  arrivals: CheckinCheckoutBooking[];
  checkouts: CheckinCheckoutBooking[];
}

export interface CheckinCheckoutKyc {
  statusCodeUsed: number;
  status5Bookings: number;
  uniqueStatus5Guests: number;
  guestsWithKyc: number;
  bookingsWithKyc: number;
  bookingsWithoutKyc: number;
}

export interface CheckinCheckoutResponse {
  summary: CheckinCheckoutSummary;
  today: CheckinCheckoutToday;
  upcoming: CheckinCheckoutUpcoming;
  completed: CheckinCheckoutCompleted;
  walkInEnquiries: number;
  kyc: CheckinCheckoutKyc;
}


export interface CheckinCheckoutUpdatePayload {
  booking_id: number;
  action: "check_in" | "check_out";
  user_id: number;
}




export const fetchCheckinCheckoutApi = async (
  pgId: number,
): Promise<CheckinCheckoutResponse> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "checkinCheckout",
  );

  const res = await axiosInstance.get(url, {
    params: {
      pg_id: pgId,
    },
  });

  return res.data.data as CheckinCheckoutResponse;
};



export const updateCheckinCheckout = (
  fields: CheckinCheckoutUpdatePayload
): Promise<AxiosResponse<any>> => {
  const url = buildApiUrl("/updateRecord", "updateCheckinCheckout");

  return axiosInstance.put(url, {
    fields,
  });
};