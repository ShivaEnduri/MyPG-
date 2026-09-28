// import React, { useEffect, useState } from "react";
// import { addPgGuestInfo } from "@pg/app/shared/services/api/ownerApiServices";
// import { usePgGuestTypeStore } from "@pg/app/shared/store/guestTypeStore";
// import { usePgBedInfoStore } from "@pg/app/shared/store/bedInfoStore";
// import { usePgCurrentStatusStore } from "@pg/app/shared/store/currentStatusStore";
// import SuccessModal from "@packages/ui/Shared/SuccessModal";

// interface Props {
//   open: boolean;
//   userId: number | null;
//   onClose: () => void;
// }

// const inputClass =
//   "w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none";
// const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
// const errorClass = "border-red-400 focus:ring-red-400";

// const formatGuestPreference = (input: string) => {
//   if (!input || !input.trim()) return {};

//   try {
//     // If user entered valid JSON
//     return JSON.parse(input);
//   } catch {
//     // Fallback: convert plain text into JSON
//     return {
//       notes: input.trim(),
//     };
//   }
// };


// const AddGuestDetailsModal = ({ open, userId, onClose }: Props) => {
//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);

//   // Zustand stores
//   const { guestTypes, fetchGuestTypes } = usePgGuestTypeStore();
//   const { bedInfoList, fetchBedInfo } = usePgBedInfoStore();
//   const { statuses, fetchStatuses } = usePgCurrentStatusStore();

//   const [form, setForm] = useState({
//     bed_info: "",
//     guest_dob: "",
//     guest_type: "",
//     emergency_contact_name: "",
//     emergency_contact_no: "",
//     security_deposit: "",
//     checkin_time: "",
//     checkout_time: "",
//     guest_status: "",
//     guest_preference: "",
//   });

//   // Fetch dropdown data when modal opens
//   useEffect(() => {
//     if (open) {
//       fetchGuestTypes();
//       fetchBedInfo({ pg_info_id: pgInfoId, bed_status: 4 });
//       fetchStatuses();
//       resetForm();
//     }
//   }, [open]);

//   const update = (key: string, value: any) =>
//     setForm((f) => ({ ...f, [key]: value }));

//   const resetForm = () => {
//     setForm({
//       bed_info: "",
//       guest_dob: "",
//       guest_type: "",
//       emergency_contact_name: "",
//       emergency_contact_no: "",
//       security_deposit: "",
//       checkin_time: "",
//       checkout_time: "",
//       guest_status: "",
//       guest_preference: "",
//     });
//   };

//   const isEmpty = (value: any) =>
//     value === undefined || value === null || value === "";

//   if (!open || !userId) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (loading) return;

//   setLoading(true);
//   try {
//     await addPgGuestInfo({
//       user_info: userId,
//       bed_info: Number(form.bed_info),
//       guest_dob: form.guest_dob,
//       guest_type: Number(form.guest_type),
//       emergency_contact_name: form.emergency_contact_name,
//       emergency_contact_no: form.emergency_contact_no,
//       security_deposit: Number(form.security_deposit),
//       checkin_time: form.checkin_time,
//       checkout_time: form.checkout_time || null,
//       guest_status: Number(form.guest_status) || 1,
//       guest_preference: formatGuestPreference(form.guest_preference),
//     });

//     setSuccessOpen(true);
//   } catch (err) {
//     console.error("Add Guest Details failed", err);
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <>
//       <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
//         <div className="min-h-screen flex items-center justify-center p-4">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
//           >
//             {/* HEADER */}
//             <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-bold">Guest Stay Details</h2>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="text-xl hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div className="flex-1 overflow-y-auto px-6 py-6">
//               <div className="space-y-8">
//                 {/* STAY INFORMATION */}
//                 <section>
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     Stay Information
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div>
//                       <label className={labelClass}>Bed *</label>
//                       <select
//                         className={`${inputClass} ${
//                           isEmpty(form.bed_info) && errorClass
//                         }`}
//                         value={form.bed_info}
//                         onChange={(e) => update("bed_info", e.target.value)}
//                       >
//                         <option value="">Select Bed</option>
//                         {bedInfoList.map((bed: any) => (
//                           <option key={bed.id} value={bed.id}>
//                             {bed.bed_number} - {bed.room_name} (
//                             {bed.status_code})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className={labelClass}>Date of Birth *</label>
//                       <input
//                         type="date"
//                         className={`${inputClass} ${
//                           isEmpty(form.guest_dob) && errorClass
//                         }`}
//                         value={form.guest_dob}
//                         onChange={(e) => update("guest_dob", e.target.value)}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Guest Type *</label>
//                       <select
//                         className={`${inputClass} ${
//                           isEmpty(form.guest_type) && errorClass
//                         }`}
//                         value={form.guest_type}
//                         onChange={(e) => update("guest_type", e.target.value)}
//                       >
//                         <option value="">Select Type</option>
//                         {guestTypes.map((type: any) => (
//                           <option key={type.id} value={type.id}>
//                             {type.guest_type.charAt(0).toUpperCase() +
//                               type.guest_type.slice(1).replace(/([A-Z])/g, " $1")}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </section>

//                 {/* EMERGENCY CONTACT */}
//                 <section>
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     Emergency Contact *
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelClass}>Contact Name *</label>
//                       <input
//                         className={`${inputClass} ${
//                           isEmpty(form.emergency_contact_name) && errorClass
//                         }`}
//                         value={form.emergency_contact_name}
//                         onChange={(e) =>
//                           update("emergency_contact_name", e.target.value)
//                         }
//                         placeholder="Full name"
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Contact Number *</label>
//                       <input
//                         type="tel"
//                         className={`${inputClass} ${
//                           isEmpty(form.emergency_contact_no) && errorClass
//                         }`}
//                         value={form.emergency_contact_no}
//                         onChange={(e) =>
//                           update("emergency_contact_no", e.target.value)
//                         }
//                         placeholder="Phone number"
//                       />
//                     </div>
//                   </div>
//                 </section>

//                 {/* PAYMENT & DATES */}
//                 <section>
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     Payment & Check-in Details
//                   </h3>
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div>
//                       <label className={labelClass}>Security Deposit *</label>
//                       <input
//                         type="number"
//                         className={`${inputClass} ${
//                           isEmpty(form.security_deposit) && errorClass
//                         }`}
//                         value={form.security_deposit}
//                         onChange={(e) =>
//                           update("security_deposit", e.target.value)
//                         }
//                         placeholder="Amount"
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Check-in Time *</label>
//                       <input
//                         type="datetime-local"
//                         className={`${inputClass} ${
//                           isEmpty(form.checkin_time) && errorClass
//                         }`}
//                         value={form.checkin_time}
//                         onChange={(e) => update("checkin_time", e.target.value)}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Check-out Time</label>
//                       <input
//                         type="datetime-local"
//                         className={inputClass}
//                         value={form.checkout_time}
//                         onChange={(e) =>
//                           update("checkout_time", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-3 gap-4 mt-4">
//                     <div>
//                       <label className={labelClass}>Guest Status</label>
//                       <select
//                         className={inputClass}
//                         value={form.guest_status}
//                         onChange={(e) =>
//                           update("guest_status", e.target.value)
//                         }
//                       >
//                         <option value="">Select Status</option>
//                         {statuses.map((status: any) => (
//                           <option key={status.id} value={status.id}>
//                             {status.status_code}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </section>

//                 {/* PREFERENCES */}
//                 <section>
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     Guest Preferences (Optional)
//                   </h3>
//                   <div>
//                     <label className={labelClass}>
//                       Enter any preferences in plain text or JSON (optional)

//                     </label>
//                     <textarea
//                       className={inputClass}
//                       rows={4}
//                       value={form.guest_preference}
//                       onChange={(e) =>
//                         update("guest_preference", e.target.value)
//                       }
//                       placeholder='{"food": "vegetarian", "smoking": "no"} or Prefers quiet room'
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       Enter preferences in JSON format or leave empty
//                     </p>
//                   </div>
//                 </section>
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-[#605BFF] text-white rounded-lg hover:bg-[#4F4BD9] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         title="Guest Details Added"
//         message="Guest stay details saved successfully"
//         onClose={onClose}
//       />
//     </>
//   );
// };

// export default AddGuestDetailsModal;