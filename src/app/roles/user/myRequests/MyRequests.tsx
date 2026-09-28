import { FC, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Wrench,
  Hourglass,
  CheckCircle2,
  Zap,
  Droplet,
  Calendar,
  DoorOpen,
  Plus,
  Phone,
  MessageCircle,
  Loader2,
  X,
  Send,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";
import { useAuth } from "../../../../hooks/context/AuthContext";

import { useServiceRequestsStore } from "@/app/shared/store/useServiceRequestsStore";

import { usePgServiceCategoryStore } from "@/app/shared/store/serviceCategoryStore";

/* ----------------------------------------------------------------------- */
/* Types                                                                    */
/* ----------------------------------------------------------------------- */

type RequestStatus = "Open" | "In Progress" | "Resolved";

type FilterKey = "All" | RequestStatus;

type Tone =
  | "blue"
  | "purple"
  | "orange"
  | "green"
  | "red";

interface RequestItem {
  id: number;
  title: string;
  date: string;
  room: string;
  description: string;
  status: RequestStatus;
  icon: React.ElementType;
  tone: Tone;
}

interface ServiceRequestForm {
  service_title: string;
  service_description: string;
  request_eta_date: string;
  SLA: string;
  service_category: string;
}

/* ----------------------------------------------------------------------- */
/* Responsive visible counts                                                */
/* ----------------------------------------------------------------------- */

const BREAKPOINT_VISIBLE_COUNTS: [
  minWidth: number,
  count: number,
][] = [
  [1280, 10],
  [1024, 8],
  [640, 6],
  [0, 5],
];

function useResponsiveVisibleCount(): number {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const computeCount = () => {
      const width = window.innerWidth;

      const match =
        BREAKPOINT_VISIBLE_COUNTS.find(
          ([minWidth]) => width >= minWidth,
        );

      setCount(match ? match[1] : 5);
    };

    computeCount();

    window.addEventListener(
      "resize",
      computeCount,
    );

    return () => {
      window.removeEventListener(
        "resize",
        computeCount,
      );
    };
  }, []);

  return count;
}

/* ----------------------------------------------------------------------- */
/* Helpers                                                                  */
/* ----------------------------------------------------------------------- */

const FILTERS: FilterKey[] = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
];

const toneIconBg: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
};

const statusBadgeClasses: Record<
  RequestStatus,
  string
> = {
  Open: "bg-orange-50 text-orange-700",
  "In Progress":
    "bg-blue-50 text-blue-700",
  Resolved:
    "bg-green-50 text-green-700",
};

/* ----------------------------------------------------------------------- */
/* Service category -> icon                                                 */
/* ----------------------------------------------------------------------- */

const WindIcon: FC<{
  className?: string;
}> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 4h8a3 3 0 1 1-3 3" />
    <path d="M4 8h13a3 3 0 1 1-3 3" />
    <path d="M4 12h8" />
    <path d="M4 16h13a3 3 0 1 0-3-3" />
    <path d="M9 20h3a3 3 0 1 0-3-3" />
  </svg>
);

const getRequestIcon = (
  serviceCategory: number,
): {
  icon: React.ElementType;
  tone: Tone;
} => {
  switch (serviceCategory) {
    case 1:
      return {
        icon: Droplet,
        tone: "blue",
      };

    case 2:
      return {
        icon: Zap,
        tone: "orange",
      };

    case 3:
      return {
        icon: WindIcon,
        tone: "purple",
      };

    case 7:
      return {
        icon: DoorOpen,
        tone: "blue",
      };

    default:
      return {
        icon: Wrench,
        tone: "blue",
      };
  }
};

/* ----------------------------------------------------------------------- */
/* Backend status mapping                                                   */
/* ----------------------------------------------------------------------- */

const getRequestStatus = (
  serviceStatus: number,
): RequestStatus | null => {
  switch (serviceStatus) {
    case 11:
      return "Open";

    case 12:
      return "In Progress";

    case 13:
      return "Resolved";

    default:
      return null;
  }
};

/* ----------------------------------------------------------------------- */
/* Date formatter                                                            */
/* ----------------------------------------------------------------------- */

const formatRequestDate = (
  dateString?: string | null,
): string => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ----------------------------------------------------------------------- */
/* API record -> UI record                                                   */
/* ----------------------------------------------------------------------- */

const mapServiceRequest = (
  request: any,
): RequestItem | null => {
  const status = getRequestStatus(
    Number(request?.service_status),
  );

  if (!status) {
    return null;
  }

  const { icon, tone } =
    getRequestIcon(
      Number(request?.service_category),
    );

  return {
    id: Number(request?.id),

    title:
      request?.service_title ||
      "Service Request",

    date: formatRequestDate(
      request?.request_create_date,
    ),

    room: "—",

    description:
      request?.service_description ||
      "No description available",

    status,

    icon,

    tone,
  };
};

/* ----------------------------------------------------------------------- */
/* Small presentational components                                           */
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
  value: number;
  valueColor: string;
}> = ({
  icon: Icon,
  tone,
  label,
  value,
  valueColor,
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
      className={`mt-1 text-[9px] font-bold leading-none sm:text-[10px] ${valueColor}`}
    >
      {value}
    </p>
  </div>
);

const RequestRow: FC<{
  item: RequestItem;
}> = ({ item }) => (
  <div className="flex items-start gap-1 border-t border-gray-100 px-1 py-1 first:border-t-0">
    <IconBox
      icon={item.icon}
      tone={item.tone}
      size="md"
    />

    <div className="min-w-0 flex-1">
      <p className="truncate text-[7px] font-bold text-gray-900 sm:text-[8px]">
        {item.title}
      </p>

      <div className="mt-0.5 flex items-center gap-1 text-[5.5px] text-gray-500 sm:text-[6px]">
        <span className="flex items-center gap-0.5">
          <Calendar className="h-1.5 w-1.5" />

          {item.date}
        </span>

        {item.room !== "—" && (
          <>
            <span>•</span>

            <span className="flex items-center gap-0.5">
              <DoorOpen className="h-1.5 w-1.5" />

              {item.room}
            </span>
          </>
        )}
      </div>

      <p className="mt-0.5 truncate text-[5.5px] text-gray-500 sm:text-[6px]">
        {item.description}
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-0.5">
      <span
        className={`rounded-full px-1 py-0.5 text-[5px] font-semibold sm:text-[5.5px] ${statusBadgeClasses[item.status]}`}
      >
        {item.status}
      </span>

      <ChevronRight className="h-2 w-2 text-gray-400" />
    </div>
  </div>
);

/* ----------------------------------------------------------------------- */
/* Raise Request Form                                                       */
/* ----------------------------------------------------------------------- */

interface RaiseRequestFormProps {
  form: ServiceRequestForm;
  setForm: React.Dispatch<
    React.SetStateAction<ServiceRequestForm>
  >;
  onSubmit: () => void;
  onClose: () => void;
  submitting: boolean;
  error: string | null;
  categories: any[];
  categoriesLoading: boolean;
}

const RaiseRequestForm: FC<
  RaiseRequestFormProps
> = ({
  form,
  setForm,
  onSubmit,
  onClose,
  submitting,
  error,
  categories,
  categoriesLoading,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">

      <div className="w-full max-w-[360px] rounded-lg border border-gray-100 bg-white shadow-xl">

        {/* ------------------------------------------------------------- */}
        {/* Form Header                                                    */}
        {/* ------------------------------------------------------------- */}

        <div className="flex items-center justify-between border-b border-gray-100 px-2 py-1.5">
          <div>
            <h2 className="text-[9px] font-extrabold text-gray-900 sm:text-[10px]">
              Raise New Request
            </h2>

            <p className="mt-0.5 text-[5.5px] text-gray-500 sm:text-[6px]">
              Tell us what service you need
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Form Body                                                       */}
        {/* ------------------------------------------------------------- */}

        <div className="space-y-1.5 px-2 py-2">

          {/* Service Category */}

          <div>
            <label className="mb-0.5 block text-[6px] font-semibold text-gray-700 sm:text-[6.5px]">
              Service Category
            </label>

            <select
              value={form.service_category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  service_category:
                    e.target.value,
                }))
              }
              disabled={
                submitting ||
                categoriesLoading
              }
              className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-[6.5px] text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 sm:text-[7px]"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map(
                (category: any) => {
                  const categoryId =
                    category?.id ??
                    category?.category_id;

                  const categoryName =
                    category?.name ??
                    category?.category_name ??
                    category?.title ??
                    `Category ${categoryId}`;

                  if (
                    categoryId ===
                    undefined
                  ) {
                    return null;
                  }

                  return (
                    <option
                      key={categoryId}
                      value={String(
                        categoryId,
                      )}
                    >
                      {categoryName}
                    </option>
                  );
                },
              )}
            </select>
          </div>

          {/* Service Title */}

          <div>
            <label className="mb-0.5 block text-[6px] font-semibold text-gray-700 sm:text-[6.5px]">
              Service Title
            </label>

            <input
              type="text"
              value={form.service_title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  service_title:
                    e.target.value,
                }))
              }
              placeholder="Enter request title"
              disabled={submitting}
              className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-[6.5px] text-gray-800 outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 sm:text-[7px]"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-0.5 block text-[6px] font-semibold text-gray-700 sm:text-[6.5px]">
              Description
            </label>

            <textarea
              value={
                form.service_description
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  service_description:
                    e.target.value,
                }))
              }
              placeholder="Describe the issue or service you need"
              rows={3}
              disabled={submitting}
              className="w-full resize-none rounded border border-gray-200 bg-white px-1.5 py-1 text-[6.5px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 sm:text-[7px]"
            />
          </div>

          {/* ETA + SLA */}

          <div className="grid grid-cols-2 gap-1">

            {/* ETA */}

            <div>
              <label className="mb-0.5 block text-[6px] font-semibold text-gray-700 sm:text-[6.5px]">
                Expected Date
              </label>

              <input
                type="date"
                value={
                  form.request_eta_date
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    request_eta_date:
                      e.target.value,
                  }))
                }
                disabled={submitting}
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-[6.5px] text-gray-800 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 sm:text-[7px]"
              />
            </div>

            {/* SLA */}

            <div>
              <label className="mb-0.5 block text-[6px] font-semibold text-gray-700 sm:text-[6.5px]">
                SLA (Hours)
              </label>

              <input
                type="number"
                min="1"
                value={form.SLA}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    SLA: e.target.value,
                  }))
                }
                placeholder="e.g. 4"
                disabled={submitting}
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-[6.5px] text-gray-800 outline-none placeholder:text-gray-300 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 sm:text-[7px]"
              />
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="rounded border border-red-100 bg-red-50 px-1.5 py-1">
              <p className="text-[6px] leading-relaxed text-red-600 sm:text-[6.5px]">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Form Footer                                                     */}
        {/* ------------------------------------------------------------- */}

        <div className="flex items-center justify-end gap-1 border-t border-gray-100 px-2 py-1.5">

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded border border-gray-200 bg-white px-2 py-1 text-[6px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 sm:text-[6.5px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-0.5 rounded bg-blue-600 px-2 py-1 text-[6px] font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[6.5px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-2 w-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-2 w-2" />
                Submit Request
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------- */
/* Main screen                                                              */
/* ----------------------------------------------------------------------- */

interface MyRequestsProps {
  bottomNavHeight?: number;
}

export const MyRequests: FC<
  MyRequestsProps
> = ({
  bottomNavHeight = 56,
}) => {
  const { user } = useAuth();

  /* --------------------------------------------------------------------- */
  /* Service request store                                                 */
  /* --------------------------------------------------------------------- */

  const {
    serviceRequests: requests,
    loading,
    error,
    fetchServiceRequests: fetchRequests,
    createServiceRequest: addRequest,
  } = useServiceRequestsStore();

  /* --------------------------------------------------------------------- */
  /* Service category store                                                */
  /* --------------------------------------------------------------------- */

  const {
    categories,
    loading: categoriesLoading,
    fetchServiceCategories,
  } = usePgServiceCategoryStore();

  const [activeFilter, setActiveFilter] =
    useState<FilterKey>("All");

  const [expanded, setExpanded] =
    useState(false);

  const [showRequestForm, setShowRequestForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<ServiceRequestForm>({
      service_title: "",
      service_description: "",
      request_eta_date: "",
      SLA: "",
      service_category: "",
    });

  const defaultVisibleCount =
    useResponsiveVisibleCount();

  /* --------------------------------------------------------------------- */
  /* Fetch resident requests                                               */
  /* --------------------------------------------------------------------- */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchRequests(Number(user.id));
  }, [
    user?.id,
    fetchRequests,
  ]);

  /* --------------------------------------------------------------------- */
  /* Fetch service categories                                              */
  /* --------------------------------------------------------------------- */

  useEffect(() => {
    fetchServiceCategories();
  }, [fetchServiceCategories]);

  /* --------------------------------------------------------------------- */
  /* Convert API records to UI records                                     */
  /* --------------------------------------------------------------------- */

  const mappedRequests = useMemo(() => {
    if (!Array.isArray(requests)) {
      return [];
    }

    return requests
      .map(mapServiceRequest)
      .filter(
        (item): item is RequestItem =>
          item !== null,
      );
  }, [requests]);

  /* --------------------------------------------------------------------- */
  /* Dynamic PG name                                                       */
  /* --------------------------------------------------------------------- */

  const pgName = useMemo(() => {
    const firstRecord =
      Array.isArray(requests)
        ? requests[0]
        : null;

    return (
      firstRecord?.pg_name ||
      "My PG"
    );
  }, [requests]);

  /* --------------------------------------------------------------------- */
  /* PG ID                                                                  */
  /* --------------------------------------------------------------------- */

  const pgId = useMemo(() => {
    const firstRecord =
      Array.isArray(requests)
        ? requests.find(
            (request: any) =>
              request?.pg_id !==
                undefined &&
              request?.pg_id !== null,
          )
        : null;

    return firstRecord?.pg_id
      ? Number(firstRecord.pg_id)
      : 0;
  }, [requests]);

  /* --------------------------------------------------------------------- */
  /* Dynamic counts                                                        */
  /* --------------------------------------------------------------------- */

  const openCount = useMemo(
    () =>
      mappedRequests.filter(
        (request) =>
          request.status ===
          "Open",
      ).length,
    [mappedRequests],
  );

  const inProgressCount = useMemo(
    () =>
      mappedRequests.filter(
        (request) =>
          request.status ===
          "In Progress",
      ).length,
    [mappedRequests],
  );

  const resolvedCount = useMemo(
    () =>
      mappedRequests.filter(
        (request) =>
          request.status ===
          "Resolved",
      ).length,
    [mappedRequests],
  );

  /* --------------------------------------------------------------------- */
  /* Filtering                                                             */
  /* --------------------------------------------------------------------- */

  const filteredRequests = useMemo(() => {
    if (activeFilter === "All") {
      return mappedRequests;
    }

    return mappedRequests.filter(
      (request) =>
        request.status ===
        activeFilter,
    );
  }, [
    mappedRequests,
    activeFilter,
  ]);

  /* --------------------------------------------------------------------- */
  /* Visible requests                                                      */
  /* --------------------------------------------------------------------- */

  const visibleRequests = expanded
    ? filteredRequests
    : filteredRequests.slice(
        0,
        defaultVisibleCount,
      );

  const hasMore =
    filteredRequests.length >
    defaultVisibleCount;

  const handleFilterChange = (
    filter: FilterKey,
  ) => {
    setActiveFilter(filter);
    setExpanded(false);
  };

  /* --------------------------------------------------------------------- */
  /* Open form                                                             */
  /* --------------------------------------------------------------------- */

  const handleOpenRequestForm = () => {
    setFormError(null);

    setForm({
      service_title: "",
      service_description: "",
      request_eta_date: "",
      SLA: "",
      service_category: "",
    });

    setShowRequestForm(true);
  };

  /* --------------------------------------------------------------------- */
  /* Close form                                                            */
  /* --------------------------------------------------------------------- */

  const handleCloseRequestForm = () => {
    if (submitting) {
      return;
    }

    setShowRequestForm(false);
    setFormError(null);
  };

  /* --------------------------------------------------------------------- */
  /* Submit request                                                        */
  /* --------------------------------------------------------------------- */

  const handleSubmitRequest = async () => {
    setFormError(null);

    if (!user?.id) {
      setFormError(
        "Unable to identify the resident. Please login again.",
      );
      return;
    }

    const numericUserId =
      Number(user.id);

    if (
      !Number.isInteger(
        numericUserId,
      )
    ) {
      setFormError(
        "Invalid resident ID.",
      );
      return;
    }

    if (!pgId) {
      setFormError(
        "Unable to identify your PG. Please refresh the page and try again.",
      );
      return;
    }

    if (!form.service_category) {
      setFormError(
        "Please select a service category.",
      );
      return;
    }

    const numericCategoryId =
      Number(
        form.service_category,
      );

    if (
      !Number.isInteger(
        numericCategoryId,
      )
    ) {
      setFormError(
        "Invalid service category.",
      );
      return;
    }

    if (!form.service_title.trim()) {
      setFormError(
        "Please enter a service title.",
      );
      return;
    }

    if (
      !form.service_description.trim()
    ) {
      setFormError(
        "Please describe the issue.",
      );
      return;
    }

    if (!form.request_eta_date) {
      setFormError(
        "Please select the expected date.",
      );
      return;
    }

    const numericSla =
      Number(form.SLA);

    if (
      !form.SLA ||
      !Number.isInteger(numericSla) ||
      numericSla <= 0
    ) {
      setFormError(
        "Please enter a valid SLA in hours.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const now = new Date();

      /*
       * IMPORTANT:
       * Prisma expects these numeric fields as Int.
       * Therefore we explicitly convert them to numbers.
       */
      await addRequest({
        requestor_info:
          numericUserId,

        /*
         * Backend should assign this.
         * It is intentionally not shown to the resident.
         */
        request_assigned_to: "",

        service_title:
          form.service_title.trim(),

        service_description:
          form.service_description.trim(),

        request_create_date:
          now.toISOString(),

        request_eta_date:
          new Date(
            `${form.request_eta_date}T00:00:00`,
          ).toISOString(),

        SLA: numericSla,

        /*
         * Not shown to resident.
         */
        feedback: "",

        service_category:
          numericCategoryId,

        /*
         * 11 = Open
         * Not shown to resident.
         */
        service_status: 11,

        pg_id: pgId,
      });

      /*
       * Refetch after successful creation.
       */
      await fetchRequests({
        requestor_info:
          numericUserId,
      });

      setShowRequestForm(false);
      setFormError(null);

      setForm({
        service_title: "",
        service_description: "",
        request_eta_date: "",
        SLA: "",
        service_category: "",
      });
    } catch (err: any) {
      console.error(
        "Create service request failed:",
        err,
      );

      setFormError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Failed to create service request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------------------------------------------- */
  /* Render                                                                */
  /* --------------------------------------------------------------------- */

  return (
    <>
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full min-h-0 flex-col gap-1">

          {/* ------------------------------------------------------------- */}
          {/* Header                                                        */}
          {/* ------------------------------------------------------------- */}

          <header className="flex shrink-0 items-center justify-between pt-0.5">
            <span className="text-sm font-extrabold text-blue-600 sm:text-base">
              MyPG
            </span>

            <button
              type="button"
              className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100"
            >
              <Bell className="h-2.5 w-2.5" />

              <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500 text-[4px] font-bold text-white">
                3
              </span>
            </button>
          </header>

          {/* ------------------------------------------------------------- */}
          {/* Title                                                         */}
          {/* ------------------------------------------------------------- */}

          <div className="flex shrink-0 items-center justify-between">
            <h1 className="text-xs font-extrabold text-gray-900 sm:text-sm">
              My Requests
            </h1>

            <button
              type="button"
              className="flex max-w-[50%] shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-0.5 text-[6px] font-semibold text-gray-800 sm:text-[6.5px]"
              title={pgName}
            >
              <span className="truncate">
                {pgName}
              </span>

              <ChevronDown className="h-1.5 w-1.5 shrink-0 text-gray-500" />
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Stat cards                                                     */}
          {/* ------------------------------------------------------------- */}

          <div className="grid shrink-0 grid-cols-3 gap-0.5">
            <StatCard
              icon={Wrench}
              tone="orange"
              label="Open"
              value={openCount}
              valueColor="text-orange-600"
            />

            <StatCard
              icon={Hourglass}
              tone="purple"
              label="In Progress"
              value={inProgressCount}
              valueColor="text-purple-600"
            />

            <StatCard
              icon={CheckCircle2}
              tone="green"
              label="Resolved"
              value={resolvedCount}
              valueColor="text-green-600"
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Filter tabs                                                     */}
          {/* ------------------------------------------------------------- */}

          <div className="flex shrink-0 flex-wrap items-center gap-1">
            {FILTERS.map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    handleFilterChange(
                      filter,
                    )
                  }
                  className={`rounded-full border px-1.5 py-0.5 text-[6px] font-semibold transition-colors sm:text-[6.5px] ${
                    activeFilter ===
                    filter
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Service Requests + Quick Help                                  */}
          {/* ------------------------------------------------------------- */}

          <div className="flex min-h-0 flex-1 flex-col gap-1 lg:grid lg:grid-cols-3 lg:items-stretch">

            {/* ----------------------------------------------------------- */}
            {/* Service Requests                                             */}
            {/* ----------------------------------------------------------- */}

            <div className="flex min-h-0 flex-1 flex-col rounded border border-gray-100 bg-white shadow-sm lg:col-span-2 lg:h-full">

              <div className="flex shrink-0 items-center justify-between px-1 pb-0.5 pt-0.5">
                <h2 className="text-[8px] font-bold text-gray-900 sm:text-[9px]">
                  Service Requests
                </h2>

                {hasMore && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(
                        (prev) =>
                          !prev,
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

              {/* --------------------------------------------------------- */}
              {/* Loading                                                     */}
              {/* --------------------------------------------------------- */}

              {loading ? (
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Loader2 className="h-3 w-3 animate-spin" />

                    <span className="text-[6.5px]">
                      Loading requests...
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex min-h-0 flex-1 items-center justify-center px-2">
                  <p className="text-center text-[6.5px] text-red-400">
                    {error}
                  </p>
                </div>
              ) : (
                <div
                  className={`flex flex-col ${
                    expanded
                      ? "min-h-0 flex-1 overflow-y-auto"
                      : "lg:min-h-0 lg:flex-1 lg:overflow-hidden"
                  }`}
                >
                  {visibleRequests.length >
                  0 ? (
                    visibleRequests.map(
                      (item) => (
                        <RequestRow
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                        />
                      ),
                    )
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="px-1 py-2 text-center text-[6.5px] text-gray-400">
                        {activeFilter ===
                        "All"
                          ? "No service requests found."
                          : `No ${activeFilter.toLowerCase()} requests.`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* Raise New Request                                         */}
              {/* --------------------------------------------------------- */}

              <div className="shrink-0 p-1 pt-0.5">
                <button
                  type="button"
                  onClick={
                    handleOpenRequestForm
                  }
                  className="flex w-full items-center justify-center gap-0.5 rounded bg-blue-600 py-1 text-[7px] font-bold text-white transition-colors hover:bg-blue-700 sm:text-[7.5px]"
                >
                  <Plus className="h-2 w-2" />

                  Raise New Request
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Quick Help                                                   */}
            {/* ----------------------------------------------------------- */}

            <div className="flex shrink-0 flex-col">
              <h2 className="mb-0.5 shrink-0 text-[8px] font-bold text-gray-900 sm:text-[9px]">
                Quick Help
              </h2>

              <div className="grid grid-cols-2 gap-1 lg:flex lg:flex-col">

                <button
                  type="button"
                  className="flex items-center gap-1 rounded border border-gray-100 bg-white px-1 py-1 text-left shadow-sm hover:bg-gray-50 lg:flex-1"
                >
                  <IconBox
                    icon={Phone}
                    tone="blue"
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[6.5px] font-bold text-gray-900 sm:text-[7px]">
                      Call Manager
                    </p>

                    <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                      Speak with the manager
                    </p>
                  </div>

                  <ChevronRight className="h-2 w-2 shrink-0 text-gray-400" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1 rounded border border-gray-100 bg-white px-1 py-1 text-left shadow-sm hover:bg-gray-50 lg:flex-1"
                >
                  <IconBox
                    icon={
                      MessageCircle
                    }
                    tone="purple"
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[6.5px] font-bold text-gray-900 sm:text-[7px]">
                      Message Support
                    </p>

                    <p className="truncate text-[5px] text-gray-500 sm:text-[5.5px]">
                      Chat with support team
                    </p>
                  </div>

                  <ChevronRight className="h-2 w-2 shrink-0 text-gray-400" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ----------------------------------------------------------------- */}
      {/* Raise Request Modal                                               */}
      {/* ----------------------------------------------------------------- */}

      {showRequestForm && (
        <RaiseRequestForm
          form={form}
          setForm={setForm}
          onSubmit={
            handleSubmitRequest
          }
          onClose={
            handleCloseRequestForm
          }
          submitting={submitting}
          error={formError}
          categories={categories}
          categoriesLoading={
            categoriesLoading
          }
        />
      )}
    </>
  );
};

export default MyRequests;