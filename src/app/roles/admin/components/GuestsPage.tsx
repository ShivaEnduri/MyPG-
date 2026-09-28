import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Badge } from "../../../shared/ui/badge";

const guests = [
  {
    id: 1,
    name: "Rahul Sharma",
    pg: "Sunrise PG",
    room: "101",
    joinDate: "Jan 15, 2026",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Patel",
    pg: "Sunset Villa",
    room: "205",
    joinDate: "Dec 10, 2025",
    status: "active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    pg: "Green Haven",
    room: "303",
    joinDate: "Feb 1, 2026",
    status: "active",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    pg: "Blue Sky Residency",
    room: "402",
    joinDate: "Jan 20, 2026",
    status: "dormant",
  },
];

export function GuestsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Guests</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">View and manage all guests</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>All Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PG</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Join Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{guest.name}</td>
                    <td className="py-3 px-4 text-gray-600">{guest.pg}</td>
                    <td className="py-3 px-4 text-gray-600">{guest.room}</td>
                    <td className="py-3 px-4 text-gray-600">{guest.joinDate}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={guest.status === "active" ? "default" : "secondary"}
                        className={
                          guest.status === "active"
                            ? ""
                            : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        }
                      >
                        {guest.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}