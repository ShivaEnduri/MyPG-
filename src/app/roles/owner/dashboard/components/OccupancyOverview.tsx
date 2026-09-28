import React from "react";
import {
  ChevronRight,
  Info,
} from "lucide-react";

interface OccupancyOverviewProps {
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  occupancyPercentage: number;
  loading?: boolean;
  onViewBedMap?: () => void;
}

const OccupancyOverview: React.FC<OccupancyOverviewProps> = ({
  totalBeds,
  occupiedBeds,
  vacantBeds,
  occupancyPercentage,
  loading = false,
  onViewBedMap,
}) => {
  const total =
    occupiedBeds + vacantBeds > 0
      ? occupiedBeds + vacantBeds
      : totalBeds;

  const occupiedPercent =
    total > 0
      ? (occupiedBeds / total) * 100
      : 0;

  return (
  <section
    className="
      flex
      h-full
      min-w-0
      flex-col
      rounded-[8px]
      border
      border-[#E3E6EB]
      bg-white
      p-1.5
      shadow-[0_1px_3px_rgba(0,0,0,0.03)]

      sm:rounded-[11px]
      sm:p-2.5
    "
  >
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <h2
        className="
          truncate
          text-[8px]
          font-semibold
          leading-[10px]
          text-[#111827]

          sm:text-[13px]
          sm:leading-4
        "
      >
        Occupancy Overview
      </h2>

      <Info
        size={10}
        strokeWidth={1.8}
        className="
          shrink-0
          text-[#777E8B]

          sm:h-[16px]
          sm:w-[16px]
        "
      />
    </div>

    {/* CONTENT */}
    <div className="flex min-h-0 flex-1 items-center">
      {loading ? (
        <div
          className="
            h-[52px]
            w-full
            animate-pulse
            rounded-lg
            bg-[#F6F7F8]

            sm:h-[68px]
          "
        />
      ) : (
        <div
          className="
            flex
            w-full
            items-center

            sm:gap-3
          "
        >
          {/* ==================================================
              DONUT
          ================================================== */}
          <div
            className="
              relative
              h-[46px]
              w-[46px]
              shrink-0

              sm:h-[82px]
              sm:w-[82px]
            "
          >
            {/* OUTER DONUT */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #2563D9 0% ${occupiedPercent}%,
                  #46B96C ${occupiedPercent}% 100%
                )`,
              }}
            />

            {/* INNER CIRCLE */}
            <div
              className="
                absolute
                inset-[5px]
                flex
                flex-col
                items-center
                justify-center
                rounded-full
                bg-white

                sm:inset-[9px]
              "
            >
              <span
                className="
                  text-[9px]
                  font-bold
                  leading-none
                  text-[#111827]

                  sm:text-[18px]
                "
              >
                {occupancyPercentage}%
              </span>

              <span
                className="
                  mt-[1px]
                  text-[5px]
                  leading-none
                  text-[#30343B]

                  sm:mt-0.5
                  sm:text-[8px]
                "
              >
                Occupied
              </span>
            </div>
          </div>

          {/* ==================================================
              LEGEND
              PUSHED TOWARD RIGHT END
          ================================================== */}
          <div
            className="
              ml-auto
              flex
              min-w-0
              flex-col
              justify-center
              gap-1
              text-right

              sm:gap-2
              sm:pr-1
            "
          >
            {/* OCCUPIED */}
            <div>
              <div className="flex items-center justify-end gap-1">
                <span
                  className="
                    h-[4px]
                    w-[4px]
                    shrink-0
                    rounded-full
                    bg-[#2563D9]

                    sm:h-[8px]
                    sm:w-[8px]
                  "
                />

                <span
                  className="
                    truncate
                    text-[6px]
                    font-medium
                    leading-[7px]
                    text-[#292D33]

                    sm:text-[11px]
                    sm:leading-4
                  "
                >
                  Occupied
                </span>
              </div>

              <p
                className="
                  mt-0
                  text-[6px]
                  leading-[7px]
                  text-[#4B5563]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                {occupiedBeds} Beds
              </p>
            </div>

            {/* VACANT */}
            <div>
              <div className="flex items-center justify-end gap-1">
                <span
                  className="
                    h-[4px]
                    w-[4px]
                    shrink-0
                    rounded-full
                    bg-[#46B96C]

                    sm:h-[8px]
                    sm:w-[8px]
                  "
                />

                <span
                  className="
                    truncate
                    text-[6px]
                    font-medium
                    leading-[7px]
                    text-[#292D33]

                    sm:text-[11px]
                    sm:leading-4
                  "
                >
                  Vacant
                </span>
              </div>

              <p
                className="
                  mt-0
                  text-[6px]
                  leading-[7px]
                  text-[#4B5563]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                {vacantBeds} Beds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* BUTTON */}
    <button
      type="button"
      onClick={onViewBedMap}
      className="
        mt-1
        flex
        h-[22px]
        w-full
        shrink-0
        items-center
        justify-center
        gap-0.5
        rounded-[5px]
        border
        border-[#E4E8EE]
        bg-white
        text-[6px]
        font-medium
        leading-none
        text-[#2563C9]

        sm:mt-1.5
        sm:h-[32px]
        sm:rounded-[7px]
        sm:text-[10px]
      "
    >
      <span>View Bed Map</span>

      <ChevronRight
        size={8}
        strokeWidth={2}
        className="
          sm:h-3.5
          sm:w-3.5
        "
      />
    </button>
  </section>
);
};

export default OccupancyOverview;