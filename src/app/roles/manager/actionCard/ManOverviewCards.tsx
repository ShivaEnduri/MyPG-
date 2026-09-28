// // import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { useEffect, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import ownerPglogo from "@pg/app/shared/assests/ownerPglogo.jpg"
// // // ---------- Types ----------
// // interface FirstManagerProps {
// //   name?: string;
// // }

// // interface KpiCardProps {
// //   title: string;
// //   icon: React.ReactNode;
// //   children: React.ReactNode;
// //   onClick?: () => void;
// // }

// // // ---------- Main Component ----------
// // export default function FirstManager({ name }: FirstManagerProps) {
// //   const navigate = useNavigate();
// //   const displayName = name || "Manager";

// //   // Layout constants
// //   const CARD_WIDTH = 261;
// //   const MIN_GAP = 8; 
// //   const SIDE_PADDING_MIN = 8;
// //   const ARROW_SIZE = 36;

// //   const wrapperRef = useRef<HTMLDivElement | null>(null);
// //   const containerRef = useRef<HTMLDivElement | null>(null);
// //   const [visibleCount, setVisibleCount] = useState<number>(4);
// //   const [startIndex, setStartIndex] = useState<number>(0);
// //   const [cardGap, setCardGap] = useState<number>(16);
// //   const [sidePadding, setSidePadding] = useState<number>(SIDE_PADDING_MIN);
// //   const [arrowOffset, setArrowOffset] = useState<number>(12);
// //   const [justifyContent, setJustifyContent] = useState<"center" | "space-between">("center");
// //   // Cards array
// //   const cards = [
// //     <KpiCard key="checkin" title="Today's Check-in" icon={IconCheckIn}>
// //       <p style={{ fontSize: 20, color: "#000" }}>
// //         <span style={{ fontWeight: 800, fontSize: 28 }}>5</span> scheduled today<br /> 12/09/25
// //       </p>
// //     </KpiCard>,
// //     <KpiCard key="checkout" title="Today's Check-out" icon={IconCheckOut}>
// //       <p style={{ fontSize: 20, color: "#000" }}>
// //         <span style={{ fontWeight: 800, fontSize: 28 }}>3</span> scheduled today as<br /> 12/09/25
// //       </p>
// //     </KpiCard>,
// //     <KpiCard key="tickets" title="Maintenance Tickets" icon={IconMaintenance} onClick={() => navigate("/maintenance-alerts")}>
// //       <p style={{ fontSize: 20, color: "#000" }}>
// //         <span style={{ fontWeight: 800, fontSize: 28 }}>7</span> Open Tickets
// //       </p>
// //     </KpiCard>,
// //     <KpiCard key="overdue" title="Overdue" icon={IconOverdue}>
// //       <p style={{ fontSize: 20, color: "#000" }}>
// //         <span style={{ fontWeight: 800, fontSize: 28 }}>8</span> Overdues
// //       </p>
// //     </KpiCard>,
// //   ];

// //   // Compute layout & arrow positions
// //   const recomputeLayout = () => {
// //     const wrapper = wrapperRef.current;
// //     const container = containerRef.current;
// //     if (!wrapper || !container) return;

// //     const wrapperWidth = wrapper.clientWidth;
// //     const available = Math.max(0, wrapperWidth - SIDE_PADDING_MIN * 2);

// //     // How many full cards fit
// //     let maxCount = Math.floor((available + MIN_GAP) / (CARD_WIDTH + MIN_GAP));
// //     maxCount = Math.max(1, Math.min(maxCount, cards.length));

// //     const totalCardWidth = maxCount * CARD_WIDTH;
// //     const remaining = Math.max(0, wrapperWidth - totalCardWidth);

// //     const gapsCount = Math.max(0, maxCount - 1);
// //     const preferredSidePadding = SIDE_PADDING_MIN;

// // let computedGap;
// // if (gapsCount > 0) {
// //   // Distribute remaining space across gaps - this allows gaps to grow on large screens
// //   computedGap = Math.floor((remaining - preferredSidePadding * 2) / gapsCount);
// //   computedGap = Math.max(MIN_GAP, computedGap);
  
// //   // Cap at 100px to prevent excessive spacing on 4K displays
// //   const MAX_GAP = 250;
// //   computedGap = Math.min(computedGap, MAX_GAP);
// // } else {
// //   computedGap = Math.max(MIN_GAP, remaining / 2);
// // }

// //     if (!isFinite(computedGap) || computedGap <= 0) computedGap = MIN_GAP;

// //     setVisibleCount(maxCount);
// //     setCardGap(Math.round(computedGap));
// //     setSidePadding(preferredSidePadding);

// //     // Arrow positioning - keep them at the edges with minimum padding
// //     const offset = Math.max(8, SIDE_PADDING_MIN);
// //     setArrowOffset(Math.round(offset));
// //     // Use space-between on 4K screens (>= 1700px width), center on smaller screens
// //     console.log('wrapperWidth:', wrapperWidth, 'justifyContent will be:', wrapperWidth >= 1700 ? 'space-between' : 'center');
// //    if (wrapperWidth >= 1700) {
// //   setJustifyContent("space-between");
// //  } else {
// //   setJustifyContent("center");
// //  }

// // // Clamp startIndex
// // setStartIndex((s) => Math.min(s, Math.max(0, cards.length - maxCount)));
// //   };

// //   useEffect(() => {
// //     recomputeLayout();
// //     const ro = new ResizeObserver(recomputeLayout);
// //     if (wrapperRef.current) ro.observe(wrapperRef.current);
// //     window.addEventListener("resize", recomputeLayout);
// //     return () => {
// //       ro.disconnect();
// //       window.removeEventListener("resize", recomputeLayout);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // Navigation: single-step
// //   const canGoLeft = startIndex > 0;
// //   const canGoRight = startIndex + visibleCount < cards.length;
// //   const goLeft = () => setStartIndex((s) => Math.max(0, s - 1));
// //   const goRight = () => setStartIndex((s) => Math.min(cards.length - visibleCount, s + 1));

// //   return (
// //     <div className="w-full p-4">
// //       <header className="mb-6">
// //         {/* Title + Logo */}
// //   <div className="flex items-center gap-3">
// //         <h1
// //           className="font-extrabold text-black"
// //           style={{ fontSize: "clamp(1rem, 2.6vw, 1.6rem)", fontFamily: "Poppins, sans-serif" }}
// //         >
// //           {`${displayName}'s Dashboard`}
// //         </h1>
        
// //     <img
// //       src={
// //          ownerPglogo
// //       }
// //       alt="PG Logo"
// //       className="h-12 w-16 lg:h-18 lg:w-28 object-contain rounded"
// //     />
// //   </div>
// //         <div
// //           className="mt-2 text-[#615F5F] font-extrabold truncate max-w-full"
// //           style={{ fontSize: "clamp(0.78rem, 1.6vw, 1rem)", fontFamily: "Poppins, sans-serif" }}
// //         >
// //           Hamsa PG, TNGO Colony, Gachibowli, Hyderabad, 25 rooms with 50 beds, Owner: Mohan-923456781
// //         </div>
// //       </header>

// //       <section className="flex justify-center relative">
// //         <div
// //           className="w-full max-w-[1260px] 2xl:max-w-[2500px] mx-auto relative"
// //           ref={wrapperRef}
// //         >
// //           <div
// //             ref={containerRef}
// //             style={{
// //               overflowX: "hidden",
// //               overflowY: "visible",
// //               padding: `calc(0.5rem + 12px) ${sidePadding}px`,
// //             }}
// //           >
// //             <div
// //               aria-live="polite"
// //               className="flex items-start"
// //               style={{
// //                 gap: `${cardGap}px`,
// //                 justifyContent: justifyContent,
// //                 transition: "gap 160ms linear",
// //                 width: "100%",
// //                 boxSizing: "border-box",
// //               }}
// //             >
// //               {cards
// //                 .slice(startIndex, startIndex + visibleCount)
// //                 .map((card, idx) => (
// //                   <div key={`card-${startIndex + idx}`}>{card}</div>
// //                 ))}
// //             </div>
// //           </div>

// //           {/* Arrows placed relative to wrapper, offset computed to sit near visible cards area */}
// //           <button
// //             aria-label="Previous card"
// //             onClick={goLeft}
// //             disabled={!canGoLeft}
// //             style={{
// //               position: "absolute",
// //               left: `${arrowOffset}px`,
// //               top: "50%",
// //               transform: "translate(-80%, -50%)",
// //               zIndex: 30,
// //               display: canGoLeft ? "flex" : "none",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               width: ARROW_SIZE,
// //               height: ARROW_SIZE,
// //               borderRadius: 9999,
// //               background: "white",
// //               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// //               border: "none",
// //               color: "#0B2595",
// //               cursor: "pointer",
// //             }}
// //           >
// //             <ChevronLeft size={18} />
// //           </button>

// //           <button
// //             aria-label="Next card"
// //             onClick={goRight}
// //             disabled={!canGoRight}
// //             style={{
// //               position: "absolute",
// //               right: `${arrowOffset}px`,
// //               top: "50%",
// //               transform: "translate(80%, -50%)",
// //               zIndex: 30,
// //               display: canGoRight ? "flex" : "none",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               width: ARROW_SIZE,
// //               height: ARROW_SIZE,
// //               borderRadius: 9999,
// //               background: "white",
// //               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// //               border: "none",
// //               color: "#0B2595",
// //               cursor: "pointer",
// //             }}
// //           >
// //             <ChevronRight size={18} />
// //           </button>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// // // ---------- Icons ----------
// // const IconCheckIn = (
// //   <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
// //     <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
// //     <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
// //     <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
// //     <path d="M17 14h-6m0 0l2-2m-2 2l2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //   </svg>
// // );

// // const IconCheckOut = (
// //   <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
// //     <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
// //     <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
// //     <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
// //     <path d="M11 14h6m0 0l-2-2m2 2l-2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //   </svg>
// // );

// // const IconMaintenance = (
// //   <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
// //     <path d="M35 12.25H27.125V9.625C27.125 7.875 25.725 6.475 24.025 6.475H17.975C16.225 6.475 14.875 7.875 14.875 9.625V12.25H7C5.225 12.25 3.815 13.65 3.815 15.45L3.5 33.075C3.5 34.875 4.9 36.25 6.7 36.25H35.3C37.1 36.25 38.5 34.875 38.5 33.075V15.45C38.5 13.65 37.1 12.25 35.3 12.25H35ZM16.625 9.625H25.375V12.25H16.625V9.625ZM21 28.7C19.5625 28.7 18.375 27.5 18.375 26.075C18.375 24.625 19.5625 23.475 21 23.475C22.425 23.475 23.625 24.625 23.625 26.075C23.625 27.5 22.425 28.7 21 28.7Z" fill="#0B2595" />
// //   </svg>
// // );

// // const IconOverdue = (
// //   <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
// //     <path
// //       d="M22.5151 5.25004L39.1856 34.125C39.3392 34.3911 39.42 34.6929 39.42 35C39.42 35.3072 39.3392 35.609 39.1856 35.875C39.032 36.1411 38.8111 36.362 38.545 36.5156C38.279 36.6692 37.9772 36.75 37.6701 36.75H4.32906C4.02187 36.75 3.7201 36.6692 3.45407 36.5156C3.18805 36.362 2.96714 36.1411 2.81355 35.875C2.65996 35.609 2.5791 35.3072 2.5791 35C2.5791 34.6929 2.65996 34.3911 2.81356 34.125L19.4841 5.25004C19.6377 4.98403 19.8586 4.76314 20.1246 4.60956C20.3906 4.45597 20.6924 4.37512 20.9996 4.37512C21.3067 4.37512 21.6085 4.45597 21.8745 4.60956C22.1405 4.76314 22.3615 4.98403 22.5151 5.25004ZM19.2496 28V31.5H22.7496V28H19.2496ZM19.2496 15.75V24.5H22.7496V15.75H19.2496Z"
// //       fill="#0B2595"
// //     />
// //   </svg>
// // );

// // // ---------- Reusable KPI Card ----------
// // function KpiCard({ title, icon, children, onClick }: KpiCardProps) {
// //   return (
// //     <article
// //       className="rounded-[30px] flex-shrink-0 transition-all duration-300 cursor-pointer"
// //       style={{
// //         width: 261,
// //         height: 380,
// //         border: "1px solid rgba(79, 107, 227, 0.00)",
// //         background: "#FFF",
// //         boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
// //       }}
// //       onClick={onClick}
// //     >
// //       <div
// //         className="h-full rounded-[20px] p-6 flex flex-col justify-between"
// //         style={{
// //           color: "#001433",
// //           fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
// //         }}
// //       >
// //         {/* Header */}
// //         <header className="flex flex-col items-center gap-3 mt-2 text-center">
// //           <div style={{ width: 48, height: 48 }} className="flex-shrink-0">
// //             {icon}
// //           </div>
// //           <h3
// //             className="font-semibold"
// //             style={{ color: "#0F45A9", fontSize: 22, fontWeight: 700, letterSpacing: "-0.2px" }}
// //           >
// //             {title}
// //           </h3>
// //         </header>

// //         {/* Body */}
// //         <div className="px-2 text-center flex-1 flex flex-col justify-center" style={{ lineHeight: 1.35 }}>
// //           {children}
// //         </div>

// //         {/* Footer */}
// //         <div className="mt-2 text-right">
// //           <button
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               onClick?.();
// //             }}
// //             className="text-[#0F45A9] font-medium inline-block hover:underline focus:outline-none"
// //             style={{
// //               fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
// //               fontSize: "15px",
// //               fontWeight: 500,
// //             }}
// //           >
// //             View Details →
// //           </button>
// //         </div>
// //       </div>

// //       {/* Hover Effect */}
// //       <style jsx>{`
// //         article:hover {
// //           transform: translateY(-6px) scale(1.02);
// //           box-shadow: 6px 8px 12px rgba(0, 0, 0, 0.12);
// //           border: 0.7px solid #ff8f6b !important;
// //           z-index: 2;
// //         }
// //       `}</style>
// //     </article>
// //   );
// // }


// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ownerPglogo from "@/app/shared/assests/ownerPglogo.jpg";
// import { useGuestInfoStore } from "@/app/shared/store/guestInfoStore";
// import { useServiceRequestStore } from "@/app/shared/store/serviceRequestsStore";
// import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
// import { usePgInfoDocumentsStore } from "@/app/shared/store/docAndMediaStore";
// import { useAuth } from "@/hooks/context/AuthContext";

// // ---------- Types ----------
// interface FirstManagerProps {
//   name?: string;
// }

// interface KpiCardProps {
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   onClick?: () => void;
// }

// // ---------- Main Component ----------
// export default function FirstManager({ name }: FirstManagerProps) {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const USER_ID = user?.id;
//   const USER_ROLE = user?.roleId; 
//   const PG_INFO_ID = user?.pgInfoId;
  
 
//   const isManager = USER_ROLE === 3;
  
//   const displayName = name || user?.name || "Manager";

//   // Stores
//   const { guests, loading: guestsLoading, fetchGuests } = useGuestInfoStore();
//   const { requests, loading: requestsLoading, fetchRequests } = useServiceRequestStore();
//   const { pgInfoList, loading: pgLoading, fetchPgInfo } = usePgInfoStore();
//   const { media, loading: mediaLoading, fetchPgDocuments } = usePgInfoDocumentsStore();

//   // Selected PG
//   const [selectedPgId, setSelectedPgId] = useState<number | null>(null);
  
//   // PG Image
//   const [pgImage, setPgImage] = useState<string>("");

//   // Fetch PG info based on role
//   useEffect(() => {
//     if (!USER_ID) return;

//     if (isManager) {
//       fetchPgInfo({ id: Number(PG_INFO_ID) });
//     } 
//   }, [USER_ID, USER_ROLE, PG_INFO_ID, isManager]);

//   // Auto-select first PG for owners
//   useEffect(() => {
//     if (selectedPgId === null && isManager && pgInfoList.length > 0) {
//       setSelectedPgId(pgInfoList[0].id);
//     }
//   }, [pgInfoList, selectedPgId, isManager]);

//   // Fetch guests and requests when PG is selected
//   useEffect(() => {
//     if (selectedPgId) {
//       fetchGuests({ pg_info_id: selectedPgId });
//       fetchRequests({ pg_id: selectedPgId });
      
//       // Fetch PG documents/images
//       const selectedPg = pgInfoList.find(pg => pg.id === selectedPgId);
     
//       if (selectedPg?.pg_id) {
//         fetchPgDocuments({ pg_id: selectedPg.pg_id });
//       }
//     }
//   }, [selectedPgId, fetchGuests, fetchRequests, fetchPgDocuments, pgInfoList]);
  
//   // Set PG image when media is fetched
//   useEffect(() => {
//     if (media.images.length > 0) {
//       setPgImage(media.images[0]);
//     } else {
//       setPgImage(""); // Reset to default if no images
//     }
//   }, [media]);

//   // Get current PG info
//   const currentPg = useMemo(() => {
//     if (!selectedPgId) return null;
//     return pgInfoList.find(pg => pg.id === selectedPgId);
//   }, [selectedPgId, pgInfoList]);

//   // Calculate today's check-ins
//   const todayCheckIns = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     return guests.filter(guest => {
//       if (!guest.checkin_time) return false;
//       const checkinDate = new Date(guest.checkin_time);
//       checkinDate.setHours(0, 0, 0, 0);
//       return checkinDate.getTime() === today.getTime();
//     }).length;
//   }, [guests]);

//   // Calculate today's check-outs
//   const todayCheckOuts = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     return guests.filter(guest => {
//       if (!guest.checkout_time) return false;
//       const checkoutDate = new Date(guest.checkout_time);
//       checkoutDate.setHours(0, 0, 0, 0);
//       return checkoutDate.getTime() === today.getTime();
//     }).length;
//   }, [guests]);

//   // Calculate open maintenance tickets
//   const openTickets = useMemo(() => {
//     return requests.filter(req => {
//       // Open tickets are those not resolved
//       const openStatuses = ['TicketRaised', 'TicketInProgress', 'TicketAssigned'];
//       return openStatuses.includes(req.status_code);
//     }).length;
//   }, [requests]);

//   // Calculate overdue tickets
//   const overdueTickets = useMemo(() => {
//     const now = new Date();
    
//     return requests.filter(req => {
//       if (!req.request_eta_date || req.status_code === 'TicketResolved') return false;
      
//       const etaDate = new Date(req.request_eta_date);
//       return etaDate < now;
//     }).length;
//   }, [requests]);

//   // Format today's date
//   const formattedDate = useMemo(() => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = String(today.getFullYear()).slice(-2);
//     return `${day}/${month}/${year}`;
//   }, []);

//   // PG details string
//   const pgDetails = useMemo(() => {
//     if (!currentPg) return "Loading PG details...";
    
//     const pgName = currentPg.pg_name || "N/A";
//     const address = currentPg.pg_address || "N/A";
//     const city = currentPg.pg_major_area || currentPg.city || "N/A";
    
    
//     // You can add room/bed count from a separate API if available
//     return `${pgName}, ${address}, ${city}`;
//   }, [currentPg]);

//   // Layout constants
//   const CARD_WIDTH = 261;
//   const MIN_GAP = 8; 
//   const SIDE_PADDING_MIN = 8;
//   const ARROW_SIZE = 36;

//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [visibleCount, setVisibleCount] = useState<number>(4);
//   const [startIndex, setStartIndex] = useState<number>(0);
//   const [cardGap, setCardGap] = useState<number>(16);
//   const [sidePadding, setSidePadding] = useState<number>(SIDE_PADDING_MIN);
//   const [arrowOffset, setArrowOffset] = useState<number>(12);
//   const [justifyContent, setJustifyContent] = useState<"center" | "space-between">("center");

//   // Loading state
//   const isLoading = guestsLoading || requestsLoading || pgLoading || mediaLoading;

//   // Cards array
//   const cards = useMemo(() => [
//     <KpiCard 
//       key="checkin" 
//       title="Today's Check-in" 
//       icon={IconCheckIn}
     
//     >
//       {isLoading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <p style={{ fontSize: 20, color: "#000" }}>
//           <span style={{ fontWeight: 800, fontSize: 28 }}>{todayCheckIns}</span> scheduled today<br /> {formattedDate}
//         </p>
//       )}
//     </KpiCard>,
//     <KpiCard 
//       key="checkout" 
//       title="Today's Check-out" 
//       icon={IconCheckOut}
     
//     >
//       {isLoading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <p style={{ fontSize: 20, color: "#000" }}>
//           <span style={{ fontWeight: 800, fontSize: 28 }}>{todayCheckOuts}</span> scheduled today<br /> {formattedDate}
//         </p>
//       )}
//     </KpiCard>,
//     <KpiCard 
//       key="tickets" 
//       title="Maintenance Tickets" 
//       icon={IconMaintenance} 
      
//     >
//       {isLoading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <p style={{ fontSize: 20, color: "#000" }}>
//           <span style={{ fontWeight: 800, fontSize: 28 }}>{openTickets}</span> Open Tickets
//         </p>
//       )}
//     </KpiCard>,
//     <KpiCard 
//       key="overdue" 
//       title="Overdue" 
//       icon={IconOverdue}
      
//     >
//       {isLoading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <p style={{ fontSize: 20, color: "#000" }}>
//           <span style={{ fontWeight: 800, fontSize: 28 }}>{overdueTickets}</span> Overdues
//         </p>
//       )}
//     </KpiCard>,
//   ], [todayCheckIns, todayCheckOuts, openTickets, overdueTickets, formattedDate, isLoading, navigate]);

//   // Compute layout & arrow positions
//   const recomputeLayout = () => {
//     const wrapper = wrapperRef.current;
//     const container = containerRef.current;
//     if (!wrapper || !container) return;

//     const wrapperWidth = wrapper.clientWidth;
//     const available = Math.max(0, wrapperWidth - SIDE_PADDING_MIN * 2);

//     // How many full cards fit
//     let maxCount = Math.floor((available + MIN_GAP) / (CARD_WIDTH + MIN_GAP));
//     maxCount = Math.max(1, Math.min(maxCount, cards.length));

//     const totalCardWidth = maxCount * CARD_WIDTH;
//     const remaining = Math.max(0, wrapperWidth - totalCardWidth);

//     const gapsCount = Math.max(0, maxCount - 1);
//     const preferredSidePadding = SIDE_PADDING_MIN;

//     let computedGap;
//     if (gapsCount > 0) {
//       computedGap = Math.floor((remaining - preferredSidePadding * 2) / gapsCount);
//       computedGap = Math.max(MIN_GAP, computedGap);
//       const MAX_GAP = 250;
//       computedGap = Math.min(computedGap, MAX_GAP);
//     } else {
//       computedGap = Math.max(MIN_GAP, remaining / 2);
//     }

//     if (!isFinite(computedGap) || computedGap <= 0) computedGap = MIN_GAP;

//     setVisibleCount(maxCount);
//     setCardGap(Math.round(computedGap));
//     setSidePadding(preferredSidePadding);

//     const offset = Math.max(8, SIDE_PADDING_MIN);
//     setArrowOffset(Math.round(offset));
    
//     if (wrapperWidth >= 1700) {
//       setJustifyContent("space-between");
//     } else {
//       setJustifyContent("center");
//     }

//     setStartIndex((s) => Math.min(s, Math.max(0, cards.length - maxCount)));
//   };

//   useEffect(() => {
//     recomputeLayout();
//     const ro = new ResizeObserver(recomputeLayout);
//     if (wrapperRef.current) ro.observe(wrapperRef.current);
//     window.addEventListener("resize", recomputeLayout);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", recomputeLayout);
//     };
//   }, [cards.length]);

//   // Navigation: single-step
//   const canGoLeft = startIndex > 0;
//   const canGoRight = startIndex + visibleCount < cards.length;
//   const goLeft = () => setStartIndex((s) => Math.max(0, s - 1));
//   const goRight = () => setStartIndex((s) => Math.min(cards.length - visibleCount, s + 1));

//   return (
//     <div className="w-full p-4">
//       <header className="mb-6">
//         {/* Title + Logo */}
//         <div className="flex items-center gap-3">
//           <h1
//             className="font-extrabold text-black"
//             style={{ fontSize: "clamp(1rem, 2.6vw, 1.6rem)" }}
//           >
//             {`${displayName}'s Dashboard`}
//           </h1>
          
//           <img
//             src={pgImage || ownerPglogo}
//             alt="PG Logo"
//              className="h-10 w-10 object-cover rounded-lg border border-gray-200"
//             onError={(e) => {
//               e.currentTarget.src = ownerPglogo;
//             }}
//           />
//         </div>
        
//         <div
//           className="mt-2 text-[#615F5F] font-extrabold truncate max-w-full"
//           style={{ fontSize: "clamp(0.78rem, 1.6vw, 1rem)", fontFamily: "Poppins, sans-serif" }}
//         >
//           {pgDetails}
//         </div>
//       </header>

//       <section className="flex justify-center relative">
//         <div
//           className="w-full max-w-[1260px] 2xl:max-w-[2500px] mx-auto relative"
//           ref={wrapperRef}
//         >
//           <div
//             ref={containerRef}
//             style={{
//               overflowX: "hidden",
//               overflowY: "visible",
//               padding: `calc(0.5rem + 12px) ${sidePadding}px`,
//             }}
//           >
//             <div
//               aria-live="polite"
//               className="flex items-start"
//               style={{
//                 gap: `${cardGap}px`,
//                 justifyContent: justifyContent,
//                 transition: "gap 160ms linear",
//                 width: "100%",
//                 boxSizing: "border-box",
//               }}
//             >
//               {cards
//                 .slice(startIndex, startIndex + visibleCount)
//                 .map((card, idx) => (
//                   <div key={`card-${startIndex + idx}`}>{card}</div>
//                 ))}
//             </div>
//           </div>

//           {/* Left Arrow */}
//           <button
//             aria-label="Previous card"
//             onClick={goLeft}
//             disabled={!canGoLeft}
//             style={{
//               position: "absolute",
//               left: `${arrowOffset}px`,
//               top: "50%",
//               transform: "translate(-80%, -50%)",
//               zIndex: 30,
//               display: canGoLeft ? "flex" : "none",
//               alignItems: "center",
//               justifyContent: "center",
//               width: ARROW_SIZE,
//               height: ARROW_SIZE,
//               borderRadius: 9999,
//               background: "white",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//               border: "none",
//               color: "#0B2595",
//               cursor: "pointer",
//             }}
//           >
//             <ChevronLeft size={18} />
//           </button>

//           {/* Right Arrow */}
//           <button
//             aria-label="Next card"
//             onClick={goRight}
//             disabled={!canGoRight}
//             style={{
//               position: "absolute",
//               right: `${arrowOffset}px`,
//               top: "50%",
//               transform: "translate(80%, -50%)",
//               zIndex: 30,
//               display: canGoRight ? "flex" : "none",
//               alignItems: "center",
//               justifyContent: "center",
//               width: ARROW_SIZE,
//               height: ARROW_SIZE,
//               borderRadius: 9999,
//               background: "white",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//               border: "none",
//               color: "#0B2595",
//               cursor: "pointer",
//             }}
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }

// // ---------- Icons ----------
// const IconCheckIn = (
//   <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
//     <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
//     <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
//     <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
//     <path d="M17 14h-6m0 0l2-2m-2 2l2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const IconCheckOut = (
//   <svg viewBox="0 0 24 24" width="42" height="42" fill="none" aria-hidden="true">
//     <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#0B2595" strokeWidth="1.8" />
//     <path d="M3 9h18" stroke="#0B2595" strokeWidth="1.8" />
//     <path d="M8 3v3M16 3v3" stroke="#0B2595" strokeWidth="1.8" strokeLinecap="round" />
//     <path d="M11 14h6m0 0l-2-2m2 2l-2 2" stroke="#0B2595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const IconMaintenance = (
//   <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
//     <path d="M35 12.25H27.125V9.625C27.125 7.875 25.725 6.475 24.025 6.475H17.975C16.225 6.475 14.875 7.875 14.875 9.625V12.25H7C5.225 12.25 3.815 13.65 3.815 15.45L3.5 33.075C3.5 34.875 4.9 36.25 6.7 36.25H35.3C37.1 36.25 38.5 34.875 38.5 33.075V15.45C38.5 13.65 37.1 12.25 35.3 12.25H35ZM16.625 9.625H25.375V12.25H16.625V9.625ZM21 28.7C19.5625 28.7 18.375 27.5 18.375 26.075C18.375 24.625 19.5625 23.475 21 23.475C22.425 23.475 23.625 24.625 23.625 26.075C23.625 27.5 22.425 28.7 21 28.7Z" fill="#0B2595" />
//   </svg>
// );

// const IconOverdue = (
//   <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
//     <path
//       d="M22.5151 5.25004L39.1856 34.125C39.3392 34.3911 39.42 34.6929 39.42 35C39.42 35.3072 39.3392 35.609 39.1856 35.875C39.032 36.1411 38.8111 36.362 38.545 36.5156C38.279 36.6692 37.9772 36.75 37.6701 36.75H4.32906C4.02187 36.75 3.7201 36.6692 3.45407 36.5156C3.18805 36.362 2.96714 36.1411 2.81355 35.875C2.65996 35.609 2.5791 35.3072 2.5791 35C2.5791 34.6929 2.65996 34.3911 2.81356 34.125L19.4841 5.25004C19.6377 4.98403 19.8586 4.76314 20.1246 4.60956C20.3906 4.45597 20.6924 4.37512 20.9996 4.37512C21.3067 4.37512 21.6085 4.45597 21.8745 4.60956C22.1405 4.76314 22.3615 4.98403 22.5151 5.25004ZM19.2496 28V31.5H22.7496V28H19.2496ZM19.2496 15.75V24.5H22.7496V15.75H19.2496Z"
//       fill="#0B2595"
//     />
//   </svg>
// );

// // ---------- Reusable KPI Card ----------
// function KpiCard({ title, icon, children, onClick }: KpiCardProps) {
//   return (
//     <article
//       className="rounded-[30px] flex-shrink-0 transition-all duration-300 cursor-pointer"
//       style={{
//         width: 261,
//         height: 380,
//         border: "1px solid rgba(79, 107, 227, 0.00)",
//         background: "#FFF",
//         boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
//       }}
//       onClick={onClick}
//     >
//       <div
//         className="h-full rounded-[20px] p-6 flex flex-col justify-between"
//         style={{
//           color: "#001433",
//           fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
//         }}
//       >
//         {/* Header */}
//         <header className="flex flex-col items-center gap-3 mt-2 text-center">
//           <div style={{ width: 48, height: 48 }} className="flex-shrink-0">
//             {icon}
//           </div>
//           <h3
//             className="font-semibold"
//             style={{ color: "#0F45A9", fontSize: 22, fontWeight: 700, letterSpacing: "-0.2px" }}
//           >
//             {title}
//           </h3>
//         </header>

//         {/* Body */}
//         <div className="px-2 text-center flex-1 flex flex-col justify-center" style={{ lineHeight: 1.35 }}>
//           {children}
//         </div>

   
       
//       </div>

//       {/* Hover Effect */}
//       <style jsx>{`
//         article:hover {
//           transform: translateY(-6px) scale(1.02);
//           box-shadow: 6px 8px 12px rgba(0, 0, 0, 0.12);
//           border: 0.7px solid #ff8f6b !important;
//           z-index: 2;
//         }
//       `}</style>
//     </article>
//   );
// }