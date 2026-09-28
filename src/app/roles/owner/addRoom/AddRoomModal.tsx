// import React, { useEffect, useState } from "react";
// import ProgressBar from "@/ui/Shared/ProgressBar";
// import SuccessModal from "@/ui/Shared/SuccessModal";

// /* ============================================================
//    TYPES
// ============================================================ */

// export interface RoomFormState {
//   room_name: string;
//   pg_info: string;
//   room_type: string;
//   bathroom_type: string;
//   floor_info: string;

//   has_tv: boolean;
//   has_ac: boolean;
//   has_balcony: boolean;
// }

// interface AddRoomModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;

//   editMode?: boolean;
//   editRoomId?: number;

//   initialValues?: Partial<RoomFormState>;
// }

// /* ============================================================
//    INITIAL STATE
// ============================================================ */

// const INITIAL_FORM: RoomFormState = {
//   room_name: "",

//   pg_info: "",

//   room_type: "",

//   bathroom_type: "",

//   floor_info: "",

//   has_tv: false,

//   has_ac: false,

//   has_balcony: false,
// };

// /* ============================================================
//    DUMMY DATA
// ============================================================ */

// const dummyPgList = [
//   {
//     id: 1,
//     pg_name: "Royal Residency",
//   },
//   {
//     id: 2,
//     pg_name: "Sunshine PG",
//   },
//   {
//     id: 3,
//     pg_name: "Elite Living",
//   },
// ];

// const dummyRoomTypes = [
//   {
//     id: 1,
//     name: "Single Sharing",
//   },
//   {
//     id: 2,
//     name: "Double Sharing",
//   },
//   {
//     id: 3,
//     name: "Triple Sharing",
//   },
//   {
//     id: 4,
//     name: "Dormitory",
//   },
// ];

// const dummyBathroomTypes = [
//   {
//     id: 1,
//     name: "Attached",
//   },
//   {
//     id: 2,
//     name: "Common",
//   },
// ];

// const dummyFloors = [
//   {
//     id: 1,
//     name: "Ground Floor",
//   },
//   {
//     id: 2,
//     name: "1st Floor",
//   },
//   {
//     id: 3,
//     name: "2nd Floor",
//   },
//   {
//     id: 4,
//     name: "3rd Floor",
//   },
//   {
//     id: 5,
//     name: "4th Floor",
//   },
// ];

// /* ============================================================
//    COMPONENT
// ============================================================ */

// const AddRoomModal: React.FC<AddRoomModalProps> = ({
//   open,
//   onClose,
//   onSuccess,

//   editMode = false,

//   editRoomId,

//   initialValues,
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);

//   const [loading, setLoading] = useState(false);

//   const [successOpen, setSuccessOpen] = useState(false);

//   const [form, setForm] =
//     useState<RoomFormState>(INITIAL_FORM);

//   /* ============================================================
//      EFFECTS
//   ============================================================ */

//   useEffect(() => {
//     if (!open) {
//       setCurrentStep(1);
//       setForm(INITIAL_FORM);
//       return;
//     }

//     if (editMode && initialValues) {
//       setForm({
//         ...INITIAL_FORM,
//         ...initialValues,
//       });
//     } else {
//       setForm(INITIAL_FORM);
//     }
//   }, [open, editMode, initialValues]);

//   if (!open) return null;

//   /* ============================================================
//      SHARED STYLES
//   ============================================================ */

//   const inputClass =
//     "w-full border border-blue-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none";

//   const labelClass =
//     "block mb-1 text-sm font-semibold text-gray-700";

//   const errorClass =
//     "border-red-400 focus:ring-red-400";

//   const isEmpty = (value: any) =>
//     value === undefined ||
//     value === null ||
//     value === "";

//   /* ============================================================
//      CHANGE HANDLERS
//   ============================================================ */

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     }));
//   };

//   /* ============================================================
//      VALIDATION
//   ============================================================ */

//   const isStep1Valid =
//     !!form.room_name &&
//     !!form.pg_info &&
//     !!form.room_type &&
//     !!form.floor_info;

//   const isStep2Valid =
//     !!form.bathroom_type;

//   const canProceed = () => {
//     if (currentStep === 1)
//       return isStep1Valid;

//     if (currentStep === 2)
//       return isStep2Valid;

//     return true;
//   };

//   /* ============================================================
//      STEP NAVIGATION
//   ============================================================ */

//  const handleNext = () => {
//     if (canProceed() && currentStep < 2) {
//         setCurrentStep((prev) => prev + 1);
//     }
// };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleFormSubmit = (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     if (currentStep < 2) {
//       handleNext();
//     }
//   };

//   /* ============================================================
//      SUBMIT
//   ============================================================ */

//   const handleSubmit = async () => {
//     if (!isStep1Valid || !isStep2Valid)
//       return;

//     setLoading(true);

//     try {
//       console.log("ROOM DATA");

//       console.log({
//         room_name: form.room_name,

//         pg_info: Number(form.pg_info),

//         room_type: Number(form.room_type),

//         bathroom_type: Number(
//           form.bathroom_type
//         ),

//         floor_info: Number(
//           form.floor_info
//         ),

//         has_tv: form.has_tv ? 1 : 0,

//         has_ac: form.has_ac ? 1 : 0,

//         has_balcony:
//           form.has_balcony ? 1 : 0,
//       });

//       await new Promise((resolve) =>
//         setTimeout(resolve, 1000)
//       );

//       setSuccessOpen(true);

//       setCurrentStep(1);

//       setForm(INITIAL_FORM);

     
//     } catch (err) {
//       console.error(err);

//       alert("Failed to save room.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================================================
//      STEP COMPONENTS
//      (Part 2 starts here)
//   ============================================================ */

//    const renderStep1 = () => (
//     <section className="space-y-6">
//       <h3 className="font-semibold text-gray-900 text-lg">
//         Basic Room Information
//       </h3>

//       {/* Room Name */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//       <div>
//         <label className={labelClass}>
//           Room Name *
//         </label>

//         <input
//           name="room_name"
//           value={form.room_name}
//           onChange={handleChange}
//           placeholder="Enter Room Name"
//           className={`${inputClass} ${
//             isEmpty(form.room_name)
//               ? errorClass
//               : ""
//           }`}
//         />
//       </div>
     
//       {/* PG */}

//       <div>
//         <label className={labelClass}>
//           Select PG *
//         </label>

//         <select
//           name="pg_info"
//           value={form.pg_info}
//           onChange={handleChange}
//           className={`${inputClass} ${
//             isEmpty(form.pg_info)
//               ? errorClass
//               : ""
//           }`}
//         >
//           <option value="">
//             Select PG
//           </option>

//           {dummyPgList.map((pg) => (
//             <option
//               key={pg.id}
//               value={pg.id}
//             >
//               {pg.pg_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Room Type */}

//       <div>
//         <label className={labelClass}>
//           Room Type *
//         </label>

//         <select
//           name="room_type"
//           value={form.room_type}
//           onChange={handleChange}
//           className={`${inputClass} ${
//             isEmpty(form.room_type)
//               ? errorClass
//               : ""
//           }`}
//         >
//           <option value="">
//             Select Room Type
//           </option>

//           {dummyRoomTypes.map(
//             (room) => (
//               <option
//                 key={room.id}
//                 value={room.id}
//               >
//                 {room.name}
//               </option>
//             )
//           )}
//         </select>
//       </div>

//       {/* Floor */}

//       <div>
//         <label className={labelClass}>
//           Floor *
//         </label>

//         <select
//           name="floor_info"
//           value={form.floor_info}
//           onChange={handleChange}
//           className={`${inputClass} ${
//             isEmpty(form.floor_info)
//               ? errorClass
//               : ""
//           }`}
//         >
//           <option value="">
//             Select Floor
//           </option>

//           {dummyFloors.map(
//             (floor) => (
//               <option
//                 key={floor.id}
//                 value={floor.id}
//               >
//                 {floor.name}
//               </option>
//             )
//           )}
//         </select>
//       </div>
//        </div>

//     </section>
//   );

//   /* ===================================================== */

//   const renderStep2 = () => (
//     <section className="space-y-6">
//       <h3 className="font-semibold text-gray-900 text-lg">
//         Room Configuration
//       </h3>

//       {/* Bathroom */}

//       <div>
//         <label className={labelClass}>
//           Bathroom Type *
//         </label>

//         <select
//           name="bathroom_type"
//           value={form.bathroom_type}
//           onChange={handleChange}
//           className={`${inputClass} ${
//             isEmpty(form.bathroom_type)
//               ? errorClass
//               : ""
//           }`}
//         >
//           <option value="">
//             Select Bathroom
//           </option>

//           {dummyBathroomTypes.map(
//             (bath) => (
//               <option
//                 key={bath.id}
//                 value={bath.id}
//               >
//                 {bath.name}
//               </option>
//             )
//           )}
//         </select>
//       </div>

//       {/* Amenities */}

//       <div className="grid md:grid-cols-3 gap-6">

//         <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition">

//           <input
//             type="checkbox"
//             name="has_tv"
//             checked={form.has_tv}
//             onChange={handleChange}
//             className="w-5 h-5"
//           />

//           <span className="font-medium">
//             TV Available
//           </span>

//         </label>

//         <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition">

//           <input
//             type="checkbox"
//             name="has_ac"
//             checked={form.has_ac}
//             onChange={handleChange}
//             className="w-5 h-5"
//           />

//           <span className="font-medium">
//             AC Available
//           </span>

//         </label>

//         <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition">

//           <input
//             type="checkbox"
//             name="has_balcony"
//             checked={form.has_balcony}
//             onChange={handleChange}
//             className="w-5 h-5"
//           />

//           <span className="font-medium">
//             Balcony
//           </span>

//         </label>

//       </div>
//     </section>
//   );

//   /* ===================================================== */

  

//     return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//         <form
//           onSubmit={handleFormSubmit}
//           className="w-full max-w-4xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
//         >
//           {/* ================= HEADER ================= */}

//           <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">

//             <h2 className="text-xl font-semibold text-gray-800">
//               {editMode
//                 ? "Edit Room"
//                 : "Add New Room"}
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="text-2xl text-gray-500 hover:text-gray-700"
//             >
//               ×
//             </button>

//           </div>

//           {/* ================= PROGRESS ================= */}

//           <ProgressBar
//             currentStep={currentStep}
//             totalSteps={2}
//           />

//           {/* ================= BODY ================= */}

//           <div className="px-6 py-8">

//             {currentStep === 1 &&
//               renderStep1()}

//             {currentStep === 2 &&
//               renderStep2()}

          
//           </div>

//           {/* ================= FOOTER ================= */}

//           <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-between">

//             <button
//               type="button"
//               onClick={handleBack}
//               disabled={currentStep === 1}
//               className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Back
//             </button>

//             <div className="flex gap-3">

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>

//               {currentStep < 2 ? (

//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   disabled={!canProceed()}
//                   className="bg-[#605BFF] text-white px-5 py-2 rounded-lg hover:bg-[#4f46e5] disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>

//               ) : (

//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={
//                     !isStep1Valid ||
//                     !isStep2Valid ||
//                     loading
//                   }
//                   className="bg-[#605BFF] text-white px-5 py-2 rounded-lg hover:bg-[#4f46e5] disabled:bg-gray-300 disabled:cursor-not-allowed"
//                 >
//                   {loading
//                     ? editMode
//                       ? "Saving..."
//                       : "Creating..."
//                     : editMode
//                     ? "Update Room"
//                     : "Create Room"}
//                 </button>

//               )}

//             </div>

//           </div>

//         </form>
//       </div>

//       {/* ================= SUCCESS MODAL ================= */}

//       <SuccessModal
//         open={successOpen}
//         title={
//           editMode
//             ? "Room Updated"
//             : "Room Created"
//         }
//         message={
//           editMode
//             ? "Room has been successfully updated."
//             : "Room has been successfully added."
//         }
//         onClose={() => {

//           setSuccessOpen(false);

//           onClose();
//            onSuccess?.();

//         }}
//       />

//     </>
//   );
// };

// export default AddRoomModal;