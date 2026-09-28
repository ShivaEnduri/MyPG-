import React, { FC } from "react";
import { Outlet } from "react-router-dom";
//import AppAwareNavbar from "../../utils/AppAwareNavbar";
//import FooterSection from "../../../apps/rentals/src/app/pages/landingpage/FooterSection";

const UserLayout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <AppAwareNavbar /> */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <FooterSection /> */}
    </div>
  );
};

export default UserLayout;
