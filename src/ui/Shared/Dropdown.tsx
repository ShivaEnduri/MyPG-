


// import React, { useState, useRef, useEffect } from "react";
// import { Search, X } from "lucide-react";

// interface Option {
//   id?: string | number;
//   name?: string;
//   value?: string | number;
//   label?: string;
// }

// interface SearchableDropdownProps {
//   label: string;
//   value: string;
//   options: Option[];
//   onChange: (e: { target: { value: string } }) => void;
//   disabled?: boolean;
// }

// const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
//   label,
//   value,
//   onChange,
//   options,
//   disabled = false,
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//         setSearchTerm("");
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Focus input when dropdown opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   // Normalize option structure (handle both {id, name} and {value, label})
//   const normalizedOptions = options.map(opt => ({
//     id: (opt.id || opt.value || '').toString(),
//     name: opt.name || opt.label || '',
//   }));

//   // Get selected option by ID, not by name
//   const selectedOption = normalizedOptions.find((option) => option.id === value);
//   const displayText = selectedOption ? selectedOption.name : label;

//   // Filter options with null checks
//   const filteredOptions = normalizedOptions.filter((option) => {
//     if (!option.name) return false;
//     const optionNameNoSpaces = option.name.toLowerCase().replace(/\s/g, "");
//     const searchTermNoSpaces = searchTerm.toLowerCase().replace(/\s/g, "");
//     return optionNameNoSpaces.includes(searchTermNoSpaces);
//   });

//   // Handlers - Now returns the ID instead of name
//   const handleOptionClick = (optionId: string) => {
//     onChange({ target: { value: optionId } });
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (disabled) return;
//     e.stopPropagation();
//     setIsOpen((prev) => !prev);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (disabled) return;
//     setSearchTerm(e.target.value);
//     setIsOpen(true);
//   };

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {/* Search Input Trigger */}
//       <div className="relative cursor-pointer" onClick={handleInputClick}>
//         <input
//           ref={inputRef}
//           type="text"
//           value={searchTerm || (isOpen ? "" : displayText)}
//           onChange={handleSearchChange}
//           placeholder={label}
//           autoComplete="off"
//           disabled={disabled}
//           className={`cursor-pointer bg-white w-full px-2 py-1 text-xs text-[#001433] bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:border-[#4A628A] pr-8 ${
//             !value && !searchTerm ? "text-gray-500" : ""
//           } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//         />

//         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//           {value && !searchTerm && !disabled ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOptionClick("");
//               }}
//               className="ml-2 text-gray-400 hover:text-gray-600"
//               aria-label="Clear selection"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           ) : (
//             <Search className="h-3 w-3 text-gray-400" />
//           )}
//         </div>
//       </div>

//       {/* Dropdown Modal */}
//       {isOpen && !disabled && (
//         <ul
//           className="absolute w-full text-left bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-20"
//           style={{ top: "calc(100% + 2px)" }}
//         >
//           {filteredOptions.length === 0 ? (
//             <li className="px-2 py-1 text-gray-400 text-xs">
//               No Results Found
//             </li>
//           ) : (
//             filteredOptions.map((option) => (
//               <li
//                 key={option.id}
//                 onClick={() => handleOptionClick(option.id)}
//                 className={`px-2 py-1 text-xs text-[#001433] hover:bg-gray-100 cursor-pointer ${
//                   option.id === value ? "bg-gray-200" : ""
//                 }`}
//               >
//                 {option.name}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchableDropdown;



import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Option {
  id?: string | number;
  name?: string;
  value?: string | number;
  label?: string;
}

interface SearchableDropdownProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ------------------------------------------------------------
  // CLOSE WHEN CLICKING OUTSIDE
  // ------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // FOCUS SEARCH INPUT WHEN OPENED
  // ------------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // ------------------------------------------------------------
  // NORMALIZE OPTIONS
  // Supports:
  // { id, name }
  // { value, label }
  // ------------------------------------------------------------
  const normalizedOptions = options
    .map((option) => {
      const rawId = option.id ?? option.value;

      if (rawId === undefined || rawId === null) {
        return null;
      }

      return {
        id: String(rawId),
        name: option.name ?? option.label ?? "",
      };
    })
    .filter(
      (
        option
      ): option is {
        id: string;
        name: string;
      } => option !== null
    );

  // ------------------------------------------------------------
  // SELECTED OPTION
  // ------------------------------------------------------------
  const selectedOption = normalizedOptions.find(
    (option) => option.id === value
  );

  const displayText = selectedOption
    ? selectedOption.name
    : label;

  // ------------------------------------------------------------
  // FILTER OPTIONS
  // ------------------------------------------------------------
  const filteredOptions = normalizedOptions.filter((option) => {
    if (!option.name) {
      return false;
    }

    const optionName = option.name
      .toLowerCase()
      .replace(/\s/g, "");

    const searchValue = searchTerm
      .toLowerCase()
      .replace(/\s/g, "");

    return optionName.includes(searchValue);
  });

  // ------------------------------------------------------------
  // SELECT OPTION
  // ------------------------------------------------------------
  const handleOptionClick = (optionId: string) => {
    onChange(optionId);

    setIsOpen(false);
    setSearchTerm("");
  };

  // ------------------------------------------------------------
  // CLEAR SELECTION
  // ------------------------------------------------------------
  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    onChange("");

    setSearchTerm("");
    setIsOpen(false);
  };

  // ------------------------------------------------------------
  // OPEN / CLOSE DROPDOWN
  // ------------------------------------------------------------
  const handleInputClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (disabled) {
      return;
    }

    event.stopPropagation();

    setIsOpen((previous) => !previous);
  };

  // ------------------------------------------------------------
  // SEARCH
  // ------------------------------------------------------------
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (disabled) {
      return;
    }

    setSearchTerm(event.target.value);
    setIsOpen(true);
  };

  return (
    <div
      className="relative w-full"
      ref={dropdownRef}
    >
      {/* ======================================================
          SEARCH INPUT
      ====================================================== */}
      <div
        className="relative cursor-pointer"
        onClick={handleInputClick}
      >
        <input
          ref={inputRef}
          type="text"
          value={
            searchTerm ||
            (isOpen ? "" : displayText)
          }
          onChange={handleSearchChange}
          placeholder={label}
          autoComplete="off"
          disabled={disabled}
          className={`w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-2 py-1 pr-8 text-xs text-[#001433] focus:border-[#4A628A] focus:outline-none ${
            !value && !searchTerm
              ? "text-gray-500"
              : ""
          } ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        />

        {/* ==================================================
            RIGHT ICON
        ================================================== */}
        <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value &&
          !searchTerm &&
          !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="pointer-events-auto ml-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </div>

      {/* ======================================================
          DROPDOWN
      ====================================================== */}
      {isOpen && !disabled && (
        <ul
          className="absolute z-20 max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 bg-white text-left shadow-lg"
          style={{
            top: "calc(100% + 2px)",
          }}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-2 py-1 text-xs text-gray-400">
              No Results Found
            </li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() =>
                  handleOptionClick(option.id)
                }
                className={`cursor-pointer px-2 py-1 text-xs text-[#001433] hover:bg-gray-100 ${
                  option.id === value
                    ? "bg-gray-200"
                    : ""
                }`}
              >
                {option.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
