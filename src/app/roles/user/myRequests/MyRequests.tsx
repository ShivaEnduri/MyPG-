

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Wrench,
  X,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";
import { useAuth } from "../../../../hooks/context/AuthContext";
import { useServiceRequestsStore } from "@/app/shared/store/useServiceRequestsStore";
import { usePgServiceCategoryStore } from "@/app/shared/store/serviceCategoryStore";


// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

interface RequestFormState {
  service_category: string;
  service_title: string;
  service_description: string;
  request_eta_date: string;
  SLA: string;
}


// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const getStatusLabel = (status: number | string) => {
  switch (Number(status)) {
    case 11:
      return "Open";

    case 12:
      return "In Progress";

    case 13:
      return "Resolved";

    default:
      return "Open";
  }
};


const getStatusStyles = (status: number | string) => {
  switch (Number(status)) {
    case 11:
      return {
        container:
          "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-500",
      };

    case 12:
      return {
        container:
          "bg-blue-50 text-blue-700 border border-blue-200",
        dot: "bg-blue-500",
      };

    case 13:
      return {
        container:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
      };

    default:
      return {
        container:
          "bg-gray-50 text-gray-700 border border-gray-200",
        dot: "bg-gray-400",
      };
  }
};


const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const MyRequests: React.FC = () => {
  const { user } = useAuth();

  const serviceRequestsStore =
    useServiceRequestsStore() as any;

  const {
    data: requests,
    loading,
    error,
    fetchServiceRequests,
  } = serviceRequestsStore;

  const createServiceRequest =
    serviceRequestsStore.createServiceRequest?.bind(
      serviceRequestsStore
    ) ??
    (async (_payload: unknown) => {
      console.warn(
        "createServiceRequest is not available on the service requests store."
      );
    });

  const {
    categories,
    loading: categoriesLoading,
    fetchServiceCategories,
  } = usePgServiceCategoryStore();


  // -------------------------------------------------------
  // State
  // -------------------------------------------------------

  const [showRequestForm, setShowRequestForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<RequestFormState>({
      service_category: "",
      service_title: "",
      service_description: "",
      request_eta_date: "",
      SLA: "",
    });


  // -------------------------------------------------------
  // Fetch resident requests
  // -------------------------------------------------------

  useEffect(() => {
    if (!user?.id) return;

    const userId = Number(user.id);

    if (!Number.isInteger(userId)) {
      console.error(
        "Invalid user id:",
        user.id
      );
      return;
    }

    fetchServiceRequests(userId);
  }, [user?.id, fetchServiceRequests]);


  // -------------------------------------------------------
  // Fetch service categories
  // -------------------------------------------------------

  useEffect(() => {
    fetchServiceCategories();
  }, [fetchServiceCategories]);


  // -------------------------------------------------------
  // PG information
  // -------------------------------------------------------
  // Existing service requests contain pg_id and pg_name.
  // We use them for the request page.
  // -------------------------------------------------------

  const pgName = useMemo(() => {
    const requestWithPgName = requests.find(
      (request: any) => request?.pg_name
    );

    return (
      requestWithPgName?.pg_name ||
      "My PG"
    );
  }, [requests]);


  const pgId = useMemo(() => {
    const requestWithPgId = requests.find(
      (request: any) =>
        request?.pg_id !== undefined &&
        request?.pg_id !== null
    );

    return requestWithPgId?.pg_id
      ? Number(requestWithPgId.pg_id)
      : null;
  }, [requests]);


  // -------------------------------------------------------
  // Statistics
  // -------------------------------------------------------

  const statistics = useMemo(() => {
    return {
      open: requests.filter(
        (request: any) =>
          Number(request?.service_status) === 11
      ).length,

      inProgress: requests.filter(
        (request: any) =>
          Number(request?.service_status) === 12
      ).length,

      resolved: requests.filter(
        (request: any) =>
          Number(request?.service_status) === 13
      ).length,
    };
  }, [requests]);


  // -------------------------------------------------------
  // Handle opening form
  // -------------------------------------------------------

  const handleOpenRequestForm = () => {
    setSubmitError(null);

    setForm({
      service_category: "",
      service_title: "",
      service_description: "",
      request_eta_date: "",
      SLA: "",
    });

    setShowRequestForm(true);
  };


  // -------------------------------------------------------
  // Handle category change
  // -------------------------------------------------------

  const handleCategoryChange = (
    value: string
  ) => {
    const selectedCategory = categories.find(
      (category: any) =>
        String(category.id) === value
    );

    setForm((previous) => ({
      ...previous,

      service_category: value,

      SLA: selectedCategory
        ? String(
            (selectedCategory as any).resolve_timeline ?? ""
          )
        : "",
    }));
  };


  // -------------------------------------------------------
  // Handle form submit
  // -------------------------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitError(null);

    // -----------------------------------------------
    // Validate user
    // -----------------------------------------------

    if (!user?.id) {
      setSubmitError(
        "Unable to identify the resident. Please login again."
      );
      return;
    }

    const requestorInfo = Number(user.id);

    if (!Number.isInteger(requestorInfo)) {
      setSubmitError(
        "Invalid resident user ID."
      );
      return;
    }


    // -----------------------------------------------
    // Validate PG
    // -----------------------------------------------

    if (!pgId || !Number.isInteger(pgId)) {
      setSubmitError(
        "Unable to identify your PG. Please refresh the page and try again."
      );
      return;
    }


    // -----------------------------------------------
    // Validate category
    // -----------------------------------------------

    if (!form.service_category) {
      setSubmitError(
        "Please select a service category."
      );
      return;
    }


    const serviceCategory =
      Number(form.service_category);

    if (!Number.isInteger(serviceCategory)) {
      setSubmitError(
        "Invalid service category."
      );
      return;
    }


    // -----------------------------------------------
    // Validate title
    // -----------------------------------------------

    if (!form.service_title.trim()) {
      setSubmitError(
        "Please enter a service title."
      );
      return;
    }


    // -----------------------------------------------
    // Validate description
    // -----------------------------------------------

    if (!form.service_description.trim()) {
      setSubmitError(
        "Please describe your issue."
      );
      return;
    }


    // -----------------------------------------------
    // Validate expected date
    // -----------------------------------------------

    if (!form.request_eta_date) {
      setSubmitError(
        "Please select an expected date."
      );
      return;
    }


    // -----------------------------------------------
    // Validate SLA
    // -----------------------------------------------

    const sla = Number(form.SLA);

    if (!Number.isInteger(sla)) {
      setSubmitError(
        "Invalid SLA value."
      );
      return;
    }


    try {
      setSubmitting(true);


      // ------------------------------------------------
      // IMPORTANT:
      //
      // requestor_info       -> Int
      // request_assigned_to  -> Int | Null
      // SLA                   -> Int
      // feedback             -> Int | Null
      // service_category     -> Int
      // service_status       -> Int
      // pg_id                 -> Int
      // ------------------------------------------------

      const payload = {
        requestor_info: requestorInfo,

        // Resident does not assign a manager.
        // Prisma expects Int | Null.
        request_assigned_to: null,

        service_title:
          form.service_title.trim(),

        service_description:
          form.service_description.trim(),

        request_create_date:
          new Date().toISOString(),

        request_eta_date:
          new Date(
            `${form.request_eta_date}T00:00:00`
          ).toISOString(),

        SLA: sla,

        // No feedback when request is newly created.
        feedback: null,

        service_category:
          serviceCategory,

        // 11 = TicketRaised / Open
        service_status: 11,

        pg_id: pgId,
      };


      // Debugging
      console.log(
        "Creating service request:",
        payload
      );


      await createServiceRequest(payload);


      // ------------------------------------------------
      // Refetch resident requests
      // ------------------------------------------------

      await fetchServiceRequests(requestorInfo);


      // ------------------------------------------------
      // Reset and close form
      // ------------------------------------------------

      setForm({
        service_category: "",
        service_title: "",
        service_description: "",
        request_eta_date: "",
        SLA: "",
      });

      setShowRequestForm(false);

    } catch (err: any) {
      console.error(
        "Create service request failed:",
        err
      );

      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create service request."
      );

    } finally {
      setSubmitting(false);
    }
  };


  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <PageShell>
      <div className="w-full min-h-full bg-gray-50">

        {/* ------------------------------------------------
            Header
        ------------------------------------------------- */}

        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto w-full max-w-[1080px] px-4 py-4 sm:px-5">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <h1 className="text-[18px] font-semibold text-gray-900">
                  My Requests
                </h1>

                <p className="mt-0.5 truncate text-[12px] text-gray-500">
                  {pgName}
                </p>
              </div>


              <button
                type="button"
                onClick={handleOpenRequestForm}
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-gray-900
                  px-3
                  py-2
                  text-[12px]
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800
                "
              >
                <Plus size={15} />
                Raise Request
              </button>

            </div>

          </div>
        </div>


        {/* ------------------------------------------------
            Main Content
        ------------------------------------------------- */}

        <div className="mx-auto w-full max-w-[1080px] px-4 py-4 sm:px-5">

          {/* ------------------------------------------------
              Stats
          ------------------------------------------------- */}

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">

            {/* Open */}

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    Open
                  </p>

                  <p className="mt-1 text-[20px] font-semibold leading-none text-gray-900">
                    {statistics.open}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <AlertCircle
                    size={16}
                    className="text-amber-600"
                  />
                </div>

              </div>
            </div>


            {/* In Progress */}

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    In Progress
                  </p>

                  <p className="mt-1 text-[20px] font-semibold leading-none text-gray-900">
                    {statistics.inProgress}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Clock3
                    size={16}
                    className="text-blue-600"
                  />
                </div>

              </div>
            </div>


            {/* Resolved */}

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    Resolved
                  </p>

                  <p className="mt-1 text-[20px] font-semibold leading-none text-gray-900">
                    {statistics.resolved}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600"
                  />
                </div>

              </div>
            </div>

          </div>


          {/* ------------------------------------------------
              Quick Help
          ------------------------------------------------- */}

          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <MessageCircle
                    size={16}
                    className="text-gray-700"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-gray-900">
                    Need quick help?
                  </p>

                  <p className="truncate text-[11px] text-gray-500">
                    Contact your PG manager for urgent issues.
                  </p>
                </div>

              </div>


              <button
                type="button"
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-gray-200
                  px-2.5
                  py-1.5
                  text-[11px]
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                Contact
                <ArrowRight size={12} />
              </button>

            </div>

          </div>


          {/* ------------------------------------------------
              Requests
          ------------------------------------------------- */}

          <div className="mt-3 rounded-xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 px-3 py-3">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <h2 className="text-[13px] font-semibold text-gray-900">
                    Request History
                  </h2>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Track your service requests
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                  {requests.length}{" "}
                  {requests.length === 1
                    ? "Request"
                    : "Requests"}
                </span>

              </div>

            </div>


            {/* Loading */}

            {loading && (
              <div className="flex items-center justify-center px-4 py-12">

                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Loading requests...
                </div>

              </div>
            )}


            {/* Error */}

            {!loading && error && (
              <div className="px-4 py-8 text-center">

                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle
                    size={18}
                    className="text-red-500"
                  />
                </div>

                <p className="mt-2 text-[12px] font-medium text-gray-800">
                  Failed to load requests
                </p>

                <p className="mt-1 text-[11px] text-gray-500">
                  {error}
                </p>

              </div>
            )}


            {/* Empty */}

            {!loading &&
              !error &&
              requests.length === 0 && (
                <div className="px-4 py-12 text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Wrench
                      size={18}
                      className="text-gray-500"
                    />
                  </div>

                  <p className="mt-3 text-[12px] font-medium text-gray-900">
                    No service requests yet
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Raise a request if you need help with
                    something in your PG.
                  </p>

                  <button
                    type="button"
                    onClick={handleOpenRequestForm}
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-gray-900
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      text-white
                      hover:bg-gray-800
                    "
                  >
                    <Plus size={13} />
                    Raise Request
                  </button>

                </div>
              )}


            {/* Request list */}

            {!loading &&
              !error &&
              requests.length > 0 && (
                <div className="divide-y divide-gray-100">

                  {requests.map(
                    (
                      request: any,
                      index: number
                    ) => {

                      const statusStyles =
                        getStatusStyles(
                          request.service_status
                        );

                      return (
                        <div
                          key={
                            request.id ??
                            index
                          }
                          className="px-3 py-3"
                        >

                          <div className="flex items-start justify-between gap-3">

                            {/* Left */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-center gap-2">

                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100">
                                  <Wrench
                                    size={14}
                                    className="text-gray-600"
                                  />
                                </div>

                                <div className="min-w-0">

                                  <h3 className="truncate text-[12px] font-semibold text-gray-900">
                                    {request.service_title ||
                                      "Service Request"}
                                  </h3>

                                  <p className="mt-0.5 text-[10px] text-gray-400">
                                    Request #
                                    {request.id}
                                  </p>

                                </div>

                              </div>


                              <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-gray-600">
                                {request.service_description ||
                                  "No description available."}
                              </p>


                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">

                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                  <CalendarDays
                                    size={11}
                                  />
                                  {formatDate(
                                    request.request_create_date
                                  )}
                                </div>


                                {request.pg_name && (
                                  <div className="text-[10px] text-gray-400">
                                    {request.pg_name}
                                  </div>
                                )}

                              </div>

                            </div>


                            {/* Status */}

                            <div
                              className={`
                                inline-flex
                                shrink-0
                                items-center
                                gap-1
                                rounded-full
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                ${statusStyles.container}
                              `}
                            >
                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  ${statusStyles.dot}
                                `}
                              />

                              {getStatusLabel(
                                request.service_status
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>


        {/* =================================================
            Raise Request Modal
        ================================================== */}

        {showRequestForm && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-4
              py-5
            "
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowRequestForm(false);
              }
            }}
          >

            <div
              className="
                w-full
                max-w-[480px]
                overflow-hidden
                rounded-xl
                bg-white
                shadow-xl
              "
            >

              {/* Modal header */}

              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                <div>
                  <h2 className="text-[14px] font-semibold text-gray-900">
                    Raise New Request
                  </h2>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Tell us what you need help with.
                  </p>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setShowRequestForm(false)
                  }
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    text-gray-400
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >
                  <X size={16} />
                </button>

              </div>


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="max-h-[75vh] overflow-y-auto"
              >

                <div className="space-y-3 px-4 py-4">

                  {/* Error */}

                  {submitError && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">

                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <p className="text-[11px] leading-4 text-red-700">
                        {submitError}
                      </p>

                    </div>
                  )}


                  {/* Service Category */}

                  <div>

                    <label className="mb-1 block text-[11px] font-medium text-gray-700">
                      Service Category
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <div className="relative">

                      <select
                        value={
                          form.service_category
                        }
                        onChange={(event) =>
                          handleCategoryChange(
                            event.target.value
                          )
                        }
                        disabled={
                          categoriesLoading ||
                          submitting
                        }
                        className="
                          h-9
                          w-full
                          appearance-none
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          pr-8
                          text-[11px]
                          text-gray-700
                          outline-none
                          transition
                          focus:border-gray-400
                          focus:ring-2
                          focus:ring-gray-100
                          disabled:bg-gray-50
                        "
                      >

                        <option value="">
                          {categoriesLoading
                            ? "Loading categories..."
                            : "Select category"}
                        </option>

                        {categories.map(
                          (category: any) => (
                            <option
                              key={category.id}
                              value={category.id}
                            >
                              {category.service_category}
                            </option>
                          )
                        )}

                      </select>

                      <ChevronDown
                        size={14}
                        className="
                          pointer-events-none
                          absolute
                          right-2.5
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />

                    </div>

                  </div>


                  {/* Service Title */}

                  <div>

                    <label className="mb-1 block text-[11px] font-medium text-gray-700">
                      Service Title
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      value={
                        form.service_title
                      }
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          service_title:
                            event.target.value,
                        }))
                      }
                      placeholder="e.g. Water Leakage"
                      disabled={submitting}
                      className="
                        h-9
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-[11px]
                        text-gray-700
                        outline-none
                        placeholder:text-gray-400
                        focus:border-gray-400
                        focus:ring-2
                        focus:ring-gray-100
                        disabled:bg-gray-50
                      "
                    />

                  </div>


                  {/* Description */}

                  <div>

                    <label className="mb-1 block text-[11px] font-medium text-gray-700">
                      Description
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <textarea
                      value={
                        form.service_description
                      }
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          service_description:
                            event.target.value,
                        }))
                      }
                      placeholder="Describe the issue..."
                      rows={3}
                      disabled={submitting}
                      className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        py-2
                        text-[11px]
                        leading-4
                        text-gray-700
                        outline-none
                        placeholder:text-gray-400
                        focus:border-gray-400
                        focus:ring-2
                        focus:ring-gray-100
                        disabled:bg-gray-50
                      "
                    />

                  </div>


                  {/* Expected Date + SLA */}

                  <div className="grid grid-cols-2 gap-3">

                    {/* Expected Date */}

                    <div>

                      <label className="mb-1 block text-[11px] font-medium text-gray-700">
                        Expected Date
                        <span className="text-red-500">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="date"
                        value={
                          form.request_eta_date
                        }
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            request_eta_date:
                              event.target.value,
                          }))
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        disabled={submitting}
                        className="
                          h-9
                          w-full
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-2.5
                          text-[11px]
                          text-gray-700
                          outline-none
                          focus:border-gray-400
                          focus:ring-2
                          focus:ring-gray-100
                          disabled:bg-gray-50
                        "
                      />

                    </div>


                    {/* SLA */}

                    <div>

                      <label className="mb-1 block text-[11px] font-medium text-gray-700">
                        SLA (Hours)
                      </label>

                      <input
                        type="number"
                        min={1}
                        value={form.SLA}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            SLA:
                              event.target.value,
                          }))
                        }
                        placeholder="SLA"
                        disabled={submitting}
                        className="
                          h-9
                          w-full
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          text-[11px]
                          text-gray-700
                          outline-none
                          placeholder:text-gray-400
                          focus:border-gray-400
                          focus:ring-2
                          focus:ring-gray-100
                          disabled:bg-gray-50
                        "
                      />

                    </div>

                  </div>


                  {/* Informational message */}

                  <div className="rounded-lg bg-gray-50 px-3 py-2">

                    <div className="flex items-start gap-2">

                      <FileText
                        size={13}
                        className="mt-0.5 shrink-0 text-gray-500"
                      />

                      <p className="text-[10px] leading-4 text-gray-500">
                        Your request will be submitted with
                        <span className="font-medium text-gray-700">
                          {" "}Open
                        </span>
                        {" "}status. A manager can assign it
                        and update the status later.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Footer */}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowRequestForm(false)
                    }
                    disabled={submitting}
                    className="
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      text-gray-600
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      categoriesLoading
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-gray-900
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      text-white
                      hover:bg-gray-800
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {submitting ? (
                      <>
                        <Loader2
                          size={13}
                          className="animate-spin"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Submit Request
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </PageShell>
  );
};

export default MyRequests;