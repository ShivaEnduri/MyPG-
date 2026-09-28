// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Bed,
//   Armchair,
//   IndianRupee,
//   Bell,
//   ChevronDown,
//   Calendar,
//   BarChart3,
//   Users,
//   AlertTriangle,
//   FileText,
//   Download,
//   Loader2,
// } from "lucide-react";

// import { PageShell } from "@/app/shared/components/PageShell";

// import { usePgAggregationsStore } from "@/app/shared/store/aggregationsStore";
// import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";

// /* ------------------------------------------------------------------ */
// /* Types                                                              */
// /* ------------------------------------------------------------------ */

// interface TopStat {
//   label: string;
//   value: string;
//   sub: string;
//   subColor: string;
//   valueColor: string;
//   icon: React.ElementType;
//   iconBg: string;
//   iconColor: string;
// }

// interface SnapshotMetric {
//   label: string;
//   value: string;
//   valueColor: string;
//   augValue: number;
//   sepValue: number;
//   max: number;
//   barColor: string;
//   delta: string;
//   deltaColor: string;
// }

// interface ReportItem {
//   title: string;
//   subtitle: string;
//   icon: React.ElementType;
//   iconBg: string;
//   iconColor: string;
//   type: "occupancy" | "residents" | "issues" | "rent";
// }

// /* ------------------------------------------------------------------ */
// /* Mini bar chart                                                     */
// /* ------------------------------------------------------------------ */

// function MiniBarChart({
//   metric,
// }: {
//   metric: SnapshotMetric;
// }): React.ReactElement {
//   const augPct =
//     metric.max > 0
//       ? Math.min(100, (metric.augValue / metric.max) * 100)
//       : 0;

//   const sepPct =
//     metric.max > 0
//       ? Math.min(100, (metric.sepValue / metric.max) * 100)
//       : 0;

//   return (
//     <div className="flex min-w-0 flex-col items-center">
//       <span className="text-center text-[6.5px] font-semibold leading-tight text-slate-500 sm:text-[8px] lg:text-[7px]">
//         {metric.label}
//       </span>

//       <span
//         className={`text-[12px] font-extrabold leading-none sm:text-sm ${metric.valueColor}`}
//       >
//         {metric.value}
//       </span>

//       <div className="mt-0.5 flex h-7 w-full items-end justify-center gap-1 sm:h-10">
//         <div className="flex h-full items-end">
//           <div
//             className={`w-2 rounded-t-sm sm:w-3 ${metric.barColor} opacity-60`}
//             style={{ height: `${augPct}%` }}
//           />
//         </div>

//         <div className="flex h-full items-end">
//           <div
//             className={`w-2 rounded-t-sm sm:w-3 ${metric.barColor}`}
//             style={{ height: `${sepPct}%` }}
//           />
//         </div>
//       </div>

//       <div className="mt-0.5 hidden w-full justify-center gap-3 sm:flex">
//         <span className="text-[7px] font-medium text-slate-400">
//           Previous
//         </span>

//         <span className="text-[7px] font-medium text-slate-400">
//           Current
//         </span>
//       </div>

//       <span
//         className={`mt-0.5 text-[6px] font-bold sm:text-[7px] ${metric.deltaColor}`}
//       >
//         {metric.delta}
//       </span>
//     </div>
//   );
// }


// /* ------------------------------------------------------------------ */
// /* Word document download helper                                      */
// /* ------------------------------------------------------------------ */

// function downloadDoc(
//   filename: string,
//   title: string,
//   pgName: string,
//   rows: Array<[string, string | number]>
// ): void {
//   const generatedDate = new Date().toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   const tableRows = rows
//     .map(
//       ([metric, value]) => `
//         <tr>
//           <td style="
//             border:1px solid #d9dee8;
//             padding:8px 10px;
//             font-weight:600;
//             color:#374151;
//             width:55%;
//           ">
//             ${escapeHtml(metric)}
//           </td>
//           <td style="
//             border:1px solid #d9dee8;
//             padding:8px 10px;
//             color:#111827;
//             font-weight:600;
//           ">
//             ${escapeHtml(String(value))}
//           </td>
//         </tr>
//       `
//     )
//     .join("");

//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <title>${escapeHtml(title)}</title>
//       </head>

//       <body style="
//         font-family:Arial, Helvetica, sans-serif;
//         color:#111827;
//         margin:40px;
//       ">

//         <div style="
//           border-bottom:2px solid #2563eb;
//           padding-bottom:12px;
//           margin-bottom:22px;
//         ">
//           <div style="
//             font-size:24px;
//             font-weight:700;
//             color:#2563eb;
//             margin-bottom:5px;
//           ">
//             MyPG
//           </div>

//           <div style="
//             font-size:20px;
//             font-weight:700;
//             color:#111827;
//           ">
//             ${escapeHtml(title)}
//           </div>

//           <div style="
//             margin-top:8px;
//             font-size:13px;
//             color:#6b7280;
//           ">
//             PG Name:
//             <strong style="color:#111827;">
//               ${escapeHtml(pgName)}
//             </strong>
//           </div>

//           <div style="
//             margin-top:3px;
//             font-size:13px;
//             color:#6b7280;
//           ">
//             Generated on:
//             ${escapeHtml(generatedDate)}
//           </div>
//         </div>

//         <table
//           style="
//             width:100%;
//             border-collapse:collapse;
//             margin-top:15px;
//             font-size:13px;
//           "
//         >
//           <thead>
//             <tr>
//               <th style="
//                 border:1px solid #d9dee8;
//                 padding:9px 10px;
//                 background:#f3f6fb;
//                 text-align:left;
//                 color:#374151;
//               ">
//                 Metric
//               </th>

//               <th style="
//                 border:1px solid #d9dee8;
//                 padding:9px 10px;
//                 background:#f3f6fb;
//                 text-align:left;
//                 color:#374151;
//               ">
//                 Value
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             ${tableRows}
//           </tbody>
//         </table>

//         <div style="
//           margin-top:28px;
//           padding-top:10px;
//           border-top:1px solid #e5e7eb;
//           font-size:11px;
//           color:#9ca3af;
//         ">
//           MyPG — ${escapeHtml(pgName)}
//         </div>

//       </body>
//     </html>
//   `;

//   const blob = new Blob(
//     [
//       "\ufeff",
//       html,
//     ],
//     {
//       type: "application/msword;charset=utf-8",
//     }
//   );

//   const url = URL.createObjectURL(blob);

//   const anchor = document.createElement("a");
//   anchor.href = url;
//   anchor.download = filename;

//   document.body.appendChild(anchor);
//   anchor.click();
//   document.body.removeChild(anchor);

//   URL.revokeObjectURL(url);
// }

// /* ------------------------------------------------------------------ */
// /* HTML escaping                                                      */
// /* ------------------------------------------------------------------ */

// function escapeHtml(value: string): string {
//   return value
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// /* ------------------------------------------------------------------ */
// /* Main component                                                     */
// /* ------------------------------------------------------------------ */

// export default function OwnersReportsPage(): React.ReactElement {
//   /* ---------------------------------------------------------------- */
//   /* Selected PG                                                      */
//   /* ---------------------------------------------------------------- */

//   const selectedPg = useSelectedPgStore(
//     (state) => state.selectedPg
//   );

//   const selectedPgId = useSelectedPgStore(
//     (state) => state.selectedPgId
//   );

//   /*
//    * PgInfo can differ depending on the common API definition.
//    * Keep this tolerant so the UI can display either common naming.
//    */
//   const currentPgName =
//   (selectedPg as any)?.pg_name ?? "";
  
//   /* ---------------------------------------------------------------- */
//   /* Aggregations store                                               */
//   /* ---------------------------------------------------------------- */

//   const aggregations = usePgAggregationsStore(
//     (state) => state.aggregations
//   );

//   const loading = usePgAggregationsStore(
//     (state) => state.loading
//   );

//   const error = usePgAggregationsStore(
//     (state) => state.error
//   );

//   const fetchAggregations = usePgAggregationsStore(
//     (state) => state.fetchAggregations
//   );

//   /* ---------------------------------------------------------------- */
//   /* Fetch whenever selected PG changes                               */
//   /* ---------------------------------------------------------------- */

//   useEffect(() => {
//     if (!selectedPgId) {
//       return;
//     }

//     fetchAggregations(selectedPgId);
//   }, [selectedPgId, fetchAggregations]);

//   /* ---------------------------------------------------------------- */
//   /* Export state                                                     */
//   /* ---------------------------------------------------------------- */

//   const [downloadingReport, setDownloadingReport] =
//     useState<string | null>(null);

//   const [exportingMonthly, setExportingMonthly] =
//     useState(false);

//   /* ---------------------------------------------------------------- */
//   /* Current aggregation values                                      */
//   /* ---------------------------------------------------------------- */

//   const dashboard = aggregations?.dashboard;

//   const bedMap = aggregations?.bedMap;

//   const vacancyPipeline =
//     aggregations?.bedMap;

//   const residents = aggregations?.residents;

//   const rentStatus = aggregations?.rentStatus;

//   /* ---------------------------------------------------------------- */
//   /* Dynamic top statistics                                          */
//   /* ---------------------------------------------------------------- */

//   const topStats: TopStat[] = useMemo(() => {
//     return [
//       {
//         label: "Occupancy",
//         value: `${dashboard?.occupancy?.percentage ?? 0}%`,
//         sub: `${dashboard?.occupancy?.occupied ?? 0} of ${
//           dashboard?.occupancy?.total ?? 0
//         } beds occupied`,
//         subColor: "text-slate-400",
//         valueColor: "text-blue-600",
//         icon: Bed,
//         iconBg: "bg-blue-50",
//         iconColor: "text-blue-500",
//       },

//       {
//         label: "Vacancy Pipeline",
//         value: String(
//           vacancyPipeline?.vacantBeds ?? 0
//         ),
//         sub: "upcoming vacancy",
//         subColor: "text-slate-400",
//         valueColor: "text-emerald-600",
//         icon: Armchair,
//         iconBg: "bg-emerald-50",
//         iconColor: "text-emerald-500",
//       },

//       {
//         label: "Open Issues",
//         value: String(
//           dashboard?.openIssues ?? 0
//         ),
//         sub: "currently open",
//         subColor: "text-slate-400",
//         valueColor: "text-violet-600",
//         icon: AlertTriangle,
//         iconBg: "bg-violet-50",
//         iconColor: "text-violet-500",
//       },

//       {
//         label: "Rent Status",
//         value: String(
//           rentStatus?.overdue ?? 0
//         ),
//         sub: "overdue",
//         subColor: "text-orange-500",
//         valueColor: "text-orange-500",
//         icon: IndianRupee,
//         iconBg: "bg-orange-50",
//         iconColor: "text-orange-500",
//       },
//     ];
//   }, [
//     dashboard,
//     vacancyPipeline,
//     rentStatus,
//   ]);

//   /* ---------------------------------------------------------------- */
//   /* Dynamic snapshot                                                 */
//   /* ---------------------------------------------------------------- */

//   const snapshotMetrics: SnapshotMetric[] =
//     useMemo(() => {
//       const occupancy =
//         dashboard?.occupancy?.percentage ?? 0;

//       const openIssues =
//         dashboard?.openIssues ?? 0;

//       const upcomingVacancy =
//         vacancyPipeline?.upcomingVacancy ?? 0;

//       const overdueRent =
//         rentStatus?.overdue ?? 0;

//       return [
//         {
//           label: "Avg Occupancy",
//           value: `${occupancy}%`,
//           valueColor: "text-blue-600",
//           augValue: occupancy,
//           sepValue: occupancy,
//           max: 100,
//           barColor: "bg-blue-500",
//           delta: `${dashboard?.occupancy?.occupied ?? 0} occupied`,
//           deltaColor: "text-emerald-600",
//         },

//         {
//           label: "Open Issues",
//           value: String(openIssues),
//           valueColor: "text-emerald-600",
//           augValue: openIssues,
//           sepValue: openIssues,
//           max: Math.max(openIssues, 10),
//           barColor: "bg-emerald-500",
//           delta: "currently open",
//           deltaColor: "text-slate-400",
//         },

//         {
//           label: "Upcoming Vacancy",
//           value: String(upcomingVacancy),
//           valueColor: "text-violet-600",
//           augValue: upcomingVacancy,
//           sepValue: upcomingVacancy,
//           max: Math.max(upcomingVacancy, 20),
//           barColor: "bg-violet-500",
//           delta: "upcoming",
//           deltaColor: "text-slate-400",
//         },

//         {
//           label: "Overdue Rent",
//           value: String(overdueRent),
//           valueColor: "text-orange-500",
//           augValue: overdueRent,
//           sepValue: overdueRent,
//           max: Math.max(overdueRent, 15),
//           barColor: "bg-orange-500",
//           delta: "residents overdue",
//           deltaColor: "text-red-500",
//         },
//       ];
//     }, [
//       dashboard,
//       vacancyPipeline,
//       rentStatus,
//     ]);

//   /* ---------------------------------------------------------------- */
//   /* Reports                                                          */
//   /* ---------------------------------------------------------------- */

//   const reports: ReportItem[] = useMemo(
//     () => [
//       {
//         title: "Occupancy Report",
//         subtitle:
//           "Occupancy, beds and vacancy summary",
//         icon: BarChart3,
//         iconBg: "bg-blue-50",
//         iconColor: "text-blue-500",
//         type: "occupancy",
//       },

//       {
//         title: "Resident Summary",
//         subtitle:
//           "Resident and active resident summary",
//         icon: Users,
//         iconBg: "bg-emerald-50",
//         iconColor: "text-emerald-500",
//         type: "residents",
//       },

//       {
//         title: "Issue Summary",
//         subtitle:
//           "Open issues and vacancy pipeline summary",
//         icon: AlertTriangle,
//         iconBg: "bg-orange-50",
//         iconColor: "text-orange-500",
//         type: "issues",
//       },

//       {
//         title: "Rent Status Summary",
//         subtitle:
//           "Paid, due, partial and overdue summary",
//         icon: IndianRupee,
//         iconBg: "bg-violet-50",
//         iconColor: "text-violet-500",
//         type: "rent",
//       },
//     ],
//     []
//   );

//   /* ---------------------------------------------------------------- */
//   /* Download individual report                                      */
//   /* ---------------------------------------------------------------- */

//   const handleDownloadReport = async (
//   report: ReportItem
// ): Promise<void> => {
//   if (!aggregations || !selectedPgId) {
//     return;
//   }

//   setDownloadingReport(report.title);

//   try {
//     const pgLabel =
//       currentPgName 

//     if (report.type === "occupancy") {
//       downloadDoc(
//         `${pgLabel}-occupancy-report.doc`,
//         "Occupancy Report",
//         pgLabel,
//         [
//           [
//             "Total Beds",
//             bedMap?.totalBeds ?? 0,
//           ],
//           [
//             "Occupied Beds",
//             bedMap?.occupiedBeds ?? 0,
//           ],
//           [
//             "Vacant Beds",
//             bedMap?.vacantBeds ?? 0,
//           ],
//           [
//   "Notice Beds",
//   vacancyPipeline?.upcomingVacancy ?? 0,
// ],
//           [
//             "Reserved Beds",
//             bedMap?.reservedBeds ?? 0,
//           ],
//           [
//             "Occupancy Percentage",
//             `${dashboard?.occupancy?.percentage ?? 0}%`,
//           ],
//         ]
//       );
//     }

//     if (report.type === "residents") {
//       downloadDoc(
//         `${pgLabel}-resident-summary.doc`,
//         "Resident Summary",
//         pgLabel,
//         [
//           [
//             "Total Residents",
//             residents?.totalResidents ?? 0,
//           ],
//           [
//             "Active Residents",
//             residents?.activeResidents ?? 0,
//           ],
//         ]
//       );
//     }

//     if (report.type === "issues") {
//       downloadDoc(
//         `${pgLabel}-issue-summary.doc`,
//         "Issue Summary",
//         pgLabel,
//         [
//           [
//             "Open Issues",
//             dashboard?.openIssues ?? 0,
//           ],
//           [
//             "Upcoming Vacancy",
//             vacancyPipeline?.upcomingVacancy ?? 0,
//           ],
//           [
//             "Open Enquiries",
//             vacancyPipeline?.enquiriesOpen ?? 0,
//           ],
//         ]
//       );
//     }

//     if (report.type === "rent") {
//       downloadDoc(
//         `${pgLabel}-rent-status-report.doc`,
//         "Rent Status Summary",
//         pgLabel,
//         [
//           [
//             "Total Rent",
//             rentStatus?.totalRent ?? 0,
//           ],
//           [
//             "Paid",
//             rentStatus?.paid ?? 0,
//           ],
//           [
//             "Due",
//             rentStatus?.due ?? 0,
//           ],
//           [
//             "Partial",
//             rentStatus?.partial ?? 0,
//           ],
//           [
//             "Overdue",
//             rentStatus?.overdue ?? 0,
//           ],
//         ]
//       );
//     }
//   } finally {
//     setDownloadingReport(null);
//   }
// };
//   /* ---------------------------------------------------------------- */
//   /* Export monthly report                                           */
//   /* ---------------------------------------------------------------- */

//   const handleExportMonthlyReport = async (): Promise<void> => {
//   if (!aggregations || !selectedPgId) {
//     return;
//   }

//   setExportingMonthly(true);

//   try {
//     const pgLabel =
//       currentPgName || `PG-${selectedPg?.pg_name}`;

//     downloadDoc(
//       `${pgLabel}-monthly-report.doc`,
//       "Monthly PG Report",
//       pgLabel,
//       [
//         /* Occupancy */
//         [
//           "Total Beds",
//           bedMap?.totalBeds ?? 0,
//         ],
//         [
//           "Occupied Beds",
//           bedMap?.occupiedBeds ?? 0,
//         ],
//         [
//           "Vacant Beds",
//           bedMap?.vacantBeds ?? 0,
//         ],
//         [
//   "Notice Beds",
//   vacancyPipeline?.upcomingVacancy ?? 0,
// ],
//         [
//           "Reserved Beds",
//           bedMap?.reservedBeds ?? 0,
//         ],
//         [
//           "Occupancy Percentage",
//           `${dashboard?.occupancy?.percentage ?? 0}%`,
//         ],

//         /* Residents */
//         [
//           "Total Residents",
//           residents?.totalResidents ?? 0,
//         ],
//         [
//           "Active Residents",
//           residents?.activeResidents ?? 0,
//         ],

//         /* Vacancy */
//         [
//           "Upcoming Vacancy",
//           vacancyPipeline?.upcomingVacancy ?? 0,
//         ],
//         [
//           "Open Enquiries",
//           vacancyPipeline?.enquiriesOpen ?? 0,
//         ],

//         /* Issues */
//         [
//           "Open Issues",
//           dashboard?.openIssues ?? 0,
//         ],

//         /* Rent */
//         [
//           "Total Rent",
//           rentStatus?.totalRent ?? 0,
//         ],
//         [
//           "Paid",
//           rentStatus?.paid ?? 0,
//         ],
//         [
//           "Due",
//           rentStatus?.due ?? 0,
//         ],
//         [
//           "Partial",
//           rentStatus?.partial ?? 0,
//         ],
//         [
//           "Overdue",
//           rentStatus?.overdue ?? 0,
//         ],
//       ]
//     );
//   } finally {
//     setExportingMonthly(false);
//   }
// };

//   /* ---------------------------------------------------------------- */
//   /* No PG selected                                                   */
//   /* ---------------------------------------------------------------- */

//   if (!selectedPgId) {
//     return (
//       <PageShell noScroll bottomPad={56}>
//         <div className="flex h-full min-h-0 items-center justify-center">
//           <div className="rounded-md border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
//             <p className="text-sm font-bold text-slate-900">
//               Select a PG
//             </p>

//             <p className="mt-1 text-xs text-slate-500">
//               Select a PG to view its reports.
//             </p>
//           </div>
//         </div>
//       </PageShell>
//     );
//   }

//   /* ---------------------------------------------------------------- */
//   /* Main UI                                                          */
//   /* ---------------------------------------------------------------- */

//   return (
//     <PageShell noScroll bottomPad={56}>
//       {/* Mobile / tablet top bar */}
//       <div className="flex h-[29px] shrink-0 items-center justify-between sm:h-[34px] lg:hidden">
//         <span className="text-[15px] font-extrabold leading-none text-blue-600 sm:text-base">
//           MyPG
//         </span>

//         <button
//           type="button"
//           className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md hover:bg-slate-100 sm:h-6 sm:w-6"
//           aria-label="Notifications"
//         >
//           <Bell className="h-4 w-4 text-slate-800" />

//           <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[6.5px] font-bold leading-none text-white">
//             3
//           </span>
//         </button>
//       </div>

//       {/* Title */}
//       <div className="mb-1 mt-0.5 flex shrink-0 items-center justify-between sm:mb-1.5">
//         <h1 className="text-[15px] font-extrabold leading-tight text-slate-900 sm:text-lg">
//           Reports
//         </h1>

//         <div className="flex items-center gap-1.5">
//           {/* Desktop notification */}
//           <button
//             type="button"
//             className="relative hidden rounded-md border border-slate-200 bg-white p-1.5 hover:border-slate-300 lg:flex"
//             aria-label="Notifications"
//           >
//             <Bell className="h-2.5 w-2.5 text-slate-700" />

//             <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-md bg-red-500 text-[9px] font-bold text-white">
//               3
//             </span>
//           </button>

//           {/* Selected PG */}
//           <div className="flex max-w-[150px] items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[8.5px] font-medium text-slate-700 sm:px-2.5 sm:py-1.5 sm:text-[10.5px] lg:px-2 lg:py-1">
//             <span className="truncate">
//               {currentPgName}
//             </span>

//             <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
//           </div>
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="mb-1 flex shrink-0 items-center justify-center gap-1 rounded-md border border-blue-100 bg-blue-50 py-1 text-[8px] font-semibold text-blue-600">
//           <Loader2 className="h-3 w-3 animate-spin" />
//           Loading {currentPgName} reports...
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="mb-1 flex shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[8px] font-semibold text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Top stats */}
//       <div className="mb-1 grid shrink-0 grid-cols-4 gap-1 sm:mb-1.5 sm:gap-2">
//         {topStats.map((s) => {
//           const Icon = s.icon;

//           return (
//             <div
//               key={s.label}
//               className="flex flex-col items-center gap-0.5 overflow-hidden rounded-md border border-slate-200 bg-white px-0.5 py-1.5 text-center shadow-sm sm:py-2"
//             >
//               <div
//                 className={`flex h-[22px] w-[22px] items-center justify-center rounded-full sm:h-7 sm:w-7 ${s.iconBg}`}
//               >
//                 <Icon
//                   className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${s.iconColor}`}
//                   strokeWidth={2.2}
//                 />
//               </div>

//               <span className="text-[6px] font-semibold leading-tight text-slate-700 sm:text-[8.5px]">
//                 {s.label}
//               </span>

//               <span
//                 className={`text-[12px] font-extrabold leading-none sm:text-base ${s.valueColor}`}
//               >
//                 {loading ? "—" : s.value}
//               </span>

//               <span
//                 className={`hidden text-[6.5px] font-semibold leading-tight sm:block ${s.subColor}`}
//               >
//                 {s.sub}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* This Month Snapshot */}
//       <div className="mb-1 flex shrink-0 flex-col gap-1 overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-sm sm:mb-1.5 sm:p-3">
//         <div className="flex items-center justify-between">
//           <span className="text-[9.5px] font-extrabold text-slate-900 sm:text-[13px]">
//             PG Snapshot
//           </span>

//           <span className="flex items-center gap-1 text-[7.5px] font-medium text-slate-500 sm:text-[10px]">
//             <Calendar className="hidden h-3 w-3 text-slate-400 sm:block" />

//             {new Date().toLocaleDateString(
//               "en-IN",
//               {
//                 month: "short",
//                 year: "numeric",
//               }
//             )}

//             <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
//           </span>
//         </div>

//         <div className="grid grid-cols-4 gap-1 sm:gap-2">
//           {snapshotMetrics.map((m) => (
//             <MiniBarChart
//               key={m.label}
//               metric={m}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Available Reports */}
//       <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
//         <div className="flex shrink-0 items-center justify-between">
//           <span className="text-[9.5px] font-extrabold text-slate-900 sm:text-[13px]">
//             Available Reports
//           </span>

//           <span className="truncate text-[7px] font-medium text-slate-400 sm:text-[9px]">
//             {currentPgName}
//           </span>
//         </div>

//         <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto lg:gap-0.5">
//           {reports.map((r) => {
//             const Icon = r.icon;

//             const isDownloading =
//               downloadingReport === r.title;

//             return (
//               <div
//                 key={r.title}
//                 className="flex shrink-0 items-center justify-between gap-1.5 rounded-md border border-slate-100 px-2 py-1.5 sm:px-2.5 sm:py-2 lg:px-2 lg:py-1"
//               >
//                 <div className="flex min-w-0 items-center gap-1.5">
//                   <div
//                     className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-8 sm:w-8 ${r.iconBg}`}
//                   >
//                     <Icon
//                       className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${r.iconColor}`}
//                       strokeWidth={2.2}
//                     />
//                   </div>

//                   <div className="min-w-0">
//                     <div className="whitespace-nowrap text-[8.5px] font-bold text-slate-900 sm:text-[11px]">
//                       {r.title}
//                     </div>

//                     <div className="hidden truncate text-[9px] font-medium text-slate-500 sm:block">
//                       {r.subtitle}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     handleDownloadReport(r)
//                   }
//                   disabled={
//                     loading ||
//                     isDownloading ||
//                     !aggregations
//                   }
//                   className="shrink-0 rounded-md p-1 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:p-1.5"
//                   aria-label={`Download ${r.title}`}
//                 >
//                   {isDownloading ? (
//                     <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
//                   ) : (
//                     <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                   )}
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Export Monthly Report */}
//         <button
//           type="button"
//           onClick={handleExportMonthlyReport}
//           disabled={
//             loading ||
//             exportingMonthly ||
//             !aggregations
//           }
//           className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 py-2 text-[9px] font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-[11px]"
//         >
//           {exportingMonthly ? (
//             <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
//           ) : (
//             <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//           )}

//           {exportingMonthly
//             ? "Preparing Report..."
//             : "Export Monthly Report"}
//         </button>
//       </div>
//     </PageShell>
//   );
// }


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bed,
  Armchair,
  IndianRupee,
  Bell,
  ChevronDown,
  Calendar,
  BarChart3,
  Users,
  AlertTriangle,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import { usePgAggregationsStore } from "@/app/shared/store/aggregationsStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface TopStat {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  valueColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface SnapshotMetric {
  label: string;
  value: string;
  valueColor: string;
  augValue: number;
  sepValue: number;
  max: number;
  barColor: string;
  delta: string;
  deltaColor: string;
}

interface ReportItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  type: "occupancy" | "residents" | "issues" | "rent";
}

/* ------------------------------------------------------------------ */
/* Mini bar chart                                                     */
/* ------------------------------------------------------------------ */

function MiniBarChart({
  metric,
}: {
  metric: SnapshotMetric;
}): React.ReactElement {
  const augPct =
    metric.max > 0
      ? Math.min(100, (metric.augValue / metric.max) * 100)
      : 0;

  const sepPct =
    metric.max > 0
      ? Math.min(100, (metric.sepValue / metric.max) * 100)
      : 0;

  return (
    <div className="flex min-w-0 flex-col items-center">
      <span className="text-center text-[6.5px] font-semibold leading-tight text-slate-500 sm:text-[8px] lg:text-[7px]">
        {metric.label}
      </span>

      <span
        className={`text-[12px] font-extrabold leading-none sm:text-sm ${metric.valueColor}`}
      >
        {metric.value}
      </span>

      <div className="mt-0.5 flex h-7 w-full items-end justify-center gap-1 sm:h-10">
        <div className="flex h-full items-end">
          <div
            className={`w-2 rounded-t-sm sm:w-3 ${metric.barColor} opacity-60`}
            style={{
              height: `${augPct}%`,
            }}
          />
        </div>

        <div className="flex h-full items-end">
          <div
            className={`w-2 rounded-t-sm sm:w-3 ${metric.barColor}`}
            style={{
              height: `${sepPct}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-0.5 hidden w-full justify-center gap-3 sm:flex">
        <span className="text-[7px] font-medium text-slate-400">
          Previous
        </span>

        <span className="text-[7px] font-medium text-slate-400">
          Current
        </span>
      </div>

      <span
        className={`mt-0.5 text-[6px] font-bold sm:text-[7px] ${metric.deltaColor}`}
      >
        {metric.delta}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Word document download helper                                      */
/* ------------------------------------------------------------------ */

function downloadDoc(
  filename: string,
  title: string,
  pgName: string,
  rows: Array<[string, string | number]>
): void {
  const generatedDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const tableRows = rows
    .map(
      ([metric, value]) => `
        <tr>
          <td style="
            border:1px solid #d9dee8;
            padding:8px 10px;
            font-weight:600;
            color:#374151;
            width:55%;
          ">
            ${escapeHtml(metric)}
          </td>

          <td style="
            border:1px solid #d9dee8;
            padding:8px 10px;
            color:#111827;
            font-weight:600;
          ">
            ${escapeHtml(String(value))}
          </td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
      </head>

      <body style="
        font-family:Arial, Helvetica, sans-serif;
        color:#111827;
        margin:40px;
      ">

        <div style="
          border-bottom:2px solid #2563eb;
          padding-bottom:12px;
          margin-bottom:22px;
        ">

          <div style="
            font-size:24px;
            font-weight:700;
            color:#2563eb;
            margin-bottom:5px;
          ">
            MyPG
          </div>

          <div style="
            font-size:20px;
            font-weight:700;
            color:#111827;
          ">
            ${escapeHtml(title)}
          </div>

          <div style="
            margin-top:8px;
            font-size:13px;
            color:#6b7280;
          ">
            PG Name:
            <strong style="color:#111827;">
              ${escapeHtml(pgName)}
            </strong>
          </div>

          <div style="
            margin-top:3px;
            font-size:13px;
            color:#6b7280;
          ">
            Generated on:
            ${escapeHtml(generatedDate)}
          </div>
        </div>

        <table
          style="
            width:100%;
            border-collapse:collapse;
            margin-top:15px;
            font-size:13px;
          "
        >
          <thead>
            <tr>
              <th style="
                border:1px solid #d9dee8;
                padding:9px 10px;
                background:#f3f6fb;
                text-align:left;
                color:#374151;
              ">
                Metric
              </th>

              <th style="
                border:1px solid #d9dee8;
                padding:9px 10px;
                background:#f3f6fb;
                text-align:left;
                color:#374151;
              ">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="
          margin-top:28px;
          padding-top:10px;
          border-top:1px solid #e5e7eb;
          font-size:11px;
          color:#9ca3af;
        ">
          MyPG — ${escapeHtml(pgName)}
        </div>

      </body>
    </html>
  `;

  const blob = new Blob(
    [
      "\ufeff",
      html,
    ],
    {
      type: "application/msword;charset=utf-8",
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* HTML escaping                                                      */
/* ------------------------------------------------------------------ */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export default function OwnersReportsPage(): React.ReactElement {
  /* ---------------------------------------------------------------- */
  /* Selected PG                                                      */
  /* ---------------------------------------------------------------- */

  const selectedPg = useSelectedPgStore(
    (state) => state.selectedPg
  );

  const selectedPgId = useSelectedPgStore(
    (state) => state.selectedPgId
  );

  /*
   * PgInfo can differ depending on the common API definition.
   * Keep this tolerant so the UI can display either common naming.
   */

  const currentPgName =
    (selectedPg as any)?.pg_name ?? "";

  /* ---------------------------------------------------------------- */
  /* Aggregations store                                               */
  /* ---------------------------------------------------------------- */

  const aggregations = usePgAggregationsStore(
    (state) => state.aggregations
  );

  const loading = usePgAggregationsStore(
    (state) => state.loading
  );

  const error = usePgAggregationsStore(
    (state) => state.error
  );

  const fetchAggregations = usePgAggregationsStore(
    (state) => state.fetchAggregations
  );

  /* ---------------------------------------------------------------- */
  /* Fetch whenever selected PG changes                               */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!selectedPgId) {
      return;
    }

    fetchAggregations(selectedPgId);
  }, [selectedPgId, fetchAggregations]);

  /* ---------------------------------------------------------------- */
  /* Export state                                                     */
  /* ---------------------------------------------------------------- */

  const [downloadingReport, setDownloadingReport] =
    useState<string | null>(null);

  const [exportingMonthly, setExportingMonthly] =
    useState(false);

  /* ---------------------------------------------------------------- */
  /* Current aggregation values                                      */
  /* ---------------------------------------------------------------- */

  const dashboard = aggregations?.dashboard;

  const bedMap = aggregations?.bedMap;

  const residents = aggregations?.residents;

  const rentStatus = aggregations?.rentStatus;

  /* ---------------------------------------------------------------- */
  /* Dynamic top statistics                                          */
  /* ---------------------------------------------------------------- */

  const topStats: TopStat[] = useMemo(() => {
    return [
      {
        label: "Occupancy",

        value: `${dashboard?.occupancy?.percentage ?? 0}%`,

        sub: `${dashboard?.occupancy?.occupied ?? 0} of ${
          dashboard?.occupancy?.total ?? 0
        } beds occupied`,

        subColor: "text-slate-400",

        valueColor: "text-blue-600",

        icon: Bed,

        iconBg: "bg-blue-50",

        iconColor: "text-blue-500",
      },

      {
        label: "Vacancy Pipeline",

        value: String(
          bedMap?.vacantBeds ?? 0
        ),

        sub: "vacant beds",

        subColor: "text-slate-400",

        valueColor: "text-emerald-600",

        icon: Armchair,

        iconBg: "bg-emerald-50",

        iconColor: "text-emerald-500",
      },

      {
        label: "Open Issues",

        value: String(
          dashboard?.openIssues ?? 0
        ),

        sub: "currently open",

        subColor: "text-slate-400",

        valueColor: "text-violet-600",

        icon: AlertTriangle,

        iconBg: "bg-violet-50",

        iconColor: "text-violet-500",
      },

      {
        label: "Rent Status",

        value: String(
          rentStatus?.overdue ?? 0
        ),

        sub: "overdue",

        subColor: "text-orange-500",

        valueColor: "text-orange-500",

        icon: IndianRupee,

        iconBg: "bg-orange-50",

        iconColor: "text-orange-500",
      },
    ];
  }, [
    dashboard,
    bedMap,
    rentStatus,
  ]);

  /* ---------------------------------------------------------------- */
  /* Dynamic snapshot                                                 */
  /* ---------------------------------------------------------------- */

  const snapshotMetrics: SnapshotMetric[] =
    useMemo(() => {
      const occupancy =
        dashboard?.occupancy?.percentage ?? 0;

      const openIssues =
        dashboard?.openIssues ?? 0;

      /*
       * Current bedMap API/type exposes noticeBeds.
       * There is no upcomingVacancy property in this object.
       */

      const noticeBeds =
        bedMap?.noticeBeds ?? 0;

      const overdueRent =
        rentStatus?.overdue ?? 0;

      return [
        {
          label: "Avg Occupancy",

          value: `${occupancy}%`,

          valueColor: "text-blue-600",

          augValue: occupancy,

          sepValue: occupancy,

          max: 100,

          barColor: "bg-blue-500",

          delta: `${
            dashboard?.occupancy?.occupied ?? 0
          } occupied`,

          deltaColor: "text-emerald-600",
        },

        {
          label: "Open Issues",

          value: String(openIssues),

          valueColor: "text-emerald-600",

          augValue: openIssues,

          sepValue: openIssues,

          max: Math.max(openIssues, 10),

          barColor: "bg-emerald-500",

          delta: "currently open",

          deltaColor: "text-slate-400",
        },

        {
          label: "Notice Beds",

          value: String(noticeBeds),

          valueColor: "text-violet-600",

          augValue: noticeBeds,

          sepValue: noticeBeds,

          max: Math.max(noticeBeds, 20),

          barColor: "bg-violet-500",

          delta: "beds in notice",

          deltaColor: "text-slate-400",
        },

        {
          label: "Overdue Rent",

          value: String(overdueRent),

          valueColor: "text-orange-500",

          augValue: overdueRent,

          sepValue: overdueRent,

          max: Math.max(overdueRent, 15),

          barColor: "bg-orange-500",

          delta: "residents overdue",

          deltaColor: "text-red-500",
        },
      ];
    }, [
      dashboard,
      bedMap,
      rentStatus,
    ]);

  /* ---------------------------------------------------------------- */
  /* Reports                                                          */
  /* ---------------------------------------------------------------- */

  const reports: ReportItem[] = useMemo(
    () => [
      {
        title: "Occupancy Report",

        subtitle:
          "Occupancy, beds and vacancy summary",

        icon: BarChart3,

        iconBg: "bg-blue-50",

        iconColor: "text-blue-500",

        type: "occupancy",
      },

      {
        title: "Resident Summary",

        subtitle:
          "Resident and active resident summary",

        icon: Users,

        iconBg: "bg-emerald-50",

        iconColor: "text-emerald-500",

        type: "residents",
      },

      {
        title: "Issue Summary",

        subtitle:
          "Open issues and notice-bed summary",

        icon: AlertTriangle,

        iconBg: "bg-orange-50",

        iconColor: "text-orange-500",

        type: "issues",
      },

      {
        title: "Rent Status Summary",

        subtitle:
          "Paid, due, partial and overdue summary",

        icon: IndianRupee,

        iconBg: "bg-violet-50",

        iconColor: "text-violet-500",

        type: "rent",
      },
    ],
    []
  );

  /* ---------------------------------------------------------------- */
  /* Download individual report                                      */
  /* ---------------------------------------------------------------- */

  const handleDownloadReport = async (
    report: ReportItem
  ): Promise<void> => {
    if (!aggregations || !selectedPgId) {
      return;
    }

    setDownloadingReport(report.title);

    try {
      const pgLabel =
        currentPgName || `PG-${selectedPgId}`;

      /* ------------------------------------------------------------ */
      /* Occupancy report                                             */
      /* ------------------------------------------------------------ */

      if (report.type === "occupancy") {
        downloadDoc(
          `${pgLabel}-occupancy-report.doc`,
          "Occupancy Report",
          pgLabel,
          [
            [
              "Total Beds",
              bedMap?.totalBeds ?? 0,
            ],

            [
              "Occupied Beds",
              bedMap?.occupiedBeds ?? 0,
            ],

            [
              "Vacant Beds",
              bedMap?.vacantBeds ?? 0,
            ],

            [
              "Notice Beds",
              bedMap?.noticeBeds ?? 0,
            ],

            [
              "Reserved Beds",
              bedMap?.reservedBeds ?? 0,
            ],

            [
              "Occupancy Percentage",
              `${dashboard?.occupancy?.percentage ?? 0}%`,
            ],
          ]
        );
      }

      /* ------------------------------------------------------------ */
      /* Resident report                                              */
      /* ------------------------------------------------------------ */

      if (report.type === "residents") {
        downloadDoc(
          `${pgLabel}-resident-summary.doc`,
          "Resident Summary",
          pgLabel,
          [
            [
              "Total Residents",
              residents?.totalResidents ?? 0,
            ],

            [
              "Active Residents",
              residents?.activeResidents ?? 0,
            ],
          ]
        );
      }

      /* ------------------------------------------------------------ */
      /* Issue report                                                 */
      /* ------------------------------------------------------------ */

      if (report.type === "issues") {
        downloadDoc(
          `${pgLabel}-issue-summary.doc`,
          "Issue Summary",
          pgLabel,
          [
            [
              "Open Issues",
              dashboard?.openIssues ?? 0,
            ],

            [
              "Notice Beds",
              bedMap?.noticeBeds ?? 0,
            ],
          ]
        );
      }

      /* ------------------------------------------------------------ */
      /* Rent report                                                  */
      /* ------------------------------------------------------------ */

      if (report.type === "rent") {
        downloadDoc(
          `${pgLabel}-rent-status-report.doc`,
          "Rent Status Summary",
          pgLabel,
          [
            [
              "Total Rent",
              rentStatus?.totalRent ?? 0,
            ],

            [
              "Paid",
              rentStatus?.paid ?? 0,
            ],

            [
              "Due",
              rentStatus?.due ?? 0,
            ],

            [
              "Partial",
              rentStatus?.partial ?? 0,
            ],

            [
              "Overdue",
              rentStatus?.overdue ?? 0,
            ],
          ]
        );
      }
    } finally {
      setDownloadingReport(null);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Export monthly report                                           */
  /* ---------------------------------------------------------------- */

  const handleExportMonthlyReport =
    async (): Promise<void> => {
      if (!aggregations || !selectedPgId) {
        return;
      }

      setExportingMonthly(true);

      try {
        const pgLabel =
          currentPgName ||
          `PG-${selectedPgId}`;

        downloadDoc(
          `${pgLabel}-monthly-report.doc`,
          "Monthly PG Report",
          pgLabel,
          [
            /* ------------------------------------------------------ */
            /* Occupancy                                              */
            /* ------------------------------------------------------ */

            [
              "Total Beds",
              bedMap?.totalBeds ?? 0,
            ],

            [
              "Occupied Beds",
              bedMap?.occupiedBeds ?? 0,
            ],

            [
              "Vacant Beds",
              bedMap?.vacantBeds ?? 0,
            ],

            [
              "Notice Beds",
              bedMap?.noticeBeds ?? 0,
            ],

            [
              "Reserved Beds",
              bedMap?.reservedBeds ?? 0,
            ],

            [
              "Occupancy Percentage",
              `${dashboard?.occupancy?.percentage ?? 0}%`,
            ],

            /* ------------------------------------------------------ */
            /* Residents                                              */
            /* ------------------------------------------------------ */

            [
              "Total Residents",
              residents?.totalResidents ?? 0,
            ],

            [
              "Active Residents",
              residents?.activeResidents ?? 0,
            ],

            /* ------------------------------------------------------ */
            /* Issues                                                 */
            /* ------------------------------------------------------ */

            [
              "Open Issues",
              dashboard?.openIssues ?? 0,
            ],

            /* ------------------------------------------------------ */
            /* Rent                                                   */
            /* ------------------------------------------------------ */

            [
              "Total Rent",
              rentStatus?.totalRent ?? 0,
            ],

            [
              "Paid",
              rentStatus?.paid ?? 0,
            ],

            [
              "Due",
              rentStatus?.due ?? 0,
            ],

            [
              "Partial",
              rentStatus?.partial ?? 0,
            ],

            [
              "Overdue",
              rentStatus?.overdue ?? 0,
            ],
          ]
        );
      } finally {
        setExportingMonthly(false);
      }
    };

  /* ---------------------------------------------------------------- */
  /* No PG selected                                                   */
  /* ---------------------------------------------------------------- */

  if (!selectedPgId) {
    return (
      <PageShell
        noScroll
        bottomPad={56}
      >
        <div className="flex h-full min-h-0 items-center justify-center">
          <div className="rounded-md border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-900">
              Select a PG
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Select a PG to view its reports.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Main UI                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <PageShell
      noScroll
      bottomPad={56}
    >
      {/* ------------------------------------------------------------ */}
      {/* Mobile / tablet top bar                                     */}
      {/* ------------------------------------------------------------ */}

      <div className="flex h-[29px] shrink-0 items-center justify-between sm:h-[34px] lg:hidden">
        <span className="text-[15px] font-extrabold leading-none text-blue-600 sm:text-base">
          MyPG
        </span>

        <button
          type="button"
          className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md hover:bg-slate-100 sm:h-6 sm:w-6"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-slate-800" />

          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[6.5px] font-bold leading-none text-white">
            3
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Title                                                        */}
      {/* ------------------------------------------------------------ */}

      <div className="mb-1 mt-0.5 flex shrink-0 items-center justify-between sm:mb-1.5">
        <h1 className="text-[15px] font-extrabold leading-tight text-slate-900 sm:text-lg">
          Reports
        </h1>

        <div className="flex items-center gap-1.5">
          {/* Desktop notification */}

          <button
            type="button"
            className="relative hidden rounded-md border border-slate-200 bg-white p-1.5 hover:border-slate-300 lg:flex"
            aria-label="Notifications"
          >
            <Bell className="h-2.5 w-2.5 text-slate-700" />

            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-md bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* Selected PG */}

          <div className="flex max-w-[150px] items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[8.5px] font-medium text-slate-700 sm:px-2.5 sm:py-1.5 sm:text-[10.5px] lg:px-2 lg:py-1">
            <span className="truncate">
              {currentPgName}
            </span>

            <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Loading                                                      */}
      {/* ------------------------------------------------------------ */}

      {loading && (
        <div className="mb-1 flex shrink-0 items-center justify-center gap-1 rounded-md border border-blue-100 bg-blue-50 py-1 text-[8px] font-semibold text-blue-600">
          <Loader2 className="h-3 w-3 animate-spin" />

          Loading {currentPgName} reports...
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Error                                                        */}
      {/* ------------------------------------------------------------ */}

      {error && (
        <div className="mb-1 flex shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[8px] font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Top stats                                                    */}
      {/* ------------------------------------------------------------ */}

      <div className="mb-1 grid shrink-0 grid-cols-4 gap-1 sm:mb-1.5 sm:gap-2">
        {topStats.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="flex flex-col items-center gap-0.5 overflow-hidden rounded-md border border-slate-200 bg-white px-0.5 py-1.5 text-center shadow-sm sm:py-2"
            >
              <div
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full sm:h-7 sm:w-7 ${s.iconBg}`}
              >
                <Icon
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${s.iconColor}`}
                  strokeWidth={2.2}
                />
              </div>

              <span className="text-[6px] font-semibold leading-tight text-slate-700 sm:text-[8.5px]">
                {s.label}
              </span>

              <span
                className={`text-[12px] font-extrabold leading-none sm:text-base ${s.valueColor}`}
              >
                {loading ? "—" : s.value}
              </span>

              <span
                className={`hidden text-[6.5px] font-semibold leading-tight sm:block ${s.subColor}`}
              >
                {s.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* PG Snapshot                                                  */}
      {/* ------------------------------------------------------------ */}

      <div className="mb-1 flex shrink-0 flex-col gap-1 overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-sm sm:mb-1.5 sm:p-3">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-extrabold text-slate-900 sm:text-[13px]">
            PG Snapshot
          </span>

          <span className="flex items-center gap-1 text-[7.5px] font-medium text-slate-500 sm:text-[10px]">
            <Calendar className="hidden h-3 w-3 text-slate-400 sm:block" />

            {new Date().toLocaleDateString(
              "en-IN",
              {
                month: "short",
                year: "numeric",
              }
            )}

            <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {snapshotMetrics.map((m) => (
            <MiniBarChart
              key={m.label}
              metric={m}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Available Reports                                            */}
      {/* ------------------------------------------------------------ */}

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        <div className="flex shrink-0 items-center justify-between">
          <span className="text-[9.5px] font-extrabold text-slate-900 sm:text-[13px]">
            Available Reports
          </span>

          <span className="truncate text-[7px] font-medium text-slate-400 sm:text-[9px]">
            {currentPgName}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto lg:gap-0.5">
          {reports.map((r) => {
            const Icon = r.icon;

            const isDownloading =
              downloadingReport === r.title;

            return (
              <div
                key={r.title}
                className="flex shrink-0 items-center justify-between gap-1.5 rounded-md border border-slate-100 px-2 py-1.5 sm:px-2.5 sm:py-2 lg:px-2 lg:py-1"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-8 sm:w-8 ${r.iconBg}`}
                  >
                    <Icon
                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${r.iconColor}`}
                      strokeWidth={2.2}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="whitespace-nowrap text-[8.5px] font-bold text-slate-900 sm:text-[11px]">
                      {r.title}
                    </div>

                    <div className="hidden truncate text-[9px] font-medium text-slate-500 sm:block">
                      {r.subtitle}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadReport(r)
                  }
                  disabled={
                    loading ||
                    isDownloading ||
                    !aggregations
                  }
                  className="shrink-0 rounded-md p-1 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:p-1.5"
                  aria-label={`Download ${r.title}`}
                >
                  {isDownloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                  ) : (
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Export Monthly Report                                      */}
        {/* ---------------------------------------------------------- */}

        <button
          type="button"
          onClick={handleExportMonthlyReport}
          disabled={
            loading ||
            exportingMonthly ||
            !aggregations
          }
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 py-2 text-[9px] font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-[11px]"
        >
          {exportingMonthly ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
          ) : (
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}

          {exportingMonthly
            ? "Preparing Report..."
            : "Export Monthly Report"}
        </button>
      </div>
    </PageShell>
  );
}