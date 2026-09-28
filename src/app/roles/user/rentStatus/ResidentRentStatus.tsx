// import { FC, useLayoutEffect, useRef, useState } from "react";
// import {
//   Bell,
//   ChevronDown,
//   ChevronRight,
//   Wallet,
//   Calendar,
//   FileText,
//   CheckCircle2,
//   MessageSquare,
// } from "lucide-react";
// import { PageShell } from "@/app/shared/components/PageShell";

// /* ----------------------------------------------------------------------- */
// /*  Types                                                                   */
// /* ----------------------------------------------------------------------- */

// export type RentHistoryStatus = "Paid" | "Partial" | "Overdue";
// type Tone = "blue" | "purple" | "orange" | "green" | "red";

// export interface RentHistoryEntry {
//   id: string | number;
//   month: string;
//   amount: number;
//   status: RentHistoryStatus;
// }

// export interface TimelineStep {
//   id: string | number;
//   date: string;
//   label: string;
//   icon: "sent" | "followup" | "due";
//   tone: Tone;
// }

// export interface ResidentRentStatusProps {
//   pgName?: string;
//   currentDue?: number;
//   dueDate?: string;
//   remindersCount?: number;
//   lastStatus?: string;
//   currentMonthLabel?: string;
//   reminderSentText?: string;
//   timeline?: TimelineStep[];
//   history?: RentHistoryEntry[];
//   /** Height (px) reserved at the bottom for the app's own bottom nav bar. */
//   bottomNavHeight?: number;
//   onContactManager?: () => void;
//   onViewDetails?: () => void;
// }

// /* ----------------------------------------------------------------------- */
// /*  Demo data (used only when a prop isn't supplied)                       */
// /* ----------------------------------------------------------------------- */

// const demoTimeline: TimelineStep[] = [
//   { id: 1, date: "5 Sep 2025", label: "Reminder Sent", icon: "sent", tone: "green" },
//   { id: 2, date: "9 Sep 2025", label: "Follow-up", icon: "followup", tone: "blue" },
//   { id: 3, date: "12 Sep 2025", label: "Due Date", icon: "due", tone: "orange" },
// ];

// const demoHistory: RentHistoryEntry[] = [
//   { id: 1, month: "Aug 2025", amount: 8000, status: "Paid" },
//   { id: 2, month: "Jul 2025", amount: 8000, status: "Paid" },
//   { id: 3, month: "Jun 2025", amount: 8000, status: "Paid" },
//   { id: 4, month: "May 2025", amount: 8000, status: "Partial" },
//   { id: 5, month: "Apr 2025", amount: 8000, status: "Paid" },
//   { id: 6, month: "Mar 2025", amount: 8000, status: "Paid" },
//   { id: 7, month: "Feb 2025", amount: 7800, status: "Paid" },
//   { id: 8, month: "Jan 2025", amount: 7800, status: "Overdue" },
// ];

// /* ----------------------------------------------------------------------- */
// /*  Dynamic row-fit for Recent Rent History — measures the actual          */
// /*  available height and rendered row height so the list fills the card's  */
// /*  full height by default. "View All" only appears if data still         */
// /*  overflows what fits; otherwise every row is shown with no scroll.      */
// /* ----------------------------------------------------------------------- */

// function useFitRowCount(itemCount: number) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const rowRef = useRef<HTMLDivElement | null>(null);
//   const [fitCount, setFitCount] = useState(3);

//   useLayoutEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const recompute = () => {
//       const row = rowRef.current;
//       if (!row) return;
//       const availableHeight = container.clientHeight;
//       const rowHeight = row.getBoundingClientRect().height;
//       if (availableHeight <= 0 || rowHeight <= 0) return;
//       const count = Math.floor(availableHeight / rowHeight);
//       setFitCount(Math.min(itemCount, Math.max(1, count)));
//     };

//     recompute();
//     const ro = new ResizeObserver(recompute);
//     ro.observe(container);
//     window.addEventListener("resize", recompute);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", recompute);
//     };
//   }, [itemCount]);

//   return { containerRef, rowRef, fitCount };
// }

// /* ----------------------------------------------------------------------- */
// /*  Style maps                                                              */
// /* ----------------------------------------------------------------------- */

// const toneIconBg: Record<Tone, string> = {
//   blue: "bg-blue-50 text-blue-600",
//   purple: "bg-purple-50 text-purple-600",
//   orange: "bg-orange-50 text-orange-600",
//   green: "bg-green-50 text-green-600",
//   red: "bg-red-50 text-red-600",
// };

// const toneDot: Record<Tone, string> = {
//   blue: "bg-blue-600",
//   purple: "bg-purple-600",
//   orange: "bg-orange-600",
//   green: "bg-green-600",
//   red: "bg-red-600",
// };

// const toneText: Record<Tone, string> = {
//   blue: "text-blue-600",
//   purple: "text-purple-600",
//   orange: "text-orange-600",
//   green: "text-green-600",
//   red: "text-red-600",
// };

// const historyStatusClasses: Record<RentHistoryStatus, string> = {
//   Paid: "bg-green-50 text-green-700",
//   Partial: "bg-orange-50 text-orange-700",
//   Overdue: "bg-red-50 text-red-700",
// };

// /** Generic tone lookup for the free-text "Last Status" stat card. */
// function statusTone(status: string): Tone {
//   const s = status.toLowerCase();
//   if (s === "paid") return "green";
//   if (s === "overdue") return "red";
//   if (s === "partial" || s === "due") return "orange";
//   return "blue";
// }

// const timelineIconMap = {
//   sent: CheckCircle2,
//   followup: Bell,
//   due: Calendar,
// };

// /* ----------------------------------------------------------------------- */
// /*  Small presentational bits                                              */
// /* ----------------------------------------------------------------------- */

// const IconBox: FC<{ icon: React.ElementType; tone: Tone; size?: "sm" | "md" }> = ({ icon: Icon, tone, size = "sm" }) => (
//   <div
//     className={`flex shrink-0 items-center justify-center rounded-full ${toneIconBg[tone]} ${
//       size === "md" ? "h-5 w-5" : "h-3.5 w-3.5"
//     }`}
//   >
//     <Icon className={size === "md" ? "h-2.5 w-2.5" : "h-2 w-2"} />
//   </div>
// );

// const StatCard: FC<{ icon: React.ElementType; tone: Tone; label: string; value: string }> = ({ icon: Icon, tone, label, value }) => (
//   <div className="flex flex-col items-center rounded border border-gray-100 bg-white px-0.5 py-1 text-center shadow-sm">
//     <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${toneIconBg[tone]}`}>
//       <Icon className="h-2.5 w-2.5" />
//     </div>
//     <p className="mt-1 text-[5px] font-medium leading-none text-gray-700 sm:text-[6px]">{label}</p>
//     <p className={`mt-1 truncate text-[8px] font-bold leading-none sm:text-[9px] ${toneText[tone]}`}>{value}</p>
//   </div>
// );

// /* ----------------------------------------------------------------------- */
// /*  Main screen                                                             */
// /* ----------------------------------------------------------------------- */

// export const ResidentRentStatus: FC<ResidentRentStatusProps> = ({
//   pgName = "Hamsa PG",
//   currentDue = 8000,
//   dueDate = "12 Sep 2025",
//   remindersCount = 2,
//   lastStatus = "Due",
//   currentMonthLabel = "Sep 2025",
//   reminderSentText = "Reminder sent today",
//   timeline = demoTimeline,
//   history = demoHistory,
//   bottomNavHeight = 56,
//   onContactManager,
//   onViewDetails,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const { containerRef, rowRef, fitCount } = useFitRowCount(history.length);

//   const visibleHistory = expanded ? history : history.slice(0, fitCount);
//   const hasMore = history.length > fitCount || expanded;

//   return (
//     <PageShell noScroll bottomPad={bottomNavHeight}>
//       <div className="flex h-full min-h-0 flex-col gap-1">
//         {/* ---------------- Header ---------------- */}
//         <header className="flex shrink-0 items-center justify-between pt-0.5">
//           <span className="text-sm font-extrabold text-blue-600 sm:text-base">MyPG</span>
//           <button type="button" className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100">
//             <Bell className="h-2.5 w-2.5" />
//             <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500 text-[4px] font-bold text-white">
//               3
//             </span>
//           </button>
//         </header>

//         {/* ---------------- Title ---------------- */}
//         <div className="flex shrink-0 items-center justify-between">
//           <h1 className="text-xs font-extrabold text-gray-900 sm:text-sm">Rent Status</h1>
//           <button
//             type="button"
//             className="flex shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-gray-800 sm:text-[6.5px]"
//           >
//             {pgName}
//             <ChevronDown className="h-1.5 w-1.5 text-gray-500" />
//           </button>
//         </div>

//         {/* ---------------- Stat cards ---------------- */}
//         <div className="grid shrink-0 grid-cols-4 gap-0.5">
//           <StatCard icon={Wallet} tone="green" label="Current Due" value={`₹${currentDue.toLocaleString("en-IN")}`} />
//           <StatCard icon={Calendar} tone="orange" label="Due Date" value={dueDate} />
//           <StatCard icon={Bell} tone="blue" label="Reminders" value={String(remindersCount)} />
//           <StatCard icon={FileText} tone={statusTone(lastStatus)} label="Last Status" value={lastStatus} />
//         </div>

//         {/* ---------------- Current Month ---------------- */}
//         <div className="flex shrink-0 flex-col gap-1 rounded border border-gray-100 bg-white px-1.5 py-1.5 shadow-sm">
//           {/* Row 1: amount + current month (left) · icon (right) */}
//           <div className="flex items-center justify-between gap-1">
//             <div className="min-w-0">
//               <p className="truncate text-[9px] font-bold text-green-600 sm:text-[10px]">₹{currentDue.toLocaleString("en-IN")}</p>
//               <p className="truncate text-[5.5px] text-gray-500 sm:text-[6px]">{currentMonthLabel}</p>
//             </div>
//             <IconBox icon={Wallet} tone="green" size="md" />
//           </div>

//           {/* Row 2: Due status + due date · Contact Manager */}
//           <div className="flex items-center justify-between gap-1">
//             <div className="flex items-center gap-1">
//               <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[5.5px] font-semibold text-orange-700 sm:text-[6px]">Due</span>
//               <span className="truncate text-[5.5px] text-gray-600 sm:text-[6px]">{dueDate}</span>
//             </div>
//             <button
//               type="button"
//               onClick={onContactManager}
//               className="flex items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[6px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
//             >
//               <MessageSquare className="h-1.5 w-1.5" />
//               Contact Manager
//             </button>
//           </div>

//           {/* Row 3: Reminder sent · View Details */}
//           <div className="flex items-center justify-between gap-1">
//             <span className="flex items-center gap-0.5 text-[5.5px] text-green-600 sm:text-[6px]">
//               <CheckCircle2 className="h-1.5 w-1.5" />
//               {reminderSentText}
//             </span>
//             <button
//               type="button"
//               onClick={onViewDetails}
//               className="flex items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[6px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
//             >
//               View Details
//               <ChevronRight className="h-1.5 w-1.5" />
//             </button>
//           </div>
//         </div>

//         {/* ---------------- Reminder Timeline ---------------- */}
//         <div className="flex shrink-0 flex-col rounded border border-gray-100 bg-white px-1 py-1 shadow-sm">
//           <h2 className="mb-1 text-[8px] font-bold text-gray-900 sm:text-[9px]">Reminder Timeline</h2>
//           <div className="flex items-start">
//             {timeline.map((step, i) => {
//               const Icon = timelineIconMap[step.icon];
//               const isFirst = i === 0;
//               const isLast = i === timeline.length - 1;
//               return (
//                 <div key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
//                   <IconBox icon={Icon} tone={step.tone} size="md" />
//                   {/* Connector row: line segments meet the dot on either side,
//                       so the line reads as one continuous path through every dot. */}
//                   <div className="mt-0.5 flex w-full items-center">
//                     <div className={`h-px flex-1 ${isFirst ? "bg-transparent" : "bg-gray-200"}`} />
//                     <div className={`h-1 w-1 shrink-0 rounded-full ${toneDot[step.tone]}`} />
//                     <div className={`h-px flex-1 ${isLast ? "bg-transparent" : "bg-gray-200"}`} />
//                   </div>
//                   <p className={`mt-0.5 truncate text-[6px] font-bold sm:text-[6.5px] ${toneText[step.tone]}`}>{step.date}</p>
//                   <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">{step.label}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ---------------- Recent Rent History ---------------- */}
//         <div className="flex min-h-0 flex-1 flex-col rounded border border-gray-100 bg-white shadow-sm">
//           <div className="flex shrink-0 items-center justify-between px-1 pt-0.5 pb-0.5">
//             <h2 className="text-[8px] font-bold text-gray-900 sm:text-[9px]">Recent Rent History</h2>
//             {hasMore && (
//               <button
//                 type="button"
//                 onClick={() => setExpanded((prev) => !prev)}
//                 className="text-[6px] font-semibold text-blue-600 hover:text-blue-700 sm:text-[7px]"
//               >
//                 {expanded ? "Show Less" : "View All"}
//               </button>
//             )}
//           </div>

//           <div className="grid shrink-0 grid-cols-[1.4fr_1fr_1fr] items-center gap-1 px-1 pb-0.5 text-[5px] font-medium text-gray-400 sm:text-[5.5px]">
//             <span>Month</span>
//             <span>Amount</span>
//             <span>Status</span>
//           </div>

//           <div
//             ref={containerRef}
//             className={`flex min-h-0 flex-1 flex-col ${expanded ? "overflow-y-auto" : "overflow-hidden"}`}
//           >
//             {visibleHistory.map((h, i) => (
//               <div
//                 key={h.id}
//                 ref={i === 0 ? rowRef : undefined}
//                 className="grid shrink-0 grid-cols-[1.4fr_1fr_1fr] items-center gap-1 border-t border-gray-100 px-1 py-0.5 first:border-t-0"
//               >
//                 <div className="flex min-w-0 items-center gap-0.5">
//                   <Calendar className="h-1.5 w-1.5 shrink-0 text-gray-400" />
//                   <span className="truncate text-[6.5px] font-semibold text-gray-900 sm:text-[7px]">{h.month}</span>
//                 </div>
//                 <span className="truncate text-[6.5px] text-gray-700 sm:text-[7px]">₹{h.amount.toLocaleString("en-IN")}</span>
//                 <span className={`w-fit rounded-full px-1 py-0.5 text-[5px] font-semibold sm:text-[5.5px] ${historyStatusClasses[h.status]}`}>
//                   {h.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </PageShell>
//   );
// };

// export default ResidentRentStatus;




import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  MessageSquare,
  Wallet,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import { useResidentRentStatusStore } from "@/app/shared/store/residentRentStatusStore";
import { useAuth } from "@/hooks/context/AuthContext";

/* ----------------------------------------------------------------------- */
/* Types                                                                   */
/* ----------------------------------------------------------------------- */

type Tone = "blue" | "purple" | "orange" | "green" | "red";

export type RentHistoryStatus =
  | "Paid"
  | "Partial"
  | "Due"
  | "Overdue";

export interface TimelineStep {
  id: string | number;
  date: string;
  label: string;
  icon: "sent" | "followup" | "due";
  tone: Tone;
}

export interface ResidentRentStatusProps {
  bottomNavHeight?: number;
  onContactManager?: () => void;
  onViewDetails?: () => void;
}

/* ----------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ----------------------------------------------------------------------- */

function formatCurrency(value: number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
}

function formatMonth(value: string | null | undefined) {
  if (!value) return "—";

  // API already returns values such as "Aug 2026"
  return value;
}

function normalizeStatus(status?: string | null): RentHistoryStatus {
  const value = String(status || "").toLowerCase();

  if (value.includes("paid")) {
    return "Paid";
  }

  if (
    value.includes("partial") ||
    value.includes("partially")
  ) {
    return "Partial";
  }

  if (
    value.includes("overdue") ||
    value.includes("over due")
  ) {
    return "Overdue";
  }

  return "Due";
}

function statusTone(status?: string | null): Tone {
  const value = String(status || "").toLowerCase();

  if (value.includes("paid")) {
    return "green";
  }

  if (
    value.includes("overdue") ||
    value.includes("over due")
  ) {
    return "red";
  }

  if (
    value.includes("partial") ||
    value.includes("due")
  ) {
    return "orange";
  }

  return "blue";
}

function getTimelineIcon(
  type: string
): "sent" | "followup" | "due" {
  const value = type.toLowerCase();

  if (value.includes("invoice")) {
    return "sent";
  }

  if (value.includes("due")) {
    return "due";
  }

  return "followup";
}

function getTimelineTone(status: string): Tone {
  const value = status.toLowerCase();

  if (
    value.includes("overdue") ||
    value.includes("failed")
  ) {
    return "red";
  }

  if (
    value.includes("completed") ||
    value.includes("paid")
  ) {
    return "green";
  }

  if (value.includes("due")) {
    return "orange";
  }

  return "blue";
}

/* ----------------------------------------------------------------------- */
/* Dynamic row-fit                                                         */
/* ----------------------------------------------------------------------- */

function useFitRowCount(itemCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [fitCount, setFitCount] = useState(3);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const recompute = () => {
      const row = rowRef.current;

      if (!row) return;

      const availableHeight = container.clientHeight;
      const rowHeight = row.getBoundingClientRect().height;

      if (availableHeight <= 0 || rowHeight <= 0) return;

      const count = Math.floor(
        availableHeight / rowHeight
      );

      setFitCount(
        Math.min(
          itemCount,
          Math.max(1, count)
        )
      );
    };

    recompute();

    const ro = new ResizeObserver(recompute);

    ro.observe(container);

    window.addEventListener("resize", recompute);

    return () => {
      ro.disconnect();
      window.removeEventListener(
        "resize",
        recompute
      );
    };
  }, [itemCount]);

  return {
    containerRef,
    rowRef,
    fitCount,
  };
}

/* ----------------------------------------------------------------------- */
/* Style maps                                                              */
/* ----------------------------------------------------------------------- */

const toneIconBg: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
};

const toneDot: Record<Tone, string> = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  orange: "bg-orange-600",
  green: "bg-green-600",
  red: "bg-red-600",
};

const toneText: Record<Tone, string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  green: "text-green-600",
  red: "text-red-600",
};

const historyStatusClasses: Record<
  RentHistoryStatus,
  string
> = {
  Paid: "bg-green-50 text-green-700",
  Partial: "bg-orange-50 text-orange-700",
  Due: "bg-orange-50 text-orange-700",
  Overdue: "bg-red-50 text-red-700",
};

const timelineIconMap = {
  sent: CheckCircle2,
  followup: Bell,
  due: Calendar,
};

/* ----------------------------------------------------------------------- */
/* Small presentational components                                         */
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

const StatCard: FC<{
  icon: React.ElementType;
  tone: Tone;
  label: string;
  value: string;
}> = ({
  icon: Icon,
  tone,
  label,
  value,
}) => (
  <div className="flex flex-col items-center rounded border border-gray-100 bg-white px-0.5 py-1 text-center shadow-sm">
    <div
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${toneIconBg[tone]}`}
    >
      <Icon className="h-2.5 w-2.5" />
    </div>

    <p className="mt-1 text-[5px] font-medium leading-none text-gray-700 sm:text-[6px]">
      {label}
    </p>

    <p
      className={`mt-1 truncate text-[8px] font-bold leading-none sm:text-[9px] ${toneText[tone]}`}
    >
      {value}
    </p>
  </div>
);

/* ----------------------------------------------------------------------- */
/* Main component                                                          */
/* ----------------------------------------------------------------------- */

export const ResidentRentStatus: FC<
  ResidentRentStatusProps
> = ({
  bottomNavHeight = 56,
  onContactManager,
  onViewDetails,
}) => {
 const { dbUser } = useAuth();

const {
  data,
  loading,
  error,
  fetchResidentRentStatus,
} = useResidentRentStatusStore();

useEffect(() => {
  if (!dbUser?.id) return;

  fetchResidentRentStatus({
    user_id: dbUser.id,
  });
}, [dbUser?.id, fetchResidentRentStatus]);

  const [expanded, setExpanded] =
    useState(false);



  

  const historyData =
  data?.recentRentHistory || [];

const {
  containerRef,
  rowRef,
  fitCount,
} = useFitRowCount(historyData.length);

  /* --------------------------------------------------------------------- */
  /* Loading                                                               */
  /* --------------------------------------------------------------------- */

  if (loading && !data) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-[9px] font-medium text-gray-500">
            Loading rent status...
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Error                                                                 */
  /* --------------------------------------------------------------------- */

  if (error && !data) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <div className="rounded border border-red-100 bg-red-50 px-3 py-2 text-center">
            <p className="text-[9px] font-semibold text-red-600">
              Unable to load rent status
            </p>

            <p className="mt-1 text-[7px] text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchResidentRentStatus()
              }
              className="mt-2 rounded border border-red-200 bg-white px-2 py-1 text-[7px] font-semibold text-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-[9px] text-gray-500">
            No rent information available.
          </p>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* API data                                                              */
  /* --------------------------------------------------------------------- */

  const {
    resident,
    booking,
    rentStatus,
    currentMonth,
    reminders,
    reminderTimeline,
    recentRentHistory,
  } = data;

  const lastStatus =
    rentStatus?.lastStatus?.name ||
    currentMonth?.status?.name ||
    "—";

  const lastStatusTone =
    statusTone(lastStatus);

  const dueDate = formatDate(
    rentStatus?.dueDate
  );

  const currentMonthStatus =
    currentMonth?.status?.name ||
    "Due";

  const currentMonthStatusNormalized =
    normalizeStatus(
      currentMonthStatus
    );

  const pgLabel =
    booking?.pgId != null
      ? `PG #${booking.pgId}`
      : "My PG";

  /* --------------------------------------------------------------------- */
  /* Timeline                                                              */
  /* --------------------------------------------------------------------- */

  const timeline: TimelineStep[] =
    (reminderTimeline || []).map(
      (item, index) => ({
        id: `${item.type}-${item.date}-${index}`,
        date: formatDate(item.date),
        label: item.title,
        icon: getTimelineIcon(item.type),
        tone: getTimelineTone(item.status),
      })
    );

  /* --------------------------------------------------------------------- */
  /* History                                                               */
  /* --------------------------------------------------------------------- */

  const history = recentRentHistory.map(
    (item) => ({
      id: item.invoiceId,
      month: item.month,
      amount: item.amount,
      status: normalizeStatus(
        item.status?.name ||
          item.status?.code ||
          item.status?.key
      ),
    })
  );

  const visibleHistory = expanded
    ? history
    : history.slice(0, fitCount);

  const hasMore =
    history.length > fitCount;

  /* --------------------------------------------------------------------- */
  /* Reminder text                                                         */
  /* --------------------------------------------------------------------- */

  const reminderSentText =
    reminders?.count > 0
      ? `${reminders.count} reminder${
          reminders.count === 1
            ? ""
            : "s"
        } sent`
      : "No reminders";

  /* --------------------------------------------------------------------- */
  /* Render                                                                */
  /* --------------------------------------------------------------------- */

  return (
    <PageShell
      noScroll
      bottomPad={bottomNavHeight}
    >
      <div className="flex h-full min-h-0 flex-col gap-1">

        {/* --------------------------------------------------------------- */}
        {/* Header                                                          */}
        {/* --------------------------------------------------------------- */}

        <header className="flex shrink-0 items-center justify-between pt-0.5">
          <span className="text-sm font-extrabold text-blue-600 sm:text-base">
            MyPG
          </span>

          <button
            type="button"
            className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100"
          >
            <Bell className="h-2.5 w-2.5" />

            {reminders?.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500 text-[4px] font-bold text-white">
                {reminders.count > 9
                  ? "9+"
                  : reminders.count}
              </span>
            )}
          </button>
        </header>

        {/* --------------------------------------------------------------- */}
        {/* Title                                                           */}
        {/* --------------------------------------------------------------- */}

        <div className="flex shrink-0 items-center justify-between">
          <h1 className="text-xs font-extrabold text-gray-900 sm:text-sm">
            Rent Status
          </h1>

          <button
            type="button"
            className="flex shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-gray-800 sm:text-[6.5px]"
          >
            {pgLabel}

            <ChevronDown className="h-1.5 w-1.5 text-gray-500" />
          </button>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Stat Cards                                                      */}
        {/* --------------------------------------------------------------- */}

        <div className="grid shrink-0 grid-cols-4 gap-0.5">
          <StatCard
            icon={Wallet}
            tone="green"
            label="Current Due"
            value={formatCurrency(
              rentStatus?.currentDue
            )}
          />

          <StatCard
            icon={Calendar}
            tone="orange"
            label="Due Date"
            value={dueDate}
          />

          <StatCard
            icon={Bell}
            tone="blue"
            label="Reminders"
            value={String(
              rentStatus?.reminderCount || 0
            )}
          />

          <StatCard
            icon={FileText}
            tone={lastStatusTone}
            label="Last Status"
            value={lastStatus}
          />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Current Month                                                   */}
        {/* --------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-col gap-1 rounded border border-gray-100 bg-white px-1.5 py-1.5 shadow-sm">

          {/* Amount + month */}

          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold text-green-600 sm:text-[10px]">
                {formatCurrency(
                  currentMonth?.amount
                )}
              </p>

              <p className="truncate text-[5.5px] text-gray-500 sm:text-[6px]">
                {formatMonth(
                  currentMonth?.month
                )}
              </p>
            </div>

            <IconBox
              icon={Wallet}
              tone="green"
              size="md"
            />
          </div>

          {/* Status + due date */}

          <div className="flex items-center justify-between gap-1">
            <div className="flex min-w-0 items-center gap-1">

              <span
                className={`rounded-full px-1.5 py-0.5 text-[5.5px] font-semibold sm:text-[6px] ${
                  historyStatusClasses[
                    currentMonthStatusNormalized
                  ]
                }`}
              >
                {currentMonthStatus}
              </span>

              <span className="truncate text-[5.5px] text-gray-600 sm:text-[6px]">
                {formatDate(
                  currentMonth?.dueDate
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={onContactManager}
              className="flex shrink-0 items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[6px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
            >
              <MessageSquare className="h-1.5 w-1.5" />
              Contact Manager
            </button>
          </div>

          {/* Reminder + details */}

          <div className="flex items-center justify-between gap-1">
            <span className="flex min-w-0 items-center gap-0.5 truncate text-[5.5px] text-green-600 sm:text-[6px]">
              <CheckCircle2 className="h-1.5 w-1.5 shrink-0" />

              {reminderSentText}
            </span>

            <button
              type="button"
              onClick={onViewDetails}
              className="flex shrink-0 items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[6px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-[6.5px]"
            >
              View Details

              <ChevronRight className="h-1.5 w-1.5" />
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Reminder Timeline                                               */}
        {/* --------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-col rounded border border-gray-100 bg-white px-1 py-1 shadow-sm">

          <h2 className="mb-1 text-[8px] font-bold text-gray-900 sm:text-[9px]">
            Reminder Timeline
          </h2>

          {timeline.length > 0 ? (
            <div className="flex items-start">
              {timeline.map(
                (step, index) => {
                  const Icon =
                    timelineIconMap[
                      step.icon
                    ];

                  const isFirst =
                    index === 0;

                  const isLast =
                    index ===
                    timeline.length - 1;

                  return (
                    <div
                      key={step.id}
                      className="flex min-w-0 flex-1 flex-col items-center"
                    >
                      <IconBox
                        icon={Icon}
                        tone={step.tone}
                        size="md"
                      />

                      <div className="mt-0.5 flex w-full items-center">
                        <div
                          className={`h-px flex-1 ${
                            isFirst
                              ? "bg-transparent"
                              : "bg-gray-200"
                          }`}
                        />

                        <div
                          className={`h-1 w-1 shrink-0 rounded-full ${toneDot[step.tone]}`}
                        />

                        <div
                          className={`h-px flex-1 ${
                            isLast
                              ? "bg-transparent"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>

                      <p
                        className={`mt-0.5 truncate text-[6px] font-bold sm:text-[6.5px] ${toneText[step.tone]}`}
                      >
                        {step.date}
                      </p>

                      <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                        {step.label}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="py-1 text-center text-[6px] text-gray-400">
              No reminder timeline available
            </p>
          )}
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Recent Rent History                                             */}
        {/* --------------------------------------------------------------- */}

        <div className="flex min-h-0 flex-1 flex-col rounded border border-gray-100 bg-white shadow-sm">

          <div className="flex shrink-0 items-center justify-between px-1 pb-0.5 pt-0.5">

            <h2 className="text-[8px] font-bold text-gray-900 sm:text-[9px]">
              Recent Rent History
            </h2>

            {hasMore && (
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    (prev) => !prev
                  )
                }
                className="text-[6px] font-semibold text-blue-600 hover:text-blue-700 sm:text-[7px]"
              >
                {expanded
                  ? "Show Less"
                  : "View All"}
              </button>
            )}
          </div>

          <div className="grid shrink-0 grid-cols-[1.4fr_1fr_1fr] items-center gap-1 px-1 pb-0.5 text-[5px] font-medium text-gray-400 sm:text-[5.5px]">
            <span>Month</span>
            <span>Amount</span>
            <span>Status</span>
          </div>

          <div
            ref={containerRef}
            className={`flex min-h-0 flex-1 flex-col ${
              expanded
                ? "overflow-y-auto"
                : "overflow-hidden"
            }`}
          >
            {visibleHistory.length > 0 ? (
              visibleHistory.map(
                (item, index) => (
                  <div
                    key={item.id}
                    ref={
                      index === 0
                        ? rowRef
                        : undefined
                    }
                    className="grid shrink-0 grid-cols-[1.4fr_1fr_1fr] items-center gap-1 border-t border-gray-100 px-1 py-0.5 first:border-t-0"
                  >
                    <div className="flex min-w-0 items-center gap-0.5">
                      <Calendar className="h-1.5 w-1.5 shrink-0 text-gray-400" />

                      <span className="truncate text-[6.5px] font-semibold text-gray-900 sm:text-[7px]">
                        {item.month}
                      </span>
                    </div>

                    <span className="truncate text-[6.5px] text-gray-700 sm:text-[7px]">
                      {formatCurrency(
                        item.amount
                      )}
                    </span>

                    <span
                      className={`w-fit rounded-full px-1 py-0.5 text-[5px] font-semibold sm:text-[5.5px] ${
                        historyStatusClasses[
                          item.status
                        ]
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[7px] text-gray-400">
                  No rent history available
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageShell>
  );
};

export default ResidentRentStatus;