


import React, { useState, useEffect, useMemo } from "react";
import {
  UserPlus,
  Trash2,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ChevronDown,
  MoreVertical,
  Loader2,
} from "lucide-react";



// ─── Types ────────────────────────────────────────────────────────────────────
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface GuestRequest {
  id: number;
  userId?: number;
  fullName: string;
  mobileNumber: string;
  state: string;
  city: string;
  email: string;
  status: RequestStatus;
  createdAt: string;
  pgName?: string;
  
}

interface RequestsPageProps {
  requests?: GuestRequest[];
  loading?: boolean;
  onDelete?: (id: number) => Promise<void> | void;
  onStatusChange?: (id: number, status: RequestStatus) => Promise<void> | void;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string; bg: string; Icon: React.FC<{ className?: string }> }
> = {
  Pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
    Icon: Clock,
  },
  Approved: {
    label: "Approved",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200",
    Icon: CheckCircle,
  },
  Rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50 border border-red-200",
    Icon: XCircle,
  },
};

// ─── Status inline dropdown ───────────────────────────────────────────────────
const StatusSelect = ({
  value,
  onChange,
}: {
  value: RequestStatus;
  onChange: (s: RequestStatus) => void;
}) => {
  const [open, setOpen] = useState(false);
  const statuses: RequestStatus[] = ["Pending", "Approved", "Rejected"];
  const cfg = STATUS_CONFIG[value];
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} cursor-pointer hover:opacity-80 transition`}
      >
        <cfg.Icon className="w-3.5 h-3.5" />
        {cfg.label}
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-8 z-40 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[140px] py-1 overflow-hidden">
          {statuses.map((s) => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition ${
                  s === value ? "bg-gray-50" : ""
                } ${c.color}`}
              >
                <c.Icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Desktop Table ────────────────────────────────────────────────────────────
const DesktopTable = ({
  requests,
  onAddGuest,
  onStatusChange,
  onDelete,
}: {
  requests: GuestRequest[];
  onAddGuest: (r: GuestRequest) => void;
  onStatusChange: (id: number, s: RequestStatus) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {["Full Name", "Mobile Number", "State", "City", "Status", "Actions"].map((h) => (
            <th
              key={h}
              className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {requests.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
              No requests found
            </td>
          </tr>
        ) : (
          requests.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
              {/* Full Name + email */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {r.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{r.fullName}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </div>
                </div>
              </td>

              {/* Mobile */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {r.mobileNumber}
                </div>
              </td>

              {/* State */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {r.state}
                </div>
              </td>

              {/* City */}
              <td className="px-5 py-4 text-gray-700">{r.city}</td>

              {/* Status dropdown */}
              <td className="px-5 py-4">
                <StatusSelect value={r.status} onChange={(s) => onStatusChange(r.id, s)} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                 
                  <button
                    onClick={() => onDelete(r.id)}
                    title="Delete request"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition border border-red-100 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ─── Mobile Card ──────────────────────────────────────────────────────────────
const MobileCard = ({
  request: r,
  onAddGuest,
  onStatusChange,
  onDelete,
}: {
  request: GuestRequest;
  onAddGuest: (r: GuestRequest) => void;
  onStatusChange: (id: number, s: RequestStatus) => void;
  onDelete: (id: number) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 relative">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 font-bold text-base flex-shrink-0">
            {r.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{r.fullName}</p>
            <p className="text-xs text-gray-400 truncate max-w-[160px]">{r.email}</p>
          </div>
        </div>

        {/* Kebab menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-40 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[170px] py-1 overflow-hidden">
              <button
                onClick={() => { onAddGuest(r); setMenuOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition"
              >
                <UserPlus className="w-4 h-4" />
                Add Guest Details
              </button>
              <button
                onClick={() => { onDelete(r.id); setMenuOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {r.mobileNumber}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {r.city}, {r.state}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(r.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <StatusSelect value={r.status} onChange={(s) => onStatusChange(r.id, s)} />
      </div>
    </div>
  );
};

// ─── Main RequestsPage ────────────────────────────────────────────────────────
export function RequestsPage({
  requests: externalRequests,
  loading = false,
  onDelete,
  onStatusChange,
}: RequestsPageProps) {
  const [requests, setRequests] = useState<GuestRequest[]>(
    externalRequests ?? DEMO_REQUESTS
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  

  useEffect(() => {
    if (externalRequests) setRequests(externalRequests);
  }, [externalRequests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        r.fullName.toLowerCase().includes(q) ||
        r.mobileNumber.includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  // Open modal with the userId from the clicked row
  const handleAddGuest = (r: GuestRequest) => {
    // r.userId should be the numeric user id already created in your system.
    // If requests come from an API, ensure each request object includes userId.
    setActiveUserId(r.userId ?? null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setActiveUserId(null);
  };

  const handleStatusChange = async (id: number, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await onStatusChange?.(id, status);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    await onDelete?.(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const counts = useMemo(
    () => ({
      All: requests.length,
      Pending: requests.filter((r) => r.status === "Pending").length,
      Approved: requests.filter((r) => r.status === "Approved").length,
      Rejected: requests.filter((r) => r.status === "Rejected").length,
    }),
    [requests]
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading requests…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/*
        h-full + overflow-y-auto keeps the scroll inside the content area
        so the sidebar never gets a stray scrollbar next to it.
        Your layout shell must be:
          <div className="flex h-screen overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-hidden"><RequestsPage /></main>
          </div>
      */}
      <div className="h-full overflow-y-auto bg-neutral-50 p-4 lg:p-8">

        {/* Page header */}
        <div className="mb-6 mt-10 lg:mt-0">
          <h1 className="text-2xl font-bold text-gray-900">Guest Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage incoming guest booking requests
          </p>
        </div>

        {/* Desktop: filter pills + search on one row */}
        <div className="hidden lg:flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                  statusFilter === s
                    ? "bg-[#001433] text-white border-[#001433]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    statusFilter === s
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search by name, mobile, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#001433]/20 focus:border-[#001433]/50 shadow-sm"
            />
          </div>
        </div>

        {/* Mobile: pills then search */}
        <div className="lg:hidden mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  statusFilter === s
                    ? "bg-[#001433] text-white border-[#001433]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusFilter === s
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#001433]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <DesktopTable
          requests={filtered}
          onAddGuest={handleAddGuest}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No requests found
            </div>
          ) : (
            filtered.map((r) => (
              <MobileCard
                key={r.id}
                request={r}
                onAddGuest={handleAddGuest}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

     
      
    </>
  );
}

// ─── Demo data ────────────────────────────────────────────────────────────────
// Each request has a `userId` field — this is the numeric id of the user
// record already created in your system. When fetching from your API, make
// sure to include this field so the modal can call addPgGuestInfo correctly.
const DEMO_REQUESTS: GuestRequest[] = [
  { id: 1, userId: 101, fullName: "Arjun Sharma",  email: "arjun@email.com",  mobileNumber: "9876543210", state: "Telangana",   city: "Hyderabad", status: "Pending",  createdAt: "2026-02-20T10:30:00" },
  { id: 2, userId: 102, fullName: "Priya Nair",    email: "priya@email.com",  mobileNumber: "9123456789", state: "Karnataka",   city: "Bengaluru", status: "Approved", createdAt: "2026-02-18T09:15:00" },
  { id: 3, userId: 103, fullName: "Rahul Mehta",   email: "rahul@email.com",  mobileNumber: "9988776655", state: "Maharashtra", city: "Pune",      status: "Rejected", createdAt: "2026-02-17T14:00:00" },
  { id: 4, userId: 104, fullName: "Sneha Iyer",    email: "sneha@email.com",  mobileNumber: "9001122334", state: "Tamil Nadu",  city: "Chennai",   status: "Pending",  createdAt: "2026-02-22T11:00:00" },
  { id: 5, userId: 105, fullName: "Vikram Patel",  email: "vikram@email.com", mobileNumber: "9871234560", state: "Gujarat",     city: "Ahmedabad", status: "Approved", createdAt: "2026-02-15T08:45:00" },
  { id: 6, userId: 106, fullName: "Ananya Reddy",  email: "ananya@email.com", mobileNumber: "9345678901", state: "Telangana",   city: "Warangal",  status: "Pending",  createdAt: "2026-02-24T16:30:00" },
];