
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import DealStageCard from "@/components/dashboard/DealStageCard";
import PipelineChart from "@/components/dashboard/PipelineChart";
import RecentCompanies from "@/components/dashboard/RecentCompanies";
import StatsCard from "@/components/shared/StatsCard";
import { statsService, companyService } from "@/lib/airtable";
import { STATUS_OPTIONS } from "@/lib/types";
import { Building2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsService.getDashboardStats,
  });

  // Fetch companies for the recent companies list
  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getCompanies(),
  });

  if (isLoadingStats || isLoadingCompanies) {
    return (
      <Layout>
        <PageHeader title="Dashboard" description="Overview of your deal flow" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Layout>
    );
  }

  // Filter out archived companies for the dashboard counts
  const activeStatusCounts = stats?.statusCounts ? { ...stats.statusCounts } : {};
  
  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your deal flow"
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {/* Deal stage cards */}
        {STATUS_OPTIONS.filter(status => status.value !== "Archived").map((status) => (
          <DealStageCard
            key={status.value}
            status={status.value}
            count={activeStatusCounts[status.value] || 0}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Total companies stat */}
        <StatsCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={Building2}
          description="Companies in your pipeline"
        />
        
        {/* Dynamic stats based on sector distribution */}
        {stats?.sectorDistribution && Object.keys(stats.sectorDistribution).length > 0 && (
          <StatsCard
            title="Top Sector"
            value={Object.entries(stats.sectorDistribution)
              .sort((a, b) => b[1] - a[1])[0][0]}
            icon={TrendingUp}
            description={`${Object.entries(stats.sectorDistribution)
              .sort((a, b) => b[1] - a[1])[0][1]} companies`}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pipeline chart */}
        <PipelineChart data={stats?.statusCounts || {}} />
        
        {/* Recent companies */}
        {companies && <RecentCompanies companies={companies} />}
      </div>
    </Layout>
  );
};

export default Dashboard;
