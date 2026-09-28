


// import React, { useEffect, useState } from "react";
// import { addPgGuestInfo } from "@/app/shared/services/api/ownerApiServices";
// import { useUserDetailsStore } from "@/app/shared/store/pgUserDetailsStore";
// import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
// import { usePgGuestTypeStore } from "@/app/shared/store/guestTypeStore";
// import { usePgCurrentStatusStore } from "@/app/shared/store/currentStatusStore";
// import { useAuth } from "@/hooks/context/AuthContext";
// import SuccessModal from "@/ui/Shared/SuccessModal";
// import ProgressBar from "@/ui/Shared/ProgressBar";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   /**
//    * When true, loads ALL PGs from the database (admin view).
//    * When false/omitted, loads only PGs belonging to the logged-in owner (owner view).
//    * Default: false
//    */
//   fetchAllPgs?: boolean;
//   getGuestCountForPg?: (pgId: number) => Promise<number>;
// }

// const inputClass =
//   "w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none";
// const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
// const errorClass = "border-red-400 focus:ring-red-400";
// const errorTextClass = "text-xs text-red-500 mt-1";

// const MIN_GUEST_AGE = 18;

// const formatGuestPreference = (input: string) => {
//   if (!input || !input.trim()) return {};
//   try {
//     return JSON.parse(input);
//   } catch {
//     return { notes: input.trim() };
//   }
// };

// // Returns age in completed years as of today, given a "YYYY-MM-DD" date string
// const calculateAge = (dobString: string): number | null => {
//   if (!dobString) return null;
//   const dob = new Date(dobString);
//   if (isNaN(dob.getTime())) return null;

//   const today = new Date();
//   let age = today.getFullYear() - dob.getFullYear();
//   const monthDiff = today.getMonth() - dob.getMonth();
//   const dayDiff = today.getDate() - dob.getDate();

//   if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
//     age -= 1;
//   }
//   return age;
// };

// const isAdult = (dobString: string): boolean => {
//   const age = calculateAge(dobString);
//   return age !== null && age >= MIN_GUEST_AGE;
// };

// // Valid Indian mobile number: exactly 10 digits, starting with 6-9
// const isValidMobile = (mobile: string): boolean => /^[6-9]\d{9}$/.test(mobile.trim());

// // Max selectable DOB = today minus MIN_GUEST_AGE years, formatted as YYYY-MM-DD
// const getMaxDob = (): string => {
//   const d = new Date();
//   d.setFullYear(d.getFullYear() - MIN_GUEST_AGE);
//   return d.toISOString().split("T")[0];
// };

// const AddGuestModal = ({ open, onClose, fetchAllPgs = false, getGuestCountForPg }: Props) => {
//   const { user } = useAuth();
//   const PG_OWNER_ID = user?.id;

//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;

//   const { genders, fetchGenders } = useUserDetailsStore();
//   const { pgInfoList, fetchPgInfo } = usePgInfoStore();
//   const { guestTypes, fetchGuestTypes } = usePgGuestTypeStore();
//   const { statuses, fetchStatuses } = usePgCurrentStatusStore();

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     guest_dob: "",
//     mobile: "",
//     email: "",
//     address: "",
//     pg_info_id: "",
//     guest_type: "",
//     guest_status: "",
//     guest_preference: "",
//   });

//   const update = (key: string, value: any) =>
//     setForm((f) => ({ ...f, [key]: value }));

//   const resetForm = () => {
//     setForm({
//       firstName: "",
//       lastName: "",
//       gender: "",
//       guest_dob: "",
//       mobile: "",
//       email: "",
//       address: "",
//       pg_info_id: "",
//       guest_type: "",
//       guest_status: "",
//       guest_preference: "",
//     });
//     setCurrentStep(1);
//   };

//   const isEmpty = (value: any) => value === undefined || value === null || value === "";

//   const dobInvalid = !isEmpty(form.guest_dob) && !isAdult(form.guest_dob);
//   const mobileInvalid = !isEmpty(form.mobile) && !isValidMobile(form.mobile);

//   useEffect(() => {
//     if (!open) return;

//     fetchGenders();
//     fetchGuestTypes();
//     fetchStatuses();
//     resetForm();

//     // ── KEY FIX ──────────────────────────────────────────────
//     // Admin: fetch ALL PGs (no filter)
//     // Owner: fetch only their own PGs (filtered by pg_owner)
//     if (fetchAllPgs) {
//       fetchPgInfo();
//     } else {
//       fetchPgInfo({ pg_owner: PG_OWNER_ID });
//     }
//     // ─────────────────────────────────────────────────────────

//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);

//   const validateStep = (step: number): boolean => {
//     switch (step) {
//       case 1:
//         return (
//           !isEmpty(form.firstName) &&
//           !isEmpty(form.lastName) &&
//           !isEmpty(form.gender) &&
//           !isEmpty(form.guest_dob) &&
//           isAdult(form.guest_dob) &&
//           !isEmpty(form.mobile) &&
//           isValidMobile(form.mobile) &&
//           !isEmpty(form.email)
//         );
//       case 2:
//         return (
//           !isEmpty(form.address) &&
//           !isEmpty(form.pg_info_id) &&
//           !isEmpty(form.guest_type)
//         );
//       case 3:
//         return true;
//       default:
//         return false;
//     }
//   };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
//       return;
//     }
//     if (currentStep === 1 && !isEmpty(form.guest_dob) && !isAdult(form.guest_dob)) {
//       alert("Guest must be at least 18 years old.");
//       return;
//     }
//     if (currentStep === 1 && !isEmpty(form.mobile) && !isValidMobile(form.mobile)) {
//       alert("Please enter a valid 10-digit mobile number.");
//       return;
//     }
//     alert("Please fill all required fields before proceeding.");
//   };

//   const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentStep !== totalSteps || loading) return;
//     if (!isAdult(form.guest_dob)) {
//       alert("Guest must be at least 18 years old.");
//       return;
//     }
//     if (!isValidMobile(form.mobile)) {
//       alert("Please enter a valid 10-digit mobile number.");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (getGuestCountForPg && form.pg_info_id) {
//         try {
//           await getGuestCountForPg(Number(form.pg_info_id));
//         } catch {}
//       }

//       await addPgGuestInfo({
//         first_name: form.firstName,
//         last_name: form.lastName,
//         gender_id: Number(form.gender),
//         guest_dob: form.guest_dob,
//         mobile_no: form.mobile,
//         email_id: form.email,
//         address: form.address,
//         pg_id: Number(form.pg_info_id),
//         guest_type: Number(form.guest_type),
//         guest_status: Number(form.guest_status) || 1,
//         guest_preference: formatGuestPreference(form.guest_preference),
//       });

//       setSuccessOpen(true);
//     } catch (err) {
//       console.error("Add Guest failed", err);
//       alert("Failed to add guest. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuccessClose = () => {
//     setSuccessOpen(false);
//     onClose();
//   };

//   if (!open) return null;

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <section>
//             <h3 className="font-semibold text-gray-900 mb-4 text-base">Personal Information</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <label className={labelClass}>First Name *</label>
//                 <input
//                   className={`${inputClass} ${isEmpty(form.firstName) && errorClass}`}
//                   value={form.firstName}
//                   onChange={(e) => update("firstName", e.target.value)}
//                   placeholder="Enter first name"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Last Name *</label>
//                 <input
//                   className={`${inputClass} ${isEmpty(form.lastName) && errorClass}`}
//                   value={form.lastName}
//                   onChange={(e) => update("lastName", e.target.value)}
//                   placeholder="Enter last name"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Gender *</label>
//                 <select
//                   className={`${inputClass} ${isEmpty(form.gender) && errorClass}`}
//                   value={form.gender}
//                   onChange={(e) => update("gender", e.target.value)}
//                 >
//                   <option value="">Select Gender</option>
//                   {genders.map((g: any) => (
//                     <option key={g.id} value={g.id}>{g.gender_type}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Date of Birth * (must be 18+)</label>
//                 <input
//                   type="date"
//                   max={getMaxDob()}
//                   className={`${inputClass} ${(isEmpty(form.guest_dob) || dobInvalid) && errorClass}`}
//                   value={form.guest_dob}
//                   onChange={(e) => update("guest_dob", e.target.value)}
//                 />
//                 {dobInvalid && (
//                   <p className={errorTextClass}>Guest must be at least 18 years old.</p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Mobile Number *</label>
//                 <input
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   className={`${inputClass} ${(isEmpty(form.mobile) || mobileInvalid) && errorClass}`}
//                   value={form.mobile}
//                   onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
//                   placeholder="10-digit mobile number"
//                 />
//                 {mobileInvalid && (
//                   <p className={errorTextClass}>Enter a valid 10-digit mobile number.</p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Email *</label>
//                 <input
//                   type="email"
//                   className={`${inputClass} ${isEmpty(form.email) && errorClass}`}
//                   value={form.email}
//                   onChange={(e) => update("email", e.target.value)}
//                   placeholder="Enter email address"
//                 />
//               </div>
//             </div>
//           </section>
//         );

//       case 2:
//         return (
//           <section>
//             <h3 className="font-semibold text-gray-900 mb-4 text-base">Address & Stay Details</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className={labelClass}>Address *</label>
//                 <textarea
//                   className={`${inputClass} ${isEmpty(form.address) && errorClass}`}
//                   rows={3}
//                   value={form.address}
//                   onChange={(e) => update("address", e.target.value)}
//                   placeholder="Enter address"
//                 />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className={labelClass}>PG Name *</label>
//                   <select
//                     className={`${inputClass} ${isEmpty(form.pg_info_id) && errorClass}`}
//                     value={form.pg_info_id}
//                     onChange={(e) => update("pg_info_id", e.target.value)}
//                   >
//                     <option value="">Select PG</option>
//                     {pgInfoList.map((pg: any) => (
//                       <option key={pg.id} value={pg.id}>{pg.pg_name}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Guest Type *</label>
//                   <select
//                     className={`${inputClass} ${isEmpty(form.guest_type) && errorClass}`}
//                     value={form.guest_type}
//                     onChange={(e) => update("guest_type", e.target.value)}
//                   >
//                     <option value="">Select Type</option>
//                     {guestTypes.map((type: any) => (
//                       <option key={type.id} value={type.id}>
//                         {type.guest_type.charAt(0).toUpperCase() +
//                           type.guest_type.slice(1).replace(/([A-Z])/g, " $1")}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Guest Status</label>
//                   <select
//                     className={inputClass}
//                     value={form.guest_status}
//                     onChange={(e) => update("guest_status", e.target.value)}
//                   >
//                     <option value="">Select Status</option>
//                     {statuses.map((status: any) => (
//                       <option key={status.id} value={status.id}>{status.status_code}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </section>
//         );

//       case 3:
//         return (
//           <section>
//             <h3 className="font-semibold text-gray-900 mb-4 text-base">Guest Preferences (Optional)</h3>
//             <div>
//               <label className={labelClass}>Preferences or Special Notes</label>
//               <textarea
//                 className={inputClass}
//                 rows={6}
//                 value={form.guest_preference}
//                 onChange={(e) => update("guest_preference", e.target.value)}
//                 placeholder='{"food": "vegetarian", "smoking": "no"} or "Prefers quiet room"'
//               />
//               <p className="text-xs text-gray-500 mt-1">You can enter preferences in JSON format or as plain text</p>
//             </div>
//           </section>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
//         <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
//           <form
//             onSubmit={(e) => e.preventDefault()}
//             className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col max-h-[95vh] sm:max-h-[90vh]"
//           >
//             <div className="sticky top-0 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b rounded-t-2xl z-10">
//               <div className="flex justify-between items-center mb-3 sm:mb-4">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Guest</h2>
//                 <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-700 transition-colors">×</button>
//               </div>
//               <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
//             </div>

//             <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
//               {renderStepContent()}
//             </div>

//             <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col sm:flex-row justify-between gap-3 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1}
//                 className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
//               >
//                 Previous
//               </button>
//               <div className="flex gap-3 order-1 sm:order-2">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="flex-1 sm:flex-none px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 {currentStep < totalSteps ? (
//                   <button
//                     type="button"
//                     onClick={handleNext}
//                     className="flex-1 sm:flex-none px-5 py-2 bg-[#605BFF] text-white rounded-lg hover:bg-[#4F4BD9] transition-colors font-medium"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     disabled={loading}
//                     className="flex-1 sm:flex-none px-5 py-2 bg-[#605BFF] text-white rounded-lg hover:bg-[#4F4BD9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                     onClick={handleSubmit}
//                   >
//                     {loading ? "Saving..." : "Add Guest"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         title="Guest Added Successfully"
//         message="Guest details have been saved."
//         onClose={handleSuccessClose}
//       />
//     </>
//   );
// };

// export default AddGuestModal;