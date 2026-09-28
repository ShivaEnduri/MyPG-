// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ArrowLeft,
//   Bell,
//   Bed as BedIcon,
//   AlertTriangle,
//   Bookmark,
//   ChevronDown,
//   Search,
//   Armchair,
//   Loader2,
// } from "lucide-react";

// import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
// import { usePgRoomsStore } from "@/app/shared/store/roomsStore";
// import { usePgBedInfoStore } from "@/app/shared/store/bedInfoStore";
// import { usePgBookingsStore } from "@/app/shared/store/bookingStore";
// import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
// import { PageShell } from "@/app/shared/components/PageShell";
// import { useBedMapResidentsStore } from "../store/bedMapsResidentsStore";

// import RoomDetailsModal from "./RoomDetailsModal";

// /* ============================================================
//    TYPES
// ============================================================ */

// type BedStatus =
//   | "occupied"
//   | "vacant"
//   | "reserved"
//   | "notice";

// type RoomType =
//   | "Single"
//   | "Double"
//   | "Triple";

// interface Bed {
//   id: number;
//   label: string;
//   status: BedStatus;
//   occupantName?: string;
//   isUpcomingCheckout?: boolean;
// }

// interface Room {
//   id: number;
//   number: string;
//   type: RoomType;
//   floor?: number | string;

//   hasTv: boolean;
//   hasAc: boolean;
//   hasBalcony: boolean;

//   beds: Bed[];
// }

// interface BedMapSummary {
//   occupied: number;
//   vacant: number;
//   notice: number;
//   reserved: number;
// }

// /* ============================================================
//    DATABASE STATUS CONSTANTS
// ============================================================ */

// const BED_STATUS = {
//   VACANT: 3,
//   RESERVED: 4,
//   OCCUPIED: 5,
// } as const;

// /* ============================================================
//    HELPERS
// ============================================================ */

// const getRoomType = (
//   occupancy?: string | null
// ): RoomType => {
//   switch (
//     String(occupancy || "").toLowerCase()
//   ) {
//     case "single":
//       return "Single";

//     case "double":
//       return "Double";

//     case "triple":
//       return "Triple";

//     default:
//       return "Single";
//   }
// };

// const getStartOfToday = () => {
//   const date = new Date();

//   date.setHours(
//     0,
//     0,
//     0,
//     0
//   );

//   return date;
// };

// const getEndOf15thDay = () => {
//   const date = getStartOfToday();

//   date.setDate(
//     date.getDate() + 15
//   );

//   date.setHours(
//     23,
//     59,
//     59,
//     999
//   );

//   return date;
// };

// const isUpcomingCheckout = (
//   booking: any
// ): boolean => {
//   if (
//     Number(
//       booking?.bkg_status
//     ) !== BED_STATUS.OCCUPIED
//   ) {
//     return false;
//   }

//   const checkoutValue =
//     booking?.planned_check_out_date;

//   if (!checkoutValue) {
//     return false;
//   }

//   const checkoutDate =
//     new Date(checkoutValue);

//   if (
//     Number.isNaN(
//       checkoutDate.getTime()
//     )
//   ) {
//     return false;
//   }

//   const startDate =
//     getStartOfToday();

//   const endDate =
//     getEndOf15thDay();

//   return (
//     checkoutDate >= startDate &&
//     checkoutDate <= endDate
//   );
// };

// /* ============================================================
//    STATUS STYLES
// ============================================================ */

// const STATUS_STYLES: Record<
//   BedStatus,
//   {
//     cardBg: string;
//     cardBorder: string;
//     iconBg: string;
//     iconColor: string;
//     label: string;
//     Icon: React.ElementType;
//   }
// > = {
//   occupied: {
//     cardBg: "bg-blue-50",
//     cardBorder: "border-blue-100",
//     iconBg: "bg-blue-100",
//     iconColor: "text-blue-600",
//     label: "Occupied",
//     Icon: BedIcon,
//   },

//   vacant: {
//     cardBg: "bg-green-50",
//     cardBorder: "border-green-100",
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     label: "Vacant",
//     Icon: Armchair,
//   },

//   notice: {
//     cardBg: "bg-orange-50",
//     cardBorder: "border-orange-100",
//     iconBg: "bg-orange-100",
//     iconColor: "text-orange-500",
//     label: "Notice Period",
//     Icon: AlertTriangle,
//   },

//   reserved: {
//     cardBg: "bg-purple-50",
//     cardBorder: "border-purple-100",
//     iconBg: "bg-purple-100",
//     iconColor: "text-purple-600",
//     label: "Reserved",
//     Icon: Bookmark,
//   },
// };

// /* ============================================================
//    ROOM TYPE STYLES
// ============================================================ */

// const TYPE_BADGE_STYLES: Record<
//   RoomType,
//   string
// > = {
//   Single:
//     "bg-slate-50 text-slate-600",

//   Double:
//     "bg-green-50 text-green-700",

//   Triple:
//     "bg-blue-50 text-blue-700",
// };

// /* ============================================================
//    SUMMARY CARD
// ============================================================ */

// function SummaryCard({
//   icon: Icon,
//   iconBg,
//   iconColor,
//   label,
//   value,
//   valueColor,
// }: {
//   icon: React.ElementType;
//   iconBg: string;
//   iconColor: string;
//   label: string;
//   value: number;
//   valueColor: string;
// }) {
//   return (
//     <div
//       className="
//         flex
//         min-w-0
//         items-center
//         gap-1
//         rounded-md
//         border
//         border-slate-100
//         bg-white
//         px-1
//         py-3

//         sm:gap-1
//         sm:px-1.5

//         md:gap-1.5
//         md:px-2
//         md:py-2

//         lg:px-2.5
//         lg:py-2

//         transition-shadow
//         hover:shadow-sm
//       "
//     >
//       <div
//         className={`
//           flex
//           h-5
//           w-5
//           shrink-0
//           items-center
//           justify-center
//           rounded-md
//           ${iconBg}

//           sm:h-6
//           sm:w-6

//           md:h-7
//           md:w-7

//           lg:h-8
//           lg:w-8
//         `}
//       >
//         <Icon
//           className={`
//             h-3
//             w-3
//             ${iconColor}

//             md:h-4
//             md:w-4
//           `}
//         />
//       </div>

//       <div className="min-w-0">
//         <p
//           className="
//             mb-0
//             truncate
//             text-[8px]
//             leading-none
//             text-slate-500

//             md:text-[10px]
//           "
//         >
//           {label}
//         </p>

//         <p
//           className={`
//             truncate
//             text-xs
//             font-bold
//             leading-none

//             sm:text-sm

//             md:text-base

//             lg:text-lg

//             ${valueColor}
//           `}
//         >
//           {value}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    FILTER SELECT
// ============================================================ */

// function FilterSelect({
//   label,
//   value,
//   options,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   options: string[];
//   onChange: (value: string) => void;
// }) {
//   return (
//     <div
//       className="
//         relative
//         flex
//         min-w-0
//         shrink
//         items-center
//       "
//     >
//       <select
//         value={value}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         className="
//           appearance-none
//           h-[24px]
//           w-full
//           min-w-0
//           rounded-md
//           border
//           border-slate-200
//           bg-white
//           px-1.5
//           pr-5
//           text-[8px]
//           font-medium
//           leading-none
//           text-slate-700
//           whitespace-nowrap
//           transition-colors
//           cursor-pointer
//           hover:border-slate-300
//           focus:border-blue-300
//           focus:outline-none

//           sm:h-[32px]
//           sm:px-2
//           sm:pr-6
//           sm:text-[9px]

//           md:h-[34px]
//           md:px-2
//           md:pr-7
//           md:text-[10px]

//           lg:h-[36px]
//           lg:px-2.5
//           lg:pr-7
//           lg:text-xs
//         "
//         aria-label={label}
//       >
//         {options.map((option) => (
//           <option
//             key={option}
//             value={option}
//           >
//             {option}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         className="
//           pointer-events-none
//           absolute
//           right-1
//           top-1/2
//           -translate-y-1/2
//           h-2.5
//           w-2.5
//           text-slate-400

//           sm:right-1.5
//           sm:h-3
//           sm:w-3

//           md:right-2
//           md:h-3
//           md:w-3

//           lg:right-2
//           lg:h-3.5
//           lg:w-3.5
//         "
//       />
//     </div>
//   );
// }

// /* ============================================================
//    BED TILE
// ============================================================ */

// function BedTile({ bed }: { bed: Bed }) {
//   const visualStatus: BedStatus =
//     bed.isUpcomingCheckout && bed.status === "occupied"
//       ? "notice"
//       : bed.status;

//   const style = STATUS_STYLES[visualStatus];
//   const { Icon } = style;

//   let residentName = "";

//   if (bed.status === "occupied") {
//     residentName = bed.occupantName || "Occupied";
//   } else if (bed.status === "vacant") {
//     residentName = "Vacant";
//   } else if (bed.status === "reserved") {
//     residentName = "Reserved";
//   }

//   /* ==========================================================
//      TITLE
//   ========================================================== */

//  const title =
//     bed.isUpcomingCheckout && bed.status === "occupied"
//       ? `${bed.label} - ${residentName || "Notice"}`
//       : `${bed.label} - ${residentName}`;

//   return (
//     <div
//       className={`
//         flex
//         min-w-0
//         w-full
//         items-center
//         gap-0.5
//         rounded-sm
//         border
//         px-[5px]
//         py-1

//         sm:px-[7px]
//         sm:py-1.5

//         md:px-[5px]
//         md:py-1

//         lg:px-[8px]
//         lg:py-1

//         xl:px-[1px]
//         xl:py-1

//         ${style.cardBg}
//         ${style.cardBorder}
//       `}
//     >
//       {/* ICON */}

//       <div
//         className={`
//           flex
//           h-4
//           w-4
//           shrink-0
//           items-center
//           justify-center
//           rounded
//           ${style.iconBg}

//           sm:h-5
//           sm:w-5

//           md:h-4
//           md:w-4

//           lg:h-4
//           lg:w-4

//           xl:h-5
//           xl:w-5
//         `}
//       >
//         <Icon
//           className={`
//             h-2
//             w-2
//             shrink-0
//             ${style.iconColor}

//             sm:h-2.5
//             sm:w-2.5

//             md:h-2
//             md:w-2

//             lg:h-2
//             lg:w-2

//             xl:h-2.5
//             xl:w-2.5
//           `}
//         />
//       </div>

//       {/* CONTENT */}

//       <div
//         className="
//           min-w-0
//           flex-1
//           overflow-hidden
//           leading-none
//         "
//       >
//         <p
//           className="
//             block
//             min-w-0
//             truncate
//             text-[8px]
//             font-semibold
//             leading-[10px]
//             text-slate-800

//             sm:text-[9px]
//             sm:leading-[11px]

//             md:text-[8px]
//             md:leading-[10px]

//             lg:text-[8px]
//             lg:leading-[10px]

//             xl:text-[9px]
//             xl:leading-[11px]
//           "
//           title={title}
//         >
//           {title}
//         </p>

//         <p
//           className={`
//             block
//             min-w-0
//             truncate
//             text-[7px]
//             font-medium
//             leading-[9px]

//             sm:text-[8px]
//             sm:leading-[10px]

//             md:text-[7px]
//             md:leading-[9px]

//             lg:text-[7px]
//             lg:leading-[9px]

//             xl:text-[8px]
//             xl:leading-[10px]

//             ${style.iconColor}
//           `}
//           title={style.label}
//         >
//           {style.label}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    ROOM CARD
// ============================================================ */

// function RoomCard({
//   room,
//   onAssignBed,
//   onViewDetails,
// }: {
//   room: Room;

//   onAssignBed?: (
//     roomId: string,
//     bedLabel: string
//   ) => void;

//   onViewDetails?: (
//     roomId: string
//   ) => void;
// }) {
//   const vacantBed =
//     room.beds.find(
//       (bed) =>
//         bed.status === "vacant"
//     );

//   const occupiedCount =
//     room.beds.filter(
//       (bed) =>
//         bed.status ===
//         "occupied"
//     ).length;

//   const vacantCount =
//     room.beds.filter(
//       (bed) =>
//         bed.status === "vacant"
//     ).length;

//   const noticeCount =
//     room.beds.filter(
//       (bed) =>
//         bed.isUpcomingCheckout ===
//         true
//     ).length;

//   const reservedCount =
//     room.beds.filter(
//       (bed) =>
//         bed.status ===
//         "reserved"
//     ).length;

//   const totalBeds =
//     room.beds.length;

//   const hasVacant =
//     Boolean(vacantBed);

//   return (
//     <div
//       className={`
//         flex
//         h-full
//         min-w-0
//         flex-col
//         rounded-md
//         border
//         px-1.5
//         py-2
//         transition-all
//         hover:shadow-sm

//         sm:px-2
//         sm:py-2.5

//         md:px-2
//         md:py-2.5

//         lg:px-2.5
//         lg:py-3

//         xl:px-3
//         xl:py-3.5

//         ${
//           hasVacant
//             ? "border-green-200 bg-green-50/30"
//             : "border-slate-200 bg-white"
//         }
//       `}
//     >
//       {/* ======================================================
//           ROOM HEADER
//       ====================================================== */}

//       <div
//         className="
//           flex
//           items-start
//           justify-between
//           gap-1.5
//           mb-1.5

//           sm:mb-2

//           md:mb-2
//         "
//       >
//         <div className="min-w-0">
//           <h3
//             className="
//               truncate
//               text-xs
//               font-bold
//               leading-tight
//               text-slate-900

//               sm:text-sm

//               md:text-sm

//               lg:text-base
//             "
//           >
//             Room - {room.number}
//           </h3>

//           <div
//             className="
//               mt-0.5
//               flex
//               items-center
//               gap-1
//               min-w-0
//             "
//           >
//             <p
//               className="
//                 whitespace-nowrap
//                 text-[8px]
//                 leading-tight
//                 text-slate-500

//                 sm:text-[9px]

//                 md:text-[10px]
//               "
//             >
//               <span className="font-semibold text-blue-600">
//                 {occupiedCount}
//               </span>
//               /{totalBeds} occupied
//             </p>

//             {noticeCount > 0 && (
//               <span
//                 className="
//                   hidden
//                   whitespace-nowrap
//                   rounded-md
//                   bg-orange-50
//                   px-1.5
//                   py-0.5
//                   text-[7px]
//                   font-semibold
//                   text-orange-600

//                   lg:inline-flex
//                 "
//               >
//                 {noticeCount} vacating
//               </span>
//             )}
//           </div>
//         </div>

//         {/* OCCUPANCY TYPE */}

//         <span
//           className={`
//             shrink-0
//             rounded-md
//             px-1.5
//             py-0.5
//             text-[7px]
//             font-semibold
//             leading-tight

//             sm:px-2
//             sm:text-[8px]

//             md:text-[9px]

//             lg:px-2
//             lg:text-[9px]

//             ${TYPE_BADGE_STYLES[room.type]}
//           `}
//         >
//           {room.type}
//         </span>
//       </div>

//       {/* ======================================================
//           BEDS + FOOTER ACTION
//       ====================================================== */}

//       <div
//         className="
//           mt-1
//           flex
//           min-w-0
//           items-end
//           gap-1

//           sm:mt-1.5
//           sm:gap-1.5
//         "
//       >
//         {/* BEDS */}

//         <div
//           className="
//             grid
//             min-w-0
//             flex-1
//             grid-cols-3
//             gap-1

//             sm:gap-1.5

//             md:grid-cols-3
//             md:gap-1.5

//             lg:grid-cols-3
//             lg:gap-1.5
//           "
//         >
//           {room.beds.map(
//             (bed) => (
//               <BedTile
//                 key={bed.id}
//                 bed={bed}
//               />
//             )
//           )}
//         </div>

//         {/* ACTION */}

//         <div
//           className="
//             shrink-0
//             flex
//             items-center
//             justify-end
//           "
//         >
//           {/* {hasVacant && vacantBed ? (
//             <button
//               type="button"
//               onClick={() =>
//                 onAssignBed?.(
//                   String(room.id),
//                   vacantBed.label
//                 )
//               }
//               className="
//                 rounded-sm
//                 bg-blue-600
//                 px-1.5
//                 py-1
//                 text-[7px]
//                 font-semibold
//                 whitespace-nowrap
//                 text-white
//                 transition-colors
//                 hover:bg-blue-700
//                 active:bg-blue-800

//                 sm:px-2
//                 sm:py-1
//                 sm:text-[8px]

//                 md:px-2
//                 md:py-1
//                 md:text-[8px]

//                 lg:px-2.5
//                 lg:py-1
//                 lg:text-[9px]
//               "
//             >
//               Assign Bed
//             </button>
//           ) : ( */}
//             <button
//               type="button"
//               onClick={() =>
//                 onViewDetails?.(
//                   String(room.id)
//                 )
//               }
//               className="
//                 flex
//                 items-center
//                 gap-0.5
//                 whitespace-nowrap
//                 px-0.5
//                 text-[7px]
//                 font-semibold
//                 text-blue-600
//                 hover:text-blue-700

//                 sm:px-1
//                 sm:text-[8px]

//                 md:text-[8px]

//                 lg:text-[9px]
//               "
//             >
//               View Details

//               <ArrowLeft
//                 className="
//                   h-2
//                   w-2
//                   rotate-180

//                   sm:h-2.5
//                   sm:w-2.5

//                   md:h-2.5
//                   md:w-2.5

//                   lg:h-3
//                   lg:w-3
//                 "
//               />
//             </button>
//           {/* )} */}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN BED MAP
// ============================================================ */

// export default function BedMap({
//   onBack,
//   onAssignBed,
//   onViewDetails,
// }: {
//   onBack?: () => void;

//   onAssignBed?: (
//     roomId: string,
//     bedLabel: string
//   ) => void;

//   onViewDetails?: (
//     roomId: string
//   ) => void;
// }) {
//   /* ==========================================================
//      STORES
//   ========================================================== */

//   const {
//     pgInfoList,
//     fetchPgInfo,
//     loading: pgLoading,
//   } = usePgInfoStore();

//   const {
//     rooms,
//     fetchRooms,
//     loading: roomsLoading,
//   } = usePgRoomsStore();

//   const {
//     bedInfoList,
//     fetchBedInfo,
//     loading: bedsLoading,
//   } = usePgBedInfoStore();

//   const {
//     bookings,
//     fetchBookings,
//     loading: bookingsLoading,
//   } = usePgBookingsStore();

//   /*
//    * Guest store is no longer required for resident names.
//    * Resident information now comes from bedMapResidentsStore.
//    */

//   const {
//     selectedPg,
//     selectedPgId,
//     setSelectedPg,
//   } = useSelectedPgStore();

//   const {
//     fetchBedMapResidents,
//   } = useBedMapResidentsStore();

//   /* ==========================================================
//      FILTER STATE
//   ========================================================== */

//   const [
//     query,
//     setQuery,
//   ] = useState("");

//   const [
//     floorFilter,
//     setFloorFilter,
//   ] = useState(
//     "All floors"
//   );

//   const [
//     typeFilter,
//     setTypeFilter,
//   ] = useState(
//     "All types"
//   );

//   const [
//     sortFilter,
//     setSortFilter,
//   ] = useState(
//     "Default"
//   );

//   /* ==========================================================
//      CURRENT PG
//   ========================================================== */

//   const currentPgId =
//     selectedPg?.id ??
//     selectedPgId ??
//     pgInfoList[0]?.id ??
//     null;

//   /* ==========================================================
//      LOAD PG LIST
//   ========================================================== */

//   useEffect(() => {
//     if (
//       pgInfoList.length === 0
//     ) {
//       fetchPgInfo();
//     }
//   }, [
//     pgInfoList.length,
//     fetchPgInfo,
//   ]);

//   /* ==========================================================
//      RESTORE SELECTED PG
//   ========================================================== */

//   useEffect(() => {
//     if (
//       selectedPgId &&
//       !selectedPg &&
//       pgInfoList.length > 0
//     ) {
//       const matchingPg =
//         pgInfoList.find(
//           (pg: any) =>
//             Number(pg.id) ===
//             Number(
//               selectedPgId
//             )
//         );

//       if (matchingPg) {
//         setSelectedPg(
//           matchingPg
//         );
//       }
//     }
//   }, [
//     selectedPgId,
//     selectedPg,
//     pgInfoList,
//     setSelectedPg,
//   ]);

//   /* ==========================================================
//      DEFAULT PG
//   ========================================================== */

//   useEffect(() => {
//     if (
//       !selectedPg &&
//       !selectedPgId &&
//       pgInfoList.length > 0
//     ) {
//       setSelectedPg(
//         pgInfoList[0]
//       );
//     }
//   }, [
//     selectedPg,
//     selectedPgId,
//     pgInfoList,
//     setSelectedPg,
//   ]);

//   /* ==========================================================
//      FETCH BED MAP DATA
//   ========================================================== */

//   useEffect(() => {
//     if (!currentPgId) {
//       return;
//     }

//     const loadData =
//       async () => {
//         await Promise.allSettled([
//           fetchRooms({
//             pg_info:
//               currentPgId,
//           }),

//           fetchBedInfo({
//             pg_info_id:
//               currentPgId,
//           }),

//           fetchBookings({
//             pg_id:
//               currentPgId,
//           }),

//           /*
//            * IMPORTANT:
//            *
//            * This API provides:
//            *
//            * room -> bed -> booking -> guest -> user -> firstName
//            *
//            * which is now used for resident names.
//            */
//           fetchBedMapResidents(
//             Number(currentPgId)
//           ),
//         ]);
//       };

//     loadData();
//   }, [
//     currentPgId,
//     fetchRooms,
//     fetchBedInfo,
//     fetchBookings,
//     fetchBedMapResidents,
//   ]);

//   /* ==========================================================
//      BOOKING LOOKUP BY BED ID
//   ========================================================== */

//   const bookingByBedId =
//     useMemo(() => {
//       const map =
//         new Map<
//           number,
//           any
//         >();

//       bookings.forEach(
//         (booking: any) => {
//           const bedId =
//             Number(
//               booking?.bed_id
//             );

//           if (!bedId) {
//             return;
//           }

//           const status =
//             Number(
//               booking?.bkg_status
//             );

//           if (
//             status ===
//               BED_STATUS.OCCUPIED ||
//             status ===
//               BED_STATUS.RESERVED
//           ) {
//             map.set(
//               bedId,
//               booking
//             );
//           }
//         }
//       );

//       return map;
//     }, [
//       bookings,
//     ]);

//   /* ==========================================================
//      BED MAP RESIDENT LOOKUP
     
//      IMPORTANT:
//      Resident names come from:
     
//      bedMapData.rooms[].beds[].booking.guest.user.firstName
     
//      We create a direct lookup here so the BedTile does not
//      depend on the separate guest store.
//   ========================================================== */

//   const bedMapResidentByBedId =
//     useMemo(() => {
//       const map =
//         new Map<
//           number,
//           string
//         >();

//       /*
//        * Read the latest bed map data directly from Zustand.
//        */
//       const bedMapData =
//         useBedMapResidentsStore.getState()
//           .bedMapData;

//       if (
//         !bedMapData?.rooms?.length
//       ) {
//         return map;
//       }

//       bedMapData.rooms.forEach(
//         (room: any) => {
//           room?.beds?.forEach(
//             (apiBed: any) => {
//               const bedId =
//                 Number(
//                   apiBed?.bedId
//                 );

//               if (!bedId) {
//                 return;
//               }

//               /*
//                * Only occupied beds should have
//                * a resident name.
//                */
//               if (
//                 Number(
//                   apiBed?.bedStatus
//                 ) !==
//                 BED_STATUS.OCCUPIED
//               ) {
//                 return;
//               }

//               const firstName =
//                 String(
//                   apiBed?.booking
//                     ?.guest?.user
//                     ?.firstName ||
//                     ""
//                 ).trim();

//               if (firstName) {
//                 map.set(
//                   bedId,
//                   firstName
//                 );
//               }
//             }
//           );
//         }
//       );

//       return map;
//     }, [
//       useBedMapResidentsStore(
//         (state) =>
//           state.bedMapData
//       ),
//     ]);

//   /* ==========================================================
//      BUILD BED MAP ROOMS
//   ========================================================== */

//   const bedMapRooms =
//     useMemo<Room[]>(() => {
//       return rooms.map(
//         (room: any) => {
//           const roomId =
//             Number(
//               room?.id
//             );

//           const roomBeds =
//             bedInfoList.filter(
//               (bed: any) =>
//                 Number(
//                   bed?.room_info
//                 ) === roomId
//             );

//           const mappedBeds =
//             roomBeds.map(
//               (bed: any) => {
//                 const bedId =
//                   Number(
//                     bed?.id
//                   );

//                 const dbStatus =
//                   Number(
//                     bed?.bed_status
//                   );

//                 const booking =
//                   bookingByBedId.get(
//                     bedId
//                   );

//                 /*
//                  * ==================================================
//                  * RESIDENT NAME
//                  *
//                  * IMPORTANT:
//                  *
//                  * Do NOT use guestInfoStore here.
//                  *
//                  * The bed-map residents API already gives us:
//                  *
//                  * bedId
//                  *   -> booking
//                  *   -> guest
//                  *   -> user
//                  *   -> firstName
//                  *
//                  * Example:
//                  *
//                  * bedId 128 -> Abhishek
//                  * bedId 127 -> Travis
//                  * bedId 208 -> Priya
//                  * ==================================================
//                  */

//                 const occupantName =
//                   bedMapResidentByBedId.get(
//                     bedId
//                   ) || "";

//                 const isNotice =
//                   dbStatus ===
//                     BED_STATUS.OCCUPIED &&
//                   isUpcomingCheckout(
//                     booking
//                   );

//                 let status: BedStatus;

//                 if (
//                   dbStatus ===
//                   BED_STATUS.VACANT
//                 ) {
//                   status = "vacant";
//                 } else if (
//                   dbStatus ===
//                   BED_STATUS.RESERVED
//                 ) {
//                   status = "reserved";
//                 } else if (
//                   dbStatus ===
//                   BED_STATUS.OCCUPIED
//                 ) {
//                   status = "occupied";
//                 } else {
//                   status = "vacant";
//                 }

//                 return {
//                   id: bedId,

//                   /*
//                    * BedTile uses this ID to query
//                    * the resident store.
//                    */
//                   bedId,

//                   label:
//                     String(
//                       bed?.bed_number ??
//                         "-"
//                     ),

//                   /*
//                    * Keep bed number available
//                    * for fallback lookup.
//                    */
//                   bedNumber:
//                     bed?.bed_number,

//                   status,

//                   /*
//                    * Resident first name from
//                    * bedMapResidents API.
//                    */
//                   occupantName:
//                     occupantName ||
//                     undefined,

//                   isUpcomingCheckout:
//                     isNotice,
//                 } as Bed;
//               }
//             );

//           return {
//             id: roomId,

//             number:
//               String(
//                 room?.room_name ??
//                   roomId
//               ),

//             type:
//               getRoomType(
//                 room?.occupancy
//               ),

//             floor:
//               room?.floor ??
//               room?.floor_info,

//             beds:
//               mappedBeds,
//           };
//         }
//       );
//     }, [
//       rooms,
//       bedInfoList,
//       bookingByBedId,
//       bedMapResidentByBedId,
//     ]);

//   /* ==========================================================
//      SUMMARY
//   ========================================================== */

//   const summary =
//     useMemo<BedMapSummary>(() => {
//       const result: BedMapSummary =
//         {
//           occupied: 0,
//           vacant: 0,
//           notice: 0,
//           reserved: 0,
//         };

//       bedMapRooms.forEach(
//         (room) => {
//           room.beds.forEach(
//             (bed) => {
//               if (
//                 bed.status ===
//                 "occupied"
//               ) {
//                 result.occupied +=
//                   1;
//               }

//               if (
//                 bed.status ===
//                 "vacant"
//               ) {
//                 result.vacant +=
//                   1;
//               }

//               if (
//                 bed.status ===
//                 "reserved"
//               ) {
//                 result.reserved +=
//                   1;
//               }

//               if (
//                 bed.isUpcomingCheckout
//               ) {
//                 result.notice +=
//                   1;
//               }
//             }
//           );
//         }
//       );

//       return result;
//     }, [
//       bedMapRooms,
//     ]);

//   /* ==========================================================
//      FLOOR OPTIONS
//   ========================================================== */

//   const floorOptions =
//     useMemo(() => {
//       const floors =
//         new Set<string>();

//       bedMapRooms.forEach(
//         (room) => {
//           if (
//             room.floor !==
//               undefined &&
//             room.floor !== null &&
//             String(
//               room.floor
//             ).trim() !== ""
//           ) {
//             floors.add(
//               String(
//                 room.floor
//               )
//             );
//           }
//         }
//       );

//       return [
//         "All floors",
//         ...Array.from(
//           floors
//         ).sort(
//           (a, b) =>
//             Number(a) -
//             Number(b)
//         ),
//       ];
//     }, [
//       bedMapRooms,
//     ]);

//   /* ==========================================================
//      ROOM TYPE OPTIONS
//   ========================================================== */

//   const typeOptions = [
//     "All types",
//     "Single",
//     "Double",
//     "Triple",
//   ];

//   /* ==========================================================
//      FILTER + SEARCH + SORT
//   ========================================================== */

//   const filteredRooms =
//     useMemo(() => {
//       let result =
//         [...bedMapRooms];

//       const search =
//         query
//           .trim()
//           .toLowerCase();

//       if (search) {
//         result =
//           result.filter(
//             (room) =>
//               room.number
//                 .toLowerCase()
//                 .includes(
//                   search
//                 ) ||
//               room.beds.some(
//                 (bed) =>
//                   bed.occupantName
//                     ?.toLowerCase()
//                     .includes(
//                       search
//                     ) ||
//                   bed.label
//                     .toLowerCase()
//                     .includes(
//                       search
//                     )
//               )
//           );
//       }

//       if (
//         floorFilter !==
//         "All floors"
//       ) {
//         result =
//           result.filter(
//             (room) =>
//               String(
//                 room.floor
//               ) ===
//               floorFilter
//           );
//       }

//       if (
//         typeFilter !==
//         "All types"
//       ) {
//         result =
//           result.filter(
//             (room) =>
//               room.type ===
//               typeFilter
//           );
//       }

//       if (
//         sortFilter ===
//         "Vacant first"
//       ) {
//         result.sort(
//           (a, b) => {
//             const aVacant =
//               a.beds.some(
//                 (bed) =>
//                   bed.status ===
//                   "vacant"
//               );

//             const bVacant =
//               b.beds.some(
//                 (bed) =>
//                   bed.status ===
//                   "vacant"
//               );

//             return (
//               Number(
//                 bVacant
//               ) -
//               Number(
//                 aVacant
//               )
//             );
//           }
//         );
//       }

//       if (
//         sortFilter ===
//         "Occupied first"
//       ) {
//         result.sort(
//           (a, b) => {
//             const aOccupied =
//               a.beds.some(
//                 (bed) =>
//                   bed.status ===
//                   "occupied"
//               );

//             const bOccupied =
//               b.beds.some(
//                 (bed) =>
//                   bed.status ===
//                   "occupied"
//               );

//             return (
//               Number(
//                 bOccupied
//               ) -
//               Number(
//                 aOccupied
//               )
//             );
//           }
//         );
//       }

//       return result;
//     }, [
//       bedMapRooms,
//       query,
//       floorFilter,
//       typeFilter,
//       sortFilter,
//     ]);

//   /* ==========================================================
//      LOADING
//   ========================================================== */

//   const loading =
//     pgLoading ||
//     roomsLoading ||
//     bedsLoading ||
//     bookingsLoading;

//   /* ==========================================================
//      PG NAME
//   ========================================================== */

//   const propertyName =
//     selectedPg?.pg_name ||
//     pgInfoList.find(
//       (pg: any) =>
//         Number(pg.id) ===
//         Number(currentPgId)
//     )?.pg_name ||
//     "My PG";

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <PageShell>

//       {/* ====================================================
//           MOBILE / TABLET TOP BAR
//       ==================================================== */}

//       <div
//         className="
//           flex
//           h-[40px]
//           items-center
//           justify-start
//           pt-1

//           sm:h-[44px]

//           md:h-[50px]

//           lg:hidden
//         "
//       >
//         {/* BACK */}

//         <button
//           type="button"
//           onClick={onBack}
//           className="
//             flex
//             h-7
//             w-7
//             shrink-0
//             items-center
//             justify-center
//             rounded-md
//             hover:bg-slate-100

//             sm:h-8
//             sm:w-8

//             md:h-9
//             md:w-9
//           "
//           aria-label="Go back"
//         >
//           <ArrowLeft
//             className="
//               h-4
//               w-4
//               text-slate-800

//               sm:h-5
//               sm:w-5
//             "
//           />
//         </button>

//         {/* LOGO */}

//         <span
//           className="
//             ml-1
//             text-base
//             font-extrabold
//             leading-none
//             text-blue-600

//             sm:ml-1.5
//             sm:text-lg

//             md:ml-2
//             md:text-xl
//           "
//         >
//           MyPG
//         </span>

//         {/* NOTIFICATION */}

//         <button
//           type="button"
//           className="
//             relative
//             ml-auto
//             flex
//             h-7
//             w-7
//             shrink-0
//             items-center
//             justify-center
//             rounded-md
//             hover:bg-slate-100

//             sm:h-8
//             sm:w-8

//             md:h-9
//             md:w-9
//           "
//           aria-label="Notifications"
//         >
//           <Bell
//             className="
//               h-4
//               w-4
//               text-slate-800

//               sm:h-5
//               sm:w-5
//             "
//           />

//           {summary.notice +
//             summary.reserved >
//             0 && (
//             <span
//               className="
//                 absolute
//                 -right-0.5
//                 -top-0.5
//                 flex
//                 h-3.5
//                 min-w-3.5
//                 items-center
//                 justify-center
//                 rounded-md
//                 bg-red-500
//                 px-0.5
//                 text-[8px]
//                 font-bold
//                 leading-none
//                 text-white

//                 sm:h-4
//                 sm:min-w-4
//                 sm:text-[9px]
//               "
//             >
//               {summary.notice +
//                 summary.reserved}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* ====================================================
//           HEADER
//       ==================================================== */}

//       <div
//         className="
//           mt-1
//           mb-2.5
//           flex
//           items-center
//           justify-between

//           sm:mb-3

//           md:mb-4

//           lg:mt-3
//           lg:mb-5
//         "
//       >
//         <div>
//           <h1
//             className="
//               text-lg
//               font-extrabold
//               leading-tight
//               text-slate-900

//               md:text-xl

//               xl:text-2xl
//             "
//           >
//             Bed map
//           </h1>

//           <p
//             className="
//               mt-0.5
//               hidden
//               text-sm
//               text-slate-500
//               lg:block
//             "
//           >
//             Track every bed across
//             your property at a glance.
//           </p>
//         </div>

//         <div
//           className="
//             flex
//             items-center
//             gap-1.5
//           "
//         >
//           {/* DESKTOP NOTIFICATION */}

//           <button
//             type="button"
//             className="
//               relative
//               hidden
//               rounded-md
//               border
//               border-slate-200
//               bg-white
//               p-2
//               hover:border-slate-300
//               lg:flex
//             "
//             aria-label="Notifications"
//           >
//             <Bell className="h-3 w-3 text-slate-700" />

//             {summary.notice +
//               summary.reserved >
//               0 && (
//               <span
//                 className="
//                   absolute
//                   -right-1
//                   -top-1
//                   flex
//                   h-4
//                   w-4
//                   items-center
//                   justify-center
//                   rounded-md
//                   bg-red-500
//                   text-[10px]
//                   font-bold
//                   text-white
//                 "
//               >
//                 {summary.notice +
//                   summary.reserved}
//               </span>
//             )}
//           </button>

//           {/* SELECTED PG */}

//           <button
//             type="button"
//             className="
//               flex
//               max-w-[130px]
//               items-center
//               gap-1
//               rounded-md
//               border
//               border-slate-200
//               bg-white
//               px-1.5
//               py-1
//               text-[9px]
//               font-medium
//               text-slate-700
//               hover:border-slate-300

//               sm:max-w-[150px]
//               sm:px-2
//               sm:text-[10px]

//               md:max-w-[180px]
//               md:rounded-md
//               md:px-3
//               md:py-1.5
//               md:text-xs
//             "
//           >
//             <span className="truncate">
//               {propertyName}
//             </span>

//             <ChevronDown
//               className="
//                 h-3
//                 w-3
//                 shrink-0
//                 text-slate-400

//                 md:h-4
//                 md:w-4
//               "
//             />
//           </button>
//         </div>
//       </div>

//       {/* ====================================================
//           SUMMARY
//       ==================================================== */}

//       <div
//         className="
//           mb-2
//           grid
//           grid-cols-4
//           gap-1

//           sm:mb-3
//           sm:gap-1.5

//           md:mb-3.5
//           md:gap-2

//           lg:mb-4
//           lg:gap-2.5
//         "
//       >
//         <SummaryCard
//           icon={BedIcon}
//           iconBg="bg-blue-50"
//           iconColor="text-blue-500"
//           label="Occupied"
//           value={
//             summary.occupied
//           }
//           valueColor="text-blue-600"
//         />

//         <SummaryCard
//           icon={Armchair}
//           iconBg="bg-green-50"
//           iconColor="text-green-500"
//           label="Vacant"
//           value={
//             summary.vacant
//           }
//           valueColor="text-green-600"
//         />

//         <SummaryCard
//           icon={AlertTriangle}
//           iconBg="bg-orange-50"
//           iconColor="text-orange-500"
//           label="Notice"
//           value={
//             summary.notice
//           }
//           valueColor="text-orange-500"
//         />

//         <SummaryCard
//           icon={Bookmark}
//           iconBg="bg-purple-50"
//           iconColor="text-purple-500"
//           label="Reserved"
//           value={
//             summary.reserved
//           }
//           valueColor="text-purple-600"
//         />
//       </div>

//       {/* ====================================================
//           FILTERS
//       ==================================================== */}

//       <div
//         className="
//           mb-2
//           flex
//           w-full
//           items-center
//           gap-1

//           sm:mb-3
//           sm:gap-1.5

//           md:mb-3.5
//           md:gap-2

//           lg:mb-4
//           lg:gap-2.5
//         "
//       >
//         {/* FLOOR */}

//         <div
//           className="
//             w-[23%]
//             min-w-0
//           "
//         >
//           <FilterSelect
//             label="Floor"
//             value={floorFilter}
//             options={floorOptions}
//             onChange={
//               setFloorFilter
//             }
//           />
//         </div>

//         {/* ROOM TYPE */}

//         <div
//           className="
//             w-[23%]
//             min-w-0
//           "
//         >
//           <FilterSelect
//             label="Room type"
//             value={typeFilter}
//             options={typeOptions}
//             onChange={
//               setTypeFilter
//             }
//           />
//         </div>

//         {/* SORT */}

//         <div
//           className="
//             w-[23%]
//             min-w-0
//           "
//         >
//           <FilterSelect
//             label="Sort"
//             value={sortFilter}
//             options={[
//               "Default",
//               "Vacant first",
//               "Occupied first",
//             ]}
//             onChange={
//               setSortFilter
//             }
//           />
//         </div>

//         {/* SEARCH */}

//         <div
//           className="
//             relative
//             min-w-0
//             flex-1
//             flex
//             items-center
//           "
//         >
//           <Search
//             className="
//               pointer-events-none
//               absolute
//               left-1.5
//               top-1/2
//               z-10
//               h-2.5
//               w-2.5
//               -translate-y-1/2
//               text-slate-400

//               sm:left-2
//               sm:h-3
//               sm:w-3

//               md:left-2.5
//               md:h-3.5
//               md:w-3.5
//             "
//           />

//           <input
//             type="text"
//             value={query}
//             onChange={(e) =>
//               setQuery(
//                 e.target.value
//               )
//             }
//             placeholder="Search"
//             className="
//               h-[24px]
//               w-full
//               min-w-0
//               rounded-md
//               border
//               border-slate-200
//               bg-white

//               pl-5
//               pr-1.5

//               text-[8px]
//               font-medium
//               leading-none
//               text-slate-700
//               placeholder:text-slate-400

//               focus:border-blue-300
//               focus:outline-none

//               sm:h-[32px]
//               sm:pl-6
//               sm:text-[9px]

//               md:h-[34px]
//               md:pl-7
//               md:text-[10px]

//               lg:h-[36px]
//               lg:pl-8
//               lg:text-xs
//             "
//           />
//         </div>
//       </div>

//       {/* ====================================================
//           LOADING
//       ==================================================== */}

//       {loading && (
//         <div
//           className="
//             flex
//             items-center
//             justify-center
//             gap-2
//             py-8
//             text-sm
//             text-slate-500
//           "
//         >
//           <Loader2
//             className="
//               h-5
//               w-5
//               animate-spin
//               text-blue-600
//             "
//           />

//           Loading bed map...
//         </div>
//       )}

//       {/* ====================================================
//           ROOM LIST
//       ==================================================== */}

//       {!loading && (
//         <div
//           className="
//             grid
//             grid-cols-1
//             gap-2

//             sm:gap-2.5

//             md:grid-cols-2
//             md:gap-3

//             lg:gap-3.5

//             xl:grid-cols-3
//             xl:gap-4

//             items-stretch
//           "
//         >
//           {filteredRooms.map(
//             (room) => (
//               <RoomCard
//                 key={
//                   room.id
//                 }
//                 room={
//                   room
//                 }
//                 onAssignBed={
//                   onAssignBed
//                 }
//                 onViewDetails={
//                   onViewDetails
//                 }
//               />
//             )
//           )}

//           {filteredRooms.length ===
//             0 && (
//             <div
//               className="
//                 col-span-full
//                 rounded-md
//                 border
//                 border-dashed
//                 border-slate-200
//                 bg-white
//                 py-12
//                 text-center
//               "
//             >
//               <BedIcon
//                 className="
//                   mx-auto
//                   mb-2
//                   h-8
//                   w-8
//                   text-slate-300
//                 "
//               />

//               <p className="text-sm font-medium text-slate-600">
//                 No rooms found
//               </p>

//               <p className="mt-1 text-xs text-slate-400">
//                 Try changing the
//                 filters or search.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </PageShell>
//   );
// }




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Bell,
  Bed as BedIcon,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  Search,
  Armchair,
  Loader2,
} from "lucide-react";

import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
import { usePgRoomsStore } from "@/app/shared/store/roomsStore";
import { usePgBedInfoStore } from "@/app/shared/store/bedInfoStore";
import { usePgBookingsStore } from "@/app/shared/store/bookingStore";
import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
import { PageShell } from "@/app/shared/components/PageShell";
import { useBedMapResidentsStore } from "../store/bedMapsResidentsStore";

import RoomDetailsModal from "./RoomDetailsModal";

/* ============================================================
   TYPES
============================================================ */

type BedStatus =
  | "occupied"
  | "vacant"
  | "reserved"
  | "notice";

type RoomType =
  | "Single"
  | "Double"
  | "Triple";

interface Bed {
  id: number;
  label: string;
  status: BedStatus;
  occupantName?: string;
  isUpcomingCheckout?: boolean;
}

interface Room {
  id: number;
  number: string;
  type: RoomType;
  floor?: number | string;

  hasTv: boolean;
  hasAc: boolean;
  hasBalcony: boolean;

  beds: Bed[];
}

interface BedMapSummary {
  occupied: number;
  vacant: number;
  notice: number;
  reserved: number;
}

/* ============================================================
   DATABASE STATUS CONSTANTS
============================================================ */

const BED_STATUS = {
  VACANT: 3,
  RESERVED: 4,
  OCCUPIED: 5,
} as const;

/* ============================================================
   HELPERS
============================================================ */

const getRoomType = (
  occupancy?: string | null
): RoomType => {
  switch (
    String(occupancy || "").toLowerCase()
  ) {
    case "single":
      return "Single";

    case "double":
      return "Double";

    case "triple":
      return "Triple";

    default:
      return "Single";
  }
};

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};

const getEndOf15thDay = () => {
  const date = getStartOfToday();

  date.setDate(
    date.getDate() + 15
  );

  date.setHours(
    23,
    59,
    59,
    999
  );

  return date;
};

const isUpcomingCheckout = (
  booking: any
): boolean => {
  if (
    Number(
      booking?.bkg_status
    ) !== BED_STATUS.OCCUPIED
  ) {
    return false;
  }

  const checkoutValue =
    booking?.planned_check_out_date;

  if (!checkoutValue) {
    return false;
  }

  const checkoutDate =
    new Date(checkoutValue);

  if (
    Number.isNaN(
      checkoutDate.getTime()
    )
  ) {
    return false;
  }

  const startDate =
    getStartOfToday();

  const endDate =
    getEndOf15thDay();

  return (
    checkoutDate >= startDate &&
    checkoutDate <= endDate
  );
};

/* ============================================================
   STATUS STYLES
============================================================ */

const STATUS_STYLES: Record<
  BedStatus,
  {
    cardBg: string;
    cardBorder: string;
    iconBg: string;
    iconColor: string;
    label: string;
    Icon: React.ElementType;
  }
> = {
  occupied: {
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Occupied",
    Icon: BedIcon,
  },

  vacant: {
    cardBg: "bg-green-50",
    cardBorder: "border-green-100",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    label: "Vacant",
    Icon: Armchair,
  },

  notice: {
    cardBg: "bg-orange-50",
    cardBorder: "border-orange-100",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    label: "Notice Period",
    Icon: AlertTriangle,
  },

  reserved: {
    cardBg: "bg-purple-50",
    cardBorder: "border-purple-100",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    label: "Reserved",
    Icon: Bookmark,
  },
};

/* ============================================================
   ROOM TYPE STYLES
============================================================ */

const TYPE_BADGE_STYLES: Record<
  RoomType,
  string
> = {
  Single:
    "bg-slate-50 text-slate-600",

  Double:
    "bg-green-50 text-green-700",

  Triple:
    "bg-blue-50 text-blue-700",
};

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  valueColor: string;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-1
        rounded-md
        border
        border-slate-100
        bg-white
        px-1
        py-3

        sm:gap-1
        sm:px-1.5

        md:gap-1.5
        md:px-2
        md:py-2

        lg:px-2.5
        lg:py-2

        transition-shadow
        hover:shadow-sm
      "
    >
      <div
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-md
          ${iconBg}

          sm:h-6
          sm:w-6

          md:h-7
          md:w-7

          lg:h-8
          lg:w-8
        `}
      >
        <Icon
          className={`
            h-3
            w-3
            ${iconColor}

            md:h-4
            md:w-4
          `}
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            mb-0
            truncate
            text-[8px]
            leading-none
            text-slate-500

            md:text-[10px]
          "
        >
          {label}
        </p>

        <p
          className={`
            truncate
            text-xs
            font-bold
            leading-none

            sm:text-sm

            md:text-base

            lg:text-lg

            ${valueColor}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="
        relative
        flex
        min-w-0
        shrink
        items-center
      "
    >
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-[24px]
          w-full
          min-w-0
          appearance-none
          rounded-md
          border
          border-slate-200
          bg-white
          px-1.5
          pr-5
          text-[8px]
          font-medium
          leading-none
          text-slate-700
          whitespace-nowrap
          transition-colors
          cursor-pointer
          hover:border-slate-300
          focus:border-blue-300
          focus:outline-none

          sm:h-[32px]
          sm:px-2
          sm:pr-6
          sm:text-[9px]

          md:h-[34px]
          md:px-2
          md:pr-7
          md:text-[10px]

          lg:h-[36px]
          lg:px-2.5
          lg:pr-7
          lg:text-xs
        "
        aria-label={label}
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-1
          top-1/2
          h-2.5
          w-2.5
          -translate-y-1/2
          text-slate-400

          sm:right-1.5
          sm:h-3
          sm:w-3

          md:right-2
          md:h-3
          md:w-3

          lg:right-2
          lg:h-3.5
          lg:w-3.5
        "
      />
    </div>
  );
}

/* ============================================================
   BED TILE
============================================================ */

function BedTile({
  bed,
}: {
  bed: Bed;
}) {
  const visualStatus: BedStatus =
    bed.isUpcomingCheckout &&
    bed.status === "occupied"
      ? "notice"
      : bed.status;

  const style =
    STATUS_STYLES[visualStatus];

  const { Icon } = style;

  let residentName = "";

  if (
    bed.status === "occupied"
  ) {
    residentName =
      bed.occupantName ||
      "Occupied";
  } else if (
    bed.status === "vacant"
  ) {
    residentName = "Vacant";
  } else if (
    bed.status === "reserved"
  ) {
    residentName = "Reserved";
  }

  const title =
    bed.isUpcomingCheckout &&
    bed.status === "occupied"
      ? `${bed.label} - ${
          residentName || "Notice"
        }`
      : `${bed.label} - ${residentName}`;

  return (
    <div
      className={`
        flex
        min-w-0
        w-full
        items-center
        gap-0.5
        rounded-sm
        border
        px-[5px]
        py-1

        sm:px-[7px]
        sm:py-1.5

        md:px-[5px]
        md:py-1

        lg:px-[8px]
        lg:py-1

        xl:px-[1px]
        xl:py-1

        ${style.cardBg}
        ${style.cardBorder}
      `}
    >
      <div
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded
          ${style.iconBg}

          sm:h-5
          sm:w-5

          md:h-4
          md:w-4

          lg:h-4
          lg:w-4

          xl:h-5
          xl:w-5
        `}
      >
        <Icon
          className={`
            h-2
            w-2
            shrink-0
            ${style.iconColor}

            sm:h-2.5
            sm:w-2.5

            md:h-2
            md:w-2

            lg:h-2
            lg:w-2

            xl:h-2.5
            xl:w-2.5
          `}
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
          overflow-hidden
          leading-none
        "
      >
        <p
          className="
            block
            min-w-0
            truncate
            text-[8px]
            font-semibold
            leading-[10px]
            text-slate-800

            sm:text-[9px]
            sm:leading-[11px]

            md:text-[8px]
            md:leading-[10px]

            lg:text-[8px]
            lg:leading-[10px]

            xl:text-[9px]
            xl:leading-[11px]
          "
          title={title}
        >
          {title}
        </p>

        <p
          className={`
            block
            min-w-0
            truncate
            text-[7px]
            font-medium
            leading-[9px]

            sm:text-[8px]
            sm:leading-[10px]

            md:text-[7px]
            md:leading-[9px]

            lg:text-[7px]
            lg:leading-[9px]

            xl:text-[8px]
            xl:leading-[10px]

            ${style.iconColor}
          `}
          title={style.label}
        >
          {style.label}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   ROOM CARD
============================================================ */


function RoomCard({
  room,
  onAssignBed,
  onViewDetails,
}: {
  room: Room;

  onAssignBed?: (
    roomId: string,
    bedLabel: string
  ) => void;

  onViewDetails?: (
    roomId: string
  ) => void;
}) {
  const vacantBed =
    room.beds.find(
      (bed) =>
        bed.status === "vacant"
    );

  const occupiedCount =
    room.beds.filter(
      (bed) =>
        bed.status ===
        "occupied"
    ).length;

  const noticeCount =
    room.beds.filter(
      (bed) =>
        bed.isUpcomingCheckout ===
        true
    ).length;

  const totalBeds =
    room.beds.length;

  const hasVacant =
    Boolean(vacantBed);

  return (
    <div
      className={`
        flex
        h-full
        min-w-0
        flex-col
        rounded-md
        border
        px-1.5
        py-2
        transition-all
        hover:shadow-sm

        sm:px-2
        sm:py-2.5

        md:px-2
        md:py-2.5

        lg:px-2.5
        lg:py-3

        xl:px-3
        xl:py-3.5

        ${
          hasVacant
            ? "border-green-200 bg-green-50/30"
            : "border-slate-200 bg-white"
        }
      `}
    >
      {/* ROOM HEADER */}

      <div
        className="
          mb-1.5
          flex
          items-start
          justify-between
          gap-1.5

          sm:mb-2

          md:mb-2
        "
      >
        <div className="min-w-0">
          <h3
            className="
              truncate
              text-xs
              font-bold
              leading-tight
              text-slate-900

              sm:text-sm

              md:text-sm

              lg:text-base
            "
          >
            Room - {room.number}
          </h3>

          <div
            className="
              mt-0.5
              flex
              min-w-0
              items-center
              gap-1
            "
          >
            <p
              className="
                whitespace-nowrap
                text-[8px]
                leading-tight
                text-slate-500

                sm:text-[9px]

                md:text-[10px]
              "
            >
              <span className="font-semibold text-blue-600">
                {occupiedCount}
              </span>
              /{totalBeds} occupied
            </p>

            {noticeCount > 0 && (
              <span
                className="
                  hidden
                  whitespace-nowrap
                  rounded-md
                  bg-orange-50
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-semibold
                  text-orange-600

                  lg:inline-flex
                "
              >
                {noticeCount} vacating
              </span>
            )}
          </div>
        </div>

        <span
          className={`
            shrink-0
            rounded-md
            px-1.5
            py-0.5
            text-[7px]
            font-semibold
            leading-tight

            sm:px-2
            sm:text-[8px]

            md:text-[9px]

            lg:px-2
            lg:text-[9px]

            ${TYPE_BADGE_STYLES[room.type]}
          `}
        >
          {room.type}
        </span>
      </div>

      {/* BEDS + ACTION */}

      <div
        className="
          mt-1
          flex
          min-w-0
          items-end
          gap-1

          sm:mt-1.5
          sm:gap-1.5
        "
      >
        <div
          className="
            grid
            min-w-0
            flex-1
            grid-cols-3
            gap-1

            sm:gap-1.5

            md:grid-cols-3
            md:gap-1.5

            lg:grid-cols-3
            lg:gap-1.5
          "
        >
          {room.beds.map(
            (bed) => (
              <BedTile
                key={bed.id}
                bed={bed}
              />
            )
          )}
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            justify-end
          "
        >
          <button
            type="button"
            onClick={() =>
              onViewDetails?.(
                String(room.id)
              )
            }
            className="
              flex
              items-center
              gap-0.5
              whitespace-nowrap
              px-0.5
              text-[7px]
              font-semibold
              text-blue-600
              hover:text-blue-700

              sm:px-1
              sm:text-[8px]

              md:text-[8px]

              lg:text-[9px]
            "
          >
            View Details

            <ArrowLeft
              className="
                h-2
                w-2
                rotate-180

                sm:h-2.5
                sm:w-2.5

                md:h-2.5
                md:w-2.5

                lg:h-3
                lg:w-3
              "
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN BED MAP
============================================================ */

export default function BedMap({
  onBack,
  onAssignBed,
  onViewDetails,
}: {
  onBack?: () => void;

  onAssignBed?: (
    roomId: string,
    bedLabel: string
  ) => void;

  onViewDetails?: (
    roomId: string
  ) => void;
}) {
  /* ==========================================================
     STORES
  ========================================================== */

  const {
    pgInfoList,
    fetchPgInfo,
    loading: pgLoading,
  } = usePgInfoStore();

  const {
    rooms,
    fetchRooms,
    loading: roomsLoading,
  } = usePgRoomsStore();

  const {
    bedInfoList,
    fetchBedInfo,
    loading: bedsLoading,
  } = usePgBedInfoStore();

  const {
    bookings,
    fetchBookings,
    loading: bookingsLoading,
  } = usePgBookingsStore();

  const {
    selectedPg,
    selectedPgId,
    setSelectedPg,
  } = useSelectedPgStore();

  const {
    fetchBedMapResidents,
    bedMapData,
  } = useBedMapResidentsStore();

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    floorFilter,
    setFloorFilter,
  ] = useState(
    "All floors"
  );

  const [
    typeFilter,
    setTypeFilter,
  ] = useState(
    "All types"
  );

  const [
    amenityFilter,
    setAmenityFilter,
  ] = useState(
    "All"
  );

  const [
    sortFilter,
    setSortFilter,
  ] = useState(
    "Default"
  );

  /* ==========================================================
     ROOM DETAILS MODAL
  ========================================================== */

  const [
    selectedRoom,
    setSelectedRoom,
  ] = useState<Room | null>(
    null
  );

  const [
    showRoomDetails,
    setShowRoomDetails,
  ] = useState(false);

  /* ==========================================================
     CURRENT PG
  ========================================================== */

  const currentPgId =
    selectedPg?.id ??
    selectedPgId ??
    pgInfoList[0]?.id ??
    null;

  /* ==========================================================
     LOAD PG LIST
  ========================================================== */

  useEffect(() => {
    if (
      pgInfoList.length === 0
    ) {
      fetchPgInfo();
    }
  }, [
    pgInfoList.length,
    fetchPgInfo,
  ]);

  /* ==========================================================
     RESTORE SELECTED PG
  ========================================================== */

  useEffect(() => {
    if (
      selectedPgId &&
      !selectedPg &&
      pgInfoList.length > 0
    ) {
      const matchingPg =
        pgInfoList.find(
          (pg: any) =>
            Number(pg.id) ===
            Number(
              selectedPgId
            )
        );

      if (matchingPg) {
        setSelectedPg(
          matchingPg
        );
      }
    }
  }, [
    selectedPgId,
    selectedPg,
    pgInfoList,
    setSelectedPg,
  ]);

  /* ==========================================================
     DEFAULT PG
  ========================================================== */

  useEffect(() => {
    if (
      !selectedPg &&
      !selectedPgId &&
      pgInfoList.length > 0
    ) {
      setSelectedPg(
        pgInfoList[0]
      );
    }
  }, [
    selectedPg,
    selectedPgId,
    pgInfoList,
    setSelectedPg,
  ]);

  /* ==========================================================
     FETCH BED MAP DATA
  ========================================================== */

  useEffect(() => {
    if (!currentPgId) {
      return;
    }

    const loadData =
      async () => {
        await Promise.allSettled([
          fetchRooms({
            pg_info:
              currentPgId,
          }),

          fetchBedInfo({
            pg_info_id:
              currentPgId,
          }),

          fetchBookings({
            pg_id:
              currentPgId,
          }),

          fetchBedMapResidents(
            Number(
              currentPgId
            )
          ),
        ]);
      };

    loadData();
  }, [
    currentPgId,
    fetchRooms,
    fetchBedInfo,
    fetchBookings,
    fetchBedMapResidents,
  ]);

  /* ==========================================================
     BOOKING LOOKUP BY BED ID

     IMPORTANT:
     bookings may initially be null/undefined.
     Always normalize it to an array.
  ========================================================== */

  const bookingByBedId =
    useMemo(() => {
      const map =
        new Map<
          number,
          any
        >();

      const bookingList =
        Array.isArray(
          bookings
        )
          ? bookings
          : [];

      bookingList.forEach(
        (booking: any) => {
          const bedId =
            Number(
              booking?.bed_id
            );

          if (!bedId) {
            return;
          }

          const status =
            Number(
              booking?.bkg_status
            );

          if (
            status ===
              BED_STATUS.OCCUPIED ||
            status ===
              BED_STATUS.RESERVED
          ) {
            map.set(
              bedId,
              booking
            );
          }
        }
      );

      return map;
    }, [
      bookings,
    ]);

  /* ==========================================================
     BED MAP RESIDENT LOOKUP

     IMPORTANT:
     bedMapData is null during the initial API request.

     Never directly do:
       bedMapData.rooms.forEach()

     Instead normalize the data first.
  ========================================================== */

  const bedMapResidentByBedId =
    useMemo(() => {
      const map =
        new Map<
          number,
          string
        >();

      const residentRooms =
        Array.isArray(
          bedMapData?.rooms
        )
          ? bedMapData.rooms
          : [];

      residentRooms.forEach(
        (room: any) => {
          const apiBeds =
            Array.isArray(
              room?.beds
            )
              ? room.beds
              : [];

          apiBeds.forEach(
            (apiBed: any) => {
              const bedId =
                Number(
                  apiBed?.bedId
                );

              if (!bedId) {
                return;
              }

              if (
                Number(
                  apiBed?.bedStatus
                ) !==
                BED_STATUS.OCCUPIED
              ) {
                return;
              }

              const firstName =
                String(
                  apiBed?.booking
                    ?.guest?.user
                    ?.firstName ||
                    ""
                ).trim();

              if (firstName) {
                map.set(
                  bedId,
                  firstName
                );
              }
            }
          );
        }
      );

      return map;
    }, [
      bedMapData,
    ]);

  /* ==========================================================
     BUILD BED MAP ROOMS

     IMPORTANT:
     rooms and bedInfoList can also be null while loading.
  ========================================================== */

  const bedMapRooms =
    useMemo<Room[]>(() => {
      const roomList =
        Array.isArray(
          rooms
        )
          ? rooms
          : [];

      const bedsList =
        Array.isArray(
          bedInfoList
        )
          ? bedInfoList
          : [];

      return roomList.map(
        (room: any) => {
          const roomId =
            Number(
              room?.id
            );

          const roomBeds =
            bedsList.filter(
              (bed: any) =>
                Number(
                  bed?.room_info
                ) === roomId
            );

          const mappedBeds =
            roomBeds.map(
              (bed: any) => {
                const bedId =
                  Number(
                    bed?.id
                  );

                const dbStatus =
                  Number(
                    bed?.bed_status
                  );

                const booking =
                  bookingByBedId.get(
                    bedId
                  );

                const occupantName =
                  bedMapResidentByBedId.get(
                    bedId
                  ) || "";

                const isNotice =
                  dbStatus ===
                    BED_STATUS.OCCUPIED &&
                  isUpcomingCheckout(
                    booking
                  );

                let status: BedStatus;

                if (
                  dbStatus ===
                  BED_STATUS.VACANT
                ) {
                  status =
                    "vacant";
                } else if (
                  dbStatus ===
                  BED_STATUS.RESERVED
                ) {
                  status =
                    "reserved";
                } else if (
                  dbStatus ===
                  BED_STATUS.OCCUPIED
                ) {
                  status =
                    "occupied";
                } else {
                  status =
                    "vacant";
                }

                return {
                  id: bedId,

                  label:
                    String(
                      bed?.bed_number ??
                        "-"
                    ),

                  status,

                  occupantName:
                    occupantName ||
                    undefined,

                  isUpcomingCheckout:
                    isNotice,
                };
              }
            );

          return {
            id: roomId,

            number:
              String(
                room?.room_name ??
                  roomId
              ),

            type:
              getRoomType(
                room?.occupancy
              ),

            floor:
              room?.floor ??
              room?.floor_info,

            /*
             * API values:
             *
             * 1 = true
             * 0 = false
             */
            hasTv:
              Number(
                room?.has_tv
              ) === 1,

            hasAc:
              Number(
                room?.has_ac
              ) === 1,

            hasBalcony:
              Number(
                room?.has_balcony
              ) === 1,

            beds:
              mappedBeds,
          };
        }
      );
    }, [
      rooms,
      bedInfoList,
      bookingByBedId,
      bedMapResidentByBedId,
    ]);

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const summary =
    useMemo<BedMapSummary>(() => {
      const result: BedMapSummary =
        {
          occupied: 0,
          vacant: 0,
          notice: 0,
          reserved: 0,
        };

      bedMapRooms.forEach(
        (room) => {
          room.beds.forEach(
            (bed) => {
              if (
                bed.status ===
                "occupied"
              ) {
                result.occupied +=
                  1;
              }

              if (
                bed.status ===
                "vacant"
              ) {
                result.vacant +=
                  1;
              }

              if (
                bed.status ===
                "reserved"
              ) {
                result.reserved +=
                  1;
              }

              if (
                bed.isUpcomingCheckout
              ) {
                result.notice +=
                  1;
              }
            }
          );
        }
      );

      return result;
    }, [
      bedMapRooms,
    ]);

  /* ==========================================================
     FLOOR OPTIONS
  ========================================================== */

  const floorOptions =
    useMemo(() => {
      const floors =
        new Set<string>();

      bedMapRooms.forEach(
        (room) => {
          if (
            room.floor !==
              undefined &&
            room.floor !== null &&
            String(
              room.floor
            ).trim() !== ""
          ) {
            floors.add(
              String(
                room.floor
              )
            );
          }
        }
      );

      return [
        "All floors",
        ...Array.from(
          floors
        ).sort(
          (a, b) =>
            Number(a) -
            Number(b)
        ),
      ];
    }, [
      bedMapRooms,
    ]);

  /* ==========================================================
     ROOM TYPE OPTIONS
  ========================================================== */

  const typeOptions = [
    "All types",
    "Single",
    "Double",
    "Triple",
  ];

  /* ==========================================================
     AMENITY OPTIONS
  ========================================================== */

  const amenityOptions = [
    "All",
    "TV",
    "AC",
    "Balcony",
    "No Amenities",
  ];

  /* ==========================================================
     FILTER + SEARCH + SORT
  ========================================================== */

  const filteredRooms =
    useMemo(() => {
      let result =
        [...bedMapRooms];

      const search =
        query
          .trim()
          .toLowerCase();

      /* SEARCH */

      if (search) {
        result =
          result.filter(
            (room) =>
              room.number
                .toLowerCase()
                .includes(
                  search
                ) ||
              room.beds.some(
                (bed) =>
                  bed.occupantName
                    ?.toLowerCase()
                    .includes(
                      search
                    ) ||
                  bed.label
                    .toLowerCase()
                    .includes(
                      search
                    )
              )
          );
      }

      /* FLOOR */

      if (
        floorFilter !==
        "All floors"
      ) {
        result =
          result.filter(
            (room) =>
              String(
                room.floor
              ) ===
              floorFilter
          );
      }

      /* ROOM TYPE */

      if (
        typeFilter !==
        "All types"
      ) {
        result =
          result.filter(
            (room) =>
              room.type ===
              typeFilter
          );
      }

      /* AMENITIES */

      if (
        amenityFilter !==
        "All"
      ) {
        result =
          result.filter(
            (room) => {
              if (
                amenityFilter ===
                "TV"
              ) {
                return room.hasTv;
              }

              if (
                amenityFilter ===
                "AC"
              ) {
                return room.hasAc;
              }

              if (
                amenityFilter ===
                "Balcony"
              ) {
                return room.hasBalcony;
              }

              /*
               * Room must have NONE
               * of the three amenities.
               */
              if (
                amenityFilter ===
                "No Amenities"
              ) {
                return (
                  !room.hasTv &&
                  !room.hasAc &&
                  !room.hasBalcony
                );
              }

              return true;
            }
          );
      }

      /* SORT */

      if (
        sortFilter ===
        "Vacant first"
      ) {
        result.sort(
          (a, b) => {
            const aVacant =
              a.beds.some(
                (bed) =>
                  bed.status ===
                  "vacant"
              );

            const bVacant =
              b.beds.some(
                (bed) =>
                  bed.status ===
                  "vacant"
              );

            return (
              Number(
                bVacant
              ) -
              Number(
                aVacant
              )
            );
          }
        );
      }

      if (
        sortFilter ===
        "Occupied first"
      ) {
        result.sort(
          (a, b) => {
            const aOccupied =
              a.beds.some(
                (bed) =>
                  bed.status ===
                  "occupied"
              );

            const bOccupied =
              b.beds.some(
                (bed) =>
                  bed.status ===
                  "occupied"
              );

            return (
              Number(
                bOccupied
              ) -
              Number(
                aOccupied
              )
            );
          }
        );
      }

      return result;
    }, [
      bedMapRooms,
      query,
      floorFilter,
      typeFilter,
      amenityFilter,
      sortFilter,
    ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  const loading =
    Boolean(
      pgLoading ||
        roomsLoading ||
        bedsLoading ||
        bookingsLoading
    );

  /* ==========================================================
     PG NAME
  ========================================================== */

  const propertyName =
    selectedPg?.pg_name ||
    pgInfoList.find(
      (pg: any) =>
        Number(pg.id) ===
        Number(
          currentPgId
        )
    )?.pg_name ||
    "My PG";

  /* ==========================================================
     PG CHANGE
  ========================================================== */

  const handlePgChange = (
    value: string
  ) => {
    const matchingPg =
      pgInfoList.find(
        (pg: any) =>
          String(pg?.id) ===
          String(value)
      );

    if (!matchingPg) {
      return;
    }

    setSelectedPg(
      matchingPg
    );

    /*
     * Reset filters when switching PG
     * so the new PG starts clean.
     */
    setFloorFilter(
      "All floors"
    );

    setTypeFilter(
      "All types"
    );

    setAmenityFilter(
      "All"
    );

    setSortFilter(
      "Default"
    );

    setQuery("");
  };

  /* ==========================================================
     VIEW DETAILS
  ========================================================== */

  const handleViewDetails = (
    roomId: string
  ) => {
    const room =
      bedMapRooms.find(
        (item) =>
          String(item.id) ===
          String(roomId)
      );

    if (!room) {
      return;
    }

    setSelectedRoom(
      room
    );

    setShowRoomDetails(
      true
    );

    onViewDetails?.(
      roomId
    );
  };

  /* ==========================================================
     CLOSE ROOM DETAILS
  ========================================================== */

  const handleCloseRoomDetails =
    () => {
      setShowRoomDetails(
        false
      );

      setSelectedRoom(
        null
      );
    };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PageShell>
      {/* ====================================================
          MOBILE / TABLET TOP BAR
      ==================================================== */}

      <div
        className="
          flex
          h-[40px]
          items-center
          justify-start
          pt-1

          sm:h-[44px]

          md:h-[50px]

          lg:hidden
        "
      >
        {/* BACK */}

        <button
          type="button"
          onClick={onBack}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-md
            hover:bg-slate-100

            sm:h-8
            sm:w-8

            md:h-9
            md:w-9
          "
          aria-label="Go back"
        >
          <ArrowLeft
            className="
              h-4
              w-4
              text-slate-800

              sm:h-5
              sm:w-5
            "
          />
        </button>

        {/* LOGO */}

        <span
          className="
            ml-1
            text-base
            font-extrabold
            leading-none
            text-blue-600

            sm:ml-1.5
            sm:text-lg

            md:ml-2
            md:text-xl
          "
        >
          MyPG
        </span>

        {/* NOTIFICATION */}

        <button
          type="button"
          className="
            relative
            ml-auto
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-md
            hover:bg-slate-100

            sm:h-8
            sm:w-8

            md:h-9
            md:w-9
          "
          aria-label="Notifications"
        >
          <Bell
            className="
              h-4
              w-4
              text-slate-800

              sm:h-5
              sm:w-5
            "
          />

          {summary.notice +
            summary.reserved >
            0 && (
            <span
              className="
                absolute
                -right-0.5
                -top-0.5
                flex
                h-3.5
                min-w-3.5
                items-center
                justify-center
                rounded-md
                bg-red-500
                px-0.5
                text-[8px]
                font-bold
                leading-none
                text-white

                sm:h-4
                sm:min-w-4
                sm:text-[9px]
              "
            >
              {summary.notice +
                summary.reserved}
            </span>
          )}
        </button>
      </div>

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          mt-1
          mb-2.5
          flex
          items-center
          justify-between

          sm:mb-3

          md:mb-4

          lg:mt-3
          lg:mb-5
        "
      >
        <div>
          <h1
            className="
              text-lg
              font-extrabold
              leading-tight
              text-slate-900

              md:text-xl

              xl:text-2xl
            "
          >
            Bed map
          </h1>

          <p
            className="
              mt-0.5
              hidden
              text-sm
              text-slate-500
              lg:block
            "
          >
            Track every bed across
            your property at a glance.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
          "
        >
          {/* DESKTOP NOTIFICATION */}

          <button
            type="button"
            className="
              relative
              hidden
              rounded-md
              border
              border-slate-200
              bg-white
              p-2
              hover:border-slate-300
              lg:flex
            "
            aria-label="Notifications"
          >
            <Bell className="h-3 w-3 text-slate-700" />

            {summary.notice +
              summary.reserved >
              0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-md
                  bg-red-500
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {summary.notice +
                  summary.reserved}
              </span>
            )}
          </button>

          {/* =================================================
              PG DROPDOWN

              Previously this was only a button.
              Now it is a real select.
          ================================================= */}

          <div
            className="
              relative
              max-w-[130px]

              sm:max-w-[150px]

              md:max-w-[180px]
            "
          >
            <select
              value={String(
                currentPgId ?? ""
              )}
              onChange={(e) =>
                handlePgChange(
                  e.target.value
                )
              }
              className="
                h-[28px]
                w-full
                appearance-none
                rounded-md
                border
                border-slate-200
                bg-white
                pl-2
                pr-6
                text-[9px]
                font-medium
                text-slate-700
                outline-none
                cursor-pointer
                hover:border-slate-300
                focus:border-blue-300

                sm:h-[32px]
                sm:px-2
                sm:pr-7
                sm:text-[10px]

                md:h-[36px]
                md:px-3
                md:pr-8
                md:text-xs
              "
              aria-label="Select PG"
            >
              {pgInfoList.length ===
              0 ? (
                <option
                  value={String(
                    currentPgId ?? ""
                  )}
                >
                  {propertyName}
                </option>
              ) : (
                pgInfoList.map(
                  (pg: any) => (
                    <option
                      key={String(
                        pg.id
                      )}
                      value={String(
                        pg.id
                      )}
                    >
                      {pg.pg_name ??
                        `PG ${pg.id}`}
                    </option>
                  )
                )
              )}
            </select>

            <ChevronDown
              className="
                pointer-events-none
                absolute
                right-1.5
                top-1/2
                h-3
                w-3
                -translate-y-1/2
                text-slate-400

                md:right-2
                md:h-4
                md:w-4
              "
            />
          </div>
        </div>
      </div>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <div
        className="
          mb-2
          grid
          grid-cols-4
          gap-1

          sm:mb-3
          sm:gap-1.5

          md:mb-3.5
          md:gap-2

          lg:mb-4
          lg:gap-2.5
        "
      >
        <SummaryCard
          icon={BedIcon}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          label="Occupied"
          value={
            summary.occupied
          }
          valueColor="text-blue-600"
        />

        <SummaryCard
          icon={Armchair}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          label="Vacant"
          value={
            summary.vacant
          }
          valueColor="text-green-600"
        />

        <SummaryCard
          icon={AlertTriangle}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          label="Notice"
          value={
            summary.notice
          }
          valueColor="text-orange-500"
        />

        <SummaryCard
          icon={Bookmark}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          label="Reserved"
          value={
            summary.reserved
          }
          valueColor="text-purple-600"
        />
      </div>

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <div
        className="
          mb-2
          flex
          w-full
          items-center
          gap-1

          sm:mb-3
          sm:gap-1.5

          md:mb-3.5
          md:gap-2

          lg:mb-4
          lg:gap-2.5
        "
      >
        {/* FLOOR */}

        <div
          className="
            w-[19%]
            min-w-0
          "
        >
          <FilterSelect
            label="Floor"
            value={floorFilter}
            options={
              floorOptions
            }
            onChange={
              setFloorFilter
            }
          />
        </div>

        {/* ROOM TYPE */}

        <div
          className="
            w-[19%]
            min-w-0
          "
        >
          <FilterSelect
            label="Room type"
            value={typeFilter}
            options={
              typeOptions
            }
            onChange={
              setTypeFilter
            }
          />
        </div>

        {/* AMENITIES */}

        <div
          className="
            w-[19%]
            min-w-0
          "
        >
          <FilterSelect
            label="Amenities"
            value={
              amenityFilter
            }
            options={
              amenityOptions
            }
            onChange={
              setAmenityFilter
            }
          />
        </div>

        {/* SORT */}

        <div
          className="
            w-[19%]
            min-w-0
          "
        >
          <FilterSelect
            label="Sort"
            value={
              sortFilter
            }
            options={[
              "Default",
              "Vacant first",
              "Occupied first",
            ]}
            onChange={
              setSortFilter
            }
          />
        </div>

        {/* SEARCH */}

        <div
          className="
            relative
            min-w-0
            flex-1
            flex
            items-center
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-1.5
              top-1/2
              z-10
              h-2.5
              w-2.5
              -translate-y-1/2
              text-slate-400

              sm:left-2
              sm:h-3
              sm:w-3

              md:left-2.5
              md:h-3.5
              md:w-3.5
            "
          />

          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            placeholder="Search"
            className="
              h-[24px]
              w-full
              min-w-0
              rounded-md
              border
              border-slate-200
              bg-white
              pl-5
              pr-1.5
              text-[8px]
              font-medium
              leading-none
              text-slate-700
              placeholder:text-slate-400
              focus:border-blue-300
              focus:outline-none

              sm:h-[32px]
              sm:pl-6
              sm:text-[9px]

              md:h-[34px]
              md:pl-7
              md:text-[10px]

              lg:h-[36px]
              lg:pl-8
              lg:text-xs
            "
          />
        </div>
      </div>

      {/* ====================================================
          LOADING
      ==================================================== */}

      {loading && (
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            py-8
            text-sm
            text-slate-500
          "
        >
          <Loader2
            className="
              h-5
              w-5
              animate-spin
              text-blue-600
            "
          />

          Loading bed map...
        </div>
      )}

      {/* ====================================================
          ROOM LIST
      ==================================================== */}

      {!loading && (
        <div
          className="
            grid
            grid-cols-1
            gap-2

            sm:gap-2.5

            md:grid-cols-2
            md:gap-3

            lg:gap-3.5

            xl:grid-cols-3
            xl:gap-4

            items-stretch
          "
        >
          {filteredRooms.map(
            (room) => (
              <RoomCard
                key={
                  room.id
                }
                room={
                  room
                }
                onAssignBed={
                  onAssignBed
                }
                onViewDetails={
                  handleViewDetails
                }
              />
            )
          )}

          {filteredRooms.length ===
            0 && (
            <div
              className="
                col-span-full
                rounded-md
                border
                border-dashed
                border-slate-200
                bg-white
                py-12
                text-center
              "
            >
              <BedIcon
                className="
                  mx-auto
                  mb-2
                  h-8
                  w-8
                  text-slate-300
                "
              />

              <p className="text-sm font-medium text-slate-600">
                No rooms found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing the
                filters or search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          ROOM DETAILS MODAL
      ==================================================== */}

      <RoomDetailsModal
        open={
          showRoomDetails
        }
        room={
          selectedRoom
        }
        onClose={
          handleCloseRoomDetails
        }
      />
    </PageShell>
  );
}