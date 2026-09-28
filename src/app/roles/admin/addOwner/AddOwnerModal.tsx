// import React, { useEffect, useRef, useState } from "react";
// import { addPgUser } from "../../../shared/services/api/ownerApiServices"; // adjust path
// import { usePgLocationStore } from "../../../shared/store/pgLocationStore"; // adjust path
// import { useUserDetailsStore } from "../../../shared/store/pgUserDetailsStore"; // adjust path
// import { generatePassword } from "../../../shared/utils/passwordGenerator"; // adjust path
// import SuccessModal from "@/ui/Shared/SuccessModal";
// import ProgressBar from "@/ui/Shared/ProgressBar";

// /* ─────────────────────────────────────────────
//    Types
// ───────────────────────────────────────────── */

// interface AddOwnerModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// interface OwnerForm {
//   firstName: string;
//   lastName: string;
//   gender: string;
//   mobile: string;
//   email: string;
//   permanentAddress: string;
//   state_id: string;
//   city_id: string;
//   pincode: string;
// }

// const INITIAL_FORM: OwnerForm = {
//   firstName: "",
//   lastName: "",
//   gender: "",
//   mobile: "",
//   email: "",
//   permanentAddress: "",
//   state_id: "",
//   city_id: "",
//   pincode: "",
// };

// /* ─────────────────────────────────────────────
//    Shared style tokens (same as AddGuestModal)
// ───────────────────────────────────────────── */
// const inputClass =
//   "w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none";
// const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
// const errorClass = "border-red-400 focus:ring-red-400";

// /* ─────────────────────────────────────────────
//    Component
// ───────────────────────────────────────────── */

// const AddOwnerModal = ({ open, onClose, onSuccess }: AddOwnerModalProps) => {
//   const [form, setForm] = useState<OwnerForm>(INITIAL_FORM);
//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [generatedPassword, setGeneratedPassword] = useState("");
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 2;

//   // Seed guard: prevent state→city effect from clearing city on initial load
//   const isSeeding = useRef(false);

//   const { states, cities, fetchStates, fetchCities, clearCities } = usePgLocationStore();
//   const { genders, fetchGenders } = useUserDetailsStore();

//   const update = (key: keyof OwnerForm, value: string) =>
//     setForm((f) => ({ ...f, [key]: value }));

//   const isEmpty = (v: any) => v === undefined || v === null || v === "";

//   /* ── Lifecycle ── */

//   useEffect(() => {
//     if (!open) {
//       setForm(INITIAL_FORM);
//       setCurrentStep(1);
//       setGeneratedPassword("");
//       document.body.style.overflow = "";
//       return;
//     }

//     fetchStates();
//     fetchGenders();
//     document.body.style.overflow = "hidden";
//   }, [open]);

//   // State → City cascade (skip on initial seed)
//   useEffect(() => {
//     if (isSeeding.current) {
//       isSeeding.current = false;
//       return;
//     }
//     if (!form.state_id) {
//       update("city_id", "");
//       clearCities();
//       return;
//     }
//     update("city_id", "");
//     fetchCities(Number(form.state_id));
//   }, [form.state_id]);

//   if (!open) return null;

//   /* ── Validation ── */

//   const isStep1Valid =
//     !isEmpty(form.firstName) &&
//     !isEmpty(form.lastName) &&
//     !isEmpty(form.gender) &&
//     !isEmpty(form.mobile) &&
//     !isEmpty(form.email);

//   const isStep2Valid =
//     !isEmpty(form.permanentAddress) &&
//     !isEmpty(form.state_id) &&
//     !isEmpty(form.city_id) &&
//     !isEmpty(form.pincode);

//   const canProceed = currentStep === 1 ? isStep1Valid : isStep2Valid;

//   const handleNext = () => {
//     if (!canProceed) {
//       alert("Please fill all required fields before proceeding.");
//       return;
//     }
//     setCurrentStep((p) => Math.min(p + 1, totalSteps));
//   };

//   const handlePrevious = () => setCurrentStep((p) => Math.max(p - 1, 1));

//   /* ── Submit ── */

//   const handleSubmit = async () => {
//     if (!isStep1Valid || !isStep2Valid) return;
//     setLoading(true);
//     try {
//       const password = generatePassword();
//       setGeneratedPassword(password);

//       await addPgUser({
//         first_name: form.firstName,
//         last_name: form.lastName,
//         user_gender: form.gender,
//         user_role: "2",                       // owner role
//         mobile_no: form.mobile,
//         email_id: form.email,
//         user_password: password,
//         user_create_time: new Date()
//           .toISOString()
//           .replace("T", " ")
//           .substring(0, 19),
//         perm_address: form.permanentAddress,
//         user_city: Number(form.city_id),
//         user_state: Number(form.state_id),
//         user_pincode: form.pincode,
//         user_unique_id: crypto.randomUUID(),
//         logincount: 0,
//       });

//       setSuccessOpen(true);
//       onSuccess?.();
//     } catch (err) {
//       console.error("Add Owner failed", err);
//       alert("Failed to add owner. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredCities = cities.filter(
//     (c: any) => Number(form.state_id) === c.state_id
//   );

//   /* ─────────────────────────────────────────────
//      Step renders
//   ───────────────────────────────────────────── */

//   const renderStep1 = () => (
//     <section>
//       <h3 className="font-semibold text-gray-900 mb-4 text-base">
//         Personal Information
//       </h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className={labelClass}>First Name *</label>
//           <input
//             className={`${inputClass} ${isEmpty(form.firstName) ? errorClass : ""}`}
//             value={form.firstName}
//             onChange={(e) => update("firstName", e.target.value)}
//             placeholder="Enter first name"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Last Name *</label>
//           <input
//             className={`${inputClass} ${isEmpty(form.lastName) ? errorClass : ""}`}
//             value={form.lastName}
//             onChange={(e) => update("lastName", e.target.value)}
//             placeholder="Enter last name"
//           />
//         </div>
//         <div>
//           <label className={labelClass}>Gender *</label>
//           <select
//             className={`${inputClass} ${isEmpty(form.gender) ? errorClass : ""}`}
//             value={form.gender}
//             onChange={(e) => update("gender", e.target.value)}
//           >
//             <option value="">Select Gender</option>
//             {genders.map((g: any) => (
//               <option key={g.id} value={g.id}>
//                 {g.gender_type}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className={labelClass}>Mobile Number *</label>
//           <input
//             type="tel"
//             className={`${inputClass} ${isEmpty(form.mobile) ? errorClass : ""}`}
//             value={form.mobile}
//             onChange={(e) => update("mobile", e.target.value)}
//             placeholder="Enter mobile number"
//           />
//         </div>
//         <div className="sm:col-span-2">
//           <label className={labelClass}>Email *</label>
//           <input
//             type="email"
//             className={`${inputClass} ${isEmpty(form.email) ? errorClass : ""}`}
//             value={form.email}
//             onChange={(e) => update("email", e.target.value)}
//             placeholder="Enter email address"
//           />
//         </div>
//       </div>
//     </section>
//   );

//   const renderStep2 = () => (
//     <section>
//       <h3 className="font-semibold text-gray-900 mb-4 text-base">
//         Address Details
//       </h3>
//       <div className="space-y-4">
//         <div>
//           <label className={labelClass}>Permanent Address *</label>
//           <textarea
//             className={`${inputClass} ${isEmpty(form.permanentAddress) ? errorClass : ""}`}
//             rows={3}
//             value={form.permanentAddress}
//             onChange={(e) => update("permanentAddress", e.target.value)}
//             placeholder="Enter complete address"
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <label className={labelClass}>State *</label>
//             <select
//               className={`${inputClass} ${isEmpty(form.state_id) ? errorClass : ""}`}
//               value={form.state_id}
//               onChange={(e) => update("state_id", e.target.value)}
//             >
//               <option value="">Select State</option>
//               {states.map((s: any) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className={labelClass}>City *</label>
//             <select
//               className={`${inputClass} ${isEmpty(form.city_id) ? errorClass : ""}`}
//               value={form.city_id}
//               onChange={(e) => update("city_id", e.target.value)}
//               disabled={!form.state_id}
//             >
//               <option value="">
//                 {form.state_id ? "Select City" : "Select State First"}
//               </option>
//               {filteredCities.map((c: any) => (
//                 <option key={c.id} value={c.id}>
//                   {c.city}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className={labelClass}>Pincode *</label>
//             <input
//               className={`${inputClass} ${isEmpty(form.pincode) ? errorClass : ""}`}
//               value={form.pincode}
//               onChange={(e) => update("pincode", e.target.value)}
//               placeholder="Enter pincode"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );

//   /* ─────────────────────────────────────────────
//      UI
//   ───────────────────────────────────────────── */

//   return (
//     <>
//       <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
//         <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
//           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">

//             {/* Header */}
//             <div className="sticky top-0 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b rounded-t-2xl z-10">
//               <div className="flex justify-between items-center mb-3 sm:mb-4">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//                   Add New Owner
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="text-2xl text-gray-400 hover:text-gray-700 transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//               <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
//               {currentStep === 1 ? renderStep1() : renderStep2()}
//             </div>

//             {/* Footer */}
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
//                     disabled={!canProceed}
//                     className="flex-1 sm:flex-none px-5 py-2 bg-[#605BFF] text-white rounded-lg hover:bg-[#4F4BD9] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={!isStep1Valid || !isStep2Valid || loading}
//                     className="flex-1 sm:flex-none px-5 py-2 bg-[#605BFF] text-white rounded-lg hover:bg-[#4F4BD9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                   >
//                     {loading ? "Saving..." : "Add Owner"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         title="Owner Added Successfully"
//         message={`Owner has been created. Auto-generated password: ${generatedPassword}`}
//         onClose={() => {
//           setSuccessOpen(false);
//           onClose();
//         }}
//       />
//     </>
//   );
// };

// export default AddOwnerModal;