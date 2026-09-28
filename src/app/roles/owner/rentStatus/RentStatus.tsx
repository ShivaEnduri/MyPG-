


import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  FileText,
  PieChart,
  AlertTriangle,
  Search,
  Send,
  Download,
  Eye,
  MessageCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { usePgAggregationsStore } from "@/app/shared/store/aggregationsStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { useRentStatusResidentsStore } from "@/app/shared/store/rentStatusResidentsStore";
import { usePgCurrentStatusStore } from "@/app/shared/store/currentStatusStore";
import {
  addPgAlert,
  addPgPaymentInfoApi,
} from "@/app/shared/services/api/commonApiServices";
import SuccessModal from "@/ui/Shared/SuccessModal";
import { PageShell } from "@/app/shared/components/PageShell";

/* ============================================================
   TYPES
============================================================ */

export type RentStatusKind =
  | "Paid"
  | "Due"
  | "Partial"
  | "Overdue";

export interface RentStatusProps {
  pgName?: string;
  totalResidentsOverride?: number;
}

/* ============================================================
   STATUS METADATA
============================================================ */

const statusMeta: Record<
  RentStatusKind,
  {
    bg: string;
    text: string;
    icon: React.ElementType;
    barColor: string;
  }
> = {
  Paid: {
    bg: "#DCFCE7",
    text: "#16A34A",
    icon: CheckCircle2,
    barColor: "#16A34A",
  },

  Due: {
    bg: "#FFE9DA",
    text: "#EA580C",
    icon: FileText,
    barColor: "#F97316",
  },

  Partial: {
    bg: "#DBEAFE",
    text: "#2563EB",
    icon: PieChart,
    barColor: "#2563EB",
  },

  Overdue: {
    bg: "#FEE2E2",
    text: "#DC2626",
    icon: AlertTriangle,
    barColor: "#DC2626",
  },
};

/* ============================================================
   ACTION METADATA
============================================================ */

const actionMeta: Record<
  RentStatusKind,
  {
    label: string;
    icon: React.ElementType;
    title: string;
  }
> = {
  Paid: {
    label: "View",
    icon: Eye,
    title: "View resident",
  },

  Due: {
    label: "Remind",
    icon: Bell,
    title: "Send rent reminder",
  },

  Partial: {
    label: "Follow-up",
    icon: MessageCircle,
    title: "Follow up with resident",
  },

  Overdue: {
    label: "Remind",
    icon: Bell,
    title: "Send rent reminder",
  },
};

/* ============================================================
   FLUID CLAMP HELPER
============================================================ */

const c = (
  min: string,
  mid: string,
  max: string
) => `clamp(${min},${mid},${max})`;

/* ============================================================
   COMPONENT
============================================================ */

export default function RentStatus({
  pgName,
  totalResidentsOverride,
}: RentStatusProps): React.ReactElement {
  /* ==========================================================
     SELECTED PG
  ========================================================== */

  const selectedPg = useSelectedPgStore(
    (state) => state.selectedPg
  );

  const selectedPgId = useSelectedPgStore(
    (state) => state.selectedPgId
  );

  /* ==========================================================
     AGGREGATIONS STORE
  ========================================================== */

  const aggregations = usePgAggregationsStore(
    (state) => state.aggregations
  );

  const loading = usePgAggregationsStore(
    (state) => state.loading
  );

  const error = usePgAggregationsStore(
    (state) => state.error
  );

  const fetchAggregations =
    usePgAggregationsStore(
      (state) => state.fetchAggregations
    );

  const clearAggregations =
    usePgAggregationsStore(
      (state) => state.clearAggregations
    );

    /* ==========================================================
   PG CURRENT STATUS STORE
========================================================== */

const currentStatuses = usePgCurrentStatusStore(
  (state) => state.statuses
);

const currentStatusesLoading = usePgCurrentStatusStore(
  (state) => state.loading
);

const fetchCurrentStatuses = usePgCurrentStatusStore(
  (state) => state.fetchStatuses
);

  /* ==========================================================
     RESIDENT RENT STATUS STORE
  ========================================================== */

  const residents =
    useRentStatusResidentsStore(
      (state) => state.residents
    );

  const residentsLoading =
    useRentStatusResidentsStore(
      (state) => state.loading
    );

  const residentsError =
    useRentStatusResidentsStore(
      (state) => state.error
    );

  const fetchResidents =
    useRentStatusResidentsStore(
      (state) => state.fetchResidents
    );

  const clearResidents =
    useRentStatusResidentsStore(
      (state) => state.clearResidents
    );

    /* ==========================================================
   ROW SELECTION
========================================================== */

const [selectedResidentIds, setSelectedResidentIds] =
  useState<Set<number>>(new Set());

const [addingPayment, setAddingPayment] =
  useState(false);

const [selectedPaymentStatus, setSelectedPaymentStatus] =
  useState<number>(18);

const [paymentAmount, setPaymentAmount] =
  useState("");

const [paymentMode, setPaymentMode] =
  useState<number>(2);

const [paymentRemarks, setPaymentRemarks] =
  useState("");
  /* ==========================================================
     LOCAL ACTION STATES
  ========================================================== */

  const [sendingBulkReminder, setSendingBulkReminder] =
    useState(false);

  const [successModalOpen, setSuccessModalOpen] =
  useState(false);

const [successModalMessage, setSuccessModalMessage] =
  useState("");

  const [exportingStatus, setExportingStatus] =
    useState(false);

  /* ==========================================================
     FETCH DATA WHEN PG CHANGES
  ========================================================== */

  useEffect(() => {
    if (!selectedPgId) {
      clearAggregations();
      clearResidents();
      return;
    }

    fetchAggregations(selectedPgId);
    fetchResidents(selectedPgId);
  }, [
    selectedPgId,
    fetchAggregations,
    clearAggregations,
    fetchResidents,
    clearResidents,
  ]);

  useEffect(() => {
  fetchCurrentStatuses();
}, [fetchCurrentStatuses]);


/* ==========================================================
   PAYMENT STATUS OPTIONS
========================================================== */

const paymentStatusOptions = useMemo(() => {
  const allowedStatusIds = [18, 19, 27];

  return currentStatuses
    .filter((status) =>
      allowedStatusIds.includes(
        Number(status.id)
      )
    )
    .map((status) => ({
      id: Number(status.id),
      label: status.status_code,
    }));
}, [currentStatuses]);

  /* ==========================================================
     PG NAME
  ========================================================== */

  const displayPgName =
    pgName ||
    selectedPg?.pg_name ||
    "Select PG";



  /* ==========================================================
     AGGREGATION VALUES
  ========================================================== */

  const rentStatus =
    aggregations?.rentStatus;

  const residentsAggregation =
    aggregations?.residents;

  const paidCount =
    rentStatus?.paid ?? 0;

  const dueCount =
    rentStatus?.due ?? 0;

  const partialCount =
    rentStatus?.partial ?? 0;

  const overdueCount =
    rentStatus?.overdue ?? 0;

  const totalResidents =
    totalResidentsOverride ??
    residentsAggregation?.totalResidents ??
    residents.length ??
    0;

  /* ==========================================================
     STATS
  ========================================================== */

  const stats = useMemo(() => {
    const counts: Record<
      RentStatusKind,
      number
    > = {
      Paid: paidCount,
      Due: dueCount,
      Partial: partialCount,
      Overdue: overdueCount,
    };

    const pct = (count: number) => {
      if (totalResidents <= 0) {
        return 0;
      }

      return Math.round(
        (count / totalResidents) * 100
      );
    };

    return (
      Object.keys(counts) as RentStatusKind[]
    ).map((key) => ({
      key,
      count: counts[key],
      pct: pct(counts[key]),
    }));
  }, [
    paidCount,
    dueCount,
    partialCount,
    overdueCount,
    totalResidents,
  ]);

  /* ==========================================================
     SEARCH
  ========================================================== */

  const [search, setSearch] =
    useState("");

  /* ==========================================================
     FILTER RESIDENTS
  ========================================================== */

  const filteredResidents = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return residents;
    }

    return residents.filter((resident) => {
      const fullName =
        `${resident.resident.firstName} ${resident.resident.lastName}`
          .trim()
          .toLowerCase();

      const roomName =
        resident.booking.room_name
          ?.toLowerCase() ?? "";

      const status =
        resident.payment.status
          ?.toLowerCase() ?? "";

      const bookingId = String(
        resident.bookingId
      ).toLowerCase();

      const userId = String(
        resident.userId
      ).toLowerCase();

      return (
        fullName.includes(query) ||
        roomName.includes(query) ||
        status.includes(query) ||
        bookingId.includes(query) ||
        userId.includes(query)
      );
    });
  }, [residents, search]);

  /* ==========================================================
     DYNAMIC ROW FIT
  ========================================================== */

  const listRef =
    useRef<HTMLDivElement | null>(null);

  const rowRef =
    useRef<HTMLDivElement | null>(null);

  const [fitCount, setFitCount] =
    useState(3);

  const [showAll, setShowAll] =
    useState(false);

  /* ==========================================================
     RESET VIEW
  ========================================================== */

  useEffect(() => {
  setShowAll(false);
  setSelectedResidentIds(new Set());

  setPaymentAmount("");
  setPaymentRemarks("");
}, [selectedPgId, search]);
  /* ==========================================================
     CALCULATE ROWS THAT FIT
  ========================================================== */

  useEffect(() => {
    const container =
      listRef.current;

    if (!container) {
      return;
    }

    const recompute = () => {
      const row =
        rowRef.current;

      if (!row) {
        setFitCount(
          Math.min(
            filteredResidents.length,
            3
          )
        );

        return;
      }

      const availableHeight =
        container.clientHeight;

      const rowHeight =
        row.getBoundingClientRect()
          .height;

      if (
        availableHeight <= 0 ||
        rowHeight <= 0
      ) {
        return;
      }

      const styles =
        getComputedStyle(container);

      const gap =
        parseFloat(
          styles.rowGap || "0"
        ) || 0;

      const count = Math.floor(
        (availableHeight + gap) /
          (rowHeight + gap)
      );

      setFitCount(
        Math.min(
          filteredResidents.length,
          Math.max(1, count)
        )
      );
    };

    recompute();

    const ro =
      new ResizeObserver(recompute);

    ro.observe(container);

    window.addEventListener(
      "resize",
      recompute
    );

    window.addEventListener(
      "orientationchange",
      recompute
    );

    return () => {
      ro.disconnect();

      window.removeEventListener(
        "resize",
        recompute
      );

      window.removeEventListener(
        "orientationchange",
        recompute
      );
    };
  }, [filteredResidents.length]);

  /* ==========================================================
     VISIBLE RESIDENTS
  ========================================================== */

  const visibleResidents =
    showAll
      ? filteredResidents
      : filteredResidents.slice(
          0,
          fitCount
        );

  const canExpand =
    filteredResidents.length >
    fitCount;

  /* ==========================================================
     GRID COLUMNS
  ========================================================== */

  const gridCols =
  "grid-cols-[20px_minmax(0,2.1fr)_1.2fr_0.95fr_1.05fr_0.85fr_0.8fr]";

  /* ==========================================================
     LOADING
  ========================================================== */

  const isInitialLoading =
    loading && !aggregations;

   
/* ==========================================================
   RESIDENT SELECTION ID
========================================================== */

const getResidentSelectionId = (
  resident: any
): number | null => {
  const userId = resident?.userId;

  if (
    userId === null ||
    userId === undefined ||
    Number.isNaN(Number(userId))
  ) {
    return null;
  }

  return Number(userId);
};

const toggleResidentSelection = (
  resident: any
) => {
  const userId =
    getResidentSelectionId(resident);

  if (userId === null) {
    return;
  }

  setSelectedResidentIds((previous) => {
    const next = new Set(previous);

    if (next.has(userId)) {
      next.delete(userId);
    } else {
      /*
       * Payment should currently be added
       * for one resident at a time.
       */
      next.add(userId);
    }

    return next;
  });
};

const allVisibleSelected =
  visibleResidents.length > 0 &&
  visibleResidents.every((resident: any) => {
    const userId =
      getResidentSelectionId(resident);

    return (
      userId !== null &&
      selectedResidentIds.has(userId)
    );
  });

const toggleSelectAllVisible = () => {
  setSelectedResidentIds((previous) => {
    const next = new Set(previous);

    if (allVisibleSelected) {
      visibleResidents.forEach(
        (resident: any) => {
          const userId =
            getResidentSelectionId(resident);

          if (userId !== null) {
            next.delete(userId);
          }
        }
      );
    } else {
      /*
       * We allow selecting multiple residents
       * for reminders, but Add Payment requires
       * exactly one resident.
       */
      visibleResidents.forEach(
        (resident: any) => {
          const userId =
            getResidentSelectionId(resident);

          if (userId !== null) {
            next.add(userId);
          }
        }
      );
    }

    return next;
  });
};

 /* ==========================================================
   SEND BULK RENT REMINDERS
========================================================== */

const handleSendBulkReminder = async () => {
  if (!selectedPgId) {
    return;
  }

  if (selectedResidentIds.size === 0) {
    setSuccessModalMessage(
      "Please select at least one resident."
    );
    setSuccessModalOpen(true);
    return;
  }

  setSendingBulkReminder(true);

  try {
    const selectedResidents = residents.filter(
  (resident: any) => {
    const userId =
      getResidentSelectionId(resident);

    return (
      userId !== null &&
      selectedResidentIds.has(userId)
    );
  }
);

    if (!selectedResidents.length) {
      setSuccessModalMessage(
        "No valid selected residents found."
      );
      setSuccessModalOpen(true);
      return;
    }

    const results = await Promise.allSettled(
      selectedResidents.map((resident: any) =>
        addPgAlert({
          alert_cat: 1,
          alert_receiver_role: 1,
          alert_receiver: Number(
            resident.userId
          ),
          alert_title: "Rent Reminder",
          alert_description: null,
          alert_priority: 1,
          pg_id: Number(selectedPgId),
          alert_status: 24,
        } as any)
      )
    );

    const successful = results.filter(
      (result) =>
        result.status === "fulfilled"
    ).length;

    const failed =
      results.length - successful;

    if (successful > 0) {
      setSuccessModalMessage(
        failed === 0
          ? `Rent reminder sent successfully to ${successful} selected resident${
              successful === 1 ? "" : "s"
            }.`
          : `Rent reminder sent successfully to ${successful} selected resident${
              successful === 1 ? "" : "s"
            }. ${failed} reminder${
              failed === 1 ? "" : "s"
            } failed.`
      );

      setSuccessModalOpen(true);

      /*
       * Clear selection after successful reminder.
       */
      setSelectedResidentIds(new Set());
    }
  } catch (err) {
    console.error(
      "Bulk rent reminder error:",
      err
    );

    setSuccessModalMessage(
      "Failed to send rent reminders. Please try again."
    );

    setSuccessModalOpen(true);
  } finally {
    setSendingBulkReminder(false);
  }
};


/* ==========================================================
   ADD PAYMENT
========================================================== */

const handleAddPayment = async () => {
  if (!selectedPgId) {
    setSuccessModalMessage(
      "Please select a PG."
    );

    setSuccessModalOpen(true);
    return;
  }

  /*
   * Payment must be added for exactly
   * one resident.
   */
  if (selectedResidentIds.size === 0) {
    setSuccessModalMessage(
      "Please select a resident."
    );

    setSuccessModalOpen(true);
    return;
  }

  if (selectedResidentIds.size > 1) {
    setSuccessModalMessage(
      "Please select only one resident to add a payment."
    );

    setSuccessModalOpen(true);
    return;
  }

  if (!selectedPaymentStatus) {
    setSuccessModalMessage(
      "Please select a payment status."
    );

    setSuccessModalOpen(true);
    return;
  }

  const amount = Number(paymentAmount);

  if (
    !paymentAmount ||
    Number.isNaN(amount) ||
    amount <= 0
  ) {
    setSuccessModalMessage(
      "Please enter a valid payment amount."
    );

    setSuccessModalOpen(true);
    return;
  }

  const selectedUserId =
    Array.from(selectedResidentIds)[0];

  const resident = residents.find(
    (item: any) =>
      Number(item.userId) ===
      Number(selectedUserId)
  );

  if (!resident) {
    setSuccessModalMessage(
      "Selected resident could not be found."
    );

    setSuccessModalOpen(true);
    return;
  }

  const invoiceId =
    resident.invoiceId;

  if (
    invoiceId === null ||
    invoiceId === undefined ||
    Number.isNaN(Number(invoiceId))
  ) {
    setSuccessModalMessage(
      "This resident does not have an invoice yet."
    );

    setSuccessModalOpen(true);
    return;
  }

  const invoiceAmount = Number(
    resident.invoice?.totalAmount ?? 0
  );

  /*
   * Do not allow payment greater than
   * invoice amount for now.
   *
   * If your business allows advance payment,
   * this validation can be removed later.
   */
  if (
    invoiceAmount > 0 &&
    amount > invoiceAmount
  ) {
    setSuccessModalMessage(
      `Payment amount cannot be greater than the invoice amount of ₹${invoiceAmount.toLocaleString(
        "en-IN"
      )}.`
    );

    setSuccessModalOpen(true);
    return;
  }

  setAddingPayment(true);

  try {
    /*
     * payment_mode_id:
     *
     * 1 = Cash
     * 2 = Online
     * 3 = UPI
     *
     * Replace these IDs with your actual
     * payment-mode master IDs if different.
     */

    const payload = {
      cash_payment:
        paymentMode === 1
          ? amount
          : 0,

      inv_id:
        Number(invoiceId),

      payment_mode_id:
        Number(paymentMode),

      payment_status:
        Number(selectedPaymentStatus),

      actual_payment:
        amount,

      remarks:
        paymentRemarks.trim() ||
        null,
    };

    console.log(
      "Adding PG payment:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    await addPgPaymentInfoApi(
      payload
    );

    const selectedResidentName =
      `${resident.resident?.firstName ?? ""} ${
        resident.resident?.lastName ?? ""
      }`
        .replace(/\s+/g, " ")
        .trim();

    setSuccessModalMessage(
      `Payment of ₹${amount.toLocaleString(
        "en-IN"
      )} added successfully for ${
        selectedResidentName ||
        "the selected resident"
      }.`
    );

    setSuccessModalOpen(true);

    /*
     * Reset payment form.
     */
    setSelectedResidentIds(
      new Set()
    );

    setPaymentAmount("");

    setPaymentRemarks("");

    /*
     * Refresh rent records and
     * dashboard aggregations.
     */
    await fetchResidents(
      selectedPgId
    );

    await fetchAggregations(
      selectedPgId
    );
  } catch (err) {
    console.error(
      "Add payment error:",
      err
    );

    setSuccessModalMessage(
      "Failed to add payment. Please try again."
    );

    setSuccessModalOpen(true);
  } finally {
    setAddingPayment(false);
  }
};

  /* ==========================================================
     EXCEL EXPORT
  ========================================================== */

  const handleExportStatus =
    () => {
      if (!residents.length) {
        return;
      }

      setExportingStatus(true);

      try {
        /*
         * Excel-compatible HTML table.
         *
         * This creates an .xls file without
         * requiring the xlsx package.
         */

        const escapeHtml = (
          value: unknown
        ) => {
          return String(
            value ?? ""
          )
            .replace(
              /&/g,
              "&amp;"
            )
            .replace(
              /</g,
              "&lt;"
            )
            .replace(
              />/g,
              "&gt;"
            )
            .replace(
              /"/g,
              "&quot;"
            )
            .replace(
              /'/g,
              "&#039;"
            );
        };

        const getStatus =
          (
            status?: string
          ): RentStatusKind => {
            const raw =
              status
                ?.toLowerCase()
                .trim();

            if (raw === "paid") {
              return "Paid";
            }

            if (
              raw ===
              "partial"
            ) {
              return "Partial";
            }

            if (
              raw ===
              "overdue"
            ) {
              return "Overdue";
            }

            return "Due";
          };

        const formatDate = (
          value: unknown
        ) => {
          if (!value) {
            return "—";
          }

          const date =
            new Date(
              String(value)
            );

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return "—";
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

        const rows =
          residents
            .map(
              (resident) => {
                const fullName =
                  `${resident.resident.firstName} ${resident.resident.lastName}`
                    .replace(
                      /\s+/g,
                      " "
                    )
                    .trim();

                const status =
                  getStatus(
                    resident
                      .payment
                      .status
                  );

                return `
                  <tr>
                    <td>${escapeHtml(
                      fullName ||
                        "Unknown"
                    )}</td>

                    <td>${escapeHtml(
                      resident
                        .booking
                        .room_name
                    )}</td>

                    <td>${escapeHtml(
                      resident
                        .booking
                        .bed_number
                    )}</td>

                    <td>${escapeHtml(
                      resident.userId
                    )}</td>

                    <td>${escapeHtml(
                      resident.bookingId
                    )}</td>

                    <td>${escapeHtml(
                      resident.invoiceId ??
                        "—"
                    )}</td>

                    <td>${escapeHtml(
                      resident
                        .invoice
                        .totalAmount ??
                        "—"
                    )}</td>

                    <td>${escapeHtml(
                      formatDate(
                        resident
                          .invoice
                          .dueDate
                      )
                    )}</td>

                    <td>${escapeHtml(
                      status
                    )}</td>
                  </tr>
                `;
              }
            )
            .join("");

        const html = `
          <html>
            <head>
              <meta charset="UTF-8" />
              <style>
                table {
                  border-collapse: collapse;
                  width: 100%;
                  font-family: Arial, sans-serif;
                }

                th,
                td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                }

                th {
                  background: #2563eb;
                  color: white;
                  font-weight: bold;
                }

                td {
                  background: white;
                }
              </style>
            </head>

            <body>
              <h2>
                ${escapeHtml(
                  displayPgName
                )} - Rent Status
              </h2>

              <p>
                Exported on:
                ${escapeHtml(
                  new Date().toLocaleString(
                    "en-IN"
                  )
                )}
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Room</th>
                    <th>Bed</th>
                    <th>User ID</th>
                    <th>Booking ID</th>
                    <th>Invoice ID</th>
                    <th>Rent (₹)</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  ${rows}
                </tbody>
              </table>
            </body>
          </html>
        `;

        const blob =
          new Blob(
            [html],
            {
              type:
                "application/vnd.ms-excel;charset=utf-8;",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download = `${displayPgName
          .replace(
            /[^a-z0-9]/gi,
            "_"
          )}_Rent_Status.xls`;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          url
        );
      } catch (err) {
        console.error(
          "Export status error:",
          err
        );
      } finally {
        setExportingStatus(
          false
        );
      }
    };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
     <PageShell noScroll>
      <div
        className={[
          "h-full w-full flex flex-col overflow-hidden box-border",
          "max-w-[820px] sm:max-w-[clamp(500px,85vw,1050px)]",

          `p-[${c(
            "7px",
            "1.5vh",
            "16px"
          )}]`,

          `sm:p-[${c(
            "10px",
            "1.8vh",
            "22px"
          )}]`,

          `px-[${c(
            "10px",
            "1.9vw",
            "20px"
          )}]`,

          `sm:px-[${c(
            "20px",
            "3vw",
            "46px"
          )}]`,

          `gap-[${c(
            "4px",
            "0.85vh",
            "10px"
          )}]`,
        ].join(" ")}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex-shrink-0 flex items-center justify-between">
          <span
            className={`font-extrabold text-[#2563EB] tracking-tight text-[${c(
              "15px",
              "2.4vh",
              "25px"
            )}] sm:text-[${c(
              "19px",
              "2.7vh",
              "28px"
            )}]`}
          >
            MyPG
          </span>

          <div className="relative flex">
            <Bell
              size={22}
              color="#111827"
              strokeWidth={2}
            />

            <span
              className={`absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center border-2 border-[#F5F6F9] px-[2px] text-[${c(
                "7px",
                "0.9vh",
                "10px"
              )}]`}
            >
              3
            </span>
          </div>
        </div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="flex-shrink-0 flex items-center justify-between">
          <h1
            className={`font-extrabold text-[#0F172A] m-0 tracking-tight text-[${c(
              "14px",
              "2.4vh",
              "23px"
            )}] sm:text-[${c(
              "18px",
              "2.7vh",
              "27px"
            )}]`}
          >
            Rent Status
          </h1>

          <div
            className={`flex items-center gap-1 border border-[#E3E6EC] rounded-md bg-white font-semibold text-[#1F2430] whitespace-nowrap py-[${c(
              "3px",
              "0.6vh",
              "7px"
            )}] px-[${c(
              "7px",
              "1vw",
              "13px"
            )}] text-[${c(
              "8.5px",
              "1.3vh",
              "12px"
            )}]`}
          >
            {displayPgName}

            <ChevronDown
              size={14}
              color="#8A8F98"
            />
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {(error ||
          residentsError) && (
          <div
            className="
              flex-shrink-0
              rounded-md
              border
              border-red-200
              bg-red-50
              text-red-600
              font-semibold
              px-3
              py-2
              text-xs
            "
          >
            {error ||
              residentsError}
          </div>
        )}

       

       
        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div
          className={`flex-shrink-0 grid grid-cols-4 gap-[${c(
            "5px",
            "0.8vh",
            "10px"
          )}]`}
        >
          {stats.map((s) => {
            const meta =
              statusMeta[s.key];

            const Icon =
              meta.icon;

            return (
              <div
                key={s.key}
                className={`bg-white border border-[#ECEEF2] rounded-md flex flex-col items-center text-center py-[${c(
                  "5px",
                  "1.1vh",
                  "13px"
                )}] px-[${c(
                  "3px",
                  "0.55vh",
                  "7px"
                )}] gap-[${c(
                  "1px",
                  "0.35vh",
                  "4px"
                )}]`}
              >
                <div
                  className={`rounded-full flex items-center justify-center w-[${c(
                    "18px",
                    "3.2vh",
                    "32px"
                  )}] h-[${c(
                    "18px",
                    "3.2vh",
                    "32px"
                  )}]`}
                  style={{
                    background:
                      meta.bg,
                  }}
                >
                  <Icon
                    size="55%"
                    color={
                      meta.text
                    }
                    strokeWidth={
                      2.2
                    }
                  />
                </div>

                <span
                  className={`text-[#5B6472] font-semibold leading-tight text-[${c(
                    "8px",
                    "1.7vh",
                    "12px"
                  )}]`}
                >
                  {s.key}
                </span>

                <span
                  className="font-extrabold leading-none"
                  style={{
                    color:
                      meta.text,
                    fontSize: c(
                      "15px",
                      "2.7vh",
                      "23px"
                    ),
                  }}
                >
                  {isInitialLoading
                    ? "—"
                    : s.count}
                </span>

                <span
                  className={`text-[#8A8F98] font-semibold leading-none text-[${c(
                    "7px",
                    "1.6vh",
                    "10.5px"
                  )}]`}
                >
                  {isInitialLoading
                    ? "—"
                    : `${s.pct}%`}
                </span>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            RENT OVERVIEW
        ===================================================== */}

        <div
          className={`flex-shrink-0 bg-white border border-[#ECEEF2] rounded-md flex flex-col p-[${c(
            "7px",
            "1.25vh",
            "14px"
          )}] gap-[${c(
            "3px",
            "0.65vh",
            "8px"
          )}]`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-extrabold text-[#0F172A] text-[${c(
                "10px",
                "1.55vh",
                "15px"
              )}] sm:text-[${c(
                "11.5px",
                "1.7vh",
                "17px"
              )}]`}
            >
              Rent Overview
            </span>

            {rentStatus && (
              <span
                className={`font-semibold text-[#8A8F98] text-[${c(
                  "7px",
                  "1.15vh",
                  "11px"
                )}]`}
              >
                Total Rent: ₹
                {(
                  rentStatus.totalRent ??
                  0
                ).toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
          </div>

          {stats.map((s) => {
            const meta =
              statusMeta[s.key];

            return (
              <div
                key={s.key}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex-shrink-0 text-[#374151] font-medium w-[${c(
                    "38px",
                    "5.2vw",
                    "60px"
                  )}] text-[${c(
                    "8px",
                    "1.6vh",
                    "11.5px"
                  )}]`}
                >
                  {s.key}
                </span>

                <div
                  className={`flex-1 bg-[#EDEFF3] rounded-full overflow-hidden h-[${c(
                    "5px",
                    "1.5vh",
                    "8px"
                  )}]`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        isInitialLoading
                          ? 0
                          : s.pct
                      }%`,
                      background:
                        meta.barColor,
                    }}
                  />
                </div>

                <span
                  className={`flex-shrink-0 text-right font-bold text-[#0F172A] text-[${c(
                    "8.5px",
                    "1.35vh",
                    "12px"
                  )}]`}
                  style={{
                    minWidth: c(
                      "46px",
                      "6vw",
                      "64px"
                    ),
                  }}
                >
                  {isInitialLoading
                    ? "—"
                    : s.count}{" "}
                  <span className="text-[#8A8F98] font-medium">
                    {isInitialLoading
                      ? ""
                      : `(${s.pct}%)`}
                  </span>
                </span>
              </div>
            );
          })}

          <div className="border-t border-[#F1F2F5] pt-[6px] mt-[2px] flex items-center justify-between">
            <span
              className={`font-semibold text-[#374151] text-[${c(
                "8.5px",
                "1.6vh",
                "12px"
              )}]`}
            >
              Total Residents
            </span>

            <span
              className={`font-extrabold text-[#0F172A] text-[${c(
                "9.5px",
                "1.6vh",
                "13px"
              )}]`}
            >
              {isInitialLoading
                ? "—"
                : totalResidents}{" "}
              <span className="text-[#8A8F98] font-medium">
                {isInitialLoading
                  ? ""
                  : "(100%)"}
              </span>
            </span>
          </div>
        </div>

        {/* =====================================================
            RESIDENT RENT STATUS
        ===================================================== */}

        <div
          className={`flex-1 min-h-0 overflow-hidden bg-white border border-[#ECEEF2] rounded-md flex flex-col p-[${c(
            "7px",
            "1.25vh",
            "14px"
          )}] gap-[${c(
            "3px",
            "0.65vh",
            "8px"
          )}]`}
        >
          {/* Header */}

          <div className="flex-shrink-0 flex items-center justify-between gap-2">
  <div className="flex items-center gap-2 min-w-0">
    <span
      className={`font-extrabold text-[#0F172A] whitespace-nowrap text-[${c(
        "10px",
        "1.55vh",
        "15px"
      )}] sm:text-[${c(
        "11.5px",
        "1.7vh",
        "17px"
      )}]`}
    >
      Resident Rent Status
    </span>

    {selectedResidentIds.size > 0 && (
      <span className="text-[#2563EB] font-bold text-[10px] whitespace-nowrap">
        {selectedResidentIds.size} selected
      </span>
    )}
  </div>

  <div
    className={`flex items-center gap-1.5 border border-[#E3E6EC] rounded-md bg-white flex-1 max-w-[240px] py-[${c(
      "3.5px",
      "0.65vh",
      "8px"
    )}] px-[${c(
      "7px",
      "1vh",
      "12px"
    )}]`}
  >
    <Search
      size={14}
      color="#9AA0AA"
    />

    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="Search resident"
      className={`outline-none border-none bg-transparent w-full text-[#1F2430] placeholder:text-[#9AA0AA] text-[${c(
        "8px",
        "1.15vh",
        "11.5px"
      )}]`}
    />
  </div>
</div>
          {/* Column headers */}

          <div
            className={`flex-shrink-0 grid ${gridCols} items-center text-[#9AA0AA] font-medium gap-2 text-[${c(
              "6.5px",
              "1.2vh",
              "10.5px"
            )}]`}
          >
           <label className="flex items-center justify-center cursor-pointer">
  <input
    type="checkbox"
    checked={allVisibleSelected}
    onChange={toggleSelectAllVisible}
    disabled={visibleResidents.length === 0}
    className="h-3 w-3 sm:h-3.5 sm:w-3.5 cursor-pointer accent-[#2563EB]"
  />
</label>

<span>
  Resident
</span>

            <span>
              Room / Bed
            </span>

            <span>
              Rent (₹)
            </span>

            <span>
              Due Date
            </span>

            <span>
              Status
            </span>

            <span className="text-right">
              Action
            </span>
          </div>

          {/* Resident rows */}

          <div
            className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-[3px]"
            ref={listRef}
          >
            {residentsLoading ? (
              <div className="flex-1 flex items-center justify-center text-[#8A8F98] font-medium text-sm">
                Loading rent records...
              </div>
            ) : filteredResidents.length >
              0 ? (
              visibleResidents.map(
                (r, i) => {
                  const fullName =
                    `${r.resident.firstName} ${r.resident.lastName}`
                      .replace(
                        /\s+/g,
                        " "
                      )
                      .trim();

                  const rawStatus =
                    r.payment.status
                      ?.toLowerCase();

                  const statusKey: RentStatusKind =
                    rawStatus ===
                    "paid"
                      ? "Paid"
                      : rawStatus ===
                        "partial"
                      ? "Partial"
                      : rawStatus ===
                        "overdue"
                      ? "Overdue"
                      : "Due";

                  const meta =
                    statusMeta[
                      statusKey
                    ];

                  const action =
                    actionMeta[
                      statusKey
                    ];

                  const ActionIcon =
                    action.icon;

                  const dueDate =
                    r.invoice.dueDate
                      ? new Date(
                          r.invoice.dueDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )
                      : "—";

                  return (
                    <div
  key={`${r.invoiceId}-${r.bookingId}`}
  ref={
    i === 0
      ? rowRef
      : undefined
  }
  className={`grid ${gridCols} items-center gap-2 border-b border-[#F1F2F5] py-[5px] min-h-[30px] ${
    (() => {
     const userId =
  getResidentSelectionId(r);

return userId !== null &&
  selectedResidentIds.has(userId)
        ? "bg-[#EFF6FF]"
        : "";
    })()
  }`}
>
      {/* Select */}

<label className="flex items-center justify-center cursor-pointer">
  <input
  type="checkbox"
  checked={(() => {
    const userId =
      getResidentSelectionId(r);

    return (
      userId !== null &&
      selectedResidentIds.has(userId)
    );
  })()}
  onChange={() =>
    toggleResidentSelection(r)
  }
  className="h-3.5 w-3.5 cursor-pointer accent-[#2563EB]"
/>
</label>
                      {/* Resident */}

                      <div className="min-w-0">
                        <span
                          className={`block truncate font-semibold text-[#1F2430] text-[${c(
                            "8px",
                            "1.2vh",
                            "11.5px"
                          )}]`}
                          title={
                            fullName
                          }
                        >
                          {fullName ||
                            "Unknown"}
                        </span>
                      </div>

                      {/* Room / Bed */}

                      <span
                        className={`truncate text-[#5B6472] text-[${c(
                          "7.5px",
                          "1.1vh",
                          "11px"
                        )}]`}
                        title={`${r.booking.room_name} / Bed ${r.booking.bed_number}`}
                      >
                        {
                          r.booking
                            .room_name
                        }
                        {" / "}
                        {
                          r.booking
                            .bed_number
                        }
                      </span>

                      {/* Rent */}

                      <span
                        className={`truncate text-[#1F2430] font-semibold text-[${c(
                          "7.5px",
                          "1.1vh",
                          "11px"
                        )}]`}
                      >
                        ₹
                        {Number(
                          r.invoice
                            .totalAmount ??
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {/* Due Date */}

                      <span
                        className={`truncate text-[#5B6472] text-[${c(
                          "7px",
                          "1.1vh",
                          "10.5px"
                        )}]`}
                      >
                        {dueDate}
                      </span>

                      {/* Status */}

                      <span
                        className={`inline-flex w-fit items-center rounded-md px-1.5 py-0.5 font-bold text-[${c(
                          "7px",
                          "1.05vh",
                          "10px"
                        )}]`}
                        style={{
                          background:
                            meta.bg,
                          color:
                            meta.text,
                        }}
                      >
                        {
                          statusKey
                        }
                      </span>

                      {/* Action */}

                     <button
  type="button"
  title={action.title}
  aria-label={action.title}
  className={`flex items-center justify-end gap-1 text-[#2563EB] font-semibold whitespace-nowrap text-[${c(
    "7px",
    "1.05vh",
    "10.5px"
  )}]`}
>
  <ActionIcon
    size={c(
      "11px",
      "1.5vh",
      "15px"
    )}
    strokeWidth={2}
  />

  <span className="hidden sm:inline">
    {action.label}
  </span>
</button>
                    </div>
                  );
                }
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
                <FileText
                  size={22}
                  color="#9AA0AA"
                />

                <span className="text-[#5B6472] font-semibold text-xs">
                  {search
                    ? "No residents found"
                    : "No resident rent records"}
                </span>

                <span className="text-[#9AA0AA] text-[10px]">
                  {search
                    ? "Try another search."
                    : "Rent records are not available for this PG."}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="flex-shrink-0 flex items-center justify-between pt-[4px] border-t border-[#F1F2F5]">
            <span
              className={`text-[#8A8F98] font-medium text-[${c(
                "7px",
                "1.05vh",
                "10.5px"
              )}]`}
            >
              {residentsLoading
                ? "Loading..."
                : filteredResidents.length ===
                  0
                ? "Showing 0 residents"
                : `Showing 1 to ${
                    showAll
                      ? filteredResidents.length
                      : Math.min(
                          fitCount,
                          filteredResidents.length
                        )
                  } of ${
                    filteredResidents.length
                  } residents`}
            </span>

            {canExpand && (
              <button
                type="button"
                onClick={() =>
                  setShowAll(
                    (v) => !v
                  )
                }
                className={`flex items-center gap-0.5 text-[#2563EB] font-bold text-[${c(
                  "7.5px",
                  "1.1vh",
                  "10.5px"
                )}]`}
              >
                {showAll
                  ? "Show Less"
                  : "View All"}

                <ChevronRight
                  size={13}
                />
              </button>
            )}
          </div>
        </div>

         {/* =====================================================
    PAYMENT REMARKS
===================================================== */}

{/* <div className="flex-shrink-0 flex items-center gap-2">
  <input
    type="text"
    maxLength={100}
    value={paymentRemarks}
    onChange={(e) =>
      setPaymentRemarks(
        e.target.value
      )
    }
    disabled={
      addingPayment ||
      selectedResidentIds.size !== 1
    }
    placeholder="Payment remarks (optional)"
    className={`flex-1 min-w-0 border border-[#E3E6EC] bg-white text-[#1F2430] font-medium rounded-md px-3 py-2 outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed`}
  />

  <span className="flex-shrink-0 text-[9px] text-[#9AA0AA]">
    {paymentRemarks.length}/100
  </span>
</div>  */}

      {/* =====================================================
    PAYMENT ACTIONS
===================================================== */}

<div
  className={`flex-shrink-0 grid grid-cols-[1fr_1fr_auto_auto] gap-[${c(
    "4px",
    "0.8vh",
    "10px"
  )}]`}
>
  {/* =====================================================
      PAYMENT AMOUNT
  ===================================================== */}

  <input
    type="number"
    min="0"
    step="0.01"
    value={paymentAmount}
    onChange={(e) => setPaymentAmount(e.target.value)}
    disabled={
      addingPayment ||
      residentsLoading ||
      !selectedPgId ||
      selectedResidentIds.size !== 1
    }
    placeholder="Amount"
    className={`min-w-0 border border-[#E3E6EC] bg-white text-[#1F2430] font-semibold rounded-md px-[${c(
      "5px",
      "0.8vh",
      "10px"
    )}] py-[${c(
      "7px",
      "1.15vh",
      "13px"
    )}] outline-none text-[${c(
      "7px",
      "1.15vh",
      "11.5px"
    )}] disabled:opacity-50 disabled:cursor-not-allowed`}
  />

  {/* =====================================================
      PAYMENT STATUS
  ===================================================== */}

  <select
    value={selectedPaymentStatus}
    onChange={(e) => setSelectedPaymentStatus(Number(e.target.value))}
    disabled={
      currentStatusesLoading ||
      addingPayment ||
      selectedResidentIds.size !== 1
    }
    className={`min-w-0 border border-[#E3E6EC] bg-white text-[#1F2430] font-semibold rounded-md px-[${c(
      "5px",
      "0.8vh",
      "10px"
    )}] py-[${c(
      "7px",
      "1.15vh",
      "13px"
    )}] outline-none cursor-pointer text-[${c(
      "7px",
      "1.15vh",
      "11.5px"
    )}] disabled:opacity-50 disabled:cursor-not-allowed`}
    title="Select payment status"
  >
    {currentStatusesLoading ? (
      <option value="">Loading statuses...</option>
    ) : paymentStatusOptions.length === 0 ? (
      <option value="">No statuses available</option>
    ) : (
      paymentStatusOptions.map((status) => (
        <option key={status.id} value={status.id}>
          {status.label}
        </option>
      ))
    )}
  </select>

  {/* =====================================================
      ADD PAYMENT
  ===================================================== */}

  <button
    type="button"
    onClick={handleAddPayment}
    disabled={
      addingPayment ||
      residentsLoading ||
      !selectedPgId ||
      selectedResidentIds.size !== 1 ||
      paymentStatusOptions.length === 0 ||
      !paymentAmount
    }
    title="Add payment"
    className={`flex items-center justify-center gap-1.5 bg-[#16A34A] text-white font-bold rounded-md py-[${c(
      "7px",
      "1.15vh",
      "13px"
    )}] px-3 text-[${c(
      "8px",
      "1.25vh",
      "12.5px"
    )}] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {addingPayment ? (
      <Loader2 size={15} className="animate-spin" />
    ) : (
      <Plus size={15} />
    )}

    <span className="hidden sm:inline">
      {addingPayment ? "Adding..." : "Add Payment"}
    </span>
  </button>

  {/* =====================================================
      BULK REMINDER
  ===================================================== */}

  <button
    type="button"
    onClick={handleSendBulkReminder}
    disabled={
      sendingBulkReminder ||
      residentsLoading ||
      !selectedPgId ||
      selectedResidentIds.size === 0
    }
    title="Send reminder to selected residents"
    className={`flex items-center justify-center gap-1.5 bg-[#2563EB] text-white font-bold rounded-md py-[${c(
      "7px",
      "1.15vh",
      "13px"
    )}] px-3 text-[${c(
      "8px",
      "1.25vh",
      "12.5px"
    )}] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {sendingBulkReminder ? (
      <Loader2 size={15} className="animate-spin" />
    ) : (
      <Send size={15} />
    )}

    <span className="hidden sm:inline">
      {sendingBulkReminder ? "Sending..." : "Send Reminder"}
    </span>
  </button>
</div>

        {/* =====================================================
            BOTTOM NAV RESERVED SPACE
        ===================================================== */}

        <div
          className={`flex-shrink-0 border-t border-[#ECEEF2] h-[${c(
            "44px",
            "6.8vh",
            "60px"
          )}]`}
        />
      </div>
      </PageShell>
      <SuccessModal
  open={successModalOpen}
  title="Reminder Sent"
  message={successModalMessage}
  onClose={() =>
    setSuccessModalOpen(false)
  }
/>
</>
    
  );
}

