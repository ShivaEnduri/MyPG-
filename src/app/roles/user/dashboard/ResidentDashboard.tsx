import {
  FC,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  ChevronRight,
  Wallet,
  Wrench,
  Megaphone,
  Home as HomeIcon,
  DoorOpen,
  BedDouble,
  CalendarCheck2,
  CalendarClock,
  Droplet,
  PartyPopper,
  Sparkles,
  MessageSquare,
  ArrowRightCircle,
  HelpCircle,
  Plus,
  Loader2,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import { useAuth } from "../../../../hooks/context/AuthContext";

import { useResidentDashboardStore } from "@/app/shared/store/residentDashboardStore";

import { useNavigate } from "react-router-dom";

/* ----------------------------------------------------------------------- */
/* Types                                                                   */
/* ----------------------------------------------------------------------- */

type Tone =
  | "blue"
  | "purple"
  | "orange"
  | "green"
  | "red";

interface AnnouncementItem {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  tone: Tone;
}

type SectionKey =
  | "requests"
  | "announcements";

/* ----------------------------------------------------------------------- */
/* Responsive visible counts                                               */
/* ----------------------------------------------------------------------- */

const BREAKPOINT_VISIBLE_COUNTS: [
  number,
  number
][] = [
  [1280, 8],
  [1024, 7],
  [640, 5],
  [0, 3],
];

function useResponsiveVisibleCount(): number {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const computeCount = () => {
      const width = window.innerWidth;

      const match =
        BREAKPOINT_VISIBLE_COUNTS.find(
          ([minWidth]) =>
            width >= minWidth
        );

      setCount(
        match
          ? match[1]
          : 3
      );
    };

    computeCount();

    window.addEventListener(
      "resize",
      computeCount
    );

    return () =>
      window.removeEventListener(
        "resize",
        computeCount
      );
  }, []);

  return count;
}

/* ----------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ----------------------------------------------------------------------- */

const toneIconBg: Record<
  Tone,
  string
> = {
  blue:
    "bg-blue-50 text-blue-600",
  purple:
    "bg-purple-50 text-purple-600",
  orange:
    "bg-orange-50 text-orange-600",
  green:
    "bg-green-50 text-green-600",
  red:
    "bg-red-50 text-red-600",
};

const formatDate = (
  dateString?: string | null
): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(
    dateString
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatMonthYear = (
  date = new Date()
): string =>
  date.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );

const getGreeting = (): string => {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  if (hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
};

/* ----------------------------------------------------------------------- */
/* Icon Box                                                                */
/* ----------------------------------------------------------------------- */

const IconBox: FC<{
  icon: React.ElementType;
  tone: Tone;
  size?: "sm" | "md";
}> = ({
  icon: Icon,
  tone,
  size = "sm",
}) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full ${
      toneIconBg[tone]
    } ${
      size === "md"
        ? "h-5 w-5"
        : "h-3.5 w-3.5"
    }`}
  >
    <Icon
      className={
        size === "md"
          ? "h-2.5 w-2.5"
          : "h-2 w-2"
      }
    />
  </div>
);

/* ----------------------------------------------------------------------- */
/* Stat Card                                                               */
/* ----------------------------------------------------------------------- */

const StatCard: FC<{
  icon: React.ElementType;
  tone: Tone;
  label: string;
  children: React.ReactNode;
}> = ({
  icon: Icon,
  tone,
  label,
  children,
}) => (
  <div className="flex flex-col items-center rounded border border-gray-100 bg-white px-0.5 py-0.5 text-center shadow-sm">
    <div
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${toneIconBg[tone]}`}
    >
      <Icon className="h-2 w-2" />
    </div>

    <p className="mt-0.5 text-[5px] font-medium leading-none text-gray-700 sm:text-[6px]">
      {label}
    </p>

    <div className="mt-0.5 leading-none">
      {children}
    </div>
  </div>
);

/* ----------------------------------------------------------------------- */
/* Section Header                                                          */
/* ----------------------------------------------------------------------- */

const SectionHeader: FC<{
  title: string;
  isExpanded: boolean;
  hasMore: boolean;
  onToggle: () => void;
}> = ({
  title,
  isExpanded,
  hasMore,
  onToggle,
}) => (
  <div className="flex shrink-0 items-center justify-between px-1 pb-0.5 pt-0.5">
    <h2 className="text-[8px] font-bold text-gray-900 sm:text-[9px]">
      {title}
    </h2>

    {hasMore && (
      <button
        type="button"
        onClick={onToggle}
        className="text-[6px] font-semibold text-blue-600 hover:text-blue-700 sm:text-[7px]"
      >
        {isExpanded
          ? "Show Less"
          : "View All"}
      </button>
    )}
  </div>
);

/* ----------------------------------------------------------------------- */
/* Request Row                                                             */
/* ----------------------------------------------------------------------- */

const RequestRow: FC<{
  request: {
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
  };
}> = ({ request }) => {
  return (
    <div className="flex items-center gap-1 border-t border-gray-100 px-1 py-0.5 first:border-t-0">
      <IconBox
        icon={Wrench}
        tone="orange"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[7px] font-bold text-gray-900 sm:text-[8px]">
          {request.title}
        </p>

        <p className="truncate text-[6px] text-gray-500 sm:text-[6.5px]">
          {request.description}
        </p>

        <p className="truncate text-[5px] text-gray-400 sm:text-[5.5px]">
          Created:{" "}
          {formatDate(
            request.createdAt
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="rounded-full bg-orange-50 px-1 py-0.5 text-[5px] font-semibold text-orange-700 sm:text-[5.5px]">
          Open
        </span>

        <span className="text-[5px] text-gray-400 sm:text-[5.5px]">
          SLA: {request.SLA}h
        </span>
      </div>

      <ChevronRight className="h-2 w-2 shrink-0 text-gray-400" />
    </div>
  );
};

/* ----------------------------------------------------------------------- */
/* Announcement Row                                                        */
/* ----------------------------------------------------------------------- */

const AnnouncementRow: FC<{
  item: AnnouncementItem;
}> = ({
  item,
}) => (
  <div className="flex items-center gap-1 border-t border-gray-100 px-1 py-0.5 first:border-t-0">
    <IconBox
      icon={item.icon}
      tone={item.tone}
    />

    <div className="min-w-0 flex-1">
      <p className="truncate text-[7px] font-bold text-gray-900 sm:text-[8px]">
        {item.title}
      </p>

      <p className="truncate text-[6px] text-gray-500 sm:text-[6.5px]">
        {formatDate(
          item.date
        )}
      </p>
    </div>

    <ChevronRight className="h-2 w-2 shrink-0 text-gray-400" />
  </div>
);

/* ----------------------------------------------------------------------- */
/* Empty State                                                             */
/* ----------------------------------------------------------------------- */

const EmptyState: FC<{
  message: string;
}> = ({
  message,
}) => (
  <div className="flex flex-1 items-center justify-center px-2 py-3 text-center">
    <p className="text-[6px] text-gray-400 sm:text-[6.5px]">
      {message}
    </p>
  </div>
);

/* ----------------------------------------------------------------------- */
/* Main Component                                                          */
/* ----------------------------------------------------------------------- */

interface ResidentDashboardProps {
  bottomNavHeight?: number;
}

export const ResidentDashboard: FC<
  ResidentDashboardProps
> = ({
  bottomNavHeight = 56,
}) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] =
    useState<SectionKey | null>(
      null
    );

  const defaultVisibleCount =
    useResponsiveVisibleCount();

  /* --------------------------------------------------------------------- */
  /* AUTH                                                                  */
  /* --------------------------------------------------------------------- */

  const { dbUser } =
    useAuth();

  /*
   * AuthContext DB user:
   *
   * {
   *   id: 779,
   *   first_name: "...",
   *   last_name: "..."
   * }
   *
   * Therefore use dbUser.id.
   */

  const userId =
    dbUser?.id;

  /* --------------------------------------------------------------------- */
  /* DASHBOARD STORE                                                       */
  /* --------------------------------------------------------------------- */

  const {
    dashboard,
    loading,
    error,
    fetchDashboard,
  } =
    useResidentDashboardStore();

  /* --------------------------------------------------------------------- */
  /* FETCH DASHBOARD                                                       */
  /* --------------------------------------------------------------------- */

  useEffect(() => {
    if (!userId) {
      console.log(
        "Resident dashboard: user id not available yet"
      );

      return;
    }

    console.log(
      "Fetching resident dashboard for userId:",
      userId
    );

    fetchDashboard(
      Number(userId)
    );
  }, [
    userId,
    fetchDashboard,
  ]);

  /* --------------------------------------------------------------------- */
  /* DASHBOARD DATA                                                        */
  /* --------------------------------------------------------------------- */

  const pg =
    dashboard?.pg;

  const summary =
    dashboard?.summary;

  const resident =
    dashboard?.resident;

  const stay =
    resident?.stay;

  const rentStatus =
    resident?.rentStatus;

  /* --------------------------------------------------------------------- */
  /* Announcements                                                         */
  /* --------------------------------------------------------------------- */

  const announcements: AnnouncementItem[] =
    useMemo(() => {
      if (
        !dashboard?.latestAnnouncements
      ) {
        return [];
      }

      return dashboard.latestAnnouncements.map(
        (
          item,
          index
        ) => ({
          id: item.id,
          title: item.title,
          description:
            item.description,
          date: item.date,

          icon:
            index % 3 === 0
              ? Droplet
              : index % 3 === 1
              ? PartyPopper
              : Sparkles,

          tone:
            index % 3 === 0
              ? "blue"
              : index % 3 === 1
              ? "orange"
              : "green",
        })
      );
    }, [
      dashboard?.latestAnnouncements,
    ]);

  /* --------------------------------------------------------------------- */
  /* Requests                                                              */
  /* --------------------------------------------------------------------- */

  const requests = useMemo(() => {
    if (!dashboard?.recentRequests) {
      return [];
    }

    return dashboard.recentRequests;
  }, [
    dashboard?.recentRequests,
  ]);

  /* --------------------------------------------------------------------- */
  /* Section logic                                                         */
  /* --------------------------------------------------------------------- */

  const requestsExpanded =
    expanded ===
    "requests";

  const announcementsExpanded =
    expanded ===
    "announcements";

  const visibleRequests =
    requestsExpanded
      ? requests
      : requests.slice(
          0,
          defaultVisibleCount
        );

  const visibleAnnouncements =
    announcementsExpanded
      ? announcements
      : announcements.slice(
          0,
          defaultVisibleCount
        );

  const toggleSection = (
    key: SectionKey
  ) => {
    setExpanded(
      (current) =>
        current === key
          ? null
          : key
    );
  };

  const requestsHasMore =
    requests.length >
    defaultVisibleCount;

  const announcementsHasMore =
    announcements.length >
    defaultVisibleCount;

  /* --------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* --------------------------------------------------------------------- */

  const goToMyStay = () => {
    navigate(
      "/resident/mystay"
    );
  };

  const goToRequests = () => {
    navigate(
      "/resident/requests"
    );
  };

  const goToAnnouncements = () => {
    navigate(
      "/resident/announcements"
    );
  };

  /* --------------------------------------------------------------------- */
  /* Quick Actions                                                         */
  /* --------------------------------------------------------------------- */

  const quickActions = [
    {
      label: "Raise Issue",
      icon: Wrench,
      tone: "blue" as Tone,
      onClick: goToRequests,
    },
    {
      label: "My Room",
      icon: BedDouble,
      tone: "purple" as Tone,
      onClick: goToMyStay,
    },
    {
      label: "Rent Status",
      icon: Wallet,
      tone: "green" as Tone,
      // No route requested for Rent Status
      onClick: () => {},
    },
    {
      label: "Announcements",
      icon: Megaphone,
      tone: "blue" as Tone,
      onClick: goToAnnouncements,
    },
    {
      label: "Request Checkout",
      icon: ArrowRightCircle,
      tone: "orange" as Tone,
      onClick: goToRequests,
    },
    {
      label: "Help",
      icon: HelpCircle,
      tone: "red" as Tone,
      // No route requested for Help
      onClick: () => {},
    },
  ];

  /* --------------------------------------------------------------------- */
  /* Loading                                                               */
  /* --------------------------------------------------------------------- */

  if (loading) {
    return (
      <PageShell
        noScroll
        bottomPad={
          bottomNavHeight
        }
      >
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" />

            <span className="text-[8px]">
              Loading dashboard...
            </span>
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Error                                                                 */
  /* --------------------------------------------------------------------- */

  if (error) {
    return (
      <PageShell
        noScroll
        bottomPad={
          bottomNavHeight
        }
      >
        <div className="flex h-full items-center justify-center">
          <div className="rounded border border-red-100 bg-red-50 px-3 py-2 text-center">
            <p className="text-[8px] font-semibold text-red-600">
              Failed to load dashboard
            </p>

            <p className="mt-0.5 text-[6px] text-red-500">
              {error}
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* UI                                                                    */
  /* --------------------------------------------------------------------- */

  return (
    <PageShell
      noScroll
      bottomPad={
        bottomNavHeight
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-1">

        {/* --------------------------------------------------------------- */}
        {/* Header                                                          */}
        {/* --------------------------------------------------------------- */}

        <header className="flex shrink-0 items-center justify-between pt-0.5">
          <span className="text-[9px] font-extrabold text-blue-600">
            MyPG
          </span>

          <button
            type="button"
            className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100"
          >
            <Bell className="h-2.5 w-2.5" />

            <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500 text-[4px] font-bold text-white">
              {summary?.announcements ??
                0}
            </span>
          </button>
        </header>

        {/* --------------------------------------------------------------- */}
        {/* Greeting                                                        */}
        {/* --------------------------------------------------------------- */}

        <div className="flex shrink-0 items-start justify-between">
          <div className="min-w-0">
            <p className="truncate text-[8px] text-gray-600 sm:text-[9px]">
              {getGreeting()},{" "}
              <span className="font-bold text-gray-900">
                {resident?.name ||
                  `${dbUser?.first_name || ""} ${
                    dbUser?.last_name ||
                    ""
                  }`.trim() ||
                  "Resident"}
              </span>
            </p>

            <p className="truncate text-[6px] text-gray-500 sm:text-[6.5px]">
              {stay?.room?.name ||
                "-"}

              <span className="mx-0.5">
                •
              </span>

              Bed{" "}
              {stay?.bed?.number ??
                "-"}
            </p>
          </div>

          {/* PG NAME FROM DASHBOARD STORE */}
          <div className="flex max-w-[45%] shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-gray-800 sm:text-[6.5px]">
            <span className="truncate">
              {pg?.name ||
                "My PG"}
            </span>

            <ChevronRight className="h-1.5 w-1.5 shrink-0 rotate-90 text-gray-500" />
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Stats                                                           */}
        {/* --------------------------------------------------------------- */}

        <div className="grid shrink-0 grid-cols-4 gap-0.5">

          {/* Rent */}
          <StatCard
            icon={Wallet}
            tone="green"
            label="Rent Status"
          >
            <p
              className={`text-[6px] font-bold leading-none sm:text-[6.5px] ${
                rentStatus?.status?.toLowerCase() ===
                "paid"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {rentStatus?.status ||
                "-"}
            </p>

            <p className="text-[8px] font-bold leading-none text-gray-900 sm:text-[9px]">
              ₹
              {Number(
                rentStatus?.monthlyRent ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="text-[5px] leading-none text-gray-500 sm:text-[5.5px]">
              {formatMonthYear()}
            </p>
          </StatCard>

          {/* Open Requests */}
          <StatCard
            icon={Wrench}
            tone="orange"
            label="Open Requests"
          >
            <p className="text-[9px] font-bold text-orange-600 sm:text-[10px]">
              {summary?.openRequests ??
                0}
            </p>
          </StatCard>

          {/* Announcements */}
          <StatCard
            icon={Megaphone}
            tone="blue"
            label="Announcements"
          >
            <p className="text-[9px] font-bold text-blue-600 sm:text-[10px]">
              {summary?.announcements ??
                0}
            </p>
          </StatCard>

          {/* Stay */}
          <StatCard
            icon={HomeIcon}
            tone="green"
            label="Stay Status"
          >
            <p className="text-[7px] font-bold text-green-600 sm:text-[8px]">
              {stay?.status ||
                "-"}
            </p>
          </StatCard>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* My Stay + Rent                                                  */}
        {/* --------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-col gap-1 lg:grid lg:grid-cols-2 lg:items-stretch">

          {/* My Stay */}
          <div className="flex flex-col rounded border border-gray-100 bg-white shadow-sm lg:h-full">

            {/* My Stay Header / Chevron */}
            <button
              type="button"
              onClick={goToMyStay}
              className="flex items-center justify-between px-1 pb-0.5 pt-1"
            >
              <h2 className="text-[8px] font-bold text-gray-900 sm:text-[9px]">
                My Stay
              </h2>

              <ChevronRight className="h-2 w-2 text-gray-400" />
            </button>

            <div className="grid grid-cols-4 gap-0.5 px-1 pb-1">

              {/* Room */}
              <div className="flex items-center gap-0.5">
                <IconBox
                  icon={DoorOpen}
                  tone="blue"
                />

                <div className="min-w-0">
                  <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                    Room
                  </p>

                  <p className="truncate text-[6px] font-semibold text-gray-900 sm:text-[6.5px]">
                    {stay?.room
                      ?.name ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* Bed */}
              <div className="flex items-center gap-0.5">
                <IconBox
                  icon={BedDouble}
                  tone="purple"
                />

                <div className="min-w-0">
                  <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                    Bed
                  </p>

                  <p className="truncate text-[6px] font-semibold text-gray-900 sm:text-[6.5px]">
                    {stay?.bed
                      ?.number ??
                      "-"}
                  </p>
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-center gap-0.5">
                <IconBox
                  icon={CalendarCheck2}
                  tone="green"
                />

                <div className="min-w-0">
                  <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                    Checkin Date
                  </p>

                  <p className="truncate text-[6px] font-semibold text-gray-900 sm:text-[6.5px]">
                    {formatDate(
                      stay?.joinedOn
                    )}
                  </p>
                </div>
              </div>

              {/* Checkout */}
              <div className="flex items-center gap-0.5">
                <IconBox
                  icon={CalendarClock}
                  tone="orange"
                />

                <div className="min-w-0">
                  <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                    Checkout Date
                  </p>

                  <p className="truncate text-[6px] font-semibold text-gray-900 sm:text-[6.5px]">
                    {formatDate(
                      stay?.expectedCheckout
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Reminder */}
          <div className="flex flex-wrap items-center justify-between gap-1 rounded border border-gray-100 bg-white px-1 py-1 shadow-sm lg:h-full">

            <div className="flex min-w-0 items-center gap-1">
              <IconBox
                icon={Wallet}
                tone="green"
                size="md"
              />

              <div className="min-w-0">

                <div className="flex items-center gap-0.5">
                  <p className="truncate text-[7px] font-bold text-gray-900 sm:text-[8px]">
                    Rent Reminder
                  </p>

                  <ChevronRight className="h-1.5 w-1.5 shrink-0 text-gray-400" />
                </div>

                <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                  Current Month (
                  {formatMonthYear()}
                  )
                </p>

                <p className="truncate text-[8px] font-bold text-green-600 sm:text-[9px]">
                  ₹
                  {Number(
                    rentStatus?.monthlyRent ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                  Status:{" "}
                  {rentStatus?.status ||
                    "-"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">

              <span
                className={`rounded-full px-1 py-0.5 text-[5px] font-semibold sm:text-[5.5px] ${
                  rentStatus?.status?.toLowerCase() ===
                  "paid"
                    ? "bg-green-50 text-green-700"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                {rentStatus?.status ||
                  "-"}
              </span>

              <button
                type="button"
                className="flex items-center gap-0.5 rounded border border-blue-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
              >
                <MessageSquare className="h-1.5 w-1.5" />
                Contact Manager
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Requests + Announcements                                        */}
        {/* --------------------------------------------------------------- */}

        <div className="flex min-h-0 flex-1 flex-col gap-1 lg:grid lg:grid-cols-2 lg:items-stretch">

          {/* Requests */}
          <div className="flex min-h-0 flex-col rounded border border-gray-100 bg-white shadow-sm lg:h-full">

            <SectionHeader
              title="Recent Requests"
              isExpanded={
                requestsExpanded
              }
              hasMore={
                requestsHasMore
              }
              onToggle={() =>
                toggleSection(
                  "requests"
                )
              }
            />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {visibleRequests.length > 0 ? (
                visibleRequests.map(
                  (request) => (
                    <RequestRow
                      key={
                        request.id
                      }
                      request={
                        request
                      }
                    />
                  )
                )
              ) : (
                <EmptyState
                  message="No recent requests"
                />
              )}
            </div>

            <div className="shrink-0 p-1 pt-0.5">
              <button
                type="button"
                onClick={goToRequests}
                className="flex w-full items-center justify-center gap-0.5 rounded border border-gray-200 bg-white py-0.5 text-[6px] font-bold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
              >
                <Plus className="h-2 w-2" />
                Raise New Request
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="flex min-h-0 flex-col rounded border border-gray-100 bg-white shadow-sm lg:h-full">

            <SectionHeader
              title="Latest Announcements"
              isExpanded={
                announcementsExpanded
              }
              hasMore={
                announcementsHasMore
              }
              onToggle={() =>
                toggleSection(
                  "announcements"
                )
              }
            />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

              {visibleAnnouncements.length >
              0 ? (
                visibleAnnouncements.map(
                  (
                    item
                  ) => (
                    <AnnouncementRow
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                    />
                  )
                )
              ) : (
                <EmptyState message="No announcements available" />
              )}
            </div>

            <div className="shrink-0 p-1 pt-0.5">
              <button
                type="button"
                onClick={
                  goToAnnouncements
                }
                className="flex w-full items-center justify-center gap-0.5 rounded border border-gray-200 bg-white py-0.5 text-[6px] font-bold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
              >
                <Megaphone className="h-2 w-2" />
                View All Announcements
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Quick Actions                                                    */}
        {/* --------------------------------------------------------------- */}

        <div className="shrink-0">

          <h2 className="mb-0.5 text-[8px] font-bold text-gray-900 sm:text-[9px]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-3 gap-0.5">

            {quickActions.map(
              ({
                label,
                icon: Icon,
                tone,
                onClick,
              }) => (
                <button
                  key={label}
                  type="button"
                  onClick={
                    onClick
                  }
                  className={`flex items-center justify-center gap-0.5 rounded border border-gray-100 px-1 py-1 text-center text-[6px] font-semibold text-gray-800 shadow-sm transition-colors hover:brightness-95 sm:text-[6.5px] ${toneIconBg[tone]}`}
                >
                  <Icon className="h-2 w-2 shrink-0" />

                  <span className="truncate">
                    {label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ResidentDashboard;