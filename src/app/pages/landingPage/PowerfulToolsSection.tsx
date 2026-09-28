import React from "react";
import dashboardImg from "@/app/shared/assests/toolsImg.png";
import roomImg from "@/app/shared/assests/room.png";
import ruppeeImg from "@/app/shared/assests/ruppee.png";
import automationBell from "@/app/shared/assests/bell.png";
import mdiBed from "@/app/shared/assests/mdiBed.png";

export interface ToolCard {
  icon: string;
  title: string;
  description: string;
}

export interface PowerfulToolsSectionProps {
  subtitle?: string;
  title?: string;
  tools?: ToolCard[];
  dashboardImage?: string;
}

const defaultTools: ToolCard[] = [
  {
    icon: roomImg,
    title: "Occupancy & Room Status Overview",
    description: "See vacancies, upcoming check-ins, and room readiness at a glance.",
  },
  {
    icon: ruppeeImg,
    title: "Financial Snapshots & Reports",
    description: "Monitor receivables, payouts, and quick summaries for every property.",
  },
  {
    icon: automationBell,
    title: "Automated Billing & Rent Reminders",
    description: "Send scheduled bills, reminders, and confirmations without manual effort.",
  },
  {
    icon: mdiBed,
    title: "Guest Self-Service",
    description: "Give guests easy self-check-in, payments, and request tracking from mobile.",
  },
];

export const PowerfulToolsSection: React.FC<PowerfulToolsSectionProps> = ({
  subtitle = "Powerful Tools Included",
  title = "Everything you need to run PG operations smoothly",
  tools = defaultTools,
  dashboardImage = dashboardImg,
}) => {
  return (
    <div>
      <div>
        <p className="text-center text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase mb-3">
          {subtitle}
        </p>
        <div className="w-full">
          <h3 className="text-center text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
            {title}
          </h3>
        </div>
      </div>
      {/* POWERFUL TOOLS SECTION */}
      <section className="px-4 py-10 bg-white">
        <div className="max-w-6xl xl:max-w-7xl mx-auto grid gap-10 lg:gap-14 items-center lg:grid-cols-[1fr_1.1fr]">
          <div className="flex justify-center">
            <img
              src={dashboardImage}
              alt="Dashboard illustration"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {tools.map((card, idx) => (
                <div
                  key={card.title}
                  className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-[0_15px_35px_rgba(31,41,55,0.08)] hover:-translate-y-1 transition-transform"
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                      {card.title}
                    </h4>
                    <p className="text-sm sm:text-[15px] text-gray-600 leading-snug">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

