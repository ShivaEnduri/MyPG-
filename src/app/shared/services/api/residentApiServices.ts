
import {axiosInstance} from "@/network/axiosInstance";
import { buildApiUrl } from "@/servivces/utils/apiHelper";
import { buildPayload } from "@/servivces/utils/payloadHelper";
import { AxiosResponse } from "axios";




export interface ResidentDashboardResponse {
  pg: {
    id: number;
    name: string;
  };

  summary: {
    openRequests: number;
    announcements: number;
  };

  resident: {
    guestId: number;
    userId: number;
    name: string;
    mobile: string;
    email: string;

    stay: {
      bookingId: number;

      room: {
        id: number;
        name: string;
      };

      bed: {
        id: number;
        number: number;
      };

      joinedOn: string;
      expectedCheckout: string;
      status: string;
    };

    rentStatus: {
      monthlyRent: number;
      status: string;
    };
  };

  recentRequests: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    etaDate: string;
    SLA: number;
    categoryId: number;
    statusId: number;
    feedback: number | null;
    feedbackSummary: string | null;
    pgId: number;
  }[];

  latestAnnouncements: {
    id: number;
    title: string;
    description: string;
    date: string;
  }[];
}



export interface MyStayResident {
  guestId: number;
  userId: number;
  name: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  guestType: number;
  guestStatus: number;
}

export interface MyStayRoom {
  id: number;
  name: string;
}

export interface MyStayBed {
  id: number;
  number: number;
}

export interface MyStayDuration {
  months: number;
  text: string;
}

export interface MyStayStay {
  bookingId: number;
  room: MyStayRoom;
  bed: MyStayBed;
  sharingType: string;
  floor: number;
  joinedOn: string;
  expectedCheckout: string;
  actualCheckout: string | null;
  status: string;
  duration: MyStayDuration;
}

export interface MyStayRoomDetails {
  roomId: number;
  roomName: string;
  sharingType: string;
  numberOfBeds: number;
  floor: number;
  bathroomType: number;
  monthlyRent: number;
  tv: boolean;
  ac: boolean;
  balcony: boolean;
  wifiIncluded: boolean;
  housekeepingIncluded: boolean;
}

export interface MyStayRoommate {
  id: number;
  name: string;
  bed?: string | number;
  mobile?: string;
}

export interface MyStayAmenity {
  id: number;
  name: string;
}

export interface MyStayManager {
  id: number;
  name: string;
  mobile: string;
  email: string;
}

export interface MyStayNoticeCheckout {
  expectedCheckout: string;
  noticePeriodDays: number;
  checkoutRequested: boolean;
}

export interface MyStayResidentDetails {
  resident: MyStayResident;
  stay: MyStayStay;
  roomDetails: MyStayRoomDetails;
  roommates: MyStayRoommate[];
  amenities: MyStayAmenity[];
  managers: MyStayManager[];
  noticeCheckout: MyStayNoticeCheckout;
}

export interface MyStayData {
  pg: {
    id: number;
    name: string;
  };
  totalResidents: number;
  residents: MyStayResidentDetails[];
}


export interface ResidentInfo {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  guestId: number;
  pgId: number;
}

export interface BookingRoom {
  id: number;
  name: string;
}

export interface BookingBed {
  id: number;
  number: number;
}

export interface ResidentBooking {
  id: number;
  bookingNo: string;
  pgId: number;
  room: BookingRoom;
  bed: BookingBed;
  monthlyRent: number;
  securityDeposit: number;
  checkInDate: string;
  plannedCheckOutDate: string | null;
  actualCheckOutDate: string | null;
  statusId: number;
}

export interface RentStatusInfo {
  currentDue: number;
  dueDate: string | null;
  reminderCount: number;
  lastStatus: {
    id: number;
    code: string;
    name: string;
    key: string;
  } | null;
}

export interface CurrentMonthInfo {
  month: string;
  invoiceId: number;
  invoiceNo: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string | null;
  status: {
    id: number;
    code: string;
    name: string;
    key: string;
  } | null;
}

export interface Reminder {
  id: number;
  title: string;
  description: string;
  priority: number;
  statusId: number;
  receiver: number | null;
  receiverRole: number | null;
  date: string | null;
}

export interface ReminderTimelineItem {
  type: string;
  title: string;
  date: string;
  status: string;
}

export interface RentHistoryItem {
  invoiceId: number;
  invoiceNo: string;
  month: string;
  fromDate: string;
  toDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string | null;
  status: {
    id: number;
    code: string;
    name: string;
    key: string;
  } | null;
}

export interface RentAggregates {
  totalInvoices: number;
  paid: number;
  due: number;
  partial: number;
  overdue: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface RentInvoice {
  invoiceId: number;
  invoiceNo: string;
  bookingId: number;
  amount: number;
  paidAmount: number;
  balance: number;
  invoiceDate: string;
  fromDate: string;
  toDate: string;
  dueDate: string | null;
  paymentId: number | null;
  paymentNo: string | null;
  paymentDate: string | null;
  status: {
    id: number;
    code: string;
    name: string;
    key: string;
  } | null;
  remarks: string | null;
}

export interface ResidentRentStatusData {
  success?: boolean;
  message?: string;

  resident: ResidentInfo;
  booking: ResidentBooking;
  rentStatus: RentStatusInfo;
  currentMonth: CurrentMonthInfo;
  reminders: {
    count: number;
    data: Reminder[];
  };
  reminderTimeline: ReminderTimelineItem[];
  recentRentHistory: RentHistoryItem[];
  aggregates: RentAggregates;
  invoices: RentInvoice[];
}


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

export interface AnnouncementSummary {
  all: number;
  new: number;
  important: number;
  thisWeek: number;
  alerts: number;
  events: number;
}

export interface AnnouncementFilter {
  label: string;
  count: number;
}

export interface AnnouncementFilters {
  all: AnnouncementFilter;
  important: AnnouncementFilter;
  utilities: AnnouncementFilter;
  events: AnnouncementFilter;
}

export interface AnnouncementRecord {
  id: number;
  type: string;
  title: string;
  description: string | null;

  eventDate?: string | null;

  categoryId?: number | null;
  category?: string | null;

  priorityId?: number | null;
  priority?: string | null;
  priorityDescription?: string | null;

  isImportant?: boolean | null;

  receiverRoleId?: number | null;
  receiverRole?: string | null;
  receiverId?: number | null;

  statusId?: number | null;
  status?: string | null;

  pgId: number;

  uiCategory?: string | null;
  uiStatus?: string | null;

  isNew?: boolean | null;
  isRead?: boolean | null;
}

export interface AnnouncementsData {
  summary: AnnouncementSummary;

  filters: AnnouncementFilters;

  announcements: AnnouncementRecord[];
}




export const fetchResidentDashboardApi = async ( userId: number ): Promise<ResidentDashboardResponse> =>
   { 
    const url = buildApiUrl( "/getAllRecords", "residentDashboard" );
     const res = await axiosInstance.get(url, { params: { userId, }, });
      return res.data.data as ResidentDashboardResponse; };



export const fetchMyStayApi = async (
  queryParams?: Record<string, string | number>
): Promise<MyStayData> => {
  const url = buildApiUrl("/getAllRecords", "mystay");

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data.data as MyStayData;
};


export const fetchResidentRentStatusApi = async (
  queryParams?: Record<string, string | number>
): Promise<ResidentRentStatusData> => {
  const url = buildApiUrl("/getAllRecords", "residentRentStatus");

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data as ResidentRentStatusData;
};


export const fetchAnnouncementsApi = async (
  queryParams?: Record<string, string | number>
): Promise<AnnouncementsData> => {
  const url = buildApiUrl(
    "/getAllRecords",
    "announcements"
  );

  const res = await axiosInstance.get(url, {
    params: queryParams,
  });

  return res.data.data as AnnouncementsData;
};