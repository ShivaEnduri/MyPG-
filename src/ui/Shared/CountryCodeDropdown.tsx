// import React, { RefObject } from "react";
// import tailwindStyles from "@packages/styles/tailwindStyles";

// // ---------- Types ----------
// export interface Country {
//   name: string;
//   code: string;
//   flag: string;
// }

// export interface CountryDropdownProps {
//   dropdownRef: RefObject<HTMLDivElement>;
//   isDropdownOpen: boolean;
//   setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedCountry: Country | null;
//   setSelectedCountry: React.Dispatch<React.SetStateAction<Country | null>>;
//   countries: Country[];
//   searchTerm: string;
//   setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
// }

// // ---------- Component ----------
// const CountryDropdown: React.FC<CountryDropdownProps> = ({
//   dropdownRef,
//   isDropdownOpen,
//   setDropdownOpen,
//   selectedCountry,
//   setSelectedCountry,
//   countries,
//   searchTerm,
//   setSearchTerm,
// }) => {
//   const filtered = countries.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="relative w-[30%]" ref={dropdownRef}>
//       {/* ---------- BUTTON ---------- */}
//       <button
//         type="button"
//         className={`w-full px-2 h-8 border rounded flex items-center justify-between bg-white text-sm md:text-md ${tailwindStyles.paragraph_b}`}
//         onClick={() => setDropdownOpen((v) => !v)}
//       >
//         {selectedCountry ? (
//           <div className="flex items-center space-x-1">
//             <img
//               src={selectedCountry.flag}
//               alt={selectedCountry.name}
//               className="w-5 h-5"
//             />
//             <span className={`${tailwindStyles.paragraph} truncate`}>
//               {selectedCountry.code}
//             </span>
//           </div>
//         ) : (
//           <span>Select</span>
//         )}
//       </button>

//       {/* ---------- DROPDOWN ---------- */}
//       {isDropdownOpen && (
//         <div className="absolute z-20 mt-2 w-full min-w-[180px] bg-white border rounded shadow-lg">
//           {/* search */}
//           <div className="p-2 border-b">
//             <input
//               type="text"
//               placeholder="Search country"
//               className="w-full p-1 border rounded text-sm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               autoFocus
//             />
//           </div>

//           {/* list */}
//           <ul className="max-h-60 overflow-y-auto">
//             {filtered.map((country, idx) => (
//               <li
//                 key={idx}
//                 className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   setSelectedCountry(country);
//                   setDropdownOpen(false);
//                   setSearchTerm(""); // Clear search (optional)
//                 }}
//               >
//                 <img
//                   src={country.flag}
//                   alt={country.name}
//                   className="w-5 h-5 mr-2"
//                 />
//                 <span className={`${tailwindStyles.paragraph} truncate`}>
//                   {country.name} ({country.code})
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CountryDropdown;
