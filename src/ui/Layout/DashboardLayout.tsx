// import { useEffect, useState, FC } from "react";
// import { Outlet } from "react-router-dom"; // Outlet is where the child page renders
// // Assuming Navbar is a named export or default export from "./Navbar"
// import Navbar from "@/app/shared/components/Navbar"; // Your VERTICAL dashboard navbar

// // Define the component using the FC (Function Component) type
// export const DashboardLayout: FC = () => {
//   // Explicitly defining state types: boolean
//   const [isOpen, setIsOpen] = useState<boolean>(true);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [isTablet, setIsTablet] = useState<boolean>(false);

//   useEffect(() => {
//     // Define the type for the event handler's parameter (optional but good practice)
//       const handleResize = () => {
//       const width = window.innerWidth;
//       setIsMobile(width < 640); // Mobile: < 640px (sm breakpoint)
//       setIsTablet(width >= 640 && width < 1024); // Tablet: 640px - 1023px (sm to lg)
//     };

//     handleResize();
//     // No need to explicitly type 'window' as it's a global object
//     window.addEventListener("resize", handleResize);

//     // Explicitly define the return type for the cleanup function
//     return () => window.removeEventListener("resize", handleResize);
//   }, []); // Empty dependency array means it runs once on mount and cleanup on unmount

//   // Determine the CSS margin class based on state
//   const mainMarginClass: string = isMobile
//     ? " ml-0" // Mobile: top navbar, no left margin
//     : isTablet
//     ? " ml-0" // Tablet: horizontal top navbar, no left margin
//     : isOpen
//     ? "ml-48" // Desktop with open sidebar
//     : "ml-16"; // Desktop with closed sidebar

//   return (
//     <div className="flex app-shell">
     
//       <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

//       {/* Main content area */}
//       <main
//         className={`transition-all duration-300 flex-1 app-main ${mainMarginClass}`}
//       >
//         {/* This Outlet renders the protected page (e.g., ODashboardOwner) */}
//         <Outlet />
//       </main>
//     </div>
//   );
// };



import { useEffect, useState, FC } from "react";
import { Outlet } from "react-router-dom"; // Outlet is where the child page renders
// Assuming Navbar is a named export or default export from "./Navbar"
import Navbar from "@/app/shared/components/Navbar"; // Your VERTICAL dashboard navbar

// Define the component using the FC (Function Component) type
export const DashboardLayout: FC = () => {
  // Explicitly defining state types: boolean
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    // Define the type for the event handler's parameter (optional but good practice)
      const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // Mobile: < 640px (sm breakpoint)
      setIsTablet(width >= 640 && width < 1024); // Tablet: 640px - 1023px (sm to lg)
    };

    handleResize();
    // No need to explicitly type 'window' as it's a global object
    window.addEventListener("resize", handleResize);

    // Explicitly define the return type for the cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means it runs once on mount and cleanup on unmount

  // Determine the CSS margin class based on state
  const mainMarginClass: string = isMobile
    ? " ml-0" // Mobile: top navbar, no left margin
    : isTablet
    ? " ml-0" // Tablet: horizontal top navbar, no left margin
    : isOpen
    ? "ml-48" // Desktop with open sidebar
    : "ml-16"; // Desktop with closed sidebar

 return (
    <div className="flex app-shell">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className={`flex-1 min-w-0 app-main transition-all duration-300 ml-0 ${
          isOpen ? "lg:ml-60" : "lg:ml-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};