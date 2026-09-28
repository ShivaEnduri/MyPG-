import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ChartType = "line" | "bar" | "area";

interface GraphCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  chartType?: ChartType;
  color?: string;
  height?: number;
  formatter?: (value: any) => string;
}

export function GraphCard({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey,
  chartType = "line",
  color = "#3b82f6",
  height = 300,
  formatter = (value) => value.toString(),
}: GraphCardProps) {
  const renderChart = () => {
    const commonProps = {
      data,
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip formatter={(value) => formatter(value)} />
            <Legend />
            <Bar dataKey={dataKey} fill={color} name={title} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip formatter={(value) => formatter(value)} />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} name={title} />
          </AreaChart>
        );
      case "line":
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip formatter={(value) => formatter(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              name={title}
              dot={{ fill: color, r: 6 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
