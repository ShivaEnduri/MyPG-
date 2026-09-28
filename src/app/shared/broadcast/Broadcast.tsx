
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  Eye,
  FileCheck,
  FileText,
  Info,
  Layers,
  Megaphone,
  MessageCircle,
  MoreVertical,
  Receipt,
  Smartphone,
  Wrench,
} from "lucide-react";

import { useUserRolesStore } from "@/app/shared/store/userRolesStore";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { usePgAlertsStore, PgAlert } from "@/app/shared/store/alertsStore";
import { useAlertMasterStore } from "@/app/shared/store/alertCatStore";
import {
  AlertCategory,
  addPgAlert,
  AddPgAlertPayload,
  addPgEventApi,
  AddPgEventPayload,
} from "@/app/shared/services/api/commonApiServices";

/* ============================================================
   CONSTANTS
============================================================ */

/**
 * Audience is no longer selectable in the UI. Every alert is sent
 * to the Owner role (role id 2) by default.
 */
const DEFAULT_AUDIENCE_ROLE_ID = 2;

/**
 * Category name (lowercased) that is stored as an EVENT instead of
 * an alert. Matches the DB spelling "announcement".
 */
const ANNOUNCEMENT_CATEGORY_NAME = "announcement";

/* ============================================================
   TYPES
============================================================ */

type Channel =
  | "in-app"
  | "whatsapp"
  | "sms";

type AnnouncementStatus =
  | "Delivered"
  | "Scheduled"
  | "Expired";

interface Announcement {
  id: number;
  categoryId: number | null;
  categoryLabel: string;
  title: string;
  date: string;
  time: string;
  audience: string;
  status: AnnouncementStatus;
}

/* ============================================================
   CATEGORY ICONS — exact lookup by real category name

   Confirmed from your actual fetchAlertCategories response:
   billpayment, lease, agreement, announcement, maintenance,
   notification, miscellenous (that's the DB's spelling — keep
   it, don't "fix" it to "miscellaneous" or the lookup breaks).
   There's also a duplicate "Maintenance" (capitalized, id 8) in
   your data — the lowercase() below makes it match the same
   entry as "maintenance" (id 5) automatically.

   This is a literal string lookup now, not a keyword guess — so
   if you add a new category on the backend, add one line here
   with the exact category name and it'll pick up the icon
   immediately. Anything not listed falls back to DEFAULT_VISUAL.
============================================================ */

interface CategoryVisual {
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
}

const DEFAULT_VISUAL: CategoryVisual = {
  icon: Info,
  iconClass: "text-slate-600",
  bgClass: "bg-slate-50",
};

const CATEGORY_ICON_MAP: Record<string, CategoryVisual> = {
  billpayment: {
    icon: Receipt,
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
  },

  lease: {
    icon: FileText,
    iconClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
  },

  agreement: {
    icon: FileCheck,
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
  },

  announcement: {
    icon: Megaphone,
    iconClass: "text-orange-500",
    bgClass: "bg-orange-50",
  },

  // maintenance -> Wrench (standard repair icon). If you'd
  // rather this be a broom/cleaning icon, this is the one line
  // to change — swap Wrench for an icon you prefer here.
  maintenance: {
    icon: Wrench,
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
  },

  notification: {
    icon: Bell,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },

  miscellenous: {
    icon: Layers,
    iconClass: "text-slate-600",
    bgClass: "bg-slate-50",
  },
};

function getCategoryVisual(
  categoryName?: string | null
): CategoryVisual {
  if (!categoryName) {
    return DEFAULT_VISUAL;
  }

  return (
    CATEGORY_ICON_MAP[categoryName.trim().toLowerCase()] ??
    DEFAULT_VISUAL
  );
}

/**
 * Confirmed field name: your categories list returns
 * `alert_category` (e.g. { id: 1, alert_category: "billpayment" }),
 * and each alert row from usePgAlertsStore ALSO carries
 * `alert_category` directly. This checks the confirmed field
 * first and only falls through to guesses for safety.
 */
function getCategoryLabel(
  category: AlertCategory | undefined
): string {
  if (!category) {
    return "General";
  }

  const record = category as unknown as Record<string, unknown>;

  const candidate =
    record.alert_category ??
    record.category ??
    record.category_name ??
    record.name;

  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate
    : "General";
}

/* ============================================================
   DATETIME HELPERS

   <input type="datetime-local"> works with a *local* time string
   like "2026-09-20T18:30" (no timezone). We use that for the
   input value / min, and convert to a real ISO string (UTC) only
   when building the event payload.
============================================================ */

function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function isValidDateTimeLocal(value: string): boolean {
  return value !== "" && !Number.isNaN(new Date(value).getTime());
}

/* ============================================================
   ALERT -> ANNOUNCEMENT MAPPER

   Your real usePgAlertsStore payload is much richer than the
   PgAlert interface declares — each row also carries
   alert_category, alert_description, alert_status, role,
   first_name, last_name, pg_name, etc. PgAlertExtras below types
   the extra fields we actually use here without touching your
   store's PgAlert type.
============================================================ */

interface PgAlertExtras {
  alert_category?: string;
  alert_description?: string;
  alert_status?: number;
  role?: string;
  first_name?: string;
  last_name?: string;
  // No created/sent timestamp field was present in your sample
  // payload (pg_update_time belongs to the PG record, not the
  // alert) — these are checked defensively in case one exists
  // under a different name; otherwise date/time show "-".
  alert_create_time?: string;
  created_at?: string;
}

type PgAlertWithExtras = PgAlert & PgAlertExtras;

function mapAlertToAnnouncement(
  alert: PgAlert,
  categoryById: Map<number, AlertCategory>
): Announcement {
  const extended = alert as PgAlertWithExtras;

  // The alert row already carries its own category name — prefer
  // that over the categories-store lookup so this still works even
  // before/if useAlertMasterStore hasn't loaded yet.
  const categoryLabel =
    extended.alert_category ??
    getCategoryLabel(categoryById.get(alert.alert_cat));

  const rawDate =
    extended.alert_create_time ??
    extended.created_at ??
    alert.pg_update_time ??
    null;

  const parsedDate = rawDate ? new Date(rawDate) : null;

  const isValidDate =
    parsedDate !== null && !Number.isNaN(parsedDate.getTime());

  const receiverName = [extended.first_name, extended.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const audience = extended.role
    ? receiverName
      ? `${extended.role} • ${receiverName}`
      : extended.role
    : "-";

  // alert_status: 10 = resolved (set by resolveAlert in the
  // store); anything else is treated as still active/delivered.
  // Adjust this if your status codes mean something different.
  const status: AnnouncementStatus =
    extended.alert_status === 10 ? "Expired" : "Delivered";

  return {
    id: alert.id,
    categoryId: alert.alert_cat ?? null,
    categoryLabel,
    title:
      alert.alert_title ||
      extended.alert_description ||
      alert.alert_message ||
      "Untitled Announcement",
    date: isValidDate
      ? parsedDate!.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-",
    time: isValidDate
      ? parsedDate!.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",
    audience,
    status,
  };
}

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS_CONFIG: Record<
  AnnouncementStatus,
  string
> = {
  Delivered:
    "bg-green-50 text-green-600",

  Scheduled:
    "bg-orange-50 text-orange-500",

  Expired:
    "bg-gray-100 text-gray-700",
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Broadcast() {
  const [selectedChannel, setSelectedChannel] =
    useState<Channel>("in-app");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  // datetime-local string ("YYYY-MM-DDTHH:mm"), only used when the
  // Announcement category is selected.
  const [eventDateTime, setEventDateTime] =
    useState("");

  const [showAll, setShowAll] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [sendError, setSendError] =
    useState<string | null>(null);

  const [sendSuccess, setSendSuccess] =
    useState<string | null>(null);

  /* ----------------------------------------------------------
     ALERT CATEGORIES ("Type" cards) — from useAlertMasterStore
  ---------------------------------------------------------- */

  const alertCategories = useAlertMasterStore(
    (state) => state.alertCategories
  );

  const fetchAlertCategories = useAlertMasterStore(
    (state) => state.fetchAlertCategories
  );

  useEffect(() => {
    fetchAlertCategories();
  }, [fetchAlertCategories]);

  const categoryById = useMemo(
    () =>
      new Map(
        alertCategories.map((category) => [category.id, category])
      ),
    [alertCategories]
  );

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  // Default to the first available category once they load.
  useEffect(() => {
    if (selectedCategoryId === null && alertCategories.length > 0) {
      setSelectedCategoryId(alertCategories[0].id);
    }
  }, [alertCategories, selectedCategoryId]);

  // "Announcement" is saved as an event (with a date/time) rather
  // than as an alert, so the form needs to know when it's selected.
  const isAnnouncementCategory = useMemo(() => {
    if (selectedCategoryId === null) return false;

    const label = getCategoryLabel(
      categoryById.get(selectedCategoryId)
    );

    return (
      label.trim().toLowerCase() === ANNOUNCEMENT_CATEGORY_NAME
    );
  }, [selectedCategoryId, categoryById]);

  /* ----------------------------------------------------------
     LOGGED-IN USER'S ROLE (permission gate only)

     Audience is no longer chosen in the UI — it is always sent as
     the Owner role (DEFAULT_AUDIENCE_ROLE_ID). We still look up the
     logged-in user's role so that only Owner / Manager can see the
     Create Announcement form.
  ---------------------------------------------------------- */

  const { user } = useAuth();

  const userRolesList = useUserRolesStore(
    (state) => state.userRolesList
  );
  const userRolesLoading = useUserRolesStore(
    (state) => state.loading
  );
  const fetchUserRoles = useUserRolesStore(
    (state) => state.fetchUserRoles
  );

  // Fetch the logged-in user's roles using the DB user_id from AuthContext.
  useEffect(() => {
    if (!user?.id) return;

    fetchUserRoles({
      user_id: user.id,
    });
  }, [user?.id, fetchUserRoles]);

  // The first role returned by fetchUserRolesApi is the user's assigned role.
 const currentUserRole = useMemo(() => {
  const firstRole = userRolesList?.[0] as
    | { role?: string }
    | undefined;

  return firstRole?.role?.trim().toLowerCase() ?? null;
}, [userRolesList]);

  // Only Owner and Manager are allowed to create/send announcements.
  const canSendAnnouncement =
    currentUserRole === "owner" ||
    currentUserRole === "manager";

  const roleLoaded =
    !!user?.id &&
    !userRolesLoading &&
    userRolesList.length > 0;

  /* ----------------------------------------------------------
     SELECTED PG — from useSelectedPgStore

     `selectedPg` is the full PgInfo object (not just the id) so
     we can show the real PG name in the header instead of the
     old hardcoded "Hamsa PG" label.
  ---------------------------------------------------------- */

  const selectedPg = useSelectedPgStore(
    (state) => state.selectedPg
  );

  const selectedPgId = useSelectedPgStore(
    (state) => state.selectedPgId
  );

  const selectedPgName = selectedPg?.pg_name ?? "Select PG";

  /* ----------------------------------------------------------
     ANNOUNCEMENTS (ALERTS) — from usePgAlertsStore
  ---------------------------------------------------------- */

  const alerts = usePgAlertsStore((state) => state.alerts);
  const alertsLoading = usePgAlertsStore((state) => state.loading);
  const alertsError = usePgAlertsStore((state) => state.error);
  const fetchAlerts = usePgAlertsStore((state) => state.fetchAlerts);

  useEffect(() => {
    if (selectedPgId) {
      
      fetchAlerts({ pg_id: selectedPgId });
    }
  }, [selectedPgId, fetchAlerts]);

  const visibleAnnouncements: Announcement[] = useMemo(
    () =>
      alerts.map((alert) =>
        mapAlertToAnnouncement(alert, categoryById)
      ),
    [alerts, categoryById]
  );

  /* ----------------------------------------------------------
     SEND ANNOUNCEMENT

     - Announcement category  -> addPgEventApi  (events table)
     - Every other category   -> addPgAlert     (alerts table)
  ---------------------------------------------------------- */

  const hasRequiredEventDate =
    !isAnnouncementCategory ||
    isValidDateTimeLocal(eventDateTime);

  const canSend =
    canSendAnnouncement &&
    title.trim().length > 0 &&
    message.trim().length > 0 &&
    selectedCategoryId !== null &&
    selectedPgId !== null &&
    hasRequiredEventDate &&
    !sending;

  const handleSend = async () => {
    if (
      !canSend ||
      selectedCategoryId === null ||
      selectedPgId === null
    ) {
      return;
    }

    setSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      if (isAnnouncementCategory) {
        const eventDate = new Date(eventDateTime);

        if (Number.isNaN(eventDate.getTime())) {
          setSendError("Please pick a valid date and time.");
          return;
        }

        const eventPayload: AddPgEventPayload = {
          event_date: eventDate.toISOString(),
          event_title: title.trim(),
          event_description: message.trim(),
          pg_id: Number(selectedPgId),
        };

        await addPgEventApi(eventPayload);

        setEventDateTime("");
        setSendSuccess("Announcement scheduled.");
      } else {
        const payload: AddPgAlertPayload = {
          alert_cat: selectedCategoryId,

          // Audience is fixed to Owner (role id 2).
          alert_receiver_role: DEFAULT_AUDIENCE_ROLE_ID,
          alert_receiver: 2,
          alert_title: title.trim(),
          alert_description: message.trim(),
          alert_priority: 1,
          pg_id: selectedPgId,
          alert_status: 1,
        };

        await addPgAlert(payload);

        await fetchAlerts({ pg_id: String(selectedPgId) });
      }

      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Failed to send announcement", error);
      setSendError("Couldn't send that announcement. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="
        h-[100dvh]
        w-full
        overflow-hidden
        bg-white
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1080px]
          flex-col
          overflow-hidden
          bg-white
        "
      >
        <main
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden

            px-2
            pt-1
            pb-[56px]

            min-[380px]:px-2.5
            min-[380px]:pb-[58px]

            sm:px-3
            sm:pb-[60px]

            md:px-4
            md:pb-[64px]

            lg:px-5
            lg:pb-[68px]
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <header
            className="
              shrink-0
              pb-2

              sm:pb-2.5

              md:pb-3
            "
          >
            {/* ROW 1 */}

            <div
              className="
                flex
                h-6
                items-center
                justify-between
              "
            >
              <div
                className="
                  font-bold
                  leading-none
                  tracking-tight
                  text-blue-600

                  text-[16px]

                  min-[380px]:text-[15px]

                  sm:text-[18px]

                  md:text-[19px]

                  lg:text-[20px]
                "
              >
                MyPG
              </div>

              <button
                type="button"
                className="
                  relative
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-md
                  text-slate-800

                  sm:h-7
                  sm:w-7

                  md:h-8
                  md:w-8
                "
                aria-label="Notifications"
              >
                <Bell
                  className="
                    h-4
                    w-4

                    sm:h-4
                    sm:w-4

                    md:h-[17px]
                    md:w-[17px]
                  "
                  strokeWidth={1.8}
                />

                <span
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-2.5
                    min-w-2.5
                    items-center
                    justify-center
                    rounded-md
                    bg-red-500
                    px-0.5
                    text-[6px]
                    font-bold
                    leading-none
                    text-white

                    sm:h-3
                    sm:min-w-3
                  "
                >
                  3
                </span>
              </button>
            </div>

            {/* ROW 2 */}

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-2

                md:mt-3
              "
            >
              <h1
                className="
                  min-w-0
                  truncate
                  font-bold
                  leading-none
                  tracking-tight
                  text-slate-900

                  text-[16px]

                  min-[380px]:text-[17px]

                  sm:text-[18px]

                  md:text-[19px]

                  lg:text-[21px]
                "
              >
                Broadcast
              </h1>

              <button
                type="button"
                className="
                  flex
                  h-7
                  w-[86px]
                  shrink-0
                  items-center
                  justify-between
                  gap-1
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  px-2

                  min-[380px]:h-7
                  min-[380px]:w-[92px]

                  sm:h-8
                  sm:w-[102px]

                  md:h-8
                  md:w-[108px]

                  lg:h-9
                  lg:w-[120px]
                "
              >
                <span
                  className="
                    truncate
                    font-medium
                    text-slate-800

                    text-[8px]

                    min-[380px]:text-[9px]

                    sm:text-[10px]

                    md:text-[10px]
                  "
                >
                  {selectedPgName}
                </span>

                <ChevronDown
                  className="
                    h-3
                    w-3
                    shrink-0
                    text-slate-600
                  "
                />
              </button>
            </div>
          </header>

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div
            className="
              flex
              min-h-0
              flex-1
              flex-col
              gap-2
              overflow-hidden

              min-[380px]:gap-2.5

              sm:gap-3

              md:gap-4

              lg:gap-5
            "
          >
            {/* =================================================
                CREATE ANNOUNCEMENT
            ================================================= */}

            {roleLoaded && canSendAnnouncement && (
              <section
                className="
                shrink-0
                rounded-md
                border
                border-slate-200
                bg-white

                p-1.5

                min-[380px]:p-2

                sm:p-2.5

                md:p-3

                lg:p-3.5
              "
            >
              {/* SECTION TITLE */}

              <div
                className="
                  mb-1

                  font-bold
                  leading-none
                  text-slate-900

                  text-[10px]

                  min-[380px]:text-[11px]

                  sm:text-[12px]

                  md:text-[13px]

                  lg:text-[14px]
                "
              >
                Create Announcement
              </div>

              {/* =================================================
                  ANNOUNCEMENT TYPE CARDS (from useAlertMasterStore)
              ================================================= */}

              {alertCategories.length === 0 ? (
                <div
                  className="
                    py-2
                    text-center
                    text-slate-500

                    text-[8px]

                    sm:text-[9px]
                  "
                >
                  Loading categories…
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-5
                    gap-1

                    sm:gap-1.5

                    md:gap-2
                  "
                >
                  {alertCategories.map((category) => {
                    const categoryLabel =
                      getCategoryLabel(category);

                    const visual = getCategoryVisual(
                      categoryLabel
                    );

                    const Icon = visual.icon;

                    const active =
                      selectedCategoryId === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setSelectedCategoryId(category.id)
                        }
                        className={`
                          flex
                          min-w-0
                          flex-col
                          items-center
                          justify-center
                          rounded-md
                          border
                          transition

                          h-[43px]

                          min-[380px]:h-[46px]

                          sm:h-[50px]

                          md:h-[53px]

                          lg:h-[56px]

                          ${
                            active
                              ? "border-blue-300 bg-blue-50/30"
                              : "border-slate-200 bg-white"
                          }
                        `}
                      >
                        <span
                          className={`
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-md

                            min-[380px]:h-6
                            min-[380px]:w-6

                            sm:h-6
                            sm:w-6

                            md:h-7
                            md:w-7

                            ${visual.bgClass}
                          `}
                        >
                          <Icon
                            className={`
                              h-3
                              w-3

                              min-[380px]:h-3.5
                              min-[380px]:w-3.5

                              sm:h-3.5
                              sm:w-3.5

                              md:h-4
                              md:w-4

                              ${visual.iconClass}
                            `}
                            strokeWidth={2}
                          />
                        </span>

                        <span
                          className="
                            mt-0.5
                            max-w-full
                            truncate
                            px-0.5
                            font-medium
                            leading-none
                            text-slate-800

                            text-[6px]

                            min-[380px]:text-[7px]

                            sm:text-[8px]

                            md:text-[8px]

                            lg:text-[9px]
                          "
                        >
                          {categoryLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* =================================================
                  FORM AREA
              ================================================= */}

              <div
                className="
                  mt-1

                  md:mt-2
                "
              >
                {/* =================================================
                    MOBILE:
                    TITLE (+ DATE & TIME for Announcement)
                ================================================= */}

                <div
                  className={`
                    grid
                    gap-1

                    min-[380px]:gap-1.5

                    md:hidden

                    ${
                      isAnnouncementCategory
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }
                  `}
                >
                  {/* MOBILE TITLE */}

                  <div>
                    <label
                      className="
                        mb-0.5
                        block
                        font-semibold
                        leading-none
                        text-slate-800

                        text-[8px]

                        min-[380px]:text-[9px]
                      "
                    >
                      Title
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      placeholder="Announcement title"
                      className="
                        h-8
                        w-full
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-1.5
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-1
                        focus:ring-blue-100

                        text-[8px]

                        min-[380px]:h-9
                        min-[380px]:text-[9px]
                      "
                    />
                  </div>

                  {/* MOBILE DATE & TIME (Announcement only) */}

                  {isAnnouncementCategory && (
                    <EventDateTimeField
                      compact
                      value={eventDateTime}
                      onChange={setEventDateTime}
                    />
                  )}
                </div>

                {/* =================================================
                    MOBILE MESSAGE

                    Full width below Title (+ Date & Time).
                ================================================= */}

                <div
                  className="
                    mt-1
                    md:hidden
                  "
                >
                  <label
                    className="
                      mb-0.5
                      block
                      font-semibold
                      leading-none
                      text-slate-800

                      text-[8px]

                      min-[380px]:text-[9px]
                    "
                  >
                    Message
                  </label>

                  <div className="relative">
                    <textarea
                      value={message}
                      maxLength={500}
                      onChange={(event) =>
                        setMessage(
                          event.target.value
                        )
                      }
                      placeholder="Type your message here..."
                      className="
                        block
                        h-[38px]
                        w-full
                        resize-none
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-1.5
                        py-1
                        pr-10
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-1
                        focus:ring-blue-100

                        text-[8px]

                        min-[380px]:h-[41px]
                        min-[380px]:text-[9px]
                      "
                    />

                    <span
                      className="
                        absolute
                        bottom-1
                        right-1.5
                        text-slate-500

                        text-[6px]
                      "
                    >
                      {message.length}/500
                    </span>
                  </div>
                </div>

                {/* =================================================
                    TABLET + DESKTOP:
                    TITLE + (DATE & TIME) + MESSAGE SAME ROW
                ================================================= */}

                <div
                  className={`
                    hidden

                    md:grid
                    md:items-end
                    md:gap-2

                    lg:gap-2.5

                    ${
                      isAnnouncementCategory
                        ? "md:grid-cols-[1fr_1fr_1.4fr] lg:grid-cols-[1fr_1fr_1.5fr]"
                        : "md:grid-cols-[1fr_1.4fr] lg:grid-cols-[1fr_1.5fr]"
                    }
                  `}
                >
                  {/* TITLE */}

                  <div>
                    <label
                      className="
                        mb-0.5
                        block
                        font-semibold
                        leading-none
                        text-slate-800

                        text-[10px]

                        lg:text-[11px]
                      "
                    >
                      Title
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      placeholder="Enter announcement title"
                      className="
                        h-9
                        w-full
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-1.5
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-1
                        focus:ring-blue-100

                        text-[10px]

                        lg:h-10
                        lg:text-[11px]
                      "
                    />
                  </div>

                  {/* DATE & TIME (Announcement only) */}

                  {isAnnouncementCategory && (
                    <EventDateTimeField
                      value={eventDateTime}
                      onChange={setEventDateTime}
                    />
                  )}

                  {/* MESSAGE */}

                  <div>
                    <label
                      className="
                        mb-0.5
                        block
                        font-semibold
                        leading-none
                        text-slate-800

                        text-[10px]

                        lg:text-[11px]
                      "
                    >
                      Message
                    </label>

                    <div className="relative">
                      <textarea
                        value={message}
                        maxLength={500}
                        onChange={(event) =>
                          setMessage(
                            event.target.value
                          )
                        }
                        placeholder="Type your message here..."
                        className="
                          block
                          h-9
                          w-full
                          resize-none
                          rounded-md
                          border
                          border-slate-200
                          bg-white
                          px-1.5
                          py-1
                          pr-10
                          text-slate-800
                          outline-none
                          placeholder:text-slate-400
                          focus:border-blue-400
                          focus:ring-1
                          focus:ring-blue-100

                          text-[10px]

                          lg:h-10
                          lg:text-[11px]
                        "
                      />

                      <span
                        className="
                          absolute
                          bottom-1
                          right-1.5
                          text-slate-500

                          text-[7px]
                        "
                      >
                        {message.length}/500
                      </span>
                    </div>
                  </div>
                </div>

                {sendError && (
                  <div
                    className="
                      mt-1
                      text-red-500

                      text-[8px]

                      sm:text-[9px]
                    "
                  >
                    {sendError}
                  </div>
                )}

                {sendSuccess && (
                  <div
                    className="
                      mt-1
                      text-green-600

                      text-[8px]

                      sm:text-[9px]
                    "
                  >
                    {sendSuccess}
                  </div>
                )}

                {/* =================================================
                    MOBILE CHANNEL + SEND
                ================================================= */}

                <div
                  className="
                    mt-1
                    md:hidden
                  "
                >
                  <PreferredChannel
                    selectedChannel={
                      selectedChannel
                    }
                    setSelectedChannel={
                      setSelectedChannel
                    }
                  />

                  <SendButton
                    onClick={handleSend}
                    disabled={!canSend}
                    sending={sending}
                  />
                </div>

                {/* =================================================
                    TABLET + DESKTOP CHANNEL + SEND
                ================================================= */}

                <div
                  className="
                    hidden

                    md:flex
                    md:items-end
                    md:gap-2
                    md:mt-2

                    lg:gap-2.5
                  "
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        mb-0.5
                        font-semibold
                        leading-none
                        text-slate-800

                        text-[10px]

                        lg:text-[11px]
                      "
                    >
                      Preferred Channel
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-3
                        gap-1.5

                        lg:gap-2
                      "
                    >
                      <ChannelButton
                        selected={
                          selectedChannel ===
                          "in-app"
                        }
                        onClick={() =>
                          setSelectedChannel(
                            "in-app"
                          )
                        }
                        icon={
                          <Smartphone className="h-3 w-3 text-blue-600 sm:h-3.5 sm:w-3.5" />
                        }
                        iconBg="bg-blue-50"
                        title="In-App"
                        subtitle="MyPG App"
                      />

                      <ChannelButton
                        selected={
                          selectedChannel ===
                          "whatsapp"
                        }
                        onClick={() =>
                          setSelectedChannel(
                            "whatsapp"
                          )
                        }
                        icon={
                          <MessageCircle className="h-3 w-3 text-green-600 sm:h-3.5 sm:w-3.5" />
                        }
                        iconBg="bg-green-50"
                        title="WhatsApp"
                        subtitle="Instant delivery"
                      />

                      <ChannelButton
                        selected={
                          selectedChannel ===
                          "sms"
                        }
                        onClick={() =>
                          setSelectedChannel(
                            "sms"
                          )
                        }
                        icon={
                          <MessageCircle className="h-3 w-3 text-purple-600 sm:h-3.5 sm:w-3.5" />
                        }
                        iconBg="bg-purple-50"
                        title="SMS"
                        subtitle="Text message"
                      />
                    </div>
                  </div>

                  <SendButton
                    desktop
                    onClick={handleSend}
                    disabled={!canSend}
                    sending={sending}
                  />
                </div>
              </div>
              </section>
            )}

            {/* =================================================
                RECENT ANNOUNCEMENTS
            ================================================= */}

            <section
              className="
                flex
                min-h-0
                flex-1
                flex-col
                overflow-hidden
                rounded-md
                border
                border-slate-200
                bg-white

                px-1.5
                py-1.5

                min-[380px]:px-2
                min-[380px]:py-2

                sm:px-2.5
                sm:py-2

                md:px-3
                md:py-2

                lg:px-3.5
                lg:py-2.5
              "
            >
              {/* =================================================
                  HEADER

                  Extra breathing room prevents first card
                  from touching/cropping into heading.
              ================================================= */}

              <div
                className="
                  flex
                  min-h-[18px]
                  shrink-0
                  items-center
                  justify-between
                  gap-2
                  pb-1.5
                  mb-1

                  min-[380px]:min-h-[20px]
                  min-[380px]:pb-2

                  sm:min-h-[22px]
                  sm:pb-2

                  md:min-h-[24px]
                  md:pb-2
                  md:mb-1.5

                  lg:min-h-[25px]
                "
              >
                <h2
                  className="
                    min-w-0
                    truncate
                    font-bold
                    leading-tight
                    text-slate-900

                    text-[9px]

                    min-[380px]:text-[9px]

                    sm:text-[10px]

                    md:text-[11px]

                    lg:text-[12px]
                  "
                >
                  Recent Announcements
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (value) => !value
                    )
                  }
                  className="
                    shrink-0
                    font-medium
                    leading-tight
                    text-blue-600

                    text-[6px]

                    min-[380px]:text-[7px]

                    sm:text-[8px]

                    md:text-[9px]
                  "
                >
                  {showAll
                    ? "Show Less"
                    : "See All"}
                </button>
              </div>

              {/* =================================================
                  ANNOUNCEMENT LIST
              ================================================= */}

              <div
                className={`
                  min-h-0
                  flex-1
                  mt-0.5
                  space-y-0.5
                  pr-0.5

                  ${
                    showAll
                      ? "overflow-y-auto overscroll-contain"
                      : "overflow-hidden"
                  }
                `}
              >
                {alertsLoading && (
                  <div
                    className="
                      py-2
                      text-center
                      text-slate-500

                      text-[8px]

                      sm:text-[9px]
                    "
                  >
                    Loading announcements…
                  </div>
                )}

                {!alertsLoading && alertsError && (
                  <div
                    className="
                      py-2
                      text-center
                      text-red-500

                      text-[8px]

                      sm:text-[9px]
                    "
                  >
                    {alertsError}
                  </div>
                )}

                {!alertsLoading &&
                  !alertsError &&
                  visibleAnnouncements.length === 0 && (
                    <div
                      className="
                        py-2
                        text-center
                        text-slate-500

                        text-[8px]

                        sm:text-[9px]
                      "
                    >
                      No announcements yet.
                    </div>
                  )}

                {!alertsLoading &&
                  !alertsError &&
                  visibleAnnouncements.map(
                    (announcement) => (
                      <AnnouncementCard
                        key={
                          announcement.id
                        }
                        announcement={
                          announcement
                        }
                      />
                    )
                  )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   EVENT DATE & TIME FIELD

   Shown only when the "Announcement" category is selected.
   `compact` matches the smaller mobile sizing used elsewhere
   in the form; the default matches tablet/desktop sizing.
============================================================ */

function EventDateTimeField({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  // Block picking a moment that's already passed.
  const minValue = toDateTimeLocalValue(new Date());

  return (
    <div className="min-w-0">
      <label
        className={`
          mb-0.5
          block
          font-semibold
          leading-none
          text-slate-800

          ${
            compact
              ? "text-[8px] min-[380px]:text-[9px]"
              : "text-[10px] lg:text-[11px]"
          }
        `}
      >
        Date &amp; Time
      </label>

      <input
        type="datetime-local"
        value={value}
        min={minValue}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`
          w-full
          min-w-0
          rounded-md
          border
          border-slate-200
          bg-white
          px-1.5
          text-slate-800
          outline-none
          focus:border-blue-400
          focus:ring-1
          focus:ring-blue-100

          ${
            compact
              ? "h-8 text-[8px] min-[380px]:h-9 min-[380px]:text-[9px]"
              : "h-9 text-[10px] lg:h-10 lg:text-[11px]"
          }
        `}
      />
    </div>
  );
}

/* ============================================================
   PREFERRED CHANNEL - MOBILE
============================================================ */

interface PreferredChannelProps {
  selectedChannel: Channel;
  setSelectedChannel: (
    channel: Channel
  ) => void;
}

function PreferredChannel({
  selectedChannel,
  setSelectedChannel,
}: PreferredChannelProps) {
  return (
    <div>
      <div
        className="
          mb-0.5
          font-semibold
          leading-none
          text-slate-800

          text-[8px]

          min-[380px]:text-[9px]

          sm:text-[10px]
        "
      >
        Preferred Channel
      </div>

      <div
        className="
          grid
          grid-cols-3
          gap-0.5

          min-[380px]:gap-1

          sm:gap-1.5
        "
      >
        <ChannelButton
          selected={
            selectedChannel ===
            "in-app"
          }
          onClick={() =>
            setSelectedChannel(
              "in-app"
            )
          }
          icon={
            <Smartphone className="h-3 w-3 text-blue-600 sm:h-3.5 sm:w-3.5" />
          }
          iconBg="bg-blue-50"
          title="In-App"
          subtitle="MyPG App"
        />

        <ChannelButton
          selected={
            selectedChannel ===
            "whatsapp"
          }
          onClick={() =>
            setSelectedChannel(
              "whatsapp"
            )
          }
          icon={
            <MessageCircle className="h-3 w-3 text-green-600 sm:h-3.5 sm:w-3.5" />
          }
          iconBg="bg-green-50"
          title="WhatsApp"
          subtitle="Instant delivery"
        />

        <ChannelButton
          selected={
            selectedChannel ===
            "sms"
          }
          onClick={() =>
            setSelectedChannel("sms")
          }
          icon={
            <MessageCircle className="h-3 w-3 text-purple-600 sm:h-3.5 sm:w-3.5" />
          }
          iconBg="bg-purple-50"
          title="SMS"
          subtitle="Text message"
        />
      </div>
    </div>
  );
}

/* ============================================================
   SEND BUTTON
============================================================ */

function SendButton({
  desktop = false,
  onClick,
  disabled = false,
  sending = false,
}: {
  desktop?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  sending?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        items-center
        justify-center
        gap-1
        rounded-md
        bg-blue-600
        px-2
        font-medium
        leading-none
        text-white
        transition
        hover:bg-blue-700
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-blue-600

        ${
          desktop
            ? `
              h-8
              w-[150px]
              shrink-0
              text-[9px]

              lg:h-9
              lg:w-[165px]
              lg:text-[10px]
            `
            : `
              mt-1
              h-7
              w-full
              text-[8px]

              min-[380px]:h-8
              min-[380px]:text-[9px]

              sm:h-8
              sm:text-[9px]
            `
        }
      `}
    >
      <Megaphone
        className="
          h-3
          w-3

          sm:h-3.5
          sm:w-3.5

          md:h-3.5
          md:w-3.5
        "
      />

      <span>
        {sending ? "Sending…" : "Send Announcement"}
      </span>
    </button>
  );
}

/* ============================================================
   CHANNEL BUTTON
============================================================ */

interface ChannelButtonProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}

function ChannelButton({
  selected,
  onClick,
  icon,
  iconBg,
  title,
  subtitle,
}: ChannelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-w-0
        items-center
        gap-0.5
        rounded-md
        border
        px-1
        py-0.5

        min-[380px]:gap-1
        min-[380px]:px-1.5
        min-[380px]:py-1

        sm:gap-1
        sm:px-1.5
        sm:py-1

        md:px-1.5
        md:py-1

        ${
          selected
            ? "border-blue-400 bg-blue-50/30"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <span
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-md

          min-[380px]:h-5
          min-[380px]:w-5

          sm:h-6
          sm:w-6

          md:h-6
          md:w-6

          ${iconBg}
        `}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span
          className="
            block
            truncate
            font-medium
            leading-none
            text-slate-800

            text-[6px]

            min-[380px]:text-[7px]

            sm:text-[8px]

            md:text-[8px]

            lg:text-[9px]
          "
        >
          {title}
        </span>

        <span
          className="
            mt-0.5
            block
            truncate
            leading-none
            text-slate-500

            text-[5px]

            min-[380px]:text-[6px]

            sm:text-[7px]

            md:text-[7px]
          "
        >
          {subtitle}
        </span>
      </span>

      <span
        className={`
          flex
          h-3
          w-3
          shrink-0
          items-center
          justify-center
          rounded-md
          border

          sm:h-3.5
          sm:w-3.5

          ${
            selected
              ? "border-blue-600"
              : "border-slate-400"
          }
        `}
      >
        {selected && (
          <span
            className="
              h-1
              w-1
              rounded-md
              bg-blue-600
            "
          />
        )}
      </span>
    </button>
  );
}

/* ============================================================
   ANNOUNCEMENT CARD
============================================================ */

function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  const visual = getCategoryVisual(
    announcement.categoryLabel
  );

  const Icon = visual.icon;

  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-1
        rounded-md
        border
        border-slate-200
        bg-white

        px-1
        py-1

        min-[380px]:gap-1
        min-[380px]:px-1
        min-[380px]:py-1

        sm:gap-1.5
        sm:px-1.5
        sm:py-1

        md:gap-1.5
        md:px-1.5
        md:py-1

        lg:px-2
    "
    >
      {/* ICON */}

      <span
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-md

          min-[380px]:h-5
          min-[380px]:w-5

          sm:h-6
          sm:w-6

          md:h-6
          md:w-6

          lg:h-7
          lg:w-7

          ${visual.bgClass}
        `}
      >
        <Icon
          className={`
            h-3
            w-3

            min-[380px]:h-3
            min-[380px]:w-3

            sm:h-3.5
            sm:w-3.5

            md:h-3.5
            md:w-3.5

            lg:h-3.5
            lg:w-3.5

            ${visual.iconClass}
          `}
          strokeWidth={2}
        />
      </span>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div
          className="
            truncate
            font-semibold
            leading-tight
            text-slate-800

            text-[6px]

            min-[380px]:text-[6px]

            sm:text-[7px]

            md:text-[7px]

            lg:text-[8px]
          "
        >
          {announcement.title}
        </div>

        <div
          className="
            mt-0.5
            truncate
            leading-tight
            text-slate-500

            text-[5px]

            min-[380px]:text-[5px]

            sm:text-[6px]

            md:text-[6px]

            lg:text-[7px]
          "
        >
          {announcement.date}

          <span className="mx-0.5">
            •
          </span>

          {announcement.time}
        </div>

        <div
          className="
            mt-0.5
            truncate
            leading-tight
            text-slate-500

            text-[5px]

            min-[380px]:text-[5px]

            sm:text-[6px]

            md:text-[6px]

            lg:text-[7px]
          "
        >
          Audience:{" "}
          {announcement.audience}
        </div>
      </div>

      {/* STATUS + VIEW */}

      <div
        className="
          flex
          shrink-0
          flex-col
          items-end
          justify-center
          gap-0.5
        "
      >
        <span
          className={`
            rounded-md
            px-1
            py-0.5
            font-medium
            leading-none

            text-[5px]

            min-[380px]:text-[5px]

            sm:text-[6px]

            md:text-[6px]

            lg:text-[7px]

            ${STATUS_CONFIG[
              announcement.status
            ]}
          `}
        >
          {announcement.status}
        </span>

        <button
          type="button"
          className="
            flex
            items-center
            gap-0.5
            whitespace-nowrap
            leading-none
            text-slate-500

            text-[5px]

            min-[380px]:text-[5px]

            sm:text-[6px]

            md:text-[6px]

            hover:text-blue-600
          "
        >
          <Eye
            className="
              h-2
              w-2

              sm:h-2.5
              sm:w-2.5
            "
          />

          <span className="hidden min-[360px]:inline">
            View Details
          </span>
        </button>
      </div>

      {/* MORE */}

      <button
        type="button"
        className="
          flex
          h-4
          w-3
          shrink-0
          items-center
          justify-center
          rounded-md
          text-slate-400

          sm:h-5
          sm:w-4

          hover:text-slate-800
        "
        aria-label="More options"
      >
        <MoreVertical
          className="
            h-2.5
            w-2.5

            sm:h-3
            sm:w-3
          "
        />
      </button>
    </div>
  );
}