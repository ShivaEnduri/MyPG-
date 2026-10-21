
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Database,
  FileSpreadsheet,
  FileUp,
  Filter,
  Info,
  LoaderCircle,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";

type DataRow = Record<string, unknown>;

type TableDefinition = {
  id: string;
  name: string;
  description: string;
  columns: string[];
  rows: DataRow[];
  primaryKey: string;
};

type ImportRow = {
  id: string;
  data: DataRow;
  issues: string[];
  selected: boolean;
};

type Notice = {
  type: "success" | "error" | "info";
  message: string;
};

const initialTables: TableDefinition[] = [
  {
    id: "pgs",
    name: "PG Properties",
    description: "PG details submitted by property owners",
    primaryKey: "pg_id",
    columns: ["pg_id", "pg_name", "city", "owner_name", "status"],
    rows: [
      {
        pg_id: 101,
        pg_name: "Green Valley Residency",
        city: "Hyderabad",
        owner_name: "Ravi Kumar",
        status: "ACTIVE",
      },
      {
        pg_id: 102,
        pg_name: "Sunrise Living",
        city: "Hyderabad",
        owner_name: "Suresh Reddy",
        status: "PENDING",
      },
      {
        pg_id: 103,
        pg_name: "Urban Nest",
        city: "Bengaluru",
        owner_name: "Kiran Rao",
        status: "ACTIVE",
      },
    ],
  },
  {
    id: "owners",
    name: "Owners",
    description: "Property owner accounts",
    primaryKey: "owner_id",
    columns: ["owner_id", "name", "email", "phone", "status"],
    rows: [
      {
        owner_id: 1,
        name: "Ravi Kumar",
        email: "ravi@example.com",
        phone: "9876543210",
        status: "ACTIVE",
      },
      {
        owner_id: 2,
        name: "Suresh Reddy",
        email: "suresh@example.com",
        phone: "9876543211",
        status: "ACTIVE",
      },
    ],
  },
  {
    id: "amenities",
    name: "Amenities",
    description: "Available PG amenities",
    primaryKey: "amenity_id",
    columns: ["amenity_id", "name", "category", "status"],
    rows: [
      {
        amenity_id: 1,
        name: "Wi-Fi",
        category: "ESSENTIALS",
        status: "ACTIVE",
      },
      {
        amenity_id: 2,
        name: "Laundry",
        category: "SERVICES",
        status: "ACTIVE",
      },
      {
        amenity_id: 3,
        name: "CCTV",
        category: "SECURITY",
        status: "ACTIVE",
      },
    ],
  },
];

const normalize = (value: unknown) =>
  String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "");

function getCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AddData() {
  const [tables, setTables] = useState<TableDefinition[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState("pgs");
  const [search, setSearch] = useState("");
  const [uploadRows, setUploadRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "import" | "delete" | null
  >(null);
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<string[]>([]);
  const [showInvalid, setShowInvalid] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTable = tables.find(
    (table) => table.id === selectedTableId
  )!;

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return selectedTable.rows.filter((row) => {
      if (!query) return true;

      return selectedTable.columns.some((column) =>
        getCellValue(row[column]).toLowerCase().includes(query)
      );
    });
  }, [selectedTable, search]);

  const selectedImportRows = uploadRows.filter(
    (row) => row.selected && row.issues.length === 0
  );

  const validCount = uploadRows.filter(
    (row) => row.issues.length === 0
  ).length;

  const invalidCount = uploadRows.length - validCount;

  const showNotice = (message: string, type: Notice["type"]) => {
    setNotice({ message, type });
  };

  const changeTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setSearch("");
    setUploadRows([]);
    setFileName("");
    setSelectedDeleteIds([]);
    setNotice(null);
    setShowInvalid(false);
  };

  const validateRow = (
    data: DataRow,
    existingRows: DataRow[],
    rowIndex: number
  ) => {
    const issues: string[] = [];

    const emptyColumns = selectedTable.columns.filter(
      (column) =>
        data[column] === undefined ||
        data[column] === null ||
        String(data[column]).trim() === ""
    );

    if (emptyColumns.length > 0) {
      issues.push(`Missing: ${emptyColumns.join(", ")}`);
    }

    const key = selectedTable.primaryKey;
    const incomingKey = data[key];

    if (
      incomingKey !== undefined &&
      incomingKey !== null &&
      String(incomingKey).trim() !== ""
    ) {
      const exists = existingRows.some(
        (row) => normalize(row[key]) === normalize(incomingKey)
      );

      if (exists) {
        issues.push(`Duplicate ${key}: ${String(incomingKey)}`);
      }
    }

    return {
      id: `upload-${rowIndex}-${String(incomingKey ?? "row")}`,
      data,
      issues,
      selected: issues.length === 0,
    };
  };

  const processFile = async (file?: File) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(extension ?? "")) {
      showNotice("Upload an Excel (.xlsx, .xls) or CSV file.", "error");
      return;
    }

    setIsReading(true);
    setNotice(null);
    setUploadRows([]);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!sheet) {
        throw new Error("The uploaded file does not contain a worksheet.");
      }

      const rawRows = XLSX.utils.sheet_to_json<DataRow>(sheet, {
        defval: "",
        raw: false,
      });

      if (rawRows.length === 0) {
        throw new Error("The selected worksheet has no data rows.");
      }

      const expected = selectedTable.columns.map(normalize);
      const firstRow = rawRows[0];

      const headerMap = new Map<string, string>();

      Object.keys(firstRow).forEach((header) => {
        headerMap.set(normalize(header), header);
      });

      const missingHeaders = selectedTable.columns.filter(
        (column) => !headerMap.has(normalize(column))
      );

      const extraHeaders = Object.keys(firstRow).filter(
        (header) => !expected.includes(normalize(header))
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Missing required columns: ${missingHeaders.join(", ")}. Use the selected table's column names as Excel headers.`
        );
      }

      const parsed: ImportRow[] = rawRows.map((rawRow, index) => {
        const data: DataRow = {};

        selectedTable.columns.forEach((column) => {
          const sourceHeader = headerMap.get(normalize(column))!;
          data[column] = rawRow[sourceHeader];
        });

        const result = validateRow(
          data,
          selectedTable.rows,
          index + 1
        );

        // Extra columns are deliberately excluded from the import.
        if (index === 0 && extraHeaders.length > 0) {
          // Report this separately instead of silently importing them.
        }

        return result;
      });

      // Also catch duplicate keys within the uploaded file itself.
      const key = selectedTable.primaryKey;
      const seenKeys = new Set<string>();

      parsed.forEach((row) => {
        const value = row.data[key];

        if (value === undefined || String(value).trim() === "") return;

        const normalizedKey = normalize(value);

        if (seenKeys.has(normalizedKey)) {
          row.issues.push(`Duplicate ${key} in uploaded file`);
          row.selected = false;
        } else {
          seenKeys.add(normalizedKey);
        }
      });

      setUploadRows(parsed);

      const extraMessage =
        extraHeaders.length > 0
          ? ` Ignored unrelated columns: ${extraHeaders.join(", ")}.`
          : "";

      showNotice(
        `File reviewed: ${parsed.length} rows, ${parsed.filter((row) => row.issues.length === 0).length} valid, ${parsed.filter((row) => row.issues.length > 0).length} needing review.${extraMessage}`,
        parsed.some((row) => row.issues.length > 0) ? "info" : "success"
      );
    } catch (error) {
      setFileName("");
      setUploadRows([]);
      showNotice(
        error instanceof Error ? error.message : "Unable to read this file.",
        "error"
      );
    } finally {
      setIsReading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleImportRow = (id: string, checked: boolean) => {
    setUploadRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              selected: checked && row.issues.length === 0,
            }
          : row
      )
    );
  };

  const selectAllValidImportRows = (checked: boolean) => {
    setUploadRows((current) =>
      current.map((row) => ({
        ...row,
        selected: checked && row.issues.length === 0,
      }))
    );
  };

  const toggleDeleteRow = (key: string, checked: boolean) => {
    setSelectedDeleteIds((current) =>
      checked
        ? [...current, key]
        : current.filter((id) => id !== key)
    );
  };

  const confirmImport = () => {
    const rowsToImport = uploadRows.filter(
      (row) => row.selected && row.issues.length === 0
    );

    if (rowsToImport.length === 0) {
      setConfirmAction(null);
      showNotice("Select at least one valid row to import.", "error");
      return;
    }

    const currentTable = tables.find(
      (table) => table.id === selectedTableId
    )!;

    const currentKeys = new Set(
      currentTable.rows.map((row) =>
        normalize(row[currentTable.primaryKey])
      )
    );

    // Recheck primary keys immediately before insertion.
    const actuallyImportable = rowsToImport.filter((row) => {
      const key = normalize(row.data[currentTable.primaryKey]);

      if (!key || currentKeys.has(key)) {
        row.issues.push("Duplicate primary key detected");
        row.selected = false;
        return false;
      }

      currentKeys.add(key);
      return true;
    });

    if (actuallyImportable.length === 0) {
      setUploadRows([...uploadRows]);
      setConfirmAction(null);
      showNotice("No rows could be imported. Review duplicate keys.", "error");
      return;
    }

    setTables((current) =>
      current.map((table) =>
        table.id === selectedTableId
          ? {
              ...table,
              rows: [
                ...table.rows,
                ...actuallyImportable.map((row) => ({ ...row.data })),
              ],
            }
          : table
      )
    );

    setUploadRows([]);
    setFileName("");
    setConfirmAction(null);
    showNotice(
      `${actuallyImportable.length} record(s) added to ${currentTable.name}. This is a local demo; no database was changed.`,
      "success"
    );
  };

  const confirmDelete = () => {
    if (selectedDeleteIds.length === 0) {
      setConfirmAction(null);
      return;
    }

    const count = selectedDeleteIds.length;
    const keysToDelete = new Set(selectedDeleteIds);

    setTables((current) =>
      current.map((table) =>
        table.id === selectedTableId
          ? {
              ...table,
              rows: table.rows.filter(
                (row) =>
                  !keysToDelete.has(
                    String(row[table.primaryKey])
                  )
              ),
            }
          : table
      )
    );

    setSelectedDeleteIds([]);
    setConfirmAction(null);

    showNotice(
      `${count} record(s) removed from the local demo table. No database was changed.`,
      "success"
    );
  };

  const allVisibleSelected =
    visibleRows.length > 0 &&
    visibleRows.every((row) =>
      selectedDeleteIds.includes(String(row[selectedTable.primaryKey]))
    );

  const allValidSelected =
    validCount > 0 &&
    uploadRows
      .filter((row) => row.issues.length === 0)
      .every((row) => row.selected);

  return (
    <div className="min-h-full bg-slate-50">
      {/* Page heading */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <Database className="h-4 w-4" />
              Admin workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Add Data
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review database records, validate owner-submitted Excel files,
              and approve changes before they are applied.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Demo mode · Static data
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Table selector and stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
            <label
              htmlFor="table-select"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Select database table
            </label>

            <div className="relative">
              <Database className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
              <select
                id="table-select"
                value={selectedTableId}
                onChange={(event) => changeTable(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {selectedTable.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Existing records
              </span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900">
              {selectedTable.rows.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              In the selected demo table
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Excel rows ready
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900">
              {selectedImportRows.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Valid and selected for import
            </p>
          </div>
        </div>

        {/* Feedback */}
        {notice && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : notice.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : notice.type === "error" ? (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="min-w-0 flex-1 text-sm leading-6">
              {notice.message}
            </p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notification"
              className="rounded p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Excel upload */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Import owner data
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a spreadsheet, review each row, then approve valid records.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragOver(false);
                void processFile(event.dataTransfer.files[0]);
              }}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition sm:py-10 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40"
              }`}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
                {isReading ? (
                  <LoaderCircle className="h-7 w-7 animate-spin" />
                ) : (
                  <FileUp className="h-7 w-7" />
                )}
              </div>

              <p className="text-sm font-semibold text-slate-800">
                {isReading
                  ? "Reading spreadsheet..."
                  : "Drop your Excel file here"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                or choose a file from your device
              </p>
              <p className="mt-2 text-xs text-slate-400">
                XLSX, XLS or CSV · First worksheet is used
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(event) =>
                  void processFile(event.target.files?.[0])
                }
              />

              <button
                type="button"
                disabled={isReading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                Choose Excel file
              </button>

              {fileName && (
                <p className="mt-3 max-w-full break-all text-xs text-slate-500">
                  Selected: {fileName}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <p className="text-xs leading-5 text-slate-600">
                Use the exact column names shown in the selected table below.
                Unknown columns are ignored. Missing required values and duplicate
                primary keys are flagged for review. This demo does not write to
                your real database.
              </p>
            </div>
          </div>
        </section>

        {/* Import review */}
        {uploadRows.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Review uploaded rows
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {fileName} · {uploadRows.length} total rows
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {validCount} valid
                </span>
                <span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {invalidCount} need review
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={allValidSelected}
                  onChange={(event) =>
                    selectAllValidImportRows(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                />
                Select all valid rows
              </label>

              {invalidCount > 0 && (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={showInvalid}
                    onChange={(event) => setShowInvalid(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />
                  Show only rows needing review
                </label>
              )}
            </div>

            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-4 py-3">Status</th>
                    {selectedTable.columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                    <th className="px-4 py-3">Validation details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploadRows
                    .filter((row) =>
                      showInvalid ? row.issues.length > 0 : true
                    )
                    .map((row) => (
                      <tr
                        key={row.id}
                        className={
                          row.issues.length > 0
                            ? "bg-red-50/40"
                            : "hover:bg-slate-50"
                        }
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            disabled={row.issues.length > 0}
                            onChange={(event) =>
                              toggleImportRow(row.id, event.target.checked)
                            }
                            aria-label="Select row for import"
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600 disabled:opacity-40"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {row.issues.length === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                              <Check className="h-3 w-3" />
                              Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                              <AlertTriangle className="h-3 w-3" />
                              Review
                            </span>
                          )}
                        </td>
                        {selectedTable.columns.map((column) => (
                          <td
                            key={column}
                            className="max-w-64 truncate px-4 py-3 text-slate-700"
                            title={getCellValue(row.data[column])}
                          >
                            {getCellValue(row.data[column])}
                          </td>
                        ))}
                        <td className="max-w-64 whitespace-normal px-4 py-3 text-xs text-red-700">
                          {row.issues.length > 0
                            ? row.issues.join("; ")
                            : "No issues"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {showInvalid && invalidCount > 0 && (
              <div className="border-t border-slate-100 p-4 text-xs text-slate-500">
                Invalid rows are excluded from importing. Correct the source
                spreadsheet and upload it again to review those records.
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                {selectedImportRows.length} valid row(s) selected
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setUploadRows([]);
                    setFileName("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel upload
                </button>
                <button
                  type="button"
                  disabled={selectedImportRows.length === 0}
                  onClick={() => setConfirmAction("import")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Review & import
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Existing database records */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Existing records
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedTable.name} · {visibleRows.length} of{" "}
                {selectedTable.rows.length} records
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search records..."
                  aria-label="Search records"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                disabled={selectedDeleteIds.length === 0}
                onClick={() => setConfirmAction("delete")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
                Delete selected ({selectedDeleteIds.length})
              </button>
            </div>
          </div>

          {visibleRows.length > 0 ? (
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={(event) => {
                          const keys = visibleRows.map((row) =>
                            String(row[selectedTable.primaryKey])
                          );

                          setSelectedDeleteIds((current) =>
                            event.target.checked
                              ? [...new Set([...current, ...keys])]
                              : current.filter((id) => !keys.includes(id))
                          );
                        }}
                        aria-label="Select all visible records"
                        className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                      />
                    </th>
                    {selectedTable.columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleRows.map((row, index) => {
                    const key = String(row[selectedTable.primaryKey]);
                    const checked = selectedDeleteIds.includes(key);

                    return (
                      <tr
                        key={`${key}-${index}`}
                        className={
                          checked ? "bg-red-50/50" : "hover:bg-slate-50"
                        }
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) =>
                              toggleDeleteRow(key, event.target.checked)
                            }
                            aria-label={`Select record ${key} for deletion`}
                            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                          />
                        </td>
                        {selectedTable.columns.map((column) => (
                          <td
                            key={column}
                            className="max-w-72 truncate px-4 py-3 text-slate-700"
                            title={getCellValue(row[column])}
                          >
                            {getCellValue(row[column])}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <div className="mb-3 rounded-2xl bg-slate-100 p-4 text-slate-400">
                <Filter className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-800">No records found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or select a different table.
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            <p className="text-xs leading-5 text-slate-500">
              Primary key:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
                {selectedTable.primaryKey}
              </code>
              . Deletion is a demo-only operation until a backend is connected.
            </p>
          </div>
        </section>

        {/* Required columns */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-bold text-slate-900">
            Excel column requirements
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your spreadsheet must use these headers for the currently selected
            table.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTable.columns.map((column) => (
              <code
                key={column}
                className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                  column === selectedTable.primaryKey
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {column}
                {column === selectedTable.primaryKey ? " · PK" : ""}
              </code>
            ))}
          </div>
        </section>
      </div>

      {/* Confirmation dialog */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmAction(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                confirmAction === "delete"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2
              id="confirm-title"
              className="text-lg font-bold text-slate-900"
            >
              {confirmAction === "import"
                ? "Confirm data import"
                : "Confirm record deletion"}
            </h2>

            <p
              id="confirm-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              {confirmAction === "import"
                ? `You are about to add ${selectedImportRows.length} record(s) to "${selectedTable.name}". Check the selected table and data before proceeding.`
                : `You are about to delete ${selectedDeleteIds.length} record(s) from "${selectedTable.name}". This operation may be irreversible once connected to the real database.`}
            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <p className="text-xs leading-5 text-amber-900">
                  This is a static demo. Confirming will modify only local
                  component state, not the actual database.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  confirmAction === "import"
                    ? confirmImport
                    : confirmDelete
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                  confirmAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {confirmAction === "import"
                  ? `Confirm import (${selectedImportRows.length})`
                  : `Delete (${selectedDeleteIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
