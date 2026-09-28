

// @packages/ui/navbar/AppNavbar.tsx
import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  label: string | React.ReactNode;
  path?: string;
  onClick?: () => void;
  className?: string;
}

interface AppNavbarProps {
  logoText: string;
  logoImage?: string;
  bgClass?: string;
  menuItems: NavItem[];
  rightItems?: NavItem[];
  ProfileDropdown?: FC<any> | null;
  MenuDropdown?: FC<any> | null;
  tailwind?: any;
  isLoggedIn?: boolean;
  basePath?: string;
  isScrolled?: boolean;
}

const AppNavbar: FC<AppNavbarProps> = ({
  logoText,
  logoImage = "/RUFRENT6.png",
  bgClass = "bg-[#001433]",
  menuItems,
  rightItems = [],
  ProfileDropdown,
  MenuDropdown,
  tailwind,
  isLoggedIn = false,
  basePath = "/",
  isScrolled = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === basePath;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Width logic
  const navbarWidthClass = `
    w-full
    md:${isScrolled || !isHomePage ? "w-full" : "w-[calc(100vw-100px)] mx-auto"}
  `;

  return (
    <>
      <header
        className={`
          ${navbarWidthClass}
          ${bgClass}
          sticky top-0 left-0 z-50 
          shadow-md
          transition-all duration-300
        `}
      >
        <nav className="p-3 px-5 md:px-10 flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => navigate(basePath)}
            className="flex flex-col items-start flex-shrink-0"
          >
            <img src={logoImage} alt="logo" className={tailwind?.logo} />
            <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
              {logoText}
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Center menu items (Dashboard, etc.) */}
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick ?? (() => item.path && navigate(item.path))}
                className={item.className || tailwind?.header_item}
              >
                {item.label}
              </button>
            ))}

            {/* Right items (Login/Logout, Welcome, etc.) */}
            {rightItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className={item.className || tailwind?.header_item}
              >
                {item.label}
              </button>
            ))}

            {/* Profile Dropdown (if provided) */}
            {isLoggedIn && ProfileDropdown && <ProfileDropdown />}

            {/* Menu Dropdown (if provided) */}
            {MenuDropdown && <MenuDropdown />}
          </div>

          {/* Mobile: Right side */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Profile Dropdown (mobile) */}
            {isLoggedIn && ProfileDropdown && (
              <ProfileDropdown toggleMenu={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Login Button (mobile) */}
            {!isLoggedIn && rightItems[0]?.onClick && (
              <button
                onClick={rightItems[0].onClick}
                className="text-white hover:text-gray-300"
              >
                Login
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-xl text-white focus:outline-none"
            >
              {isMobileMenuOpen ? "×" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#001433] border-t border-gray-700 shadow-2xl">
            <div className="flex flex-col items-center py-8 space-y-7 px-5">
              {/* Center menu items */}
              {menuItems.map((item, i) => {
                // Special handling for React nodes
                if (typeof item.label !== "string") {
                  return (
                    <div key={i} className="w-full flex justify-center">
                      <button
                        onClick={() => {
                          item.onClick?.();
                          if (item.path) navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="inline-block"
                      >
                        {item.label}
                      </button>
                    </div>
                  );
                }

                // Normal text items
                return (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick?.();
                      if (item.path) navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={item.className || `${tailwind?.header_item}`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Right items (Login/Logout, etc.) */}
              {rightItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className={item.className || `${tailwind?.header_item} text-lg`}
                >
                  {item.label}
                </button>
              ))}

              {/* Shared MenuDropdown */}
              {MenuDropdown && (
                <div className="w-full flex justify-center">
                  <MenuDropdown onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AppNavbar;


// import {
//   FC,
//   useState,
// } from "react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";


// interface NavItem {
//   label: string | React.ReactNode;
//   path?: string;
//   onClick?: () => void;
//   className?: string;
// }


// interface AppNavbarProps {
//   logoText: string;
//   logoImage?: string;
//   bgClass?: string;
//   menuItems: NavItem[];
//   rightItems?: NavItem[];
//   ProfileDropdown?: FC<any> | null;
//   MenuDropdown?: FC<any> | null;
//   tailwind?: any;
//   isLoggedIn?: boolean;
//   basePath?: string;
//   isScrolled?: boolean;
// }


// const AppNavbar: FC<AppNavbarProps> = ({
//   logoText,
//   logoImage = "/RUFRENT6.png",
//   bgClass = "bg-[#001433]",
//   menuItems,
//   rightItems = [],
//   ProfileDropdown,
//   MenuDropdown,
//   tailwind,
//   isLoggedIn = false,
//   basePath = "/",
//   isScrolled = false,
// }) => {

//   const navigate =
//     useNavigate();

//   const location =
//     useLocation();

//   const isHomePage =
//     location.pathname === basePath;

//   const [
//     isMobileMenuOpen,
//     setIsMobileMenuOpen,
//   ] = useState(false);


//   const navbarWidthClass = `
//     w-full
//     md:${
//       isScrolled || !isHomePage
//         ? "w-full"
//         : "w-[calc(100vw-100px)] mx-auto"
//     }
//   `;


//   const handleLogin = () => {

//     setIsMobileMenuOpen(false);

//     navigate("/login");
//   };


//   return (
//     <header
//       className={`
//         ${navbarWidthClass}
//         ${bgClass}
//         sticky
//         top-0
//         left-0
//         z-50
//         shadow-md
//         transition-all
//         duration-300
//       `}
//     >

//       <nav
//         className="
//           p-3
//           px-5
//           md:px-10
//           flex
//           items-center
//           justify-between
//           h-full
//         "
//       >

//         {/* ==================================================
//             LOGO
//         ================================================== */}

//         <button
//           onClick={() =>
//             navigate(basePath)
//           }
//           className="
//             flex
//             flex-col
//             items-start
//             flex-shrink-0
//           "
//         >

//           <img
//             src={logoImage}
//             alt="logo"
//             className={tailwind?.logo}
//           />

//           <span
//             className="
//               text-xs
//               md:text-sm
//               lg:text-md
//               pl-1
//               tracking-widest
//               text-white
//             "
//           >

//             {logoText}

//           </span>

//         </button>


//         {/* ==================================================
//             DESKTOP
//         ================================================== */}

//         <div
//           className="
//             hidden
//             lg:flex
//             items-center
//             space-x-6
//           "
//         >

//           {menuItems.map(
//             (item, index) => (

//               <button
//                 key={index}
//                 onClick={() => {

//                   item.onClick?.();

//                   if (item.path) {
//                     navigate(item.path);
//                   }

//                 }}
//                 className={
//                   item.className ||
//                   tailwind?.header_item
//                 }
//               >

//                 {item.label}

//               </button>

//             )
//           )}


//           {/* Right items */}

//           {rightItems.map(
//             (item, index) => (

//               <button
//                 key={index}
//                 onClick={() => {

//                   if (item.onClick) {
//                     item.onClick();
//                   } else if (item.path) {
//                     navigate(item.path);
//                   }

//                 }}
//                 className={
//                   item.className ||
//                   tailwind?.header_item
//                 }
//               >

//                 {item.label}

//               </button>

//             )
//           )}


//           {isLoggedIn &&
//             ProfileDropdown && (
//               <ProfileDropdown />
//             )}


//           {MenuDropdown && (
//             <MenuDropdown />
//           )}

//         </div>


//         {/* ==================================================
//             MOBILE
//         ================================================== */}

//         <div
//           className="
//             flex
//             items-center
//             gap-4
//             lg:hidden
//           "
//         >

//           {isLoggedIn &&
//             ProfileDropdown && (

//               <ProfileDropdown
//                 toggleMenu={() =>
//                   setIsMobileMenuOpen(false)
//                 }
//               />

//             )}


//           {!isLoggedIn && (

//             <button
//               onClick={handleLogin}
//               className="
//                 text-white
//                 font-medium
//                 hover:text-gray-300
//               "
//             >

//               Login

//             </button>

//           )}


//           <button
//             onClick={() =>
//               setIsMobileMenuOpen(
//                 (value) => !value
//               )
//             }
//             className="
//               text-xl
//               text-white
//               focus:outline-none
//             "
//           >

//             {isMobileMenuOpen
//               ? "×"
//               : "☰"}

//           </button>

//         </div>

//       </nav>


//       {/* ====================================================
//           MOBILE MENU
//       ==================================================== */}

//       {isMobileMenuOpen && (

//         <div
//           className="
//             lg:hidden
//             w-full
//             bg-[#001433]
//             border-t
//             border-gray-700
//             shadow-2xl
//           "
//         >

//           <div
//             className="
//               flex
//               flex-col
//               items-center
//               py-8
//               space-y-7
//               px-5
//             "
//           >

//             {menuItems.map(
//               (item, index) => (

//                 <button
//                   key={index}
//                   onClick={() => {

//                     item.onClick?.();

//                     if (item.path) {
//                       navigate(item.path);
//                     }

//                     setIsMobileMenuOpen(false);

//                   }}
//                   className={
//                     item.className ||
//                     tailwind?.header_item
//                   }
//                 >

//                   {item.label}

//                 </button>

//               )
//             )}


//             {!isLoggedIn && (

//               <button
//                 onClick={handleLogin}
//                 className="
//                   text-white
//                   text-lg
//                   font-medium
//                 "
//               >

//                 Login

//               </button>

//             )}


//             {rightItems.map(
//               (item, index) => (

//                 <button
//                   key={index}
//                   onClick={() => {

//                     item.onClick?.();

//                     if (item.path) {
//                       navigate(item.path);
//                     }

//                     setIsMobileMenuOpen(false);

//                   }}
//                   className={
//                     item.className ||
//                     `${tailwind?.header_item} text-lg`
//                   }
//                 >

//                   {item.label}

//                 </button>

//               )
//             )}


//             {MenuDropdown && (

//               <div
//                 className="
//                   w-full
//                   flex
//                   justify-center
//                 "
//               >

//                 <MenuDropdown
//                   onCloseMobileMenu={() =>
//                     setIsMobileMenuOpen(false)
//                   }
//                 />

//               </div>

//             )}

//           </div>

//         </div>

//       )}

//     </header>
//   );
// };


// export default AppNavbar;