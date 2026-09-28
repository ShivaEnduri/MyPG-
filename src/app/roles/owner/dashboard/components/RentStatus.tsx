import React from "react";
import {
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RentStatusProps {
  paid: number;
  due: number;
  partial: number;
  overdue: number;
  loading?: boolean;
  onSendReminders?: () => void;
}

const RentStatus: React.FC<RentStatusProps> = ({
  paid,
  due,
  partial,
  overdue,
  loading = false,
  onSendReminders,
}) => {
  const navigate = useNavigate();

  const total =
    paid +
    due +
    partial +
    overdue;

  const getWidth = (value: number) => {
    // Keep the bar completely empty when value is 0
    if (value <= 0 || total <= 0) {
      return "0%";
    }

    return `${(value / total) * 100}%`;
  };

  const handleSendReminders = () => {
    // Preserve the existing callback if provided
    onSendReminders?.();

    // Navigate to Rent Status page
    navigate("/owner/rent-status");
  };

  const rows = [
    {
      label: "Paid",
      value: paid,
      color: "#19AA55",
    },
    {
      label: "Due",
      value: due,
      color: "#F2A32A",
    },
    {
      label: "Partial",
      value: partial,
      color: "#2563D9",
    },
    {
      label: "Overdue",
      value: overdue,
      color: "#E63E28",
    },
  ];

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
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex items-center justify-between">
        <h2
          className="
            truncate
            text-[8px]
            font-semibold
            leading-3
            text-[#111827]

            sm:text-[13px]
            sm:leading-4
          "
        >
          Rent Status
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
            bg-[#EDF4FF]

            sm:h-[27px]
            sm:w-[27px]
          "
        >
          <IndianRupee
            size={10}
            strokeWidth={2}
            className="
              text-[#2563D9]

              sm:h-[14px]
              sm:w-[14px]
            "
          />
        </div>
      </div>

      {/* ======================================================
          RENT STATUS ROWS
      ======================================================= */}

      <div
        className="
          mt-1.5
          flex-1
          space-y-1.5

          sm:mt-3
          sm:space-y-2.5
        "
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="
              flex
              items-center
              gap-1
            "
          >
            {/* LABEL */}

            <span
              className="
                w-[31px]
                truncate
                text-[6.5px]
                leading-3
                text-[#30343B]

                sm:w-[52px]
                sm:text-[10px]
                sm:leading-4
              "
            >
              {row.label}
            </span>

            {/* PROGRESS BAR */}

            <div
              className="
                h-[4px]
                flex-1
                overflow-hidden
                rounded-full
                bg-[#EDEEF1]

                sm:h-[6px]
              "
            >
              {loading ? (
                <div
                  className="
                    h-full
                    w-1/3
                    animate-pulse
                    rounded-full
                    bg-[#D8DADF]
                  "
                />
              ) : (
                <div
                  className="
                    h-full
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width: getWidth(row.value),
                    backgroundColor: row.color,
                  }}
                />
              )}
            </div>

            {/* VALUE */}

            <span
              className="
                w-[14px]
                shrink-0
                text-right
                text-[7px]
                font-semibold
                leading-3
                text-[#20242A]

                sm:w-[21px]
                sm:text-[11px]
                sm:leading-4
              "
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* ======================================================
          BUTTON
      ======================================================= */}

      <button
        type="button"
        onClick={handleSendReminders}
        className="
          mt-1
          flex
          h-[23px]
          w-full
          shrink-0
          items-center
          justify-center
          gap-0.5
          rounded-[5px]
          border
          border-[#E4E8EE]
          bg-white
          text-[7px]
          font-medium
          leading-none
          text-[#2563C9]
          transition-colors

          sm:mt-2
          sm:h-[33px]
          sm:rounded-[7px]
          sm:text-[11px]
        "
      >
        <span>Send Reminders</span>

        <ChevronRight
          size={9}
          className="
            sm:h-3.5
            sm:w-3.5
          "
        />
      </button>
    </section>
  );
};

export default RentStatus;