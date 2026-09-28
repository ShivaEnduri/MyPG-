// // import React, { useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// // import { Button } from "../../../shared/ui/button";
// // import { Building2, Mail, Phone, MapPin, Plus, ChevronDown, ChevronUp } from "lucide-react";
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
// // import { Input } from "../../../shared/ui/input";
// // import { Label } from "../../../shared/ui/label";

// // interface Owner {
// //   id: number;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   address: string;
// //   pgsOwned: string[];
// //   totalRooms: number;
// //   joinDate: string;
// //   status: string;
// // }

// // const initialOwners: Owner[] = [
// //   {
// //     id: 1,
// //     name: "Rajesh Kumar",
// //     email: "rajesh.kumar@email.com",
// //     phone: "+91 98765 43210",
// //     address: "Koramangala, Bangalore",
// //     pgsOwned: ["Sunrise PG", "Sunset Villa"],
// //     totalRooms: 35,
// //     joinDate: "Jan 2024",
// //     status: "active",
// //   },
// //   {
// //     id: 2,
// //     name: "Priya Sharma",
// //     email: "priya.sharma@email.com",
// //     phone: "+91 98765 43211",
// //     address: "HSR Layout, Bangalore",
// //     pgsOwned: ["Green Haven"],
// //     totalRooms: 25,
// //     joinDate: "Mar 2024",
// //     status: "active",
// //   },
// //   {
// //     id: 3,
// //     name: "Amit Patel",
// //     email: "amit.patel@email.com",
// //     phone: "+91 98765 43212",
// //     address: "Whitefield, Bangalore",
// //     pgsOwned: ["Blue Sky Residency"],
// //     totalRooms: 30,
// //     joinDate: "Jun 2024",
// //     status: "active",
// //   },
// //   {
// //     id: 4,
// //     name: "Sneha Reddy",
// //     email: "sneha.reddy@email.com",
// //     phone: "+91 98765 43213",
// //     address: "Indiranagar, Bangalore",
// //     pgsOwned: ["Ocean View PG"],
// //     totalRooms: 20,
// //     joinDate: "Sep 2024",
// //     status: "active",
// //   },
// // ];

// // export function OwnersTable() {
// //   const [owners, setOwners] = useState<Owner[]>(initialOwners);
// //   const [addDialogOpen, setAddDialogOpen] = useState(false);
// //   const [expandedRows, setExpandedRows] = useState<number[]>([]);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     pgsOwned: "",
// //     totalRooms: "",
// //     joinDate: "",
// //     status: "",
// //   });

// //   const handleToggleRow = (ownerId: number) => {
// //     setExpandedRows((prev) =>
// //       prev.includes(ownerId)
// //         ? prev.filter((id) => id !== ownerId)
// //         : [...prev, ownerId]
// //     );
// //   };

// //   const handleAddOwner = () => {
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

// //     const newOwner: Owner = {
// //       id: owners.length > 0 ? Math.max(...owners.map(o => o.id)) + 1 : 1,
// //       name: formData.name,
// //       email: formData.email,
// //       phone: formData.phone,
// //       address: formData.address || "N/A",
// //       pgsOwned: formData.pgsOwned ? formData.pgsOwned.split(",").map(pg => pg.trim()) : [],
// //       totalRooms: parseInt(formData.totalRooms) || 0,
// //       joinDate: formData.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
// //       status: formData.status || "active",
// //     };

// //     setOwners((prev) => [...prev, newOwner]);
// //     setFormData({
// //       name: "",
// //       email: "",
// //       phone: "",
// //       address: "",
// //       pgsOwned: "",
// //       totalRooms: "",
// //       joinDate: "",
// //       status: "",
// //     });
// //     setAddDialogOpen(false);
// //   };

// //   return (
// //     <div className="p-4 md:p-8">
// //       <div className="mb-6 md:mb-8">
// //         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Owners</h1>
// //         <p className="text-sm md:text-base text-gray-600 mt-2">Manage property owners</p>
// //       </div>

// //       <Card className="border-gray-200">
// //         <CardHeader>
// //           <div className="flex items-center justify-between">
// //             <CardTitle>All Owners</CardTitle>
// //             <Button
// //               onClick={handleAddOwner}
// //               className="flex items-center gap-2"
// //             >
// //               <Plus className="w-4 h-4" />
// //               Add New Owner
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
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Address</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PGs Owned</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Rooms</th>
// //                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Join Date</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {owners.map((owner) => [
// //                   <tr key={`owner-${owner.id}`} className="border-b border-gray-100 hover:bg-gray-50">
// //                     <td className="py-4 px-4">
// //                       <button
// //                         onClick={() => handleToggleRow(owner.id)}
// //                         className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
// //                       >
// //                         {expandedRows.includes(owner.id) ? (
// //                           <ChevronUp className="w-4 h-4" />
// //                         ) : (
// //                           <ChevronDown className="w-4 h-4" />
// //                         )}
// //                         {owner.name}
// //                       </button>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="space-y-1">
// //                         <div className="flex items-center gap-2 text-sm text-gray-600">
// //                           <Mail className="w-3 h-3" />
// //                           <span>{owner.email}</span>
// //                         </div>
// //                         <div className="flex items-center gap-2 text-sm text-gray-600">
// //                           <Phone className="w-3 h-3" />
// //                           <span>{owner.phone}</span>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="flex items-center gap-2 text-sm text-gray-600">
// //                         <MapPin className="w-3 h-3" />
// //                         <span>{owner.address}</span>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4">
// //                       <div className="space-y-1">
// //                         {owner.pgsOwned.map((pg, idx) => (
// //                           <div key={`pg-${owner.id}-${idx}`} className="flex items-center gap-2 text-sm text-gray-900">
// //                             <Building2 className="w-3 h-3 text-blue-600" />
// //                             <span>{pg}</span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-4 text-gray-900 font-semibold">{owner.totalRooms}</td>
// //                     <td className="py-4 px-4 text-gray-600">{owner.joinDate}</td>
// //                   </tr>,
// //                   // Expanded Details Row
// //                   expandedRows.includes(owner.id) && (
// //                     <tr className="bg-blue-50/30 border-b border-gray-100">
// //                       <td colSpan={6} className="py-4 px-4">
// //                         <div className="max-w-4xl">
// //                           <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Full Name</p>
// //                               <p className="text-gray-900">{owner.name}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Email Address</p>
// //                               <p className="text-gray-900">{owner.email}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Phone Number</p>
// //                               <p className="text-gray-900">{owner.phone}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Current Address</p>
// //                               <p className="text-gray-900">{owner.address}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Properties Owned</p>
// //                               <p className="text-gray-900">{owner.pgsOwned.join(", ")}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Total Rooms</p>
// //                               <p className="text-gray-900">{owner.totalRooms} rooms</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Joining Date</p>
// //                               <p className="text-gray-900">{owner.joinDate}</p>
// //                             </div>
// //                             <div className="space-y-1">
// //                               <p className="text-sm font-medium text-gray-600">Account Status</p>
// //                               <p className="text-gray-900 capitalize">{owner.status}</p>
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
// //             <DialogTitle>Add New Owner</DialogTitle>
// //             <DialogDescription>Enter the details of the new owner.</DialogDescription>
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
// //                 <Label htmlFor="address">Address</Label>
// //                 <Input id="address" placeholder="Enter address" value={formData.address} onChange={(e) => handleFormChange("address", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="pgsOwned">PGs Owned</Label>
// //                 <Input id="pgsOwned" placeholder="Enter PG names (comma separated)" value={formData.pgsOwned} onChange={(e) => handleFormChange("pgsOwned", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="totalRooms">Total Rooms</Label>
// //                 <Input id="totalRooms" type="number" placeholder="Enter total rooms" value={formData.totalRooms} onChange={(e) => handleFormChange("totalRooms", e.target.value)} />
// //               </div>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="joinDate">Join Date</Label>
// //                 <Input id="joinDate" placeholder="e.g., Jan 2024" value={formData.joinDate} onChange={(e) => handleFormChange("joinDate", e.target.value)} />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="status">Status</Label>
// //                 <Input id="status" placeholder="active/inactive" value={formData.status} onChange={(e) => handleFormChange("status", e.target.value)} />
// //               </div>
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
// //               Cancel
// //             </Button>
// //             <Button onClick={handleSubmit}>Add Owner</Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Button } from "../../../shared/ui/button";
// import {
//   Mail, Phone, MapPin, Building2,
//   ChevronDown, ChevronUp, Loader2, Plus,
// } from "lucide-react";
// import { usePgUserStore } from "../../../shared/store/userDataStore";   
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";   
// import AddOwnerModal from "../addOwner/AddOwnerModal";                          

// /* ─────────────────────────────────────────────
//    Component
// ───────────────────────────────────────────── */

// export function OwnersTable() {
//   const { users, loading: usersLoading, fetchUsers } = usePgUserStore();
//   const { pgInfoList, loading: pgLoading, fetchPgInfo } = usePgInfoStore();

//   const [expandedRows, setExpandedRows] = useState<number[]>([]);
//   const [addOwnerOpen, setAddOwnerOpen] = useState(false);

//   /* ── Fetch on mount ── */
//   useEffect(() => {
//     fetchUsers({ user_role: 2 });
//     fetchPgInfo();
//   }, [fetchUsers, fetchPgInfo]);

//   /* ── Refresh after a new owner is created ── */
//   const handleOwnerAdded = () => {
//     fetchUsers({ user_role: 2 });
//   };

//   /* ── Get all PGs for a given owner by matching pg_owner === userId ── */
//   const getPgsForOwner = (userId: number) =>
//     pgInfoList.filter((pg) => Number(pg.pg_owner) === Number(userId));

//   const toggleRow = (id: number) =>
//     setExpandedRows((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const isLoading = usersLoading || pgLoading;

//   /* ─────────────────────────────────────────────
//      Render
//   ───────────────────────────────────────────── */

//   return (
//     <div className="p-4 md:p-8">
//       <div className="mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Owners</h1>
//         <p className="text-sm md:text-base text-gray-600 mt-2">
//           Manage property owners
//         </p>
//       </div>

//       {/* Add Owner Modal */}
//       <AddOwnerModal
//         open={addOwnerOpen}
//         onClose={() => setAddOwnerOpen(false)}
//         onSuccess={handleOwnerAdded}
//       />

//       <Card className="border-gray-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Owners</CardTitle>
//             <Button
//               size="icon"
//               title="Add New Owner"
//               onClick={() => setAddOwnerOpen(true)}
//             >
//               <Plus className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {/* Loading */}
//           {isLoading && (
//             <div className="flex items-center justify-center py-16 text-gray-500">
//               <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading owners…
//             </div>
//           )}

//           {/* Empty */}
//           {!isLoading && users.length === 0 && (
//             <div className="text-center py-16 text-gray-500">
//               No owners found. Click <strong>+</strong> to add one.
//             </div>
//           )}

//           {/* Table */}
//           {!isLoading && users.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PGs Owned</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((owner) => {
//                     const ownedPgs = getPgsForOwner(owner.id);
//                     const isExpanded = expandedRows.includes(owner.id);

//                     return (
//                       <React.Fragment key={owner.id}>
//                         {/* ── Main row ── */}
//                         <tr className="border-b border-gray-100 hover:bg-gray-50">

//                           {/* Name + expand */}
//                           <td className="py-4 px-4">
//                             <button
//                               onClick={() => toggleRow(owner.id)}
//                               className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
//                             >
//                               {isExpanded
//                                 ? <ChevronUp className="w-4 h-4" />
//                                 : <ChevronDown className="w-4 h-4" />}
//                               {owner.first_name} {owner.last_name}
//                             </button>
//                             <p className="text-xs text-gray-400 ml-6 mt-0.5">
//                               {owner.role}
//                             </p>
//                           </td>

//                           {/* Contact */}
//                           <td className="py-4 px-4">
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <Mail className="w-3 h-3 shrink-0" />
//                                 <span>{owner.email_id}</span>
//                               </div>
//                               <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <Phone className="w-3 h-3 shrink-0" />
//                                 <span>{owner.mobile_no}</span>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Location */}
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <MapPin className="w-3 h-3 shrink-0" />
//                               <span>
//                                 {owner.city}, {owner.name} ({owner.scode})
//                               </span>
//                             </div>
//                             {owner.perm_address && (
//                               <p className="text-xs text-gray-400 mt-0.5 ml-5 truncate max-w-[200px]">
//                                 {owner.perm_address}
//                               </p>
//                             )}
//                           </td>

//                           {/* PGs owned */}
//                           <td className="py-4 px-4">
//                             {ownedPgs.length === 0 ? (
//                               <span className="text-sm text-gray-400">—</span>
//                             ) : (
//                               <div className="space-y-1">
//                                 {ownedPgs.map((pg) => (
//                                   <div
//                                     key={pg.pg_id}
//                                     className="flex items-center gap-2 text-sm text-gray-900"
//                                   >
//                                     <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
//                                     <span>{pg.pg_name}</span>
//                                     <span className="text-xs text-gray-400 capitalize">
//                                       ({pg.category})
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </td>

//                           {/* Join date */}
//                           <td className="py-4 px-4 text-sm text-gray-600">
//                             {owner.user_create_time
//                               ? new Date(owner.user_create_time).toLocaleDateString("en-IN", {
//                                   month: "short",
//                                   year: "numeric",
//                                 })
//                               : "—"}
//                           </td>
//                         </tr>

//                         {/* ── Expanded detail row ── */}
//                         {isExpanded && (
//                           <tr className="bg-blue-50/30 border-b border-gray-100">
//                             <td colSpan={5} className="py-5 px-4">
//                               <div className="max-w-5xl">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                   Additional Details
//                                 </h3>

//                                 {/* Owner info grid */}
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                                   <Detail
//                                     label="Full Name"
//                                     value={`${owner.first_name} ${owner.last_name}`}
//                                   />
//                                   <Detail label="Email" value={owner.email_id} />
//                                   <Detail label="Mobile" value={owner.mobile_no} />
//                                   <Detail label="Role" value={owner.role} />
//                                   <Detail label="Unique ID" value={owner.user_unique_id} />
//                                   <Detail label="Login Count" value={String(owner.logincount ?? 0)} />
//                                   <Detail
//                                     label="Permanent Address"
//                                     value={owner.perm_address}
//                                   />
//                                   <Detail
//                                     label="City / State"
//                                     value={`${owner.city}, ${owner.name} (${owner.scode})`}
//                                   />
//                                   <Detail
//                                     label="Pincode"
//                                     value={String(owner.user_pincode ?? "—")}
//                                   />
//                                   <Detail
//                                     label="Account Created"
//                                     value={
//                                       owner.user_create_time
//                                         ? new Date(owner.user_create_time).toLocaleString("en-IN")
//                                         : "—"
//                                     }
//                                   />
//                                 </div>

//                                 {/* PG cards */}
//                                 {ownedPgs.length > 0 && (
//                                   <>
//                                     <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                                       Properties ({ownedPgs.length})
//                                     </h4>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                       {ownedPgs.map((pg) => (
//                                         <div
//                                           key={pg.pg_id}
//                                           className="bg-white border border-gray-200 rounded-lg p-4 space-y-1.5"
//                                         >
//                                           <div className="flex items-center justify-between">
//                                             <span className="font-medium text-gray-900 text-sm">
//                                               {pg.pg_name}
//                                             </span>
//                                             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
//                                               {pg.category}
//                                             </span>
//                                           </div>
//                                           <p className="text-xs text-gray-500 flex items-center gap-1">
//                                             <MapPin className="w-3 h-3 shrink-0" />
//                                             {pg.pg_major_area}, {pg.city}, {pg.name}
//                                           </p>
//                                           <p className="text-xs text-gray-500">
//                                             {pg.pg_type} · {pg.pg_desc}
//                                           </p>
//                                           <p className="text-xs text-gray-500 flex items-center gap-1">
//                                             <Phone className="w-3 h-3 shrink-0" />
//                                             {pg.pg_primary_contact_no}
//                                           </p>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    Helper
// ───────────────────────────────────────────── */

// function Detail({ label, value }: { label: string; value?: string | null }) {
//   return (
//     <div className="space-y-0.5">
//       <p className="text-xs font-medium text-gray-500">{label}</p>
//       <p className="text-sm text-gray-900">{value || "—"}</p>
//     </div>
//   );
// }