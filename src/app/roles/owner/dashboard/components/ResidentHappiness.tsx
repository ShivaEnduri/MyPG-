import React from "react";
import {
  Smile,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
interface ResidentHappinessProps {
  averageRating?: number;
  resolvedThisWeek?: number;
  overdueIssues?: number;
  totalOpen?: number;
  loading?: boolean;
  onReviewIssues?: () => void;
}

const ResidentHappiness: React.FC<ResidentHappinessProps> = ({
  averageRating = 0,
  resolvedThisWeek = 0,
  overdueIssues = 0,
  totalOpen = 0,
  loading = false,
  onReviewIssues,
}) => {
  const safeRating =
    typeof averageRating === "number" &&
    !Number.isNaN(averageRating)
      ? averageRating
      : 0;
  const navigate = useNavigate();

const handleReviewIssues = () => {
  navigate("/owner/resident-happiness");
};


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
      p-[7px]
      shadow-[0_1px_3px_rgba(0,0,0,0.035)]

      sm:rounded-[11px]
      sm:p-2.5
    "
  >
    {/* ======================================================
        HEADER
    ======================================================= */}

    <div className="flex items-center justify-between">
      <h2
        className="
          min-w-0
          truncate
          text-[8px]
          font-semibold
          leading-3
          text-[#111827]

          sm:text-[14px]
          sm:leading-5
        "
      >
        Resident Happiness
      </h2>

      <div
        className="
          flex
          h-[19px]
          w-[19px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#ECFAF1]

          sm:h-[30px]
          sm:w-[30px]
        "
      >
        <Smile
          size={10}
          className="
            text-[#2AA85A]

            sm:h-[16px]
            sm:w-[16px]
          "
        />
      </div>
    </div>

    {/* ======================================================
        CONTENT
    ======================================================= */}

    <div className="min-h-0 flex-1">
      {loading ? (
        <div className="mt-1.5 animate-pulse space-y-1.5">
          <div
            className="
              h-4
              w-9
              rounded
              bg-[#F1F2F4]

              sm:h-5
              sm:w-12
            "
          />

          <div
            className="
              h-6
              rounded
              bg-[#F6F7F8]

              sm:h-8
            "
          />
        </div>
      ) : (
        <>
          {/* ==================================================
              SCORE + GRAPH
          =================================================== */}

          <div
            className="
              mt-1
              flex
              items-end
              justify-between
              gap-1

              sm:mt-2.5
              sm:gap-2
            "
          >
            {/* RATING */}

            <div>
              <p
                className="
                  text-[6px]
                  leading-2
                  text-[#777E8B]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                Avg Rating
              </p>

              <div className="mt-0.5 flex items-end gap-0.5">
                <span
                  className="
                    text-[14px]
                    font-bold
                    leading-none
                    text-[#2AA85A]

                    sm:text-[22px]
                  "
                >
                  {safeRating.toFixed(1)}
                </span>

                <span
                  className="
                    mb-0.5
                    text-[6px]
                    leading-none
                    text-[#777E8B]

                    sm:text-[10px]
                  "
                >
                  /5
                </span>
              </div>
            </div>

            {/* GRAPH */}

            <div
              className="
                h-[17px]
                flex-1

                sm:h-[27px]
              "
            >
              <svg
                viewBox="0 0 180 50"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,32 20,25 40,35 60,28 80,36 100,18 120,24 140,14 160,18 180,5"
                  fill="none"
                  stroke="#2AA85A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* ==================================================
              STATS
          =================================================== */}

          <div
            className="
              mt-1.5
              grid
              grid-cols-3
              divide-x
              divide-[#EDEEF1]
              border-t
              border-[#EDEEF1]
              pt-1

              sm:mt-2.5
              sm:pt-2.5
            "
          >
            {/* RESOLVED */}

            <div className="pr-0.5">
              <p
                className="
                  truncate
                  text-[5.5px]
                  leading-2
                  text-[#777E8B]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                Resolved
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-bold
                  leading-none
                  text-[#2AA85A]

                  sm:text-[17px]
                "
              >
                {resolvedThisWeek}
              </p>
            </div>

            {/* OVERDUE */}

            <div className="px-0.5">
              <p
                className="
                  truncate
                  text-[5.5px]
                  leading-2
                  text-[#777E8B]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                Overdue
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-bold
                  leading-none
                  text-[#E76A28]

                  sm:text-[17px]
                "
              >
                {overdueIssues}
              </p>
            </div>

            {/* TOTAL OPEN */}

            <div className="pl-0.5">
              <p
                className="
                  truncate
                  text-[5.5px]
                  leading-2
                  text-[#777E8B]

                  sm:text-[10px]
                  sm:leading-3
                "
              >
                Total Open
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-bold
                  leading-none
                  text-[#292D33]

                  sm:text-[17px]
                "
              >
                {totalOpen}
              </p>
            </div>
          </div>
        </>
      )}
    </div>

    {/* ======================================================
        BUTTON
    ======================================================= */}

    <button
      type="button"
      onClick={handleReviewIssues}
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

        sm:mt-2
        sm:h-[34px]
        sm:rounded-[7px]
        sm:gap-1
        sm:text-[11px]
      "
    >
      <span>Review Issues</span>

      <ChevronRight
        size={9}
        className="
          sm:h-4
          sm:w-4
        "
      />
    </button>
  </section>
);
};

export default ResidentHappiness;