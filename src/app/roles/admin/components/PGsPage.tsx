// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
// import { Button } from "../../../shared/ui/button";
// import { MapPin, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Upload, X, Image as ImageIcon, Video, Edit, Trash2, Eye, Loader2, Check } from "lucide-react";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
// import { usePgInfoStore } from "../../../shared/store/pgInfoStore";
// import AddPgModal, { type PgFormState } from "../../owner/addPg/AddNewPG";
// import { usePgInfoMediaStore } from "../../../shared/store/mediaStore";
// import { deletePgInfo, updatePgInfo } from "../../../shared/services/api/commonApiServices";
// import DeleteConfirmModal from "@/ui/Shared/DeleteModal";
// import SuccessModal from "@/ui/Shared/SuccessModal";
// import { usePgCurrentStatusStore } from "../../../shared/store/currentStatusStore";

// /* ─────────────────────────────────────────────
//    Types
// ───────────────────────────────────────────── */
// type MediaSrc = string | File;

// // Statuses to show in dropdown
// const VISIBLE_STATUS_CODES = ["Review", "Approved", "Reject"];

// /* ─────────────────────────────────────────────
//    PropertyCarousel  (unchanged)
// ───────────────────────────────────────────── */
// function toSrc(src: MediaSrc): string {
//   return typeof src === "string" ? src : URL.createObjectURL(src);
// }

// const PropertyCarousel: React.FC<{
//   images: MediaSrc[];
//   videos: MediaSrc[];
//   title: string;
// }> = ({ images, videos, title }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const allMedia: MediaSrc[] = [...images, ...videos];
//   const total = allMedia.length;
//   const isVideo = (idx: number) => idx >= images.length;

//   useEffect(() => { setCurrentIndex(0); }, [images, videos]);

//   if (total === 0) {
//     return (
//       <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center rounded-lg gap-3">
//         <div className="p-4 bg-gray-200 rounded-full">
//           <ImageIcon className="w-10 h-10 text-gray-400" />
//         </div>
//         <span className="text-gray-500 text-sm">No media uploaded for this PG yet.</span>
//       </div>
//     );
//   }

//   const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
//   const next = () => setCurrentIndex((i) => (i + 1) % total);

//   return (
//     <div className="relative w-full h-72 md:h-96 overflow-hidden bg-gray-900 rounded-lg group">
//       {allMedia.map((src, idx) => (
//         <div
//           key={idx}
//           className={`absolute inset-0 transition-opacity duration-500 ${
//             idx === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
//           }`}
//         >
//           {isVideo(idx) ? (
//             <video
//               src={toSrc(src)}
//               className="w-full h-full object-contain bg-black"
//               controls
//               controlsList="nodownload"
//             />
//           ) : (
//             <img
//               src={toSrc(src)}
//               alt={`${title} – slide ${idx + 1}`}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
//               }}
//             />
//           )}
//         </div>
//       ))}

//       {total > 1 && (
//         <>
//           <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Previous">
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Next">
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </>
//       )}

//       {total > 1 && (
//         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//           {allMedia.map((_, idx) => (
//             <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2 rounded-full transition-all duration-200 ${idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"}`} aria-label={`Slide ${idx + 1}`} />
//           ))}
//         </div>
//       )}

//       <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-10 flex items-center gap-1">
//         {isVideo(currentIndex) ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
//         {currentIndex + 1} / {total}
//         {isVideo(currentIndex) && " · Video"}
//       </div>

//       {total > 1 && (
//         <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 flex gap-2 overflow-x-auto z-10">
//           {allMedia.map((src, idx) => (
//             <button key={idx} onClick={() => setCurrentIndex(idx)} className={`shrink-0 w-12 h-10 rounded overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-white scale-105" : "border-transparent opacity-60 hover:opacity-90"}`}>
//               {isVideo(idx) ? (
//                 <div className="w-full h-full bg-gray-700 flex items-center justify-center">
//                   <Video className="w-4 h-4 text-white" />
//                 </div>
//               ) : (
//                 <img src={toSrc(src)} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────
//    Helpers
// ───────────────────────────────────────────── */
// function parseAmenities(amns: string | null): string[] {
//   if (!amns) return [];
//   return amns.split(",").map((a: string) => `Amenity-${a.trim()}`);
// }

// function toFormValues(pg: any): Partial<PgFormState> {
//   return {
//     pg_name: pg.pg_name ?? "",
//     pg_type: pg.type_id != null ? String(pg.type_id) : "",
//     pg_desc: pg.desc_id != null ? String(pg.desc_id) : "",
//     pg_category: pg.category_id != null ? String(pg.category_id) : "",
//     pg_address: pg.pg_address ?? "",
//     pg_state: pg.pg_state != null ? String(pg.pg_state) : "",
//     pg_city: pg.pg_city != null ? String(pg.pg_city) : "",
//     pg_pincode: pg.pg_pincode != null ? String(pg.pg_pincode) : "",
//     pg_landmark: pg.pg_landmark ?? "",
//     pg_major_area: pg.pg_major_area ?? "",
//     pg_primary_contact_no: pg.pg_primary_contact_no ?? "",
//     pg_alternate_contact_no: pg.pg_alternate_contact_no ?? "",
//     pg_email: pg.pg_email ?? "",
//     pg_map_url: pg.pg_map_url ?? "",
//     pg_documents: [],
//     images: [],
//     videos: [],
//   };
// }

// /** Map a status_code string to badge styling */
// function getStatusStyle(statusCode: string): { bg: string; text: string; dot: string } {
//   const code = statusCode?.toLowerCase();
//   if (code === "approved") return { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" };
//   if (code === "review") return { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" };
//   if (code === "reject") return { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" };
//   return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
// }

// /* ─────────────────────────────────────────────
//    Component
// ───────────────────────────────────────────── */
// export function PGsPage() {
//   const { pgInfoList, loading, error, fetchPgInfo } = usePgInfoStore();
//   const { fetchPgInfoMedia, getMediaByPgId, loading: mediaLoading } = usePgInfoMediaStore();
//   const { statuses, fetchStatuses } = usePgCurrentStatusStore();

//   // AddPgModal state
//   const [pgModalOpen, setPgModalOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editPgId, setEditPgId] = useState<string | undefined>(undefined);
//   const [editInitialValues, setEditInitialValues] = useState<Partial<PgFormState> | undefined>(undefined);
//   const [editNumericId, setEditNumericId] = useState<number | undefined>(undefined);

//   // Media dialog state
//   const [mediaUploadOpen, setMediaUploadOpen] = useState(false);
//   const [viewMediaOpen, setViewMediaOpen] = useState(false);
//   const [uploadSaving, setUploadSaving] = useState(false);
//   const [uploadSuccessOpen, setUploadSuccessOpen] = useState(false);

//   // Row selection
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   // Active PG for media dialogs
//   const [activePgId, setActivePgId] = useState<string | null>(null);

//   // Temp files staged in the upload dialog
//   const [tempImages, setTempImages] = useState<File[]>([]);
//   const [tempVideos, setTempVideos] = useState<File[]>([]);

//   // Delete modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const [expandedRows, setExpandedRows] = useState<string[]>([]);

//   // ── Status editing state per pg_id ──
//   // Tracks which status_id is selected in the dropdown for each row
//   const [pendingStatusMap, setPendingStatusMap] = useState<Record<string, number>>({});
//   // Tracks which rows are currently saving their status
//   const [savingStatusIds, setSavingStatusIds] = useState<Set<string>>(new Set());

//   // Filtered statuses to show in dropdown
//   const dropdownStatuses = statuses.filter((s) =>
//     VISIBLE_STATUS_CODES.map((c) => c.toLowerCase()).includes(s.status_code?.toLowerCase())
//   );

//   useEffect(() => {
//     fetchPgInfo();
//     fetchPgInfoMedia();
//     fetchStatuses();
//   }, [fetchPgInfo, fetchPgInfoMedia, fetchStatuses]);

//   // Initialise pendingStatusMap when pg list or statuses load
//   useEffect(() => {
//     if (pgInfoList.length === 0 || statuses.length === 0) return;
//     setPendingStatusMap((prev) => {
//       const next = { ...prev };
//       pgInfoList.forEach((pg) => {
//         if (next[pg.pg_id] == null) {
//           // Use pg's current status_id if available, else fall back to "Approved" (id 2)
//           next[pg.pg_id] = pg.pg_status;
//         }
//       });
//       return next;
//     });
//   }, [pgInfoList, statuses]);

//   /* ── Selection ── */
//   const toggleSelectPg = (id: number) =>
//     setSelectedIds((prev) =>
//       prev.includes(Number(id)) ? prev.filter((x) => x !== Number(id)) : [...prev, Number(id)]
//     );

//   const toggleSelectAll = () =>
//     setSelectedIds(
//       selectedIds.length === pgInfoList.length ? [] : pgInfoList.map((pg) => Number(pg.id))
//     );

//   const toggleRow = (pgId: string) =>
//     setExpandedRows((prev) =>
//       prev.includes(pgId) ? prev.filter((id) => id !== pgId) : [...prev, pgId]
//     );

//   /* ── Add / Edit ── */
//   const handleAddPG = () => {
//     setEditMode(false);
//     setEditPgId(undefined);
//     setEditInitialValues(undefined);
//     setEditNumericId(undefined);
//     setPgModalOpen(true);
//   };

//   const handleEditSelected = () => {
//     if (selectedIds.length !== 1) return;
//     const pg = pgInfoList.find((p) => Number(p.id) === Number(selectedIds[0]));
//     if (!pg) return;
//     setEditMode(true);
//     setEditPgId(pg.pg_id);
//     setEditNumericId(Number(pg.id));
//     setEditInitialValues(toFormValues(pg));
//     setPgModalOpen(true);
//   };

//   /* ── Delete ── */
//   const handleDeleteClick = () => {
//     if (selectedIds.length === 0) return;
//     setDeleteModalOpen(true);
//   };

//   const handleDeleteConfirmed = async () => {
//     setDeleting(true);
//     try {
//       await Promise.all(selectedIds.map((id) => deletePgInfo(Number(id))));
//       const deletedSet = new Set(selectedIds.map(Number));
//       usePgInfoStore.setState((state) => ({
//         pgInfoList: state.pgInfoList.filter((pg) => !deletedSet.has(Number(pg.id))),
//       }));
//       setSelectedIds([]);
//       setDeleteModalOpen(false);
//     } catch (err) {
//       console.error("Delete failed", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleModalSuccess = () => {
//     fetchPgInfo();
//     fetchPgInfoMedia();
//     setSelectedIds([]);
//   };

//   /* ── Status update ── */
//   const handleStatusChange = (pgId: string, statusId: number) => {
//     setPendingStatusMap((prev) => ({ ...prev, [pgId]: statusId }));
//   };

//   const handleStatusSave = async (pg: any) => {
//     const newStatusId = pendingStatusMap[pg.pg_id];
//     if (newStatusId == null) return;

//     setSavingStatusIds((prev) => new Set(prev).add(pg.pg_id));
//     try {
//       await updatePgInfo({
//         id: Number(pg.id),
//         pg_name: pg.pg_name,
//         pg_status: newStatusId,
//       });
//       // Optimistically update the store so the badge reflects the new status immediately
//       usePgInfoStore.setState((state) => ({
//         pgInfoList: state.pgInfoList.map((p) =>
//           p.pg_id === pg.pg_id ? { ...p, pg_status: newStatusId } : p
//         ),
//       }));
//     } catch (err) {
//       console.error("Status update failed", err);
//       alert("Failed to update status. Please try again.");
//     } finally {
//       setSavingStatusIds((prev) => {
//         const next = new Set(prev);
//         next.delete(pg.pg_id);
//         return next;
//       });
//     }
//   };

//   /* ── Helper: resolve status label + style for a pg ── */
//   const resolveStatus = (pg: any) => {
//     const statusId = pendingStatusMap[pg.pg_id] ?? pg.pg_status;
//     const found = statuses.find((s) => s.id === statusId);
//     return found ?? { id: statusId, status_code: "Approved", row_id: 2, rstatus: 1 };
//   };

//   /* ── Media helpers (unchanged) ── */
//   const getViewMedia = (pgId: string): { images: MediaSrc[]; videos: MediaSrc[] } => {
//     const apiMedia = getMediaByPgId(pgId);
//     return {
//       images: apiMedia?.media?.images ?? [],
//       videos: apiMedia?.media?.videos ?? [],
//     };
//   };

//   const getSlotCounts = (pgId: string) => {
//     const apiMedia = getMediaByPgId(pgId);
//     const totalImages = apiMedia?.media?.images?.length ?? 0;
//     const totalVideos = apiMedia?.media?.videos?.length ?? 0;
//     return {
//       remainingImages: Math.max(0, 5 - totalImages),
//       remainingVideos: Math.max(0, 2 - totalVideos),
//       totalImages,
//       totalVideos,
//     };
//   };

//   const getDialogSlots = () => {
//     if (!activePgId) return { remainingImages: 5, remainingVideos: 2, apiImageCount: 0, apiVideoCount: 0 };
//     const apiMedia = getMediaByPgId(activePgId);
//     const apiImageCount = apiMedia?.media?.images?.length ?? 0;
//     const apiVideoCount = apiMedia?.media?.videos?.length ?? 0;
//     return {
//       remainingImages: Math.max(0, 5 - apiImageCount - tempImages.length),
//       remainingVideos: Math.max(0, 2 - apiVideoCount - tempVideos.length),
//       apiImageCount,
//       apiVideoCount,
//     };
//   };

//   const openViewMedia = (pgId: string) => { setActivePgId(pgId); setViewMediaOpen(true); };
//   const openUploadDialog = (pgId: string) => { setActivePgId(pgId); setTempImages([]); setTempVideos([]); setMediaUploadOpen(true); };
//   const closeUploadDialog = () => { setMediaUploadOpen(false); setTempImages([]); setTempVideos([]); setActivePgId(null); };

//   const handleUploadSave = async () => {
//     if (!activePgId) return;
//     const pg = pgInfoList.find((p) => p.pg_id === activePgId);
//     if (!pg) return;
//     if (tempImages.length === 0 && tempVideos.length === 0) { closeUploadDialog(); return; }
//     setUploadSaving(true);
//     try {
//       await updatePgInfo({ id: Number(pg.id), pg_name: pg.pg_name, images: tempImages, videos: tempVideos, pg_documents: [] });
//       await fetchPgInfoMedia();
//       closeUploadDialog();
//       setUploadSuccessOpen(true);
//     } catch (err) {
//       console.error("Media upload failed", err);
//       alert("Failed to upload media. Please try again.");
//     } finally {
//       setUploadSaving(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const { remainingImages } = getDialogSlots();
//     if (remainingImages <= 0) return;
//     const allowed = files.slice(0, remainingImages);
//     if (files.length > remainingImages) alert(`Only ${remainingImages} image slot${remainingImages !== 1 ? "s" : ""} remaining. Adding first ${remainingImages}.`);
//     setTempImages((p) => [...p, ...allowed]);
//     e.target.value = "";
//   };

//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const { remainingVideos } = getDialogSlots();
//     if (remainingVideos <= 0) return;
//     const allowed = files.slice(0, remainingVideos);
//     if (files.length > remainingVideos) alert(`Only ${remainingVideos} video slot${remainingVideos !== 1 ? "s" : ""} remaining. Adding first ${remainingVideos}.`);
//     setTempVideos((p) => [...p, ...allowed]);
//     e.target.value = "";
//   };

//   const deleteModalMessage =
//     selectedIds.length === 1
//       ? `Are you sure you want to delete "${pgInfoList.find((p) => Number(p.id) === selectedIds[0])?.pg_name ?? "this PG"}"? This action cannot be undone.`
//       : `Are you sure you want to delete ${selectedIds.length} PGs? This action cannot be undone.`;

//   /* ─────────────────────────────────────────────
//      Render
//   ───────────────────────────────────────────── */
//   return (
//     <div className="p-4 md:p-8">

//       <SuccessModal
//         open={uploadSuccessOpen}
//         title="Media Uploaded"
//         message="Your images and videos have been successfully uploaded."
//         onClose={() => setUploadSuccessOpen(false)}
//       />

//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         title={`Delete PG${selectedIds.length > 1 ? "s" : ""}`}
//         message={deleteModalMessage}
//         loading={deleting}
//         onConfirm={handleDeleteConfirmed}
//         onCancel={() => setDeleteModalOpen(false)}
//       />

//       <div className="mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">PGs</h1>
//         <p className="text-sm md:text-base text-gray-600 mt-2">Manage your paying guest properties</p>
//       </div>

//       <AddPgModal
//         open={pgModalOpen}
//         onClose={() => setPgModalOpen(false)}
//         onSuccess={handleModalSuccess}
//         editMode={editMode}
//         editPgId={editPgId}
//         editNumericId={editNumericId}
//         initialValues={editInitialValues}
//         // ── Default status injection ──
//         // Pass the "Approved" status id (2) for admin; your AddPgModal
//         // should accept a `defaultStatusId` prop and use it when building
//         // the create payload.  For owner flow pass 1 (Review).
//         defaultStatusId={2}
//       />

//       <Card className="border-gray-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All PGs</CardTitle>
//             <div className="flex items-center gap-2">
//               <Button onClick={handleAddPG} size="icon" title="Add New PG" disabled={selectedIds.length > 0}>
//                 <Plus className="w-4 h-4" />
//               </Button>
//               <Button onClick={handleEditSelected} size="icon" title="Edit Selected" disabled={selectedIds.length !== 1}>
//                 <Edit className="w-4 h-4" />
//               </Button>
//               <Button onClick={handleDeleteClick} size="icon" title="Delete Selected" disabled={selectedIds.length === 0}>
//                 <Trash2 className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {loading && (
//             <div className="flex items-center justify-center py-16 text-gray-500">
//               <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading PGs…
//             </div>
//           )}
//           {!loading && error && <div className="text-center py-16 text-red-500">{error}</div>}
//           {!loading && !error && pgInfoList.length === 0 && (
//             <div className="text-center py-16 text-gray-500">No PGs found. Click <strong>+</strong> to add one.</div>
//           )}

//           {!loading && !error && pgInfoList.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.length === pgInfoList.length && pgInfoList.length > 0}
//                         onChange={toggleSelectAll}
//                         className="mr-2"
//                       />
//                       Select
//                     </th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Media</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pgInfoList.map((pg) => {
//                     const viewMedia = getViewMedia(pg.pg_id);
//                     const totalMediaCount = viewMedia.images.length + viewMedia.videos.length;
//                     const { remainingImages, remainingVideos } = getSlotCounts(pg.pg_id);
//                     const isUploadFull = remainingImages === 0 && remainingVideos === 0;
//                     const isExpanded = expandedRows.includes(pg.pg_id);
//                     const isSelected = selectedIds.includes(Number(pg.id));

//                     const currentStatus = resolveStatus(pg);
//                     const statusStyle = getStatusStyle(currentStatus.status_code);
//                     const isSavingStatus = savingStatusIds.has(pg.pg_id);
//                     const pendingId = pendingStatusMap[pg.pg_id];
//                     const originalStatusId = pg.pg_status;
//                     const hasStatusChanged = pendingId != null && pendingId !== originalStatusId;

//                     return (
//                       <React.Fragment key={pg.pg_id}>
//                         <tr className="border-b border-gray-100 hover:bg-gray-50">
//                           <td className="py-4 px-4">
//                             <input type="checkbox" checked={isSelected} onChange={() => toggleSelectPg(Number(pg.id))} />
//                           </td>
//                           <td className="py-4 px-4">
//                             <button
//                               onClick={() => toggleRow(pg.pg_id)}
//                               className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
//                             >
//                               {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                               {pg.pg_name}
//                             </button>
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <MapPin className="w-3 h-3 shrink-0" />
//                               <span>{pg.pg_major_area}, {pg.city}</span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4 text-gray-900">{pg.first_name} {pg.last_name}</td>
//                           <td className="py-4 px-4 capitalize text-gray-700">{pg.category}</td>
//                           <td className="py-4 px-4 text-gray-700">{pg.pg_type}</td>
//                           <td className="py-4 px-4 text-sm text-gray-700">{pg.pg_primary_contact_no}</td>

//                           {/* ── Status column: badge + dropdown ── */}
//                           <td className="py-4 px-4">
//                             <div className="flex flex-col gap-2">
//                               {/* Current status badge */}
//                               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
//                                 <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyle.dot}`} />
//                                 {currentStatus.status_code}
//                               </span>
//                               {/* Dropdown to change */}
//                               <select
//                                 value={pendingId ?? originalStatusId}
//                                 onChange={(e) => handleStatusChange(pg.pg_id, Number(e.target.value))}
//                                 disabled={isSavingStatus}
//                                 className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 {dropdownStatuses.map((s) => (
//                                   <option key={s.id} value={s.id}>
//                                     {s.status_code}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           </td>

//                           {/* ── Actions column: tick button ── */}
//                           <td className="py-4 px-4">
//                             <button
//                               onClick={() => handleStatusSave(pg)}
//                               disabled={isSavingStatus || !hasStatusChanged}
//                               title={hasStatusChanged ? "Save status" : "No changes"}
//                               className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors
//                                 ${hasStatusChanged && !isSavingStatus
//                                   ? "bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer"
//                                   : "bg-gray-100 text-gray-300 cursor-not-allowed"
//                                 }`}
//                             >
//                               {isSavingStatus
//                                 ? <Loader2 className="w-4 h-4 animate-spin" />
//                                 : <Check className="w-4 h-4" />
//                               }
//                             </button>
//                           </td>

//                           <td className="py-4 px-4">
//                             <div className="flex flex-col gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => openUploadDialog(pg.pg_id)}
//                                 disabled={isUploadFull}
//                                 title={isUploadFull ? "Media limit reached (5 images + 2 videos)" : `Upload media (${remainingImages} image${remainingImages !== 1 ? "s" : ""}, ${remainingVideos} video${remainingVideos !== 1 ? "s" : ""} remaining)`}
//                                 className="flex items-center gap-2"
//                               >
//                                 <Upload className="w-4 h-4" />
//                                 Upload
//                                 {isUploadFull && (
//                                   <span className="ml-1 text-[10px] bg-gray-400 text-white rounded-full px-1.5 py-0.5">Full</span>
//                                 )}
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => openViewMedia(pg.pg_id)}
//                                 className={`flex items-center gap-2 ${totalMediaCount > 0 ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "bg-gray-50 border-gray-200"}`}
//                               >
//                                 <Eye className="w-4 h-4" /> View
//                                 {totalMediaCount > 0 && (
//                                   <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5">{totalMediaCount}</span>
//                                 )}
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>

//                         {isExpanded && (
//                           <tr className="bg-blue-50/30 border-b border-gray-100">
//                             <td colSpan={10} className="py-4 px-4">
//                               <div className="max-w-4xl">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                   <Detail label="PG ID" value={pg.pg_id} />
//                                   <Detail label="Full Address" value={pg.pg_address} />
//                                   <Detail label="Landmark" value={pg.pg_landmark} />
//                                   <Detail label="Major Area" value={pg.pg_major_area} />
//                                   <Detail label="City" value={pg.city} />
//                                   <Detail label="State" value={`${pg.name} (${pg.scode})`} />
//                                   <Detail label="Pincode" value={String(pg.pg_pincode)} />
//                                   <Detail label="Email" value={pg.pg_email} />
//                                   <Detail label="Alternate Contact" value={pg.pg_alternate_contact_no} />
//                                   <Detail label="Description" value={pg.pg_desc} />
//                                   <Detail label="Category" value={pg.category} />
//                                   <Detail label="Amenities" value={parseAmenities(pg.amns_info).join(", ") || "—"} />
//                                   <Detail label="Owner Email" value={pg.email_id} />
//                                   <Detail label="Owner Mobile" value={pg.mobile_no} />
//                                 </div>
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

//       {/* ── View Media Dialog (unchanged) ── */}
//       <Dialog open={viewMediaOpen} onOpenChange={setViewMediaOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {activePgId ? pgInfoList.find((pg) => pg.pg_id === activePgId)?.pg_name : "View Media"}
//             </DialogTitle>
//             <DialogDescription>
//               {activePgId && (() => {
//                 const m = getViewMedia(activePgId);
//                 if (m.images.length === 0 && m.videos.length === 0) return null;
//                 return `${m.images.length} image${m.images.length !== 1 ? "s" : ""} · ${m.videos.length} video${m.videos.length !== 1 ? "s" : ""}`;
//               })()}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             {mediaLoading ? (
//               <div className="flex items-center justify-center h-64">
//                 <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//               </div>
//             ) : activePgId ? (
//               <PropertyCarousel
//                 images={getViewMedia(activePgId).images}
//                 videos={getViewMedia(activePgId).videos}
//                 title={pgInfoList.find((pg) => pg.pg_id === activePgId)?.pg_name ?? ""}
//               />
//             ) : null}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setViewMediaOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Media Upload Dialog (unchanged) ── */}
//       <Dialog open={mediaUploadOpen} onOpenChange={(open) => { if (!open && !uploadSaving) closeUploadDialog(); }}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Upload Media</DialogTitle>
//             <DialogDescription>
//               {activePgId && pgInfoList.find((pg) => pg.pg_id === activePgId)?.pg_name} — up to 5 images and 2 videos.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             {(() => {
//               const { remainingImages, apiImageCount } = getDialogSlots();
//               const totalUploaded = apiImageCount + tempImages.length;
//               const isFull = remainingImages === 0;
//               return (
//                 <section className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <h4 className="text-sm font-semibold text-gray-700">Images (Max 5)</h4>
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${isFull ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{totalUploaded}/5 uploaded</span>
//                   </div>
//                   {isFull ? (
//                     <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
//                       <div className="p-2 bg-gray-200 rounded-full"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Image limit reached</p>
//                         <p className="text-xs text-gray-400">5 of 5 slots used.</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <label className="flex flex-col items-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50/30 rounded-lg p-6 cursor-pointer transition-colors">
//                       <ImageIcon className="w-10 h-10 text-gray-400" />
//                       <span className="text-sm text-gray-600">Click to select images</span>
//                       <span className="text-xs text-gray-400">{remainingImages} slot{remainingImages !== 1 ? "s" : ""} remaining</span>
//                       <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
//                     </label>
//                   )}
//                   {tempImages.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                       {tempImages.map((file, i) => (
//                         <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
//                           <img src={URL.createObjectURL(file)} alt={`Preview ${i + 1}`} className="w-full h-24 object-cover" />
//                           <button type="button" onClick={() => setTempImages((p) => p.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                             <X className="w-3.5 h-3.5" />
//                           </button>
//                           <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1.5 py-0.5">
//                             <p className="text-white text-[10px] truncate">{file.name}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </section>
//               );
//             })()}

//             {(() => {
//               const { remainingVideos, apiVideoCount } = getDialogSlots();
//               const totalUploaded = apiVideoCount + tempVideos.length;
//               const isFull = remainingVideos === 0;
//               return (
//                 <section className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <h4 className="text-sm font-semibold text-gray-700">Videos (Max 2)</h4>
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${isFull ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{totalUploaded}/2 uploaded</span>
//                   </div>
//                   {isFull ? (
//                     <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
//                       <div className="p-2 bg-gray-200 rounded-full"><Video className="w-5 h-5 text-gray-400" /></div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Video limit reached</p>
//                         <p className="text-xs text-gray-400">2 of 2 slots used.</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <label className="flex flex-col items-center gap-2 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50/30 rounded-lg p-6 cursor-pointer transition-colors">
//                       <Video className="w-10 h-10 text-gray-400" />
//                       <span className="text-sm text-gray-600">Click to select videos</span>
//                       <span className="text-xs text-gray-400">{remainingVideos} slot{remainingVideos !== 1 ? "s" : ""} remaining</span>
//                       <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
//                     </label>
//                   )}
//                   {tempVideos.length > 0 && (
//                     <div className="space-y-2">
//                       {tempVideos.map((file, i) => (
//                         <div key={i} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
//                           <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                             <Video className="w-5 h-5 text-blue-600" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
//                             <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                           </div>
//                           <button type="button" onClick={() => setTempVideos((p) => p.filter((_, idx) => idx !== i))} className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors">
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </section>
//               );
//             })()}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={closeUploadDialog} disabled={uploadSaving}>Cancel</Button>
//             <Button onClick={handleUploadSave} disabled={uploadSaving || (tempImages.length === 0 && tempVideos.length === 0)}>
//               {uploadSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading...</> : "Save Media"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    Small helpers
// ───────────────────────────────────────────── */
// function StatusBadge({ status }: { status: "active" | "under-maintenance" | "closed" }) {
//   const map = {
//     active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500", label: "Active" },
//     "under-maintenance": { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500", label: "Under Maintenance" },
//     closed: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500", label: "Closed" },
//   };
//   const s = map[status];
//   return (
//     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
//       <span className={`w-2 h-2 rounded-full mr-2 ${s.dot}`} />
//       {s.label}
//     </span>
//   );
// }

// function Detail({ label, value }: { label: string; value?: string | null }) {
//   return (
//     <div className="space-y-1">
//       <p className="text-sm font-medium text-gray-600">{label}</p>
//       <p className="text-gray-900">{value || "—"}</p>
//     </div>
//   );
// }