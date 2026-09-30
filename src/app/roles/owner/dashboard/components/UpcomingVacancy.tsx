import React from "react";
import {
  CalendarDays,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* ============================================================
   TYPES
============================================================ */

export interface VacancyItem {
  roomName: string;
  date: string;

  bedNumber?: number | string;
  bedId?: number | string;
}

interface UpcomingVacancyProps {
  vacancies: VacancyItem[];
  loading?: boolean;
  onViewAll?: () => void;
}

/* ============================================================
   COMPONENT
============================================================ */

const UpcomingVacancy: React.FC<UpcomingVacancyProps> = ({
  vacancies,
  loading = false,
  onViewAll,
}) => {


   const navigate = useNavigate();


  const handleVacancyPipeline = () => {
  navigate("/owner/vacancy-pipeline");
};


  return (
    <section
      className="
        relative
        flex
        h-full
        min-h-0
        min-w-0
        flex-col
        overflow-hidden
        rounded-[6px]
        border
        border-[#E3E6EB]
        bg-white
        p-[5px]
        shadow-[0_1px_3px_rgba(0,0,0,0.035)]

        sm:rounded-[8px]
        sm:p-[7px]
      "
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex shrink-0 items-center justify-between">
        <h2
          className="
            truncate
            text-[8px]
            font-semibold
            leading-[9px]
            text-[#111827]

            sm:text-[11px]
            sm:leading-[14px]
          "
        >
          Upcoming Vacancy
        </h2>

        <CalendarDays
          size={9}
          strokeWidth={1.8}
          className="
            shrink-0
            text-[#777E8B]

            sm:h-[14px]
            sm:w-[14px]
          "
        />
      </div>

      {/* ======================================================
          CONTENT WRAPPER

          IMPORTANT:
          This wrapper does NOT control card height.
      ======================================================= */}

      <div
        className="
          relative
          mt-[2px]
          min-h-0
          flex-1

          sm:mt-[5px]
        "
      >
        {/* ====================================================
            MOBILE SCROLL AREA

            Exactly 3 rows.
        ===================================================== */}

        <div
          className="
            h-[66px]
            w-full
            overflow-y-auto
            overflow-x-hidden

            sm:absolute
            sm:inset-0
            sm:h-auto
            sm:max-h-full

            [&::-webkit-scrollbar]:w-[3px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#D9DDE4]
            [&::-webkit-scrollbar-thumb:hover]:bg-[#BFC5CF]
          "
        >
          {/* ==================================================
              LOADING
          =================================================== */}

          {loading ? (
            <div className="w-full space-y-[2px]">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-[22px]
                    w-full
                    animate-pulse
                    rounded-[3px]
                    bg-[#F6F7F8]

                    sm:h-[26px]
                  "
                />
              ))}
            </div>
          ) : vacancies.length === 0 ? (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <div
              className="
                flex
                h-full
                min-h-[37px]
                w-full
                items-center
                justify-center
                text-center

                sm:min-h-[60px]
              "
            >
              <div className="flex flex-col items-center gap-[2px]">
                <CalendarDays
                  size={11}
                  strokeWidth={1.6}
                  className="
                    text-[#A7AFBC]

                    sm:h-[14px]
                    sm:w-[14px]
                  "
                />

                <p
                  className="
                    text-[7px]
                    font-medium
                    leading-[9px]
                    text-[#777E8B]

                    sm:text-[10px]
                    sm:leading-[12px]
                  "
                >
                  No upcoming vacancies
                </p>

                <p
                  className="
                    max-w-[92px]
                    text-[6.5px]
                    leading-[8px]
                    text-[#9CA3AF]

                    sm:max-w-[150px]
                    sm:text-[9px]
                    sm:leading-[11px]
                  "
                >
                  No beds becoming vacant in the next 15 days
                </p>
              </div>
            </div>
          ) : (
            /* =================================================
               VACANCY LIST
            ================================================= */

            <div className="w-full">
              {vacancies.map((vacancy, index) => (
                <div
                  key={
                    vacancy.bedId ??
                    `${vacancy.roomName}-${vacancy.bedNumber ?? ""}-${vacancy.date}-${index}`
                  }
                  className={`
                    flex
                    h-[22px]
                    w-full
                    items-center
                    justify-between
                    gap-[3px]

                    sm:h-[26px]
                    sm:gap-[5px]

                    ${
                      index < vacancies.length - 1
                        ? "border-b border-[#E9EBEF]"
                        : ""
                    }
                  `}
                >
                  {/* ==========================================
                      LEFT SIDE
                  =========================================== */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-[3px]

                      sm:gap-[5px]
                    "
                  >
                    {/* CALENDAR CIRCLE */}

                    <div
                      className="
                        flex
                        h-[15px]
                        w-[15px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EDF4FF]

                        sm:h-[20px]
                        sm:w-[20px]
                      "
                    >
                      <CalendarDays
                        size={9}
                        strokeWidth={1.8}
                        className="
                          text-[#2563D9]

                          sm:h-[12px]
                          sm:w-[12px]
                        "
                      />
                    </div>

                    {/* ROOM + BED */}

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          block
                          overflow-hidden
                          text-ellipsis
                          whitespace-nowrap
                          text-[7px]
                          font-medium
                          leading-[9px]
                          text-[#292D33]

                          sm:text-[10px]
                          sm:leading-[12px]
                        "
                        title={vacancy.roomName}
                      >
                        {vacancy.roomName}
                      </p>

                      {vacancy.bedNumber !== undefined && (
                        <p
                          className="
                            text-[6px]
                            leading-[8px]
                            text-[#8A919D]

                            sm:text-[8px]
                            sm:leading-[10px]
                          "
                        >
                          Bed {vacancy.bedNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ==========================================
                      DATE
                  =========================================== */}

                  <div className="shrink-0 text-right">
                    <p
                      className="
                        whitespace-nowrap
                        text-[6.5px]
                        font-medium
                        leading-[9px]
                        text-[#4B5563]

                        sm:text-[9px]
                        sm:leading-[12px]
                      "
                    >
                      {vacancy.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          BOTTOM BUTTON
          ALWAYS FIXED
      ======================================================= */}

      <button
        type="button"
        onClick={handleVacancyPipeline}
        // disabled={!onViewAll}
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
        <span>Start Follow-up</span>

        <ChevronRight
          size={8}
          strokeWidth={2}
          className="
            sm:h-[10px]
            sm:w-[10px]
          "
        />
      </button>
    </section>
  );
};

export default UpcomingVacancy;