import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
import { Label } from "../../../shared/ui/label";
import { useState } from "react";
import { Building2, MapPin, User } from "lucide-react";

const requests = [
  {
    id: 1,
    type: "Add PG",
    ownerName: "Ramesh Verma",
    ownerContact: "+91 98765 43230",
    pgName: "Royal Residency",
    location: "Marathahalli, Bangalore",
    totalRooms: 18,
    monthlyRent: "₹9,000",
    amenities: "WiFi, AC, Parking, Laundry",
    date: "Feb 18, 2026",
    status: "pending",
  },
  {
    id: 2,
    type: "Add PG",
    ownerName: "Suresh Reddy",
    ownerContact: "+91 98765 43231",
    pgName: "Comfort Inn PG",
    location: "Electronic City, Bangalore",
    totalRooms: 22,
    monthlyRent: "₹7,500",
    amenities: "WiFi, Food, Security",
    date: "Feb 17, 2026",
    status: "pending",
  },
  {
    id: 3,
    type: "Add PG",
    ownerName: "Lakshmi Nair",
    ownerContact: "+91 98765 43232",
    pgName: "Pearl Heights",
    location: "Jayanagar, Bangalore",
    totalRooms: 15,
    monthlyRent: "₹11,000",
    amenities: "WiFi, AC, Gym, Food",
    date: "Feb 16, 2026",
    status: "approved",
  },
  {
    id: 4,
    type: "Add PG",
    ownerName: "Anand Kumar",
    ownerContact: "+91 98765 43233",
    pgName: "Silver Oak Residency",
    location: "BTM Layout, Bangalore",
    totalRooms: 20,
    monthlyRent: "₹8,500",
    amenities: "WiFi, AC, Parking",
    date: "Feb 15, 2026",
    status: "rejected",
  },
];

export function RequestsPage() {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);

  const handleViewRequest = (request: typeof requests[0]) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleApprove = () => {
    // Handle approval logic
    setViewDialogOpen(false);
  };

  const handleReject = () => {
    // Handle rejection logic
    setViewDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Requests</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Manage PG addition requests</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 gap-3"
              >
                <div className="flex-1 w-full md:w-auto">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {request.type}
                    </Badge>
                    <span className="text-sm text-gray-600">{request.date}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{request.pgName}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{request.ownerName} • {request.ownerContact}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{request.totalRooms} rooms</span> • {request.monthlyRent}/month
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Badge
                    variant={
                      request.status === "approved"
                        ? "default"
                        : request.status === "rejected"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      request.status === "pending"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : ""
                    }
                  >
                    {request.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewRequest(request)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PG Addition Request Details</DialogTitle>
            <DialogDescription>Review the details of the PG addition request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.pgName}</h3>
                </div>
                <Badge
                  variant={
                    selectedRequest.status === "approved"
                      ? "default"
                      : selectedRequest.status === "rejected"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    selectedRequest.status === "pending"
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                      : selectedRequest.status === "rejected"
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : ""
                  }
                >
                  {selectedRequest.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <p className="text-gray-900">{selectedRequest.ownerName}</p>
                </div>
                <div className="space-y-2">
                  <Label>Owner Contact</Label>
                  <p className="text-gray-900">{selectedRequest.ownerContact}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <p className="text-gray-900">{selectedRequest.location}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Rooms</Label>
                  <p className="text-gray-900">{selectedRequest.totalRooms} rooms</p>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Rent</Label>
                  <p className="text-gray-900">{selectedRequest.monthlyRent}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <p className="text-gray-900">{selectedRequest.amenities}</p>
              </div>

              <div className="space-y-2">
                <Label>Request Date</Label>
                <p className="text-gray-900">{selectedRequest.date}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedRequest?.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleReject}
                  className="w-full sm:w-auto bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                >
                  Reject
                </Button>
                <Button onClick={handleApprove} className="w-full sm:w-auto">
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}