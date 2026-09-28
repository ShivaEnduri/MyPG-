



import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Bell,
  ChevronDown,
  Phone,
  Users,
  AlertTriangle,
  UserPlus,
  CalendarClock,
  MessageCircle,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { usePgBookingsStore } from "@/app/shared/store/bookingStore";
import { usePgCurrentStatusStore } from "@/app/shared/store/currentStatusStore";
import type { BookingPayload } from "@/app/shared/services/api/commonApiServices";
import { PageShell } from "@/app/shared/components/PageShell";

/* ============================================================================
 * STATUS HANDLING
 * ========================================================================== */

const EXPLICIT_NOTICE_STATUS_CODES = new Set([
  "NoticeGiven",
  "NoticeAccepted",
  "InNoticePeriod",
]);

const EXCLUDED_STATUS_CODES = new Set([
  "Departed",
  "Cancelled",
]);

const NOTICE_WINDOW_DAYS = 15;
const NEW_RESIDENT_DAYS = 30;

/* ============================================================================
 * RESIDENT BADGE STYLES
 * ========================================================================== */

const RESIDENT_BADGE_STYLES = {
  active: {
    label: "Active",
    badge: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },

  notice: {
    label: "Notice",
    badge: "bg-orange-50 text-orange-600",
    dot: "bg-orange-500",
  },

  new: {
    label: "New",
    badge: "bg-violet-50 text-violet-600",
    dot: "bg-violet-500",
  },

  upcoming: {
    label: "Upcoming",
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
} as const;

/* ============================================================================
 * TYPES
 * ========================================================================== */

interface ResidentRecord {
  guestId: number;
  bookingId: number;
  name: string;
  mobile: string;
  email?: string | null;

  roomName?: string;
  bedLabel?: string;

  actualCheckIn: string | null;
  actualCheckOut: string | null;

  joinedOn: string | null;
  expectedCheckout: string | null;

  isNewOnboarding: boolean;
  isResidingNow: boolean;
  isOnNotice: boolean;

  statusCode: string;
  rating?: number;
}

type TabKey =
  | "all"
  | "active"
  | "notice"
  | "new";

/* ============================================================================
 * DESKTOP TABLE GRID
 *
 * IMPORTANT:
 * Same grid is used by:
 * - table header
 * - table rows
 * - table skeleton
 *
 * No min-width and no horizontal scrolling.
 * ========================================================================== */

const DESKTOP_TABLE_GRID =
  "grid-cols-[minmax(170px,1.55fr)_minmax(105px,0.95fr)_minmax(90px,0.85fr)_minmax(90px,0.85fr)_minmax(55px,0.5fr)_minmax(75px,0.65fr)_minmax(145px,1.25fr)]";

/* ============================================================================
 * AVATAR HELPERS
 * ========================================================================== */

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
}

function getAvatarColor(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash =
      seed.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return AVATAR_COLORS[
    Math.abs(hash) % AVATAR_COLORS.length
  ];
}

/* ============================================================================
 * DATE HELPERS
 * ========================================================================== */

function formatDate(
  iso?: string | null
) {
  if (!iso) return "—";

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return "—";
  }

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function monthsBetween(
  a: Date,
  b: Date
) {
  return Math.max(
    0,
    (b.getFullYear() - a.getFullYear()) * 12 +
      (b.getMonth() - a.getMonth())
  );
}

/* ============================================================================
 * NEW RESIDENT LOGIC
 *
 * New means:
 * - actual check-in exists
 * - actual checkout does NOT exist
 * - actual check-in happened within the last 30 days
 *
 * Planned/future check-in does NOT make a resident New.
 * Checked-out residents do NOT remain New.
 * ========================================================================== */

function isActualCheckInWithinLast30Days(
  actualCheckInIso:
    | string
    | null
    | undefined,
  actualCheckOutIso:
    | string
    | null
    | undefined
): boolean {
  if (!actualCheckInIso) {
    return false;
  }

  if (actualCheckOutIso) {
    return false;
  }

  const checkIn = new Date(
    actualCheckInIso
  );

  if (Number.isNaN(checkIn.getTime())) {
    return false;
  }

  const now = new Date();

  // Future check-in is never New.
  if (
    checkIn.getTime() >
    now.getTime()
  ) {
    return false;
  }

  const msPerDay =
    1000 * 60 * 60 * 24;

  const daysSinceCheckIn =
    (now.getTime() -
      checkIn.getTime()) /
    msPerDay;

  return (
    daysSinceCheckIn >= 0 &&
    daysSinceCheckIn <=
      NEW_RESIDENT_DAYS
  );
}

/* ============================================================================
 * NOTICE WINDOW
 * ========================================================================== */

function isWithinNoticeWindow(
  checkoutIso:
    | string
    | null
    | undefined,
  actualCheckoutIso:
    | string
    | null
    | undefined,
  windowDays: number
): boolean {
  if (actualCheckoutIso) {
    return false;
  }

  if (!checkoutIso) {
    return false;
  }

  const checkout =
    new Date(checkoutIso);

  if (
    Number.isNaN(
      checkout.getTime()
    )
  ) {
    return false;
  }

  const now = new Date();

  const msPerDay =
    1000 * 60 * 60 * 24;

  const daysUntilCheckout =
    (checkout.getTime() -
      now.getTime()) /
    msPerDay;

  return (
    daysUntilCheckout >= 0 &&
    daysUntilCheckout <= windowDays
  );
}

/* ============================================================================
 * LATEST BOOKING PER GUEST
 * ========================================================================== */

function latestBookingPerGuest(
  bookings: BookingPayload[]
): BookingPayload[] {
  const byGuest =
    new Map<
      number,
      BookingPayload
    >();

  for (const b of bookings) {
    const existing =
      byGuest.get(b.guest_id);

    if (
      !existing ||
      new Date(b.bkg_date) >
        new Date(existing.bkg_date)
    ) {
      byGuest.set(
        b.guest_id,
        b
      );
    }
  }

  return Array.from(
    byGuest.values()
  );
}

/* ============================================================================
 * MAIN COMPONENT
 * ========================================================================== */

export default function ResidentsPage() {
  const selectedPg =
    useSelectedPgStore(
      (s) => s.selectedPg
    );

  const selectedPgId =
    useSelectedPgStore(
      (s) => s.selectedPgId
    );

  const {
    bookings,
    loading:
      bookingsLoading,
    fetchBookings,
  } =
    usePgBookingsStore();

  const {
    statuses,
    loading:
      statusesLoading,
    fetchStatuses,
  } =
    usePgCurrentStatusStore();

  /* ------------------------------------------------------------------------
     LOCAL STATE
  ------------------------------------------------------------------------ */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    tab,
    setTab,
  ] = useState<TabKey>("all");

  /* ------------------------------------------------------------------------
     FETCH BOOKINGS
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedPgId) {
      return;
    }

    fetchBookings({
      pg_id: selectedPgId,
    });
  }, [
    selectedPgId,
    fetchBookings,
  ]);

  /* ------------------------------------------------------------------------
     FETCH STATUS CATALOG
  ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  /* ------------------------------------------------------------------------
     STATUS LOOKUP
  ------------------------------------------------------------------------ */

  const statusCodeById =
    useMemo(
      () =>
        new Map(
          statuses.map((s) => [
            s.id,
            s.status_code,
          ])
        ),
      [statuses]
    );

  /* ------------------------------------------------------------------------
     BUILD RESIDENT RECORDS
  ------------------------------------------------------------------------ */

  const residents: ResidentRecord[] =
    useMemo(() => {
      const latest =
        latestBookingPerGuest(
          bookings
        );

      return latest
        .map(
          (
            b
          ): ResidentRecord | null => {
            const statusCode =
              statusCodeById.get(
                b.guest_status
              ) ??
              "Unknown";

            if (
              EXCLUDED_STATUS_CODES.has(
                statusCode
              )
            ) {
              return null;
            }

            const actualCheckIn =
              b.actual_check_in_date ??
              null;

            const actualCheckOut =
              b.actual_check_out_date ??
              null;

            /* Active is based on actual stay. */
            const isResidingNow =
              Boolean(
                actualCheckIn &&
                  !actualCheckOut
              );

            /* New is based only on actual check-in. */
            const isNewOnboarding =
              isActualCheckInWithinLast30Days(
                actualCheckIn,
                actualCheckOut
              );

            const isOnNotice =
              isResidingNow &&
              (
                EXPLICIT_NOTICE_STATUS_CODES.has(
                  statusCode
                ) ||
                isWithinNoticeWindow(
                  b.planned_check_out_date,
                  actualCheckOut,
                  NOTICE_WINDOW_DAYS
                )
              );

            const joinedOn =
              actualCheckIn ||
              b.planned_check_in_date ||
              null;

            return {
              guestId:
                b.guest_id,

              bookingId:
                b.id,

              name:
                `${b.first_name ?? ""} ${
                  b.last_name ?? ""
                }`.trim() ||
                "Unnamed guest",

              mobile:
                b.mobile_no,

              email:
                b.email_id,

              roomName:
                b.room_name,

              bedLabel:
                b.bed_number != null
                  ? `Bed ${b.bed_number}`
                  : undefined,

              actualCheckIn,
              actualCheckOut,

              joinedOn,

              expectedCheckout:
                b.planned_check_out_date ??
                null,

              isNewOnboarding,

              isResidingNow,

              isOnNotice,

              statusCode,

              rating:
                (b as any).rating,
            };
          }
        )
        .filter(
          (
            r
          ): r is ResidentRecord =>
            r !== null
        );
    }, [
      bookings,
      statusCodeById,
    ]);

  /* ------------------------------------------------------------------------
     FILTERED RESIDENTS
  ------------------------------------------------------------------------ */

  const filtered =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return residents.filter(
        (r) => {
          if (
            tab === "active" &&
            !r.isResidingNow
          ) {
            return false;
          }

          if (
            tab === "notice" &&
            !r.isOnNotice
          ) {
            return false;
          }

          if (
            tab === "new" &&
            !r.isNewOnboarding
          ) {
            return false;
          }

          if (!q) {
            return true;
          }

          return (
            r.name
              .toLowerCase()
              .includes(q) ||
            r.mobile
              ?.toLowerCase()
              .includes(q) ||
            r.roomName
              ?.toLowerCase()
              .includes(q)
          );
        }
      );
    }, [
      residents,
      search,
      tab,
    ]);

  /* ------------------------------------------------------------------------
     COUNTS
  ------------------------------------------------------------------------ */

  const counts =
    useMemo(
      () => ({
        all:
          residents.length,

        active:
          residents.filter(
            (r) =>
              r.isResidingNow
          ).length,

        notice:
          residents.filter(
            (r) =>
              r.isOnNotice
          ).length,

        new:
          residents.filter(
            (r) =>
              r.isNewOnboarding
          ).length,
      }),
      [residents]
    );

  /* ------------------------------------------------------------------------
     AVERAGE STAY
  ------------------------------------------------------------------------ */

  const avgStayMonths =
    useMemo(() => {
      const withDates =
        residents.filter(
          (r) => r.joinedOn
        );

      if (
        !withDates.length
      ) {
        return null;
      }

      const now =
        new Date();

      const total =
        withDates.reduce(
          (sum, r) =>
            sum +
            monthsBetween(
              new Date(
                r.joinedOn as string
              ),
              now
            ),
          0
        );

      return (
        total /
        withDates.length
      ).toFixed(1);
    }, [residents]);

  /* ------------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------------ */

  const isLoading =
    bookingsLoading ||
    statusesLoading;

  /* ------------------------------------------------------------------------
     TABS
  ------------------------------------------------------------------------ */

  const TABS: {
    key: TabKey;
    label: string;
    icon: React.ElementType;
    count: number;
  }[] = [
    {
      key: "all",
      label: "All",
      icon: Users,
      count: counts.all,
    },
    {
      key: "active",
      label: "Active",
      icon: Users,
      count: counts.active,
    },
    {
      key: "notice",
      label: "Notice",
      icon: AlertTriangle,
      count: counts.notice,
    },
    {
      key: "new",
      label: "New",
      icon: Sparkles,
      count: counts.new,
    },
  ];

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <PageShell>
      <div
        className="
          mx-auto
          max-w-6xl
          min-w-0
          px-2.5
          py-3
          sm:px-4
          sm:py-4
          lg:px-5
          lg:py-5
          pb-8
        "
      >
        {/* ==================================================================
            TOP BAR
        ================================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-lg
              font-extrabold
              tracking-tight
              text-blue-600
              sm:text-xl
            "
          >
            MyPG
          </span>

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              rounded-md
              p-1.5
              hover:bg-slate-100
              sm:p-2
            "
          >
            <Bell
              className="
                h-4
                w-4
                text-slate-700
                sm:h-5
                sm:w-5
              "
            />
          </button>
        </div>

        {/* ==================================================================
            PAGE HEADER
        ================================================================== */}

        <div
          className="
            mt-2.5
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
            sm:mt-3
            sm:gap-3
          "
        >
          <h1
            className="
              text-lg
              font-bold
              leading-tight
              text-slate-900
              sm:text-2xl
            "
          >
            Residents
          </h1>

          <button
            type="button"
            className="
              flex
              max-w-[150px]
              min-w-0
              items-center
              gap-1.5
              rounded-md
              border
              border-slate-200
              bg-white
              px-2.5
              py-1.5
              text-[10px]
              font-medium
              text-slate-700
              shadow-sm
              hover:bg-slate-50
              sm:max-w-[190px]
              sm:px-3
              sm:py-2
              sm:text-xs
            "
          >
            <span className="truncate">
              {selectedPg?.pg_name ??
                "Select PG"}
            </span>

            <ChevronDown
              className="
                h-3
                w-3
                shrink-0
                text-slate-400
                sm:h-4
                sm:w-4
              "
            />
          </button>
        </div>

        {/* ==================================================================
            SEARCH + FILTER
        ================================================================== */}

        <div
          className="
            mt-2.5
            flex
            gap-1.5
            sm:mt-3
            sm:gap-2
          "
        >
          <div
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-slate-400
                sm:left-3
                sm:h-4
                sm:w-4
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search residents by name, room or phone..."
              className="
                w-full
                min-w-0
                rounded-md
                border
                border-slate-200
                bg-white
                py-2
                pl-8
                pr-2.5
                text-[10px]
                text-slate-700
                shadow-sm
                outline-none
                placeholder:text-slate-400
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
                sm:py-2.5
                sm:pl-9
                sm:pr-3
                sm:text-xs
              "
            />
          </div>

          <button
            type="button"
            aria-label="Filters"
            className="
              flex
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-slate-200
              bg-white
              px-2.5
              text-slate-500
              shadow-sm
              hover:bg-slate-50
              sm:px-3
            "
          >
            <Filter
              className="
                h-3.5
                w-3.5
                sm:h-4
                sm:w-4
              "
            />
          </button>
        </div>

        {/* ==================================================================
            TABS
        ================================================================== */}

        <div
          className="
            mt-2.5
            grid
            grid-cols-4
            gap-1
            sm:flex
            sm:gap-2
          "
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active =
              tab === t.key;

            return (
              <button
                key={t.key}
                type="button"
                onClick={() =>
                  setTab(t.key)
                }
                className={`
                  flex
                  min-w-0
                  items-center
                  justify-center
                  gap-0.5
                  rounded-md
                  border
                  px-1
                  py-1.5
                  text-[8px]
                  font-medium
                  transition
                  sm:flex-none
                  sm:gap-1.5
                  sm:px-3
                  sm:py-2
                  sm:text-xs

                  ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <Icon
                  className="
                    h-3
                    w-3
                    shrink-0
                    sm:h-3.5
                    sm:w-3.5
                  "
                />

                <span className="truncate">
                  {t.label}
                </span>

                <span
                  className={`
                    shrink-0
                    ${
                      active
                        ? "text-blue-700"
                        : "text-slate-400"
                    }
                  `}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ==================================================================
            STATS
        ================================================================== */}

        <div
          className="
            mt-3
            grid
            grid-cols-4
            gap-2
            lg:gap-3
          "
        >
          <StatCard
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            value={counts.active}
            label="Active Residents"
          />

          <StatCard
            icon={AlertTriangle}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            value={counts.notice}
            label="Notice Period"
          />

          <StatCard
            icon={UserPlus}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            value={counts.new}
            label="New This Month"
          />

          <StatCard
            icon={CalendarClock}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            value={
              avgStayMonths ?? "—"
            }
            label="Avg. Stay (Months)"
          />
        </div>

        {/* ==================================================================
            RESIDENT LIST
        ================================================================== */}

        <div
          className="
            mt-3
            min-w-0
            sm:mt-4
          "
        >
          {!selectedPgId ? (
            <EmptyState
              message="Select a PG to see its residents."
            />
          ) : isLoading ? (
            <>
              {/* ============================================================
                  MOBILE + TABLET
                  OLD CARD DESIGN
                  < 1024px
              ============================================================ */}

              <div
                className="
                  space-y-2
                  lg:hidden
                "
              >
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>

              {/* ============================================================
                  LAPTOP + DESKTOP
                  TABLE DESIGN
                  >= 1024px

                  NO HORIZONTAL SCROLL
              ============================================================ */}

              <TableSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <EmptyState
              message="No residents match your search."
            />
          ) : (
            <>
              {/* ============================================================
                  MOBILE + TABLET
                  OLD CARD DESIGN
                  < lg
              ============================================================ */}

              <div
                className="
                  space-y-2
                  lg:hidden
                "
              >
                {filtered.map((r) => (
                  <MobileResidentCard
                    key={r.bookingId}
                    r={r}
                  />
                ))}
              </div>

              {/* ============================================================
                  LAPTOP + BIGGER SCREENS
                  TABULAR VIEW
                  >= lg

                  NO HORIZONTAL SCROLL
              ============================================================ */}

              <div
                className="
                  hidden
                  min-w-0
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  lg:block
                "
              >
                {/* TABLE HEADER */}

                <div
                  className={`
                    grid
                    ${DESKTOP_TABLE_GRID}
                    items-center
                    gap-1
                    border-b
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-3
                    xl:gap-2
                    xl:px-4
                  `}
                >
                  <TableHeader>
                    Resident
                  </TableHeader>

                  <TableHeader>
                    Room / Bed
                  </TableHeader>

                  <TableHeader>
                    Check-in
                  </TableHeader>

                  <TableHeader>
                    Check-out
                  </TableHeader>

                  <TableHeader center>
                    Rating
                  </TableHeader>

                  <TableHeader center>
                    Status
                  </TableHeader>

                  <TableHeader right>
                    Actions
                  </TableHeader>
                </div>

                {/* TABLE BODY */}

                <div className="min-w-0">
                  {filtered.map((r) => (
                    <DesktopResidentRow
                      key={r.bookingId}
                      r={r}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

/* ============================================================================
 * TABLE HEADER
 * ========================================================================== */

function TableHeader({
  children,
  center = false,
  right = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  right?: boolean;
}) {
  return (
    <div
      className={`
        min-w-0
        truncate
        text-[9px]
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
        lg:text-[10px]

        ${
          center
            ? "text-center"
            : right
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </div>
  );
}

/* ============================================================================
 * DESKTOP / LAPTOP RESIDENT ROW
 *
 * Desktop columns:
 *
 * Resident
 * Room / Bed
 * Check-in
 * Check-out
 * Rating
 * Status
 * Actions
 *
 * Contact is intentionally inside Resident.
 * ========================================================================== */

function DesktopResidentRow({
  r,
}: {
  r: ResidentRecord;
}) {
  const status =
    getPrimaryStatus(r);

  return (
    <div
      className={`
        grid
        ${DESKTOP_TABLE_GRID}
        items-center
        gap-1
        border-b
        border-slate-100
        px-3
        py-3
        transition
        last:border-b-0
        hover:bg-slate-50
        xl:gap-2
        xl:px-4
      `}
    >
      {/* ================================================================
          RESIDENT
          Name + phone together
      ================================================================ */}

      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
        {/* Avatar */}

        <div className="relative shrink-0">
          <div
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[9px]
              font-semibold
              xl:h-9
              xl:w-9
              xl:text-[10px]
              ${getAvatarColor(r.name)}
            `}
          >
            {getInitials(r.name)}
          </div>

          <span
            className={`
              absolute
              bottom-0
              right-0
              h-2
              w-2
              rounded-full
              border-2
              border-white
              xl:h-2.5
              xl:w-2.5
              ${getStatusDotColor(status)}
            `}
          />
        </div>

        {/* Name + Phone */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          {/* Name */}

          <div
            className="
              truncate
              text-[10px]
              font-semibold
              leading-4
              text-slate-900
              xl:text-[11px]
            "
          >
            {r.name}
          </div>

          {/* Phone */}

          <div
            className="
              mt-0.5
              flex
              min-w-0
              items-center
              gap-1
              text-[8px]
              leading-3
              text-blue-600
              xl:text-[9px]
            "
          >
            <Phone
              className="
                h-2.5
                w-2.5
                shrink-0
              "
            />

            <span className="truncate">
              {r.mobile || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================
          ROOM / BED
      ================================================================ */}

      <div className="min-w-0">
        <div
          className="
            truncate
            text-[9px]
            font-medium
            text-slate-700
            xl:text-[10px]
          "
        >
          {r.roomName
            ? `Room ${r.roomName}`
            : "Unassigned"}
        </div>

        <div
          className="
            truncate
            text-[8px]
            text-slate-400
            xl:text-[9px]
          "
        >
          {r.bedLabel ||
            "No bed"}
        </div>
      </div>

      {/* ================================================================
          CHECK-IN
      ================================================================ */}

      <div className="min-w-0">
        <div
          className="
            whitespace-nowrap
            text-[9px]
            font-medium
            text-slate-700
            xl:text-[10px]
          "
        >
          {formatDate(
            r.actualCheckIn
          )}
        </div>
      </div>

      {/* ================================================================
          CHECK-OUT
      ================================================================ */}

      <div className="min-w-0">
        <div
          className={`
            whitespace-nowrap
            text-[9px]
            font-medium
            xl:text-[10px]
            ${
              r.isOnNotice
                ? "text-orange-600"
                : "text-slate-700"
            }
          `}
        >
          {formatDate(
            r.actualCheckOut ||
              r.expectedCheckout
          )}
        </div>
      </div>

      {/* ================================================================
          RATING
      ================================================================ */}

      <div
        className="
          flex
          min-w-0
          justify-center
        "
      >
        {typeof r.rating ===
        "number" ? (
          <span
            className="
              whitespace-nowrap
              text-[9px]
              font-semibold
              text-green-600
              xl:text-[10px]
            "
          >
            ☺ {r.rating.toFixed(1)}
          </span>
        ) : (
          <span
            className="
              whitespace-nowrap
              text-[8px]
              text-slate-400
              xl:text-[9px]
            "
          >
            —
          </span>
        )}
      </div>

      {/* ================================================================
          STATUS
      ================================================================ */}

      <div
        className="
          flex
          min-w-0
          justify-center
        "
      >
        <StatusBadge
          status={status}
        />
      </div>

      {/* ================================================================
          ACTIONS
      ================================================================ */}

      <div
        className="
          flex
          min-w-0
          items-center
          justify-end
          gap-1
          xl:gap-1.5
        "
      >
        {/* View Profile */}

        <button
          type="button"
          className="
            shrink-0
            whitespace-nowrap
            rounded-md
            border
            border-slate-200
            bg-white
            px-1.5
            py-1.5
            text-[8px]
            font-medium
            text-blue-600
            transition
            hover:bg-blue-50
            xl:px-2
            xl:text-[9px]
          "
        >
          View Profile
        </button>

        {/* Message */}

        <button
          type="button"
          className="
            flex
            shrink-0
            items-center
            justify-center
            gap-0.5
            whitespace-nowrap
            rounded-md
            bg-blue-600
            px-1.5
            py-1.5
            text-[8px]
            font-medium
            text-white
            transition
            hover:bg-blue-700
            xl:gap-1
            xl:px-2
            xl:text-[9px]
          "
        >
          <MessageCircle
            className="
              h-2.5
              w-2.5
              shrink-0
              xl:h-3
              xl:w-3
            "
          />

          Message
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * MOBILE RESIDENT CARD
 *
 * IMPORTANT:
 * This intentionally keeps the older mobile/tablet sizing/design.
 * ========================================================================== */

function MobileResidentCard({
  r,
}: {
  r: ResidentRecord;
}) {
  const status =
    getPrimaryStatus(r);

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        px-2
        py-2
        shadow-sm
        sm:px-2.5
        sm:py-2.5
      "
    >
      <div
        className="
          grid
          min-w-0
          grid-cols-[minmax(0,1.35fr)_minmax(65px,0.72fr)_minmax(100px,0.93fr)]
          items-center
          gap-1.5
          sm:grid-cols-[minmax(0,1.35fr)_minmax(110px,0.8fr)_minmax(145px,1fr)]
          sm:gap-2
        "
      >
        {/* ================================================================
            IDENTITY
        ================================================================ */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
            sm:gap-2
          "
        >
          {/* Avatar */}

          <div className="relative shrink-0">
            <div
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-[10px]
                font-semibold
                sm:h-11
                sm:w-11
                sm:text-[11px]
                ${getAvatarColor(r.name)}
              `}
            >
              {getInitials(r.name)}
            </div>

            <span
              className={`
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-white
                sm:h-3
                sm:w-3
                ${getStatusDotColor(status)}
              `}
            />
          </div>

          {/* Resident information */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            {/* Name */}

            <div
              className="
                truncate
                text-[9px]
                font-semibold
                leading-[15px]
                text-slate-900
                sm:text-[13px]
                sm:leading-4
              "
            >
              {r.name}
            </div>

            {/* Room + Bed */}

            <div
              className="
                mt-0.5
                truncate
                text-[7px]
                leading-3
                text-slate-500
                sm:text-[10px]
                sm:leading-3.5
              "
            >
              {r.roomName
                ? `Room ${r.roomName}`
                : "Unassigned"}

              {r.bedLabel
                ? ` · ${r.bedLabel}`
                : ""}
            </div>

            {/* Phone */}

            <div
              className="
                mt-0.5
                flex
                min-w-0
                items-center
                gap-1
                text-[7px]
                leading-3
                text-blue-600
                sm:text-[10px]
              "
            >
              <Phone
                className="
                  h-2
                  w-2
                  shrink-0
                  sm:h-3
                  sm:w-3
                "
              />

              <span className="truncate">
                {r.mobile}
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================
            DATES
        ================================================================ */}

        <div
          className="
            flex
            min-w-0
            flex-col
            justify-center
            gap-1.5
            sm:gap-2.5
          "
        >
          {/* Joined */}

          <div className="min-w-0">
            <div
              className="
                truncate
                text-[7px]
                leading-3
                text-slate-400
                sm:text-[9px]
              "
            >
              Checkin Date
            </div>

            <div
              className="
                mt-0.5
                whitespace-nowrap
                text-[7px]
                font-medium
                leading-3
                text-slate-700
                sm:text-[10px]
              "
            >
              {formatDate(
                r.actualCheckIn ||
                  r.joinedOn
              )}
            </div>
          </div>

          {/* Checkout / Notice */}

          <div className="min-w-0">
            <div
              className="
                truncate
                text-[7px]
                leading-3
                text-slate-400
                sm:text-[9px]
              "
            >
              {r.isOnNotice
                ? "Notice Date"
                : "Checkout Date"}
            </div>

            <div
              className={`
                mt-0.5
                whitespace-nowrap
                text-[7px]
                font-medium
                leading-3
                sm:text-[10px]
                ${
                  r.isOnNotice
                    ? "text-orange-600"
                    : "text-slate-700"
                }
              `}
            >
              {formatDate(
                r.expectedCheckout
              )}
            </div>
          </div>
        </div>

        {/* ================================================================
            RIGHT SIDE
        ================================================================ */}

        <div
          className="
            flex
            min-w-0
            flex-col
            items-end
            justify-center
            gap-1
            sm:gap-1.5
          "
        >
          {/* Rating + Status */}

          <div
            className="
              flex
              min-w-0
              items-center
              justify-end
              gap-1
            "
          >
            {/* Rating */}

            {typeof r.rating ===
            "number" ? (
              <div
                className="
                  flex
                  items-center
                  whitespace-nowrap
                  text-[7px]
                  font-semibold
                  text-green-600
                  sm:text-[10px]
                "
              >
                <span className="mr-0.5">
                  ☺
                </span>

                {r.rating.toFixed(1)}

                <span className="font-normal text-slate-400">
                  /5
                </span>
              </div>
            ) : (
              <div
                className="
                  whitespace-nowrap
                  text-[7px]
                  text-slate-400
                  sm:text-[9px]
                "
              >
                No rating
              </div>
            )}

            {/* Status */}

            <StatusBadge
              status={status}
              mobile
            />
          </div>

          {/* ACTION BUTTONS */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-1
              sm:gap-1.5
            "
          >
            {/* View Profile */}

            <button
              type="button"
              className="
                whitespace-nowrap
                rounded-md
                border
                border-slate-200
                bg-white
                px-1.5
                py-1
                text-[6px]
                font-medium
                text-blue-600
                transition
                hover:bg-blue-50
                sm:px-2
                sm:py-1.5
                sm:text-[8px]
              "
            >
              View Profile
            </button>

            {/* Message */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                gap-0.5
                whitespace-nowrap
                rounded-md
                bg-blue-600
                px-1.5
                py-1
                text-[7px]
                font-medium
                text-white
                transition
                hover:bg-blue-700
                sm:px-2
                sm:py-1.5
                sm:text-[8px]
              "
            >
              <MessageCircle
                className="
                  h-2
                  w-2
                  shrink-0
                  sm:h-2.5
                  sm:w-2.5
                "
              />

              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * PRIMARY STATUS
 *
 * Priority:
 * Notice > New > Active > Upcoming
 * ========================================================================== */

function getPrimaryStatus(
  r: ResidentRecord
): keyof typeof RESIDENT_BADGE_STYLES {
  if (r.isOnNotice) {
    return "notice";
  }

  if (r.isNewOnboarding) {
    return "new";
  }

  if (r.isResidingNow) {
    return "active";
  }

  return "upcoming";
}

/* ============================================================================
 * STATUS BADGE
 * ========================================================================== */

function StatusBadge({
  status,
  mobile = false,
}: {
  status:
    keyof typeof RESIDENT_BADGE_STYLES;
  mobile?: boolean;
}) {
  const config =
    RESIDENT_BADGE_STYLES[
      status
    ];

  return (
    <span
      className={`
        inline-flex
        max-w-full
        items-center
        justify-center
        whitespace-nowrap
        rounded-full
        font-medium

        ${
          mobile
            ? "px-1.5 py-0.5 text-[6px] sm:px-2 sm:text-[8px]"
            : "px-1.5 py-0.5 text-[8px] lg:px-2 lg:text-[9px]"
        }

        ${config.badge}
      `}
    >
      {config.label}
    </span>
  );
}

/* ============================================================================
 * STATUS DOT
 * ========================================================================== */

function getStatusDotColor(
  status:
    keyof typeof RESIDENT_BADGE_STYLES
) {
  return RESIDENT_BADGE_STYLES[
    status
  ].dot;
}

/* ============================================================================
 * STAT CARD
 * ========================================================================== */

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
        justify-center
        rounded-md
        border
        border-slate-200
        bg-white
        p-2
        text-center
        shadow-sm
      "
    >
      <div
        className={`
          mx-auto
          mb-1
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-md
          ${iconBg}
        `}
      >
        <Icon
          className={`
            h-3.5
            w-3.5
            ${iconColor}
          `}
        />
      </div>

      <div
        className="
          min-w-0
          max-w-full
          truncate
          text-lg
          font-bold
          leading-none
          text-slate-900
        "
      >
        {value}
      </div>

      <div
        className="
          mt-1
          max-w-full
          truncate
          text-[7px]
          font-medium
          leading-3
          text-slate-500
        "
      >
        {label}
      </div>
    </div>
  );
}

/* ============================================================================
 * MOBILE SKELETON
 * ========================================================================== */

function SkeletonCard() {
  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        animate-pulse
        rounded-lg
        border
        border-slate-200
        bg-white
        px-2
        py-2
        shadow-sm
        sm:px-2.5
        sm:py-2.5
      "
    >
      <div
        className="
          grid
          min-w-0
          grid-cols-[minmax(0,1.35fr)_minmax(65px,0.72fr)_minmax(100px,0.93fr)]
          items-center
          gap-1.5
          sm:grid-cols-[minmax(0,1.35fr)_minmax(110px,0.8fr)_minmax(145px,1fr)]
          sm:gap-2
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
            sm:gap-2
          "
        >
          <div
            className="
              h-10
              w-10
              shrink-0
              rounded-full
              bg-slate-200
              sm:h-11
              sm:w-11
            "
          />

          <div
            className="
              min-w-0
              flex-1
              space-y-1.5
            "
          >
            <div
              className="
                h-2.5
                w-20
                rounded
                bg-slate-200
              "
            />

            <div
              className="
                h-2
                w-16
                rounded
                bg-slate-100
              "
            />

            <div
              className="
                h-2
                w-20
                rounded
                bg-slate-100
              "
            />
          </div>
        </div>

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-2
          "
        >
          <div className="space-y-1">
            <div className="h-2 w-12 rounded bg-slate-100" />
            <div className="h-2.5 w-16 rounded bg-slate-200" />
          </div>

          <div className="space-y-1">
            <div className="h-2 w-16 rounded bg-slate-100" />
            <div className="h-2.5 w-16 rounded bg-slate-200" />
          </div>
        </div>

        <div
          className="
            flex
            min-w-0
            flex-col
            items-end
            gap-1.5
          "
        >
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-8 rounded bg-slate-200" />
            <div className="h-4 w-12 rounded-full bg-slate-100" />
          </div>

          <div className="flex gap-1">
            <div className="h-6 w-16 rounded-lg bg-slate-100" />
            <div className="h-6 w-14 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * TABLE SKELETON
 *
 * Same exact 7-column grid as the actual desktop table.
 * No horizontal scrolling.
 * ========================================================================== */

function TableSkeleton() {
  return (
    <div
      className="
        hidden
        min-w-0
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        shadow-sm
        lg:block
      "
    >
      {/* HEADER */}

      <div
        className={`
          grid
          ${DESKTOP_TABLE_GRID}
          items-center
          gap-1
          border-b
          border-slate-200
          bg-slate-50
          px-3
          py-3
          xl:gap-2
          xl:px-4
        `}
      >
        {[
          "Resident",
          "Room / Bed",
          "Check-in",
          "Check-out",
          "Rating",
          "Status",
          "Actions",
        ].map((item) => (
          <div
            key={item}
            className="
              h-2.5
              max-w-full
              rounded
              bg-slate-200
            "
          />
        ))}
      </div>

      {/* ROWS */}

      {[1, 2, 3].map((row) => (
        <div
          key={row}
          className={`
            grid
            ${DESKTOP_TABLE_GRID}
            items-center
            gap-1
            border-b
            border-slate-100
            px-3
            py-3
            last:border-b-0
            xl:gap-2
            xl:px-4
          `}
        >
          {/* Resident */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <div
              className="
                h-8
                w-8
                shrink-0
                rounded-full
                bg-slate-200
                xl:h-9
                xl:w-9
              "
            />

            <div
              className="
                min-w-0
                flex-1
                space-y-1
              "
            >
              <div
                className="
                  h-2.5
                  w-20
                  max-w-full
                  rounded
                  bg-slate-100
                "
              />

              <div
                className="
                  h-2
                  w-14
                  max-w-full
                  rounded
                  bg-slate-100
                "
              />
            </div>
          </div>

          {/* Room */}

          <div
            className="
              h-2.5
              w-16
              max-w-full
              rounded
              bg-slate-100
            "
          />

          {/* Check-in */}

          <div
            className="
              h-2.5
              w-14
              max-w-full
              rounded
              bg-slate-100
            "
          />

          {/* Check-out */}

          <div
            className="
              h-2.5
              w-14
              max-w-full
              rounded
              bg-slate-100
            "
          />

          {/* Rating */}

          <div
            className="
              mx-auto
              h-2.5
              w-7
              rounded
              bg-slate-100
            "
          />

          {/* Status */}

          <div
            className="
              mx-auto
              h-4
              w-12
              rounded-full
              bg-slate-100
            "
          />

          {/* Actions */}

          <div
            className="
              flex
              min-w-0
              justify-end
              gap-1
              xl:gap-1.5
            "
          >
            <div
              className="
                h-7
                w-16
                rounded-md
                bg-slate-100
                xl:w-20
              "
            />

            <div
              className="
                h-7
                w-14
                rounded-md
                bg-slate-200
                xl:w-16
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
 * EMPTY STATE
 * ========================================================================== */

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="
        rounded-md
        border
        border-dashed
        border-slate-300
        bg-white
        p-6
        text-center
        text-[10px]
        text-slate-500
        sm:p-8
        sm:text-xs
      "
    >
      {message}
    </div>
  );
}