// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useAppStore } from "@packages/store/appStore";
// import { getCurrentAppFromPath } from "@packages/config/getCurrentApp";

// export const useAppBootstrap = () => {
//   const location = useLocation();
//   const setApp = useAppStore((s) => s.setApp);

//   useEffect(() => {
//     const app = getCurrentAppFromPath(location.pathname);
//     setApp(app);
//   }, [location.pathname, setApp]);
// };
