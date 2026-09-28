// // import React, { useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// // import { Badge } from "../../../shared/ui/badge";
// // import { Button } from "../../../shared/ui/button";
// // import { Mail, Phone, Building2, Calendar, AlertCircle, Plus, ChevronDown, ChevronUp } from "lucide-react";
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
// // import { Input } from "../../../shared/ui/input";
// // import { Label } from "../../../shared/ui/label";

// // interface Guest {
// //   id: number;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   pg: string;
// //   room: string;
// //   joinDate: string;
// //   monthlyRent: string;
// //   guestStatus: string;
// //   serviceTickets: number;
// //   emergencyContact: string;
// // }

// // const initialGuests: Guest[] = [
// //   {
// //     id: 1,
// //     name: "Rahul Sharma",
// //     email: "rahul.sharma@email.com",
// //     phone: "+91 98765 43230",
// //     pg: "Sunrise PG",
// //     room: "101",
// //     joinDate: "Jan 15, 2026",
// //     monthlyRent: "₹12,000",
// //     guestStatus: "active",
// //     serviceTickets: 2,
// //     emergencyContact: "+91 98765 00001",
// //   },
// //   {
// //     id: 2,
// //     name: "Priya Patel",
// //     email: "priya.patel@email.com",
// //     phone: "+91 98765 43231",
// //     pg: "Sunset Villa",
// //     room: "205",
// //     joinDate: "Dec 10, 2025",
// //     monthlyRent: "₹10,000",
// //     guestStatus: "active",
// //     serviceTickets: 0,
// //     emergencyContact: "+91 98765 00002",
// //   },
// //   {
// //     id: 3,
// //     name: "Amit Kumar",
// //     email: "amit.kumar@email.com",
// //     phone: "+91 98765 43232",
// //     pg: "Green Haven",
// //     room: "303",
// //     joinDate: "Feb 1, 2026",
// //     monthlyRent: "₹15,000",
// //     guestStatus: "active",
// //     serviceTickets: 1,
// //     emergencyContact: "+91 98765 00003",
// //   },
// //   {
// //     id: 4,
// //     name: "Sneha Reddy",
// //     email: "sneha.reddy@email.com",
// //     phone: "+91 98765 43233",
// //     pg: "Blue Sky Residency",
// //     room: "402",
// //     joinDate: "Jan 20, 2026",
// //     monthlyRent: "₹13,000",
// //     guestStatus: "dormant",
// //     serviceTickets: 5,
// //     emergencyContact: "+91 98765 00004",
// //   },
// //   {
// //     id: 5,
// //     name: "Karan Verma",
// //     email: "karan.verma@email.com",
// //     phone: "+91 98765 43234",
// //     pg: "Sunrise PG",
// //     room: "105",
// //     joinDate: "Nov 5, 2025",
// //     monthlyRent: "₹12,000",
// //     guestStatus: "active",
// //     serviceTickets: 3,
// //     emergencyContact: "+91 98765 00005",
// //   },
// //   {
// //     id: 6,
// //     name: "Anjali Singh",
// //     email: "anjali.singh@email.com",
// //     phone: "+91 98765 43235",
// //     pg: "Green Haven",
// //     room: "201",
// //     joinDate: "Oct 12, 2025",
// //     monthlyRent: "₹15,000",
// //     guestStatus: "dormant",
// //     serviceTickets: 1,
// //     emergencyContact: "+91 98765 00006",
// //   },
// // ];

// // export function GuestsTable() {
// //   const [guests, setGuests] = useState<Guest[]>(initialGuests);
// //   const [addDialogOpen, setAddDialogOpen] = useState(false);
// //   const [expandedRows, setExpandedRows] = useState<number[]>([]);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     emergencyContact: "",
// //     pg: "",
// //     room: "",
// //     joinDate: "",
// //     monthlyRent: "",
// //     guestStatus: "",
// //     serviceTickets: "",
// //   });

// //   const handleToggleRow = (guestId: number) => {
// //     setExpandedRows((prev) =>
// //       prev.includes(guestId)
// //         ? prev.filter((id) => id !== guestId)
// //         : [...prev, guestId]
// //     );
// //   };

// //   const handleAddGuest = () => {
// //     setAddDialogOpen(true);
// //   };

// //   const handleFormChange = (field: string, value: string) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleSubmit = () => {
// //     if (!formData.name || !formData.email || !formData.phone) {
// //       alert("Please fill in all required fields");
// //       return;
// //     }

// //     const newGuest: Guest = {
// //       id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
// //       name: formData.name,
// //       email: formData.email,
// //       phone: formData.phone,
// //       emergencyContact: formData.emergencyContact || "N/A",
// //       pg: formData.pg || "N/A",
// //       room: formData.room || "N/A",
// //       joinDate: formData.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
// //       monthlyRent: formData.monthlyRent || "₹0",
// //       guestStatus: formData.guestStatus || "active",
// //       serviceTickets: parseInt(formData.serviceTickets) || 0,
// //     };

// //     setGuests((prev) => [...prev, newGuest]);
// //     setFormData({
// //       name: "",
// //       email: "",
// //       phone: "",
// //       emergencyContact: "",
// //       pg: "",
// //       room: "",
// //       joinDate: "",
// //       monthlyRent: "",
// //       guestStatus: "",
// //       serviceTickets: "",
// //     });
// //     setAddDialogOpen(false);
// //   };

// //   return (
// //     <div className="p-4 md:p-8">
// //       <div className="mb-6 md:mb-8">
// //         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Guests</h1>
// //         <p className="text-sm md:text-base text-gray-600 mt-2">Manage all guests information</p>
// //       </div>

// //       <Card className="border-gray-200">
// //         <CardHeader>
// //           <div className="flex items-center justify-between">
// //             <CardTitle>All Guests</CardTitle>
// //             <Button
// //               onClick={handleAddGuest}
// //               className="flex items-center gap-2"
// //             >
// //               <Plus className="w-4 h-4" />
// //               Add New Guest
// //             </Button>
// //           </div>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead>
// //                 <tr className="border-b border-gray-200">
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PG & Room</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Join Date</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Monthly Rent</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service Tickets</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Emergency</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {guests.map((guest) => [
// //                   <tr key={`guest-${guest.id}`} className="border-b border-gray-100 hover:bg-gray-50">
// //                     <td className="py-4 px-4">
// //                       <button
// //                         onClick={() => handleToggleRow(guest.id)}
// //                         className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
// //                       >
// //                         {expandedRows.includes(guest.id) ? (
// //                           <ChevronUp className="w-4 h-4" />
// //                         ) : (
// //                           <ChevronDown className="w-4 h-4" />
// //                         )}
// //                         {guest.name}
// //                       </button>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="space-y-1">
// //                         <div className="flex items-center gap-2 text-sm text-gray-600">
// //                           <Mail className="w-3 h-3" />
// //                           <span className="truncate max-w-[180px]">{guest.email}</span>
// //                         </div>
// //                         <div className="flex items-center gap-2 text-sm text-gray-600">
// //                           <Phone className="w-3 h-3" />
// //                           <span>{guest.phone}</span>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="flex items-center gap-2 text-sm text-gray-900">
// //                         <Building2 className="w-3 h-3 text-blue-600" />
// //                         <span>{guest.pg}</span>
// //                       </div>
// //                       <div className="text-sm text-gray-600 mt-1">Room {guest.room}</div>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="flex items-center gap-2 text-sm text-gray-600">
// //                         <Calendar className="w-3 h-3" />
// //                         <span>{guest.joinDate}</span>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4 text-gray-900 font-semibold">{guest.monthlyRent}</td>
// //                     <td className="py-4 px-4">
// //                       <div className="flex items-center gap-2">
// //                         <AlertCircle
// //                           className={`w-4 h-4 ${
// //                             guest.serviceTickets > 3 ? "text-red-600" : "text-gray-600"
// //                           }`}
// //                         />
// //                         <span
// //                           className={`font-semibold ${
// //                             guest.serviceTickets > 3 ? "text-red-600" : "text-gray-900"
// //                           }`}
// //                         >
// //                           {guest.serviceTickets}
// //                         </span>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="flex items-center gap-2 text-sm text-gray-600">
// //                         <Phone className="w-3 h-3" />
// //                         <span>{guest.emergencyContact}</span>
// //                       </div>
// //                     </td>
// //                   </tr>,
// //                   // Expanded Details Row
// //                   expandedRows.includes(guest.id) && (
// //                     <tr className="bg-blue-50/30 border-b border-gray-100">
// //                       <td colSpan={7} className="py-4 px-4">
// //                         <div className="max-w-4xl">
// //                           <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Full Name</p>
// //                               <p className="text-gray-900">{guest.name}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Email Address</p>
// //                               <p className="text-gray-900">{guest.email}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Phone Number</p>
// //                               <p className="text-gray-900">{guest.phone}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
// //                               <p className="text-gray-900">{guest.emergencyContact}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Property Name</p>
// //                               <p className="text-gray-900">{guest.pg}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Room Number</p>
// //                               <p className="text-gray-900">Room {guest.room}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Join Date</p>
// //                               <p className="text-gray-900">{guest.joinDate}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
// //                               <p className="text-gray-900">{guest.monthlyRent}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Guest Status</p>
// //                               <Badge
// //                                 variant={guest.guestStatus === "active" ? "default" : "secondary"}
// //                                 className={
// //                                   guest.guestStatus === "active"
// //                                     ? "bg-green-100 text-green-700 hover:bg-green-100"
// //                                     : "bg-orange-100 text-orange-700 hover:bg-orange-100"
// //                                 }
// //                               >
// //                                 {guest.guestStatus}
// //                               </Badge>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Service Tickets Count</p>
// //                               <p
// //                                 className={`font-semibold ${
// //                                   guest.serviceTickets > 3 ? "text-red-600" : "text-gray-900"
// //                                 }`}
// //                               >
// //                                 {guest.serviceTickets} tickets
// //                               </p>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ),
// //                 ])}
// //               </tbody>
// //             </table>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Add Dialog */}
// //       <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
// //         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
// //           <DialogHeader>
// //             <DialogTitle>Add New Guest</DialogTitle>
// //             <DialogDescription>
// //               Add a new guest to the system by filling out the form below.
// //             </DialogDescription>
// //           </DialogHeader>
// //           <div className="space-y-4 py-4">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name">Name</Label>
// //                 <Input id="name" placeholder="Enter name" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="email">Email</Label>
// //                 <Input id="email" type="email" placeholder="Enter email" value={formData.email} onChange={(e) => handleFormChange("email", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="phone">Phone</Label>
// //                 <Input id="phone" placeholder="Enter phone number" value={formData.phone} onChange={(e) => handleFormChange("phone", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="emergencyContact">Emergency Contact</Label>
// //                 <Input id="emergencyContact" placeholder="Enter emergency contact" value={formData.emergencyContact} onChange={(e) => handleFormChange("emergencyContact", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="pg">PG</Label>
// //                 <Input id="pg" placeholder="Enter PG name" value={formData.pg} onChange={(e) => handleFormChange("pg", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="room">Room</Label>
// //                 <Input id="room" placeholder="Enter room number" value={formData.room} onChange={(e) => handleFormChange("room", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="joinDate">Join Date</Label>
// //                 <Input id="joinDate" placeholder="e.g., Jan 15, 2026" value={formData.joinDate} onChange={(e) => handleFormChange("joinDate", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="monthlyRent">Monthly Rent</Label>
// //                 <Input id="monthlyRent" placeholder="e.g., ₹12,000" value={formData.monthlyRent} onChange={(e) => handleFormChange("monthlyRent", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="guestStatus">Guest Status</Label>
// //                 <Input id="guestStatus" placeholder="active/dormant" value={formData.guestStatus} onChange={(e) => handleFormChange("guestStatus", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="serviceTickets">Service Tickets</Label>
// //                 <Input id="serviceTickets" type="number" placeholder="Enter number" defaultValue="0" value={formData.serviceTickets} onChange={(e) => handleFormChange("serviceTickets", e.target.value)} />
// //               </div>
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
// //               Cancel
// //             </Button>
// //             <Button onClick={handleSubmit}>Add Guest</Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Badge } from "../../../shared/ui/badge";
// import { Button } from "../../../shared/ui/button";
// import { Mail, Phone, Building2, Calendar, Plus, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
// import { usePgUserStore } from "../../../shared/store/userDataStore";
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";
// import AddGuestModal from "../../owner/addGuest/AddGuest"; 

// export function GuestsTable() {
//   const { users, loading: usersLoading, fetchUsers } = usePgUserStore();
//   const { pgInfoList, fetchPgInfo } = usePgInfoStore();

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [expandedRows, setExpandedRows] = useState<number[]>([]);

//   // ── Fetch guests (user_role = 4) on mount ────────────────
//   useEffect(() => {
//     fetchUsers({ user_role: 4 });
//   }, []);

//   // ── Fetch PG info once guests are loaded (for name lookup) 
//   useEffect(() => {
//     if (users.length === 0) return;
//     fetchPgInfo();
//   }, [users]);

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

//   // Refetch after new guest is added
//   const handleModalClose = () => {
//     setAddModalOpen(false);
//     fetchUsers({ user_role: 4 });
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <div className="mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Guests</h1>
//         <p className="text-sm md:text-base text-gray-600 mt-2">Manage all guests information</p>
//       </div>

//       <Card className="border-gray-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Guests</CardTitle>
//             <Button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2">
//               <Plus className="w-4 h-4" />
//               Add New Guest
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {/* ── Loading ───────────────────────────────────────── */}
//           {usersLoading ? (
//             <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
//               <Loader2 className="w-5 h-5 animate-spin" />
//               <span>Loading guests...</span>
//             </div>

//           /* ── Empty ────────────────────────────────────────── */
//           ) : users.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//               <p className="text-base font-medium">No guests found</p>
//               <p className="text-sm mt-1">Click "Add New Guest" to get started.</p>
//             </div>

//           /* ── Table ────────────────────────────────────────── */
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PG</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gender</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">State</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((guest) => [
//                     // ── Main row ──────────────────────────────
//                     <tr
//                       key={`guest-${guest.id}`}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       {/* Name + expand toggle */}
//                       <td className="py-4 px-4">
//                         <button
//                           onClick={() => handleToggleRow(guest.id)}
//                           className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
//                         >
//                           {expandedRows.includes(guest.id)
//                             ? <ChevronUp className="w-4 h-4" />
//                             : <ChevronDown className="w-4 h-4" />
//                           }
//                           {guest.first_name} {guest.last_name}
//                         </button>
//                       </td>

//                       {/* Email + Phone */}
//                       <td className="py-4 px-4">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Mail className="w-3 h-3 shrink-0" />
//                             <span className="truncate max-w-[180px]">{guest.email_id}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Phone className="w-3 h-3 shrink-0" />
//                             <span>{guest.mobile_no}</span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* PG name resolved from pgInfoList */}
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-900">
//                           <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
//                           <span>{getPgName(guest.pg_info_id)}</span>
//                         </div>
//                       </td>

//                       {/* City */}
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <Calendar className="w-3 h-3 shrink-0" />
//                           <span className="capitalize">{guest.city}</span>
//                         </div>
//                       </td>

//                       {/* Gender */}
//                       <td className="py-4 px-4 text-sm text-gray-600">
//                         {guest.gender_type ?? "—"}
//                       </td>

//                       {/* Role badge */}
//                       <td className="py-4 px-4">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                           {guest.role ?? "Guest"}
//                         </span>
//                       </td>

//                       {/* State */}
//                       <td className="py-4 px-4 text-sm text-gray-600">
//                         {guest.name} ({guest.scode})
//                       </td>
//                     </tr>,

//                     // ── Expanded details row ───────────────────
//                     expandedRows.includes(guest.id) && (
//                       <tr
//                         key={`expanded-${guest.id}`}
//                         className="bg-blue-50/30 border-b border-gray-100"
//                       >
//                         <td colSpan={7} className="py-5 px-6">
//                           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
//                             Additional Details
//                           </h3>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Full Name</p>
//                               <p className="text-sm text-gray-900">
//                                 {guest.first_name} {guest.last_name}
//                               </p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Email</p>
//                               <p className="text-sm text-gray-900">{guest.email_id}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Mobile</p>
//                               <p className="text-sm text-gray-900">{guest.mobile_no}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Gender</p>
//                               <p className="text-sm text-gray-900">{guest.gender_type ?? "—"}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Permanent Address</p>
//                               <p className="text-sm text-gray-900">{guest.perm_address}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">City</p>
//                               <p className="text-sm text-gray-900 capitalize">{guest.city}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">State</p>
//                               <p className="text-sm text-gray-900">
//                                 {guest.name} ({guest.scode})
//                               </p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Pincode</p>
//                               <p className="text-sm text-gray-900">{guest.user_pincode}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">PG Managed</p>
//                               <p className="text-sm text-gray-900">{getPgName(guest.pg_info_id)}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Role</p>
//                               <p className="text-sm text-gray-900">{guest.role ?? "Guest"}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Login Count</p>
//                               <p className="text-sm text-gray-900">{guest.logincount}</p>
//                             </div>
//                             <div className="space-y-1">
//                               <p className="text-xs font-medium text-gray-500">Unique ID</p>
//                               <p className="text-sm text-gray-900 font-mono text-xs truncate max-w-[200px]">
//                                 {guest.user_unique_id}
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

      
//       <AddGuestModal
//         open={addModalOpen}
//         onClose={handleModalClose}
//         fetchAllPgs={true}
//       />
//     </div>
//   );
// }