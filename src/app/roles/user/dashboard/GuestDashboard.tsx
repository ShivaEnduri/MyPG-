// // GdashboardGuest.tsx
// import FirstGuest from "../actionCard/GuestOverviewCards";
// import GActionCard from "../actionCard/GuestActionCard";
// import GuestAnnouncements from "../../../shared/components/RecentActivity";
// import GuestCommunity from "../guestCommunity/GuestCommunity";
// import GuestFinancialSnapshot from "../financialStatus/guestFinancialSnapshot";
// import GuestMaintenance from "../../../shared/features/maintenance/AlertsDashboard";
// import GuestupcomingEvents from "../../../shared/components/Calender"

// // Import useAuth
// import { useAuth } from "@/hooks/context/AuthContext";

// export default function GuestDashboard() {
//   // Get the user object
//   const { user } = useAuth();

//   return (
//     <main className="min-h-screen bg-[#E7EFF7] p-6 lg:p-10 space-y-6 sm:space-y-10">
//       <FirstGuest name={user?.name ?? ""} />
//       <GActionCard />
//       <GuestFinancialSnapshot />
//       <GuestMaintenance />
//       <GuestupcomingEvents />
//       <GuestAnnouncements />
//       <GuestCommunity />
//     </main>
//   );
// }
