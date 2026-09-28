

import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

import {
  ArrowLeft,
  Bell,
  Armchair,
  AlertTriangle,
  Users,
  Calendar,
  ChevronRight,
  ChevronDown,
  Phone,
  MessageCircle,
  UserPlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { PageShell } from "@/app/shared/components/PageShell";

import {
  useSelectedPgStore,
} from "@/app/shared/store/selectedPgStore";

import {
  usePgInfoStore,
} from "@/app/shared/store/pgInfoStore";

import {
  usePgRoomsStore,
} from "@/app/shared/store/roomsStore";

import {
  usePgBedInfoStore,
} from "@/app/shared/store/bedInfoStore";

import {
  usePgBookingsStore,
} from "@/app/shared/store/bookingStore";

import {
  useGuestInfoStore,
} from "@/app/shared/store/guestInfoStore";

import {
  usePgAggregationsStore,
} from "@/app/shared/store/aggregationsStore";

import AddBookingModal from "@/app/roles/owner/addBooking/AddBookingModal";
import AddUserBookingModal from "./AddUserBookingModal";


/* ============================================================
   TYPES
============================================================ */

export interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

export interface VacancyPipelineProps {
  pgName?: string;
  rooms?: any[];
  beds?: any[];
  bookings?: any[];
  guests?: any[];
  funnel?: FunnelStage[];
  onBack?: () => void;
}


/* ============================================================
   CONSTANTS
============================================================ */

/*
 * Booking status:
 *
 * 4 = Reserved / Open Booking
 * 5 = Upcoming Vacancy / Notice
 */
const BOOKING_STATUS_RESERVED = 4;
const BOOKING_STATUS_UPCOMING_VACANCY = 5;

const MIN_VISIBLE = 3;


/* ============================================================
   COMPONENT
============================================================ */

export default function VacancyPipeline({
  pgName,
  rooms: propRooms = [],
  beds: propBeds = [],
  bookings: propBookings = [],
  guests: propGuests = [],
  funnel,
  onBack,
}: VacancyPipelineProps): React.ReactElement {

  const navigate = useNavigate();


  /* ============================================================
     SELECTED PG
  ============================================================ */

  const {
    selectedPg,
    selectedPgId,
    setSelectedPg,
  } = useSelectedPgStore();


  /* ============================================================
     PG STORE
  ============================================================ */

  const {
    pgInfoList,
    loading: pgLoading,
    fetchPgInfo,
  } = usePgInfoStore();


  /* ============================================================
     ROOM STORE
  ============================================================ */

  const {
    rooms: storeRooms,
    loading: roomsLoading,
    fetchRooms,
  } = usePgRoomsStore();


  /* ============================================================
     BED STORE
  ============================================================ */

  const {
    bedInfoList,
    loading: bedsLoading,
    fetchBedInfo,
  } = usePgBedInfoStore();


  /* ============================================================
     BOOKING STORE
  ============================================================ */

  const {
    bookings: storeBookings,
    loading: bookingsLoading,
    fetchBookings,
  } = usePgBookingsStore();


  /* ============================================================
     GUEST STORE
  ============================================================ */

  const {
    guests: storeGuests,
    loading: guestsLoading,
    fetchGuests,
  } = useGuestInfoStore();


  /* ============================================================
     AGGREGATION STORE
  ============================================================ */

  const {
    aggregations,
    loading: aggregationLoading,
    fetchAggregations,
  } = usePgAggregationsStore();


  /* ============================================================
     ADD BOOKING MODAL
  ============================================================ */

  const [
  addBookingOpen,
  setAddBookingOpen,
] = useState(false);

const [
  assignBedOpen,
  setAssignBedOpen,
] = useState(false);

  /* ============================================================
     VACANCY RANGE FILTER
  ============================================================ */

  const [vacancyDays, setVacancyDays] =
    useState<number>(15);

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState<any | null>(null);


  /* ============================================================
     LOAD PG LIST
  ============================================================ */

  useEffect(() => {
    if (pgInfoList.length === 0) {
      fetchPgInfo();
    }
  }, [
    pgInfoList.length,
    fetchPgInfo,
  ]);


  /* ============================================================
     RESTORE SELECTED PG
  ============================================================ */

  useEffect(() => {
    if (
      selectedPgId &&
      !selectedPg &&
      pgInfoList.length > 0
    ) {
      const matchingPg =
        pgInfoList.find(
          (pg) =>
            Number(pg.id) ===
            Number(selectedPgId)
        );

      if (matchingPg) {
        setSelectedPg(matchingPg);
      }
    }
  }, [
    selectedPgId,
    selectedPg,
    pgInfoList,
    setSelectedPg,
  ]);


  /* ============================================================
     DEFAULT PG
  ============================================================ */

  useEffect(() => {
    if (
      !selectedPg &&
      !selectedPgId &&
      pgInfoList.length > 0
    ) {
      setSelectedPg(
        pgInfoList[0]
      );
    }
  }, [
    selectedPg,
    selectedPgId,
    pgInfoList,
    setSelectedPg,
  ]);


  /* ============================================================
     CURRENT PG ID
  ============================================================ */

  const currentPgId =
    selectedPg?.id ??
    selectedPgId ??
    null;


  /* ============================================================
     LOAD AGGREGATIONS
  ============================================================ */

  useEffect(() => {
    if (!currentPgId) return;

    fetchAggregations(
      Number(currentPgId),
      vacancyDays
    );
  }, [
    currentPgId,
    vacancyDays,
    fetchAggregations,
  ]);


  /* ============================================================
     LOAD DATA FOR SELECTED PG
  ============================================================ */

  useEffect(() => {
    if (!currentPgId) {
      return;
    }

    const loadData = async () => {
      await Promise.allSettled([
        fetchRooms({
          pg_info: Number(currentPgId),
        }),

        fetchBedInfo({
          pg_info_id:
            Number(currentPgId),
        }),

        /*
         * IMPORTANT:
         *
         * Do NOT send bkg_status = 4 here.
         *
         * Upcoming vacancies have bkg_status = 5.
         *
         * We need the PG bookings so we can separate:
         *
         * 4 -> Open / Reserved bookings
         * 5 -> Upcoming vacancies
         *
         * The filtering is done below.
         */
        fetchBookings({
          pg_id:
            Number(currentPgId),
        }),

        fetchGuests({
          pg_id:
            Number(currentPgId),
        }),

      ]);
    };

    loadData();
  }, [
    currentPgId,
    fetchRooms,
    fetchBedInfo,
    fetchBookings,
    fetchGuests,
  ]);


  /* ============================================================
     DATA SOURCE
  ============================================================ */

  const rooms =
    storeRooms.length > 0
      ? storeRooms
      : propRooms;

  const allBookings =
    storeBookings.length > 0
      ? storeBookings
      : propBookings;

  const beds =
    bedInfoList.length > 0
      ? bedInfoList
      : propBeds;

  const guests =
    storeGuests.length > 0
      ? storeGuests
      : propGuests;


  /* ============================================================
     NORMALIZE BOOKING STATUS
  ============================================================ */

  const getBookingStatusId = (
    booking: any
  ): number | null => {

    const rawStatus =
      booking?.bkg_status ??
      booking?.booking_status ??
      booking?.status_id;

    if (
      rawStatus !== undefined &&
      rawStatus !== null &&
      rawStatus !== ""
    ) {
      const numericStatus =
        Number(rawStatus);

      if (
        Number.isFinite(
          numericStatus
        )
      ) {
        return numericStatus;
      }
    }

    /*
     * Fallback for APIs that return
     * only status_code.
     */
    const statusCode =
      String(
        booking?.status_code ??
        ""
      )
        .trim()
        .toLowerCase();

    if (
      statusCode === "reserved" ||
      statusCode === "reserve"
    ) {
      return BOOKING_STATUS_RESERVED;
    }

    if (
      statusCode === "upcoming vacancy" ||
      statusCode === "notice"
    ) {
      return BOOKING_STATUS_UPCOMING_VACANCY;
    }

    return null;
  };


  /* ============================================================
     OPEN / RESERVED BOOKINGS
  ============================================================ */

  const openBookings =
    useMemo(() => {

      return allBookings.filter(
        (booking: any) =>
          getBookingStatusId(
            booking
          ) ===
          BOOKING_STATUS_RESERVED
      );

    }, [
      allBookings,
    ]);


  /* ============================================================
     UPCOMING VACANCY BOOKINGS
  ============================================================ */

  /* ============================================================
     UPCOMING VACANCIES

     The vacancy calendar comes from the aggregations API and is
     already filtered by the selected number of days.
  ============================================================ */

  const vacancyCalendar =
    aggregations?.vacancyCalendar;

  const vacancyList =
    useMemo(() => {
      const dates =
        vacancyCalendar?.dates ?? [];

      const result: any[] = [];

      dates.forEach((dateEntry: any) => {
        const bookings =
          Array.isArray(dateEntry?.bookings)
            ? dateEntry.bookings
            : [];

        bookings.forEach((calendarBooking: any) => {
          const sourceBooking =
            allBookings.find(
              (booking: any) =>
                Number(booking?.id) ===
                  Number(calendarBooking?.bookingId) ||
                Number(booking?.booking_id) ===
                  Number(calendarBooking?.bookingId)
            );

          const roomId =
            calendarBooking?.roomId ??
            sourceBooking?.room_id;

          const bedId =
            calendarBooking?.bedId ??
            sourceBooking?.bed_id;

          const room = rooms.find(
            (r: any) =>
              Number(r?.id) === Number(roomId)
          );

          const bed = beds.find(
            (b: any) =>
              Number(b?.id) === Number(bedId)
          );

          const roomName =
            sourceBooking?.room_name ??
            room?.room_name ??
            room?.room_no ??
            room?.room_number ??
            room?.name ??
            (roomId != null
              ? `Room ${roomId}`
              : "Room");

          const bedNumber =
            sourceBooking?.bed_number ??
            sourceBooking?.bed_no ??
            bed?.bed_number ??
            bed?.bed_no ??
            bed?.bed_name ??
            bed?.name;

          return result.push({
            id: `${
              calendarBooking?.bookingId ??
              "booking"
            }-${dateEntry?.date ?? "date"}-${
              bedId ?? "bed"
            }`,
            room: bedNumber
              ? `${roomName} - Bed ${bedNumber}`
              : roomName,
            date: dateEntry?.date ?? "—",
            tag: "Upcoming Vacancy",
            tagBg: "#E1EDFF",
            tagColor: "#2563EB",
          });
        });
      });

      return result.slice(0, 3);
    }, [
      vacancyCalendar,
      allBookings,
      rooms,
      beds,
    ]);


  /* ============================================================
     AGGREGATION DATA
  ============================================================ */

  const dashboard =
    aggregations?.dashboard;

  const aggregationResidents =
    aggregations?.residents;

  const aggregationRentStatus =
    aggregations?.rentStatus;

  const aggregationHappiness =
    aggregations?.happiness;

  const aggregationPipeline =
    aggregations?.vacancyPipeline;

  const aggregationBedMap =
    aggregations?.bedMap;


  /* ============================================================
     DYNAMIC STATS
  ============================================================ */

  const noticeValue =
    vacancyCalendar?.totalVacancies ??
    aggregationPipeline?.upcomingVacancy ??
    vacancyList.length;


  const vacantNowValue =
    dashboard?.vacantBeds ??
    aggregationBedMap?.vacantBeds ??
    0;


  /*
   * IMPORTANT:
   *
   * Only status 4 bookings are shown
   * as "Open Bookings".
   */
  const bookingsOpenValue =
    openBookings.length;


  const followUpsTodayValue = 0;


  /* ============================================================
     BOOKING LIST
  ============================================================ */

  const bookingList =
    useMemo(() => {

      return openBookings.map(
        (booking: any) => {

          const firstName =
            booking.first_name ??
            "";

          const lastName =
            booking.last_name ??
            "";

          const fullName =
            `${firstName} ${lastName}`
              .trim();

          const fallbackName =
            booking.bkg_no ??
            "Booking";

          const displayName =
            fullName ||
            fallbackName;


          const initials =
            `${firstName?.charAt(0) ?? ""}${
              lastName?.charAt(0) ?? ""
            }`.toUpperCase() ||
            "BK";


          const checkInDate =
            booking.planned_check_in_date
              ? new Date(
                  booking.planned_check_in_date
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )
              : "—";


          const roomName =
  booking.room_name ??
  "Room";

const room =
  rooms.find(
    (r: any) =>
      Number(r.id) ===
      Number(booking.room_id)
  );

const roomTypeText =
  room?.occupancy
    ? `Type: ${room.occupancy}`
    : "Type: —";

          const status =
            booking.status_code ??
            "Reserved";


          const bookingNumber =
            booking.bkg_no ??
            `#${booking.id}`;


          return {
            id:
              booking.id,

            /*
             * Keep original booking object
             * so Assign Bed can use it.
             */
            originalBooking:
              booking,

            initials,

            avatarBg:
              "#DCE8FF",

            avatarColor:
              "#2563EB",

            name:
              displayName,

            checkIn:
              `Check-in: ${checkInDate}`,

            room:
              roomTypeText,

            note:
              `${bookingNumber} • ${status}`,

            noteColor:
              "#2563EB",

            mobileNo:
              booking.mobile_no ??
              "",
          };
        }
      );

    }, [
      openBookings,
    ]);


  /* ============================================================
     ASSIGN BED
  ============================================================ */

  const handleAssignBed = (
  booking: any
) => {
  const originalBooking =
    booking?.originalBooking ??
    booking;

  setSelectedBooking(
    originalBooking
  );

  setAssignBedOpen(true);
};


  /* ============================================================
     ADD NEW BOOKING
  ============================================================ */

 const handleAddBooking = () => {
  setAddBookingOpen(true);
};


  /* ============================================================
     INITIAL VALUES FOR ASSIGN BED
  ============================================================ */

  const assignBedInitialValues =
    useMemo<
      Record<string, string> | undefined
    >(() => {

      if (!selectedBooking) {
        return undefined;
      }

      return {

         booking_id:
    selectedBooking.id != null
      ? String(selectedBooking.id)
      : "",

        pg_id:
          selectedBooking.pg_id != null
            ? String(
                selectedBooking.pg_id
              )
            : currentPgId
            ? String(
                currentPgId
              )
            : "",

        /*
         * We intentionally leave room_id
         * and bed_id empty.
         *
         * The purpose of Assign Bed is
         * to select the available bed.
         */
        room_id:
          "",

        bed_id:
          "",

        bkg_date:
          selectedBooking.bkg_date ??
          "",

        planned_check_in_date:
          selectedBooking.planned_check_in_date ??
          "",

        actual_check_in_date:
          selectedBooking.actual_check_in_date ??
          "",

        planned_check_out_date:
          selectedBooking.planned_check_out_date ??
          "",

        actual_check_out_date:
          selectedBooking.actual_check_out_date ??
          "",

        bkg_status:
          selectedBooking.bkg_status != null
            ? String(
                selectedBooking.bkg_status
              )
            : String(
                BOOKING_STATUS_RESERVED
              ),

        remarks:
          selectedBooking.remarks ??
          "",

        monthly_rent:
          selectedBooking.monthly_rent != null
            ? String(
                selectedBooking.monthly_rent
              )
            : "",

        secuirty_deposit:
          selectedBooking.secuirty_deposit != null
            ? String(
                selectedBooking.secuirty_deposit
              )
            : "",

        ac_charge:
          selectedBooking.ac_charge != null
            ? String(
                selectedBooking.ac_charge
              )
            : "",

        dth_charge:
          selectedBooking.dth_charge != null
            ? String(
                selectedBooking.dth_charge
              )
            : "",

        oven_charge:
          selectedBooking.oven_charge != null
            ? String(
                selectedBooking.oven_charge
              )
            : "",

        water_charge:
          selectedBooking.water_charge != null
            ? String(
                selectedBooking.water_charge
              )
            : "",

        laundry_charge:
          selectedBooking.laundry_charge != null
            ? String(
                selectedBooking.laundry_charge
              )
            : "",

        parking_charge:
          selectedBooking.parking_charge != null
            ? String(
                selectedBooking.parking_charge
              )
            : "",

        refrigerator_charge:
          selectedBooking.refrigerator_charge != null
            ? String(
                selectedBooking.refrigerator_charge
              )
            : "",

        electricity_fixed_charge:
          selectedBooking.electricity_fixed_charge != null
            ? String(
                selectedBooking.electricity_fixed_charge
              )
            : "",

        electricity_meter_charge:
          selectedBooking.electricity_meter_charge != null
            ? String(
                selectedBooking.electricity_meter_charge
              )
            : "",

        notice_period_time:
          selectedBooking.notice_period_time != null
            ? String(
                selectedBooking.notice_period_time
              )
            : "",
      };

    }, [
      selectedBooking,
      currentPgId,
    ]);


  /* ============================================================
     FUNNEL
  ============================================================ */

  const funnelStages =
    funnel &&
    funnel.length > 0
      ? funnel
      : [
          {
            label: "New",
            value:
              openBookings.length,
            color: "#2563EB",
          },
          {
            label: "Visited",
            value: 0,
            color: "#7C3AED",
          },
          {
            label: "Interested",
            value: 0,
            color: "#EA580C",
          },
          {
            label: "Converted",
            value: 0,
            color: "#16A34A",
          },
        ];


  /* ============================================================
     STATS
  ============================================================ */

  const stats = [
    {
      label: "Vacant Now",

      value:
        String(
          vacantNowValue
        ),

      sub:
        "Currently available",

      subColor:
        "text-emerald-600",

      valueColor:
        "text-emerald-600",

      icon:
        Armchair,

      iconBg:
        "bg-emerald-50",

      iconColor:
        "text-emerald-600",
    },

    {
      label: "Notice Period",

      value:
        String(
          noticeValue
        ),

      sub:
        `in next ${vacancyDays} days`,

      subColor:
        "text-slate-400",

      valueColor:
        "text-orange-500",

      icon:
        AlertTriangle,

      iconBg:
        "bg-orange-50",

      iconColor:
        "text-orange-500",
    },

    {
      label: "Bookings Open",

      value:
        String(
          bookingsOpenValue
        ),

      sub:
        "Currently open",

      subColor:
        "text-violet-600",

      valueColor:
        "text-violet-600",

      icon:
        Users,

      iconBg:
        "bg-violet-50",

      iconColor:
        "text-violet-600",
    },

    {
      label: "Follow-ups Today",

      value:
        String(
          followUpsTodayValue
        ),

      sub:
        "Due today",

      subColor:
        "text-slate-400",

      valueColor:
        "text-slate-900",

      icon:
        Calendar,

      iconBg:
        "bg-blue-50",

      iconColor:
        "text-blue-600",
    },
  ];


  /* ============================================================
     RESIDENT / RENT / HAPPINESS
  ============================================================ */

  const totalResidents =
    aggregationResidents
      ?.totalResidents ??
    guests.length;

  const activeResidents =
    aggregationResidents
      ?.activeResidents ??
    guests.length;

  const rentPaid =
    aggregationRentStatus
      ?.paid ??
    0;

  const rentDue =
    aggregationRentStatus
      ?.due ??
    0;

  const rentPartial =
    aggregationRentStatus
      ?.partial ??
    0;

  const rentOverdue =
    aggregationRentStatus
      ?.overdue ??
    0;

  const happinessRating =
    aggregationHappiness
      ?.rating ??
    0;


  /* ============================================================
     PG NAME
  ============================================================ */

  const currentPgName =
    selectedPg?.pg_name ??
    pgName ??
    "My PG";




  /* ============================================================
     BOOKING LIST HEIGHT
  ============================================================ */

  const listBoxRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const rowRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    fitCount,
    setFitCount,
  ] = useState(
    MIN_VISIBLE
  );

  const [
    needsForcedScroll,
    setNeedsForcedScroll,
  ] = useState(false);

  const [
    showAll,
    setShowAll,
  ] = useState(false);


  /* ============================================================
     CALCULATE HOW MANY BOOKING ROWS FIT
  ============================================================ */

  useLayoutEffect(() => {

    const box =
      listBoxRef.current;

    if (!box) {
      return;
    }

    const recompute = () => {

      const row =
        rowRef.current;

      if (!row) {
        return;
      }

      const availableHeight =
        box.clientHeight;

      const rowHeight =
        row
          .getBoundingClientRect()
          .height;

      if (
        availableHeight <= 0 ||
        rowHeight <= 0
      ) {
        return;
      }

      const gap =
        parseFloat(
          getComputedStyle(
            box
          ).rowGap || "0"
        ) || 0;

      const naturalFit =
        Math.max(
          0,
          Math.floor(
            (
              availableHeight +
              gap
            ) /
            (
              rowHeight +
              gap
            )
          )
        );

      const renderCount =
        Math.min(
          bookingList.length,
          Math.max(
            MIN_VISIBLE,
            naturalFit
          )
        );

      setFitCount(
        renderCount
      );

      setNeedsForcedScroll(
        renderCount >
          naturalFit
      );
    };

    recompute();

    const ro =
      new ResizeObserver(
        recompute
      );

    ro.observe(box);

    window.addEventListener(
      "orientationchange",
      recompute
    );

    return () => {

      ro.disconnect();

      window.removeEventListener(
        "orientationchange",
        recompute
      );
    };

  }, [
    bookingList.length,
  ]);


  /* ============================================================
     VISIBLE BOOKINGS
  ============================================================ */

  const visibleBookings =
    showAll
      ? bookingList
      : bookingList.slice(
          0,
          fitCount
        );


  const canExpand =
    bookingList.length >
    fitCount;


  const listScrolls =
    showAll ||
    needsForcedScroll;


  /* ============================================================
     LOADING
  ============================================================ */

  const pageLoading =
    pgLoading ||
    roomsLoading ||
    bedsLoading ||
    bookingsLoading ||
    guestsLoading ||
    aggregationLoading;


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <PageShell
        noScroll
        bottomPad={60}
      >

        {/* ======================================================
            MOBILE / TABLET TOP BAR
        ====================================================== */}

        <div
          className="
            flex
            h-[30px]
            shrink-0
            items-center
            justify-start

            sm:h-[38px]

            lg:hidden
          "
        >

          <button
            type="button"
            onClick={
              onBack ??
              (() =>
                navigate(-1))
            }
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-md
              hover:bg-slate-100

              sm:h-7
              sm:w-7
            "
            aria-label="Go back"
          >

            <ArrowLeft
              className="
                h-3.5
                w-3.5
                text-slate-800
              "
            />

          </button>

          <span
            className="
              ml-1
              text-sm
              font-extrabold
              leading-none
              text-blue-600

              sm:text-base
            "
          >
            MyPG
          </span>

          <button
            type="button"
            className="
              relative
              ml-auto
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-md
              hover:bg-slate-100

              sm:h-7
              sm:w-7
            "
            aria-label="Notifications"
          >

            <Bell
              className="
                h-3.5
                w-3.5
                text-slate-800
              "
            />

            <span
              className="
                absolute
                -right-0.5
                -top-0.5
                flex
                h-3
                min-w-3
                items-center
                justify-center
                rounded-md
                bg-red-500
                px-0.5
                text-[7px]
                font-bold
                leading-none
                text-white
              "
            >
              3
            </span>

          </button>

        </div>


        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mb-1
            flex
            shrink-0
            items-center
            justify-between

            sm:mb-1.5

            lg:mt-2
          "
        >

          <div className="min-w-0">

            <h1
              className="
                text-sm
                font-extrabold
                leading-tight
                text-slate-900

                sm:text-base

                md:text-lg
              "
            >
              Vacancy Pipeline
            </h1>

          </div>


          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >

            {/* Desktop notification */}

            <button
              type="button"
              className="
                relative
                hidden
                rounded-md
                border
                border-slate-200
                bg-white
                p-2
                hover:border-slate-300

                lg:flex
              "
              aria-label="Notifications"
            >

              <Bell
                className="
                  h-3
                  w-3
                  text-slate-700
                "
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-md
                  bg-red-500
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                3
              </span>

            </button>


            {/* PG selector */}

            <button
              type="button"
              className="
                flex
                max-w-[120px]
                items-center
                gap-1
                rounded-md
                border
                border-slate-200
                bg-white
                px-1.5
                py-0.5
                text-[8px]
                font-medium
                text-slate-700
                hover:border-slate-300

                sm:max-w-[150px]
                sm:px-2
                sm:py-1
                sm:text-[10px]

                md:max-w-[180px]
                md:px-3
                md:py-1.5
                md:text-xs
              "
            >

              <span className="truncate">
                {currentPgName}
              </span>

              <ChevronDown
                className="
                  h-3
                  w-3
                  shrink-0
                  text-slate-400
                "
              />

            </button>

          </div>

        </div>


        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div
          className="
            mb-1
            grid
            shrink-0
            grid-cols-4
            gap-1

            sm:mb-1.5
            sm:gap-1.5

            lg:gap-2
          "
        >

          {stats.map(
            (s) => {

              const Icon =
                s.icon;

              return (

                <div
                  key={
                    s.label
                  }
                  className="
                    flex
                    flex-col
                    items-center
                    gap-0.5
                    rounded-md
                    border
                    border-slate-200
                    bg-white
                    px-1
                    py-1
                    text-center
                    shadow-sm

                    sm:py-1.5
                  "
                >

                  <div
                    className={`
                      mb-0.5
                      flex
                      h-4
                      w-4
                      items-center
                      justify-center
                      rounded-full

                      sm:h-5
                      sm:w-5

                      ${s.iconBg}
                    `}
                  >

                    <Icon
                      className={`
                        h-2.5
                        w-2.5
                        ${s.iconColor}
                      `}
                      strokeWidth={
                        2.2
                      }
                    />

                  </div>

                  <span
                    className="
                      text-[6px]
                      font-semibold
                      leading-tight
                      text-slate-500

                      sm:text-[7.5px]
                    "
                  >
                    {s.label}
                  </span>

                  <span
                    className={`
                      text-[12px]
                      font-extrabold
                      leading-none

                      sm:text-sm

                      ${s.valueColor}
                    `}
                  >
                    {pageLoading
                      ? "—"
                      : s.value}
                  </span>

                  <span
                    className={`
                      hidden
                      text-[6.5px]
                      font-semibold
                      leading-none

                      sm:block

                      ${s.subColor}
                    `}
                  >
                    {s.sub}
                  </span>

                </div>

              );
            }
          )}

        </div>


        {/* ======================================================
            UPCOMING VACANCIES
        ====================================================== */}

        <div
          className="
            mb-1
            flex
            shrink-0
            flex-col
            gap-0.5
            rounded-md
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-sm

            sm:mb-1.5
            sm:p-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[9px]
                font-extrabold
                text-slate-900

                sm:text-[10.5px]
              "
            >
              Upcoming Vacancies
            </span>

            <select
              value={vacancyDays}
              onChange={(e) =>
                setVacancyDays(Number(e.target.value))
              }
              aria-label="Vacancy date range"
              className="
                h-6
                rounded-md
                border
                border-slate-200
                bg-white
                px-1.5
                text-[7.5px]
                font-bold
                text-slate-700
                outline-none
                focus:border-blue-400
                focus:ring-1
                focus:ring-blue-100

                sm:h-7
                sm:px-2
                sm:text-[8.5px]
              "
            >
              <option value={15}>Next 15 Days</option>
              <option value={30}>Next 30 Days</option>
              <option value={60}>Next 60 Days</option>
            </select>

          </div>


          {pageLoading ? (

            <div
              className="
                py-2
                text-center
                text-[8px]
                text-slate-400
              "
            >
              Loading vacancies...
            </div>

          ) : vacancyList.length === 0 ? (

            <div
              className="
                py-2
                text-center
                text-[8px]
                font-medium
                text-slate-400
              "
            >
              No upcoming vacancies
            </div>

          ) : (

            vacancyList.map(
              (v: any) => (

                <div
                  key={
                    v.room +
                    v.date
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    gap-1.5
                    border-t
                    border-slate-100
                    py-0.5

                    first:border-t-0

                    sm:py-1
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-1.5
                    "
                  >

                    <Calendar
                      className="
                        h-2.5
                        w-2.5
                        shrink-0
                        text-blue-600
                      "
                      strokeWidth={
                        2
                      }
                    />

                    <span
                      className="
                        whitespace-nowrap
                        text-[8px]
                        font-bold
                        text-slate-800

                        sm:text-[9px]
                      "
                    >
                      {v.room}
                    </span>

                  </div>

                  <span
                    className="
                      whitespace-nowrap
                      text-[8px]
                      font-medium
                      text-slate-400

                      sm:text-[9px]
                    "
                  >
                    {v.date}
                  </span>

                  <span
                    className="
                      whitespace-nowrap
                      rounded-full
                      px-1.5
                      py-0.5
                      text-[6.5px]
                      font-bold

                      sm:text-[7.5px]
                    "
                    style={{
                      background:
                        v.tagBg,
                      color:
                        v.tagColor,
                    }}
                  >
                    {v.tag}
                  </span>

                </div>

              )
            )

          )}

        </div>


        {/* ======================================================
            OPEN BOOKINGS
        ====================================================== */}

        <div
          className="
            mb-1
            flex
            min-h-0
            flex-1
            flex-col
            gap-1
            rounded-md
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-sm

            sm:mb-1.5
            sm:p-2
          "
        >

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[9px]
                font-extrabold
                text-slate-900

                sm:text-[10.5px]
              "
            >
              Open Bookings
            </span>


            {canExpand && (

              <button
                type="button"
                onClick={() =>
                  setShowAll(
                    (v) => !v
                  )
                }
                className="
                  text-[8px]
                  font-bold
                  text-blue-600

                  sm:text-[9px]
                "
              >
                {showAll
                  ? "Show Less"
                  : "See All"}
              </button>

            )}

          </div>


          <div
            ref={
              listBoxRef
            }
            className={`
              flex
              min-h-0
              flex-1
              flex-col
              gap-1

              ${
                listScrolls
                  ? "overflow-y-auto"
                  : "overflow-hidden"
              }
            `}
          >

            {pageLoading ? (

              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  text-[8px]
                  text-slate-400
                "
              >
                Loading bookings...
              </div>

            ) : visibleBookings.length === 0 ? (

              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  text-[8px]
                  font-medium
                  text-slate-400
                "
              >
                No open bookings
              </div>

            ) : (

              visibleBookings.map(
                (booking: any, i: number) => {

                  return (

                    <div
                      key={
                        booking.id
                      }
                      ref={
                        i === 0
                          ? rowRef
                          : undefined
                      }
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-1.5
                        rounded-md
                        border
                        border-slate-100
                        px-1.5
                        py-1
                      "
                    >

                      {/* LEFT */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-1.5
                        "
                      >

                        {/* Avatar */}

                        <div
                          className="
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-[6.5px]
                            font-extrabold

                            sm:h-6
                            sm:w-6
                            sm:text-[8px]
                          "
                          style={{
                            background:
                              booking.avatarBg,
                            color:
                              booking.avatarColor,
                          }}
                        >
                          {
                            booking.initials
                          }
                        </div>


                        {/* Booking information */}

                        <div
                          className="
                            flex
                            min-w-0
                            flex-col
                            gap-0.5
                          "
                        >

                          <span
                            className="
                              whitespace-nowrap
                              text-[8px]
                              font-bold
                              text-slate-900

                              sm:text-[9.5px]
                            "
                          >
                            {
                              booking.name
                            }
                          </span>


                          <span
                            className="
                              whitespace-nowrap
                              text-[6.5px]
                              font-medium
                              text-slate-400

                              sm:text-[7.5px]
                            "
                          >

                            {
                              booking.checkIn
                            }

                            &nbsp;
                            •
                            &nbsp;

                            {
                              booking.room
                            }

                          </span>


                          <span
                            className="
                              hidden
                              items-center
                              gap-1
                              whitespace-nowrap
                              text-[7px]
                              font-semibold

                              sm:flex
                              sm:text-[8px]
                            "
                            style={{
                              color:
                                booking.noteColor,
                            }}
                          >

                            <MessageCircle
                              className="
                                h-2
                                w-2
                              "
                            />

                            {
                              booking.note
                            }

                          </span>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div
                        className="
                          flex
                          shrink-0
                          flex-col
                          items-end
                          gap-0.5
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleAssignBed(
                              booking
                            )
                          }
                          className="
                            whitespace-nowrap
                            rounded-md
                            border
                            border-blue-600
                            px-1.5
                            py-0.5
                            text-[7px]
                            font-bold
                            text-blue-600
                            hover:bg-blue-50

                            sm:px-2
                            sm:text-[7.5px]
                          "
                        >
                          Assign Bed
                        </button>


                        {booking.mobileNo ? (

                          <a
                            href={`tel:${booking.mobileNo}`}
                            className="
                              hidden
                              items-center
                              gap-1
                              text-[7.5px]
                              font-bold
                              text-blue-600

                              sm:flex
                            "
                          >

                            <Phone
                              className="
                                h-2
                                w-2
                              "
                            />

                            Call

                          </a>

                        ) : (

                          <span
                            className="
                              hidden
                              items-center
                              gap-1
                              text-[7.5px]
                              font-bold
                              text-slate-300

                              sm:flex
                            "
                          >

                            <Phone
                              className="
                                h-2
                                w-2
                              "
                            />

                            No Phone

                          </span>

                        )}

                      </div>

                    </div>

                  );
                }
              )

            )}

          </div>

        </div>


        {/* ======================================================
            BOOKING CONVERSION FUNNEL
        ====================================================== */}

        <div
          className="
            mb-1
            flex
            shrink-0
            flex-col
            gap-0.5
            rounded-md
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-sm

            sm:mb-1.5
            sm:p-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[9px]
                font-extrabold
                text-slate-900

                sm:text-[10.5px]
              "
            >
              Booking Conversion Funnel
            </span>


            <span
              className="
                hidden
                items-center
                gap-0.5
                text-[8px]
                font-medium
                text-slate-400

                sm:flex
                sm:text-[9px]
              "
            >

              Last 7 Days

              <ChevronDown
                className="
                  h-2
                  w-2
                "
              />

            </span>

          </div>


          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            {funnelStages.map(
              (f, i) => (

                <React.Fragment
                  key={
                    f.label
                  }
                >

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-0.5
                    "
                  >

                    <span
                      className="
                        text-[7px]
                        font-semibold
                        text-slate-500

                        sm:text-[8px]
                      "
                    >
                      {f.label}
                    </span>

                    <span
                      className="
                        text-[12px]
                        font-extrabold

                        sm:text-sm
                      "
                      style={{
                        color:
                          f.color,
                      }}
                    >
                      {f.value}
                    </span>

                  </div>


                  {i <
                    funnelStages.length -
                      1 && (

                    <ChevronRight
                      className="
                        h-3
                        w-3
                        text-slate-300
                      "
                    />

                  )}

                </React.Fragment>

              )
            )}

          </div>

        </div>


        {/* ======================================================
            ADD NEW BOOKING
        ====================================================== */}

        <div
          className="
            mb-1
            flex
            shrink-0
            items-center
            justify-between
            gap-2
            rounded-md
            bg-blue-50
            px-2
            py-1

            sm:px-3
            sm:py-1.5
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >

            <div
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-100

                sm:h-7
                sm:w-7
              "
            >

              <UserPlus
                className="
                  h-3
                  w-3
                  text-blue-600
                "
                strokeWidth={
                  2.2
                }
              />

            </div>


            <div className="min-w-0">

              <div
                className="
                  whitespace-nowrap
                  text-[8.5px]
                  font-extrabold
                  text-slate-900

                  sm:text-[10px]
                "
              >
                Add New Booking
              </div>

              <div
                className="
                  hidden
                  truncate
                  text-[7px]
                  font-medium
                  text-slate-500

                  sm:block
                "
              >
                Create a new booking and assign a bed
              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={
              handleAddBooking
            }
            className="
              shrink-0
              whitespace-nowrap
              rounded-md
              bg-blue-600
              px-2
              py-1
              text-[7.5px]
              font-bold
              text-white
              hover:bg-blue-700

              sm:px-3
              sm:text-[9px]
            "
          >
            Add Booking
          </button>

        </div>

      </PageShell>


      {/* ======================================================
          ADD / ASSIGN BOOKING MODAL
      ====================================================== */}

    <AddBookingModal
  open={assignBedOpen}
  onClose={() => {
    setAssignBedOpen(false);
    setSelectedBooking(null);
  }}
  onSuccess={() => {
    if (currentPgId) {
      fetchBookings({
        pg_id: Number(currentPgId),
      });

      fetchRooms({
        pg_info: Number(currentPgId),
      });

      fetchBedInfo({
        pg_info_id: Number(currentPgId),
      });

      fetchAggregations(
        Number(currentPgId),
        vacancyDays
      );
    }
  }}
  editBookingId={
    selectedBooking?.id != null
      ? Number(selectedBooking.id)
      : undefined
  }
  initialValues={assignBedInitialValues}
/>

<AddUserBookingModal
  open={addBookingOpen}
  pgId={currentPgId}
  onClose={() => {
    setAddBookingOpen(false);
  }}
  onSuccess={() => {
    if (currentPgId) {
      fetchBookings({
        pg_id: Number(currentPgId),
      });

      fetchGuests({
        pg_id: Number(currentPgId),
      });

      fetchRooms({
        pg_info: Number(currentPgId),
      });

      fetchBedInfo({
        pg_info_id: Number(currentPgId),
      });

      fetchAggregations(
        Number(currentPgId),
        vacancyDays
      );
    }
  }}
/>

    </>
  );
}