
import {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  CalendarCheck,
  CalendarDays,
  Armchair,
  TriangleAlert,
  LogIn,
  LogOut,
  IndianRupee,
  Wrench,
  Wifi,
  Sparkles,
  Send,
  UserPlus,
  BedDouble,
  Ticket,
  Megaphone,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageShell } from "@/app/shared/components/PageShell";

import { useAuth } from "../../../../hooks/context/AuthContext";

import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { useManagerDashboardStore } from "@/app/shared/store/managerDashboardStore";
import { usePgAggregationsStore } from "@/app/shared/store/aggregationsStore";
import { useServiceRequestsStore } from "@/app/shared/store/useServiceRequestsStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  id: string;
  label: string;
  value: number;
  subtext?: string;
  subtextColor?: string;
  icon: ReactNode;
  iconBg: string;
  valueColor: string;
}

interface TaskItem {
  id: string;
  type: string;
  typeColor: string;
  name: string;
  meta: string;
  icon: ReactNode;
  iconBg: string;
  status?: string;
  statusColor?: string;
}

interface IssueItem {
  id: string;
  title: string;
  room: string;
  icon: ReactNode;
  iconBg: string;
  priority: string;
  priorityColor: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: ReactNode;
  bg: string;
  iconColor: string;
}

type ExpandedSection = "tasks" | "issues" | null;

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------

const SectionHeader: FC<{
  title: string;
  expanded: boolean;
  hasMore: boolean;
  onToggle: () => void;
}> = ({ title, expanded, hasMore, onToggle }) => (
  <div className="flex shrink-0 items-center justify-between px-1.5 pt-1 sm:px-2 sm:pt-1.5 lg:px-2.5 lg:pt-2">
    <h2 className="text-[8px] font-bold text-slate-900 sm:text-[9px] lg:text-[10px]">
      {title}
    </h2>

    {hasMore && (
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-0.5 text-[7px] font-medium text-blue-600 hover:text-blue-700 sm:text-[8px] lg:text-[9px]"
      >
        {expanded ? "Show Less" : "View All"}

        {expanded && <ChevronUp className="h-2 w-2" />}
      </button>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Task Row
// ---------------------------------------------------------------------------

const TaskRow: FC<{ task: TaskItem }> = ({ task }) => (
  <div className="flex items-center gap-1 py-1 sm:gap-1.5 sm:py-1.5 lg:py-2">
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${task.iconBg}`}
    >
      {task.icon}
    </span>

    <div className="min-w-0 flex-1">
      <p
        className={`text-[6px] font-medium leading-tight sm:text-[7px] lg:text-[8px] ${task.typeColor}`}
      >
        {task.type}
      </p>

      <p className="truncate text-[7px] font-semibold leading-tight text-slate-800 sm:text-[8px] lg:text-[9px]">
        {task.name}
      </p>

      {task.meta && (
        <p className="truncate text-[6px] leading-tight text-slate-400 sm:text-[7px] lg:text-[8px]">
          {task.meta}
        </p>
      )}
    </div>

    {task.status && (
      <span
        className={`shrink-0 text-[6px] font-medium sm:text-[7px] lg:text-[8px] ${task.statusColor}`}
      >
        {task.status}
      </span>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Issue Row
// ---------------------------------------------------------------------------

const IssueRow: FC<{ issue: IssueItem }> = ({ issue }) => (
  <div className="flex items-center gap-1 py-0.5 sm:gap-1.5 sm:py-1 lg:py-1.5">
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${issue.iconBg}`}
    >
      {issue.icon}
    </span>

    <div className="min-w-0 flex-1">
      <p className="truncate text-[7px] font-semibold leading-tight text-slate-800 sm:text-[8px] lg:text-[9px]">
        {issue.title}
      </p>

      <p className="truncate text-[6px] leading-tight text-slate-400 sm:text-[7px] lg:text-[8px]">
        {issue.room}
      </p>
    </div>

    <span
      className={`shrink-0 rounded-full px-1 py-0.5 text-[6px] font-medium sm:text-[7px] lg:text-[8px] ${issue.priorityColor}`}
    >
      {issue.priority}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Compact List Section
// ---------------------------------------------------------------------------

const CompactListSection: FC<{
  title: string;
  items: TaskItem[] | IssueItem[];
  expanded: boolean;
  onToggle: () => void;
  renderItem: (item: TaskItem | IssueItem) => ReactNode;
  loading?: boolean;
}> = ({
  title,
  items,
  expanded,
  onToggle,
  renderItem,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    if (expanded) {
      setHasMore(items.length > 0);
      return;
    }

    const checkOverflow = () => {
      setHasMore(content.scrollHeight > container.clientHeight + 1);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);

    observer.observe(container);
    observer.observe(content);

    window.addEventListener("resize", checkOverflow);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [items, expanded]);

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm">
      <SectionHeader
        title={title}
        expanded={expanded}
        hasMore={hasMore}
        onToggle={onToggle}
      />

      <div
        ref={containerRef}
        className={`min-h-0 flex-1 px-1 sm:px-1.5 ${
          expanded ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <div
          ref={contentRef}
          className="divide-y divide-slate-100"
        >
          {loading ? (
            <div className="flex h-full min-h-[50px] items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full min-h-[50px] items-center justify-center">
              <p className="text-[7px] text-slate-400 sm:text-[8px]">
                No {title.toLowerCase()}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const ManagerDashboard: FC = () => {

  const navigate = useNavigate();
  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------

  const { user } = useAuth();

  // -------------------------------------------------------------------------
  // PG Store
  // -------------------------------------------------------------------------

  const {
    pgInfoList,
    loading: pgLoading,
    fetchPgInfo,
  } = usePgInfoStore();

  // -------------------------------------------------------------------------
  // Selected PG Store
  // -------------------------------------------------------------------------

  const {
    selectedPg,
    selectedPgId,
    setSelectedPg,
  } = useSelectedPgStore();

  // -------------------------------------------------------------------------
  // Manager Dashboard Store
  // -------------------------------------------------------------------------

  const {
    managerDashboard,
    loading: managerDashboardLoading,
    fetchManagerDashboard,
  } = useManagerDashboardStore();

  // -------------------------------------------------------------------------
  // Aggregations Store
  // -------------------------------------------------------------------------

  const {
    aggregations,
    loading: aggregationsLoading,
    fetchAggregations,
  } = usePgAggregationsStore();

  // -------------------------------------------------------------------------
  // Service Requests Store
  // -------------------------------------------------------------------------

  const {
    data: serviceRequests,
    loading: serviceRequestsLoading,
    fetchServiceRequests,
  } = useServiceRequestsStore();

  // -------------------------------------------------------------------------
  // UI State
  // -------------------------------------------------------------------------

  const [expanded, setExpanded] =
    useState<ExpandedSection>(null);

  const [pgDropdownOpen, setPgDropdownOpen] =
    useState(false);

  // -------------------------------------------------------------------------
  // Expanded state
  // -------------------------------------------------------------------------

  const isTasksExpanded = expanded === "tasks";
  const isIssuesExpanded = expanded === "issues";

  // -------------------------------------------------------------------------
  // Fetch PGs using pg_owner
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchPgInfo({
      pg_owner: Number(user.id),
    });
  }, [user?.id, fetchPgInfo]);

  // -------------------------------------------------------------------------
  // Restore / select PG
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!pgInfoList.length) {
      return;
    }

    // If persisted selected PG still exists, keep it.
    if (selectedPgId) {
      const existingPg = pgInfoList.find(
        (pg) => Number(pg.id) === Number(selectedPgId)
      );

      if (existingPg) {
        // Only update if the actual object is missing/different.
        if (!selectedPg || Number(selectedPg.id) !== Number(existingPg.id)) {
          setSelectedPg(existingPg);
        }

        return;
      }
    }

    // No selected PG → select first available PG.
    setSelectedPg(pgInfoList[0]);
  }, [
    pgInfoList,
    selectedPgId,
    selectedPg,
    setSelectedPg,
  ]);

  // -------------------------------------------------------------------------
  // Fetch all selected-PG dashboard data
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!selectedPgId) {
      return;
    }

    const pgId = Number(selectedPgId);

    if (!Number.isFinite(pgId) || pgId <= 0) {
      return;
    }

    console.log(
      "Manager Dashboard - fetching for PG:",
      pgId
    );

    fetchManagerDashboard(pgId);
    fetchAggregations(pgId);
    fetchServiceRequests(pgId);
  }, [
    selectedPgId,
    fetchManagerDashboard,
    fetchAggregations,
    fetchServiceRequests,
  ]);

  // -------------------------------------------------------------------------
  // Today's manager tasks
  //
  // IMPORTANT:
  // fetchManagerDashboardApi already returns res.data.data.
  //
  // Therefore:
  // managerDashboard.summary
  // managerDashboard.todayTasks
  //
  // NOT:
  // managerDashboard.data.summary
  // -------------------------------------------------------------------------

  const todayTasks = useMemo(() => {
    return managerDashboard?.todayTasks ?? [];
  }, [managerDashboard]);

  const todayCheckIns = useMemo(() => {
    return Number(
      managerDashboard?.summary?.todayCheckIns ?? 0
    );
  }, [managerDashboard]);

  const todayCheckOuts = useMemo(() => {
    return Number(
      managerDashboard?.summary?.todayCheckOuts ?? 0
    );
  }, [managerDashboard]);

  // -------------------------------------------------------------------------
  // Dynamic Task Items
  // -------------------------------------------------------------------------

  const dynamicTasks = useMemo<TaskItem[]>(() => {
    return todayTasks.map((task: any, index: number) => {
      const isCheckIn =
        task.taskType === "CHECK_IN";

      const guestName =
        task.guestName ||
        `${task.firstName || ""} ${task.lastName || ""}`.trim() ||
        "Unknown Resident";

      return {
        id: `${task.taskType}-${task.bookingId}-${index}`,

        type:
          task.taskTitle ||
          (isCheckIn ? "Check-in" : "Check-out"),

        typeColor: isCheckIn
          ? "text-blue-600"
          : "text-violet-600",

        name: guestName,

        meta: task.room
          ? task.room
          : task.roomId
            ? `Room ${task.roomId}`
            : "",

        icon: isCheckIn ? (
          <LogIn className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        ) : (
          <LogOut className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        ),

        iconBg: isCheckIn
          ? "bg-blue-100"
          : "bg-violet-100",

        status: task.time || "",

        statusColor: "text-slate-500",
      };
    });
  }, [todayTasks]);

  // -------------------------------------------------------------------------
  // Dynamic Issues
  // -------------------------------------------------------------------------

  const dynamicIssues = useMemo<IssueItem[]>(() => {
    return serviceRequests.map(
      (item: any, index: number) => {
        const request = item?.serviceRequest;
        const room = item?.room;

        const overdueDays = Number(
          request?.overdueDays ?? 0
        );

        let priority = "Open";
        let priorityColor =
          "bg-blue-100 text-blue-600";

        if (overdueDays > 0) {
          priority = "Overdue";
          priorityColor =
            "bg-red-100 text-red-500";
        } else if (request?.serviceStatus === 12) {
          priority = "Medium";
          priorityColor =
            "bg-orange-100 text-orange-500";
        } else if (request?.serviceStatus === 11) {
          priority = "High";
          priorityColor =
            "bg-red-100 text-red-500";
        }

        const title =
          request?.serviceTitle ||
          "Service Request";

        const roomName =
          room?.roomName ||
          "Room not assigned";

        const lowerTitle =
          title.toLowerCase();

        let icon: ReactNode = (
          <Wrench className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        );

        let iconBg = "bg-blue-100";

        if (
          lowerTitle.includes("wifi") ||
          lowerTitle.includes("wi-fi") ||
          lowerTitle.includes("internet")
        ) {
          icon = (
            <Wifi className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          );
          iconBg = "bg-violet-100";
        } else if (
          lowerTitle.includes("housekeeping") ||
          lowerTitle.includes("clean")
        ) {
          icon = (
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          );
          iconBg = "bg-orange-100";
        } else if (
          lowerTitle.includes("plumbing") ||
          lowerTitle.includes("water")
        ) {
          icon = (
            <Wrench className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          );
          iconBg = "bg-blue-100";
        }

        return {
          id: String(
            request?.id ?? `issue-${index}`
          ),

          title,

          room: roomName,

          icon,

          iconBg,

          priority,

          priorityColor,
        };
      }
    );
  }, [serviceRequests]);

  // -------------------------------------------------------------------------
  // Dynamic Rent Follow-ups
  // -------------------------------------------------------------------------

  const rentSummary = useMemo(() => {
    const rentStatus =
      aggregations?.rentStatus;

    const due = Number(
      rentStatus?.due ?? 0
    );

    const partial = Number(
      rentStatus?.partial ?? 0
    );

    const overdue = Number(
      rentStatus?.overdue ?? 0
    );

    const total =
      due + partial + overdue;

    const percentages =
      (rentStatus as any)?.percentages;

    return [
      {
        id: "due",
        label: "Due",
        value: due,
        dot: "bg-blue-500",
        bar: "bg-blue-500",
        pct:
          Number(percentages?.due) ||
          (total > 0
            ? (due / total) * 100
            : 0),
      },
      {
        id: "partial",
        label: "Partial",
        value: partial,
        dot: "bg-orange-500",
        bar: "bg-orange-500",
        pct:
          Number(percentages?.partial) ||
          (total > 0
            ? (partial / total) * 100
            : 0),
      },
      {
        id: "overdue",
        label: "Overdue",
        value: overdue,
        dot: "bg-red-500",
        bar: "bg-red-500",
        pct:
          Number(percentages?.overdue) ||
          (total > 0
            ? (overdue / total) * 100
            : 0),
      },
    ];
  }, [aggregations]);

  // -------------------------------------------------------------------------
  // Dynamic Stats
  // -------------------------------------------------------------------------

  const stats = useMemo<StatCard[]>(() => {
    return [
      {
        id: "checkins",
        label: "Today's Check-ins",
        value: todayCheckIns,
        icon: (
          <CalendarCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
        ),
        iconBg: "bg-blue-100",
        valueColor: "text-blue-600",
      },
      {
        id: "checkouts",
        label: "Today's Check-outs",
        value: todayCheckOuts,
        icon: (
          <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
        ),
        iconBg: "bg-violet-100",
        valueColor: "text-violet-600",
      },
      {
        id: "vacant",
        label: "Vacant Beds",
        value: Number(
          aggregations?.dashboard?.vacantBeds ?? 0
        ),
        icon: (
          <Armchair className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
        ),
        iconBg: "bg-emerald-100",
        valueColor: "text-emerald-600",
      },
      {
        id: "issues",
        label: "Open Issues",
        value: Number(
          aggregations?.dashboard?.openIssues ?? 0
        ),
        icon: (
          <TriangleAlert className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
        ),
        iconBg: "bg-orange-100",
        valueColor: "text-orange-500",
      },
    ];
  }, [
    todayCheckIns,
    todayCheckOuts,
    aggregations,
  ]);

  // -------------------------------------------------------------------------
  // Quick Actions
  // -------------------------------------------------------------------------

  const quickActions: QuickAction[] = [
    {
      id: "add-resident",
      label: "Add Resident",
      icon: (
        <UserPlus className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "assign-bed",
      label: "Assign Bed",
      icon: (
        <BedDouble className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "check-in",
      label: "Check-in",
      icon: (
        <LogIn className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "update-rent",
      label: "Update Rent",
      icon: (
        <IndianRupee className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      id: "create-ticket",
      label: "Create Ticket",
      icon: (
        <Ticket className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      id: "broadcast",
      label: "Broadcast",
      icon: (
        <Megaphone className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
      ),
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  // -------------------------------------------------------------------------
  // PG Display Name
  // -------------------------------------------------------------------------

  const selectedPgName = useMemo(() => {
    const pg: any = selectedPg;

    return (
      pg?.pgName ||
      pg?.pg_name ||
      pg?.name ||
      pg?.propertyName ||
      pg?.property_name ||
      "Select PG"
    );
  }, [selectedPg]);

  // -------------------------------------------------------------------------
  // Greeting
  // -------------------------------------------------------------------------

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  }, []);

  const userName = useMemo(() => {
    if (!user) {
      return "Manager";
    }

    return (
      user.name ||
      "Manager"
    );
  }, [user]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <PageShell noScroll>
      <div className="flex h-full min-h-0 flex-col gap-1 overflow-hidden sm:gap-1.5 lg:gap-2 xl:gap-2.5">

        {/* ================================================================ */}
        {/* Top Bar */}
        {/* ================================================================ */}

        <div className="flex shrink-0 items-center justify-between">
          <h1 className="text-sm font-extrabold tracking-tight sm:text-base lg:text-lg">
            <span className="text-slate-900">
              My
            </span>

            <span className="text-blue-600">
              PG
            </span>
          </h1>

          <button
            type="button"
            className="relative flex h-5 w-5 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
            aria-label="Notifications"
          >
            <Bell className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />

            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-orange-500 text-[5px] font-semibold text-white sm:h-2.5 sm:w-2.5 sm:text-[6px]">
              3
            </span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* Greeting + PG Selector */}
        {/* ================================================================ */}

        <div className="flex shrink-0 items-center justify-between gap-1">
          <p className="text-[8px] text-slate-600 sm:text-[9px] lg:text-[10px]">
            {greeting},{" "}
            <span className="font-bold text-slate-900">
              {userName}
            </span>
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setPgDropdownOpen((prev) => !prev)
              }
              disabled={
                pgLoading ||
                pgInfoList.length === 0
              }
              className="flex shrink-0 items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1 py-0.5 text-[7px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-1.5 sm:py-1 sm:text-[8px] lg:px-2 lg:py-1.5 lg:text-[9px]"
            >
              {pgLoading ? (
                <Loader2 className="h-2 w-2 animate-spin text-blue-500" />
              ) : null}

              <span className="max-w-[100px] truncate sm:max-w-[140px] lg:max-w-[180px]">
                {selectedPgName}
              </span>

              <ChevronDown className="h-1.5 w-1.5 text-slate-400 sm:h-2 sm:w-2" />
            </button>

            {pgDropdownOpen &&
              pgInfoList.length > 0 && (
                <div className="absolute right-0 top-full z-50 mt-1 max-h-40 min-w-[130px] overflow-y-auto rounded-md border border-slate-200 bg-white p-0.5 shadow-lg sm:min-w-[160px]">
                  {pgInfoList.map((pg: any) => {
                    const pgName =
                      pg?.pgName ||
                      pg?.pg_name ||
                      pg?.name ||
                      pg?.propertyName ||
                      pg?.property_name ||
                      `PG ${pg.id}`;

                    const isSelected =
                      Number(pg.id) ===
                      Number(selectedPgId);

                    return (
                      <button
                        key={pg.id}
                        type="button"
                        onClick={() => {
                          setSelectedPg(pg);
                          setPgDropdownOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md px-1.5 py-1 text-left text-[7px] sm:text-[8px] lg:text-[9px] ${
                          isSelected
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">
                          {pgName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* Stats */}
        {/* ================================================================ */}

        <div className="grid shrink-0 grid-cols-4 gap-0.5 sm:gap-1 lg:gap-1.5">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex min-w-0 flex-col items-center justify-center gap-0 rounded-md border border-slate-100 bg-white px-0.5 py-1 text-center shadow-sm sm:gap-0.5 sm:py-1.5 lg:py-2"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.iconBg}`}
              >
                {stat.icon}
              </span>

              <p className="w-full truncate text-[5px] font-medium leading-tight text-slate-500 sm:text-[6px] lg:text-[7px]">
                {stat.label}
              </p>

              <p
                className={`text-xs font-extrabold leading-tight sm:text-sm lg:text-base ${stat.valueColor}`}
              >
                {stat.value}
              </p>

              {stat.subtext && (
                <p
                  className={`text-[4px] font-medium leading-tight sm:text-[5px] lg:text-[6px] ${stat.subtextColor}`}
                >
                  {stat.subtext}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ================================================================ */}
        {/* Tasks + Issues */}
        {/* ================================================================ */}

        <div
          className="
            grid min-h-0 shrink-0 grid-cols-2 gap-1.5 overflow-hidden
            h-[calc(36%+2px)]
            sm:h-[calc(36%+2px)] sm:gap-2
            lg:h-[calc(40%+2px)] lg:gap-2.5
            xl:h-[calc(39%+2px)]
            2xl:h-[calc(37%+2px)]
          "
        >
          <CompactListSection
            title="Today's Tasks"
            items={dynamicTasks}
            expanded={isTasksExpanded}
            onToggle={() =>
              setExpanded(
                isTasksExpanded
                  ? null
                  : "tasks"
              )
            }
            loading={
              managerDashboardLoading
            }
            renderItem={(item) => (
              <TaskRow
                task={item as TaskItem}
              />
            )}
          />

          <CompactListSection
            title="Open Issues"
            items={dynamicIssues}
            expanded={isIssuesExpanded}
            onToggle={() =>
              setExpanded(
                isIssuesExpanded
                  ? null
                  : "issues"
              )
            }
            loading={
              serviceRequestsLoading
            }
            renderItem={(item) => (
              <IssueRow
                issue={item as IssueItem}
              />
            )}
          />
        </div>

        {/* ================================================================ */}
        {/* Bottom Desktop Row */}
        {/* Rent Follow-ups + Quick Actions */}
        {/* ================================================================ */}

        <div className="grid min-h-0 shrink-0 grid-cols-1 gap-1 sm:gap-1.5 lg:grid-cols-2 lg:gap-2.5 xl:gap-3">

          {/* ============================================================ */}
          {/* Rent Follow-ups */}
          {/* ============================================================ */}

          <div className="shrink-0 rounded-md border border-slate-100 bg-white p-2 shadow-sm md:p-3">
            <div className="mb-0.5 flex items-center justify-between">
              <h2 className="text-[8px] font-bold text-slate-900 sm:text-[9px] lg:text-[10px]">
                Rent Follow-ups
              </h2>

              <button
                type="button"
                onClick={() => navigate("/manager/rent-status")}
                className="text-[6px] font-medium text-blue-600 sm:text-[7px] lg:text-[8px]"
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:gap-2">
              {rentSummary.map((item) => (
                <div key={item.id}>
                  <div className="mb-2 flex items-center gap-0.5">
                    <span
                      className={`h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1 ${item.dot}`}
                    />

                    <span className="text-[5px] text-slate-500 sm:text-[6px] lg:text-[7px]">
                      {item.label}
                    </span>
                  </div>

                  <p className="mb-0.5 text-xs font-extrabold leading-tight text-slate-900 sm:text-sm lg:text-base">
                    {item.value}
                  </p>

                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-slate-100 sm:h-0.5 lg:h-1">
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{
                        width: `${Math.min(
                          Math.max(item.pct, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
               onClick={() => navigate("/manager/rent-status")}
              className="mt-2 flex w-full items-center justify-center gap-0.5 rounded-md border border-slate-200 py-0.5 text-[6px] font-medium text-blue-600 hover:bg-blue-50 sm:py-1 sm:text-[7px] lg:text-[8px]"
            >
              <Send className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
              Send Reminders
            </button>
          </div>

          {/* ============================================================ */}
          {/* Quick Actions */}
          {/* ============================================================ */}

          <div className="shrink-0">
            <h2 className="mb-1 text-[8px] font-bold text-slate-900 sm:text-[9px] lg:text-[10px]">
              Quick Actions
            </h2>

            <div className="grid grid-cols-3 gap-3">
             {quickActions.map((action) => {
  const handleQuickAction = () => {
  switch (action.id) {
    case "add-resident":
      navigate("/manager/vacancy-pipeline");
      break;

    case "assign-bed":
      navigate("/manager/bedmap");
      break;

    case "update-rent":
      navigate("/manager/rent-status");
      break;

    case "broadcast":
      navigate("/manager/broadcast");
      break;

    case "check-in":
      // No navigation for now
      break;

    case "create-ticket":
      // No navigation for now
      break;

    default:
      break;
  }
};

  return (
    <button
      key={action.id}
      type="button"
      onClick={handleQuickAction}
      className={`flex min-w-0 items-center justify-center gap-0.5 rounded-md ${action.bg} px-1 py-[5px] transition-transform active:scale-[0.97] sm:gap-1 lg:px-1.5 lg:py-[5.5px]`}
    >
      <span
        className={`shrink-0 ${action.iconColor}`}
      >
        {action.icon}
      </span>

      <span className="truncate text-[8px] font-medium text-slate-700 lg:text-[10px]">
        {action.label}
      </span>
    </button>
  );
})}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ManagerDashboard;
