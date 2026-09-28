// src/PG/Common/LandingPage/PGUserLayout.tsx

import React, { FC } from "react";
import { Outlet } from "react-router-dom";
//import AppAwareNavbar from "../../../components/CommonViews/AppAwareNavbar";

// If your layout receives any props, define interface here.
// Right now it's unknown, so we keep it generic.
interface PGUserLayoutProps {
  [key: string]: any;
}

const PGUserLayout: FC<PGUserLayoutProps> = (props) => {
  return (
    <div className="flex w-full flex-col bg-white">
      {/* <AppAwareNavbar {...props} /> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PGUserLayout;
