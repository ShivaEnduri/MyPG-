



import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplet,
  Pencil,
  Sparkles,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { useIssuesAndResidentHappinessStore } from "@/app/shared/store/issuesAndHappinessStore";
import { useServiceRequestsStore } from "@/app/shared/store/useServiceRequestsStore";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useUserRolesStore } from "@/app/shared/store/userRolesStore";
import {
  updatePgServiceRequest,
} from "@/app/shared/services/api/commonApiServices";

import SuccessModal from "@/ui/Shared/SuccessModal";

/* ============================================================
   TYPES
============================================================ */

type Status =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Overdue";

type Priority =
  | "High"
  | "Medium"
  | "Low";

type Category =
  | "Plumbing"
  | "Wi-Fi"
  | "Housekeeping"
  | "Electrical"
  | "Water";

interface ServiceRequest {
  id: string;
  category: Category;
  room: string;
  title: string;
  assignee: string;
  assignedUserId: number | null;
  
  requestedBy: string;
  requestedById: number | null;
  etaDate: string | null;
  status: Status;
  serviceStatusId: number;
  priority?: Priority;
  overdueDays: number;
}

interface Escalation {
  id: string;
  category: Category;
  room: string;
  title: string;
  assignee: string;
  requestedBy: string;
  requestedById: number | null;
  etaDate: string | null;
  overdueDays: number;
}

/* ============================================================
   CONSTANTS
============================================================ */

const TABS = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
] as const;

type Tab = (typeof TABS)[number];

const PREVIEW_REQUESTS = 5;
const PREVIEW_ESCALATIONS = 2;

/* ============================================================
   STATUS MAP
============================================================ */

const STATUS_MAP: Record<number, Status> = {
  11: "Open",
  12: "In Progress",
  13: "Resolved",
};

/* ============================================================
   CATEGORY HELPERS
============================================================ */

function getCategory(
  title = "",
): Category {
  const value = title.toLowerCase();

  if (
    value.includes("plumb") ||
    value.includes("tap") ||
    value.includes("washbasin") ||
    value.includes("pipe")
  ) {
    return "Plumbing";
  }

  if (
    value.includes("wi-fi") ||
    value.includes("wifi") ||
    value.includes("internet") ||
    value.includes("router")
  ) {
    return "Wi-Fi";
  }

  if (
    value.includes("housekeep") ||
    value.includes("clean") ||
    value.includes("janitor") ||
    value.includes("dust")
  ) {
    return "Housekeeping";
  }

  if (
    value.includes("electric") ||
    value.includes("fan") ||
    value.includes("switch") ||
    value.includes("light") ||
    value.includes("power")
  ) {
    return "Electrical";
  }

  if (
    value.includes("water") ||
    value.includes("wash") ||
    value.includes("shower")
  ) {
    return "Water";
  }

  return "Plumbing";
}

/* ============================================================
   STATUS HELPER
============================================================ */

function getStatus(
  serviceStatus: number,
  overdueDays: number,
): Status {
  const normalizedStatus = Number(serviceStatus);

  /*
   * Resolved always takes priority over overdue.
   *
   * A request may have been overdue before it was resolved,
   * but once service_status = 13, it is a resolved request.
   */
  if (normalizedStatus === 13) {
    return "Resolved";
  }

  /*
   * Only unresolved requests can be overdue.
   */
  if (Number(overdueDays) > 0) {
    return "Overdue";
  }

  return (
    STATUS_MAP[normalizedStatus] ??
    "Open"
  );
}

/* ============================================================
   GENERIC ID HELPER

   Never allows [object Object] to reach UI.
============================================================ */

function getIdValue(
  value: any,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value === "object"
  ) {
    const id =
      value.id ??
      value.userId ??
      value.user_id ??
      value.guestId ??
      value.guest_id;

    if (
      id !== null &&
      id !== undefined &&
      id !== ""
    ) {
      return String(id);
    }

    return null;
  }

  return String(value);
}

/* ============================================================
   NAME FROM OBJECT

   Supports both camelCase and snake_case.
============================================================ */

function getPersonName(
  person: any,
): string | null {
  if (
    !person ||
    typeof person !== "object"
  ) {
    return null;
  }

  const firstName =
    person.firstName ??
    person.first_name ??
    "";

  const lastName =
    person.lastName ??
    person.last_name ??
    "";

  const fullName =
    `${String(firstName).trim()} ${String(
      lastName,
    ).trim()}`.trim();

  return fullName || null;
}

/* ============================================================
   DATE HELPER
============================================================ */

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/* ============================================================
   ROOM HELPER
============================================================ */

function getRoomName(
  room: any,
): string {
  if (!room) {
    return "—";
  }

  return (
    room.roomNumber ??
    room.roomName ??
    room.name ??
    room.number ??
    room.roomNo ??
    "—"
  ).toString();
}

/* ============================================================
   REQUESTED BY HELPER
============================================================ */

function getRequestedBy(
  service: any,
  record: any,
): {
  name: string;
  id: number | null;
} {
  /*
   * Backend response:
   *
   * record: {
   *   requestor: {
   *     id: 779,
   *     firstName: "Shiva Kumar",
   *     lastName: "Enduri"
   *   },
   *
   *   serviceRequest: {
   *     requestorInfo: 779
   *   }
   * }
   */

  // The backend now gives the complete requestor object
  // directly on the record.
  const person =
    record?.requestor ??
    service?.requestor ??
    null;

  // Get requestor ID
  const idValue =
    person?.id ??
    service?.requestorInfo ??
    service?.requestor_info ??
    record?.requestorInfo ??
    record?.requestor_info ??
    null;

  const extractedId = getIdValue(idValue);

  const parsedId =
    extractedId !== null
      ? Number(extractedId)
      : null;

  const id =
    parsedId !== null &&
    Number.isFinite(parsedId)
      ? parsedId
      : null;

  // Get name from requestor object
  const name = getPersonName(person);

  if (name) {
    return {
      name,
      id,
    };
  }

  return {
    name: "—",
    id,
  };
}

/* ============================================================
   ASSIGNEE HELPER
   ============================================================ */

function getAssignee(
  service: any,
  record: any,
): string {
  /*
   * Backend now returns:
   *
   * request_assigned_to       -> ID
   * request_assigned_to_data  -> user object
   *
   * Example:
   * {
   *   request_assigned_to: 644,
   *   request_assigned_to_data: {
   *     id: 644,
   *     first_name: "Arjun",
   *     last_name: "Kumar"
   *   }
   * }
   */

  const assignedPerson =
    service?.requestAssignedToData ??
    service?.request_assigned_to_data ??
    record?.requestAssignedToData ??
    record?.request_assigned_to_data ??
    null;

  /*
   * First priority:
   * backend's populated assigned-user object.
   */
  const assignedName =
    getPersonName(assignedPerson);

  if (assignedName) {
    return assignedName;
  }

  /*
   * Fallback for APIs that may return the assigned
   * user directly as an object.
   */
  const assigned =
    service?.requestAssignedTo ??
    service?.request_assigned_to ??
    record?.requestAssignedTo ??
    record?.request_assigned_to ??
    null;

  if (
    assigned === null ||
    assigned === undefined ||
    assigned === ""
  ) {
    return "Unassigned";
  }

  if (
    typeof assigned === "object"
  ) {
    const directName =
      getPersonName(assigned);

    if (directName) {
      return directName;
    }

    return "Unassigned";
  }

  /*
   * If only an ID is available, don't expose the ID
   * in the UI. Show Unassigned instead.
   */
  return "Unassigned";
}

/* ============================================================
   ASSIGNED USER ID
============================================================ */

function getAssignedUserId(
  service: any,
  record: any,
): number | null {
  const assigned =
    service?.requestAssignedTo ??
    service?.request_assigned_to ??
    record?.requestAssignedTo ??
    record?.request_assigned_to ??
    null;

  if (
    assigned === null ||
    assigned === undefined ||
    assigned === ""
  ) {
    return null;
  }

  if (typeof assigned === "object") {
    const id =
      assigned.userId ??
      assigned.user_id ??
      assigned.id ??
      null;

    const parsed = Number(id);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  const parsed = Number(assigned);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

/* ============================================================
   TRANSFORM API DATA
============================================================ */

function transformServiceRequests(
  records: any[],
): ServiceRequest[] {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      const service =
        record?.serviceRequest ??
        record;

      if (!service) {
        return null;
      }

      const id = service.id;

      if (
        id === undefined ||
        id === null
      ) {
        return null;
      }

      const overdueDays =
        Number(
          service.overdueDays ??
            service.overdue_days ??
            0,
        );

     const title =
  service.serviceTitle ??
  service.service_title ??
  "Service request";

const requestedByInfo =
  getRequestedBy(
    service,
    record,
  );

const requestedBy =
  requestedByInfo.name;

const requestedById =
  requestedByInfo.id;

const room =
  getRoomName(
    record?.room ??
      service?.room,
  );

const etaDate =
  service.requestEtaDate ??
  service.request_eta_date ??
  record?.requestEtaDate ??
  record?.request_eta_date ??
  null;

return {
  id: String(id),

  category: getCategory(title),

  room,

  title,

  assignee: getAssignee(service, record),

  assignedUserId: getAssignedUserId(
    service,
    record,
  ),

  requestedBy,

  requestedById,

  etaDate,

  serviceStatusId: Number(
    service.serviceStatus ??
    service.service_status ??
    11
  ),

  status: getStatus(
    Number(
      service.serviceStatus ??
      service.service_status ??
      11
    ),
    overdueDays,
  ),

  overdueDays,
};
    })
    .filter(
      (
        item,
      ): item is ServiceRequest =>
        item !== null,
    );
}

/* ============================================================
   CATEGORY STYLES
============================================================ */

const CATEGORY_STYLE: Record<
  Category,
  {
    icon: FC<{
      className?: string;
    }>;
    bg: string;
    fg: string;
  }
> = {
  Plumbing: {
    icon: Wrench,
    bg: "bg-sky-50",
    fg: "text-sky-500",
  },

  "Wi-Fi": {
    icon: Wifi,
    bg: "bg-violet-50",
    fg: "text-violet-500",
  },

  Housekeeping: {
    icon: Sparkles,
    bg: "bg-emerald-50",
    fg: "text-emerald-500",
  },

  Electrical: {
    icon: Zap,
    bg: "bg-amber-50",
    fg: "text-amber-500",
  },

  Water: {
    icon: Droplet,
    bg: "bg-blue-50",
    fg: "text-blue-500",
  },
};

/* ============================================================
   BADGE STYLES
============================================================ */

const BADGE_STYLE: Record<
  Status | Priority,
  string
> = {
  High:
    "bg-red-50 text-red-600",

  Medium:
    "bg-amber-50 text-amber-600",

  Low:
    "bg-slate-100 text-slate-600",

  Open:
    "bg-blue-50 text-blue-600",

  "In Progress":
    "bg-violet-50 text-violet-600",

  Resolved:
    "bg-emerald-50 text-emerald-600",

  Overdue:
    "bg-red-50 text-red-600",
};

/* ============================================================
   AVATAR
============================================================ */

const AVATAR_COLORS = [
  "bg-orange-200 text-orange-800",
  "bg-blue-200 text-blue-800",
  "bg-emerald-200 text-emerald-800",
  "bg-violet-200 text-violet-800",
  "bg-pink-200 text-pink-800",
];

function hashColor(
  name: string,
) {
  if (!name) {
    return AVATAR_COLORS[0];
  }

  const idx =
    name.charCodeAt(0) %
    AVATAR_COLORS.length;

  return AVATAR_COLORS[idx];
}

const Avatar: FC<{
  name: string;
}> = ({ name }) => (
  <div
    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[7px] font-semibold leading-none ${hashColor(
      name,
    )}`}
  >
    {name?.charAt(0)?.toUpperCase() ||
      "?"}
  </div>
);

/* ============================================================
   CATEGORY ICON
============================================================ */

const CategoryIcon: FC<{
  category: Category;
}> = ({ category }) => {
  const {
    icon: Icon,
    bg,
    fg,
  } = CATEGORY_STYLE[category];

  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${bg}`}
    >
      <Icon
        className={`h-2.5 w-2.5 ${fg}`}
      />
    </div>
  );
};

/* ============================================================
   BADGE
============================================================ */

const Badge: FC<{
  label: Status | Priority;
}> = ({ label }) => (
  <span
    className={`inline-flex max-w-full items-center justify-center truncate whitespace-nowrap rounded px-1.5 py-0.5 text-[7px] font-medium leading-none ${BADGE_STYLE[label]}`}
  >
    {label}
  </span>
);

/* ============================================================
   PERSON CELL
============================================================ */

const PersonCell: FC<{
  name: string;
}> = ({ name }) => (
  <div className="flex min-w-0 items-center gap-1">
    <Avatar name={name} />

    <p
      title={name}
      className="min-w-0 truncate text-[8px] font-medium text-slate-700 xl:text-[9px]"
    >
      {name}
    </p>
  </div>
);

/* ============================================================
   TABLE GRIDS

   Reduced gaps and min widths so the final Action column
   always remains visible.

   md = tablet
   lg/xl = desktop
============================================================ */

const REQUEST_ROW_GRID =
  "grid grid-cols-[16px_minmax(0,1.7fr)_minmax(42px,.65fr)_minmax(58px,.75fr)_minmax(50px,.65fr)_minmax(52px,.65fr)_40px] items-center gap-x-0.5";
const ESCALATION_ROW_GRID =
  "grid grid-cols-[18px_minmax(0,2fr)_minmax(48px,.8fr)_minmax(70px,1fr)_minmax(62px,.8fr)_62px] gap-x-1 md:gap-x-1.5 xl:gap-x-2";

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
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[8px] font-medium text-slate-700 shadow-sm md:px-2.5 md:text-[9px] xl:px-3"
      >
        <span className="max-w-[110px] truncate md:max-w-[140px] xl:max-w-[160px]">
          {selectedPg?.pg_name ??
            "Select PG"}
        </span>

        <ChevronDown className="h-2.5 w-2.5 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-[180px] min-w-[150px] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg">
          {loading &&
          pgInfoList.length ===
            0 ? (
            <div className="px-2 py-2 text-center text-[8px] text-slate-400">
              Loading...
            </div>
          ) : pgInfoList.length ===
            0 ? (
            <div className="px-2 py-2 text-center text-[8px] text-slate-400">
              No PGs found
            </div>
          ) : (
            pgInfoList.map((pg) => {
              const pgId =
                Number(pg.id);

              const isSelected =
                pgId ===
                Number(
                  selectedPgId,
                );

              return (
                <button
                  key={pgId}
                  type="button"
                  onClick={() => {
                    onSelect(pgId);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded px-2 py-1.5 text-left text-[8px] md:text-[9px] ${
                    isSelected
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">
                    {pg.pg_name ??
                      `PG ${pgId}`}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   STATS
============================================================ */

const STATS = [
  {
    label: "Open",
    sub: "requests",
    icon: AlertTriangle,
    bg: "bg-orange-100",
    fg: "text-orange-500",
    num: "text-orange-500",
  },

  {
    label: "Overdue",
    sub: "requests",
    icon: Clock,
    bg: "bg-red-100",
    fg: "text-red-500",
    num: "text-red-500",
  },

  {
    label: "High Priority",
    sub: "requests",
    icon: ArrowUpRight,
    bg: "bg-violet-100",
    fg: "text-violet-500",
    num: "text-violet-500",
  },

  {
    label: "Resolved Today",
    sub: "requests",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    fg: "text-emerald-500",
    num: "text-emerald-500",
  },
] as const;

const StatsRow: FC<{
  summary?: {
    open?: number;
    overdue?: number;
    highPriority?: number;
    resolvedToday?: number;
  };

  requests: ServiceRequest[];
}> = ({
  summary,
  requests,
}) => {
  const open =
    summary?.open ??
    requests.filter(
      (request) =>
        request.status ===
        "Open",
    ).length;

  const overdue =
    summary?.overdue ??
    requests.filter(
      (request) =>
        request.status ===
        "Overdue",
    ).length;

  const highPriority =
    summary?.highPriority ?? 0;

  const resolvedToday =
    summary?.resolvedToday ?? 0;

  const values = [
    open,
    overdue,
    highPriority,
    resolvedToday,
  ];

  return (
    <div className="grid flex-none grid-cols-4 gap-1">
      {STATS.map((s, index) => (
        <div
          key={s.label}
          className="flex flex-col items-center justify-center rounded-md border border-slate-100 bg-white px-1 py-1 shadow-sm"
        >
          <div
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${s.bg}`}
          >
            <s.icon
              className={`h-2 w-2 ${s.fg}`}
            />
          </div>

          <p className="text-[7px] font-medium leading-tight text-slate-600 md:text-[8px]">
            {s.label}
          </p>

          <p
            className={`text-sm font-bold leading-none ${s.num}`}
          >
            {values[index]}
          </p>

          <p className="text-[6px] text-slate-400">
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   TABS
============================================================ */

const TabBar: FC<{
  active: Tab;
  onChange: (
    t: Tab,
  ) => void;
}> = ({
  active,
  onChange,
}) => (
  <div className="flex flex-none items-center gap-0.5 rounded-md border border-slate-100 bg-white p-0.5 shadow-sm md:gap-1 md:p-1">
    {TABS.map((t) => (
      <button
        key={t}
        type="button"
        onClick={() =>
          onChange(t)
        }
        className={`flex-1 rounded px-1.5 py-1 text-[7px] font-medium transition-colors md:px-3 md:py-1.5 md:text-[9px] xl:text-[10px] ${
          active === t
            ? "bg-blue-50 text-blue-600"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        {t}
      </button>
    ))}
  </div>
);

/* ============================================================
   TABLE HEADER
============================================================ */

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
      className={`min-w-0 truncate text-[7px] font-semibold uppercase tracking-wide text-slate-500 md:text-[8px] xl:text-[9px] ${
        center
          ? "text-center"
          : right
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   REQUEST TABLE HEADER
============================================================ */

const RequestTableHeader: FC =
  () => (
    <div
      className={`${REQUEST_ROW_GRID} mb-0.5 items-center border-b border-slate-100 pb-1`}
    >
      <div />

      <TableHeader>
        Request
      </TableHeader>

      <TableHeader>
        Requested By
      </TableHeader>

      <TableHeader>
        Assigned To
      </TableHeader>

      <TableHeader>
        ETA
      </TableHeader>

      <TableHeader center>
        Status
      </TableHeader>

      <TableHeader center>
        Action
      </TableHeader>
    </div>
  );

/* ============================================================
   REQUEST ROW
   Tablet + Desktop = TABLE
   Mobile = COMPACT CARD
============================================================ */

const RequestRow: FC<{
  item: ServiceRequest;
  onEdit: (
    item: ServiceRequest,
  ) => void;
}> = ({
  item,
  onEdit,
}) => (
  <>
    {/* ======================================================
        TABLET + DESKTOP
    ====================================================== */}

    <div
      className={`${REQUEST_ROW_GRID} hidden items-center border-b border-slate-50 py-1.5 last:border-b-0 md:grid md:py-2`}
    >
      {/* Category */}
      <CategoryIcon
        category={item.category}
      />

      {/* Request */}
      <div className="min-w-0 overflow-hidden">
        <p className="truncate text-[8px] font-semibold text-slate-800 md:text-[9px] xl:text-[10px]">
          {item.title}
        </p>

        <p className="mt-0.5 truncate text-[7px] text-slate-400 md:text-[8px] xl:text-[9px]">
          Room {item.room}
        </p>
      </div>

      {/* Requested By */}
      <div className="min-w-0 overflow-hidden">
        <p
          title={item.requestedBy}
          className="truncate text-[7px] font-medium text-slate-700 md:text-[8px] xl:text-[9px]"
        >
          {item.requestedBy}
        </p>
      </div>

      {/* Assigned To - DISPLAY ONLY */}
      <div className="min-w-0 overflow-hidden">
        <PersonCell
          name={item.assignee}
        />
      </div>

      {/* ETA - DISPLAY ONLY */}
      <div className="min-w-0 overflow-hidden">
        <p
          className={`truncate text-[7px] font-medium md:text-[8px] xl:text-[9px] ${
            item.overdueDays > 0
              ? "text-red-500"
              : "text-slate-600"
          }`}
        >
          {formatDate(
            item.etaDate,
          )}
        </p>
      </div>

      {/* Status - DISPLAY ONLY */}
      <div className="flex min-w-0 items-center justify-center overflow-hidden">
        <Badge
          label={item.status}
        />
      </div>

      {/* Action */}
      <div className="flex min-w-0 items-center justify-center">
        <button
          type="button"
          title="Update request"
          aria-label="Update request"
          onClick={() =>
            onEdit(item)
          }
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 md:h-6 md:w-6"
        >
          <Pencil className="h-3 w-3 md:h-3.5 md:w-3.5" />
        </button>
      </div>
    </div>

    {/* ======================================================
        MOBILE ONLY
    ====================================================== */}

    <div className="flex flex-col gap-1.5 border-b border-slate-100 py-1.5 last:border-b-0 md:hidden">
      {/* Top */}
      <div className="flex min-w-0 items-center gap-1.5">
        <CategoryIcon
          category={item.category}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[8px] font-semibold text-slate-800">
            {item.title}
          </p>

          <p className="truncate text-[6px] text-slate-400">
            Room {item.room}
          </p>
        </div>

        <Badge
          label={item.status}
        />

        <button
          type="button"
          title="Update request"
          aria-label="Update request"
          onClick={() =>
            onEdit(item)
          }
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-blue-500 hover:bg-blue-50"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-x-2">
        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            Requested
          </p>

          <p className="truncate text-[7px] font-medium text-slate-700">
            {item.requestedBy}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            Assigned
          </p>

          <p
            title={item.assignee}
            className="truncate text-[7px] font-medium text-slate-700"
          >
            {item.assignee}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            ETA
          </p>

          <p
            className={`truncate text-[7px] font-medium ${
              item.overdueDays > 0
                ? "text-red-500"
                : "text-slate-700"
            }`}
          >
            {formatDate(
              item.etaDate,
            )}
          </p>
        </div>
      </div>
    </div>
  </>
);

/* ============================================================
   ESCALATION HEADER
============================================================ */

const EscalationTableHeader: FC =
  () => (
    <div
      className={`${ESCALATION_ROW_GRID} mb-0.5 hidden items-center border-b border-slate-100 pb-1 md:grid`}
    >
      <div />

      <TableHeader>
        Request
      </TableHeader>

      <TableHeader>
        Requested By
      </TableHeader>

      <TableHeader>
        Assigned To
      </TableHeader>

      <TableHeader>
        ETA
      </TableHeader>

      <TableHeader center>
        Action
      </TableHeader>
    </div>
  );

/* ============================================================
   ESCALATE BUTTON
============================================================ */

const EscalateButton: FC =
  () => (
    <button
      type="button"
      title="Escalate"
      className="inline-flex h-5 shrink-0 items-center justify-center gap-0.5 rounded-md bg-blue-500 px-1.5 text-[6px] font-semibold text-white transition hover:bg-blue-600 md:h-6 md:px-2 md:text-[7px] xl:text-[8px]"
    >
      <ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3" />

      <span>
        Escalate
      </span>
    </button>
  );

/* ============================================================
   ESCALATION ROW
============================================================ */

const EscalationRow: FC<{
  item: Escalation;
}> = ({ item }) => (
  <>
    {/* ======================================================
        TABLET + DESKTOP
    ====================================================== */}

    <div
      className={`${ESCALATION_ROW_GRID} hidden items-center border-b border-slate-50 py-1.5 last:border-b-0 md:grid md:py-2`}
    >
      {/* Alert */}
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-50">
        <AlertTriangle className="h-2.5 w-2.5 text-red-500" />
      </div>

      {/* Request */}
      <div className="min-w-0 overflow-hidden">
        <p className="truncate text-[8px] font-semibold text-slate-800 md:text-[9px] xl:text-[10px]">
          {item.title}
        </p>

        <p className="mt-0.5 truncate text-[7px] text-red-500 md:text-[8px] xl:text-[9px]">
          Room {item.room} • Overdue by{" "}
          {item.overdueDays}{" "}
          {item.overdueDays ===
          1
            ? "day"
            : "days"}
        </p>
      </div>

      {/* Requested By */}
      <div className="min-w-0 overflow-hidden">
        <p
          title={item.requestedBy}
          className="truncate text-[7px] font-medium text-slate-700 md:text-[8px] xl:text-[9px]"
        >
          {item.requestedBy}
        </p>
      </div>

      {/* Assigned */}
      <div className="min-w-0 overflow-hidden">
        <PersonCell
          name={item.assignee}
        />
      </div>

      {/* ETA */}
      <div className="min-w-0 overflow-hidden">
        <p className="truncate text-[7px] font-medium text-red-500 md:text-[8px] xl:text-[9px]">
          {formatDate(
            item.etaDate,
          )}
        </p>
      </div>

      {/* Escalate */}
      <div className="flex min-w-0 items-center justify-center">
        <EscalateButton />
      </div>
    </div>

    {/* ======================================================
        MOBILE
    ====================================================== */}

    <div className="flex flex-col gap-1.5 border-b border-slate-100 py-1.5 last:border-b-0 md:hidden">
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-50">
          <AlertTriangle className="h-2.5 w-2.5 text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[8px] font-semibold text-slate-800">
            {item.title}
          </p>

          <p className="truncate text-[6px] text-red-500">
            Room {item.room} • Overdue by{" "}
            {item.overdueDays}{" "}
            {item.overdueDays ===
            1
              ? "day"
              : "days"}
          </p>
        </div>

        <EscalateButton />
      </div>

      <div className="grid grid-cols-3 gap-x-2">
        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            Requested
          </p>

          <p className="truncate text-[7px] font-medium text-slate-700">
            {item.requestedBy}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            Assigned
          </p>

          <p
            title={item.assignee}
            className="truncate text-[7px] font-medium text-slate-700"
          >
            {item.assignee}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[5px] uppercase tracking-wide text-slate-400">
            ETA
          </p>

          <p className="truncate text-[7px] font-medium text-red-500">
            {formatDate(
              item.etaDate,
            )}
          </p>
        </div>
      </div>
    </div>
  </>
);

/* ============================================================
   SECTION
============================================================ */

interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
  showViewAll?: boolean;
}

const Section: FC<
  React.PropsWithChildren<SectionProps>
> = ({
  title,
  expanded,
  onToggle,
  className = "",
  showViewAll = true,
  children,
}) => (
  <div
    className={`flex min-h-0 min-w-0 flex-1 flex-col rounded-md border border-slate-100 bg-white p-1.5 shadow-sm md:p-2 xl:p-3 ${className}`}
  >
    {/* Header */}
    <div className="mb-1 flex flex-none items-center justify-between md:mb-1.5">
      <h2 className="text-[8px] font-bold text-slate-800 md:text-[10px] xl:text-xs">
        {title}
      </h2>

      {showViewAll && (
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-0.5 text-[6px] font-semibold text-blue-600 hover:text-blue-700 md:text-[8px] xl:text-[10px]"
        >
          {expanded ? (
            <>
              Show less
              <X className="h-2 w-2 md:h-2.5 md:w-2.5" />
            </>
          ) : (
            <>
              View All
              <ChevronRight className="h-2 w-2 md:h-2.5 md:w-2.5" />
            </>
          )}
        </button>
      )}
    </div>

    {/* Content */}
    <div
      className={`min-h-0 min-w-0 flex-1 overflow-x-hidden ${
        expanded
          ? "overflow-y-auto pr-0.5"
          : "overflow-hidden"
      }`}
    >
      {children}
    </div>
  </div>
);

/* ============================================================
   UPDATE SERVICE REQUEST MODAL
============================================================ */

interface UpdateServiceRequestModalProps {
  open: boolean;
  request: ServiceRequest | null;
  staffUsers: any[];
  staffLoading: boolean;
  saving: boolean;

  assignedUserId: string;
  etaDate: string;
  statusId: string;

  onAssignedChange: (
    value: string,
  ) => void;

  onEtaChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: string,
  ) => void;

  onSave: () => void;
  onClose: () => void;
}

const UpdateServiceRequestModal: FC<
  UpdateServiceRequestModalProps
> = ({
  open,
  request,
  staffUsers,
  staffLoading,
  saving,
  assignedUserId,
  etaDate,
  statusId,
  onAssignedChange,
  onEtaChange,
  onStatusChange,
  onSave,
  onClose,
}) => {
  if (!open || !request) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Update Service Request
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {request.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ASSIGNED TO */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Assigned To
          </label>

          <select
            value={assignedUserId}
            onChange={(e) =>
              onAssignedChange(
                e.target.value,
              )
            }
            disabled={
              saving ||
              staffLoading
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            <option value="">
              Unassigned
            </option>

            {staffUsers.map(
              (staff) => {
                const userId =
                  Number(
                    staff.user_id,
                  );

                const name =
                  [
                    staff.first_name,
                    staff.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")
                    .trim() ||
                  `User ${userId}`;

                return (
                  <option
                    key={userId}
                    value={String(
                      userId,
                    )}
                  >
                    {name}
                  </option>
                );
              },
            )}
          </select>

          {staffLoading && (
            <p className="mt-1 text-[10px] text-slate-400">
              Loading staff...
            </p>
          )}
        </div>

        {/* ETA */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            ETA
          </label>

          <input
            type="date"
            value={etaDate}
            onChange={(e) =>
              onEtaChange(
                e.target.value,
              )
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </div>

        {/* STATUS */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Status
          </label>

          <select
            value={statusId}
            onChange={(e) =>
              onStatusChange(
                e.target.value,
              )
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            <option value="11">
              Open
            </option>

            <option value="12">
              In Progress
            </option>

            <option value="13">
              Resolved
            </option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN DASHBOARD
============================================================ */

export const IssuesDashboard: FC =
  () => {
    const [tab, setTab] =
      useState<Tab>("All");

    const [
      requestsExpanded,
      setRequestsExpanded,
    ] = useState(false);

    const [
      escalationsExpanded,
      setEscalationsExpanded,
    ] = useState(false);


    const [
  editingRequest,
  setEditingRequest,
] =
  useState<ServiceRequest | null>(
    null,
  );

const [
  editAssignedUserId,
  setEditAssignedUserId,
] =
  useState("");

const [
  editEtaDate,
  setEditEtaDate,
] = useState("");

const [
  editStatusId,
  setEditStatusId,
] = useState("11");

const [
  updateSaving,
  setUpdateSaving,
] = useState(false);

const [
  successModalOpen,
  setSuccessModalOpen,
] = useState(false);

const [
  successMessage,
  setSuccessMessage,
] = useState("");

    /* ========================================================
       AUTH
    ======================================================== */

    const { user } = useAuth();

    const pgOwnerId = user?.id;

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

    /* ========================================================
       SELECTED PG
    ======================================================== */

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
    ======================================================== */

    const serviceRequestData =
      useServiceRequestsStore(
        (state) =>
          state.data,
      );

    const serviceRequestLoading =
      useServiceRequestsStore(
        (state) =>
          state.loading,
      );

    const serviceRequestError =
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
   STAFF / ROLE USERS
======================================================== */

const userRolesList =
  useUserRolesStore(
    (state) =>
      state.userRolesList,
  );

const userRolesLoading =
  useUserRolesStore(
    (state) =>
      state.loading,
  );

const fetchUserRoles =
  useUserRolesStore(
    (state) =>
      state.fetchUserRoles,
  );

    /* ========================================================
       FETCH OWNER PGs
    ======================================================== */

    useEffect(() => {
      const ownerId =
        Number(pgOwnerId);

      if (
        !Number.isFinite(
          ownerId,
        ) ||
        ownerId <= 0
      ) {
        return;
      }

      if (
        pgInfoList.length > 0
      ) {
        return;
      }

      fetchPgInfo({
        pg_owner: ownerId,
      });
    }, [
      pgOwnerId,
      pgInfoList.length,
      fetchPgInfo,
    ]);

    /* ========================================================
       SELECT FIRST PG
    ======================================================== */

    useEffect(() => {
      if (
        pgInfoList.length ===
        0
      ) {
        return;
      }

      const currentSelectionExists =
        selectedPgId !== null &&
        selectedPgId !==
          undefined &&
        String(selectedPgId) !== "" &&
        pgInfoList.some(
          (pg) =>
            Number(pg.id) ===
            Number(
              selectedPgId,
            ),
        );

      if (
        currentSelectionExists
      ) {
        return;
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
      const pgId =
        Number(selectedPgId);

      if (
        selectedPgId === null ||
        selectedPgId ===
          undefined ||
        String(selectedPgId) === "" ||
        !Number.isFinite(pgId) ||
        pgId <= 0
      ) {
        return;
      }

      fetchAggregates(pgId);
    }, [
      selectedPgId,
      fetchAggregates,
    ]);

    /* ========================================================
       FETCH SERVICE REQUESTS
    ======================================================== */

    useEffect(() => {
      const pgId =
        Number(selectedPgId);

      if (
        selectedPgId === null ||
        selectedPgId ===
          undefined ||
        String(selectedPgId) === "" ||
        !Number.isFinite(pgId) ||
        pgId <= 0
      ) {
        return;
      }

      fetchServiceRequests(
        pgId,
      );
    }, [
      selectedPgId,
      fetchServiceRequests,
    ]);


    useEffect(() => {
  fetchUserRoles({
    role_id: 5,
  });
}, [
  fetchUserRoles,
]);


const staffUsers =
  useMemo(
    () =>
      userRolesList.filter(
        (user) =>
          Number(
            user.role_id,
          ) === 5 &&
          Number(
            user.is_active,
          ) !== 0,
      ),
    [userRolesList],
  );

    /* ========================================================
       TRANSFORM
    ======================================================== */

    const requests =
      useMemo(
        () =>
          transformServiceRequests(
            serviceRequestData,
          ),
        [serviceRequestData],
      );

    /* ========================================================
       FILTER
    ======================================================== */

    const filteredRequests =
      useMemo(() => {
        if (tab === "All") {
          return requests;
        }

        if (tab === "Open") {
          return requests.filter(
            (request) =>
              request.status ===
                "Open" ||
              request.status ===
                "Overdue",
          );
        }

        return requests.filter(
          (request) =>
            request.status ===
            tab,
        );
      }, [
        requests,
        tab,
      ]);

    /* ========================================================
       ESCALATIONS
    ======================================================== */

  const escalations =
  useMemo<Escalation[]>(
    () =>
      requests
        .filter(
          (request) =>
            request.status === "Overdue" &&
            request.serviceStatusId !== 13,
        )
        .map(
          (request) => ({
            id: request.id,
            category:
              request.category,
            room:
              request.room,
            title:
              request.title,
            assignee:
              request.assignee,
            requestedBy:
              request.requestedBy,
            requestedById:
              request.requestedById,
            etaDate:
              request.etaDate,
            overdueDays:
              request.overdueDays,
          }),
        ),
    [requests],
  );

    /* ========================================================
       VIEW DATA

       Closed:
       Preview only.

       View All:
       Full list + internal vertical scroll.
    ======================================================== */

    const visibleRequests =
      requestsExpanded
        ? filteredRequests
        : filteredRequests.slice(
            0,
            PREVIEW_REQUESTS,
          );

    const visibleEscalations =
      escalationsExpanded
        ? escalations
        : escalations.slice(
            0,
            PREVIEW_ESCALATIONS,
          );

    /* ========================================================
       SUMMARY
    ======================================================== */

    const summary =
      aggregateData?.issues
        ?.summary;

    /* ========================================================
       PG CHANGE
    ======================================================== */

    const handlePgSelect = (
      pgId: number,
    ) => {
      const pg =
        pgInfoList.find(
          (item) =>
            Number(item.id) ===
            Number(pgId),
        );

      if (!pg) {
        return;
      }

      setSelectedPg(pg);

      setRequestsExpanded(
        false,
      );

      setEscalationsExpanded(
        false,
      );

      setTab("All");
    };


    const handleEditRequest = (
  request: ServiceRequest,
) => {
  setEditingRequest(request);

  setEditAssignedUserId(
    request.assignedUserId !== null
      ? String(
          request.assignedUserId,
        )
      : "",
  );

  if (request.etaDate) {
    const date =
      new Date(
        request.etaDate,
      );

    if (
      !Number.isNaN(
        date.getTime(),
      )
    ) {
      const year =
        date.getFullYear();

      const month = String(
        date.getMonth() + 1,
      ).padStart(2, "0");

      const day = String(
        date.getDate(),
      ).padStart(2, "0");

      setEditEtaDate(
        `${year}-${month}-${day}`,
      );
    } else {
      setEditEtaDate("");
    }
  } else {
    setEditEtaDate("");
  }

  setEditStatusId(
    String(
      request.serviceStatusId ??
        11,
    ),
  );
};

const handleUpdateRequest = async () => {
  if (!editingRequest) {
    return;
  }

  try {
    setUpdateSaving(true);

    const requestId = Number(editingRequest.id);

    if (!Number.isFinite(requestId)) {
      throw new Error("Invalid service request ID");
    }

    /*
     * Convert HTML date input:
     *
     * "2026-09-18"
     *
     * into Prisma-compatible DateTime:
     *
     * "2026-09-18T00:00:00.000Z"
     */
    let etaDateTime: string | null = null;

    if (editEtaDate) {
      const [year, month, day] =
        editEtaDate.split("-").map(Number);

      if (
        !year ||
        !month ||
        !day ||
        !Number.isFinite(year) ||
        !Number.isFinite(month) ||
        !Number.isFinite(day)
      ) {
        throw new Error("Invalid ETA date");
      }

      /*
       * Using UTC midnight prevents the date from
       * shifting because of the browser's timezone.
       */
      etaDateTime = new Date(
        Date.UTC(
          year,
          month - 1,
          day,
          0,
          0,
          0,
          0,
        ),
      ).toISOString();
    }

    const payload = {
      id: requestId,

      fields: {
        request_assigned_to:
          editAssignedUserId
            ? Number(editAssignedUserId)
            : null,

        request_eta_date:
          etaDateTime,

        service_status:
          Number(editStatusId),
      },
    };

    console.log(
      "Updating service request:",
      payload,
    );

    await updatePgServiceRequest(
      payload as any,
    );

    /*
     * Refresh the list first so the UI contains
     * the latest backend data before showing success.
     */
    const pgId = Number(selectedPgId);

    if (
      Number.isFinite(pgId) &&
      pgId > 0
    ) {
      await fetchServiceRequests(pgId);
    }

    setEditingRequest(null);

    setSuccessMessage(
      "Service request updated successfully.",
    );

    setSuccessModalOpen(true);
  } catch (error: any) {
    console.error(
      "Failed to update service request:",
      error,
    );

    alert(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update service request.",
    );
  } finally {
    setUpdateSaving(false);
  }
};

    /* ========================================================
       RENDER
    ======================================================== */

    return (
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-1 overflow-hidden">
        {/* Header */}

        <div className="flex flex-none items-center justify-between">
          <span className="text-[8px] font-extrabold text-blue-600 md:text-[10px]">
            MyPG
          </span>

          <button
            type="button"
            className="relative rounded-full border border-slate-100 bg-white p-1 shadow-sm"
          >
            <Bell className="h-2.5 w-2.5 text-slate-600" />

            <span className="absolute -right-[2px] -top-[2px] flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-[5px] font-bold text-white">
              3
            </span>
          </button>
        </div>

        {/* Title + PG */}

        <div className="flex flex-none items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-[10px] font-extrabold text-slate-900 md:text-xs xl:text-sm">
              Issues
            </h1>

            {(
              aggregateLoading ||
              serviceRequestLoading
            ) && (
              <span className="text-[6px] text-slate-400 md:text-[7px]">
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

        {/* Errors */}

        {(
          aggregateError ||
          serviceRequestError
        ) && (
          <div className="flex-none rounded-md bg-red-50 px-2 py-1 text-[7px] text-red-500">
            {serviceRequestError ||
              aggregateError}
          </div>
        )}

        {/* Stats */}

        <StatsRow
          summary={summary}
          requests={requests}
        />

        {/* Tabs */}

        <TabBar
          active={tab}
          onChange={setTab}
        />

        {/* ====================================================
            MAIN

            Both sections stay in separate rows.
            Tablet + desktop are tabular.
            Mobile is compact card layout.
        ==================================================== */}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 overflow-hidden">
          {/* ==================================================
              OPEN SERVICE REQUESTS
          ================================================== */}

          <Section
            title="Open Service Requests"
            expanded={
              requestsExpanded
            }
            onToggle={() =>
              setRequestsExpanded(
                (value) =>
                  !value,
              )
            }
            showViewAll={
              filteredRequests.length >
              PREVIEW_REQUESTS
            }
            className="min-h-0"
          >
            {/* Tablet + Desktop table header */}
            <div className="hidden md:block">
              <RequestTableHeader />
            </div>

            {visibleRequests.map(
              (request) => (
                <RequestRow
  key={request.id}
  item={request}
  onEdit={handleEditRequest}
/>
              ),
            )}

            {visibleRequests.length ===
              0 && (
              <p className="py-2 text-center text-[7px] text-slate-400">
                No requests in this view.
              </p>
            )}
          </Section>

          {/* ==================================================
              QUICK ESCALATIONS
          ================================================== */}

          <Section
            title="Quick Escalations"
            expanded={
              escalationsExpanded
            }
            onToggle={() =>
              setEscalationsExpanded(
                (value) =>
                  !value,
              )
            }
            showViewAll={
              escalations.length >
              PREVIEW_ESCALATIONS
            }
            className="min-h-0"
          >
            {/* Tablet + Desktop table header */}
            <EscalationTableHeader />

            {visibleEscalations.map(
              (escalation) => (
                <EscalationRow
                  key={
                    escalation.id
                  }
                  item={
                    escalation
                  }
                />
              ),
            )}

            {visibleEscalations.length ===
              0 && (
              <p className="py-2 text-center text-[7px] text-slate-400">
                No overdue requests.
              </p>
            )}
          </Section>
        </div>

        <UpdateServiceRequestModal
  open={
    editingRequest !== null
  }
  request={editingRequest}
  staffUsers={staffUsers}
  staffLoading={
    userRolesLoading
  }
  saving={updateSaving}
  assignedUserId={
    editAssignedUserId
  }
  etaDate={editEtaDate}
  statusId={editStatusId}
  onAssignedChange={
    setEditAssignedUserId
  }
  onEtaChange={
    setEditEtaDate
  }
  onStatusChange={
    setEditStatusId
  }
  onSave={
    handleUpdateRequest
  }
  onClose={() => {
    if (!updateSaving) {
      setEditingRequest(
        null,
      );
    }
  }}
/>

<SuccessModal
  open={successModalOpen}
  title="Success"
  message={successMessage}
  onClose={() =>
    setSuccessModalOpen(
      false,
    )
  }
/>
      </div>
      
    );

    
  };

export default IssuesDashboard;

