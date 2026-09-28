import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Plus, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";

interface VendorData {
  id: number;
  name: string;
  companyName: string;
  serviceType: string;
  phone: string;
  email: string;
  address: string;
  contractDate: string;
  monthlyAmount: string;
  status: 'active' | 'inactive' | 'pending';
}

const initialVendorData: VendorData[] = [
  {
    id: 1,
    name: "Sunil Enterprises",
    companyName: "Sunil Enterprises Pvt Ltd",
    serviceType: "Plumbing Services",
    phone: "+91 98765 43220",
    email: "contact@sunilenterprises.com",
    address: "123, MG Road, Bangalore",
    contractDate: "01-Jan-2024",
    monthlyAmount: "₹25,000",
    status: 'active'
  },
  {
    id: 2,
    name: "Power Electric Co",
    companyName: "Power Electric Solutions",
    serviceType: "Electrical Services",
    phone: "+91 98765 43221",
    email: "info@powerelectric.com",
    address: "456, Brigade Road, Bangalore",
    contractDate: "15-Feb-2024",
    monthlyAmount: "₹30,000",
    status: 'active'
  },
  {
    id: 3,
    name: "Fresh Foods Suppliers",
    companyName: "Fresh Foods & Groceries",
    serviceType: "Food Supply",
    phone: "+91 98765 43222",
    email: "sales@freshfoods.com",
    address: "789, Indiranagar, Bangalore",
    contractDate: "10-Mar-2024",
    monthlyAmount: "₹50,000",
    status: 'pending'
  },
  {
    id: 4,
    name: "CleanPro Services",
    companyName: "CleanPro Maintenance Ltd",
    serviceType: "Cleaning & Maintenance",
    phone: "+91 98765 43223",
    email: "support@cleanpro.com",
    address: "321, Whitefield, Bangalore",
    contractDate: "20-Apr-2024",
    monthlyAmount: "₹20,000",
    status: 'active'
  },
];

export function VendorTable() {
  const [vendorData, setVendorData] = useState<VendorData[]>(initialVendorData);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    serviceType: "",
    phone: "",
    email: "",
    address: "",
    contractDate: "",
    monthlyAmount: "",
  });

  const handleToggleRow = (vendorId: number) => {
    setExpandedRows((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleOpenEditDialog = (vendor: VendorData) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      companyName: vendor.companyName,
      serviceType: vendor.serviceType,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      contractDate: vendor.contractDate,
      monthlyAmount: vendor.monthlyAmount,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.serviceType || !formData.phone || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedVendor) {
      setVendorData(prev => prev.map(v => 
        v.id === selectedVendor.id 
          ? {
              ...v,
              name: formData.name,
              companyName: formData.companyName,
              serviceType: formData.serviceType,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              contractDate: formData.contractDate,
              monthlyAmount: formData.monthlyAmount,
            }
          : v
      ));
      setEditDialogOpen(false);
      setSelectedVendor(null);
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setSelectedVendor(null);
    setFormData({
      name: "",
      companyName: "",
      serviceType: "",
      phone: "",
      email: "",
      address: "",
      contractDate: "",
      monthlyAmount: "",
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.serviceType || !formData.phone || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    const newVendor: VendorData = {
      id: vendorData.length > 0 ? Math.max(...vendorData.map(v => v.id)) + 1 : 1,
      name: formData.name,
      companyName: formData.companyName || formData.name,
      serviceType: formData.serviceType,
      phone: formData.phone,
      email: formData.email,
      address: formData.address || "N/A",
      contractDate: formData.contractDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      monthlyAmount: formData.monthlyAmount || "₹0",
      status: 'active'
    };

    setVendorData((prev) => [...prev, newVendor]);
    setFormData({
      name: "",
      companyName: "",
      serviceType: "",
      phone: "",
      email: "",
      address: "",
      contractDate: "",
      monthlyAmount: "",
    });
    setAddDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Manage vendors and service providers</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vendors</CardTitle>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vendor Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Monthly Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorData.map((vendor) => [
                  <tr key={`vendor-${vendor.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleRow(vendor.id)}
                        className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
                      >
                        {expandedRows.includes(vendor.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {vendor.name}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{vendor.serviceType}</td>
                    <td className="py-4 px-4 text-gray-900">{vendor.phone}</td>
                    <td className="py-4 px-4 text-gray-900">{vendor.email}</td>
                    <td className="py-4 px-4 text-gray-900 font-semibold">{vendor.monthlyAmount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        vendor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : vendor.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          vendor.status === 'active' ? 'bg-green-500' : vendor.status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`} />
                        {vendor.status === 'active' ? 'Active' : vendor.status === 'pending'
                          ? 'Pending'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleOpenEditDialog(vendor)}>
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </td>
                  </tr>,
                  // Expanded Details Row
                  expandedRows.includes(vendor.id) && (
                    <tr className="bg-blue-50/30 border-b border-gray-100">
                      <td colSpan={7} className="py-4 px-4">
                        <div className="max-w-4xl">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Vendor Name</p>
                              <p className="text-gray-900">{vendor.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Company Name</p>
                              <p className="text-gray-900">{vendor.companyName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Service Type</p>
                              <p className="text-gray-900">{vendor.serviceType}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Phone Number</p>
                              <p className="text-gray-900">{vendor.phone}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Email Address</p>
                              <p className="text-gray-900">{vendor.email}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Address</p>
                              <p className="text-gray-900">{vendor.address}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Contract Start Date</p>
                              <p className="text-gray-900">{vendor.contractDate}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Monthly Amount</p>
                              <p className="text-gray-900">{vendor.monthlyAmount}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">Contract Status</p>
                              <p className="text-gray-900">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  vendor.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : vendor.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  <span className={`w-2 h-2 rounded-full mr-2 ${
                                    vendor.status === 'active' ? 'bg-green-500' : vendor.status === 'pending'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`} />
                                  {vendor.status === 'active' ? 'Active' : vendor.status === 'pending'
                                    ? 'Pending'
                                    : 'Inactive'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ])}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Vendor Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Enter the details of the new vendor or service provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Vendor Name</Label>
                <Input id="vendor-name" placeholder="Enter vendor name" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter company name" value={formData.companyName} onChange={(e) => handleFormChange('companyName', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-type">Service Type</Label>
                <Input id="service-type" placeholder="Enter service type" value={formData.serviceType} onChange={(e) => handleFormChange('serviceType', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter phone number" value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email" value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-amount">Monthly Amount</Label>
                <Input id="monthly-amount" placeholder="e.g., ₹25,000" value={formData.monthlyAmount} onChange={(e) => handleFormChange('monthlyAmount', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter address" value={formData.address} onChange={(e) => handleFormChange('address', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-date">Contract Start Date</Label>
              <Input id="contract-date" type="date" value={formData.contractDate} onChange={(e) => handleFormChange('contractDate', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update the details of the vendor or service provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Vendor Name</Label>
                <Input id="vendor-name" placeholder="Enter vendor name" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter company name" value={formData.companyName} onChange={(e) => handleFormChange('companyName', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-type">Service Type</Label>
                <Input id="service-type" placeholder="Enter service type" value={formData.serviceType} onChange={(e) => handleFormChange('serviceType', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter phone number" value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email" value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-amount">Monthly Amount</Label>
                <Input id="monthly-amount" placeholder="e.g., ₹25,000" value={formData.monthlyAmount} onChange={(e) => handleFormChange('monthlyAmount', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter address" value={formData.address} onChange={(e) => handleFormChange('address', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-date">Contract Start Date</Label>
              <Input id="contract-date" type="date" value={formData.contractDate} onChange={(e) => handleFormChange('contractDate', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}