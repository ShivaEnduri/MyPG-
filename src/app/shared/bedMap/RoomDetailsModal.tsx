
import React from "react";

import {
  X,
  Tv,
  Wind,
  Building2,
  BedDouble,
} from "lucide-react";

interface RoomDetailsModalProps {
  open: boolean;

  room: {
    id: number;
    number: string;
    type: string;
    floor?: number | string;

    hasTv?: boolean;
    hasAc?: boolean;
    hasBalcony?: boolean;

    beds?: {
      id: number;
      label: string;
      status: string;
      occupantName?: string;
    }[];
  } | null;

  onClose: () => void;
}

export default function RoomDetailsModal({
  open,
  room,
  onClose,
}: RoomDetailsModalProps) {
  if (!open || !room) {
    return null;
  }

  const beds = Array.isArray(room.beds)
    ? room.beds
    : [];

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-[2px]
      "
      onClick={onClose}
    >
      <div
        className="
          w-[calc(100vw-32px)]
          max-w-[400px]
          rounded-lg
          bg-white
          shadow-2xl
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-3
            py-2
          "
        >
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-sm
                font-bold
                text-slate-900
              "
            >
              Room {room.number}
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                text-slate-500
              "
            >
              Room details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="px-3 py-2.5">

          {/* BASIC DETAILS */}

          <div className="grid grid-cols-3 gap-1.5">
            <DetailCard
              icon={Building2}
              label="Room Type"
              value={room.type}
            />

            <DetailCard
              icon={Building2}
              label="Floor"
              value={String(
                room.floor ?? "-"
              )}
            />

            <DetailCard
              icon={BedDouble}
              label="Beds"
              value={String(
                beds.length
              )}
            />
          </div>

          {/* ==================================================
              AMENITIES
          ================================================== */}

          <div className="mt-2.5">
            <h3
              className="
                mb-1.5
                text-[11px]
                font-bold
                text-slate-800
              "
            >
              Amenities
            </h3>

            <div className="grid grid-cols-3 gap-1.5">
              <Amenity
                icon={Tv}
                label="TV"
                enabled={
                  Boolean(
                    room.hasTv
                  )
                }
              />

              <Amenity
                icon={Wind}
                label="AC"
                enabled={
                  Boolean(
                    room.hasAc
                  )
                }
              />

              <Amenity
                icon={Building2}
                label="Balcony"
                enabled={
                  Boolean(
                    room.hasBalcony
                  )
                }
              />
            </div>
          </div>

          {/* ==================================================
              BEDS
          ================================================== */}

          <div className="mt-2.5">
            <div
              className="
                mb-1.5
                flex
                items-center
                justify-between
              "
            >
              <h3
                className="
                  text-[11px]
                  font-bold
                  text-slate-800
                "
              >
                Beds
              </h3>

              <span
                className="
                  text-[9px]
                  text-slate-400
                "
              >
                {beds.length}{" "}
                {beds.length === 1
                  ? "bed"
                  : "beds"}
              </span>
            </div>

            {beds.length > 0 ? (
              <div className="space-y-1">
                {beds.map(
                  (bed) => (
                    <div
                      key={bed.id}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-md
                        border
                        border-slate-100
                        bg-slate-50
                        px-2
                        py-1.5
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-1.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-white
                          "
                        >
                          <BedDouble
                            className="
                              h-3
                              w-3
                              text-blue-600
                            "
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              text-[10px]
                              font-semibold
                              text-slate-800
                            "
                          >
                            Bed {bed.label}
                          </p>

                          <p
                            className="
                              truncate
                              text-[8px]
                              text-slate-500
                            "
                          >
                            {bed.occupantName ||
                              "No resident assigned"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`
                          shrink-0
                          rounded
                          px-1.5
                          py-0.5
                          text-[8px]
                          font-semibold

                          ${
                            bed.status ===
                            "occupied"
                              ? "bg-blue-50 text-blue-600"
                              : bed.status ===
                                "reserved"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-green-50 text-green-600"
                          }
                        `}
                      >
                        {bed.status}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  rounded-md
                  border
                  border-dashed
                  border-slate-200
                  bg-slate-50
                  px-2
                  py-2
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    text-slate-400
                  "
                >
                  No beds available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            flex
            justify-end
            border-t
            border-slate-100
            px-3
            py-2
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              bg-blue-600
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL CARD
============================================================ */

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-md
        border
        border-slate-100
        bg-slate-50
        px-2
        py-1.5
      "
    >
      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <div
          className="
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-md
            bg-white
          "
        >
          <Icon
            className="
              h-3
              w-3
              text-blue-600
            "
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-[8px]
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              truncate
              text-[10px]
              font-semibold
              text-slate-800
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AMENITY
============================================================ */

function Amenity({
  icon: Icon,
  label,
  enabled,
}: {
  icon: React.ElementType;
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-1.5
        rounded-md
        border
        px-1.5
        py-1.5

        ${
          enabled
            ? "border-green-100 bg-green-50"
            : "border-slate-100 bg-slate-50"
        }
      `}
    >
      <Icon
        className={`
          h-3
          w-3
          shrink-0

          ${
            enabled
              ? "text-green-600"
              : "text-slate-400"
          }
        `}
      />

      <div className="min-w-0">
        <p
          className={`
            text-[9px]
            font-semibold

            ${
              enabled
                ? "text-green-700"
                : "text-slate-500"
            }
          `}
        >
          {label}
        </p>

        <p
          className="
            text-[7px]
            text-slate-400
          "
        >
          {enabled
            ? "Available"
            : "Not available"}
        </p>
      </div>
    </div>
  );
}
