import React, { useEffect, useMemo, useState } from "react";
import { updateBooking, deleteBooking } from "@/app/shared/services/api/commonApiServices";
import { usePgBookingsStore } from "@/app/shared/store/bookingStore";
import { usePgCurrentStatusStore } from "../../store/currentStatusStore";

interface Props {
  pgId?: number;
}

interface Booking {
  id: number;
  bkg_no: string;
  pg_id: number;
  room_id: number;
  bed_id: number;
  bkg_date: string;
  planned_check_in_date: string;
  actual_check_in_date: string | null;
  planned_check_out_date: string;
  actual_check_out_date: string | null;
  bkg_status: number;
 monthly_rent?: number;
  guest_id: number;
  // Optional display-only fields — populate these from your API's joined response if available
 first_name?: string;
last_name?: string;
status_code?: string;
  room_name?: string;
  bed_number?: string;
}

interface RowEdit {
  bkg_status: number | "";
  actual_check_in_date: string; // datetime-local input format
  actual_check_out_date: string; // datetime-local input format
}




// ISO string -> "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
const toInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "YYYY-MM-DDTHH:mm" -> ISO string (or null if empty)
const fromInputValue = (val: string): string | null => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const formatDisplayDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const formatCurrency = (val?: number) =>
  val === undefined || val === null ? "—" : `₹${Number(val).toLocaleString("en-IN")}`;

const inputClass =
  "w-full border border-blue-300 rounded-lg px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none";

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.79a1 1 0 011.414-.006z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h.294l.7 9.803A2 2 0 006.99 17.8h6.02a2 2 0 001.996-1.997L15.706 6H16a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zm1 2V4h2v0h-2zm-1.293 4.293a1 1 0 011.414 0L10 9.586l.879-.879a1 1 0 111.415 1.415L11.414 11l.88.879a1 1 0 01-1.415 1.415L10 12.414l-.879.88a1 1 0 01-1.414-1.415L8.586 11l-.879-.879a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const BookingsList = ({ pgId }: Props) => {
  const { bookings, loading, fetchBookings } = usePgBookingsStore();
  const {
  statuses,
  fetchStatuses,
} = usePgCurrentStatusStore();

  const [filters, setFilters] = useState<{
    guest_id?: number;
    bkg_status?: number;
    planned_check_in_date?: string;
  }>({});

  const [guestOptions, setGuestOptions] = useState<{ id: number; label: string }[]>([]);
  const [rowEdits, setRowEdits] = useState<Record<number, RowEdit>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const buildParams = () => {
    const params: Record<string, any> = {};
    if (pgId) params.pg_id = pgId;
    if (filters.guest_id) params.guest_id = filters.guest_id;
    if (filters.bkg_status) params.bkg_status = filters.bkg_status;
    if (filters.planned_check_in_date) params.planned_check_in_date = filters.planned_check_in_date;
    return params;
  };

  useEffect(() => {
    fetchBookings(buildParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pgId, filters.guest_id, filters.bkg_status, filters.planned_check_in_date]);

  useEffect(() => {
  fetchStatuses();
}, []);

  // Keep guest filter options populated across filter changes (only grows, never shrinks)
  useEffect(() => {
    setGuestOptions((prev) => {
      const map = new Map(prev.map((g) => [g.id, g]));
      (bookings as unknown as Booking[]).forEach((b) => {
        if (b.guest_id != null && !map.has(b.guest_id)) {
          map.set(b.guest_id, { id: b.guest_id, label:
  `${b.first_name ?? ""} ${b.last_name ?? ""}`.trim() ||
  `Guest #${b.guest_id}` });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    });
  }, [bookings]);

  // Sync local row-edit state with fetched bookings, without clobbering unsaved edits
  useEffect(() => {
    setRowEdits((prev) => {
      const next = { ...prev };
      const idsInBookings = new Set((bookings as unknown as Booking[]).map((b) => b.id));

      (bookings as unknown as Booking[]).forEach((b) => {
        if (!next[b.id]) {
          next[b.id] = {
            bkg_status: b.bkg_status ?? "",
            actual_check_in_date: toInputValue(b.actual_check_in_date),
            actual_check_out_date: toInputValue(b.actual_check_out_date),
          };
        }
      });

      Object.keys(next).forEach((key) => {
        if (!idsInBookings.has(Number(key))) delete next[Number(key)];
      });

      return next;
    });
  }, [bookings]);

  const getStatusLabel = (id?: number) => {
  if (!id) return "—";

  const status = statuses.find(
    (s) => Number(s.id) === Number(id)
  );


  return status?.status_code || `Status #${id}`;
};

const statusBadgeClass = (id?: number) => {
  const status = statuses.find((s) => s.id === id);

  switch (status?.status_code?.toLowerCase()) {
    case "checked in":
      return "bg-green-100 text-green-700";

    case "checked out":
      return "bg-gray-200 text-gray-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "reserved":
      return "bg-blue-100 text-blue-700";

    case "review":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
};

  const updateEdit = (id: number, patch: Partial<RowEdit>) =>
    setRowEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const isRowDirty = (booking: Booking) => {
    const edit = rowEdits[booking.id];
    if (!edit) return false;
    return (
      Number(edit.bkg_status) !== booking.bkg_status ||
      edit.actual_check_in_date !== toInputValue(booking.actual_check_in_date) ||
      edit.actual_check_out_date !== toInputValue(booking.actual_check_out_date)
    );
  };

  const handleSave = async (booking: Booking) => {
    const edit = rowEdits[booking.id];
    if (!edit || !isRowDirty(booking)) return;

    const fields: Record<string, any> = {};
    if (Number(edit.bkg_status) !== booking.bkg_status) {
      fields.bkg_status = Number(edit.bkg_status);
    }
    if (edit.actual_check_in_date !== toInputValue(booking.actual_check_in_date)) {
      fields.actual_check_in_date = fromInputValue(edit.actual_check_in_date);
    }
    if (edit.actual_check_out_date !== toInputValue(booking.actual_check_out_date)) {
      fields.actual_check_out_date = fromInputValue(edit.actual_check_out_date);
    }
    if (Object.keys(fields).length === 0) return;

    setSavingId(booking.id);
    try {
      await updateBooking({ id: booking.id, fields });
      await fetchBookings(buildParams());
    } catch (err) {
      console.error("Failed to update booking", err);
      alert("Failed to update booking. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this booking? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      await fetchBookings(buildParams());
    } catch (err) {
      console.error("Failed to delete booking", err);
      alert("Failed to delete booking. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => setFilters({});
  const hasActiveFilters = filters.guest_id || filters.bkg_status || filters.planned_check_in_date;

  const rows = bookings as unknown as Booking[];

  const ActionButtons = ({ booking }: { booking: Booking }) => {
    const dirty = isRowDirty(booking);
    const saving = savingId === booking.id;
    const deleting = deletingId === booking.id;
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleSave(booking)}
          disabled={!dirty || saving || deleting}
          title={dirty ? "Save changes" : "No changes to save"}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            dirty && !saving
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <span className="w-3.5 h-3.5 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckIcon />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleDelete(booking.id)}
          disabled={saving || deleting}
          title="Delete booking"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <TrashIcon />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bookings</h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-[#605BFF] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">Guest</label>
            <select
              className={inputClass}
              value={filters.guest_id ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, guest_id: e.target.value ? Number(e.target.value) : undefined }))
              }
            >
              <option value="">All guests</option>
              {guestOptions.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">Booking status</label>
            <select
              className={inputClass}
              value={filters.bkg_status ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, bkg_status: e.target.value ? Number(e.target.value) : undefined }))
              }
            >
              {statuses.map((status) => (
  <option
    key={status.id}
    value={status.id}
  >
    {status.status_code}
  </option>
))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">Planned check-in date</label>
            <input
              type="date"
              className={inputClass}
              value={filters.planned_check_in_date ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, planned_check_in_date: e.target.value || undefined }))
              }
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Loading bookings...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No bookings found.</p>
      ) : (
        <>
          {/* Table view — tablet and up */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Booking No</th>
                  <th className="py-2 pr-4">Guest</th>
                  <th className="py-2 pr-4">Room / Bed</th>
                  <th className="py-2 pr-4">Planned Check-in</th>
                  <th className="py-2 pr-4">Actual Check-in</th>
                  <th className="py-2 pr-4">Planned Check-out</th>
                  <th className="py-2 pr-4">Actual Check-out</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Monthly Rent</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking) => {
                  const edit = rowEdits[booking.id];
                  if (!edit) return null;
                  return (
                    <tr key={booking.id} className="border-b border-gray-50 last:border-0 align-top">
                      <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">{booking.bkg_no}</td>
                      <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                       {`${booking.first_name ?? ""} ${booking.last_name ?? ""}`.trim() ||"—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                        {(booking.room_name || `Room #${booking.room_id}`)} / {(booking.bed_number || `Bed #${booking.bed_id}`)}
                      </td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                        {formatDisplayDate(booking.planned_check_in_date)}
                      </td>
                      <td className="py-3 pr-4 min-w-[190px]">
                        <input
                          type="datetime-local"
                          className={inputClass}
                          value={edit.actual_check_in_date}
                          onChange={(e) => updateEdit(booking.id, { actual_check_in_date: e.target.value })}
                        />
                      </td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                        {formatDisplayDate(booking.planned_check_out_date)}
                      </td>
                      <td className="py-3 pr-4 min-w-[190px]">
                        <input
                          type="datetime-local"
                          className={inputClass}
                          value={edit.actual_check_out_date}
                          onChange={(e) => updateEdit(booking.id, { actual_check_out_date: e.target.value })}
                        />
                      </td>
                      <td className="py-3 pr-4 min-w-[140px]">
                        <select
                          className={inputClass}
                          value={edit.bkg_status}
                          onChange={(e) => updateEdit(booking.id, { bkg_status: Number(e.target.value) })}
                        >
                         {statuses.map((status) => (
  <option
    key={status.id}
    value={status.id}
  >
    {status.status_code}
  </option>
))}
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                        {formatCurrency(booking.monthly_rent)}
                      </td>
                      <td className="py-3 pr-4">
                        <ActionButtons booking={booking} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Card view — mobile */}
          <div className="md:hidden space-y-4">
            {rows.map((booking) => {
              const edit = rowEdits[booking.id];
              if (!edit) return null;
              return (
                <div key={booking.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm">{booking.bkg_no}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeClass(booking.bkg_status)}`}>
                      {getStatusLabel(booking.bkg_status)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p><span className="font-medium text-gray-700">Guest:</span> {`${booking.first_name ?? ""} ${booking.last_name ?? ""}`.trim() || "—"}</p>
                    <p><span className="font-medium text-gray-700">Room / Bed:</span> {(booking.room_name || `Room #${booking.room_id}`)} / {(booking.bed_number || `Bed #${booking.bed_id}`)}</p>
                    <p><span className="font-medium text-gray-700">Monthly Rent:</span> {formatCurrency(booking.monthly_rent)}</p>
                    <p><span className="font-medium text-gray-700">Planned Check-in:</span> {formatDisplayDate(booking.planned_check_in_date)}</p>
                    <p><span className="font-medium text-gray-700">Planned Check-out:</span> {formatDisplayDate(booking.planned_check_out_date)}</p>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-500">Status</label>
                    <select
                      className={inputClass}
                      value={edit.bkg_status}
                      onChange={(e) => updateEdit(booking.id, { bkg_status: Number(e.target.value) })}
                    >
                     {statuses.map((status) => (
  <option
    key={status.id}
    value={status.id}
  >
    {status.status_code}
  </option>
))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-500">Actual Check-in</label>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={edit.actual_check_in_date}
                      onChange={(e) => updateEdit(booking.id, { actual_check_in_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-500">Actual Check-out</label>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={edit.actual_check_out_date}
                      onChange={(e) => updateEdit(booking.id, { actual_check_out_date: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <ActionButtons booking={booking} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsList;