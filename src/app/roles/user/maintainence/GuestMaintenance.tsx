import { ChevronsDown, ChevronsUp, ClipboardList, Droplets, Wifi, Zap } from "lucide-react";
import React, { FC, useEffect, useState } from "react";

// --- Type Definitions ---

/** Defines the structure for a single maintenance request item. */
interface MaintenanceRequest {
  id: number;
  date: string; // Formatted date string (e.g., "12 July, 2025")
  category: "Electricity" | "Wifi / Internet" | "Plumbing" | "HVAC" | "Other";
  status: "Open" | "Resolved" | "In Progress";
  assigned: string;
  sla: "Within 24 hours" | "Within 48 hours" | "Overdue";
  rating: number | null; // 1-5 or null if unrated
}

/** Props for the StarRating component. */
interface StarRatingProps {
  rating: number | null;
}

/** Props for the StatusBadge component. */
interface StatusBadgeProps {
  status: MaintenanceRequest['status'];
}

// --- Initial Data (Type Asserted) ---
const initialRequests: MaintenanceRequest[] = [
  { id: 101, date: "12 July, 2025", category: "Electricity", status: "Open", assigned: "Ramesh (Tech)", sla: "Within 24 hours", rating: 4 },
  { id: 102, date: "12 July, 2025", category: "Wifi / Internet", status: "Resolved", assigned: "Suresh (IT)", sla: "Within 48 hours", rating: 5 },
  { id: 103, date: "12 July, 2025", category: "Electricity", status: "In Progress", assigned: "Arya (Vendor)", sla: "Overdue", rating: 3 },
  { id: 104, date: "12 July, 2025", category: "Plumbing", status: "Open", assigned: "Nithya", sla: "Overdue", rating: 3 },
  { id: 105, date: "12 July, 2025", category: "HVAC", status: "Resolved", assigned: "Nithya", sla: "Within 24 hours", rating: 5 },
  { id: 106, date: "12 July, 2025", category: "HVAC", status: "In Progress", assigned: "Arya (Vendor)", sla: "Within 24 hours", rating: 4 },
];

// --- Helper Components & Functions ---

const StarRating: FC<StarRatingProps> = ({ rating }) => {
  if (rating === null || rating === undefined) return <span className="text-gray-400">—</span>;
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`text-base ${index < rating ? "text-yellow-400" : "text-gray-300"}`}>&#9733;</span>
  ));
  return <div className="flex">{stars}</div>;
};

const getCategoryIcon = (category: MaintenanceRequest['category']) => {
  const iconClass: string = "h-4 w-4 mr-2";
  switch (category) {
    case "Electricity": return <Zap className={`${iconClass} text-yellow-500`} />;
    case "Wifi / Internet": return <Wifi className={`${iconClass} text-indigo-500`} />;
    case "Plumbing": return <Droplets className={`${iconClass} text-sky-500`} />;
    case "HVAC": return <span className={iconClass}>❄️</span>;
    default: return null;
  }
};

// getStatusColor helper is no longer used directly in the JSX, but kept for completeness
const getStatusColor = (status: MaintenanceRequest['status']) => {
  switch (status) {
    case "Open": return "bg-red-200 text-red-800";
    case "Resolved": return "bg-green-200 text-green-800";
    case "In Progress": return "bg-yellow-200 text-yellow-800";
    default: return "bg-gray-200 text-gray-800";
  }
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses: string = "inline-flex items-center justify-center gap-1 rounded-full py-1 px-2.5 whitespace-nowrap";
  const textClasses: string = "font-poppins text-xs font-medium";

  let colorClasses: string = "";
  switch (status) {
    case "Open":
      colorClasses = "bg-red-200 text-red-800";
      break;
    case "Resolved":
      colorClasses = "bg-green-200 text-green-800";
      break;
    case "In Progress":
      colorClasses = "bg-yellow-200 text-yellow-800";
      break;
    default:
      // Fallback for types that might be passed incorrectly, though typed strictly
      colorClasses = "bg-gray-200 text-gray-800";
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <span className={`${textClasses}`}>{status}</span>
    </div>
  );
}


// --- Component ---
const MaintenanceRequests: FC = () => {
  // State initialization with explicit typing
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [newReqCategory, setNewReqCategory] = useState<string>("");
  const [newReqStatus, setNewReqStatus] = useState<MaintenanceRequest['status']>("Open");
  const [newReqAssigned, setNewReqAssigned] = useState<string>("");
  const [showRatingPopup, setShowRatingPopup] = useState<boolean>(false);
  const [currentRatingId, setCurrentRatingId] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching Simulation
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 700));
      } catch (err) {
        // Explicitly casting the error to provide context
        setError("Failed to load maintenance requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Maintenance Logic
  const visibleCount: number = isExpanded ? requests.length : 4;
  const itemsRemaining: number = requests.length - visibleCount;

  const calculateSLA = (createdDate: Date): MaintenanceRequest['sla'] => {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    const created: Date = new Date(createdDate);
    created.setHours(0, 0, 0, 0);
    
    // Time difference in milliseconds
    const diffTime: number = today.getTime() - created.getTime(); 
    // Difference in days
    const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays < 1) return "Within 24 hours";
    if (diffDays < 2) return "Within 48 hours";
    return "Overdue";
  };

  const handleSubmitNewRequest = (): void => {
    if (!newReqCategory || !newReqAssigned) {
      alert("Please select a category and enter an assignee.");
      return;
    }
    
    // Ensure the new category is one of the valid types, or fallback to 'Other'
    const validatedCategory: MaintenanceRequest['category'] = (['Electricity', 'Wifi / Internet', 'Plumbing', 'HVAC', 'Other'] as MaintenanceRequest['category'][]).includes(newReqCategory as MaintenanceRequest['category'])
      ? newReqCategory as MaintenanceRequest['category']
      : 'Other';

    const createdDate: Date = new Date();
    const newRequest: MaintenanceRequest = {
      id: Date.now(),
      date: createdDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      category: validatedCategory,
      status: newReqStatus,
      assigned: newReqAssigned,
      sla: calculateSLA(createdDate),
      rating: null,
    };

    setRequests([newRequest, ...requests]);
    setShowPopup(false);
    setNewReqCategory("");
    setNewReqStatus("Open");
    setNewReqAssigned("");
  };

  // Function to trigger rating popup if needed (not called in the provided code, but type-safed)
  const triggerRatingForResolved = (id: number): void => {
    const requestToRate = requests.find((req) => req.id === id);
    if (requestToRate && requestToRate.status === "Resolved" && requestToRate.rating === null) {
      setCurrentRatingId(id);
      setTempRating(0);
      setShowRatingPopup(true);
    }
  };

  const handleRatingSubmit = (): void => {
    if (tempRating === 0) {
      alert("Please select a rating (1-5 stars).");
      return;
    }
    setRequests((prev) => 
      prev.map((req) => (req.id === currentRatingId 
        ? { ...req, status: "Resolved", rating: tempRating } 
        : req
      ))
    );
    setShowRatingPopup(false);
    setTempRating(0);
    setCurrentRatingId(null);
  };

  const handleToggleView = (): void => setIsExpanded(!isExpanded);
  
  // Explicitly type the event handler for input change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setNewReqCategory(e.target.value);
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    // Cast the value to the specific Status type
    setNewReqStatus(e.target.value as MaintenanceRequest['status']);
  };
  const handleAssignedChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewReqAssigned(e.target.value);
  };

  // Render Logic
  if (loading) return <div className="p-4 sm:p-8"><p>Loading Maintenance Requests...</p></div>;
  if (error) return <div className="p-4 sm:p-8"><p className="text-red-600">{error}</p></div>;

  return (
    <div className="w-full rounded-3xl bg-white shadow-xl p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="flex items-center text-lg font-bold text-gray-900 gap-2">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
          Maintenance & Service Requests
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* --- REMOVED Analytics Button --- */}
          <button onClick={() => setShowPopup(true)} className="flex h-[40px] items-center justify-center whitespace-nowrap rounded-xl bg-[#073C9E] px-4 shadow-md gap-2 border border-[#073C9E] text-white text-sm font-medium">+ Add Request</button>
        </div>
      </div>
      {/* Table Container */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto rounded-2xl shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-[#073C9E] text-white uppercase text-xs font-semibold tracking-wider">
                {["ID", "Date", "Category", "Status", "Assigned", "SLA", "Rating"].map(header => (
                  <th key={header} className="py-3 px-4 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 px-4 text-gray-500">No maintenance requests found.</td>
                </tr>
              ) : (
                requests.slice(0, visibleCount).map((req, i) => (
                  <tr key={req.id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                    <td className="py-3 px-4 whitespace-nowrap">{req.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{req.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap flex items-center">{getCategoryIcon(req.category)}{req.category}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{req.assigned}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{req.sla}</td>
                    <td className="py-3 px-4 whitespace-nowrap"><StarRating rating={req.rating} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* View More / View Less */}
        {requests.length > 4 && (
          <div className="mt-4 px-1">
            <button onClick={handleToggleView} className="inline-flex items-center gap-1 text-sm font-medium text-[#073C9E] hover:underline">
              {isExpanded ? (
                <>View less <ChevronsUp className="h-4 w-4" /></>
              ) : (
                <>View more ({itemsRemaining}) <ChevronsDown className="h-4 w-4" /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Add Request Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h2 className="text-lg font-semibold mb-4">Add New Request</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <select className="w-full border border-gray-300 p-2 mb-3 rounded text-sm focus:ring-blue-500 focus:border-blue-500" value={newReqCategory} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              <option value="Electricity">Electricity</option>
              <option value="Wifi / Internet">Wifi / Internet</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Other">Other</option>
            </select>
            <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2 mb-3 rounded text-sm focus:ring-blue-500 focus:border-blue-500" value={newReqStatus} onChange={handleStatusChange}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
            </select>
            <label className="block mb-2 text-sm font-medium text-gray-700">Assign To</label>
            <input className="w-full border border-gray-300 p-2 mb-3 rounded text-sm focus:ring-blue-500 focus:border-blue-500" value={newReqAssigned} onChange={handleAssignedChange} placeholder="Enter assignee name or Vendor" />
            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onClick={handleSubmitNewRequest}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border">
            <h2 className="text-lg font-semibold mb-4 text-center">Rate the Service</h2>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setTempRating(star)} 
                  className={`text-3xl cursor-pointer ${star <= tempRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-300 transition-colors`}
                >
                  &#9733;
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm" onClick={() => { setShowRatingPopup(false); setTempRating(0); setCurrentRatingId(null); }}>Cancel</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onClick={handleRatingSubmit} disabled={tempRating === 0}>Submit Rating</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceRequests;