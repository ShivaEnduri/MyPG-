// DownloadReportModal.tsx
import { useEffect, useRef, useState, FormEvent } from "react";

interface DownloadReportModalProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (payload: ReportPayload) => Promise<void> | void;
}

interface IncludeFields {
  occupancy: boolean;
  guests: boolean;
  revenue: boolean;
  overdue: boolean;
}

interface ReportPayload {
  period: "monthly" | "weekly" | "custom";
  customFrom: string | null;
  customTo: string | null;
  include: IncludeFields;
  format: "pdf" | "excel";
}

export default function DownloadReportModal({
  open,
  onClose,
  onSubmit,
}: DownloadReportModalProps) {
  // state
  const [period, setPeriod] = useState<"monthly" | "weekly" | "custom">(
    "monthly"
  );
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [include, setInclude] = useState<IncludeFields>({
    occupancy: false,
    guests: false,
    revenue: false,
    overdue: false,
  });
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [loading, setLoading] = useState(false);

  const fromRef = useRef<HTMLInputElement | null>(null);

  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // prevent scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  useEffect(() => {
    if (period === "custom" && fromRef.current) {
      fromRef.current.focus();
    }
  }, [period]);

  if (!open) return null;

  const toggleInclude = (key: keyof IncludeFields) =>
    setInclude((s) => ({ ...s, [key]: !s[key] }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (period === "custom" && (!customFrom || !customTo)) {
      alert("Please select both start and end dates for custom range.");
      return;
    }

    const payload: ReportPayload = {
      period,
      customFrom: period === "custom" ? customFrom : null,
      customTo: period === "custom" ? customTo : null,
      include,
      format,
    };

    try {
      setLoading(true);
      const res = onSubmit ? onSubmit(payload) : null;
      if (res && typeof (res as any).then === "function") await res; // Type-safe async handling
      onClose?.();
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setLoading(false);
    }
  };

  // SVG components
  const RadioDot: React.FC<{ checked: boolean }> = ({ checked }) => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle
        cx="6"
        cy="6"
        r="5.25"
        fill={checked ? "#605BFF" : "#FFF"}
        stroke="#B7B4B4"
        strokeWidth="1"
      />
    </svg>
  );

  const CheckboxBox: React.FC<{ checked: boolean }> = ({ checked }) => (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M3 0.5H10C11.3807 0.5 12.5 1.61929 12.5 3V9C12.5 10.3807 11.3807 11.5 10 11.5H3C1.61929 11.5 0.5 10.3807 0.5 9V3C0.5 1.61929 1.61929 0.5 3 0.5Z"
        fill={checked ? "#605BFF" : "#FFF"}
        stroke="#B7B4B4"
      />
      {checked && (
        <path
          d="M3.6 6.2L5.2 7.8L9.2 3.8"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <h3 className="text-sm font-semibold text-gray-900 mb-3">{children}</h3>
  );

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Download Report"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Download Report
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-6">
          {/* Report Period */}
          <section>
            <SectionTitle>Report Period</SectionTitle>
            <div className="mt-1 flex flex-wrap items-center gap-6">
              {["monthly", "weekly"].map((value) => (
                <label
                  key={value}
                  className="inline-flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setPeriod(value as "monthly" | "weekly")}
                >
                  <RadioDot checked={period === value} />
                  <span style={labelStyle}>
                    {value[0].toUpperCase() + value.slice(1)}
                  </span>
                </label>
              ))}

              {period !== "custom" ? (
                <button
                  type="button"
                  onClick={() => setPeriod("custom")}
                  className="relative flex items-center justify-center w-[96px] h-[31px] rounded-md"
                  style={customButtonStyle}
                >
                  <span style={customButtonTextStyle}>Custom Range</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <input
                    ref={fromRef}
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3D63EA]"
                  />
                  <span className="text-sm text-gray-400">—</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3D63EA]"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Include */}
          <section>
            <SectionTitle>Include</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(include).map((key) => (
                <label
                  key={key}
                  className="inline-flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => toggleInclude(key as keyof IncludeFields)}
                >
                  <CheckboxBox checked={include[key as keyof IncludeFields]} />
                  <span style={labelStyle}>
                    {key === "guests" ? "Active Guests" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* File Format */}
          <section>
            <SectionTitle>File Format</SectionTitle>
            <div className="flex items-center gap-6">
              {["pdf", "excel"].map((value) => (
                <label
                  key={value}
                  className="inline-flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setFormat(value as "pdf" | "excel")}
                >
                  <RadioDot checked={format === value} />
                  <span style={labelStyle}>{value.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button type="button" onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={downloadButtonStyle}>
            {loading ? "Preparing..." : "Download"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Inline Styles ---------------- */

const labelStyle: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif",
  fontSize: 15,
  color: "#000",
  fontWeight: 400,
};

const customButtonStyle: React.CSSProperties = {
  background: "#F7F7F8",
  border: "1px solid #B3B3BF",
  filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.01))",
};

const customButtonTextStyle: React.CSSProperties = {
  color: "#767575",
  fontFamily: "Nunito, sans-serif",
  fontSize: 12,
  fontWeight: 600,
};

const cancelButtonStyle: React.CSSProperties = {
  width: 88,
  height: 33,
  background: "#EBEBEF",
  border: "1px solid #B3B3BF",
  fontFamily: "Nunito, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#404040",
  borderRadius: "8px",
};

const downloadButtonStyle: React.CSSProperties = {
  width: 100,
  height: 33,
  background: "#605BFF",
  borderRadius: "4px",
  fontFamily: "Nunito, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#fff",
};

