import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Plus, Trash2, Edit, X, ChevronDown, ChevronUp } from "lucide-react";
import { useTables, TableRow } from "../contexts/TablesContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";

interface DynamicTableDataPageProps {
  tableId: string;
}

export function DynamicTableDataPage({ tableId }: DynamicTableDataPageProps) {
  const { tables, tableData, addRowToTable, updateRowInTable, deleteRowFromTable } = useTables();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [formData, setFormData] = useState<TableRow>({});

  const table = tables.find((t) => t.id === tableId);
  const rows = tableData[tableId] || [];

  if (!table) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Table not found</p>
          <p className="text-sm text-gray-400 mt-2">The table you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!table.attributes || table.attributes.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{table.tableName}</h1>
          {table.description && (
            <p className="text-sm md:text-base text-gray-600 mt-2">{table.description}</p>
          )}
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No attributes defined for this table</p>
        </div>
      </div>
    );
  }

  const handleAddRow = () => {
    const newRow: TableRow = {};
    table.attributes.forEach((attr) => {
      newRow[attr.columnName] = attr.defaultValue || "";
    });
    setFormData(newRow);
    setAddDialogOpen(true);
  };

  const handleEditRow = (index: number) => {
    setEditingRowIndex(index);
    setFormData({ ...rows[index] });
    setEditDialogOpen(true);
  };

  const handleDeleteRow = (index: number) => {
    if (confirm("Are you sure you want to delete this row?")) {
      deleteRowFromTable(tableId, index);
    }
  };

  const handleSaveNewRow = () => {
    addRowToTable(tableId, formData);
    setAddDialogOpen(false);
    setFormData({});
  };

  const handleSaveEditRow = () => {
    if (editingRowIndex !== null) {
      updateRowInTable(tableId, editingRowIndex, formData);
      setEditDialogOpen(false);
      setEditingRowIndex(null);
      setFormData({});
    }
  };

  const handleToggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleFormChange = (columnName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [columnName]: value }));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{table.tableName}</h1>
        {table.description && (
          <p className="text-sm md:text-base text-gray-600 mt-2">{table.description}</p>
        )}
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Records ({rows.length})</CardTitle>
            <Button onClick={handleAddRow} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No records found</p>
              <p className="text-sm mt-1">Click "Add New" to create your first record</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {table.attributes.slice(0, 4).map((attr) => (
                      <th
                        key={attr.id}
                        className="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                      >
                        {attr.columnName}
                      </th>
                    ))}
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <>
                      <tr key={`row-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                        {table.attributes.slice(0, 1).map((attr) => (
                          <td key={attr.id} className="py-4 px-4">
                            <button
                              onClick={() => handleToggleRow(index)}
                              className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
                            >
                              {expandedRows.includes(index) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              {String(row[attr.columnName] || "-")}
                            </button>
                          </td>
                        ))}
                        {table.attributes.slice(1, 4).map((attr) => (
                          <td key={attr.id} className="py-4 px-4 text-gray-900">
                            {String(row[attr.columnName] || "-")}
                          </td>
                        ))}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRow(index)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRow(index)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded Details Row */}
                      {expandedRows.includes(index) && (
                        <tr className="bg-blue-50/30 border-b border-gray-100">
                          <td colSpan={table.attributes.slice(0, 4).length + 1} className="py-4 px-4">
                            <div className="max-w-4xl">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Record Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {table.attributes.map((attr) => (
                                  <div key={attr.id} className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">
                                      {attr.columnName}
                                    </p>
                                    <p className="text-gray-900">
                                      {String(row[attr.columnName] || "-")}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Record</DialogTitle>
            <DialogDescription>
              Enter the details for the new record in {table.tableName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {table.attributes.map((attr) => (
                <div key={attr.id} className="space-y-2">
                  <Label htmlFor={`add-${attr.columnName}`}>
                    {attr.columnName}
                    {attr.isRequired && <span className="text-red-500"> *</span>}
                  </Label>
                  <Input
                    id={`add-${attr.columnName}`}
                    placeholder={`Enter ${attr.columnName}`}
                    value={formData[attr.columnName] || ""}
                    onChange={(e) => handleFormChange(attr.columnName, e.target.value)}
                  />
                  <p className="text-xs text-gray-500">{attr.dataType}</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewRow}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Update the details for this record in {table.tableName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {table.attributes.map((attr) => (
                <div key={attr.id} className="space-y-2">
                  <Label htmlFor={`edit-${attr.columnName}`}>
                    {attr.columnName}
                    {attr.isRequired && <span className="text-red-500"> *</span>}
                  </Label>
                  <Input
                    id={`edit-${attr.columnName}`}
                    placeholder={`Enter ${attr.columnName}`}
                    value={formData[attr.columnName] || ""}
                    onChange={(e) => handleFormChange(attr.columnName, e.target.value)}
                  />
                  <p className="text-xs text-gray-500">{attr.dataType}</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditRow}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}