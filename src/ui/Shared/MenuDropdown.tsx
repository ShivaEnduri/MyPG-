// apps/rentals/src/components/Navbar/MenuDropdown.tsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import tailwindStyles from "../../styles/tailwindStyles";
import { FOOTER_PATH } from "@/config/constants";
import { getFooterSections } from "../Footer/footerSection";

interface MenuDropdownProps {
  onCloseMobileMenu?: () => void;
  app?: string;
}

interface FooterSection {
  id: string;
  label: string;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ onCloseMobileMenu, app = "rentals" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sections: FooterSection[] = getFooterSections(app);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleItemClick = () => {
    setIsOpen(false);
    onCloseMobileMenu?.();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="hidden lg:flex relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`${tailwindStyles.header_item} flex items-center`}
      >
        Menu
      </button>

      {isOpen && (
        <div className="absolute top-8 -right-10 mt-2 w-32 bg-white rounded-md shadow-lg z-50">
          {sections.map((section) => (
            <NavLink
              key={section.id}
              to={`${FOOTER_PATH}/${section.id}?app=${app}`}
              className={({ isActive }) =>
                `block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${tailwindStyles.header_item} ${
                  isActive ? "text-[#001433] font-bold underline" : ""
                }`
              }
              onClick={handleItemClick}
            >
              {section.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;