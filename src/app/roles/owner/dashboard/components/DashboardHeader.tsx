
import React, { useState } from "react";
import { Bell, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  pgName: string;
  ownerName: string;
  notificationCount?: number;
  onPgClick?: () => void;
  onNotificationClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  pgName,
  ownerName,
  notificationCount = 0,
  onPgClick,
  onNotificationClick,
}) => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<"Owner" | "Manager">(
    "Owner"
  );

  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const handleRoleChange = (role: "Owner" | "Manager") => {
    setSelectedRole(role);
    setIsRoleOpen(false);

    if (role === "Manager") {
      navigate("/owner/manager-dashboard");
    }
  };

  return (
    <header className="bg-white">
      <div
        className="
          mx-auto
          max-w-[1080px]
          px-2
          pt-2

          sm:px-4
          sm:pt-2.5
        "
      >
        {/* =====================================================
            TOP ROW
        ====================================================== */}
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div
            className="
              text-[16px]
              font-bold
              leading-none
              tracking-tight
              text-[#2463D4]

              sm:text-[23px]
            "
          >
            MyPG
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* =================================================
                ROLE DROPDOWN
            ================================================== */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleOpen((prev) => !prev)}
                className="
                  flex
                  h-6
                  min-w-[62px]
                  items-center
                  justify-between
                  gap-1
                  rounded-[6px]
                  border
                  border-[#E1E4EA]
                  bg-white
                  px-1.5
                  text-[7px]
                  font-semibold
                  leading-none
                  text-[#171717]
                  shadow-[0_1px_2px_rgba(0,0,0,0.025)]
                  transition-colors
                  hover:bg-[#F8FAFC]

                  sm:h-8
                  sm:min-w-[78px]
                  sm:rounded-[8px]
                  sm:px-2.5
                  sm:text-[10px]
                "
                aria-haspopup="listbox"
                aria-expanded={isRoleOpen}
              >
                <span className="truncate">{selectedRole}</span>

                <ChevronDown
                  size={9}
                  strokeWidth={2}
                  className={`
                    shrink-0
                    text-[#333]
                    transition-transform
                    duration-200
                    ${isRoleOpen ? "rotate-180" : ""}
                    
                    sm:h-[13px]
                    sm:w-[13px]
                  `}
                />
              </button>

              {/* ROLE MENU */}
              {isRoleOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[29px]
                    z-50
                    w-[100px]
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-[#E5E7EB]
                    bg-white
                    py-1
                    shadow-[0_8px_24px_rgba(0,0,0,0.10)]

                    sm:top-[38px]
                    sm:w-[125px]
                    sm:rounded-[10px]
                  "
                  role="listbox"
                >
                  {/* OWNER */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange("Owner")}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-2.5
                      py-2
                      text-left
                      text-[8px]
                      font-medium
                      text-[#171717]
                      transition-colors
                      hover:bg-[#F5F8FF]

                      sm:px-3
                      sm:py-2.5
                      sm:text-[10px]
                    "
                    role="option"
                    aria-selected={selectedRole === "Owner"}
                  >
                    <span>Owner</span>

                    {selectedRole === "Owner" && (
                      <Check
                        size={10}
                        strokeWidth={2.5}
                        className="text-[#2463D4] sm:h-3.5 sm:w-3.5"
                      />
                    )}
                  </button>

                  {/* MANAGER */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange("Manager")}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-2.5
                      py-2
                      text-left
                      text-[8px]
                      font-medium
                      text-[#171717]
                      transition-colors
                      hover:bg-[#F5F8FF]

                      sm:px-3
                      sm:py-2.5
                      sm:text-[10px]
                    "
                    role="option"
                    aria-selected={selectedRole === "Manager"}
                  >
                    <span>Manager</span>

                    {selectedRole === "Manager" && (
                      <Check
                        size={10}
                        strokeWidth={2.5}
                        className="text-[#2463D4] sm:h-3.5 sm:w-3.5"
                      />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                NOTIFICATION
            ================================================== */}
            <button
              type="button"
              onClick={onNotificationClick}
              className="
                relative
                flex
                h-6
                w-6
                items-center
                justify-center

                sm:h-8
                sm:w-8
              "
              aria-label="Notifications"
            >
              <Bell
                size={15}
                strokeWidth={1.8}
                className="
                  text-[#111827]

                  sm:h-[20px]
                  sm:w-[20px]
                "
              />

              {notificationCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-[11px]
                    min-w-[11px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E85D2A]
                    px-[1px]
                    text-[6px]
                    font-bold
                    leading-none
                    text-white

                    sm:h-[14px]
                    sm:min-w-[14px]
                    sm:text-[8px]
                  "
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            GREETING + PG SELECTOR
        ====================================================== */}
        <div
          className="
            mt-1
            flex
            items-center
            justify-between
            gap-1

            sm:mt-2.5
            sm:gap-2
          "
        >
          {/* GREETING */}
          <p
            className="
              min-w-0
              truncate
              text-[8px]
              leading-[10px]
              text-[#171717]

              sm:text-[13px]
              sm:leading-5
            "
          >
            Good Morning,{" "}
            <span className="font-bold">{ownerName}</span>
          </p>

          {/* PG SELECTOR */}
          <button
            type="button"
            onClick={onPgClick}
            className="
              flex
              h-[24px]
              min-w-[72px]
              max-w-[100px]
              shrink-0
              items-center
              justify-between
              gap-1
              rounded-[6px]
              border
              border-[#E1E4EA]
              bg-white
              px-1.5
              text-[7px]
              font-medium
              leading-none
              text-[#171717]
              shadow-[0_1px_2px_rgba(0,0,0,0.025)]

              sm:h-[34px]
              sm:min-w-[105px]
              sm:max-w-[135px]
              sm:rounded-[8px]
              sm:px-2.5
              sm:text-[10px]
            "
          >
            <span className="min-w-0 truncate">{pgName}</span>

            <ChevronDown
              size={10}
              strokeWidth={1.8}
              className="
                shrink-0
                text-[#333]

                sm:h-[14px]
                sm:w-[14px]
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;