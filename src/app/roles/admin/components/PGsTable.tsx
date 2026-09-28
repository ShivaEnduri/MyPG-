import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Button } from "../../../shared/ui/button";
import { Building2, MapPin, Users, Plus, ChevronDown, ChevronUp, Upload, X, Image as ImageIcon, Video, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { useState } from "react";

interface PGMedia {
  images: File[];
  videos: File[];
}

interface PGData {
  id: number;
  name: string;
  location: string;
  owner: string;
  manager: string;
  totalRooms: number;
  occupiedRooms: number;
  monthlyRent: string;
  amenities: string[];
  media: PGMedia;
}

const initialPgsData: PGData[] = [
  {
    id: 1,
    name: "Sunrise PG",
    location: "Koramangala, Bangalore",
    owner: "Rajesh Kumar",
    manager: "Vikram Singh",
    totalRooms: 20,
    occupiedRooms: 18,
    monthlyRent: "₹8,000",
    amenities: ["WiFi", "AC", "Laundry"],
    media: {
      images: [],
      videos: []
    }
  },
  {
    id: 2,
    name: "Sunset Villa",
    location: "HSR Layout, Bangalore",
    owner: "Rajesh Kumar",
    manager: "Kavya Nair",
    totalRooms: 15,
    occupiedRooms: 12,
    monthlyRent: "₹10,000",
    amenities: ["WiFi", "Gym", "Parking"],
    media: {
      images: [],
      videos: []
    }
  },
  {
    id: 3,
    name: "Green Haven",
    location: "Whitefield, Bangalore",
    owner: "Priya Sharma",
    manager: "Kavya Nair",
    totalRooms: 25,
    occupiedRooms: 22,
    monthlyRent: "₹7,500",
    amenities: ["WiFi", "AC", "Food"],
    media: {
      images: [],
      videos: []
    }
  },
  {
    id: 4,
    name: "Blue Sky Residency",
    location: "Indiranagar, Bangalore",
    owner: "Amit Patel",
    manager: "Arun Mehta",
    totalRooms: 30,
    occupiedRooms: 28,
    monthlyRent: "₹12,000",
    amenities: ["WiFi", "AC", "Gym", "Food"],
    media: {
      images: [],
      videos: []
    }
  },
];

export function PGsTable() {
  const [pgsData, setPgsData] = useState<PGData[]>(initialPgsData);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [viewMediaDialogOpen, setViewMediaDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [selectedPgId, setSelectedPgId] = useState<number | null>(null);
  const [tempImages, setTempImages] = useState<File[]>([]);
  const [tempVideos, setTempVideos] = useState<File[]>([]);
  const [selectedPgIds, setSelectedPgIds] = useState<number[]>([]);

  const handleToggleRow = (pgId: number) => {
    setExpandedRows((prev) =>
      prev.includes(pgId)
        ? prev.filter((id) => id !== pgId)
        : [...prev, pgId]
    );
  };

  const handleAddPG = () => {
    setAddDialogOpen(true);
  };

  const handleEditSelected = () => {
    if (selectedPgIds.length === 1) {
      setSelectedPgId(selectedPgIds[0]);
      setEditDialogOpen(true);
    } else {
      alert("Please select exactly one PG to edit");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPgIds.length === 0) {
      alert("Please select at least one PG to delete");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedPgIds.length} PG(s)?`)) {
      setPgsData(pgsData.filter(pg => !selectedPgIds.includes(pg.id)));
      setSelectedPgIds([]);
    }
  };

  const toggleSelectPg = (pgId: number) => {
    setSelectedPgIds(prev =>
      prev.includes(pgId) ? prev.filter(id => id !== pgId) : [...prev, pgId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPgIds.length === pgsData.length) {
      setSelectedPgIds([]);
    } else {
      setSelectedPgIds(pgsData.map(pg => pg.id));
    }
  };

  const openMediaDialog = (pgId: number) => {
    setSelectedPgId(pgId);
    const pg = pgsData.find(p => p.id === pgId);
    if (pg) {
      setTempImages(pg.media.images);
      setTempVideos(pg.media.videos);
    }
    setMediaDialogOpen(true);
  };

  const openViewMediaDialog = (pgId: number) => {
    setSelectedPgId(pgId);
    const pg = pgsData.find(p => p.id === pgId);
    if (pg) {
      setTempImages(pg.media.images);
      setTempVideos(pg.media.videos);
    }
    setViewMediaDialogOpen(true);
  };

  const closeMediaDialog = () => {
    setMediaDialogOpen(false);
    setTempImages([]);
    setTempVideos([]);
    setSelectedPgId(null);
  };

  const closeViewMediaDialog = () => {
    setViewMediaDialogOpen(false);
    setTempImages([]);
    setTempVideos([]);
    setSelectedPgId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (tempImages.length + files.length <= 5) {
      setTempImages([...tempImages, ...files]);
    } else {
      alert("You can only upload up to 5 images");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (tempVideos.length + files.length <= 2) {
      setTempVideos([...tempVideos, ...files]);
    } else {
      alert("You can only upload up to 2 videos");
    }
  };

  const removeImage = (index: number) => {
    setTempImages(tempImages.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setTempVideos(tempVideos.filter((_, i) => i !== index));
  };

  const handleMediaUpload = () => {
    if (selectedPgId !== null) {
      const updatedPgsData = pgsData.map(pg => {
        if (pg.id === selectedPgId) {
          return {
            ...pg,
            media: {
              images: tempImages,
              videos: tempVideos
            }
          };
        }
        return pg;
      });
      setPgsData(updatedPgsData);
    }
    closeMediaDialog();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">PGs</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Manage all PG properties</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All PGs</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddPG}
                size="icon"
                title="Add New PG"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleEditSelected}
                size="icon"
                title="Edit Selected"
                disabled={selectedPgIds.length !== 1}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDeleteSelected}
                size="icon"
                title="Delete Selected"
                disabled={selectedPgIds.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedPgIds.length === pgsData.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Manager</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Occupancy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Monthly Rent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Media</th>
                </tr>
              </thead>
              <tbody>
                {pgsData.map((pg) => (
                  <>
                    <tr key={pg.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedPgIds.includes(pg.id)}
                          onChange={() => toggleSelectPg(pg.id)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleRow(pg.id)}
                          className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-left"
                        >
                          {expandedRows.includes(pg.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          {pg.name}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{pg.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{pg.owner}</td>
                      <td className="py-4 px-4 text-gray-900">{pg.manager}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900 font-semibold">
                            {pg.occupiedRooms}/{pg.totalRooms}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">{pg.monthlyRent}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openMediaDialog(pg.id)}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewMediaDialog(pg.id)}
                            className="flex items-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          {(pg.media.images.length > 0 || pg.media.videos.length > 0) && (
                            <div className="text-xs text-gray-600 space-y-0.5">
                              {pg.media.images.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{pg.media.images.length}/5 images</span>
                                </div>
                              )}
                              {pg.media.videos.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>{pg.media.videos.length}/2 videos</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Details Row */}
                    {expandedRows.includes(pg.id) && (
                      <tr className="bg-blue-50/30 border-b border-gray-100">
                        <td colSpan={8} className="py-4 px-4">
                          <div className="max-w-4xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">PG Name</p>
                                <p className="text-gray-900">{pg.name}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Full Address</p>
                                <p className="text-gray-900">{pg.location}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Property Owner</p>
                                <p className="text-gray-900">{pg.owner}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Property Manager</p>
                                <p className="text-gray-900">{pg.manager}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                                <p className="text-gray-900">{pg.totalRooms} rooms</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Occupied Rooms</p>
                                <p className="text-gray-900">{pg.occupiedRooms} rooms</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                                <p className="text-gray-900">{pg.monthlyRent}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-600">Amenities</p>
                                <p className="text-gray-900">{pg.amenities.join(", ")}</p>
                              </div>
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
        </CardContent>
      </Card>

      {/* Media Upload Dialog */}
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload up to 5 images and 2 videos for the PG property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Images (Max 5)</Label>
                <span className="text-sm text-gray-600">{tempImages.length}/5</span>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={tempImages.length >= 5}
                    className="max-w-xs"
                  />
                </div>
              </div>
              {tempImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tempImages.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Videos (Max 2)</Label>
                <span className="text-sm text-gray-600">{tempVideos.length}/2</span>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center gap-2">
                  <Video className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload videos</p>
                  <Input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    disabled={tempVideos.length >= 2}
                    className="max-w-xs"
                  />
                </div>
              </div>
              {tempVideos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tempVideos.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Video className="w-8 h-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          onClick={() => removeVideo(index)}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeMediaDialog}>
              Cancel
            </Button>
            <Button onClick={handleMediaUpload}>
              Upload Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media View Dialog */}
      <Dialog open={viewMediaDialogOpen} onOpenChange={setViewMediaDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Media</DialogTitle>
            <DialogDescription>
              View the uploaded images and videos for the PG property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {tempImages.length === 0 && tempVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-600">No media uploaded for this PG yet.</p>
              </div>
            ) : (
              <>
                {/* Images Section */}
                {tempImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Images (Max 5)</Label>
                      <span className="text-sm text-gray-600">{tempImages.length}/5</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tempImages.map((file, index) => (
                        <div key={index} className="relative border rounded-lg p-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {tempVideos.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Videos (Max 2)</Label>
                      <span className="text-sm text-gray-600">{tempVideos.length}/2</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tempVideos.map((file, index) => (
                        <div key={index} className="relative border rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Video className="w-8 h-8 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              onClick={() => removeVideo(index)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeViewMediaDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add PG Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New PG</DialogTitle>
            <DialogDescription>
              Enter the details of the new PG property to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pg-name">PG Name</Label>
                <Input id="pg-name" placeholder="Enter PG name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" placeholder="Enter owner name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" placeholder="Enter manager name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-rooms">Total Rooms</Label>
                <Input id="total-rooms" type="number" placeholder="Enter total rooms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-rent">Monthly Rent</Label>
                <Input id="monthly-rent" placeholder="e.g., ₹8,000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input id="amenities" placeholder="Enter amenities (comma separated)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddDialogOpen(false)}>Add PG</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit PG Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit PG</DialogTitle>
            <DialogDescription>
              Update the details of the selected PG property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pg-name">PG Name</Label>
                <Input id="pg-name" placeholder="Enter PG name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" placeholder="Enter owner name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" placeholder="Enter manager name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-rooms">Total Rooms</Label>
                <Input id="total-rooms" type="number" placeholder="Enter total rooms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-rent">Monthly Rent</Label>
                <Input id="monthly-rent" placeholder="e.g., ₹8,000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input id="amenities" placeholder="Enter amenities (comma separated)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>Update PG</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}