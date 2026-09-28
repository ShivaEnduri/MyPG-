import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { GraphCard } from "./GraphCard";

// RUFRENT Financial Data
const revenuePerPGData = [
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 17500 },
  { month: "Oct", revenue: 19000 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 22000 },
  { month: "Jan", revenue: 23500 },
  { month: "Feb", revenue: 0 },
];

const dailyRevenueData = [
  { date: "Feb 18", revenue: 22500 },
  { date: "Feb 19", revenue: 23000 },
  { date: "Feb 20", revenue: 23500 },
  { date: "Feb 21", revenue: 28000 },
  { date: "Feb 22", revenue: 24500 },
  { date: "Feb 23", revenue: 24800 },
  { date: "Feb 24", revenue: 25000 },
];

const commissionBreakdownData = [
  { month: "Aug", commission: 15000 },
  { month: "Sep", commission: 17500 },
  { month: "Oct", commission: 19000 },
  { month: "Nov", commission: 20500 },
  { month: "Dec", commission: 22000 },
  { month: "Jan", commission: 23500 },
  { month: "Feb", commission: 25000 },
];

const averageRevenuePerTransactionData = [
  { month: "Aug", avgRevenue: 125 },
  { month: "Sep", avgRevenue: 135 },
  { month: "Oct", avgRevenue: 142 },
  { month: "Nov", avgRevenue: 150 },
  { month: "Dec", avgRevenue: 155 },
  { month: "Jan", avgRevenue: 160 },
  { month: "Feb", avgRevenue: 165 },
];

export function ReportsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">RUFRENT financial overview and insights</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* RUFRENT Financial Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Revenue per New PG Added */}
          <GraphCard
            title="Revenue per New PG Added"
            subtitle="Amount RUFRENT earns from each new PG onboarded"
            data={revenuePerPGData}
            dataKey="revenue"
            xAxisKey="month"
            chartType="bar"
            color="#10b981"
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />

          {/* Daily Revenue Flow */}
          <GraphCard
            title="Daily Revenue Flow"
            subtitle="RUFRENT's daily earnings (Last 7 days)"
            data={dailyRevenueData}
            dataKey="revenue"
            xAxisKey="date"
            chartType="area"
            color="#8b5cf6"
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />

          {/* Monthly Commission from Transactions */}
          <GraphCard
            title="Monthly Commission from Transactions"
            subtitle="Total platform fees collected by RUFRENT"
            data={commissionBreakdownData}
            dataKey="commission"
            xAxisKey="month"
            chartType="line"
            color="#3b82f6"
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />

          {/* Average Revenue per Transaction */}
          <GraphCard
            title="Average Revenue per Transaction"
            subtitle="RUFRENT's average earnings per transaction"
            data={averageRevenuePerTransactionData}
            dataKey="avgRevenue"
            xAxisKey="month"
            chartType="bar"
            color="#f59e0b"
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />
        </div>
      </div>
    </div>
  );
}