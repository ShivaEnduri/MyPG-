import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Badge } from "../../../shared/ui/badge";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const paymentStats = [
  {
    title: "Total Revenue",
    amount: "₹5,24,000",
    change: "+12% from last month",
    icon: DollarSign,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Pending Payments",
    amount: "₹84,000",
    change: "6 payments due",
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "This Month",
    amount: "₹1,96,000",
    change: "+8% from last month",
    icon: TrendingUp,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

const recentPayments = [
  {
    guest: "Rahul Sharma",
    pg: "Sunrise PG",
    amount: "₹12,000",
    date: "Feb 15, 2026",
    status: "completed",
    method: "UPI",
  },
  {
    guest: "Priya Patel",
    pg: "Sunset Villa",
    amount: "₹10,000",
    date: "Feb 14, 2026",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    guest: "Amit Kumar",
    pg: "Green Haven",
    amount: "₹15,000",
    date: "Feb 18, 2026",
    status: "pending",
    method: "Cash",
  },
  {
    guest: "Sneha Reddy",
    pg: "Blue Sky Residency",
    amount: "₹13,000",
    date: "Feb 12, 2026",
    status: "completed",
    method: "UPI",
  },
];

export function PaymentsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Track and manage payments</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {paymentStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.amount}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Payments Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PG</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{payment.guest}</td>
                    <td className="py-3 px-4 text-gray-600">{payment.pg}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">{payment.amount}</td>
                    <td className="py-3 px-4 text-gray-600">{payment.date}</td>
                    <td className="py-3 px-4 text-gray-600">{payment.method}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={payment.status === "completed" ? "default" : "secondary"}
                        className={
                          payment.status === "pending"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : ""
                        }
                      >
                        {payment.status}
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