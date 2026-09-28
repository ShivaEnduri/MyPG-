// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Building2, Mail, Phone, MapPin, Plus, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
// import { Button } from "../../../shared/ui/button";
// import AddManagerModal from "../../manager/addManModal/AddManagerModal"; 
// import { usePgUserStore } from "../../../shared/store/userDataStore";
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";

// export function StaffTable() {
//   const { users, fetchUsers } = usePgUserStore();
//   const { pgInfoList, fetchPgInfo } = usePgInfoStore();

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [expandedRows, setExpandedRows] = useState<number[]>([]);
//   const [staff, setStaff] = useState<typeof users>([]);
//   const [staffLoading, setStaffLoading] = useState(false);

//   // ── Fetch co-managers / staff (user_role = 5) on mount ───
//   const fetchStaff = async () => {
//     setStaffLoading(true);
//     try {
//       await fetchUsers({ user_role: 5 });
//     } finally {
//       setStaffLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   // ── Sync local staff list from store, role 5 only ────────
//   useEffect(() => {
//     const filtered = users.filter((u) => u.user_role === 5);
//     setStaff(filtered);
//   }, [users]);

//   // ── Fetch PG info for name lookup once staff are ready ───
//   useEffect(() => {
//     if (staff.length === 0) return;
//     fetchPgInfo();
//   }, [staff]);

//   // ── Helper: resolve pg_info_id → pg_name ─────────────────
//   const getPgName = (pgInfoId: number | null): string => {
//     if (!pgInfoId) return "—";
//     const pg = pgInfoList.find(
//       (p) => p.pg_info_id === pgInfoId || (p as any).id === pgInfoId
//     );
//     return pg?.pg_name ?? `PG #${pgInfoId}`;
//   };

//   const handleToggleRow = (userId: number) => {
//     setExpandedRows((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   // Refetch after modal closes (new staff added)
//   const handleModalClose = () => {
//     setAddModalOpen(false);
//     fetchStaff();
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <div className="mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Staff Management</h1>
//         <p className="text-sm md:text-base text-gray-600 mt-2">Manage staff members across all properties</p>
//       </div>

//       <Card className="border-gray-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Staff</CardTitle>
//             <Button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2">
//               <Plus className="w-4 h-4" />
//               Add New Staff
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {/* ── Loading ───────────────────────────────────────── */}
//           {staffLoading ? (
//             <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
//               <Loader2 className="w-5 h-5 animate-spin" />
//               <span>Loading staff...</span>
//             </div>

//           /* ── Empty ────────────────────────────────────────── */
//           ) : staff.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//               <p className="text-base font-medium">No staff found</p>
//               <p className="text-sm mt-1">Click "Add New Staff" to get started.</p>
//             </div>

//           /* ── Table ────────────────────────────────────────── */
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PG Assigned</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gender</th>
                   
                   
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staff.map((member) => [
//                     // ── Main row ───────────────────────────────
//                     <tr
//                       key={`staff-${member.id}`}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       {/* Name + expand toggle */}
//                       <td className="py-4 px-4">
//                         <button
//                           onClick={() => handleToggleRow(member.id)}
//                           className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
//                         >
//                           {expandedRows.includes(member.id)
//                             ? <ChevronUp className="w-4 h-4" />
//                             : <ChevronDown className="w-4 h-4" />
//                           }
//                           {member.first_name} {member.last_name}
//                         </button>
//                       </td>

//                       {/* Email + Phone */}
//                       <td className="py-4 px-4">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Mail className="w-3 h-3 shrink-0" />
//                             <span className="truncate max-w-[180px]">{member.email_id}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Phone className="w-3 h-3 shrink-0" />
//                             <span>{member.mobile_no}</span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* City */}
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <MapPin className="w-3 h-3 shrink-0" />
//                           <span className="capitalize">{member.city}</span>
//                         </div>
//                       </td>

//                       {/* PG name resolved from pgInfoList */}
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-900">
//                           <Building2 className="w-3 h-3 text-purple-600 shrink-0" />
//                           <span>{getPgName(member.pg_info_id)}</span>
//                         </div>
//                       </td>

//                       {/* Gender */}
//                       <td className="py-4 px-4 text-sm text-gray-600">
//                         {member.gender_type ?? "—"}
//                       </td>

                    
                    
//                     </tr>,

//                     // ── Expanded details row ───────────────────
//                     expandedRows.includes(member.id) && (
//                       <tr
//                         key={`expanded-${member.id}`}
//                         className="bg-purple-50/30 border-b border-gray-100"
//                       >
//                         <td colSpan={7} className="py-5 px-6">
//                           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
//                             Staff Details
//                           </h3>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Full Name</p>
//                               <p className="text-sm text-gray-900">
//                                 {member.first_name} {member.last_name}
//                               </p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Email</p>
//                               <p className="text-sm text-gray-900">{member.email_id}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Mobile</p>
//                               <p className="text-sm text-gray-900">{member.mobile_no}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Gender</p>
//                               <p className="text-sm text-gray-900">{member.gender_type ?? "—"}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Permanent Address</p>
//                               <p className="text-sm text-gray-900">{member.perm_address}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">City</p>
//                               <p className="text-sm text-gray-900 capitalize">{member.city}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">State</p>
//                               <p className="text-sm text-gray-900">
//                                 {member.name} ({member.scode})
//                               </p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Pincode</p>
//                               <p className="text-sm text-gray-900">{member.user_pincode}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">PG Assigned</p>
//                               <p className="text-sm text-gray-900">{getPgName(member.pg_info_id)}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Role</p>
//                               <p className="text-sm text-gray-900">{member.role ?? "Co-Manager"}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Login Count</p>
//                               <p className="text-sm text-gray-900">{member.logincount}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Unique ID</p>
//                               <p className="text-sm text-gray-900 font-mono text-xs truncate max-w-[200px]">
//                                 {member.user_unique_id}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ),
//                   ])}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ✅ Reusing AddManagerModal for staff (user_role=5 is set inside the modal) */}
//       <AddManagerModal open={addModalOpen} onClose={handleModalClose} />
//     </div>
//   );
// }