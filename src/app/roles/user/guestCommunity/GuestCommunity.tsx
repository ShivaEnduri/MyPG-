// // // GuestCommunity.jsx
// // export default function GuestCommunity() {
// //   const baseButtonClasses =
// //     "w-full sm:w-64 px-6 py-3 rounded-full font-semibold shadow-sm transition-colors duration-200 text-lg flex justify-center items-center text-center";

// //   return (
// //     <div className="p-4 sm:p-8 font-sans">
// //       <div className="max-w-7xl w-full mx-auto">
// //         <div className="flex items-center gap-3 mb-6 ml-1">
// //           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
// //             Community & Support
// //           </h2>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-xl p-6">
// //           <div className="flex flex-col sm:flex-row justify-around items-stretch gap-4 py-4">
// //             <button className={`${baseButtonClasses} bg-red-100 text-red-700 hover:bg-red-200`}>
// //               Emergency Contacts
// //             </button>
// //             <button className={`${baseButtonClasses} bg-green-100 text-green-700 hover:bg-green-200`}>
// //               Chats
// //             </button>
// //             <button className={`${baseButtonClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`}>
// //               FAQs
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import Modal from "@/app/shared/components/Modal"; // adjust path as needed
// import { usePgUserStore } from "@/app/shared/store/userDataStore";
// import { useAuth } from "@/hooks/context/AuthContext";

// // ===========================
// // Reusable Contact Card
// // ===========================
// const ContactCard: React.FC<{
//   name: string;
//   role?: string;
//   phone: string;
//   email?: string;
// }> = ({ name, role, phone, email }) => (
//   <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
//     <p className="font-semibold text-gray-900">{name}</p>
//     {role && <p className="text-sm text-gray-600">{role}</p>}
//     <p className="mt-1 text-sm text-gray-700">Phone: {phone}</p>
//     {email && <p className="text-sm text-gray-700">Email: {email}</p>}
//   </div>
// );

// // ===========================
// // GuestCommunity Component
// // ===========================
// export default function GuestCommunity() {
//   const { user } = useAuth();
//   const userPgInfoId = user?.pgInfoId;

//   const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

//   // Reuse the same store pattern as GActionCard's PG Contacts modal
//   const { users: pgContacts, loading: contactsLoading, fetchUsers: fetchPgContacts } =
//     usePgUserStore();

//   // Fetch manager contacts when Emergency Contacts modal opens
//   useEffect(() => {
//     if (!isEmergencyOpen || !userPgInfoId) return;
//     fetchPgContacts({
//       pg_info_id: userPgInfoId,
//       user_role: 3, // Manager role
//     });
//   }, [isEmergencyOpen, userPgInfoId, fetchPgContacts]);

//   const baseButtonClasses =
//     "w-full sm:w-64 px-6 py-3 rounded-full font-semibold shadow-sm transition-colors duration-200 text-lg flex justify-center items-center text-center";

//   return (
//     <div className="p-4 sm:p-8 font-sans">
//       <div className="max-w-7xl w-full mx-auto">
//         <div className="flex items-center gap-3 mb-6 ml-1">
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
//             Community & Support
//           </h2>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl p-6">
//           <div className="flex flex-col sm:flex-row justify-around items-stretch gap-4 py-4">
//             <button
//               onClick={() => setIsEmergencyOpen(true)}
//               className={`${baseButtonClasses} bg-red-100 text-red-700 hover:bg-red-200`}
//             >
//               Emergency Contacts
//             </button>
//             <button className={`${baseButtonClasses} bg-green-100 text-green-700 hover:bg-green-200`}>
//               Chats
//             </button>
//             <button className={`${baseButtonClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`}>
//               FAQs
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Emergency Contacts Modal — same pattern as PG Contacts in GActionCard */}
//       <Modal
//         open={isEmergencyOpen}
//         onClose={() => setIsEmergencyOpen(false)}
//         title="Emergency Contacts"
//         size="md"
//       >
//         <div className="space-y-4">
//           {contactsLoading ? (
//             <div className="text-center py-8 text-gray-600">Loading contacts...</div>
//           ) : pgContacts.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No emergency contacts found for this PG.
//             </div>
//           ) : (
//             pgContacts.map((contact) => (
//               <ContactCard
//                 key={contact.id}
//                 name={`${contact.first_name} ${contact.last_name || ""}`.trim()}
//                 role="PG Manager"
//                 phone={contact.mobile_no || "N/A"}
//                 email={contact.email_id || undefined}
//               />
//             ))
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }