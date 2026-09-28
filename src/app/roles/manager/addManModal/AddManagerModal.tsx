// // import React, { useState, useEffect } from "react";
// // import { addPgUser } from "@pg/app/shared/services/api/ownerApiServices";
// // import { usePgLocationStore } from "@pg/app/shared/store/pgLocationStore";
// // import { useUserDetailsStore } from "@pg/app/shared/store/pgUserDetailsStore";
// // import UserBaseForm from "@pg/app/shared/components/UserBaseForm";
// // import SuccessModal from "@packages/ui/Shared/SuccessModal";

// // /* ===================== TYPES ===================== */



// // export interface State {
// //   id: number;
// //   name: string;
// // }

// // export interface City {
// //   id: number;
// //   city: string;
// //   state_id: number;
// // }


// // interface ManagerForm {
// //   firstName: string;
// //   lastName: string;
// //   gender: string;
// //   mobile: string;
// //   email: string;
// //   password: string;
// //   permanentAddress: string;
// //   city_id: string;
// //   state_id: string;
// //   pincode: string;
// //   userRole: string;
// //   pgInfoId: string;
// // }

// // interface AddManagerModalProps {
// //   open: boolean;
// //   onClose: () => void;
// // }


// // /* ===================== INPUT STYLE ===================== */

// // const inputClass =
// //   "w-full border border-blue-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none";

// // const labelClass = "block mb-1 text-sm font-semibold text-gray-700";

// // /* ===================== COMPONENT ===================== */

// // const AddManagerModal: React.FC<AddManagerModalProps> = ({
// //   open,
// //   onClose,
// // }) => {

// //   if (!open) return null;
// //   const [loading, setLoading] = useState(false);
// //   const { states, cities, fetchStates, fetchCities } = usePgLocationStore();
// //   const { genders, fetchGenders } = useUserDetailsStore();

// //   const [successOpen, setSuccessOpen] = useState(false);

// //   useEffect(() => {
// //   fetchStates();
// //   fetchCities();
// //   fetchGenders();
 
// // },  [fetchStates, fetchCities, fetchGenders]);



// //   const [form, setForm] = useState<ManagerForm>({
// //     firstName: "",
// //     lastName: "",
// //     gender: "",
// //     mobile: "",
// //     email: "",
// //     password: "",
// //     permanentAddress: "",
// //     state_id: "",
// //     city_id: "",
// //     pincode: "",
// //     userRole: "3",
// //     pgInfoId: "",
// //   });

// //   const filteredCities = cities.filter(
// //   (city: City) => Number(form.state_id) === city.state_id
// // );


// //   const update = <K extends keyof ManagerForm>(key: K, value: ManagerForm[K]) => {
// //     setForm(prev => ({ ...prev, [key]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   e.stopPropagation();

// //   if (loading) return;
// //   setLoading(true);

// //   try {
// //     const fields = {
// //       first_name: form.firstName,
// //       last_name: form.lastName,
// //       user_gender: form.gender,
     
// //       user_role: form.userRole,
// //       mobile_no: form.mobile,
// //       email_id: form.email,
// //       user_password: form.password,
// //       perm_address: form.permanentAddress,
// //       user_city: form.city_id,
// //       user_state: form.state_id,
// //       user_pincode: form.pincode,
// //       pg_info_id: form.pgInfoId,
// //       user_unique_id: crypto.randomUUID(),
// //       logincount: 0,
// //     };

// //     await addPgUser(fields);

   
// //     setSuccessOpen(true);
// //   } catch (error) {
// //     console.error("Failed to add manager", error);
// //     // 🔔 later you can show toast here
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //   return (
// //     <div
// //       className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
// //       onClick={onClose}
// //     >
// //       <div
// //         className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
// //         onClick={e => e.stopPropagation()}
// //       >
// //         {/* HEADER */}
// //         <div className="sticky top-0 bg-white flex justify-between items-center px-6 py-4 border-b z-10">
// //           <h2 className="text-lg font-bold">Add Manager</h2>
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="text-gray-500 hover:text-red-600 text-2xl leading-none"
// //           >
// //             ×
// //           </button>
// //         </div>

// //         {/* FORM */}
// //         <form onSubmit={handleSubmit} className="p-6 space-y-8">

// //           {/* PERSONAL INFO */}
// //           <section>
// //             <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div>
// //                 <label className={labelClass}>First Name *</label>
// //                 <input className={inputClass} required value={form.firstName}
// //                   onChange={e => update("firstName", e.target.value)} />
// //               </div>

// //               <div>
// //                 <label className={labelClass}>Last Name *</label>
// //                 <input className={inputClass} required value={form.lastName}
// //                   onChange={e => update("lastName", e.target.value)} />
// //               </div>

// //               <div>
// //                 <label className={labelClass}>Gender *</label>
// //                <select
// //   className={inputClass}
// //   required
// //   value={form.gender}
// //   onChange={(e) => update("gender", e.target.value)}
// // >
// //   <option value="">Select Gender</option>
// //  {Array.isArray(genders) &&
// //   genders.map((g) => (
// //     <option key={g.id} value={g.id}>
// //       {g.gender_type}
// //     </option>
// //   ))}

// // </select>

// //               </div>

             
// //               <div>
// //                  <label className={labelClass}>Assign PG *</label>
// //             <select className={inputClass} required value={form.pgInfoId}
// //               onChange={e => update("pgInfoId", e.target.value)}>
// //               <option value="">Select PG</option>
// //               <option value="1">PG A</option>
// //               <option value="2">PG B</option>
// //             </select>
// //               </div>
// //             </div>
// //           </section>

// //           {/* CONTACT */}
// //           <section>
// //             <h3 className="font-semibold text-gray-800 mb-4">Contact Details</h3>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div>
// //                 <label className={labelClass}>Mobile Number *</label>
// //                 <input className={inputClass} required value={form.mobile}
// //                   onChange={e => update("mobile", e.target.value)} />
// //               </div>

// //               <div>
// //                 <label className={labelClass}>Email *</label>
// //                 <input type="email" className={inputClass} required value={form.email}
// //                   onChange={e => update("email", e.target.value)} />
// //               </div>

// //               <div>
// //                 <label className={labelClass}>Password *</label>
// //                 <input type="password" className={inputClass} required value={form.password}
// //                   onChange={e => update("password", e.target.value)} />
// //               </div>
// //             </div>
// //           </section>

// //           {/* ADDRESS */}
// //           <section>
// //             <h3 className="font-semibold text-gray-800 mb-4">Address</h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <label className={labelClass}>Permanent Address *</label>
// //                 <textarea rows={3} className={inputClass} required value={form.permanentAddress}
// //                   onChange={e => update("permanentAddress", e.target.value)} />
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                {/* STATE */}
// //               <div>
// //                 <label className={labelClass}>State *</label>
// //                 <select
// //   value={form.state_id}
// //   onChange={(e) =>
// //     setForm((prev) => ({
// //       ...prev,
// //       state_id: e.target.value,
// //       city_id: "", // reset city
// //     }))
// //   }
// //   className={inputClass}
// // >
// //   <option value="">Select State</option>
// //   {states.map((state: State) => (
// //     <option key={state.id} value={state.id}>
// //       {state.name}
// //     </option>
// //   ))}
// // </select>

// //               </div>

// //               {/* CITY */}
// //               <div>
// //                 <label className={labelClass}>City *</label>
// //                <select
// //   value={form.city_id}
// //   onChange={(e) =>
// //     setForm((prev) => ({ ...prev, city_id: e.target.value }))
// //   }
// //   className={inputClass}
// //   disabled={!form.state_id}
// // >
// //   <option value="">Select City</option>

// //   {filteredCities.map((city: City) => (
// //     <option key={city.id} value={city.id}>
// //       {city.city}
// //     </option>
// //   ))}
// // </select>

// //               </div>
// //                 <div>
// //                   <label className={labelClass}>Pincode *</label>
// //                   <input className={inputClass} required value={form.pincode}
// //                     onChange={e => update("pincode", e.target.value)} />
// //                 </div>
// //               </div>
// //             </div>
// //           </section>

// //           {/* PG */}
// //           <section>
           
// //           </section>

// //           {/* ACTIONS */}
// //           <div className="flex justify-end gap-4 pt-6 border-t">
// //             <button type="button" onClick={onClose}
// //               className="px-6 py-2 rounded-lg border text-gray-700">
// //               Cancel
// //             </button>
// //             <button type="submit" disabled={loading}
// //               className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
// //               {loading ? "Saving..." : "Create Manager"}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //      <SuccessModal
// //   open={successOpen}
// //   title="Manager Added"
// //   message="The manager has been added successfully."
// //   onClose={() => {
// //     setSuccessOpen(false);
// //     onClose(); // close parent modal AFTER popup closes
// //   }}
// // />


// //     </div>
// //   );
// // };

// // export default AddManagerModal;

// // src/components/AddManagerModal.tsx
// // import React, { useEffect, useState } from "react";
// // import { addPgUser } from "@pg/app/shared/services/api/ownerApiServices";
// // import { usePgLocationStore } from "@pg/app/shared/store/pgLocationStore";
// // import { useUserDetailsStore } from "@pg/app/shared/store/pgUserDetailsStore";
// // import UserBaseForm from "@pg/app/shared/components/UserBaseForm";
// // import SuccessModal from "@packages/ui/Shared/SuccessModal";

// // const AddManagerModal = ({ open, onClose }: any) => {
// //   const { states, cities, fetchStates, fetchCities } = usePgLocationStore();
// //   const { genders, fetchGenders } = useUserDetailsStore();

// //   const [loading, setLoading] = useState(false);
// //   const [successOpen, setSuccessOpen] = useState(false);
// //   const dummyPgList = [
// //   { id: 1, pg_name: "Sunrise PG" },
// //   { id: 2, pg_name: "Green Valley PG" },
// //   { id: 3, pg_name: "Blue Moon PG" },
// // ];
// //   const [form, setForm] = useState<any>({
// //     firstName: "",
// //     lastName: "",
// //     gender: "",
// //     mobile: "",
// //     email: "",
// //     password: "",
// //     permanentAddress: "",
// //     state_id: "",
// //     city_id: "",
// //     pincode: "",
// //     userRole: "3",
// //     pgInfoId: "",
// //   });

// //   useEffect(() => {
// //     if (open) {
// //       fetchStates();
// //       fetchCities();
// //       fetchGenders();
// //       document.body.style.overflow = "hidden";
// //     }
// //     return () => {
// //       document.body.style.overflow = "";
// //     };
// //   }, [open]);

// //   if (!open) return null;

// //   const update = (key: string, value: any) =>
// //     setForm((f: any) => ({ ...f, [key]: value }));

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (loading) return;

// //     setLoading(true);
// //     try {
// //       await addPgUser({
// //         first_name: form.firstName,
// //         last_name: form.lastName,
// //         user_gender: form.gender,
// //         user_role: form.userRole,
// //         mobile_no: form.mobile,
// //         email_id: form.email,
// //         user_password: form.password,
// //         perm_address: form.permanentAddress,
// //         user_city: form.city_id,
// //         user_state: form.state_id,
// //         user_pincode: form.pincode,
// //         pg_info_id:  Number(form.pg_info_id),
// //         user_unique_id: crypto.randomUUID(),
// //         logincount: 0,
// //       });
// //       setSuccessOpen(true);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
// //         <div className="min-h-screen flex items-center justify-center p-4">
// //           <form
// //             onSubmit={handleSubmit}
// //             className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
// //           >
// //             {/* HEADER */}
// //             <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between">
// //               <h2 className="text-lg font-bold">Add Manager</h2>
// //               <button onClick={onClose} type="button">×</button>
// //             </div>

// //             {/* BODY */}
// //             <div className="flex-1 overflow-y-auto px-6 py-6">
// //               <UserBaseForm
// //                 form={form}
// //                 update={update}
// //                 states={states}
// //                 cities={cities}
// //                 genders={genders}
// //                 pgList={dummyPgList}
// //               />
// //             </div>

// //             {/* FOOTER */}
// //             <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3">
// //               <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
// //               <button type="submit" disabled={loading} className="px-4 py-2 bg-[#605BFF] text-white rounded-lg">
// //                 {loading ? "Saving..." : "Save"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>

// //       <SuccessModal
// //         open={successOpen}
// //         title="Manager Added"
// //         message="Manager added successfully"
// //         onClose={() => {
// //           setSuccessOpen(false);
// //           onClose();
// //         }}
// //       />
// //     </>
// //   );
// // };

// // export default AddManagerModal;


// import React, { useEffect, useState } from "react";
// import { addPgUser } from "@/app/shared/services/api/ownerApiServices";
// import { usePgLocationStore } from "@/app/shared/store/pgLocationStore";
// import { useUserDetailsStore } from "@/app/shared/store/pgUserDetailsStore";
// import { usePgInfoStore } from "@/app/shared/store/pgInfoStore";
// import { useAuth } from "@/hooks/context/AuthContext"; 
// import UserBaseForm from "@/app/shared/components/UserBaseForm";
// import SuccessModal from "@/ui/Shared/SuccessModal";

// const AddManagerModal = ({ open, onClose }: any) => {

//   const { user } = useAuth();
//   const PG_OWNER_ID = user?.id;
//   /* ===================== STORES ===================== */
//   const { states, cities, fetchStates, fetchCities, clearCities } =
//     usePgLocationStore();
   
//   const { genders, fetchGenders } = useUserDetailsStore();
//   const {
//     pgInfoList,
//     fetchPgInfo,
//     resetPgInfo,
//     loading: pgLoading,
//   } = usePgInfoStore();

//   /* ===================== LOCAL STATE ===================== */
//   const [loading, setLoading] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);

//   const [form, setForm] = useState<any>({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     mobile: "",
//     email: "",
//     password: "",
//     permanentAddress: "",
//     state_id: "",
//     city_id: "",
//     pincode: "",
//     userRole: "3",
//     pg_info_id: "",
//   });

//   const update = (key: string, value: any) =>
//     setForm((f: any) => ({ ...f, [key]: value }));

//   /* ===================== Load Master Data ===================== */
//   useEffect(() => {
//     if (!open) return;

//     fetchStates();
//     fetchGenders();
//     fetchPgInfo({ pg_owner: PG_OWNER_ID }); 
//     clearCities();

//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//       resetPgInfo();
//     };
//   }, [open]);

//   /* ===================== Fetch Cities on State Change ===================== */
//   useEffect(() => {
//     if (form.state_id) {
//       fetchCities(Number(form.state_id));
//       update("city_id", "");
//     }
//   }, [form.state_id]);

//   if (!open) return null;

//   /* ===================== Submit ===================== */
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (loading) return;

//   //   setLoading(true);
//   //   try {
//   //     await addPgUser({
//   //       first_name: form.firstName,
//   //       last_name: form.lastName,
//   //       user_gender: form.gender,
//   //       user_role: form.userRole,
//   //       mobile_no: form.mobile,
//   //       email_id: form.email,
//   //       user_password: form.password,
//   //       perm_address: form.permanentAddress,
//   //       user_city: form.city_id,
//   //       user_state: form.state_id,
//   //       user_pincode: form.pincode,
//   //       pg_info_id: Number(form.pg_info_id),
//   //       user_unique_id: crypto.randomUUID(),
//   //       logincount: 0,
//   //     });
//   //     setSuccessOpen(true);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (loading) return;

//   setLoading(true);
//   try {
//     await addPgUser({
//       first_name: form.firstName,
//       last_name: form.lastName,
//       user_gender: Number(form.gender),      // string → number
//       user_role: Number(form.userRole),      // string → number
//       mobile_no: form.mobile,
//       email_id: form.email,
//       user_password: form.password,
//       perm_address: form.permanentAddress,
//       user_city: Number(form.city_id),       // string → number
//       user_state: Number(form.state_id),     // string → number
//       user_pincode: Number(form.pincode),    // string → number
//       pg_info_id: Number(form.pg_info_id),   // string → number
//       user_unique_id: crypto.randomUUID(),
//       logincount: 0,
//     });
//     setSuccessOpen(true);
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
//             <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between">
//               <h2 className="text-lg font-bold">Add Manager</h2>
//               <button onClick={onClose} type="button">×</button>
//             </div>

//             {/* BODY */}
//             <div className="flex-1 overflow-y-auto px-6 py-6">
//               <UserBaseForm
//                 form={form}
//                 update={update}
//                 states={states}
//                 cities={cities}
//                 genders={genders}
//                 pgList={pgInfoList} // ✅ REAL PG DATA
//                 pgLoading={pgLoading} // optional (if you want loader inside form)
//               />
//             </div>

//             {/* FOOTER */}
//             <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-[#605BFF] text-white rounded-lg"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <SuccessModal
//         open={successOpen}
//         title="Manager Added"
//         message="Manager added successfully"
//         onClose={() => {
//           setSuccessOpen(false);
//           onClose();
//         }}
//       />
//     </>
//   );
// };

// export default AddManagerModal;
