
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_OPTIONS } from "@/lib/types";

interface PipelineChartProps {
  data: Record<string, number>;
}

const PipelineChart = ({ data }: PipelineChartProps) => {
  // Format data for the chart
  const chartData = STATUS_OPTIONS
    .filter(status => status.value !== "Archived") // Exclude archived from visual
    .map(status => ({
      name: status.label,
      value: data[status.value] || 0,
      color: status.color
    }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Deal Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value: number) => [`${value} Companies`, "Count"]}
              labelStyle={{ color: "#333" }}
            />
            <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Bar key={index} dataKey="value" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PipelineChart;
