import React from "react";
import {
  UserPlus,
  Megaphone,
  Users,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onAddEnquiry?: () => void;
  onBroadcast?: () => void;
  onViewResidents?: () => void;
  onReports?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddEnquiry,
  onBroadcast,
  onViewResidents,
  onReports,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Enquiry",
      icon: UserPlus,
      color: "#2563D9",
      bg: "#EFF5FF",
      onClick: () => {
        onAddEnquiry?.();
        navigate("/owner/vacancy-pipeline");
      },
    },
    {
      title: "Broadcast",
      icon: Megaphone,
      color: "#27A95A",
      bg: "#EFFAF3",
      onClick: () => {
        onBroadcast?.();
        navigate("/owner/broadcast");
      },
    },
    {
      title: "View Residents",
      icon: Users,
      color: "#6841D7",
      bg: "#F6F1FF",
      onClick: () => {
        onViewResidents?.();
        navigate("/owner/residents");
      },
    },
    {
      title: "Reports",
      icon: BarChart3,
      color: "#E59632",
      bg: "#FFF7ED",
      onClick: () => {
        onReports?.();
        navigate("/owner/reports");
      },
    },
  ];

  return (
    <section
      className="
        rounded-[10px]
        border
        border-[#E3E6EB]
        bg-white
        p-1.5
        shadow-[0_1px_4px_rgba(0,0,0,0.035)]

        sm:rounded-[14px]
        sm:p-3
      "
    >
      {/* HEADER */}
      <h2
        className="
          text-[10px]
          font-semibold
          leading-3
          text-[#111827]

          sm:text-[14px]
          sm:leading-5
        "
      >
        Quick Actions
      </h2>

      {/* ACTIONS */}
      <div
        className="
          mt-1
          grid
          grid-cols-4
          gap-1

          sm:mt-2
          sm:gap-2
        "
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              className="
                flex
                h-[55px]
                min-w-0
                flex-col
                items-center
                justify-center
                rounded-[7px]
                border
                border-[#E6E9EE]
                px-0.5

                sm:h-[82px]
                sm:rounded-[10px]
                sm:px-1
              "
              style={{
                backgroundColor: action.bg,
              }}
            >
              {/* ICON */}
              <div
                className="
                  flex
                  h-[22px]
                  w-[22px]
                  items-center
                  justify-center
                  rounded-full

                  sm:h-[38px]
                  sm:w-[38px]
                "
                style={{
                  backgroundColor: action.bg,
                }}
              >
                <Icon
                  size={12}
                  strokeWidth={2}
                  className="
                    sm:h-[20px]
                    sm:w-[20px]
                  "
                  style={{
                    color: action.color,
                  }}
                />
              </div>

              {/* TEXT */}
              <span
                className="
                  mt-0.5
                  max-w-full
                  truncate
                  text-center
                  text-[6.5px]
                  font-medium
                  leading-3
                  text-[#24272D]

                  sm:mt-1
                  sm:text-[11px]
                  sm:leading-4
                "
              >
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;