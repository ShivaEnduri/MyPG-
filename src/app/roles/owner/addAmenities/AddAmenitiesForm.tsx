

// import { useState } from "react";
// import { useSelectedPgStore } from "@/app/shared/store/selectedPgStore";
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";

// import { Label } from "../../../shared/ui/label";
// import { Button } from "../../../shared/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../shared/ui/select";

// import { PlusCircle } from "lucide-react";

// export default function AddAmenitiesForm({
//   staticAmenities,
//   onSubmit,
// }: any) {
//   const { selectedPgId } = useSelectedPgStore();
//   const { pgInfoList } = usePgInfoStore();

//   const [selectedAmenityId, setSelectedAmenityId] = useState("");

//   // ✅ Get selected PG details
//   const selectedPg = pgInfoList.find(
//     (pg: any) =>
//       pg.pg_info_id === selectedPgId || pg.id === selectedPgId
//   );

//   return (
//     <div className="space-y-4">

//       {/* ✅ LOCKED PG DROPDOWN */}
//       <div>
//         <Label>PG *</Label>

//         <Select value={String(selectedPgId)} disabled>
//           <SelectTrigger className="bg-gray-100 cursor-not-allowed">
//             <SelectValue>
//               {selectedPg
//                 ? `${selectedPg.pg_name} (${selectedPg.city || selectedPg.location || ""})`
//                 : "No PG selected"}
//             </SelectValue>
//           </SelectTrigger>

//           {/* Optional (not needed since disabled, but kept for consistency) */}
//           <SelectContent>
//             {selectedPg && (
//               <SelectItem value={String(selectedPgId)}>
//                 {selectedPg.pg_name}
//               </SelectItem>
//             )}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* ✅ Select Amenity */}
//       <div>
//         <Label>Amenity *</Label>
//         <Select
//           value={selectedAmenityId}
//           onValueChange={setSelectedAmenityId}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Choose an amenity" />
//           </SelectTrigger>
//           <SelectContent>
//             {staticAmenities.map((a: any) => (
//               <SelectItem key={a.id} value={String(a.id)}>
//                 {a.amenity_name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* ✅ Button */}
//       <Button
//         className="w-full"
//         disabled={!selectedPgId || !selectedAmenityId}
//         onClick={() => {
//           if (!selectedPgId) {
//             alert("Please select a PG from sidebar");
//             return;
//           }

//           if (!selectedAmenityId) {
//             alert("Please select an amenity");
//             return;
//           }

//           console.log("Submitting:", selectedPgId, selectedAmenityId);

//           onSubmit(selectedAmenityId); // modal will attach PG
//         }}
//       >
//         <PlusCircle className="w-4 h-4 mr-2" />
//         Add Amenity
//       </Button>
//     </div>
//   );
// }