

import React, {
  useCallback,
  useEffect,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import OccupancyOverview from "./components/OccupancyOverview";
import UpcomingVacancy from "./components/UpcomingVacancy";
import ResidentHappiness from "./components/ResidentHappiness";
import RentStatus from "./components/RentStatus";
import QuickActions from "./components/QuickActions";

import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";

import { usePgRoomsStore } from "@/app/shared/store/roomsStore";

import { usePgBookingsStore } from "@/app/shared/store/bookingStore";

import { usePgAggregationsStore } from "@/app/shared/store/aggregationsStore";

import {
  getUpcomingVacancies,
} from "./utils/dashboardCalculations";

import type { VacancyItem } from "./components/UpcomingVacancy";

interface OwnerDashboardProps {
  onAddBooking?: () => void;
  onAddResident?: () => void;
  onAddRoom?: () => void;
  onMaintenance?: () => void;
  onBookings?: () => void;
  onNotifications?: () => void;
  onViewAllVacancies?: () => void;
  onPgSelector?: () => void;

  onBeds?: () => void;
  onIssues?: () => void;
  onMore?: () => void;

  onAddEnquiry?: () => void;
  onBroadcast?: () => void;
  onReports?: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onAddBooking,
  onAddResident,
  onMaintenance,
  onBookings,
  onNotifications,
  onViewAllVacancies,
  onPgSelector,

  onIssues,

  onAddEnquiry,
  onBroadcast,
  onReports,
}) => {
  const navigate = useNavigate();

  /* ============================================================
     PG STORE
  ============================================================ */

  const {
    pgInfoList,
    loading: pgLoading,
    fetchPgInfo,
  } = usePgInfoStore();

  /* ============================================================
     SELECTED PG STORE
  ============================================================ */

  const {
    selectedPg,
    selectedPgId,
    setSelectedPg,
  } = useSelectedPgStore();

  /* ============================================================
     ROOMS STORE

     These are used ONLY for Upcoming Vacancy details.
  ============================================================ */

  const {
    rooms,
    loading: roomsLoading,
    fetchRooms,
  } = usePgRoomsStore();

  
  
  /* ============================================================
     BOOKING STORE

     These are used ONLY for Upcoming Vacancy details.
  ============================================================ */

  const {
    bookings,
    loading: bookingsLoading,
    fetchBookings,
  } = usePgBookingsStore();

  /* ============================================================
     AGGREGATION STORE

     All dashboard statistics come from this API.
  ============================================================ */

  const {
    aggregations,
    loading: aggregationLoading,
    fetchAggregations,
  } = usePgAggregationsStore();

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
      const matchingPg = pgInfoList.find(
        (pg) =>
          Number(pg.id) === Number(selectedPgId)
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
      setSelectedPg(pgInfoList[0]);
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
    pgInfoList[0]?.id ??
    null;

  /* ============================================================
     FETCH DASHBOARD AGGREGATIONS

     This handles all dashboard calculations EXCEPT the
     detailed Upcoming Vacancy list.

     Examples:
       - occupancy
       - vacant beds
       - reserved beds
       - open issues
       - rent status
       - happiness
  ============================================================ */

  const loadDashboardAggregations =
    useCallback(async () => {
      if (!currentPgId) {
        return;
      }

      await fetchAggregations(
        Number(currentPgId)
      );
    }, [
      currentPgId,
      fetchAggregations,
    ]);

  useEffect(() => {
    loadDashboardAggregations();
  }, [
    loadDashboardAggregations,
  ]);

  /* ============================================================
     FETCH DATA REQUIRED FOR UPCOMING VACANCY

     IMPORTANT:

     We are NOT bringing back all old dashboard calculations.

     These three stores are needed because UpcomingVacancy
     displays the actual room/bed/resident/check-out details.

     rooms + beds + bookings
            ↓
     getUpcomingVacancies()
            ↓
     UpcomingVacancy component
  ============================================================ */

  const loadUpcomingVacancyData =
    useCallback(async () => {
      if (!currentPgId) {
        return;
      }

      await Promise.allSettled([
        fetchRooms({
          pg_info: Number(currentPgId),
        }),

       

        fetchBookings({
          pg_id: Number(currentPgId),
        }),
      ]);
    }, [
      currentPgId,
      fetchRooms,
     
      fetchBookings,
    ]);

  useEffect(() => {
    loadUpcomingVacancyData();
  }, [
    loadUpcomingVacancyData,
  ]);

  /* ============================================================
     UPCOMING VACANCIES

     KEEPING THE OLD LOGIC ONLY FOR THIS SECTION.

     The actual room + bed + resident + checkout data
     still comes from:

       bookings
       rooms
       bedInfoList

     The rest of the dashboard DOES NOT use these
     frontend calculations.
  ============================================================ */

  const upcomingVacancies =
    useMemo<VacancyItem[]>(
      () =>
        getUpcomingVacancies(
          bookings,
          rooms,
          
        ),
      [
        bookings,
        rooms,
       
      ]
    );

  /* ============================================================
     AGGREGATION DATA
  ============================================================ */

  const dashboard =
    aggregations?.dashboard;

  const bedMap =
    aggregations?.bedMap;

  const rentStatus =
    aggregations?.rentStatus;

  const happiness =
    aggregations?.happiness;

  /* ============================================================
     DASHBOARD VALUES

     THESE COME FROM BACKEND AGGREGATION API.
  ============================================================ */

  const occupiedBeds =
    dashboard?.occupancy?.occupied ??
    0;

  const totalBeds =
    dashboard?.occupancy?.total ??
    0;

  const occupancyPercentage =
    dashboard?.occupancy?.percentage ??
    0;

  const vacantBeds =
    dashboard?.vacantBeds ??
    0;

  const openIssues =
    dashboard?.openIssues ??
    0;

  /* ============================================================
     IMPORTANT:

     Upcoming Vacancy count comes from the ACTUAL
     frontend vacancy list because we need the same
     room/bed details that the old UI displayed.

     We are NOT using:

       dashboard.upcomingVacancy

     for the list.
  ============================================================ */

  const upcomingVacancyCount =
    upcomingVacancies.length;

  /* ============================================================
     BED MAP VALUES

     These come from aggregation API.
  ============================================================ */

  const bedMapTotalBeds =
    bedMap?.totalBeds ??
    totalBeds;

  const bedMapOccupiedBeds =
    bedMap?.occupiedBeds ??
    occupiedBeds;

  const bedMapVacantBeds =
    bedMap?.vacantBeds ??
    vacantBeds;

  /* ============================================================
     HAPPINESS

     Backend aggregation provides rating.
  ============================================================ */

  const happinessRating =
    happiness?.rating ??
    0;

  /*
   * These values are not currently provided
   * by the aggregation API.
   *
   * Keep safe defaults so the existing component
   * interface continues to work.
   */

  const resolvedThisWeek = 0;

  const happinessOverdueIssues = 0;

  const happinessTotalOpen =
    openIssues;

  /* ============================================================
     RENT STATUS

     Comes directly from backend aggregation.
  ============================================================ */

  const paid =
    rentStatus?.paid ??
    0;

  const due =
    rentStatus?.due ??
    0;

  const partial =
    rentStatus?.partial ??
    0;

  const overdue =
    rentStatus?.overdue ??
    0;

  /* ============================================================
     DASHBOARD LOADING
  ============================================================ */

  const dashboardLoading =
    pgLoading ||
    aggregationLoading;

  const upcomingVacancyLoading =
    roomsLoading ||
   
    bookingsLoading;

  /* ============================================================
     HEADER DATA
  ============================================================ */

  const pgName =
    selectedPg?.pg_name ||
    pgInfoList[0]?.pg_name ||
    "My PG";

  const ownerName =
    selectedPg?.user_info_first_name ||
    "Owner";

  /* ============================================================
     ACTION FALLBACKS
  ============================================================ */

  const handleAddEnquiry =
    onAddEnquiry ||
    onAddBooking;

  const handleBroadcast =
    onBroadcast ||
    onMaintenance;

  const handleViewResidents =
    onAddResident;

  const handleReports =
    onReports ||
    onBookings;

  const handleIssues =
    onIssues ||
    onMaintenance;

  const handleViewBedMap =
    useCallback(() => {
      navigate("/owner/bedmap");
    }, [navigate]);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      className="
        min-h-[100dvh]
        overflow-hidden
        bg-[#FAFBFC]
        pb-[68px]
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <DashboardHeader
        pgName={pgName}
        ownerName={ownerName}
        notificationCount={openIssues}
        onPgClick={onPgSelector}
        onNotificationClick={
          onNotifications
        }
      />

      {/* ======================================================
          DASHBOARD
      ====================================================== */}

      <main
        className="
          mx-auto
          max-w-[1080px]
          px-2.5
          pb-2
          pt-1.5

          sm:px-5
          sm:pb-5
          sm:pt-3
        "
      >
        {/* ====================================================
            TOP STATS
        ==================================================== */}

        <DashboardStats
          occupiedBeds={occupiedBeds}
          totalBeds={totalBeds}

          reservedBeds={
            bedMap?.reservedBeds ?? 0
          }

          availableBeds={vacantBeds}

          /*
           * Use actual upcoming vacancy list count.
           * This preserves the old behavior.
           */

          upcomingVacancies={
            upcomingVacancyCount
          }

          openIssues={openIssues}

          overdueIssues={overdue}

          occupancyPercentage={
            occupancyPercentage
          }

          loading={dashboardLoading}
        />

        {/* ====================================================
            TABLET + DESKTOP CONTENT
        ==================================================== */}

        <div
          className="
            mt-2
            grid
            grid-cols-2
            gap-2

            sm:mt-3
            sm:grid-cols-12
            sm:gap-2.5
          "
        >
          {/* ==================================================
              OCCUPANCY
          ================================================== */}

          <div
            className="
              min-w-0

              sm:col-span-4
            "
          >
            <OccupancyOverview
              totalBeds={
                bedMapTotalBeds
              }

              occupiedBeds={
                bedMapOccupiedBeds
              }

              vacantBeds={
                bedMapVacantBeds
              }

              

              // noticeBeds={
              //   upcomingVacancyCount
              // }

              occupancyPercentage={
                occupancyPercentage
              }

              loading={
                aggregationLoading ||
                upcomingVacancyLoading
              }

              onViewBedMap={
                handleViewBedMap
              }
            />
          </div>

          {/* ==================================================
              UPCOMING VACANCY

              RESTORED OLD ROOM/BED DATA
          ================================================== */}

         <div
  className="
    min-w-0
    min-h-0
    overflow-hidden

    sm:col-span-4
  "
>
  <UpcomingVacancy
    vacancies={upcomingVacancies}
    loading={upcomingVacancyLoading}
    onViewAll={onViewAllVacancies}
  />
</div>

          {/* ==================================================
              RESIDENT HAPPINESS
          ================================================== */}

          <div
            className="
              min-w-0

              sm:col-span-4
            "
          >
            <ResidentHappiness
              averageRating={
                happinessRating
              }

              resolvedThisWeek={
                resolvedThisWeek
              }

              overdueIssues={
                happinessOverdueIssues
              }

              totalOpen={
                happinessTotalOpen
              }

              loading={
                aggregationLoading
              }

              onReviewIssues={
                handleIssues
              }
            />
          </div>

          {/* ==================================================
              RENT STATUS
          ================================================== */}

          <div
            className="
              min-w-0

              sm:col-span-4
            "
          >
            <RentStatus
              paid={paid}
              due={due}
              partial={partial}
              overdue={overdue}

              loading={
                aggregationLoading
              }

              onSendReminders={
                onBookings
              }
            />
          </div>

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <div
            className="
              min-w-0
              col-span-2

              sm:col-span-8
            "
          >
            <QuickActions
              onAddEnquiry={
                handleAddEnquiry
              }

              onBroadcast={
                handleBroadcast
              }

              onViewResidents={
                handleViewResidents
              }

              onReports={
                handleReports
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;