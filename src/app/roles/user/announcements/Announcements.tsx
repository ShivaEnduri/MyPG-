
import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Droplets,
  Loader2,
  Megaphone,
  MessageCircle,
  PartyPopper,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import {
  AnnouncementRecord,
} from "@/app/shared/services/api/residentApiServices";

import {
  useAnnouncementsStore,
} from "@/app/shared/store/announcementsStore";

import {
  useUserPgMapStore,
} from "@/app/shared/store/userPgMapStore";

import { useAuth } from "@/hooks/context/AuthContext";

/* =========================================================
   TYPES
========================================================= */

type SelectedCategory =
  | "all"
  | "important"
  | "utilities"
  | "events";

type UIStatus =
  | "new"
  | "scheduled"
  | "important"
  | "general"
  | "read";

/* =========================================================
   DATE HELPERS
========================================================= */

const formatAnnouncementDate = (
  date?: string | null
): string => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAnnouncementTime = (
  date?: string | null
): string => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* =========================================================
   CATEGORY HELPER
========================================================= */

const getAnnouncementCategory = (
  announcement: AnnouncementRecord
): SelectedCategory | "general" => {
  const type =
    announcement.type?.toLowerCase() || "";

  const uiCategory =
    announcement.uiCategory?.toLowerCase() || "";

  const category =
    announcement.category?.toLowerCase() || "";

  if (
    type === "event" ||
    uiCategory.includes("event")
  ) {
    return "events";
  }

  if (announcement.isImportant) {
    return "important";
  }

  const utilityKeywords = [
    "maintenance",
    "water",
    "electric",
    "electrical",
    "utility",
    "utilities",
    "cleaning",
    "repair",
    "power",
    "internet",
    "wifi",
  ];

  if (
    utilityKeywords.some((keyword) =>
      category.includes(keyword)
    )
  ) {
    return "utilities";
  }

  return "general";
};

/* =========================================================
   STATUS HELPER
========================================================= */

const getAnnouncementStatus = (
  announcement: AnnouncementRecord
): UIStatus => {
  if (announcement.isRead === true) {
    return "read";
  }

  if (announcement.isNew === true) {
    return "new";
  }

  if (announcement.isImportant) {
    return "important";
  }

  const status = (
    announcement.uiStatus ||
    announcement.status ||
    ""
  ).toLowerCase();

  if (
    status === "scheduled" ||
    status === "upcoming"
  ) {
    return "scheduled";
  }

  return "general";
};

/* =========================================================
   ICON
========================================================= */

const getAnnouncementIcon = (
  announcement: AnnouncementRecord
): ReactNode => {
  const title =
    announcement.title?.toLowerCase() || "";

  const category =
    announcement.category?.toLowerCase() || "";

  const type =
    announcement.type?.toLowerCase() || "";

  const uiCategory =
    announcement.uiCategory?.toLowerCase() || "";

  if (
    title.includes("water") ||
    category.includes("water")
  ) {
    return (
      <Droplets className="h-3.5 w-3.5" />
    );
  }

  if (
    title.includes("clean") ||
    title.includes("cleaning")
  ) {
    return (
      <Sparkles className="h-3.5 w-3.5" />
    );
  }

  if (
    type === "event" ||
    uiCategory.includes("event")
  ) {
    return (
      <PartyPopper className="h-3.5 w-3.5" />
    );
  }

  if (
    title.includes("electric") ||
    title.includes("power") ||
    category.includes("electric")
  ) {
    return (
      <Zap className="h-3.5 w-3.5" />
    );
  }

  if (
    title.includes("guest") ||
    title.includes("visitor")
  ) {
    return (
      <Users className="h-3.5 w-3.5" />
    );
  }

  if (announcement.isImportant) {
    return (
      <AlertCircle className="h-3.5 w-3.5" />
    );
  }

  return (
    <Megaphone className="h-3.5 w-3.5" />
  );
};

/* =========================================================
   ICON COLOR
========================================================= */

const getIconStyles = (
  announcement: AnnouncementRecord
): string => {
  const category =
    getAnnouncementCategory(
      announcement
    );

  switch (category) {
    case "utilities":
      return "bg-blue-50 text-blue-600";

    case "events":
      return "bg-purple-50 text-purple-600";

    case "important":
      return "bg-orange-50 text-orange-600";

    default:
      return "bg-emerald-50 text-emerald-600";
  }
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge: FC<{
  announcement: AnnouncementRecord;
}> = ({ announcement }) => {
  const status =
    getAnnouncementStatus(
      announcement
    );

  const config: Record<
    UIStatus,
    {
      label: string;
      className: string;
    }
  > = {
    new: {
      label: "New",
      className:
        "bg-blue-50 text-blue-600 border-blue-100",
    },

    scheduled: {
      label: "Scheduled",
      className:
        "bg-emerald-50 text-emerald-600 border-emerald-100",
    },

    important: {
      label: "Important",
      className:
        "bg-orange-50 text-orange-600 border-orange-100",
    },

    general: {
      label: "General",
      className:
        "bg-purple-50 text-purple-600 border-purple-100",
    },

    read: {
      label: "Read",
      className:
        "bg-gray-50 text-gray-500 border-gray-200",
    },
  };

  const item = config[status];

  return (
    <span
      className={`
        shrink-0
        rounded-md
        border
        px-1.5
        py-0.5
        text-[8px]
        font-medium
        leading-none

        sm:text-[9px]

        ${item.className}
      `}
    >
      {item.label}
    </span>
  );
};

/* =========================================================
   CATEGORY TAB
========================================================= */

const CategoryTab: FC<{
  label: string;
  count: number;
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
}> = ({
  label,
  count,
  active,
  icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-7
        min-w-0
        flex-1
        items-center
        justify-center
        gap-1
        overflow-hidden
        rounded-lg
        border
        px-1
        text-[9px]
        font-medium
        transition-colors

        sm:h-9
        sm:px-2
        sm:text-xs

        ${
          active
            ? "border-blue-400 bg-blue-50 text-blue-600"
            : "border-gray-200 bg-white text-gray-600"
        }
      `}
    >
      {icon}

      <span className="truncate">
        {label}
      </span>

      <span
        className={`
          shrink-0
          text-[8px]

          sm:text-[10px]

          ${
            active
              ? "text-blue-500"
              : "text-gray-400"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};

/* =========================================================
   SUMMARY ITEM
========================================================= */

const SummaryItem: FC<{
  icon: ReactNode;
  label: string;
  value: number;
  iconClassName: string;
  valueClassName: string;
}> = ({
  icon,
  label,
  value,
  iconClassName,
  valueClassName,
}) => {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <div
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full

          sm:h-7
          sm:w-7

          ${iconClassName}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8px] leading-3 text-gray-500 sm:text-[10px]">
          {label}
        </p>

        <p
          className={`
            text-sm
            font-semibold
            leading-4

            sm:text-lg

            ${valueClassName}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   ANNOUNCEMENT CARD
========================================================= */

const AnnouncementCard: FC<{
  announcement: AnnouncementRecord;
}> = ({ announcement }) => {
  const iconStyles =
    getIconStyles(announcement);

  const announcementDate =
    announcement.eventDate;

  const audience =
    announcement.receiverRole ||
    "All Residents";

  return (
    <button
      type="button"
      className="
        group
        flex
        w-full
        min-w-0
        items-center
        gap-1.5
        px-2
        py-1.5
        text-left

        sm:gap-3
        sm:px-3
        sm:py-2.5
      "
    >
      {/* ICON */}

      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full

          sm:h-8
          sm:w-8

          ${iconStyles}
        `}
      >
        {getAnnouncementIcon(
          announcement
        )}
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-1.5
          "
        >
          <h3
            className="
              min-w-0
              flex-1
              truncate
              text-[10px]
              font-semibold
              leading-3.5
              text-gray-900

              sm:text-xs
              lg:text-sm
            "
          >
            {announcement.title}
          </h3>

          <StatusBadge
            announcement={announcement}
          />
        </div>

        <div
          className="
            mt-0.5
            flex
            min-w-0
            items-center
            gap-1
            overflow-hidden
            whitespace-nowrap
            text-[7px]
            leading-3
            text-gray-400

            sm:text-[9px]
          "
        >
          <span className="shrink-0">
            {formatAnnouncementDate(
              announcementDate
            )}
          </span>

          {formatAnnouncementTime(
            announcementDate
          ) && (
            <>
              <span>•</span>

              <span className="shrink-0">
                {formatAnnouncementTime(
                  announcementDate
                )}
              </span>
            </>
          )}

          <span>•</span>

          <span className="truncate">
            {audience}
          </span>
        </div>

        <p
          className="
            mt-0.5
            truncate
            text-[8px]
            leading-3
            text-gray-500

            sm:text-[10px]
          "
        >
          {announcement.description ||
            "No additional details available."}
        </p>
      </div>

      <ChevronRight
        className="
          h-3
          w-3
          shrink-0
          text-gray-400
        "
      />
    </button>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ResidentAnnouncements: FC = () => {
  /* =======================================================
     AUTH
  ======================================================= */

  const { dbUser } = useAuth();

  /* =======================================================
     USER PG MAP STORE
  ======================================================= */

  const {
    userPgMapList,
    loading: pgLoading,
    error: pgError,
    fetchUserPgMap,
  } = useUserPgMapStore();

  /* =======================================================
     ANNOUNCEMENTS STORE
  ======================================================= */

  const {
    announcementsData,
    announcements,
    loading: announcementsLoading,
    error: announcementsError,
    fetchAnnouncements,
  } = useAnnouncementsStore();

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<SelectedCategory>("all");

  const [showAll, setShowAll] =
    useState(false);

  /* =======================================================
     1. FETCH USER PG MAP
  ======================================================= */

  useEffect(() => {
    if (!dbUser?.id) {
      return;
    }

    fetchUserPgMap(
      Number(dbUser.id)
    );
  }, [
    dbUser?.id,
    fetchUserPgMap,
  ]);

  /* =======================================================
     2. REMOVE DUPLICATE PGs
     
     API can return multiple mapping records
     for the same pg_id.
  ======================================================= */

  const uniquePgs = useMemo(() => {
    const pgMap = new Map<
      number,
      (typeof userPgMapList)[number]
    >();

    userPgMapList.forEach((item) => {
      if (!pgMap.has(item.pg_id)) {
        pgMap.set(item.pg_id, item);
      }
    });

    return Array.from(pgMap.values());
  }, [userPgMapList]);

  /* =======================================================
     3. CURRENT PG
     
     Currently use first unique PG.
     If you already have a selected-PG store,
     this can later be connected to it.
  ======================================================= */

  const selectedPg =
    uniquePgs[0] ?? null;

  const pgId =
    selectedPg?.pg_id ?? null;

  /* =======================================================
     4. FETCH ANNOUNCEMENTS USING pgId
     
     IMPORTANT:
     We only call announcements API after
     userPgMap has returned a pg_id.
  ======================================================= */

  useEffect(() => {
    if (!pgId) {
      return;
    }

    fetchAnnouncements(pgId);
  }, [
    pgId,
    fetchAnnouncements,
  ]);

  /* =======================================================
     API DATA
  ======================================================= */

  const summary =
    announcementsData?.summary;

  const filters =
    announcementsData?.filters;

  /* =======================================================
     FILTER ANNOUNCEMENTS
  ======================================================= */

  const filteredAnnouncements =
    useMemo(() => {
      if (
        selectedCategory === "all"
      ) {
        return announcements;
      }

      return announcements.filter(
        (announcement) =>
          getAnnouncementCategory(
            announcement
          ) === selectedCategory
      );
    }, [
      announcements,
      selectedCategory,
    ]);

  /* =======================================================
     PREVIEW
  ======================================================= */

  const PREVIEW_COUNT = 5;

  const hasMore =
    filteredAnnouncements.length >
    PREVIEW_COUNT;

  const visibleAnnouncements =
    showAll
      ? filteredAnnouncements
      : filteredAnnouncements.slice(
          0,
          PREVIEW_COUNT
        );

  /* =======================================================
     PAGE STATES
  ======================================================= */

  const pageLoading =
    pgLoading ||
    announcementsLoading;

  const pageError =
    pgError ||
    announcementsError;

  /* =======================================================
     CATEGORY CHANGE
  ======================================================= */

  const handleCategoryChange = (
    category: SelectedCategory
  ) => {
    setSelectedCategory(category);

    /*
     * When category changes, return to
     * the compact non-scroll state.
     */
    setShowAll(false);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <PageShell
      noScroll
      bottomPad={72}
      className="
        overflow-hidden
        bg-[#FAFBFC]
      "
    >
      <div
        className="
          flex
          h-full
          min-h-0
          w-full
          min-w-0
          flex-col
          overflow-hidden
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            shrink-0
            overflow-hidden
            pb-1
          "
        >
          {/* MyPG + Notification */}

          <div
            className="
              flex
              h-6
              items-center
              justify-between
            "
          >
            <h1
              className="
                text-base
                font-bold
                leading-none
                text-blue-600

                sm:text-xl
              "
            >
              MyPG
            </h1>

            <button
              type="button"
              className="
                relative
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
              "
            >
              <Bell className="h-3.5 w-3.5 text-gray-700" />

              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-3
                  min-w-3
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-500
                  px-0.5
                  text-[6px]
                  font-semibold
                  text-white
                "
              >
                3
              </span>
            </button>
          </div>

          {/* Page title + PG */}

          <div
            className="
              mt-0.5
              flex
              min-w-0
              items-center
              justify-between
              gap-1.5
            "
          >
            <h2
              className="
                min-w-0
                truncate
                text-base
                font-bold
                leading-5
                text-gray-900

                sm:text-xl
              "
            >
              Announcements
            </h2>

            <button
              type="button"
              className="
                flex
                h-6
                max-w-[145px]
                shrink-0
                items-center
                gap-1
                rounded-md
                border
                border-gray-200
                bg-white
                px-1.5
                text-[8px]
                font-medium
                text-gray-700

                sm:h-8
                sm:max-w-[220px]
                sm:px-2.5
                sm:text-[10px]
              "
            >
              <span className="truncate">
                {selectedPg?.pg_name ||
                  "Loading PG..."}
              </span>

              <ChevronDown className="h-2.5 w-2.5 shrink-0" />
            </button>
          </div>
        </header>

        {/* =================================================
            CATEGORY FILTERS
        ================================================= */}

        <div
          className="
            shrink-0
            overflow-hidden
            pb-1
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-4
              gap-1
            "
          >
            <CategoryTab
              label="All"
              count={
                filters?.all?.count ??
                summary?.all ??
                0
              }
              active={
                selectedCategory ===
                "all"
              }
              onClick={() =>
                handleCategoryChange(
                  "all"
                )
              }
              icon={
                <Megaphone className="h-2.5 w-2.5" />
              }
            />

            <CategoryTab
              label="Important"
              count={
                filters?.important
                  ?.count ??
                summary?.important ??
                0
              }
              active={
                selectedCategory ===
                "important"
              }
              onClick={() =>
                handleCategoryChange(
                  "important"
                )
              }
              icon={
                <AlertCircle className="h-2.5 w-2.5 text-orange-500" />
              }
            />

            <CategoryTab
              label="Utilities"
              count={
                filters?.utilities
                  ?.count ?? 0
              }
              active={
                selectedCategory ===
                "utilities"
              }
              onClick={() =>
                handleCategoryChange(
                  "utilities"
                )
              }
              icon={
                <Droplets className="h-2.5 w-2.5 text-blue-600" />
              }
            />

            <CategoryTab
              label="Events"
              count={
                filters?.events?.count ??
                summary?.events ??
                0
              }
              active={
                selectedCategory ===
                "events"
              }
              onClick={() =>
                handleCategoryChange(
                  "events"
                )
              }
              icon={
                <CalendarDays className="h-2.5 w-2.5 text-purple-600" />
              }
            />
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            gap-1
            overflow-hidden
          "
        >
          {/* =================================================
              SUMMARY
          ================================================= */}

          <section
            className="
              shrink-0
              overflow-hidden
              rounded-lg
              border
              border-gray-200
              bg-white
              px-2
              py-1.5

              sm:rounded-xl
              sm:px-2.5
              sm:py-2
            "
          >
            <div className="flex items-center">
              <SummaryItem
                label="New"
                value={
                  summary?.new ?? 0
                }
                icon={
                  <Megaphone className="h-3 w-3" />
                }
                iconClassName="bg-blue-50 text-blue-600"
                valueClassName="text-blue-600"
              />

              <div className="mx-1.5 h-6 w-px bg-gray-200 sm:mx-2 sm:h-7" />

              <SummaryItem
                label="Important"
                value={
                  summary?.important ??
                  0
                }
                icon={
                  <AlertCircle className="h-3 w-3" />
                }
                iconClassName="bg-orange-50 text-orange-500"
                valueClassName="text-orange-500"
              />

              <div className="mx-1.5 h-6 w-px bg-gray-200 sm:mx-2 sm:h-7" />

              <SummaryItem
                label="This Week"
                value={
                  summary?.thisWeek ?? 0
                }
                icon={
                  <CalendarDays className="h-3 w-3" />
                }
                iconClassName="bg-emerald-50 text-emerald-500"
                valueClassName="text-emerald-500"
              />
            </div>
          </section>

          {/* =================================================
              ANNOUNCEMENTS LIST
          ================================================= */}

          <section
            className="
              flex
              min-h-0
              flex-1
              flex-col
              overflow-hidden
              rounded-lg
              border
              border-gray-200
              bg-white

              sm:rounded-xl
            "
          >
            {/* LIST */}

            <div
              className={`
                min-h-0
                min-w-0
                flex-1

                ${
                  showAll
                    ? "overflow-x-hidden overflow-y-auto"
                    : "overflow-hidden"
                }
              `}
            >
              {pageLoading ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-[100px]
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    text-gray-500
                  "
                >
                  <Loader2 className="h-4 w-4 animate-spin" />

                  <span>
                    Loading announcements...
                  </span>
                </div>
              ) : pageError ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-[100px]
                    items-center
                    justify-center
                    px-4
                    text-center
                    text-xs
                    text-red-500
                  "
                >
                  {pageError}
                </div>
              ) : !dbUser?.id ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-[100px]
                    items-center
                    justify-center
                    px-4
                    text-center
                    text-xs
                    text-gray-500
                  "
                >
                  Unable to identify the
                  logged-in user.
                </div>
              ) : uniquePgs.length === 0 ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-[100px]
                    items-center
                    justify-center
                    px-4
                    text-center
                    text-xs
                    text-gray-500
                  "
                >
                  No PGs available for
                  this account.
                </div>
              ) : filteredAnnouncements.length ===
                0 ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-[100px]
                    items-center
                    justify-center
                    px-4
                    text-center
                    text-xs
                    text-gray-500
                  "
                >
                  No announcements found.
                </div>
              ) : (
                visibleAnnouncements.map(
                  (
                    announcement,
                    index
                  ) => (
                    <React.Fragment
                      key={
                        announcement.id
                      }
                    >
                      <AnnouncementCard
                        announcement={
                          announcement
                        }
                      />

                      {index <
                        visibleAnnouncements.length -
                          1 && (
                        <div className="mx-2 border-b border-gray-100" />
                      )}
                    </React.Fragment>
                  )
                )
              )}
            </div>

            {/* =================================================
                VIEW ALL
            ================================================= */}

            {!pageLoading &&
              !pageError &&
              hasMore && (
                <div
                  className="
                    shrink-0
                    border-t
                    border-gray-100
                    bg-white
                    px-2
                    py-1
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowAll(
                        (value) =>
                          !value
                      )
                    }
                    className="
                      mx-auto
                      flex
                      h-6
                      items-center
                      gap-1
                      rounded-md
                      px-3
                      text-[9px]
                      font-medium
                      text-blue-600

                      hover:bg-blue-50
                    "
                  >
                    {showAll
                      ? "Show Less"
                      : `View All (${filteredAnnouncements.length})`}

                    <ChevronDown
                      className={`
                        h-3
                        w-3
                        transition-transform

                        ${
                          showAll
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>
                </div>
              )}
          </section>

          {/* =================================================
              NEED HELP
          ================================================= */}

          <section
            className="
              shrink-0
              overflow-hidden
              rounded-lg
              border
              border-gray-200
              bg-white
              px-2
              py-1.5

              sm:rounded-xl
              sm:px-2.5
              sm:py-2
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                justify-between
                gap-1.5
              "
            >
              {/* HELP TEXT */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-1.5
                "
              >
                <div
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-blue-600

                    sm:h-7
                    sm:w-7
                  "
                >
                  <MessageCircle className="h-3 w-3" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold leading-3 text-gray-900 sm:text-[10px]">
                    Need Help?
                  </p>

                  <p className="truncate text-[7px] leading-3 text-gray-500 sm:text-[8px]">
                    Have questions about an
                    announcement?
                  </p>
                </div>
              </div>

              {/* CONTACT BUTTON */}

              <button
                type="button"
                className="
                  flex
                  h-6
                  shrink-0
                  items-center
                  gap-1
                  rounded-md
                  border
                  border-blue-500
                  px-1.5
                  text-[8px]
                  font-medium
                  text-blue-600

                  sm:h-7
                  sm:px-2
                  sm:text-[9px]
                "
              >
                <MessageCircle className="h-3 w-3" />

                <span className="hidden sm:inline">
                  Contact Manager
                </span>

                <span className="sm:hidden">
                  Contact
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
};

export default ResidentAnnouncements;