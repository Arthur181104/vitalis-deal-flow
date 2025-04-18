
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
    <Card className="col-span-3 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deal Pipeline</span>
          <span className="text-sm font-normal text-muted-foreground">
            {Object.values(data).reduce((acc, val) => acc + val, 0)} Total
          </span>
        </CardTitle>
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
              contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            />
            {chartData.map((entry, index) => (
              <Bar 
                key={`bar-${index}`} 
                dataKey="value" 
                name={entry.name}
                fill={entry.color} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={index * 150}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PipelineChart;
