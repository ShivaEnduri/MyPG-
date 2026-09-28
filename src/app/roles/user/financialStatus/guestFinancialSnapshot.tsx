import {
  ChevronsDown,
  ChevronsUp,
  ClipboardList,
  BarChart3,
  Plus,
  Calendar,
} from "lucide-react";
import { useMemo, useState } from "react";

// --- SVG Icons ---
const FilterArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#073C9E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Interfaces ---
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  lateFee: number;
  total: number;
  status: string;
}

interface DropdownProps {
  onSelect: (item: string) => void;
}

interface StatusBadgeProps {
  status: string;
}

// --- Mock Data ---
const transactionsData: Transaction[] = [
  { id: 101, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 102, date: "15/04/2025", description: "Misc. fee", amount: 1000, lateFee: 0, total: 1000, status: "Paid" },
  { id: 103, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 1000, total: 21000, status: "Pending" },
  { id: 104, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 1000, total: 21000, status: "Pending" },
  { id: 105, date: "14/03/2025", description: "Mess fee", amount: 3000, lateFee: 0, total: 3000, status: "Paid" },
  { id: 106, date: "10/03/2025", description: "Electricity bill", amount: 500, lateFee: 0, total: 500, status: "Paid" },
  { id: 107, date: "15/02/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 108, date: "15/01/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 109, date: "10/12/2024", description: "Laundry", amount: 300, lateFee: 0, total: 300, status: "Paid" },
];

// --- Helper Function ---
function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// --- Sub-components ---
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full py-1 px-3 whitespace-nowrap";
  const textClasses = "font-poppins text-xs font-medium";

  switch (status) {
    case "Paid":
      return (
        <div className={`${baseClasses} bg-emerald-100 text-emerald-700`}>
          <span className={textClasses}>Paid</span>
        </div>
      );
    case "Pending":
      return (
        <div className={`${baseClasses} bg-amber-100 text-amber-700`}>
          <span className={textClasses}>Pending</span>
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-gray-100 text-gray-700`}>
          <span className={textClasses}>{status}</span>
        </div>
      );
  }
};

const PaymentFilterDropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const items = [
    "All Payments",
    "miscellaneous fee",
    "Laundry",
    "Mess fee",
    "Electricity bill",
    "Rent",
  ];
  return (
    <div className="absolute top-full mt-1 w-full sm:w-auto min-w-[200px] rounded-xl bg-white shadow-xl overflow-hidden z-20 left-0 border border-gray-200">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

const TimeFilterDropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const items = ["Last month", "Last 3 months", "Last 6 months"];
  return (
    <div className="absolute top-full mt-1 w-full sm:w-auto min-w-[200px] rounded-xl bg-white shadow-xl overflow-hidden z-20 right-0 border border-gray-200">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

// --- Main Component ---
const GuestFinancialSnapshot: React.FC = () => {
  const [paymentFilterOpen, setPaymentFilterOpen] = useState<boolean>(false);
  const [timeFilterOpen, setTimeFilterOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("All Payments");
  const [selectedTime, setSelectedTime] = useState<string>("Time Range");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [currentReceipt, setCurrentReceipt] = useState<Transaction | null>(null);

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    const currentDate = new Date(2025, 3, 17); // fixed for demo
    return transactionsData.filter((tx) => {
      const paymentMatch =
        selectedPayment === "All Payments" ||
        (selectedPayment.toLowerCase() === "miscellaneous fee"
          ? tx.description.toLowerCase() === "misc. fee"
          : tx.description.toLowerCase() === selectedPayment.toLowerCase());

      let timeMatch = true;
      if (selectedTime !== "Time Range") {
        const txDate = parseDate(tx.date);
        const startDate = new Date(currentDate);
        if (selectedTime === "Last month")
          startDate.setMonth(currentDate.getMonth() - 1);
        else if (selectedTime === "Last 3 months")
          startDate.setMonth(currentDate.getMonth() - 3);
        else if (selectedTime === "Last 6 months")
          startDate.setMonth(currentDate.getMonth() - 6);
        timeMatch = txDate >= startDate && txDate <= currentDate;
      }
      return paymentMatch && timeMatch;
    });
  }, [selectedPayment, selectedTime]);

  const transactionsToDisplay = showAllRows
    ? filteredTransactions
    : filteredTransactions.slice(0, 3);
  const remaining = Math.max(filteredTransactions.length - 3, 0);

  const handleViewReceipt = (transaction: Transaction) => {
    setCurrentReceipt(transaction);
    setShowReceipt(true);
  };

  const handlePaymentSelect = (item: string) => {
    setSelectedPayment(item);
    setPaymentFilterOpen(false);
  };

  const handleTimeSelect = (item: string) => {
    setSelectedTime(item);
    setTimeFilterOpen(false);
  };

  return (
    <div className="w-full rounded-xl p-4 sm:p-6">
      {/* Top Bar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center 
                    rounded-full bg-[#132347] text-[#FACC15] shadow-md">
      <ClipboardList className="h-4 w-4" />
    </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Financial Snapshot
            </h1>
          </div>
        </div>
      </header>

      {/* Filters Row */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Payment Type */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPaymentFilterOpen((o) => !o);
              setTimeFilterOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 shadow-sm hover:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
          >
            <span className="truncate">
              {selectedPayment === "All Payments"
                ? "Payment Type"
                : selectedPayment}
            </span>
            <FilterArrowIcon />
          </button>
          {paymentFilterOpen && (
            <PaymentFilterDropdown onSelect={handlePaymentSelect} />
          )}
        </div>

        {/* Time Range */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setTimeFilterOpen((o) => !o);
              setPaymentFilterOpen(false);
            }}
            className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 shadow-sm hover:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
          >
            <span className="truncate">
              {selectedTime === "Time Range" ? "Time Range" : selectedTime}
            </span>
            <FilterArrowIcon />
          </button>
          {timeFilterOpen && <TimeFilterDropdown onSelect={handleTimeSelect} />}
        </div>

        {/* From / To date (dummy UI) */}
        <div className="hidden lg:flex h-11 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-400 shadow-sm">
          <span>From date</span>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <div className="hidden lg:flex h-11 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-400 shadow-sm">
          <span>To date</span>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* DESKTOP / TABLET TABLE VIEW */}
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#043B95] text-left text-xs font-semibold uppercase tracking-wide text-white">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Late fee</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactionsToDisplay.map((tx) => (
                <tr
                  key={tx.id}
                  className="group bg-white hover:bg-indigo-50/60 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-indigo-700">
                    <button
                      type="button"
                      className="underline underline-offset-2 decoration-indigo-400 font-medium"
                    >
                      {tx.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tx.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tx.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    ₹{tx.lateFee.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ₹{tx.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleViewReceipt(tx)}
                      className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-100"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}

              {transactionsToDisplay.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No transactions found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
  {/* MOBILE CARD VIEW */}
<div className="mt-2 md:hidden space-y-2">
  {transactionsToDisplay.map((tx) => (
    <div
      key={tx.id}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300 transition"
    >
      {/* Row: ID + Date */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-indigo-700">#{tx.id}</h3>
        <span className="text-xs text-gray-500">{tx.date}</span>
      </div>

      {/* Category */}
      <p className="text-[13px] text-gray-700 mt-2">{tx.description}</p>

      {/* Status */}
      <div className="mt-2">
        <StatusBadge status={tx.status} />
      </div>

      {/* Amount Info - all in one clean row */}
      <div className="mt-3 flex justify-between text-sm text-gray-800">
        <div>
          <p className="text-[11px] text-gray-500">Amount</p>
          <p className="font-semibold">₹{tx.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Late Fee</p>
          <p className="font-semibold">₹{tx.lateFee.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Total</p>
          <p className="font-semibold text-gray-900">
            ₹{tx.total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => handleViewReceipt(tx)}
          className="text-[12px] px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
        >
          View Receipt
        </button>
      </div>
    </div>
  ))}
</div>


      {/* View More / Less (common for both layouts) */}
      {filteredTransactions.length > 3 && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllRows((v) => !v)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-indigo-700 hover:text-indigo-800"
          >
            {showAllRows ? (
              <>
                View less
                <ChevronsUp className="h-4 w-4" />
              </>
            ) : (
              <>
                View more ({remaining})
                <ChevronsDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Receipt Popup */}
      {showReceipt && currentReceipt && (
        <div
          onClick={() => setShowReceipt(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Receipt Details
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {currentReceipt.date}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {currentReceipt.description}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {currentReceipt.amount.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Late Fee:</span> ₹
                {currentReceipt.lateFee.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Total:</span> ₹
                {currentReceipt.total.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {currentReceipt.status}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFinancialSnapshot;
