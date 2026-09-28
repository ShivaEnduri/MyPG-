import { FC, useEffect, useMemo, useState } from "react";

import {
  Bell,
  ChevronDown,
  DoorOpen,
  BedDouble,
  Users,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  IndianRupee,
  Wifi,
  Paintbrush,
  Droplet,
  Shirt,
  ShieldCheck,
  Flame,
  Phone,
  MessageSquare,
  LogOut,
  Tv,
  Wind,
  Waves,
} from "lucide-react";

import { PageShell } from "@/app/shared/components/PageShell";

import { useAuth } from "../../../../hooks/context/AuthContext";
import { useMyStayStore } from "@/app/shared/store/myStayStore";

/* ----------------------------------------------------------------------- */
/* Types                                                                   */
/* ----------------------------------------------------------------------- */

type Tone =
  | "blue"
  | "purple"
  | "orange"
  | "green"
  | "red"
  | "gray";

interface Amenity {
  id: number;
  label: string;
  icon: React.ElementType;
  tone: Tone;
}

/* ----------------------------------------------------------------------- */
/* Responsive default row count                                            */
/* ----------------------------------------------------------------------- */

const BREAKPOINT_VISIBLE_COUNTS: [minWidth: number, count: number][] = [
  [1280, 4],
  [1024, 3],
  [640, 3],
  [0, 2],
];

function useResponsiveVisibleCount(): number {
  const [count, setCount] = useState(2);

  useEffect(() => {
    const computeCount = () => {
      const width = window.innerWidth;

      const match = BREAKPOINT_VISIBLE_COUNTS.find(
        ([minWidth]) => width >= minWidth
      );

      setCount(match ? match[1] : 2);
    };

    computeCount();

    window.addEventListener("resize", computeCount);

    return () => {
      window.removeEventListener("resize", computeCount);
    };
  }, []);

  return count;
}

/* ----------------------------------------------------------------------- */
/* Size scale                                                              */
/* ----------------------------------------------------------------------- */

const TXT = {
  micro: "text-[5px] sm:text-[6.5px] lg:text-[7px] xl:text-[7.5px]",
  label: "text-[5.5px] sm:text-[7px] lg:text-[7.5px] xl:text-[8.5px]",
  value: "text-[7.5px] sm:text-[9.5px] lg:text-[9.5px] xl:text-[10.5px]",
  chip: "text-[6px] sm:text-[7.5px] lg:text-[7.5px] xl:text-[9px]",
  sectionTitle:
    "text-[8px] sm:text-[10px] lg:text-[10px] xl:text-[11.5px]",
  pageTitle:
    "text-xs sm:text-sm lg:text-[13.5px] xl:text-[15px]",
  logo: "text-sm sm:text-base lg:text-[15px] xl:text-[17px]",
  button:
    "text-[6px] sm:text-[7.5px] lg:text-[7.5px] xl:text-[9px]",
};

const ICON = {
  xs: "h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-[8.5px] lg:w-[8.5px] xl:h-2.5 xl:w-2.5",
  sm: "h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-2.5 lg:w-2.5 xl:h-3 xl:w-3",
  md: "h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5",
};

const BOX = {
  sm: "h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5",
  md: "h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7",
};

/* ----------------------------------------------------------------------- */
/* Style maps                                                              */
/* ----------------------------------------------------------------------- */

const toneIconBg: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

const avatarTones: Tone[] = [
  "green",
  "blue",
  "purple",
  "orange",
];

/* ----------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ----------------------------------------------------------------------- */

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount?: number | null) => {
  if (amount === null || amount === undefined) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatSharingType = (sharingType?: string | null) => {
  if (!sharingType) return "—";

  return sharingType
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAmenityName = (name?: string) => {
  if (!name) return "Amenity";

  const formatted = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();

  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getAmenityIcon = (
  name: string
): {
  icon: React.ElementType;
  tone: Tone;
} => {
  const normalized = name.toLowerCase();

  if (normalized.includes("wifi")) {
    return {
      icon: Wifi,
      tone: "blue",
    };
  }

  if (
    normalized.includes("housekeeping") ||
    normalized.includes("clean")
  ) {
    return {
      icon: Paintbrush,
      tone: "orange",
    };
  }

  if (
    normalized.includes("water") &&
    !normalized.includes("hot")
  ) {
    return {
      icon: Droplet,
      tone: "blue",
    };
  }

  if (normalized.includes("laundry")) {
    return {
      icon: Shirt,
      tone: "gray",
    };
  }

  if (
    normalized.includes("security") ||
    normalized.includes("cctv")
  ) {
    return {
      icon: ShieldCheck,
      tone: "blue",
    };
  }

  if (normalized.includes("hotwater")) {
    return {
      icon: Flame,
      tone: "red",
    };
  }

  if (normalized.includes("hot water")) {
    return {
      icon: Flame,
      tone: "red",
    };
  }

  if (normalized.includes("electricity")) {
    return {
      icon: Waves,
      tone: "orange",
    };
  }

  if (
    normalized.includes("tv") ||
    normalized.includes("television")
  ) {
    return {
      icon: Tv,
      tone: "purple",
    };
  }

  if (normalized.includes("ac")) {
    return {
      icon: Wind,
      tone: "blue",
    };
  }

  return {
    icon: CheckCircle2,
    tone: "green",
  };
};

/* ----------------------------------------------------------------------- */
/* Presentational components                                                */
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
    } ${BOX[size]}`}
  >
    <Icon
      className={size === "md" ? ICON.md : ICON.sm}
    />
  </div>
);

const InfoItem: FC<{
  icon: React.ElementType;
  tone: Tone;
  label: string;
  value: string;
  valueColor?: string;
}> = ({
  icon,
  tone,
  label,
  value,
  valueColor = "text-gray-900",
}) => (
  <div className="flex items-center gap-1">
    <IconBox icon={icon} tone={tone} />

    <div className="min-w-0">
      <p
        className={`truncate text-gray-500 ${TXT.label}`}
      >
        {label}
      </p>

      <p
        className={`truncate font-bold ${TXT.value} ${valueColor}`}
      >
        {value}
      </p>
    </div>
  </div>
);

const RoomDetailChip: FC<{
  icon: React.ElementType;
  tone: Tone;
  label: string;
  value: string;
}> = ({
  icon,
  tone,
  label,
  value,
}) => (
  <div className="flex flex-col items-center gap-1 rounded border border-gray-100 bg-white px-1 py-1.5 text-center shadow-sm">
    <IconBox
      icon={icon}
      tone={tone}
      size="md"
    />

    <p
      className={`leading-tight text-gray-500 ${TXT.micro}`}
    >
      {label}
    </p>

    <p
      className={`truncate font-bold text-gray-900 ${TXT.chip}`}
    >
      {value}
    </p>
  </div>
);

const AmenityChip: FC<{
  item: Amenity;
}> = ({ item }) => (
  <div
    className={`flex shrink-0 items-center gap-1 rounded-full border border-gray-100 px-1.5 py-1 shadow-sm ${toneIconBg[item.tone]}`}
  >
    <item.icon className={ICON.sm} />

    <span
      className={`whitespace-nowrap font-semibold ${TXT.chip}`}
    >
      {item.label}
    </span>
  </div>
);

const Avatar: FC<{
  tone: Tone;
  size?: "sm" | "md";
}> = ({
  tone,
  size = "sm",
}) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full ${
      toneIconBg[tone]
    } ${
      size === "md" ? BOX.md : BOX.sm
    }`}
  >
    <Users
      className={
        size === "md" ? ICON.md : ICON.sm
      }
    />
  </div>
);

const RoundIconButton: FC<{
  icon: React.ElementType;
  onClick?: () => void;
}> = ({
  icon: Icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex shrink-0 items-center justify-center rounded border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-6 xl:w-6"
  >
    <Icon className={ICON.sm} />
  </button>
);

/* ----------------------------------------------------------------------- */
/* Main screen                                                             */
/* ----------------------------------------------------------------------- */

interface MyStayProps {
  bottomNavHeight?: number;
}

export const MyStay: FC<MyStayProps> = ({
  bottomNavHeight = 56,
}) => {
  const [expanded, setExpanded] =
    useState(false);

  const defaultVisibleCount =
    useResponsiveVisibleCount();

  /* --------------------------------------------------------------------- */
  /* Auth                                                                  */
  /* --------------------------------------------------------------------- */

  const { user } = useAuth();

  /* --------------------------------------------------------------------- */
  /* Store                                                                 */
  /* --------------------------------------------------------------------- */

  const {
    myStay,
    isLoading,
    error,
    fetchMyStay,
  } = useMyStayStore();

  /* --------------------------------------------------------------------- */
  /* Fetch My Stay                                                         */
  /* --------------------------------------------------------------------- */

  useEffect(() => {
    if (user?.id) {
      fetchMyStay(user.id);
    }
  }, [user?.id, fetchMyStay]);

  /* --------------------------------------------------------------------- */
  /* Current resident stay                                                 */
  /* --------------------------------------------------------------------- */

  const stayData = useMemo(() => {
    if (!myStay?.residents?.length) {
      return null;
    }

    /*
     * Normally the API returns the logged-in resident's
     * stay. We use the first record.
     */
    return myStay.residents[0];
  }, [myStay]);

  /* --------------------------------------------------------------------- */
  /* Dynamic roommates                                                     */
  /* --------------------------------------------------------------------- */

  const roommates = useMemo(() => {
    return stayData?.roommates || [];
  }, [stayData]);

  const visibleRoommates = expanded
    ? roommates
    : roommates.slice(
        0,
        defaultVisibleCount
      );

  const hasMore =
    roommates.length >
      defaultVisibleCount || expanded;

  /* --------------------------------------------------------------------- */
  /* Dynamic amenities                                                     */
  /* --------------------------------------------------------------------- */

  const amenities = useMemo<Amenity[]>(() => {
    return (
      stayData?.amenities?.map((amenity) => {
        const { icon, tone } =
          getAmenityIcon(amenity.name);

        return {
          id: amenity.id,
          label: formatAmenityName(
            amenity.name
          ),
          icon,
          tone,
        };
      }) || []
    );
  }, [stayData]);

  /* --------------------------------------------------------------------- */
  /* Loading                                                               */
  /* --------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

            <p
              className={`text-gray-500 ${TXT.value}`}
            >
              Loading your stay...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Error                                                                 */
  /* --------------------------------------------------------------------- */

  if (error) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <div className="rounded border border-red-100 bg-red-50 px-4 py-3 text-center">
            <p
              className={`font-semibold text-red-600 ${TXT.value}`}
            >
              Unable to load your stay
            </p>

            <p
              className={`mt-1 text-red-500 ${TXT.label}`}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                user?.id &&
                fetchMyStay(user.id)
              }
              className={`mt-2 rounded bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700 ${TXT.button}`}
            >
              Retry
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* No stay                                                               */
  /* --------------------------------------------------------------------- */

  if (!stayData) {
    return (
      <PageShell
        noScroll
        bottomPad={bottomNavHeight}
      >
        <div className="flex h-full items-center justify-center">
          <div className="rounded border border-gray-100 bg-white px-5 py-4 text-center shadow-sm">
            <p
              className={`font-bold text-gray-900 ${TXT.sectionTitle}`}
            >
              No Stay Details Found
            </p>

            <p
              className={`mt-1 text-gray-500 ${TXT.value}`}
            >
              We couldn't find an active stay
              for your account.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Destructure API data                                                  */
  /* --------------------------------------------------------------------- */

  const {
    resident,
    stay,
    roomDetails,
    managers,
    noticeCheckout,
  } = stayData;

  const roomName =
  stay.room?.name ||
  roomDetails.roomName ||
  "—";

  const bedNumber =
    stay.bed?.number !== undefined
      ? String(stay.bed.number)
      : "—";

  const sharingType =
    formatSharingType(
      stay.sharingType
    );

  const manager =
    managers?.[0] || null;

  return (
    <PageShell
      noScroll
      bottomPad={bottomNavHeight}
    >
      <div className="flex h-full min-h-0 flex-col gap-1">

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <header className="flex shrink-0 items-center justify-between pt-0.5">
          <span
            className={`font-extrabold text-blue-600 ${TXT.logo}`}
          >
            MyPG
          </span>

          <button
            type="button"
            className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100"
          >
            <Bell className={ICON.md} />

            <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-red-500 text-[4px] font-bold text-white sm:h-2 sm:w-2 sm:text-[5px]">
              3
            </span>
          </button>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Title                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex shrink-0 items-start justify-between">
          <div className="min-w-0">
            <h1
              className={`truncate font-extrabold text-gray-900 ${TXT.pageTitle}`}
            >
              My Stay
            </h1>

            <p
              className={`truncate text-gray-500 ${TXT.value}`}
            >
              {roomName}

              <span className="mx-0.5">
                •
              </span>

              Bed {bedNumber}
            </p>
          </div>

         <button
  type="button"
  className={`flex shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1.5 py-0.5 font-semibold text-gray-800 ${TXT.button}`}
>
  {myStay?.pg?.name || "MyPG"}

  <ChevronDown
    className={ICON.xs}
  />
</button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stay Overview                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid shrink-0 grid-cols-3 gap-x-1 gap-y-1.5 rounded border border-gray-100 bg-white p-1.5 shadow-sm">

          <InfoItem
            icon={DoorOpen}
            tone="blue"
            label="Room"
            value={roomName}
          />

          <InfoItem
            icon={BedDouble}
            tone="purple"
            label="Bed"
            value={bedNumber}
          />

          <InfoItem
            icon={Users}
            tone="green"
            label="Sharing Type"
            value={sharingType}
          />

          <InfoItem
            icon={Building2}
            tone="gray"
            label="Floor"
            value={String(
              stay.floor ?? "—"
            )}
          />

          <InfoItem
            icon={CalendarCheck2}
            tone="green"
            label="Checkin Date"
            value={formatDate(
              stay.joinedOn
            )}
          />

          <InfoItem
            icon={CalendarClock}
            tone="orange"
            label="Checkout Date"
            value={formatDate(
              stay.expectedCheckout
            )}
          />

          <div className="col-span-3 mt-0.5 flex items-center justify-between border-t border-gray-100 pt-1.5">

            <InfoItem
              icon={CheckCircle2}
              tone="green"
              label="Stay Status"
              value={
                stay.status || "—"
              }
              valueColor="text-green-600"
            />

            <div className="text-right">
              <p
                className={`text-gray-500 ${TXT.label}`}
              >
                Duration
              </p>

              <p
                className={`font-bold text-gray-900 ${TXT.value}`}
              >
                {stay.duration?.text ||
                  "—"}
              </p>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Room Details                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="shrink-0">
          <h2
            className={`mb-1 font-bold text-gray-900 ${TXT.sectionTitle}`}
          >
            Room Details
          </h2>

          <div className="grid grid-cols-6 gap-1">

            <RoomDetailChip
              icon={DoorOpen}
              tone="blue"
              label="Room"
              value={roomName}
            />

            <RoomDetailChip
              icon={Users}
              tone="purple"
              label="Sharing"
              value={sharingType}
            />

            <RoomDetailChip
              icon={Building2}
              tone="green"
              label="Floor"
              value={String(
                roomDetails.floor ??
                  "—"
              )}
            />

            <RoomDetailChip
              icon={IndianRupee}
              tone="orange"
              label="Monthly Rent"
              value={formatCurrency(
                roomDetails.monthlyRent
              )}
            />

            <RoomDetailChip
              icon={Wifi}
              tone="blue"
              label="Wi-Fi"
              value={
                roomDetails.wifiIncluded
                  ? "Included"
                  : "Not Included"
              }
            />

            <RoomDetailChip
              icon={Paintbrush}
              tone="orange"
              label="Housekeeping"
              value={
                roomDetails.housekeepingIncluded
                  ? "Included"
                  : "Not Included"
              }
            />

          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Roommates / Manager / Notice / Amenities                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex min-h-0 flex-1 flex-col gap-1 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-1">

          {/* -------------------------------------------------------------- */}
          {/* Roommates                                                       */}
          {/* -------------------------------------------------------------- */}

          <div
            className={`order-1 flex flex-col rounded border border-gray-100 bg-white shadow-sm lg:order-1 lg:h-full ${
              expanded
                ? "min-h-0 flex-1"
                : "shrink-0"
            }`}
          >

            <div className="flex shrink-0 items-center justify-between px-1.5 pt-1 pb-0.5">

              <h2
                className={`font-bold text-gray-900 ${TXT.sectionTitle}`}
              >
                Roommates
              </h2>

              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(
                      (prev) => !prev
                    )
                  }
                  className={`font-semibold text-blue-600 hover:text-blue-700 ${TXT.button}`}
                >
                  {expanded
                    ? "Show Less"
                    : "View All"}
                </button>
              )}

            </div>

            <div
              className={`flex flex-col ${
                expanded
                  ? "min-h-0 flex-1 overflow-y-auto"
                  : "lg:min-h-0 lg:flex-1 lg:overflow-hidden"
              }`}
            >

              {visibleRoommates.length >
              0 ? (
                visibleRoommates.map(
                  (roommate, i) => (
                    <div
                      key={
                        roommate.id
                      }
                      className="flex items-center gap-1.5 border-t border-gray-100 px-1.5 py-1 first:border-t-0"
                    >

                      <Avatar
                        tone={
                          avatarTones[
                            i %
                              avatarTones.length
                          ]
                        }
                        size="md"
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-1">

                          <p
                            className={`truncate font-bold text-gray-900 ${TXT.value}`}
                          >
                            {
                              roommate.name
                            }
                          </p>

                          {roommate.bed && (
                            <span
                              className={`shrink-0 rounded-full bg-purple-50 px-1.5 py-0.5 font-semibold text-purple-700 ${TXT.micro}`}
                            >
                              Bed{" "}
                              {
                                roommate.bed
                              }
                            </span>
                          )}

                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">

                        {roommate.mobile && (
                          <>
                            <RoundIconButton
                              icon={
                                Phone
                              }
                              onClick={() =>
                                window.open(
                                  `tel:${roommate.mobile}`
                                )
                              }
                            />

                            <RoundIconButton
                              icon={
                                MessageSquare
                              }
                              onClick={() =>
                                window.open(
                                  `sms:${roommate.mobile}`
                                )
                              }
                            />
                          </>
                        )}

                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="flex flex-1 items-center justify-center px-2 py-3">

                  <p
                    className={`text-gray-400 ${TXT.value}`}
                  >
                    No roommates
                  </p>

                </div>
              )}

            </div>
          </div>

         {/* -------------------------------------------------------------- */}
{/* Manager Contact                                                 */}
{/* -------------------------------------------------------------- */}

<div className="order-3 flex min-h-0 flex-col rounded border border-gray-100 bg-white p-1.5 shadow-sm lg:order-2 lg:h-full">

  <div className="mb-1 flex shrink-0 items-center justify-between">
    <h2
      className={`font-bold text-gray-900 ${TXT.sectionTitle}`}
    >
      Manager Contact
    </h2>

    {managers?.length > 0 && (
      <span
        className={`rounded-full bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-600 ${TXT.micro}`}
      >
        {managers.length} Managers
      </span>
    )}
  </div>

  <div className="min-h-0 flex-1 overflow-y-auto">

    {managers?.length > 0 ? (
      <div className="flex flex-col">

        {managers.map((manager, index) => (
          <div
            key={manager.id}
            className="flex items-center gap-1.5 border-t border-gray-100 px-0.5 py-1 first:border-t-0"
          >

            {/* Avatar */}
            <Avatar
              tone={
                avatarTones[
                  index % avatarTones.length
                ]
              }
              size="md"
            />

            {/* Manager Details */}
            <div className="min-w-0 flex-1">

              <p
                className={`truncate font-bold text-gray-900 ${TXT.value}`}
              >
                {manager.name}
              </p>

              <p
                className={`truncate text-gray-500 ${TXT.label}`}
              >
                +91 {manager.mobile}
              </p>

            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">

              <button
                type="button"
                onClick={() =>
                  window.open(
                    `tel:${manager.mobile}`
                  )
                }
                className={`flex items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-1 font-semibold text-blue-600 hover:bg-blue-50 ${TXT.button}`}
              >
                <Phone className={ICON.sm} />
                Call
              </button>

              <button
                type="button"
                onClick={() =>
                  window.open(
                    `sms:${manager.mobile}`
                  )
                }
                className={`flex items-center gap-0.5 rounded border border-blue-200 bg-white px-1.5 py-1 font-semibold text-blue-600 hover:bg-blue-50 ${TXT.button}`}
              >
                <MessageSquare className={ICON.sm} />
                Message
              </button>

            </div>

          </div>
        ))}

      </div>
    ) : (
      <div className="flex h-full items-center justify-center">
        <p
          className={`text-gray-400 ${TXT.value}`}
        >
          No manager assigned
        </p>
      </div>
    )}

  </div>
</div>

          {/* -------------------------------------------------------------- */}
          {/* Notice & Checkout                                               */}
          {/* -------------------------------------------------------------- */}

          <div className="order-4 flex shrink-0 flex-col rounded border border-gray-100 bg-white p-1.5 shadow-sm lg:order-3 lg:h-full">

            <h2
              className={`mb-1 font-bold text-gray-900 ${TXT.sectionTitle}`}
            >
              Notice &amp; Checkout
            </h2>

            <div className="flex items-center justify-between gap-1">

              <div className="flex min-w-0 items-center gap-1.5">

                <IconBox
                  icon={CalendarClock}
                  tone="orange"
                  size="md"
                />

                <div className="min-w-0">

                  <p
                    className={`truncate text-gray-500 ${TXT.label}`}
                  >
                   Checkout Date
                  </p>

                  <p
                    className={`truncate font-bold text-gray-900 ${TXT.value}`}
                  >
                    {formatDate(
                      noticeCheckout?.expectedCheckout ||
                        stay.expectedCheckout
                    )}
                  </p>

                  <p
                    className={`truncate text-gray-500 ${TXT.micro}`}
                  >
                    {noticeCheckout?.noticePeriodDays ??
                      0}{" "}
                    days notice
                  </p>

                </div>
              </div>

              <button
                type="button"
                className={`flex shrink-0 items-center gap-1 rounded ${
                  noticeCheckout?.checkoutRequested
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                } px-2 py-1.5 font-bold text-white transition-colors ${TXT.button}`}
                disabled={
                  noticeCheckout?.checkoutRequested
                }
              >
                <LogOut
                  className={ICON.sm}
                />

                {noticeCheckout?.checkoutRequested
                  ? "Requested"
                  : "Request Checkout"}
              </button>

            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Amenities                                                       */}
          {/* -------------------------------------------------------------- */}

          <div className="order-2 shrink-0 lg:order-4 lg:col-span-3">

            <h2
              className={`mb-1 font-bold text-gray-900 ${TXT.sectionTitle}`}
            >
              Amenities
            </h2>

            <div className="flex flex-wrap gap-1 lg:justify-between">

              {amenities.length > 0 ? (
                amenities.map(
                  (item) => (
                    <AmenityChip
                      key={item.id}
                      item={item}
                    />
                  )
                )
              ) : (
                <p
                  className={`text-gray-400 ${TXT.value}`}
                >
                  No amenities available
                </p>
              )}

            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
};

export default MyStay;