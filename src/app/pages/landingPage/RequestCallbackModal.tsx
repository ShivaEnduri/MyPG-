// import React, { useEffect, useState, ChangeEvent } from "react";
// import Modal from "../../shared/components/Modal"; 
// import { usePgLocationStore } from "../../shared/store/pgLocationStore";

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }



// const RequestCallbackModal: React.FC<Props> = ({ open, onClose }) => {
//   const {
//     states,
//     cities,
//     fetchStates,
//     fetchCities,
//     clearCities,
//   } = usePgLocationStore();

//   const [fullName, setFullName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [stateId, setStateId] = useState("");
//   const [cityId, setCityId] = useState("");
//   const [pgName, setPgName] = useState("");

//   // 🔥 Reset Form Function
//   const resetForm = () => {
//     setFullName("");
//     setMobile("");
//     setStateId("");
//     setCityId("");
//     setPgName("");
//     clearCities();
//   };

//   // Load states when modal opens
//   useEffect(() => {
//     if (open) {
//       fetchStates();
//     } else {
//       // 🔥 Reset when modal closes
//       resetForm();
//     }
//   }, [open]);

//   const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const selected = e.target.value;
//     setStateId(selected);
//     setCityId("");

//     if (selected) {
//       fetchCities(Number(selected));
//     } else {
//       clearCities();
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       fullName,
//       mobile,
//       stateId,
//       cityId,
//       pgName,
//     };

//     console.log("Callback Request Data:", payload);

//     //  Call API here

//     resetForm();  // clear after submission
//     onClose();
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={() => {
//         resetForm();  // ✅ clear on close click
//         onClose();
//       }}
//       title="Request Callback for PG Listing"
//       size="md"
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">

//         {/* Full Name */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             required
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
//           />
//         </div>

//         {/* Mobile */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             Mobile Number *
//           </label>
//           <input
//             type="tel"
//             required
//             pattern="[0-9]{10}"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
//           />
//         </div>

//         {/* State */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             PG State *
//           </label>
//           <select
//             required
//             value={stateId}
//             onChange={handleStateChange}
//             className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
//           >
//             <option value="">Select State</option>
//             {states?.map((state) => (
//               <option key={state.id} value={state.id}>
//                 {state.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* City */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             PG City *
//           </label>
//           <select
//             required
//             value={cityId}
//             onChange={(e) => setCityId(e.target.value)}
//             disabled={!stateId}
//             className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
//           >
//             <option value="">Select City</option>
//             {cities?.map((city) => (
//               <option key={city.id} value={city.id}>
//                 {city.city}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* PG Name */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             PG Name *
//           </label>
//           <input
//             type="text"
//             required
//             value={pgName}
//             onChange={(e) => setPgName(e.target.value)}
//             className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
//         >
//           Submit Request
//         </button>
//       </form>
//     </Modal>
//   );
// };

// export default RequestCallbackModal;