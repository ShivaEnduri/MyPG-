// // import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// // import { Input } from "../../../shared/ui/input";
// // import { Label } from "../../../shared/ui/label";
// // import { Button } from "../../../shared/ui/button";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select";
// // import { Textarea } from "../../../shared/ui/textarea";
// // import { Badge } from "../../../shared/ui/badge";
// // import { Wifi, Tv, AirVent, Utensils, Dumbbell, Car } from "lucide-react";

// // const existingAmenities = [
// //   { name: "WiFi", icon: Wifi, pgs: ["Sunrise PG", "Sunset Villa", "Green Haven"] },
// //   { name: "TV", icon: Tv, pgs: ["Sunrise PG", "Blue Sky Residency"] },
// //   { name: "AC", icon: AirVent, pgs: ["All PGs"] },
// //   { name: "Meals", icon: Utensils, pgs: ["Sunrise PG", "Green Haven"] },
// //   { name: "Gym", icon: Dumbbell, pgs: ["Blue Sky Residency"] },
// //   { name: "Parking", icon: Car, pgs: ["All PGs"] },
// // ];

// // export function AddAmenitiesPage() {
// //   return (
// //     <div className="p-4 md:p-8">
// //       <div className="mb-6 md:mb-8">
// //         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Amenities</h1>
// //         <p className="text-sm md:text-base text-gray-600 mt-2">Add and manage amenities for your PGs</p>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
// //         {/* Add New Amenity Form */}
// //         <Card className="border-gray-200">
// //           <CardHeader>
// //             <CardTitle>Add New Amenity</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <form className="space-y-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="amenity-name">Amenity Name</Label>
// //                 <Input id="amenity-name" placeholder="e.g., Swimming Pool" />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="pg-select">Select PG</Label>
// //                 <Select>
// //                   <SelectTrigger id="pg-select">
// //                     <SelectValue placeholder="Choose a PG" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All PGs</SelectItem>
// //                     <SelectItem value="sunrise">Sunrise PG</SelectItem>
// //                     <SelectItem value="sunset">Sunset Villa</SelectItem>
// //                     <SelectItem value="green">Green Haven</SelectItem>
// //                     <SelectItem value="blue">Blue Sky Residency</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="description">Description (Optional)</Label>
// //                 <Textarea
// //                   id="description"
// //                   placeholder="Add details about this amenity..."
// //                   rows={3}
// //                 />
// //               </div>

// //               <Button type="submit" className="w-full">
// //                 Add Amenity
// //               </Button>
// //             </form>
// //           </CardContent>
// //         </Card>

// //         {/* Existing Amenities */}
// //         <Card className="border-gray-200">
// //           <CardHeader>
// //             <CardTitle>Existing Amenities</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="space-y-4">
// //               {existingAmenities.map((amenity, index) => {
// //                 const Icon = amenity.icon;
// //                 return (
// //                   <div
// //                     key={index}
// //                     className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
// //                   >
// //                     <div className="p-2 bg-blue-50 rounded-lg">
// //                       <Icon className="w-5 h-5 text-blue-600" />
// //                     </div>
// //                     <div className="flex-1">
// //                       <h4 className="font-semibold text-gray-900 mb-2">{amenity.name}</h4>
// //                       <div className="flex flex-wrap gap-2">
// //                         {amenity.pgs.map((pg, pgIndex) => (
// //                           <Badge key={pgIndex} variant="secondary" className="text-xs">
// //                             {pg}
// //                           </Badge>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Input } from "../../../shared/ui/input";
// import { Label } from "../../../shared/ui/label";
// import { Button } from "../../../shared/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../shared/ui/select";
// import { Textarea } from "../../../shared/ui/textarea";
// import { Badge } from "../../../shared/ui/badge";
// import { PlusCircle, Loader2, PackageOpen, CheckCircle2 } from "lucide-react";
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";
// import { usePgAmenitiesMapStore } from "../../../shared/store/amenitiesMapStore";
// import { addPgAmenitiesMapApi } from "../../../shared/services/api/adminApiServices";
// import { usePgAmenitiesStore } from "../../../shared/store/amenitiesStore";         
// import SuccessModal from "@/ui/Shared/SuccessModal";

// export function AddAmenitiesPage() {
//   // ── Stores ────────────────────────────────────────────────────────────────
//   const { pgInfoList, loading: pgLoading, fetchPgInfo } = usePgInfoStore();

//   const {
//     amenities: staticAmenities,
//     loading: staticLoading,
//     fetchAmenities,
//   } = usePgAmenitiesStore();

//   const {
//     amenitiesMap: rawAmenitiesMap,
//     loading: mapLoading,
//     fetchAmenitiesMap,
//   } = usePgAmenitiesMapStore();

//   // Always ensure it's an array — guards against API returning object/null
//  const amenitiesMap = Array.isArray(rawAmenitiesMap)
//   ? rawAmenitiesMap
//   : Array.isArray((rawAmenitiesMap as any)?.result)
//   ? (rawAmenitiesMap as any).result
//   : [];

//   // ── Local state ───────────────────────────────────────────────────────────
//   const [selectedPgId, setSelectedPgId] = useState<string>("");
//   const [selectedAmenityId, setSelectedAmenityId] = useState<string>("");
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successAmenityName, setSuccessAmenityName] = useState("");

//   // ── On mount ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchPgInfo();
//     fetchAmenities();
//   }, [fetchPgInfo, fetchAmenities]);

//   // ── On PG change: fetch its existing amenities with debug logging ─────────
//   useEffect(() => {
//     if (!selectedPgId) return;

//     const pgInfoId = Number(selectedPgId);
//     console.log("[AddAmenities] PG selected → pg_info id:", pgInfoId);

//     fetchAmenitiesMap({ pg_info: pgInfoId })
//       .then(() => {
//         // Log what the store holds after fetch
//         // (rawAmenitiesMap won't update here due to closure; check store directly in devtools)
//         console.log("[AddAmenities] fetchAmenitiesMap resolved for pg_info:", pgInfoId);
//       })
//       .catch((err) => {
//         console.error("[AddAmenities] fetchAmenitiesMap error:", err);
//       });

//     setErrorMsg("");
//     setSelectedAmenityId("");
//   }, [selectedPgId, fetchAmenitiesMap]);

//   // ── Debug: log amenitiesMap whenever it changes ───────────────────────────
//   useEffect(() => {
//     console.log("[AddAmenities] amenitiesMap updated →", rawAmenitiesMap);
//     console.log("[AddAmenities] isArray:", Array.isArray(rawAmenitiesMap), "| length:", amenitiesMap.length);
//   }, [rawAmenitiesMap]);

//   const selectedPg = pgInfoList.find((pg) => String(pg.id) === selectedPgId);
//   const selectedAmenity = staticAmenities.find((a) => String(a.id) === selectedAmenityId);
//   const assignedAmenityIds = new Set(amenitiesMap.map((item) => item.amns_info));

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleAddAmenity = async () => {
//     if (!selectedPgId || !selectedAmenityId) return;

//     setSubmitting(true);
//     setErrorMsg("");
//     try {
//       await addPgAmenitiesMapApi({
//         pg_info: Number(selectedPgId),
//         amns_info: Number(selectedAmenityId),
//       });

//       const name = selectedAmenity?.amenity_name ?? "Amenity";
//       setSuccessAmenityName(name);
//       setShowSuccess(true);
//       setSelectedAmenityId("");

//       // Refresh the existing amenities panel
//       fetchAmenitiesMap({ pg_info: Number(selectedPgId) });
//     } catch (err) {
//       console.error("Failed to add amenity", err);
//       setErrorMsg("Failed to add amenity. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-8 min-h-screen bg-gray-50">
//       {/* Success Modal */}
//       <SuccessModal
//         open={showSuccess}
//         title="Amenity Added!"
//         message={`"${successAmenityName}" has been successfully added to ${selectedPg?.pg_name ?? "the PG"}.`}
//         onClose={() => setShowSuccess(false)}
//       />

//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
//           Amenities Manager
//         </h1>
//         <p className="text-sm md:text-base text-gray-500 mt-1">
//           Select a PG to view and manage its amenities
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* ── Add New Amenity ── */}
//         <Card className="border-gray-200 shadow-sm bg-white">
//           <CardHeader className="pb-3 border-b border-gray-100">
//             <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
//               <PlusCircle className="w-4 h-4 text-blue-500" />
//               Add New Amenity
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-5">
//             <div className="space-y-4">

//               {/* 1. Select PG */}
//               <div className="space-y-1.5">
//                 <Label htmlFor="pg-select" className="text-sm font-medium text-gray-700">
//                   Select PG <span className="text-red-400">*</span>
//                 </Label>
//                 <Select onValueChange={setSelectedPgId} value={selectedPgId}>
//                   <SelectTrigger id="pg-select" className="h-10 border-gray-300">
//                     <SelectValue placeholder={pgLoading ? "Loading PGs…" : "Choose a PG"} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {pgInfoList.map((pg) => (
//                       <SelectItem key={pg.id} value={String(pg.id)}>
//                         <span className="font-medium">{pg.pg_name}</span>
//                         <span className="ml-2 text-gray-400 text-xs">{pg.pg_major_area}</span>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* 2. Select Amenity from master list */}
//               <div className="space-y-1.5">
//                 <Label htmlFor="amenity-select" className="text-sm font-medium text-gray-700">
//                   Amenity <span className="text-red-400">*</span>
//                 </Label>
//                 <Select
//                   onValueChange={setSelectedAmenityId}
//                   value={selectedAmenityId}
//                   disabled={!selectedPgId || staticLoading}
//                 >
//                   <SelectTrigger id="amenity-select" className="h-10 border-gray-300">
//                     <SelectValue
//                       placeholder={
//                         !selectedPgId
//                           ? "Select a PG first"
//                           : staticLoading
//                           ? "Loading amenities…"
//                           : "Choose an amenity"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent side="bottom" avoidCollisions={false}>
//                     {staticAmenities.map((amenity) => {
//                       const alreadyAdded = assignedAmenityIds.has(amenity.id);
//                       return (
//                         <SelectItem
//                           key={amenity.id}
//                           value={String(amenity.id)}
//                           disabled={alreadyAdded}
//                         >
//                           <span className={alreadyAdded ? "text-gray-400" : ""}>
//                             {amenity.amenity_name}
//                           </span>
//                           {alreadyAdded && (
//                             <span className="ml-2 text-xs text-gray-400">(already added)</span>
//                           )}
//                         </SelectItem>
//                       );
//                     })}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Error feedback */}
//               {errorMsg && (
//                 <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm">
//                   {errorMsg}
//                 </div>
//               )}

//               <Button
//                 className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
//                 onClick={handleAddAmenity}
//                 disabled={!selectedPgId || !selectedAmenityId || submitting}
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Adding…
//                   </>
//                 ) : (
//                   <>
//                     <PlusCircle className="w-4 h-4 mr-2" />
//                     Add Amenity
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ── Existing Amenities ── */}
//         <Card className="border-gray-200 shadow-sm bg-white">
//           <CardHeader className="pb-3 border-b border-gray-100">
//             <CardTitle className="text-base font-semibold text-gray-800 flex items-center justify-between">
//               <span>Existing Amenities</span>
//               {selectedPg && (
//                 <Badge className="text-xs bg-blue-100 text-blue-700 font-medium border-0">
//                   {selectedPg.pg_name}
//                 </Badge>
//               )}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-4">
//             {!selectedPgId ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
//                 <PackageOpen className="w-10 h-10 mb-3 opacity-40" />
//                 <p className="text-sm font-medium">Select a PG to view its amenities</p>
//               </div>
//             ) : mapLoading ? (
//               <div className="flex items-center justify-center py-12">
//                 <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
//               </div>
//             ) : amenitiesMap.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
//                 <PackageOpen className="w-10 h-10 mb-3 opacity-40" />
//                 <p className="text-sm font-medium">No amenities added yet</p>
//                 <p className="text-xs mt-1">Use the form to add the first one</p>
              
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
//                 {amenitiesMap.map((item, index) => (
//                   <div
//                     key={item.id ?? index}
//                     className="flex items-center gap-3 px-2 py-1 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors"
//                   >
//                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
//                       {item.amenity_name?.charAt(0).toUpperCase() ?? "?"}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-gray-800 truncate">
//                         {item.amenity_name}
//                       </p>
                     
//                     </div>
                    
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }