import React, { createContext, useContext, useState, ReactNode } from "react";

export interface TableAttribute {
  id: string;
  columnName: string;
  dataType: string;
  isPrimaryKey: boolean;
  isRequired: boolean;
  isUnique: boolean;
  defaultValue: string;
  relation: string;
}

export interface TableDefinition {
  id: string;
  tableName: string;
  attributes: TableAttribute[];
  description: string;
}

export interface TableRow {
  [key: string]: any;
}

interface TablesContextType {
  tables: TableDefinition[];
  addTable: (table: TableDefinition) => void;
  deleteTable: (id: string) => void;
  tableData: { [tableId: string]: TableRow[] };
  addRowToTable: (tableId: string, row: TableRow) => void;
  updateRowInTable: (tableId: string, rowIndex: number, row: TableRow) => void;
  deleteRowFromTable: (tableId: string, rowIndex: number) => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export function TablesProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<TableDefinition[]>([]);
  const [tableData, setTableData] = useState<{ [tableId: string]: TableRow[] }>({});

  const addTable = (table: TableDefinition) => {
    setTables((prev) => [...prev, table]);
    setTableData((prev) => ({ ...prev, [table.id]: [] }));
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
    setTableData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const addRowToTable = (tableId: string, row: TableRow) => {
    setTableData((prev) => ({
      ...prev,
      [tableId]: [...(prev[tableId] || []), row],
    }));
  };

  const updateRowInTable = (tableId: string, rowIndex: number, row: TableRow) => {
    setTableData((prev) => ({
      ...prev,
      [tableId]: prev[tableId].map((r, i) => (i === rowIndex ? row : r)),
    }));
  };

  const deleteRowFromTable = (tableId: string, rowIndex: number) => {
    setTableData((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter((_, i) => i !== rowIndex),
    }));
  };

  return (
    <TablesContext.Provider
      value={{
        tables,
        addTable,
        deleteTable,
        tableData,
        addRowToTable,
        updateRowInTable,
        deleteRowFromTable,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TablesContext);
  if (context === undefined) {
    throw new Error("useTables must be used within a TablesProvider");
  }
  return context;
}
