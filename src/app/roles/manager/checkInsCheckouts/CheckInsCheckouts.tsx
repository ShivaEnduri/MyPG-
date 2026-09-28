// import {
//   FC,
//   useEffect,
//   useState,
// } from "react";

// import {
//   Bell,
//   ChevronDown,
//   ClipboardList,
//   CalendarDays,
//   IdCard,
//   BedDouble,
//   LogIn,
//   FileText,
//   LogOut,
//   Clock,
//   CheckCircle2,
//   Phone,
//   UserPlus2,
//   Users,
//   Loader2,
// } from "lucide-react";

// import { PageShell } from "@/app/shared/components/PageShell";

// import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
// import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
// import { useCheckinCheckoutStore } from "@/app/shared/store/checkinCheckoutStore";
// import { useAuth } from "../../../../hooks/context/AuthContext";

// import { updateCheckinCheckout } from "@/app/shared/services/api/managerApiServices";

// import SuccessModal from "../../../../ui/Shared/SuccessModal";

// /* ----------------------------------------------------------------------- */
// /* Types                                                                   */
// /* ----------------------------------------------------------------------- */

// type ArrivalBadge =
//   | "Ready"
//   | "Pending Docs"
//   | "Room Assigned";

// type CheckoutBadge =
//   | "Final Review"
//   | "Key Pending"
//   | "Confirmed";

// type AvatarTone =
//   | "blue"
//   | "purple"
//   | "orange"
//   | "green";

// type SectionKey =
//   | "arrivals"
//   | "checkouts";

// type ActiveTab =
//   | "Today"
//   | "Upcoming"
//   | "Completed";

// /* ----------------------------------------------------------------------- */
// /* API booking type                                                        */
// /* ----------------------------------------------------------------------- */

// interface Booking {
//   booking_id: number;
//   booking_no: string;
//   user_name: string;
//   guest_id: number;
//   room_id: number;
//   bed_id: number;
//   planned_check_in_date: string;
//   actual_check_in_date: string | null;
//   planned_check_out_date: string;
//   actual_check_out_date: string | null;
//   booking_status: number;
//   status: string;
// }

// /* ----------------------------------------------------------------------- */
// /* Responsive visible counts                                               */
// /* ----------------------------------------------------------------------- */

// const BREAKPOINT_VISIBLE_COUNTS: [
//   minWidth: number,
//   count: number
// ][] = [
//   [1280, 9],
//   [1024, 7],
//   [640, 5],
//   [0, 3],
// ];

// function useResponsiveVisibleCount(): number {
//   const [count, setCount] =
//     useState(3);

//   useEffect(() => {
//     const computeCount = () => {
//       const width =
//         window.innerWidth;

//       const match =
//         BREAKPOINT_VISIBLE_COUNTS.find(
//           ([minWidth]) =>
//             width >= minWidth
//         );

//       setCount(
//         match
//           ? match[1]
//           : 3
//       );
//     };

//     computeCount();

//     window.addEventListener(
//       "resize",
//       computeCount
//     );

//     return () => {
//       window.removeEventListener(
//         "resize",
//         computeCount
//       );
//     };
//   }, []);

//   return count;
// }

// /* ----------------------------------------------------------------------- */
// /* Helpers                                                                 */
// /* ----------------------------------------------------------------------- */

// const avatarToneClasses: Record<
//   AvatarTone,
//   string
// > = {
//   blue:
//     "bg-blue-100 text-blue-600",
//   purple:
//     "bg-purple-100 text-purple-600",
//   orange:
//     "bg-orange-100 text-orange-600",
//   green:
//     "bg-green-100 text-green-600",
// };

// const arrivalBadgeClasses: Record<
//   ArrivalBadge,
//   string
// > = {
//   Ready:
//     "bg-green-50 text-green-700",
//   "Pending Docs":
//     "bg-orange-50 text-orange-700",
//   "Room Assigned":
//     "bg-blue-50 text-blue-700",
// };

// const checkoutBadgeClasses: Record<
//   CheckoutBadge,
//   string
// > = {
//   "Final Review":
//     "bg-purple-50 text-purple-700",
//   "Key Pending":
//     "bg-orange-50 text-orange-700",
//   Confirmed:
//     "bg-green-50 text-green-700",
// };

// /* ----------------------------------------------------------------------- */
// /* Date / status helpers                                                    */
// /* ----------------------------------------------------------------------- */

// function formatDate(dateString: string): string {
//   if (!dateString) {
//     return "-";
//   }

//   const date = new Date(dateString);

//   if (Number.isNaN(date.getTime())) {
//     return "-";
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// function getArrivalBadge(
//   booking: Booking
// ): ArrivalBadge {
//   if (
//     booking.actual_check_in_date
//   ) {
//     return "Ready";
//   }

//   if (
//     booking.status ===
//       "ROOM_ASSIGNED" ||
//     booking.booking_status === 5
//   ) {
//     return "Room Assigned";
//   }

//   return "Pending Docs";
// }

// function getCheckoutBadge(
//   booking: Booking
// ): CheckoutBadge {
//   if (
//     booking.actual_check_out_date
//   ) {
//     return "Confirmed";
//   }

//   if (
//     booking.status ===
//     "CONFIRMED"
//   ) {
//     return "Confirmed";
//   }

//   if (
//     booking.booking_status === 5
//   ) {
//     return "Final Review";
//   }

//   return "Key Pending";
// }

// function getAvatarTone(
//   index: number
// ): AvatarTone {
//   const tones: AvatarTone[] = [
//     "blue",
//     "purple",
//     "orange",
//     "green",
//   ];

//   return tones[
//     index % tones.length
//   ];
// }

// /* ----------------------------------------------------------------------- */
// /* Presentational components                                                */
// /* ----------------------------------------------------------------------- */

// const Avatar: FC<{
//   tone: AvatarTone;
// }> = ({ tone }) => (
//   <div
//     className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${avatarToneClasses[tone]}`}
//   >
//     <Users className="h-2.5 w-2.5" />
//   </div>
// );

// /* ----------------------------------------------------------------------- */
// /* Stat card                                                                */
// /* ----------------------------------------------------------------------- */

// const StatCard: FC<{
//   icon: React.ReactNode;
//   iconBg: string;
//   label: string;
//   value: number;
//   valueColor: string;
// }> = ({
//   icon,
//   iconBg,
//   label,
//   value,
//   valueColor,
// }) => (
//   <div className="flex flex-col items-center rounded-md border border-gray-100 bg-white px-1 py-1 text-center shadow-sm">
//     <div
//       className={`mb-0.5 flex h-5 w-5 items-center justify-center rounded-full ${iconBg}`}
//     >
//       {icon}
//     </div>

//     <p className="text-[7px] font-medium leading-tight text-gray-700 sm:text-[8px]">
//       {label}
//     </p>

//     <p
//       className={`text-sm font-bold sm:text-base ${valueColor}`}
//     >
//       {value}
//     </p>
//   </div>
// );

// /* ----------------------------------------------------------------------- */
// /* Outline button                                                           */
// /* ----------------------------------------------------------------------- */

// const OutlineButton: FC<{
//   icon: React.ReactNode;
//   label: string;
//   color:
//     | "blue"
//     | "green"
//     | "orange";
//   onClick?: () => void;
//   loading?: boolean;
//   disabled?: boolean;
// }> = ({
//   icon,
//   label,
//   color,
//   onClick,
//   loading = false,
//   disabled = false,
// }) => {
//   const colorClasses = {
//     blue:
//       "border-blue-200 text-blue-600 hover:bg-blue-50",
//     green:
//       "border-green-200 text-green-600 hover:bg-green-50",
//     orange:
//       "border-orange-200 text-orange-600 hover:bg-orange-50",
//   }[color];

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={
//         disabled || loading
//       }
//       className={`flex items-center justify-center gap-0.5 rounded-md border bg-white px-1 py-0.5 text-[8px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-[9px] ${colorClasses}`}
//     >
//       {loading ? (
//         <Loader2 className="h-2.5 w-2.5 animate-spin" />
//       ) : (
//         icon
//       )}

//       <span>
//         {loading
//           ? "Updating..."
//           : label}
//       </span>
//     </button>
//   );
// };

// /* ----------------------------------------------------------------------- */
// /* Section header                                                           */
// /* ----------------------------------------------------------------------- */

// const SectionHeader: FC<{
//   title: string;
//   isExpanded: boolean;
//   hasMore: boolean;
//   onToggle: () => void;
// }> = ({
//   title,
//   isExpanded,
//   hasMore,
//   onToggle,
// }) => (
//   <div className="flex shrink-0 items-center justify-between px-1.5 pb-0.5 pt-1">
//     <h2 className="text-[11px] font-bold text-gray-900 sm:text-xs">
//       {title}
//     </h2>

//     {hasMore && (
//       <button
//         type="button"
//         onClick={onToggle}
//         className="text-[8px] font-semibold text-blue-600 hover:text-blue-700 sm:text-[9px]"
//       >
//         {isExpanded
//           ? "Show Less"
//           : "View All"}
//       </button>
//     )}
//   </div>
// );

// /* ----------------------------------------------------------------------- */
// /* Arrival row                                                              */
// /* ----------------------------------------------------------------------- */

// const ArrivalRow: FC<{
//   booking: Booking;
//   index: number;
//   onCheckIn: (
//     booking: Booking
//   ) => void;
//   updatingBookingId: number | null;
// }> = ({
//   booking,
//   index,
//   onCheckIn,
//   updatingBookingId,
// }) => {
//   const badge =
//     getArrivalBadge(
//       booking
//     );

//   const isUpdating =
//     updatingBookingId ===
//     booking.booking_id;

//   return (
//     <div className="flex items-center gap-1 border-t border-gray-100 px-1.5 py-1 first:border-t-0">
//       <Avatar
//         tone={getAvatarTone(
//           index
//         )}
//       />

//       <div className="min-w-0 flex-1">
//         <p className="truncate text-[10px] font-bold text-gray-900 sm:text-[11px]">
//           {booking.user_name}
//         </p>

//        <p className="truncate text-[8px] text-gray-500 sm:text-[9px]">
//   Join{" "}
//   {formatDate(
//     booking.planned_check_in_date
//   )}

//   <span className="mx-0.5">
//     •
//   </span>

//   Room{" "}
//   {booking.room_id}

//   <span className="mx-0.5">
//     •
//   </span>

//   Bed{" "}
//   {booking.bed_id}
// </p>
//       </div>

//       <span
//         className={`hidden shrink-0 rounded-full px-1 py-0.5 text-[7px] font-semibold sm:inline-block ${arrivalBadgeClasses[badge]}`}
//       >
//         {badge}
//       </span>

//       <div className="flex shrink-0 items-center gap-0.5">
//         {booking.status ===
//         "ROOM_ASSIGNED" ? (
//           <OutlineButton
//             icon={
//               <LogIn className="h-2.5 w-2.5" />
//             }
//             label="Check-in"
//             color="blue"
//             onClick={() =>
//               onCheckIn(
//                 booking
//               )
//             }
//             loading={isUpdating}
//             disabled={
//               updatingBookingId !==
//                 null &&
//               !isUpdating
//             }
//           />
//         ) : (
//           <OutlineButton
//             icon={
//               <FileText className="h-2.5 w-2.5" />
//             }
//             label="Review"
//             color="blue"
//           />
//         )}

//         <OutlineButton
//           icon={
//             <Phone className="h-2.5 w-2.5" />
//           }
//           label="Call"
//           color="blue"
//         />
//       </div>
//     </div>
//   );
// };

// /* ----------------------------------------------------------------------- */
// /* Checkout row                                                             */
// /* ----------------------------------------------------------------------- */

// const CheckoutRow: FC<{
//   booking: Booking;
//   index: number;
//   onCheckout: (
//     booking: Booking
//   ) => void;
//   updatingBookingId: number | null;
// }> = ({
//   booking,
//   index,
//   onCheckout,
//   updatingBookingId,
// }) => {
//   const badge =
//     getCheckoutBadge(
//       booking
//     );

//   const isUpdating =
//     updatingBookingId ===
//     booking.booking_id;

//   return (
//     <div className="flex items-center gap-1 border-t border-gray-100 px-1.5 py-1 first:border-t-0">
//       <Avatar
//         tone={getAvatarTone(
//           index + 1
//         )}
//       />

//       <div className="min-w-0 flex-1">
//         <p className="truncate text-[10px] font-bold text-gray-900 sm:text-[11px]">
//           {booking.user_name}
//         </p>

//        <p className="truncate text-[8px] text-gray-500 sm:text-[9px]">
//   Room{" "}
//   {booking.room_id}

//   <span className="mx-0.5">
//     •
//   </span>

//   {formatDate(
//     booking.planned_check_out_date
//   )}

//   <span className="mx-0.5">
//     •
//   </span>

//   Bed{" "}
//   {booking.bed_id}
// </p>
//       </div>

//       <span
//         className={`hidden shrink-0 rounded-full px-1 py-0.5 text-[7px] font-semibold sm:inline-block ${checkoutBadgeClasses[badge]}`}
//       >
//         {badge}
//       </span>

//       <div className="shrink-0">
//         {booking.status ===
//         "CONFIRMED" ? (
//           <OutlineButton
//             icon={
//               <LogOut className="h-2.5 w-2.5" />
//             }
//             label="Checkout"
//             color="green"
//             onClick={() =>
//               onCheckout(
//                 booking
//               )
//             }
//             loading={isUpdating}
//             disabled={
//               updatingBookingId !==
//                 null &&
//               !isUpdating
//             }
//           />
//         ) : booking.booking_status ===
//           5 ? (
//           <button
//             type="button"
//             className="flex items-center gap-0.5 rounded-md bg-purple-600 px-1 py-0.5 text-[8px] font-semibold text-white transition-colors hover:bg-purple-700 sm:text-[9px]"
//           >
//             <CheckCircle2 className="h-2.5 w-2.5" />

//             Complete
//           </button>
//         ) : (
//           <OutlineButton
//             icon={
//               <Clock className="h-2.5 w-2.5" />
//             }
//             label="Follow-up"
//             color="orange"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// /* ----------------------------------------------------------------------- */
// /* Empty section state                                                      */
// /* ----------------------------------------------------------------------- */

// const EmptySection: FC<{
//   message: string;
// }> = ({
//   message,
// }) => (
//   <div className="flex min-h-[70px] flex-1 items-center justify-center px-2 py-3">
//     <div className="text-center">
//       <p className="text-[9px] font-semibold text-gray-600 sm:text-[10px]">
//         {message}
//       </p>

//       <p className="mt-0.5 text-[7px] text-gray-400 sm:text-[8px]">
//         Nothing to display right now.
//       </p>
//     </div>
//   </div>
// );

// /* ----------------------------------------------------------------------- */
// /* Section styles                                                           */
// /* ----------------------------------------------------------------------- */

// const sectionWrapperClass = (
//   expanded: boolean
// ) =>
//   [
//     "flex flex-col rounded-md border border-gray-100 bg-white shadow-sm",
//     "lg:h-full",
//     expanded
//       ? "min-h-0 flex-1"
//       : "shrink-0",
//   ].join(" ");

// const listWrapperClass = (
//   expanded: boolean
// ) =>
//   expanded
//     ? "min-h-0 flex-1 overflow-y-auto"
//     : "lg:min-h-0 lg:flex-1 lg:overflow-hidden";

// /* ----------------------------------------------------------------------- */
// /* Props                                                                    */
// /* ----------------------------------------------------------------------- */

// interface CheckInsCheckoutsProps {
//   bottomNavHeight?: number;
// }

// /* ----------------------------------------------------------------------- */
// /* Main component                                                           */
// /* ----------------------------------------------------------------------- */

// export const CheckInsCheckouts: FC<
//   CheckInsCheckoutsProps
// > = ({
//   bottomNavHeight = 64,
// }) => {
//   const [
//     expanded,
//     setExpanded,
//   ] =
//     useState<SectionKey | null>(
//       null
//     );

//   const { user } =
//     useAuth();

//   const [
//     activeTab,
//     setActiveTab,
//   ] =
//     useState<ActiveTab>(
//       "Today"
//     );

//   const [
//     pgDropdownOpen,
//     setPgDropdownOpen,
//   ] =
//     useState(false);

//   const [
//     updatingBookingId,
//     setUpdatingBookingId,
//   ] =
//     useState<number | null>(
//       null
//     );

//   const [
//     successModalOpen,
//     setSuccessModalOpen,
//   ] =
//     useState(false);

//   const [
//     successMessage,
//     setSuccessMessage,
//   ] =
//     useState("");

//   const defaultVisibleCount =
//     useResponsiveVisibleCount();

//   /* --------------------------------------------------------------------- */
//   /* PG stores                                                             */
//   /* --------------------------------------------------------------------- */

//   const {
//     pgInfoList,
//     loading: pgLoading,
//     fetchPgInfo,
//   } = usePgInfoStore();

//   const {
//     selectedPg,
//     selectedPgId,
//     setSelectedPg,
//   } =
//     useSelectedPgStore();

//   /* --------------------------------------------------------------------- */
//   /* Check-in / Check-out store                                            */
//   /* --------------------------------------------------------------------- */

//   const {
//     data,
//     loading:
//       checkinCheckoutLoading,
//     error:
//       checkinCheckoutError,
//     fetchCheckinCheckout,
//   } =
//     useCheckinCheckoutStore();

//   /* --------------------------------------------------------------------- */
//   /* Fetch PG list                                                         */
//   /* --------------------------------------------------------------------- */

//   useEffect(() => {
//     if (!user?.id) {
//       return;
//     }

//     fetchPgInfo({
//       pg_owner: Number(
//         user.id
//       ),
//     });
//   }, [
//     user?.id,
//     fetchPgInfo,
//   ]);

//   /* --------------------------------------------------------------------- */
//   /* Restore selected PG                                                   */
//   /* --------------------------------------------------------------------- */

//   useEffect(() => {
//     if (!pgInfoList.length) {
//       return;
//     }

//     if (selectedPgId) {
//       const matchedPg =
//         pgInfoList.find(
//           (pg) =>
//             pg.id ===
//             selectedPgId
//         );

//       if (matchedPg) {
//         setSelectedPg(
//           matchedPg
//         );

//         return;
//       }
//     }

//     if (!selectedPg) {
//       setSelectedPg(
//         pgInfoList[0]
//       );
//     }
//   }, [
//     pgInfoList,
//     selectedPgId,
//     selectedPg,
//     setSelectedPg,
//   ]);

//   /* --------------------------------------------------------------------- */
//   /* Fetch check-in/check-out data                                         */
//   /* --------------------------------------------------------------------- */

//   useEffect(() => {
//     if (!selectedPgId) {
//       return;
//     }

//     fetchCheckinCheckout(
//       selectedPgId
//     );
//   }, [
//     selectedPgId,
//     fetchCheckinCheckout,
//   ]);

//   /* --------------------------------------------------------------------- */
//   /* Handle check-in / checkout update                                     */
//   /* --------------------------------------------------------------------- */

//   const handleBookingUpdate = async (
//     booking: Booking,
//     action:
//       | "check_in"
//       | "check_out"
//   ) => {
//     if (!user?.id) {
//       console.error(
//         "User ID not available"
//       );

//       return;
//     }

//     if (!booking.booking_id) {
//       console.error(
//         "Booking ID not available"
//       );

//       return;
//     }

//     if (
//       updatingBookingId !== null
//     ) {
//       return;
//     }

//     try {
//       setUpdatingBookingId(
//         booking.booking_id
//       );

//       const payload = {
//         booking_id:
//           Number(
//             booking.booking_id
//           ),

//         action,

//         user_id:
//           Number(user.id),
//       };

//       console.log(
//         "Updating booking:",
//         payload
//       );

//       const response =
//         await updateCheckinCheckout(
//           payload
//         );

//       console.log(
//         "Check-in/check-out update response:",
//         response
//       );

//       /*
//        * Refresh the data after
//        * successful update.
//        */
//       if (selectedPgId) {
//         await fetchCheckinCheckout(
//           selectedPgId
//         );
//       }

//       setSuccessMessage(
//         action ===
//           "check_in"
//           ? `${booking.user_name} has been successfully checked in.`
//           : `${booking.user_name} has been successfully checked out.`
//       );

//       setSuccessModalOpen(
//         true
//       );
//     } catch (error: any) {
//       console.error(
//         "Failed to update check-in/check-out:",
//         error
//       );

//       /*
//        * Keep the existing error
//        * handling mechanism if the
//        * store/API layer provides it.
//        *
//        * For now, log the error.
//        */
//       alert(
//         error?.response?.data
//           ?.message ||
//           error?.message ||
//           "Failed to update booking."
//       );
//     } finally {
//       setUpdatingBookingId(
//         null
//       );
//     }
//   };

//   /* --------------------------------------------------------------------- */
//   /* Dedicated handlers                                                    */
//   /* --------------------------------------------------------------------- */

//   const handleCheckIn = (
//     booking: Booking
//   ) => {
//     handleBookingUpdate(
//       booking,
//       "check_in"
//     );
//   };

//   const handleCheckout = (
//     booking: Booking
//   ) => {
//     handleBookingUpdate(
//       booking,
//       "check_out"
//     );
//   };

//   /* --------------------------------------------------------------------- */
//   /* Section toggle                                                        */
//   /* --------------------------------------------------------------------- */

//   const toggleSection = (
//     key: SectionKey
//   ) => {
//     setExpanded(
//       (current) =>
//         current === key
//           ? null
//           : key
//     );
//   };

//   const arrivalsExpanded =
//     expanded === "arrivals";

//   const checkoutsExpanded =
//     expanded === "checkouts";

//   /* --------------------------------------------------------------------- */
//   /* Select data according to active tab                                   */
//   /* --------------------------------------------------------------------- */

//   const arrivals =
//     activeTab === "Today"
//       ? data?.today
//           .arrivals ?? []
//       : activeTab ===
//         "Upcoming"
//       ? data?.upcoming
//           .arrivals ?? []
//       : data?.completed
//           .arrivals ?? [];

//   const checkouts =
//     activeTab === "Today"
//       ? data?.today
//           .checkouts ?? []
//       : activeTab ===
//         "Upcoming"
//       ? data?.upcoming
//           .checkouts ?? []
//       : data?.completed
//           .checkouts ?? [];

//   /* --------------------------------------------------------------------- */
//   /* Visible data                                                          */
//   /* --------------------------------------------------------------------- */

//   const visibleArrivals =
//     arrivalsExpanded
//       ? arrivals
//       : arrivals.slice(
//           0,
//           defaultVisibleCount
//         );

//   const visibleCheckouts =
//     checkoutsExpanded
//       ? checkouts
//       : checkouts.slice(
//           0,
//           defaultVisibleCount
//         );

//   const arrivalsHasMore =
//     arrivals.length >
//     defaultVisibleCount;

//   const checkoutsHasMore =
//     checkouts.length >
//     defaultVisibleCount;

//   /* --------------------------------------------------------------------- */
//   /* Loading state                                                          */
//   /* --------------------------------------------------------------------- */

//   const loading =
//     pgLoading ||
//     checkinCheckoutLoading;

//   /* --------------------------------------------------------------------- */
//   /* Empty state messages                                                   */
//   /* --------------------------------------------------------------------- */

//   const arrivalsEmptyMessage =
//     activeTab === "Today"
//       ? "No arrivals today"
//       : activeTab ===
//         "Upcoming"
//       ? "No upcoming arrivals"
//       : "No completed arrivals";

//   const checkoutsEmptyMessage =
//     activeTab === "Today"
//       ? "No check-outs today"
//       : activeTab ===
//         "Upcoming"
//       ? "No upcoming check-outs"
//       : "No completed check-outs";

//   /* --------------------------------------------------------------------- */
//   /* Render                                                                */
//   /* --------------------------------------------------------------------- */

//   return (
//     <PageShell
//       noScroll
//       bottomPad={
//         bottomNavHeight
//       }
//     >
//       <div className="flex h-full min-h-0 flex-col gap-1.5">

//         {/* --------------------------------------------------------------- */}
//         {/* Header                                                          */}
//         {/* --------------------------------------------------------------- */}

//         <header className="flex shrink-0 items-center justify-between pt-0.5">
//           <span className="text-sm font-extrabold text-blue-600">
//             MyPG
//           </span>

//           <button
//             type="button"
//             className="relative rounded-full p-0.5 text-gray-800 hover:bg-gray-100"
//           >
//             <Bell className="h-3.5 w-3.5" />

//             <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-[6px] font-bold text-white">
//               3
//             </span>
//           </button>
//         </header>

//         {/* --------------------------------------------------------------- */}
//         {/* Page title + PG dropdown                                         */}
//         {/* --------------------------------------------------------------- */}

//         <div className="relative flex shrink-0 items-center justify-between">
//           <h1 className="text-xs font-extrabold text-gray-900 sm:text-sm">
//             Check-ins &amp; Check-outs
//           </h1>

//           <div className="relative">
//             <button
//               type="button"
//               onClick={() =>
//                 setPgDropdownOpen(
//                   (current) =>
//                     !current
//                 )
//               }
//               disabled={
//                 pgLoading
//               }
//               className="flex shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[8px] font-semibold text-gray-800 sm:text-[9px]"
//             >
//               <span className="max-w-[100px] truncate">
//                 {selectedPg?.pg_name ??
//                   (pgLoading
//                     ? "Loading..."
//                     : "Select PG")}
//               </span>

//               <ChevronDown
//                 className={`h-2 w-2 text-gray-500 transition-transform ${
//                   pgDropdownOpen
//                     ? "rotate-180"
//                     : ""
//                 }`}
//               />
//             </button>

//             {pgDropdownOpen &&
//               pgInfoList.length >
//                 0 && (
//                 <div className="absolute right-0 top-full z-50 mt-1 max-h-48 min-w-[150px] overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
//                   {pgInfoList.map(
//                     (pg) => (
//                       <button
//                         key={
//                           pg.id
//                         }
//                         type="button"
//                         onClick={() => {
//                           setSelectedPg(
//                             pg
//                           );

//                           setPgDropdownOpen(
//                             false
//                           );
//                         }}
//                         className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-[9px] font-medium transition-colors hover:bg-blue-50 ${
//                           selectedPgId ===
//                           pg.id
//                             ? "bg-blue-50 text-blue-600"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         {
//                           pg.pg_name
//                         }
//                       </button>
//                     )
//                   )}
//                 </div>
//               )}
//           </div>
//         </div>

//         {/* --------------------------------------------------------------- */}
//         {/* Error                                                            */}
//         {/* --------------------------------------------------------------- */}

//         {checkinCheckoutError && (
//           <div className="shrink-0 rounded-md border border-red-100 bg-red-50 px-2 py-1.5 text-[9px] text-red-600">
//             {
//               checkinCheckoutError
//             }
//           </div>
//         )}

//         {/* --------------------------------------------------------------- */}
//         {/* Stat cards                                                       */}
//         {/* --------------------------------------------------------------- */}

//         <div className="grid shrink-0 grid-cols-4 gap-1">
//           <StatCard
//             icon={
//               <ClipboardList className="h-2.5 w-2.5 text-blue-600" />
//             }
//             iconBg="bg-blue-50"
//             label="Today's Check-ins"
//             value={
//               data?.summary
//                 .todaysCheckIns ??
//               0
//             }
//             valueColor="text-blue-600"
//           />

//           <StatCard
//             icon={
//               <CalendarDays className="h-2.5 w-2.5 text-purple-600" />
//             }
//             iconBg="bg-purple-50"
//             label="Today's Check-outs"
//             value={
//               data?.summary
//                 .todaysCheckOuts ??
//               0
//             }
//             valueColor="text-purple-600"
//           />

//           <StatCard
//             icon={
//               <IdCard className="h-2.5 w-2.5 text-orange-600" />
//             }
//             iconBg="bg-orange-50"
//             label="Pending KYC"
//             value={
//               data?.summary
//                 .pendingKyc ??
//               0
//             }
//             valueColor="text-orange-600"
//           />

//           <StatCard
//             icon={
//               <BedDouble className="h-2.5 w-2.5 text-green-600" />
//             }
//             iconBg="bg-green-50"
//             label="Vacant Ready"
//             value={
//               data?.summary
//                 .vacantReady ??
//               0
//             }
//             valueColor="text-green-600"
//           />
//         </div>

//         {/* --------------------------------------------------------------- */}
//         {/* Tabs                                                             */}
//         {/* --------------------------------------------------------------- */}

//         <div className="flex shrink-0 items-center rounded-md border border-gray-100 bg-white p-0.5">
//           {(
//             [
//               "Today",
//               "Upcoming",
//               "Completed",
//             ] as const
//           ).map((tab) => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => {
//                 setActiveTab(
//                   tab
//                 );

//                 setExpanded(
//                   null
//                 );
//               }}
//               className={`flex-1 rounded py-0.5 text-[9px] font-semibold transition-colors ${
//                 activeTab === tab
//                   ? "border border-blue-200 bg-blue-50 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* --------------------------------------------------------------- */}
//         {/* Loading                                                           */}
//         {/* --------------------------------------------------------------- */}

//         {loading &&
//           !data && (
//             <div className="flex flex-1 items-center justify-center rounded-md border border-gray-100 bg-white">
//               <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
//                 <Loader2 className="h-3 w-3 animate-spin" />

//                 Loading check-in
//                 &amp; check-out
//                 data...
//               </div>
//             </div>
//           )}

//         {/* --------------------------------------------------------------- */}
//         {/* Body                                                             */}
//         {/* --------------------------------------------------------------- */}

//         {!loading &&
//           data && (
//             <div className="flex min-h-0 flex-1 flex-col gap-1.5 lg:grid lg:grid-cols-2 lg:items-stretch">

//               {/* ------------------------------------------------------- */}
//               {/* Arrivals                                                   */}
//               {/* ------------------------------------------------------- */}

//               <div
//                 className={sectionWrapperClass(
//                   arrivalsExpanded
//                 )}
//               >
//                 <SectionHeader
//                   title={
//                     activeTab ===
//                     "Today"
//                       ? "Today's Arrivals"
//                       : `${activeTab} Arrivals`
//                   }
//                   isExpanded={
//                     arrivalsExpanded
//                   }
//                   hasMore={
//                     arrivalsHasMore
//                   }
//                   onToggle={() =>
//                     toggleSection(
//                       "arrivals"
//                     )
//                   }
//                 />

//                 {arrivals.length ===
//                 0 ? (
//                   <EmptySection
//                     message={
//                       arrivalsEmptyMessage
//                     }
//                   />
//                 ) : (
//                   <div
//                     className={`flex flex-col ${listWrapperClass(
//                       arrivalsExpanded
//                     )}`}
//                   >
//                     {visibleArrivals.map(
//                       (
//                         booking,
//                         index
//                       ) => (
//                         <ArrivalRow
//                           key={
//                             booking.booking_id
//                           }
//                           booking={
//                             booking
//                           }
//                           index={
//                             index
//                           }
//                           onCheckIn={
//                             handleCheckIn
//                           }
//                           updatingBookingId={
//                             updatingBookingId
//                           }
//                         />
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* ------------------------------------------------------- */}
//               {/* Checkouts                                                  */}
//               {/* ------------------------------------------------------- */}

//               <div
//                 className={sectionWrapperClass(
//                   checkoutsExpanded
//                 )}
//               >
//                 <SectionHeader
//                   title={
//                     activeTab ===
//                     "Today"
//                       ? "Today's Check-outs"
//                       : `${activeTab} Check-outs`
//                   }
//                   isExpanded={
//                     checkoutsExpanded
//                   }
//                   hasMore={
//                     checkoutsHasMore
//                   }
//                   onToggle={() =>
//                     toggleSection(
//                       "checkouts"
//                     )
//                   }
//                 />

//                 {checkouts.length ===
//                 0 ? (
//                   <EmptySection
//                     message={
//                       checkoutsEmptyMessage
//                     }
//                   />
//                 ) : (
//                   <div
//                     className={`flex flex-col ${listWrapperClass(
//                       checkoutsExpanded
//                     )}`}
//                   >
//                     {visibleCheckouts.map(
//                       (
//                         booking,
//                         index
//                       ) => (
//                         <CheckoutRow
//                           key={
//                             booking.booking_id
//                           }
//                           booking={
//                             booking
//                           }
//                           index={
//                             index
//                           }
//                           onCheckout={
//                             handleCheckout
//                           }
//                           updatingBookingId={
//                             updatingBookingId
//                           }
//                         />
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//         {/* --------------------------------------------------------------- */}
//         {/* Add walk-in                                                      */}
//         {/* --------------------------------------------------------------- */}

//         <button
//           type="button"
//           className="flex shrink-0 items-center justify-center gap-1 rounded-md border border-blue-200 bg-white py-1 text-[9px] font-bold text-blue-600 hover:bg-blue-50 sm:text-[10px]"
//         >
//           <UserPlus2 className="h-3 w-3" />

//           Add Walk-in Enquiry
//         </button>
//       </div>

//       {/* ----------------------------------------------------------------- */}
//       {/* Success Modal                                                     */}
//       {/* ----------------------------------------------------------------- */}

//       <SuccessModal
//         open={
//           successModalOpen
//         }
//         title="Success"
//         message={
//           successMessage
//         }
//         onClose={() =>
//           setSuccessModalOpen(
//             false
//           )
//         }
//       />
//     </PageShell>
//   );
// };

// export default CheckInsCheckouts;