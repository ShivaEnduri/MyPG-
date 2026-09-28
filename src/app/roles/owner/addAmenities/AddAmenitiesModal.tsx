

// import AddAmenitiesForm from "./AddAmenitiesForm";
// import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";

// export default function AddAmenitiesModal({
//   open,
//   onClose,
//   staticAmenities,
//   onSubmit,
// }: any) {
//   const { selectedPgId } = useSelectedPgStore();

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
//       <div className="min-h-screen flex items-center justify-center p-4">
        
//         {/* MODAL CONTAINER */}
//         <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

//           {/* HEADER */}
//           <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
//             <h2 className="text-lg font-bold text-gray-900">
//               Add New Amenity
//             </h2>

//             <button
//               onClick={onClose}
//               className="text-2xl text-gray-400 hover:text-gray-700"
//             >
//               ×
//             </button>
//           </div>

//           {/* CONTENT */}
//           <div className="flex-1 overflow-y-auto px-6 py-6">
//             <AddAmenitiesForm
//               staticAmenities={staticAmenities}
//               onSubmit={(amenityId: string) => {
//                 if (!selectedPgId) return;

//                 onSubmit(selectedPgId, amenityId); // ✅ use global PG
//                 onClose(); // ✅ close after submit
//               }}
//             />
//           </div>

//           {/* FOOTER */}
//           <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3 rounded-b-2xl">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }