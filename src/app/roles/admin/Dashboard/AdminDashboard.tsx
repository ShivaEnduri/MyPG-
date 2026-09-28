// // src/pages/AdminDashboard.tsx
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Shield, UserCog, Home, Users, LucideIcon } from "lucide-react";
// import React from "react";
// import { PG_BASE } from "@packages/config/constants";
// interface DashboardItem {
//   label: string;
//   path: string;
//   icon: LucideIcon;
//   color: string;
// }

// export const AdminDashboard: React.FC = () => {
//   const dashboards: DashboardItem[] = [
//     {
//       label: "Owner Dashboard",
//       path: `${PG_BASE}/owner/dashboard`,
//       icon: Home,
//       color: "text-yellow-400",
//     },
//     {
//       label: "Manager Dashboard",
//       path: `${PG_BASE}/manager/dashboard`,
//       icon: UserCog,
//       color: "text-green-400",
//     },
//     {
//       label: "Guest Dashboard",
//       path: `${PG_BASE}/guest/dashboard`,
//       icon: Users,
//       color: "text-blue-400",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center py-16 px-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-center"
//       >
//         <div className="flex justify-center items-center mb-4">
//           <Shield className="w-10 h-10 text-indigo-400" />
//         </div>
//         <h1 className="text-4xl font-extrabold tracking-wide text-indigo-300">
//           Admin Control Panel
//         </h1>
//         <p className="mt-3 text-gray-300 text-lg">
//           Access and manage all dashboards with a single click.
//         </p>
//       </motion.div>

//       {/* Dashboard Links */}
//       <motion.ul
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl"
//       >
//         {dashboards.map((item, idx) => {
//           const Icon = item.icon;
//           return (
//             <motion.li
//               key={idx}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//               className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-indigo-400 transition-all duration-300"
//             >
//               <Link
//                 to={item.path}
//                 className="flex flex-col items-center justify-center p-6 text-center"
//               >
//                 <Icon className={`w-10 h-10 mb-3 ${item.color}`} />
//                 <span className="text-lg font-semibold hover:text-indigo-400 transition">
//                   {item.label}
//                 </span>
//               </Link>
//             </motion.li>
//           );
//         })}
//       </motion.ul>
//     </div>
//   );
// };

// export default AdminDashboard;


import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Users, UserCog, UserCheck } from "lucide-react";
import { GraphCard } from "../components/GraphCard";

const stats = [
  {
    title: "Owners",
    count: 12,
    icon: UserCog,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Managers",
    count: 8,
    icon: UserCheck,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Guests",
    count: 156,
    icon: Users,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const pgsAddedData = [
  { month: "Aug", count: 0 },
  { month: "Sep", count: 1 },
  { month: "Oct", count: 1 },
  { month: "Nov", count: 0 },
  { month: "Dec", count: 1 },
  { month: "Jan", count: 1 },
  { month: "Feb", count: 0 },
];

const ownersAddedData = [
  { month: "Aug", count: 1 },
  { month: "Sep", count: 2 },
  { month: "Oct", count: 1 },
  { month: "Nov", count: 1 },
  { month: "Dec", count: 2 },
  { month: "Jan", count: 3 },
  { month: "Feb", count: 2 },
];

const roomsAddedData = [
  { month: "Aug", count: 0 },
  { month: "Sep", count: 15 },
  { month: "Oct", count: 25 },
  { month: "Nov", count: 0 },
  { month: "Dec", count: 30 },
  { month: "Jan", count: 20 },
  { month: "Feb", count: 0 },
];

const revenueFlowData = [
  { month: "Aug", revenue: 15000 },
  { month: "Sep", revenue: 17500 },
  { month: "Oct", revenue: 19000 },
  { month: "Nov", revenue: 20500 },
  { month: "Dec", revenue: 22000 },
  { month: "Jan", revenue: 23500 },
  { month: "Feb", revenue: 25000 },
];

export function AdminDashboard() {
  return (
    <div className="p-4 md:p-8">
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, Admin</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Graphs - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Flow for RUFRENT */}
        <GraphCard
          title="Revenue Flow for RUFRENT"
          subtitle="Monthly revenue generated by RUFRENT"
          data={revenueFlowData}
          dataKey="revenue"
          xAxisKey="month"
          chartType="line"
          color="#8b5cf6"
          height={300}
          formatter={(value) => `₹${Number(value).toLocaleString()}`}
        />

        {/* Number of PGs Added */}
        <GraphCard
          title="Number of PGs Added"
          data={pgsAddedData}
          dataKey="count"
          xAxisKey="month"
          chartType="line"
          color="#3b82f6"
          height={300}
          formatter={(value) => `${value} PG(s)`}
        />

        {/* Number of Owners Added */}
        <GraphCard
          title="Number of Owners Added"
          data={ownersAddedData}
          dataKey="count"
          xAxisKey="month"
          chartType="line"
          color="#10b981"
          height={300}
          formatter={(value) => `${value} Owner(s)`}
        />

        {/* Number of Rooms Added */}
        <GraphCard
          title="Number of Rooms Added"
          data={roomsAddedData}
          dataKey="count"
          xAxisKey="month"
          chartType="line"
          color="#f59e0b"
          height={300}
          formatter={(value) => `${value} Room(s)`}
        />
      </div>
    </div>
  );
}