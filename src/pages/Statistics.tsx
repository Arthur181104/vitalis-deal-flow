
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import { companyService, statsService } from "@/lib/airtable";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_OPTIONS, SECTOR_OPTIONS } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Statistics = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsService.getDashboardStats,
  });

  // Prepare data for the pie chart (sector distribution)
  const sectorData = stats?.sectorDistribution
    ? Object.entries(stats.sectorDistribution).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // Filter out empty sectors
  const filteredSectorData = sectorData.filter((item) => item.value > 0);

  // Prepare data for the pipeline funnel
  const pipelineData = STATUS_OPTIONS
    .filter((status) => status.value !== "Archived")
    .map((status) => ({
      name: status.label,
      value: stats?.statusCounts?.[status.value] || 0,
      color: status.color,
    }));

  // Colors for the pie chart
  const SECTOR_COLORS = [
    "#9b87f5",
    "#7E69AB",
    "#1EAEDB",
    "#FDE1D3",
    "#E5DEFF",
    "#8E9196",
    "#ea384c",
    "#1A1F2C",
  ];

  return (
    <Layout>
      <PageHeader
        title="Statistics"
        description="Visual analysis of your deal pipeline and company data"
      />

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Deal Pipeline Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading pipeline data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pipelineData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 14 }}
                    />
                    <Tooltip formatter={(value) => [`${value} Companies`, ""]} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <CardTitle>Company Distribution by Sector</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading sector data...</p>
                </div>
              ) : filteredSectorData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>No sector data available yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredSectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={180}
                      fill="#8884d8"
                      dataKey="value"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        index,
                        name,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#333"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {filteredSectorData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SECTOR_COLORS[index % SECTOR_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} Companies`, "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Statistics;
