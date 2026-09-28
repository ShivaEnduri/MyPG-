import React, { memo } from "react";

type Align = "left" | "center" | "right";

export interface Column<T> {
  key: keyof T;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  align?: Align;
  render?: (row: T) => React.ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Array<Column<T>>;
  mobileRenderer?: (row: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

function ResponsiveTableComponent<T>({
  data,
  columns,
  mobileRenderer,
  emptyMessage = "No data available.",
}: ResponsiveTableProps<T>) {
  const alignClass = (align?: Align) => {
    if (align === "right") return "text-right";
    if (align === "center") return "text-center";
    return "text-left";
  };

  const renderCell = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);
    return (row as Record<string, React.ReactNode>)[col.key as string];
  };

  const defaultMobileRenderer = (row: T, index: number) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-4">
      {columns.map((col) => (
        <div key={String(col.key)} className="mb-2 last:mb-0">
          <div className="text-xs text-gray-500">{col.header}</div>
          <div className="text-sm font-semibold text-gray-900">
            {renderCell(row, col)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMobile = mobileRenderer ?? defaultMobileRenderer;
  const hasData = data.length > 0;

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black/5 sm:rounded-lg">
      <table className="hidden md:table min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`${alignClass(col.align)} px-4 py-3 text-sm font-medium whitespace-nowrap text-white ${col.headerClassName ?? ""}`.trim()}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`${alignClass(col.align)} px-4 py-4 whitespace-nowrap text-sm text-gray-900 ${col.cellClassName ?? ""}`.trim()}
                >
                  {renderCell(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="md:hidden space-y-3">
        {data.map((row, idx) => renderMobile(row, idx))}
      </div>

      {!hasData && (
        <div className="text-center py-6 text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
}

const ResponsiveTable = memo(ResponsiveTableComponent) as <T extends object>(
  props: ResponsiveTableProps<T>
) => React.ReactElement;

(ResponsiveTable as any).displayName = "ResponsiveTable";

export default ResponsiveTable;
