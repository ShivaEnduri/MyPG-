import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Info,
  Smile,
  Star,
  Wifi,
  Droplets,
  SprayCan,
  UserRound,
  Zap,
  Wind,
  LockKeyhole,
  Wrench,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { useIssuesAndResidentHappinessStore } from "@/app/shared/store/issuesAndHappinessStore";
import { useServiceRequestsStore } from "@/app/shared/store/useServiceRequestsStore";
import { useAuth } from "../../../../hooks/context/AuthContext";

/* ============================================================
   TYPES
============================================================ */

type IssuePriority =
  | "Overdue"
  | "High"
  | "Medium";

type TrendPeriod = "7" | "14" | "28";

type IssueType =
  | "plumbing"
  | "wifi"
  | "housekeeping"
  | "electrical"
  | "aircondition"
  | "lockers"
  | "water"
  | "service";

interface IssueItem {
  id: number;
  type: IssueType;

  /*
   * This is serviceRequest.serviceTitle
   */
  title: string;

  /*
   * Kept in the mapped data but not displayed
   * in the issue row.
   */
  description: string;

  priority: IssuePriority;
  dueText: string;
  assignee: string;
  initials: string;
}

interface FeedbackItem {
  id: number;
  name: string;
  room: string;
  comment: string;
  rating: number;
  date: string;
}

interface SatisfactionTrendItem {
  date: string;
  avgRating: number;
  responses: number;
}

/* ============================================================
   SERVICE REQUEST API TYPE
============================================================ */

interface ServiceRequestPerson {
  id?: number | string;
  firstName?: string;
  lastName?: string;
}

interface ServiceRequestRoom {
  id?: number | string;
  roomName?: string;
}

interface ServiceRequestData {
  id?: number | string;
  requestorInfo?: number | string;

  requestAssignedTo?: ServiceRequestPerson | null;

  serviceTitle?: string;
  serviceDescription?: string;

  feedbackSummary?: string | null;

  SLA?: number | string;

  feedback?: number | string | null;

  serviceStatus?: number | string;

  pgId?: number | string;

  requestEtaDate?: string | null;

  overdueDays?: number | string | null;
}

interface ServiceRequestRecord {
  serviceRequest?: ServiceRequestData | null;

  requestor?: ServiceRequestPerson | null;

  guest?: {
    id?: number | string;
    userId?: number | string;
  } | null;

  booking?: {
    id?: number | string;
    guestId?: number | string;
    roomId?: number | string;
  } | null;

  room?: ServiceRequestRoom | null;
}

/* ============================================================
   UTILITY
============================================================ */

const cn = (
  ...classes: Array<
    string | false | null | undefined
  >
) => classes.filter(Boolean).join(" ");

/* ============================================================
   SERVICE REQUEST HELPERS
============================================================ */

const getPersonName = (
  person?: ServiceRequestPerson | null,
) => {
  if (!person) {
    return "Unassigned";
  }

  const fullName = [
    person.firstName,
    person.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unassigned";
};

/* ------------------------------------------------------------
   INITIALS
------------------------------------------------------------ */

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

/* ------------------------------------------------------------
   ISSUE TYPE
------------------------------------------------------------ */

const getIssueType = (
  serviceTitle = "",
): IssueType => {
  const value =
    serviceTitle.toLowerCase();

  if (
    value.includes("wifi") ||
    value.includes("wi-fi")
  ) {
    return "wifi";
  }

  if (
    value.includes("housekeeping") ||
    value.includes("cleaning")
  ) {
    return "housekeeping";
  }

  if (
    value.includes("electrical") ||
    value.includes("electric")
  ) {
    return "electrical";
  }

  if (
    value.includes("aircondition") ||
    value.includes("air condition") ||
    value.includes("air-conditioning") ||
    value.includes("ac ")
  ) {
    return "aircondition";
  }

  if (
    value.includes("locker") ||
    value.includes("lockers")
  ) {
    return "lockers";
  }

  if (
    value.includes("water") ||
    value.includes("tap") ||
    value.includes("washbasin")
  ) {
    return "water";
  }

  if (value.includes("plumb")) {
    return "plumbing";
  }

  return "service";
};

/* ------------------------------------------------------------
   STATUS
------------------------------------------------------------ */

const getStatus = (
  status?: number | string,
) => {
  const numericStatus = Number(status);

  if (numericStatus === 13) {
    return "Resolved";
  }

  if (numericStatus === 12) {
    return "In Progress";
  }

  if (numericStatus === 11) {
    return "Open";
  }

  return "Open";
};

/* ------------------------------------------------------------
   PRIORITY
------------------------------------------------------------ */

const getPriority = (
  serviceRequest: ServiceRequestData,
): IssuePriority => {
  const status = Number(
    serviceRequest.serviceStatus,
  );

  const overdueDays =
    Number(serviceRequest.overdueDays) || 0;

  /*
   * Resolved request should never become
   * an overdue/open issue.
   */
  if (status === 13) {
    return "Medium";
  }

  if (overdueDays > 0) {
    return "Overdue";
  }

  if (status === 11) {
    return "High";
  }

  return "Medium";
};

/* ------------------------------------------------------------
   DUE TEXT
------------------------------------------------------------ */

const getDueText = (
  serviceRequest: ServiceRequestData,
) => {
  const status = Number(
    serviceRequest.serviceStatus,
  );

  const overdueDays =
    Number(serviceRequest.overdueDays) || 0;

  if (status === 13) {
    return "Resolved";
  }

  if (overdueDays > 0) {
    return `${overdueDays} ${
      overdueDays === 1
        ? "day"
        : "days"
    } overdue`;
  }

  const eta =
    serviceRequest.requestEtaDate;

  if (eta) {
    const etaDate = new Date(eta);

    if (
      !Number.isNaN(
        etaDate.getTime(),
      )
    ) {
      const now = new Date();

      const diffMs =
        etaDate.getTime() -
        now.getTime();

      const diffDays = Math.ceil(
        diffMs /
          (1000 * 60 * 60 * 24),
      );

      if (diffDays <= 0) {
        return "Due today";
      }

      if (diffDays === 1) {
        return "1 day";
      }

      return `${diffDays} days`;
    }
  }

  const sla = Number(
    serviceRequest.SLA,
  );

  if (
    Number.isFinite(sla) &&
    sla > 0
  ) {
    return `${sla} days SLA`;
  }

  return "Within SLA";
};

/* ============================================================
   MAP SERVICE REQUEST -> ISSUE
============================================================ */

const mapServiceRequestToIssue = (
  record: ServiceRequestRecord,
): IssueItem | null => {
  const serviceRequest =
    record.serviceRequest;

  if (!serviceRequest) {
    return null;
  }

  const status = Number(
    serviceRequest.serviceStatus,
  );

  /*
   * 13 = Resolved.
   *
   * Resolved requests are not displayed
   * under Open Issues.
   */
  if (status === 13) {
    return null;
  }

  /*
   * IMPORTANT:
   *
   * Take title directly from:
   *
   * serviceRequest.serviceTitle
   */
  const serviceTitle =
    String(
      serviceRequest.serviceTitle ??
        "",
    ).trim();

  /*
   * If title is missing, use a safe fallback.
   */
  const title =
    serviceTitle ||
    "Service Request";

  const assignedTo =
    getPersonName(
      serviceRequest.requestAssignedTo,
    );

  /*
   * Description is still mapped but is
   * intentionally NOT displayed.
   */
  const description =
    String(
      serviceRequest.serviceDescription ??
        "",
    ).trim() ||
    "No description provided";

  return {
    id:
      Number(serviceRequest.id) ||
      0,

    type: getIssueType(
      serviceTitle,
    ),

    title,

    description,

    priority:
      getPriority(serviceRequest),

    dueText:
      getDueText(serviceRequest),

    assignee:
      assignedTo,

    initials:
      getInitials(assignedTo),
  };
};

/* ============================================================
   FEEDBACK DATE
============================================================ */

const formatFeedbackDate = (
  date?: string | null,
) => {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    },
  );
};

/* ============================================================
   MAP SERVICE REQUEST -> FEEDBACK
============================================================ */

const mapServiceRequestToFeedback = (
  record: ServiceRequestRecord,
): FeedbackItem | null => {
  const serviceRequest =
    record.serviceRequest;

  if (!serviceRequest) {
    return null;
  }

  const rating = Number(
    serviceRequest.feedback,
  );

  const comment =
    serviceRequest.feedbackSummary
      ?.trim();

  /*
   * Only show records which actually
   * contain feedback/rating.
   */
  if (
    !comment &&
    (!Number.isFinite(rating) ||
      rating <= 0)
  ) {
    return null;
  }

  const name =
    getPersonName(
      record.requestor,
    );

  const room =
    record.room?.roomName ||
    "—";

  return {
    id:
      Number(serviceRequest.id) ||
      0,

    name,

    room,

    comment:
      comment ||
      "No comment provided",

    rating:
      Number.isFinite(rating) &&
      rating > 0
        ? Math.min(
            5,
            Math.max(0, rating),
          )
        : 0,

    date:
      formatFeedbackDate(
        serviceRequest.requestEtaDate,
      ),
  };
};

/* ============================================================
   PG DROPDOWN
============================================================ */

interface PgDropdownProps {
  selectedPgId: number | null;
  onSelect: (
    pgId: number,
  ) => void;
}

const PgDropdown: FC<
  PgDropdownProps
> = ({
  selectedPgId,
  onSelect,
}) => {
  const [open, setOpen] =
    useState(false);

  const pgInfoList =
    usePgInfoStore(
      (state) =>
        state.pgInfoList,
    );

  const loading =
    usePgInfoStore(
      (state) =>
        state.loading,
    );

  const selectedPg =
    useMemo(
      () =>
        pgInfoList.find(
          (pg) =>
            Number(pg.id) ===
            Number(
              selectedPgId,
            ),
        ) ?? null,
      [
        pgInfoList,
        selectedPgId,
      ],
    );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value,
          )
        }
        className="
          flex
          h-[21px]
          shrink-0
          items-center
          gap-0.5
          rounded-md
          border
          border-slate-200
          bg-white
          px-1.5
          text-[7px]
          font-medium
          text-slate-700

          sm:h-[23px]
          sm:px-2
          sm:text-[8px]

          lg:h-[29px]
          lg:px-3
          lg:text-[10px]
        "
      >
        <span className="max-w-[90px] truncate sm:max-w-[130px] lg:max-w-[170px]">
          {selectedPg?.pg_name ??
            "Select PG"}
        </span>

        <ChevronDown
          className="
            h-[8px]
            w-[8px]
            text-slate-500

            sm:h-[9px]
            sm:w-[9px]

            lg:h-[11px]
            lg:w-[11px]
          "
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-[180px] min-w-[140px] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg sm:min-w-[180px]">
          {loading &&
          pgInfoList.length ===
            0 ? (
            <div className="px-2 py-2 text-center text-[7px] text-slate-400 sm:text-[8px]">
              Loading...
            </div>
          ) : pgInfoList.length ===
            0 ? (
            <div className="px-2 py-2 text-center text-[7px] text-slate-400 sm:text-[8px]">
              No PGs found
            </div>
          ) : (
            pgInfoList.map(
              (pg) => {
                const pgId =
                  Number(
                    pg.id,
                  );

                const selected =
                  Number(
                    selectedPgId,
                  ) === pgId;

                return (
                  <button
                    key={pgId}
                    type="button"
                    onClick={() => {
                      onSelect(
                        pgId,
                      );

                      setOpen(
                        false,
                      );
                    }}
                    className={cn(
                      "flex w-full items-center rounded px-2 py-1.5 text-left text-[7px] sm:text-[8px] lg:text-[9px]",
                      selected
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <span className="truncate">
                      {pg.pg_name ??
                        `PG ${pgId}`}
                    </span>
                  </button>
                );
              },
            )
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   ISSUE ICON
============================================================ */

const IssueIcon: FC<{
  type: IssueItem["type"];
}> = ({
  type,
}) => {
  if (type === "wifi") {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <Wifi
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  if (
    type ===
    "housekeeping"
  ) {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <SprayCan
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  if (
    type ===
    "electrical"
  ) {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <Zap
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  if (
    type ===
    "aircondition"
  ) {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <Wind
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  if (
    type ===
    "lockers"
  ) {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <LockKeyhole
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  if (
    type ===
    "service"
  ) {
    return (
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
        <Wrench
          className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
          strokeWidth={
            2.2
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 sm:h-[25px] sm:w-[25px] lg:h-[29px] lg:w-[29px]">
      <Droplets
        className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px] lg:h-[14px] lg:w-[14px]"
        strokeWidth={
          2.2
        }
      />
    </div>
  );
};

/* ============================================================
   PRIORITY BADGE
============================================================ */

const PriorityBadge: FC<{
  priority: IssuePriority;
}> = ({
  priority,
}) => {
  const styles = {
    Overdue:
      "bg-red-50 text-red-500",

    High:
      "bg-orange-50 text-orange-500",

    Medium:
      "bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={cn(
        "rounded-full px-1 py-[2px] text-[6px] leading-none sm:px-1.5 sm:text-[7px] lg:px-2 lg:text-[9px]",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
};

/* ============================================================
   STAT CARD
============================================================ */

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  suffix?: string;
  footer: React.ReactNode;
  valueColor?: string;
}

const StatCard: FC<
  StatCardProps
> = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  suffix,
  footer,
  valueColor = "text-slate-900",
}) => {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-md border border-slate-100 bg-white px-0.5 py-1 text-center shadow-[0_1px_3px_rgba(15,23,42,0.035)] sm:px-1 sm:py-1.5 lg:rounded-lg lg:px-2 lg:py-2">
      <div
        className={cn(
          "mb-[2px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full sm:h-[20px] sm:w-[20px] lg:mb-1 lg:h-[24px] lg:w-[24px]",
          iconBg,
          iconColor,
        )}
      >
        {icon}
      </div>

      <p className="w-full truncate text-center text-[6px] font-medium leading-tight text-slate-600 sm:text-[7px] lg:text-[9px]">
        {label}
      </p>

      <div className="mt-[1px] flex items-baseline justify-center gap-[1px]">
        <span
          className={cn(
            "text-[13px] font-bold leading-none sm:text-[16px] lg:text-[21px]",
            valueColor,
          )}
        >
          {value}
        </span>

        {suffix && (
          <span className="text-[6px] font-medium text-slate-500 sm:text-[7px] lg:text-[9px]">
            {suffix}
          </span>
        )}
      </div>

      <div className="mt-[2px] w-full truncate text-center text-[5px] leading-tight sm:text-[6px] lg:text-[8px]">
        {footer}
      </div>
    </div>
  );
};

/* ============================================================
   SATISFACTION CHART
============================================================ */


interface SatisfactionChartProps {
  points: SatisfactionTrendItem[];
}

const SatisfactionChart: FC<SatisfactionChartProps> = ({ points }) => {
  const height = 78;
  const min = 1;
  const max = 5;

  const validPoints = points.filter(
    (point) =>
      Number(point.responses) > 0 &&
      Number(point.avgRating) > 0,
  );

  const hasData = validPoints.length > 0;

  /*
   * Give every day its own horizontal position.
   * This prevents 14/28 days from visually becoming
   * separate weekly rows.
   */
  const pointSpacing =
    points.length <= 7
      ? 85
      : points.length <= 14
        ? 58
        : 38;

  const chartWidth = Math.max(
    600,
    points.length * pointSpacing,
  );

  const plotLeft = 10;
  const plotRight = 10;
  const plotWidth =
    chartWidth - plotLeft - plotRight;

  /*
   * Keep the actual date range on the X axis.
   * We do NOT create separate rows for each week.
   */
  const coords = hasData
    ? validPoints.map((point) => {
        const originalIndex = points.findIndex(
          (item) => item.date === point.date,
        );

        const x =
          points.length === 1
            ? chartWidth / 2
            : plotLeft +
              (originalIndex * plotWidth) /
                Math.max(points.length - 1, 1);

        const rating = Math.max(
          min,
          Math.min(
            max,
            Number(point.avgRating) || min,
          ),
        );

        const y =
          height -
          8 -
          ((rating - min) /
            (max - min)) *
            (height - 16);

        return {
          x,
          y,
          rating,
          date: point.date,
        };
      })
    : [];

  const path = hasData
    ? coords
        .map(
          (point, index) =>
            `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
        )
        .join(" ")
    : "";

  const areaPath = hasData
    ? `${path} L ${
        chartWidth - plotRight
      } ${height} L ${plotLeft} ${height} Z`
    : "";

  return (
    <div className="mt-0 w-full overflow-x-auto overflow-y-hidden scrollbar-none">
      <div
        className="relative"
        style={{
          minWidth:
            points.length > 7
              ? `${chartWidth}px`
              : "100%",
        }}
      >
        {/* Graph */}
        <div className="relative h-[45px] sm:h-[53px] lg:h-[72px]">
          {/* Y-axis + horizontal grid */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-1">
            {[5, 4, 3, 2, 1].map((number) => (
              <div
                key={number}
                className="flex items-center gap-1"
              >
                <span className="w-[16px] shrink-0 text-[5px] text-slate-400 sm:w-[18px] sm:text-[6px] lg:w-[20px] lg:text-[8px]">
                  {number}.0
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>
            ))}
          </div>

          {hasData ? (
            <svg
              viewBox={`0 0 ${chartWidth} ${height}`}
              preserveAspectRatio="none"
              className="absolute left-[19px] top-0 h-[42px] w-[calc(100%-19px)] sm:h-[50px] lg:h-[68px]"
              style={{
                minWidth:
                  points.length > 7
                    ? `${chartWidth - 19}px`
                    : undefined,
              }}
            >
              {/* Area */}
              <path
                d={areaPath}
                fill="currentColor"
                className="text-emerald-50"
              />

              {/* Continuous line */}
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-600"
              />

              {/* Rating points */}
              {coords.map((point, index) => (
                <circle
                  key={`${point.date}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill="currentColor"
                  className="text-emerald-600"
                />
              ))}
            </svg>
          ) : (
            <div className="absolute left-[19px] right-0 top-0 flex h-[42px] items-center justify-center sm:h-[50px] lg:h-[68px]">
              <span className="rounded-md bg-slate-50 px-2 py-1 text-[6px] text-slate-400 sm:text-[7px] lg:text-[8px]">
                No rating data for this period
              </span>
            </div>
          )}
        </div>

        {/* Dates — ALWAYS ONE ROW */}
        <div
          className="ml-[19px] flex items-center"
          style={{
            width:
              points.length > 7
                ? `${chartWidth - 19}px`
                : "calc(100% - 19px)",
          }}
        >
          {points.map((point, index) => {
            const date = point.date
              ? new Date(
                  `${point.date}T00:00:00`,
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "";

            return (
              <span
                key={`${point.date}-${index}`}
                className={cn(
                  "shrink-0 truncate text-center text-[5px] sm:text-[6px] lg:text-[8px]",
                  Number(point.responses) === 0
                    ? "text-slate-300"
                    : "text-slate-500",
                )}
                style={{
                  width:
                    points.length <= 7
                      ? `${100 / points.length}%`
                      : `${pointSpacing}px`,
                }}
              >
                {date}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   OPEN ISSUES
============================================================ */

interface OpenIssuesProps {
  issues: IssueItem[];
  loading: boolean;
  expanded: boolean;
  onToggle: () => void;
}

const OpenIssues: FC<
  OpenIssuesProps
> = ({
  issues,
  loading,
  expanded,
  onToggle,
}) => {
  const visibleIssues =
    expanded
      ? issues
      : issues.slice(0, 3);

  return (
    <section className="flex min-h-0 flex-col rounded-md border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.035)] lg:rounded-lg">
      <div className="flex shrink-0 items-center justify-between px-1.5 pt-1 sm:px-2 sm:pt-1.5 lg:px-3 lg:pt-2">
        <h2 className="text-[9px] font-semibold text-slate-900 sm:text-[10px] lg:text-[14px]">
          Open Issues
        </h2>

        {issues.length >
          3 && (
          <button
            type="button"
            onClick={onToggle}
            className="text-[7px] font-medium text-blue-600 sm:text-[8px] lg:text-[10px]"
          >
            {expanded
              ? "Show Less"
              : "View All"}
          </button>
        )}
      </div>

      <div
        className={cn(
          "min-h-0 px-1.5 pb-1 sm:px-2 sm:pb-1.5 lg:px-3 lg:pb-2",
          expanded &&
            "max-h-[115px] overflow-y-auto overscroll-contain scrollbar-thin sm:max-h-[135px] lg:max-h-[185px]",
        )}
      >
        {loading ? (
          <div className="flex min-h-[70px] items-center justify-center text-[7px] text-slate-400 sm:text-[8px] lg:text-[9px]">
            Loading issues...
          </div>
        ) : visibleIssues.length ===
          0 ? (
          <div className="flex min-h-[70px] items-center justify-center text-center text-[7px] text-slate-400 sm:text-[8px] lg:text-[9px]">
            No open issues
            available
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {visibleIssues.map(
                (issue) => (
                  <div
                    key={
                      issue.id
                    }
                    className="flex min-h-[31px] items-center gap-1 py-[3px] sm:min-h-[35px] sm:gap-1.5 lg:min-h-[44px] lg:gap-2 lg:py-1"
                  >
                    {/* ISSUE ICON */}

                    <IssueIcon
                      type={
                        issue.type
                      }
                    />

                    {/* ==================================================
                        TITLE

                        IMPORTANT:
                        This displays serviceRequest.serviceTitle
                        directly through issue.title.

                        Description is intentionally not displayed.
                    ================================================== */}

                    <div className="min-w-0 flex-1">
                      <p
                        title={
                          issue.title
                        }
                        className="truncate text-[7px] font-medium leading-tight text-slate-900 sm:text-[8px] lg:text-[10px]"
                      >
                        {issue.title ||
                          "Service Request"}
                      </p>
                    </div>

                    {/* PRIORITY */}

                    <div className="hidden w-[48px] shrink-0 flex-col items-start sm:flex sm:w-[52px] lg:w-[65px]">
                      <PriorityBadge
                        priority={
                          issue.priority
                        }
                      />

                      <span
                        className={cn(
                          "mt-[2px] text-[6px] sm:text-[7px] lg:text-[8px]",
                          issue.priority ===
                            "Overdue"
                            ? "text-red-500"
                            : "text-slate-500",
                        )}
                      >
                        {
                          issue.dueText
                        }
                      </span>
                    </div>

                    {/* ==================================================
                        ASSIGNED TO

                        Visible on mobile, tablet and desktop.
                    ================================================== */}

                    <div className="flex w-[67px] shrink-0 items-center gap-1 sm:w-[75px] lg:w-[95px]">
                      {/* Avatar */}

                      <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-slate-200 text-[6px] font-semibold text-slate-700 sm:h-[22px] sm:w-[22px] sm:text-[7px] lg:h-[27px] lg:w-[27px] lg:text-[8px]">
                        {issue.initials}
                      </div>

                      {/* Name */}

                      <div className="min-w-0">
                        <p className="text-[5px] leading-none text-slate-400 sm:text-[6px] lg:text-[7px]">
                          Assigned To
                        </p>

                        <p
                          title={
                            issue.assignee
                          }
                          className="mt-[2px] truncate text-[6px] font-medium leading-tight text-slate-700 sm:text-[7px] lg:text-[8px]"
                        >
                          {
                            issue.assignee
                          }
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-[9px] w-[9px] shrink-0 text-slate-400 sm:h-[10px] sm:w-[10px] lg:h-[12px] lg:w-[12px]" />
                  </div>
                ),
              )}
            </div>

            {!expanded &&
              issues.length >
                3 && (
                <button
                  type="button"
                  onClick={onToggle}
                  className="flex h-[20px] w-full items-center justify-center gap-0.5 rounded-md border border-blue-100 text-[6px] font-medium text-blue-600 sm:h-[22px] sm:text-[7px] lg:h-[27px] lg:text-[9px]"
                >
                  Review All
                  Issues

                  <ChevronRight className="h-[8px] w-[8px] sm:h-[9px] sm:w-[9px] lg:h-[11px] lg:w-[11px]" />
                </button>
              )}
          </>
        )}
      </div>
    </section>
  );
};

/* ============================================================
   RECENT FEEDBACK
============================================================ */

interface RecentFeedbackProps {
  feedback: FeedbackItem[];
  loading: boolean;
  expanded: boolean;
  onToggle: () => void;
}

const RecentFeedback: FC<
  RecentFeedbackProps
> = ({
  feedback,
  loading,
  expanded,
  onToggle,
}) => {
  const visibleFeedback =
    expanded
      ? feedback
      : feedback.slice(0, 2);

  return (
    <section className="flex min-h-0 flex-col rounded-md border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.035)] lg:rounded-lg">
      <div className="flex shrink-0 items-center justify-between px-1.5 pt-1 sm:px-2 sm:pt-1.5 lg:px-3 lg:pt-2">
        <h2 className="text-[9px] font-semibold text-slate-900 sm:text-[10px] lg:text-[14px]">
          Recent Feedback
        </h2>

        {feedback.length >
          2 && (
          <button
            type="button"
            onClick={onToggle}
            className="text-[7px] font-medium text-blue-600 sm:text-[8px] lg:text-[10px]"
          >
            {expanded
              ? "Show Less"
              : "View All"}
          </button>
        )}
      </div>

      <div
        className={cn(
          "min-h-0 px-1.5 pb-1 sm:px-2 sm:pb-1.5 lg:px-3 lg:pb-2",
          expanded &&
            "max-h-[100px] overflow-y-auto overscroll-contain scrollbar-thin sm:max-h-[120px] lg:max-h-[160px]",
        )}
      >
        {loading ? (
          <div className="flex min-h-[70px] items-center justify-center text-[7px] text-slate-400 sm:text-[8px] lg:text-[9px]">
            Loading feedback...
          </div>
        ) : visibleFeedback.length ===
          0 ? (
          <div className="flex min-h-[70px] items-center justify-center text-center text-[7px] text-slate-400 sm:text-[8px] lg:text-[9px]">
            No resident
            feedback available
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleFeedback.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="flex min-h-[34px] items-center gap-1 py-[3px] sm:min-h-[38px] sm:gap-1.5 lg:min-h-[46px] lg:gap-2 lg:py-1"
                >
                  {/* RESIDENT AVATAR */}

                  <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-slate-100 sm:h-[24px] sm:w-[24px] lg:h-[29px] lg:w-[29px]">
                    <UserRound
                      className="h-[10px] w-[10px] text-slate-500 sm:h-[11px] sm:w-[11px] lg:h-[14px] lg:w-[14px]"
                    />
                  </div>

                  {/* NAME + ROOM + COMMENT */}

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <span
                        title={
                          item.name
                        }
                        className="truncate text-[7px] font-medium text-slate-900 sm:text-[8px] lg:text-[10px]"
                      >
                        {
                          item.name
                        }
                      </span>

                      {item.room !==
                        "—" && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-1 py-[1px] text-[5px] text-emerald-600 sm:text-[6px] lg:text-[8px]">
                          {
                            item.room
                          }
                        </span>
                      )}
                    </div>

                    <p
                      title={
                        item.comment
                      }
                      className="mt-[1px] truncate text-[6px] leading-tight text-slate-500 sm:text-[7px] lg:text-[9px]"
                    >
                      {
                        item.comment
                      }
                    </p>
                  </div>

                  {/* ==================================================
                      STARS

                      ALL STARS ARE GREEN.
                  ================================================== */}

                  <div className="flex shrink-0 flex-col items-end">
                    <div className="flex gap-[1px]">
                      {[1, 2, 3, 4, 5].map(
                        (star) => {
                          const filled =
                            star <=
                            item.rating;

                          return (
                            <Star
                              key={
                                star
                              }
                              className={cn(
                                "h-[7px] w-[7px] text-emerald-600 sm:h-[8px] sm:w-[8px] lg:h-[10px] lg:w-[10px]",
                              )}
                              strokeWidth={
                                2
                              }
                              fill={
                                filled
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          );
                        },
                      )}
                    </div>

                    <span className="mt-[1px] text-[5px] text-slate-500 sm:text-[6px] lg:text-[8px]">
                      {
                        item.date
                      }
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const ResidentHappiness: FC =
  () => {
    const [
      issuesExpanded,
      setIssuesExpanded,
    ] = useState(false);

    const [
      feedbackExpanded,
      setFeedbackExpanded,
    ] = useState(false);

    const [
      trendPeriod,
      setTrendPeriod,
    ] =
      useState<TrendPeriod>(
        "7",
      );

    const [
      trendDropdownOpen,
      setTrendDropdownOpen,
    ] = useState(false);

    const { user } =
      useAuth();

    const pgOwnerId =
      user?.id;

    /* ========================================================
       PG STORE
    ======================================================== */

    const pgInfoList =
      usePgInfoStore(
        (state) =>
          state.pgInfoList,
      );

    const fetchPgInfo =
      usePgInfoStore(
        (state) =>
          state.fetchPgInfo,
      );

    const selectedPgId =
      useSelectedPgStore(
        (state) =>
          state.selectedPgId,
      );

    const setSelectedPg =
      useSelectedPgStore(
        (state) =>
          state.setSelectedPg,
      );

    /* ========================================================
       AGGREGATE STORE

       Used for:
       - Avg Rating
       - Satisfaction Trend
       - Open Issues Count
       - Overdue Count
       - Resolved Count
    ======================================================== */

    const aggregateData =
      useIssuesAndResidentHappinessStore(
        (state) =>
          state.data,
      );

    const aggregateLoading =
      useIssuesAndResidentHappinessStore(
        (state) =>
          state.loading,
      );

    const aggregateError =
      useIssuesAndResidentHappinessStore(
        (state) =>
          state.error,
      );

    const fetchAggregates =
      useIssuesAndResidentHappinessStore(
        (state) =>
          state.fetchAggregates,
      );

    /* ========================================================
       SERVICE REQUEST STORE

       Used for:
       - Open Issues
       - Recent Feedback
    ======================================================== */

    const serviceRequests =
      useServiceRequestsStore(
        (state) =>
          state.data,
      );

    const serviceRequestsLoading =
      useServiceRequestsStore(
        (state) =>
          state.loading,
      );

    const serviceRequestsError =
      useServiceRequestsStore(
        (state) =>
          state.error,
      );

    const fetchServiceRequests =
      useServiceRequestsStore(
        (state) =>
          state.fetchServiceRequests,
      );

    /* ========================================================
       FETCH PG LIST
    ======================================================== */

    useEffect(() => {
      if (
        pgOwnerId ===
          null ||
        pgOwnerId ===
          undefined
      ) {
        return;
      }

      if (
        pgInfoList.length >
        0
      ) {
        return;
      }

      fetchPgInfo({
        pg_owner:
          Number(
            pgOwnerId,
          ),
      });
    }, [
      pgOwnerId,
      pgInfoList.length,
      fetchPgInfo,
    ]);

    /* ========================================================
       DEFAULT PG
    ======================================================== */

    useEffect(() => {
      if (
        pgInfoList.length ===
        0
      ) {
        return;
      }

      if (
        selectedPgId !==
        null
      ) {
        const selectedExists =
          pgInfoList.some(
            (pg) =>
              Number(
                pg.id,
              ) ===
              Number(
                selectedPgId,
              ),
          );

        if (
          selectedExists
        ) {
          return;
        }
      }

      setSelectedPg(
        pgInfoList[0],
      );
    }, [
      pgInfoList,
      selectedPgId,
      setSelectedPg,
    ]);

    /* ========================================================
       FETCH AGGREGATES
    ======================================================== */

    useEffect(() => {
      if (
        selectedPgId ===
          null ||
        selectedPgId ===
          undefined
      ) {
        return;
      }

      fetchAggregates(
        Number(
          selectedPgId,
        ),
      );
    }, [
      selectedPgId,
      fetchAggregates,
    ]);

    /* ========================================================
       FETCH SERVICE REQUESTS
    ======================================================== */

    useEffect(() => {
      if (
        selectedPgId ===
          null ||
        selectedPgId ===
          undefined
      ) {
        return;
      }

      fetchServiceRequests(
        Number(
          selectedPgId,
        ),
      );
    }, [
      selectedPgId,
      fetchServiceRequests,
    ]);

    /* ========================================================
       SELECTED PG
    ======================================================== */

    const selectedPg =
      useMemo(
        () =>
          pgInfoList.find(
            (pg) =>
              Number(
                pg.id,
              ) ===
              Number(
                selectedPgId,
              ),
          ) ?? null,
        [
          pgInfoList,
          selectedPgId,
        ],
      );

    /* ========================================================
       AGGREGATE API DATA
    ======================================================== */

    const happinessSummary =
      aggregateData
        ?.residentHappiness
        ?.summary;

    const satisfactionTrend =
      aggregateData
        ?.residentHappiness
        ?.satisfactionTrend;

    const issueSummary =
      aggregateData?.issues
        ?.summary;

    /* ========================================================
       DYNAMIC ISSUES

       API:

       serviceRequest.serviceTitle
       serviceRequest.serviceDescription
       serviceRequest.serviceStatus
       serviceRequest.overdueDays
       serviceRequest.requestAssignedTo
    ======================================================== */

    const mappedIssues =
      useMemo<IssueItem[]>(
        () => {
          if (
            !Array.isArray(
              serviceRequests,
            )
          ) {
            return [];
          }

          return (
            serviceRequests as ServiceRequestRecord[]
          )
            .map(
              mapServiceRequestToIssue,
            )
            .filter(
              (
                issue,
              ): issue is IssueItem =>
                issue !==
                null,
            );
        },
        [
          serviceRequests,
        ],
      );

    /* ========================================================
       DYNAMIC FEEDBACK

       API:

       serviceRequest.feedbackSummary
       serviceRequest.feedback
       requestor.firstName
       requestor.lastName
       room.roomName
       requestEtaDate
    ======================================================== */

    const mappedFeedback =
      useMemo<
        FeedbackItem[]
      >(() => {
        if (
          !Array.isArray(
            serviceRequests,
          )
        ) {
          return [];
        }

        return (
          serviceRequests as ServiceRequestRecord[]
        )
          .map(
            mapServiceRequestToFeedback,
          )
          .filter(
            (
              item,
            ): item is FeedbackItem =>
              item !==
              null,
          );
      }, [
        serviceRequests,
      ]);

    /* ========================================================
       TREND
    ======================================================== */

    const selectedTrend =
      useMemo<
        SatisfactionTrendItem[]
      >(() => {
        if (
          !satisfactionTrend
        ) {
          return [];
        }

        if (
          trendPeriod ===
          "14"
        ) {
          return (
            satisfactionTrend.last14Days ??
            []
          );
        }

        if (
          trendPeriod ===
          "28"
        ) {
          return (
            satisfactionTrend.last28Days ??
            []
          );
        }

        return (
          satisfactionTrend.last7Days ??
          []
        );
      }, [
        satisfactionTrend,
        trendPeriod,
      ]);

    /* ========================================================
       SELECTED PERIOD RATING
    ======================================================== */

    const selectedPeriodRating =
      useMemo(() => {
        if (
          selectedTrend.length ===
          0
        ) {
          return Number(
            happinessSummary?.avgRating ??
              0,
          );
        }

        let totalRating =
          0;

        let totalResponses =
          0;

        selectedTrend.forEach(
          (item) => {
            const responses =
              Number(
                item.responses,
              ) || 0;

            const rating =
              Number(
                item.avgRating,
              ) || 0;

            if (
              responses >
              0
            ) {
              totalRating +=
                rating *
                responses;

              totalResponses +=
                responses;
            }
          },
        );

        if (
          totalResponses ===
          0
        ) {
          return Number(
            happinessSummary?.avgRating ??
              0,
          );
        }

        return (
          totalRating /
          totalResponses
        );
      }, [
        selectedTrend,
        happinessSummary?.avgRating,
      ]);

    /* ========================================================
       TREND LABEL
    ======================================================== */

    const trendLabel =
      useMemo(() => {
        if (
          trendPeriod ===
          "14"
        ) {
          return "Last 14 Days";
        }

        if (
          trendPeriod ===
          "28"
        ) {
          return "Last 28 Days";
        }

        return "Last 7 Days";
      }, [
        trendPeriod,
      ]);

    /* ========================================================
       PG SELECT
    ======================================================== */

    const handlePgSelect = (
      pgId: number,
    ) => {
      const pg =
        pgInfoList.find(
          (item) =>
            Number(
              item.id,
            ) ===
            Number(
              pgId,
            ),
        );

      if (!pg) {
        return;
      }

      setSelectedPg(pg);
    };

    /* ========================================================
       RENDER
    ======================================================== */

    return (
      <PageShell
        noScroll
        bottomPad={0}
        className="resident-happiness-page"
      >
        <div className="flex h-full min-h-0 flex-col pb-[62px] sm:pb-[64px] lg:pb-[68px]">
          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="shrink-0">
            <div className="flex h-[21px] items-center justify-between sm:h-[24px] lg:h-[30px]">
              <div className="text-[14px] font-bold tracking-tight text-blue-600 sm:text-[16px] lg:text-[20px]">
                MyPG
              </div>

              <button
                type="button"
                className="relative flex h-5 w-5 items-center justify-center rounded-full text-slate-800 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
              >
                <Bell className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px] lg:h-[17px] lg:w-[17px]" />

                <span className="absolute right-0 top-0 flex h-[9px] min-w-[9px] items-center justify-center rounded-full bg-red-500 px-[2px] text-[5px] font-semibold text-white">
                  3
                </span>
              </button>
            </div>

            <div className="mt-0 flex items-center justify-between gap-1">
              <div className="flex min-w-0 items-center gap-1">
                <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-900 sm:text-[15px] lg:text-[20px]">
                  Resident
                  Happiness
                </h1>

                {(
                  aggregateLoading ||
                  serviceRequestsLoading
                ) && (
                  <span className="shrink-0 text-[5px] text-slate-400 sm:text-[7px]">
                    Updating...
                  </span>
                )}
              </div>

              <PgDropdown
                selectedPgId={
                  selectedPgId
                }
                onSelect={
                  handlePgSelect
                }
              />
            </div>

            {aggregateError && (
              <div className="mt-1 rounded-md bg-red-50 px-2 py-1 text-[6px] text-red-500 sm:text-[7px]">
                {
                  aggregateError
                }
              </div>
            )}

            {serviceRequestsError && (
              <div className="mt-1 rounded-md bg-red-50 px-2 py-1 text-[6px] text-red-500 sm:text-[7px]">
                {
                  serviceRequestsError
                }
              </div>
            )}
          </header>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section className="mt-1 grid shrink-0 grid-cols-4 gap-[3px] sm:mt-1 sm:gap-1 lg:mt-2 lg:gap-2">
            <StatCard
              icon={
                <Smile className="h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] lg:h-[13px] lg:w-[13px]" />
              }
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              label="Avg Rating"
              value={selectedPeriodRating.toFixed(
                1,
              )}
              suffix="/5"
              valueColor="text-emerald-600"
              footer={
                <span className="text-slate-500">
                  Selected
                  period
                </span>
              }
            />

            <StatCard
              icon={
                <AlertTriangle className="h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] lg:h-[13px] lg:w-[13px]" />
              }
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
              label="Open Issues"
              value={String(
                issueSummary?.open ??
                  0,
              )}
              valueColor="text-orange-600"
              footer={
                <span className="font-medium text-red-500">
                  {issueSummary?.overdue ??
                    0}{" "}
                  overdue
                </span>
              }
            />

            <StatCard
              icon={
                <Clock3 className="h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] lg:h-[13px] lg:w-[13px]" />
              }
              iconBg="bg-red-50"
              iconColor="text-red-500"
              label="Overdue"
              value={String(
                issueSummary?.overdue ??
                  0,
              )}
              valueColor="text-red-600"
              footer={
                <span className="text-slate-500">
                  current
                  issues
                </span>
              }
            />

            <StatCard
              icon={
                <CheckCircle2 className="h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] lg:h-[13px] lg:w-[13px]" />
              }
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              label="Resolved"
              value={String(
                happinessSummary?.resolvedThisWeek ??
                  0,
              )}
              valueColor="text-purple-600"
              footer={
                <span className="text-slate-500">
                  this week
                </span>
              }
            />
          </section>

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1 sm:mt-1 sm:gap-1 lg:mt-2 lg:gap-2">
            {/* ==================================================
                SATISFACTION TRENDS
            ================================================== */}

            <section className="shrink-0 rounded-md border border-slate-100 bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(15,23,42,0.035)] sm:px-2 sm:py-1.5 lg:rounded-lg lg:px-3 lg:py-2.5">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-0.5">
                    <h2 className="text-[9px] font-semibold text-slate-900 sm:text-[10px] lg:text-[14px]">
                      Satisfaction
                      Trends
                    </h2>

                    <Info className="h-[8px] w-[8px] text-slate-400 sm:h-[9px] sm:w-[9px] lg:h-[11px] lg:w-[11px]" />
                  </div>

                  <div className="mt-[1px] flex items-baseline gap-0.5">
                    <span className="text-[17px] font-bold leading-none text-emerald-600 sm:text-[19px] lg:text-[25px]">
                      {selectedPeriodRating.toFixed(
                        1,
                      )}
                    </span>

                    <span className="text-[6px] font-medium text-slate-600 sm:text-[7px] lg:text-[9px]">
                      /5
                    </span>

                    <span className="ml-0.5 text-[6px] text-slate-500 sm:text-[7px] lg:text-[9px]">
                      Avg Rating
                    </span>
                  </div>

                  <p className="mt-[1px] text-[6px] text-slate-500 sm:text-[7px] lg:text-[9px]">
                    {selectedTrend.reduce(
                      (
                        total,
                        item,
                      ) =>
                        total +
                        (Number(
                          item.responses,
                        ) ||
                          0),
                      0,
                    )}{" "}
                    responses
                  </p>
                </div>

                {/* TREND DROPDOWN */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setTrendDropdownOpen(
                        (
                          value,
                        ) =>
                          !value,
                      )
                    }
                    className="flex h-[20px] shrink-0 items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 text-[6px] font-medium text-slate-700 sm:h-[22px] sm:px-2 sm:text-[7px] lg:h-[28px] lg:px-3 lg:text-[9px]"
                  >
                    {
                      trendLabel
                    }

                    <ChevronDown className="h-[8px] w-[8px] text-slate-400 sm:h-[9px] sm:w-[9px] lg:h-[10px] lg:w-[10px]" />
                  </button>

                  {trendDropdownOpen && (
                    <div className="absolute right-0 top-full z-40 mt-1 min-w-[90px] rounded-md border border-slate-200 bg-white p-1 shadow-lg sm:min-w-[110px]">
                      {[
                        {
                          value:
                            "7" as TrendPeriod,
                          label:
                            "Last 7 Days",
                        },
                        {
                          value:
                            "14" as TrendPeriod,
                          label:
                            "Last 14 Days",
                        },
                        {
                          value:
                            "28" as TrendPeriod,
                          label:
                            "Last 28 Days",
                        },
                      ].map(
                        (
                          option,
                        ) => (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() => {
                              setTrendPeriod(
                                option.value,
                              );

                              setTrendDropdownOpen(
                                false,
                              );
                            }}
                            className={cn(
                              "flex w-full rounded px-2 py-1.5 text-left text-[6px] sm:text-[7px] lg:text-[8px]",
                              trendPeriod ===
                                option.value
                                ? "bg-blue-50 font-semibold text-blue-600"
                                : "text-slate-700 hover:bg-slate-50",
                            )}
                          >
                            {
                              option.label
                            }
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <SatisfactionChart
                points={
                  selectedTrend
                }
              />
            </section>

            {/* ==================================================
                LOWER CONTENT
            ================================================== */}

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-1 sm:gap-1 lg:grid-cols-2 lg:gap-2">
              <OpenIssues
                issues={
                  mappedIssues
                }
                loading={
                  serviceRequestsLoading
                }
                expanded={
                  issuesExpanded
                }
                onToggle={() => {
                  setIssuesExpanded(
                    (
                      previous,
                    ) =>
                      !previous,
                  );

                  setFeedbackExpanded(
                    false,
                  );
                }}
              />

              <RecentFeedback
                feedback={
                  mappedFeedback
                }
                loading={
                  serviceRequestsLoading
                }
                expanded={
                  feedbackExpanded
                }
                onToggle={() => {
                  setFeedbackExpanded(
                    (
                      previous,
                    ) =>
                      !previous,
                  );

                  setIssuesExpanded(
                    false,
                  );
                }}
              />
            </div>
          </div>
        </div>
      </PageShell>
    );
  };

export default ResidentHappiness;