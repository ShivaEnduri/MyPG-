import React from "react";
import {
  BedDouble,
  CalendarCheck,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";

interface DashboardStatsProps {
  occupiedBeds: number;
  totalBeds: number;
  availableBeds: number;
  occupancyPercentage: number;
  reservedBeds: number;
  upcomingVacancies: number;
  openIssues: number;
  overdueIssues: number;
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  occupiedBeds,
  totalBeds,
  availableBeds,
  occupancyPercentage,
  reservedBeds,
  upcomingVacancies,
  openIssues,
  overdueIssues,
  loading = false,
}) => {
  const stats = [
    {
      title: "Occupancy",
      icon: BedDouble,
      iconColor: "#2563D9",
      iconBg: "#EDF4FF",
      value: `${occupiedBeds}/${totalBeds}`,
      mainValue: `${occupancyPercentage}%`,
      subValue: "↑ 4% vs week",
      subColor: "#2D9B55",
    },
    {
      title: "Reservations",
      icon: CalendarCheck,
      iconColor: "#6A3FD5",
      iconBg: "#F5F0FF",
      value: `${reservedBeds} Reserved`,
      mainValue: `${availableBeds}`,
      mainSuffix: " Available",
      subValue: "next 15 days",
      subColor: "#4B5563",
    },
    {
      title: "Upcoming Vacancy",
      icon: CalendarDays,
      iconColor: "#2563D9",
      iconBg: "#EDF4FF",
      value: "",
      mainValue: `${upcomingVacancies}`,
      mainSuffix: " Beds",
      subValue: "next 15 days",
      subColor: "#4B5563",
    },
    {
      title: "Open Issues",
      icon: TriangleAlert,
      iconColor: "#E76A28",
      iconBg: "#FFF2EA",
      value: "",
      mainValue: `${openIssues}`,
      mainSuffix: "",
      subValue: `${overdueIssues} overdue`,
      subColor: "#E76A28",
    },
  ];

  return (
  <section
    className="
      mx-auto
      max-w-[1080px]
      px-2
      pt-0.5

      sm:px-4
      sm:pt-1
    "
  >
    <div
      className="
        grid
        grid-cols-4
        gap-[3px]

        sm:gap-4
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              flex
              h-[62px]
              min-w-0
              flex-col
              items-center
              rounded-[7px]
              border
              border-[#E4E7EC]
              bg-white
              px-0.5
              py-[3px]
              shadow-[0_1px_2px_rgba(0,0,0,0.025)]

              sm:h-[96px]
              sm:rounded-[9px]
              sm:px-0.5
              sm:py-1
            "
          >
            {/* ICON */}
            <div
              className="
                flex
                h-[19px]
                w-[19px]
                shrink-0
                items-center
                justify-center
                rounded-full

                sm:h-[31px]
                sm:w-[31px]
              "
              style={{
                backgroundColor: stat.iconBg,
              }}
            >
              <Icon
                size={10}
                strokeWidth={2}
                className="
                  sm:h-[15px]
                  sm:w-[15px]
                "
                style={{
                  color: stat.iconColor,
                }}
              />
            </div>

            {/* TITLE */}
            <p
  className="
    mt-[1px]
    flex
    min-h-[7px]
    max-w-full
    items-center
    justify-center
    truncate
    text-center
    text-[6px]
    font-medium
    leading-[7px]
    text-[#18181B]

    sm:mt-1
    sm:min-h-[14px]
    sm:text-[12px]
    sm:leading-[14px]
  "
>
 
              {stat.title}
            </p>

            {loading ? (
              <div
                className="
                  mt-[1px]
                  h-2.5
                  w-5
                  animate-pulse
                  rounded
                  bg-[#F1F2F4]
                "
              />
            ) : (
              <>
                {/* SECONDARY VALUE */}
                {stat.value && (
                  <p
  className="
    mt-[1px]
    max-w-full
    truncate
    text-center
    text-[6px]
    font-semibold
    leading-[7px]
    text-[#111827]

    sm:mt-0.5
    sm:text-[10px]
    sm:leading-[12px]
  "
>
  {stat.value}
</p>
                )}

                {/* MAIN VALUE */}
               <p
  className={`
    ${
      stat.value
        ? "mt-[1px]"
        : "mt-[2px]"
    }

    max-w-full
    truncate
    text-center
    text-[10px]
    font-bold
    leading-none

    sm:text-[14px]
  `}
  style={{
    color: stat.iconColor,
  }}
>
                  {stat.mainValue}

                  {stat.mainSuffix && (
                    <span
                      className="
                        ml-0.5
                        text-[5px]
                        font-semibold

                        sm:text-[9px]
                      "
                    >
                      {stat.mainSuffix}
                    </span>
                  )}
                </p>

                {/* SUBTEXT */}
                <p
  className="
    mt-[1px]
    max-w-full
    truncate
    text-center
    text-[5px]
    font-medium
    leading-[6px]

    sm:mt-1
    sm:text-[8px]
    sm:leading-[9px]
  "
  style={{
    color: stat.subColor,
  }}
>
  {stat.subValue}
</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  </section>
);
};

export default DashboardStats;