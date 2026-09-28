import React, { memo } from "react";

interface RevenueDataItem {
  month: string;
  collected: string;
  expected: string;
  netProfit: string;
  profitPercent: string;
}

interface Props {
  data: RevenueDataItem[];
}

const RevenueDataTable = memo<Props>(({ data }) => (
  <section className="mt-8 hidden md:block">
    <div className="overflow-x-auto ring-1 ring-blue-100 rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-3 text-left">Month</th>
            <th className="p-3">Collected</th>
            <th className="p-3">Expected</th>
            <th className="p-3">Net Profit</th>
            <th className="p-3 text-right">Profit %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="border-b">
              <td className="p-3">{row.month}</td>
              <td className="p-3">{row.collected}</td>
              <td className="p-3">{row.expected}</td>
              <td className="p-3 text-blue-700 font-semibold">{row.netProfit}</td>
              <td className="p-3 text-right">{row.profitPercent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
));

RevenueDataTable.displayName = "RevenueDataTable";

export default RevenueDataTable;
