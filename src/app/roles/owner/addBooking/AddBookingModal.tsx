import React, { useEffect, useState } from "react";

import { updateBooking } from "../../../shared/services/api/commonApiServices";

import { useSelectedPgStore } from "../../../shared/store/selectedPgStore";
import { usePgInfoStore } from "../../../shared/store/pgInfoStore";
import { usePgRoomsStore } from "../../../shared/store/roomsStore";
import { usePgBedInfoStore } from "../../../shared/store/bedInfoStore";
import { usePgCurrentStatusStore } from "../../../shared/store/currentStatusStore";

import { useAuth } from "@/hooks/context/AuthContext";
import SuccessModal from "@/ui/Shared/SuccessModal";

/* ============================================================
   TYPES
============================================================ */

export interface AssignBedFormState {
  pg_id: string;
  room_id: string;
  bed_id: string;
  bkg_status: string;
}

interface AssignBedModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;

  /**
   * Booking ID of the resident whose bed is being assigned.
   */
  editBookingId?: number;

  /**
   * Existing booking values.
   */
  initialValues?: Partial<AssignBedFormState>;
}

/* ============================================================
   DEFAULT STATE
============================================================ */

const INITIAL_FORM_STATE: AssignBedFormState = {
  pg_id: "",
  room_id: "",
  bed_id: "",
  bkg_status: "",
};



/* ============================================================
   COMPONENT
============================================================ */

const AssignBedModal = ({
  open,
  onClose,
  onSuccess,
  editBookingId,
  initialValues,
}: AssignBedModalProps) => {
  const { user } = useAuth();

  /* ============================================================
     STATE
  ============================================================ */

  const [form, setForm] =
    useState<AssignBedFormState>(INITIAL_FORM_STATE);

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  /* ============================================================
     PG STORE
  ============================================================ */

  const { pgInfoList, fetchPgInfo } = usePgInfoStore();

  const { selectedPgId, selectedPg } =
    useSelectedPgStore();

  /* ============================================================
     ROOM STORE
  ============================================================ */

  const {
    rooms,
    fetchRooms,
    reset: resetRooms,
  } = usePgRoomsStore();

  /* ============================================================
     BED STORE
  ============================================================ */

  const {
    bedInfoList,
    fetchBedInfo,
  } = usePgBedInfoStore();

  /* ============================================================
     STATUS STORE
  ============================================================ */

  const {
    statuses,
    fetchStatuses,
    loading: statusLoading,
  } = usePgCurrentStatusStore();

  /* ============================================================
     RESOLVE CURRENT PG
  ============================================================ */

  const resolvedPgId =
    selectedPgId ??
    selectedPg?.id ??
    pgInfoList?.[0]?.id ??
    null;

  /* ============================================================
     LOAD MASTER DATA
  ============================================================ */

  useEffect(() => {
    if (!open) return;

    fetchPgInfo();
    fetchStatuses();
  }, [
    open,
    fetchPgInfo,
    fetchStatuses,
  ]);

  /* ============================================================
     INITIALIZE FORM
  ============================================================ */

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM_STATE);
      resetRooms();
      return;
    }

    const pgId =
      initialValues?.pg_id ||
      (resolvedPgId
        ? String(resolvedPgId)
        : "");

    setForm({
      ...INITIAL_FORM_STATE,
      ...initialValues,
      pg_id: pgId,
    });
  }, [
    open,
    initialValues,
    resolvedPgId,
    resetRooms,
  ]);

  /* ============================================================
     FETCH ROOMS FOR CURRENT PG
  ============================================================ */

  useEffect(() => {
    if (!open) return;

    if (!resolvedPgId) {
      resetRooms();

      setForm((prev) => ({
        ...prev,
        pg_id: "",
        room_id: "",
        bed_id: "",
      }));

      return;
    }

    const pgId = Number(resolvedPgId);

    if (!Number.isFinite(pgId)) {
      resetRooms();
      return;
    }

    setForm((prev) => ({
      ...prev,
      pg_id: String(pgId),
    }));

    fetchRooms({
      pg_info: pgId,
    });
  }, [
    open,
    resolvedPgId,
    fetchRooms,
    resetRooms,
  ]);

  /* ============================================================
     FETCH BEDS WHEN ROOM CHANGES
  ============================================================ */

  useEffect(() => {
    if (!open) return;

    if (!form.room_id) {
      return;
    }

    const roomId = Number(form.room_id);

    if (!Number.isFinite(roomId)) {
      return;
    }

    fetchBedInfo({
      room_info: roomId,
    });
  }, [
    open,
    form.room_id,
    fetchBedInfo,
  ]);

  /* ============================================================
     CURRENT PG
  ============================================================ */

  const currentPg = pgInfoList?.find(
    (pg: any) =>
      Number(pg.id) === Number(form.pg_id)
  );

  /* ============================================================
     ONLY SHOW RESERVED + OCCUPIED
  ============================================================ */

  const assignmentStatuses = statuses.filter(
    (status: any) => {
      const code = String(
        status.status_code || ""
      ).toLowerCase();

      return (
        code === "reserved" ||
        code === "occupied"
      );
    }
  );

  /* ============================================================
     HANDLER
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,

      /**
       * Important:
       * If room changes, clear the previously
       * selected bed.
       */
      ...(name === "room_id"
        ? { bed_id: "" }
        : {}),
    }));
  };

  /* ============================================================
     VALIDATION
  ============================================================ */

  /**
   * IMPORTANT:
   * PG is NOT a user-selectable field.
   *
   * It comes from selected/current PG.
   *
   * The Assign button only depends on:
   *   room + bed + status
   */
  const isFormValid =
    Boolean(form.room_id) &&
    Boolean(form.bed_id) &&
    Boolean(form.bkg_status);

  /* ============================================================
     SUBMIT
  ============================================================ */

  const handleSubmit = async () => {
    /**
     * Re-check values directly here.
     *
     * This avoids the button accidentally remaining
     * disabled because of unrelated fields.
     */
    if (
      !form.room_id ||
      !form.bed_id ||
      !form.bkg_status
    ) {
      return;
    }

    if (!editBookingId) {
      alert("Booking ID is missing.");
      return;
    }

    if (!user?.id) {
      alert("User information is unavailable. Please login again.");
      return;
    }

    const roomId = Number(form.room_id);
    const bedId = Number(form.bed_id);
    const statusId = Number(form.bkg_status);
    const modifiedBy = Number(user.id);

    if (
      !Number.isFinite(roomId) ||
      !Number.isFinite(bedId) ||
      !Number.isFinite(statusId) ||
      !Number.isFinite(modifiedBy)
    ) {
      alert("Invalid assignment data.");
      return;
    }

    setLoading(true);

    try {
      /**
       * UPDATE BOOKING
       *
       * Example:
       *
       * {
       *   id: 824,
       *   fields: {
       *     bkg_status: 5,
       *     room_id: 278,
       *     bed_id: 128,
       *     modified_by: 779
       *   }
       * }
       */

      const payload = {
        id: Number(editBookingId),

        fields: {
          bkg_status: statusId,
          room_id: roomId,
          bed_id: bedId,
          modified_by: modifiedBy,
        },
      };

      console.log(
        "Assign Bed Update Payload:",
        payload
      );

      await updateBooking(payload);

      setSuccessOpen(true);

      onSuccess?.();
    } catch (error) {
      console.error(
        "Failed to assign bed:",
        error
      );

      alert(
        "Failed to assign bed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     CLOSE / SUCCESS
  ============================================================ */

  const handleSuccessClose = () => {
    setSuccessOpen(false);

    setForm({
      ...INITIAL_FORM_STATE,
      pg_id: resolvedPgId
        ? String(resolvedPgId)
        : "",
    });

    onClose();
  };

  /* ============================================================
     DO NOT RENDER
  ============================================================ */

  if (!open) return null;

  /* ============================================================
     STYLES
  ============================================================ */

  /**
   * Kept compact as requested.
   * Desktop gets slightly more breathing room.
   */
  const inputClass =
    "w-full border border-gray-200 rounded-md px-2 py-1.5 text-[11px] md:text-[12px] lg:text-[13px] focus:ring-1 focus:ring-[#605BFF] focus:border-[#605BFF] outline-none bg-white";

  const labelClass =
    "block mb-1 text-[10px] md:text-[11px] lg:text-[12px] font-medium text-gray-600";

  const selectedBoxClass =
    "w-full border border-gray-200 bg-gray-50 rounded-md px-2 py-1.5 text-[11px] md:text-[12px] lg:text-[13px] text-gray-700";

  /* ============================================================
     SELECTED ROOM
  ============================================================ */

  const selectedRoom = rooms.find(
    (room: any) =>
      Number(room.id) ===
      Number(form.room_id)
  );

  /* ============================================================
     SELECTED BED
  ============================================================ */

  const selectedBed = bedInfoList.find(
    (bed: any) =>
      Number(bed.id) ===
      Number(form.bed_id)
  );

  /* ============================================================
     SELECTED STATUS
  ============================================================ */

  const selectedStatus =
    assignmentStatuses.find(
      (status: any) =>
        Number(status.id) ===
        Number(form.bkg_status)
    );

  /* ============================================================
     UI
  ============================================================ */

  return (
    <>
      {/* ======================================================
          OVERLAY
      ====================================================== */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-xl
            shadow-xl
            overflow-hidden
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-gray-800">
                Assign Bed
              </h2>

              <p className="text-[9px] md:text-[10px] lg:text-[11px] text-gray-400 mt-0.5">
                Assign a room, bed and status
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                w-6
                h-6
                flex
                items-center
                justify-center
                rounded-md
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-700
                text-base
              "
            >
              ×
            </button>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}

          <div className="p-3 md:p-4 lg:p-5">
            <div className="space-y-3">

              {/* ==============================================
                  PG
              ============================================== */}

              <div>
                <label className={labelClass}>
                  PG
                </label>

                <div className={selectedBoxClass}>
                  {currentPg?.pg_name ||
                    selectedPg?.pg_name ||
                    "Current PG"}
                </div>
              </div>

              {/* ==============================================
                  ROOM
              ============================================== */}

              <div>
                <label className={labelClass}>
                  Room *
                </label>

                <select
                  name="room_id"
                  value={form.room_id}
                  onChange={handleChange}
                  disabled={!form.pg_id}
                  className={inputClass}
                >
                  <option value="">
                    {!form.pg_id
                      ? "Loading PG..."
                      : "Select Room"}
                  </option>

                  {rooms.map((room: any) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.room_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ==============================================
                  BED
              ============================================== */}

              <div>
                <label className={labelClass}>
                  Bed *
                </label>

                <select
                  name="bed_id"
                  value={form.bed_id}
                  onChange={handleChange}
                  disabled={!form.room_id}
                  className={inputClass}
                >
                  <option value="">
                    {form.room_id
                      ? "Select Bed"
                      : "Select Room First"}
                  </option>

                  {bedInfoList.map(
                    (bed: any) => (
                      <option
                        key={bed.id}
                        value={bed.id}
                      >
                        {bed.bed_number}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ==============================================
                  STATUS
              ============================================== */}

              <div>
                <label className={labelClass}>
                  Status *
                </label>

                <select
                  name="bkg_status"
                  value={form.bkg_status}
                  onChange={handleChange}
                  disabled={statusLoading}
                  className={inputClass}
                >
                  <option value="">
                    {statusLoading
                      ? "Loading status..."
                      : "Select Status"}
                  </option>

                  {assignmentStatuses.map(
                    (status: any) => (
                      <option
                        key={status.id}
                        value={status.id}
                      >
                        {status.status_code}
                      </option>
                    )
                  )}
                </select>

                {!statusLoading &&
                  assignmentStatuses.length ===
                    0 && (
                    <p className="text-[9px] text-red-500 mt-1">
                      Reserved and Occupied
                      statuses are unavailable.
                    </p>
                  )}
              </div>

              {/* ==============================================
                  REVIEW
              ============================================== */}

              {isFormValid && (
                <div className="mt-2 border border-gray-100 rounded-md bg-gray-50 p-2">
                  <div className="grid grid-cols-3 gap-2">

                    <div>
                      <p className="text-[8px] md:text-[9px] text-gray-400">
                        Room
                      </p>

                      <p className="text-[10px] md:text-[11px] font-medium text-gray-700 truncate">
                        {selectedRoom?.room_name ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] md:text-[9px] text-gray-400">
                        Bed
                      </p>

                      <p className="text-[10px] md:text-[11px] font-medium text-gray-700 truncate">
                        {selectedBed?.bed_number ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] md:text-[9px] text-gray-400">
                        Status
                      </p>

                      <p className="text-[10px] md:text-[11px] font-medium text-gray-700 truncate">
                        {selectedStatus?.status_code ||
                          "-"}
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                px-3
                py-1.5
                rounded-md
                border
                border-gray-200
                text-[10px]
                md:text-[11px]
                lg:text-[12px]
                text-gray-600
                hover:bg-white
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="
                px-3
                py-1.5
                rounded-md
                bg-[#605BFF]
                text-white
                text-[10px]
                md:text-[11px]
                lg:text-[12px]
                font-medium
                hover:bg-[#4f46e5]
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                min-w-[90px]
              "
            >
              {loading
                ? "Assigning..."
                : "Assign Bed"}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      <SuccessModal
        open={successOpen}
        title="Bed Assigned"
        message="Room, bed and booking status have been successfully updated."
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default AssignBedModal;