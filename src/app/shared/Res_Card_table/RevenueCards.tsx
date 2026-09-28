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

const RevenueCards = memo<Props>(({ data }) => (
  <div className="md:hidden">
    <div className="bg-white rounded-xl ring-1 ring-blue-100 divide-y divide-slate-200">
      {data.map((row) => (
        <div key={row.month} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-800">{row.month}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {row.profitPercent}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <span className="text-slate-500">Collected</span>
            <span className="font-medium">{row.collected}</span>

            <span className="text-slate-500">Expected</span>
            <span className="font-medium">{row.expected}</span>

            <span className="text-slate-500">Net Profit</span>
            <span className="font-semibold text-blue-700">{row.netProfit}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));

RevenueCards.displayName = "RevenueCards";

export default RevenueCards;
