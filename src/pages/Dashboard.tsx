
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import DealStageCard from "@/components/dashboard/DealStageCard";
import PipelineChart from "@/components/dashboard/PipelineChart";
import RecentCompanies from "@/components/dashboard/RecentCompanies";
import StatsCard from "@/components/shared/StatsCard";
import { companyService } from "@/lib/supabase";
import { statsService } from "@/lib/statsService";
import { STATUS_OPTIONS } from "@/lib/types";
import { Building2, TrendingUp, Users, Calendar, Award, CheckCircle } from "lucide-react";
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
  
  // Get approval stats
  const approvedCount = stats?.approvalStatusCounts?.["Approved"] || 0;
  const totalWithApprovalStatus = Object.values(stats?.approvalStatusCounts || {}).reduce((a, b) => a + b, 0);
  const approvalRate = totalWithApprovalStatus ? Math.round((approvedCount / totalWithApprovalStatus) * 100) : 0;
  
  // Get rating stats
  const aRatedCount = stats?.ratingCounts?.["A"] || 0;
  const bRatedCount = stats?.ratingCounts?.["B"] || 0;
  const topRatedCount = aRatedCount + bRatedCount;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {/* Total companies stat */}
        <StatsCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={Building2}
          description="Companies in your pipeline"
          className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-950 dark:to-background md:col-span-1"
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
            className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background md:col-span-1"
          />
        )}

        {/* Recent Activity */}
        <StatsCard
          title="Recent Activity"
          value={companies?.length ? companies.filter(c => {
            const date = new Date(c.fields.CreatedTime);
            const now = new Date();
            return now.getTime() - date.getTime() < 1000 * 60 * 60 * 24 * 7; // 7 days
          }).length : 0}
          icon={Calendar}
          description="New companies in the last 7 days"
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background md:col-span-1"
        />

        {/* Team Stats */}
        <StatsCard
          title="Team Productivity"
          value={companies ? Math.round(companies.length / 3) : 0}
          icon={Users}
          description="Average companies per team member"
          className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background md:col-span-1"
        />
        
        {/* Top Rated Companies */}
        <StatsCard
          title="Top Rated Companies"
          value={topRatedCount}
          icon={Award}
          description={`A/B rated (${Math.round((topRatedCount / (stats?.totalCompanies || 1)) * 100)}%)`}
          className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-background md:col-span-1"
        />
        
        {/* Approval Rate */}
        <StatsCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          icon={CheckCircle}
          description={`${approvedCount} of ${totalWithApprovalStatus} approved`}
          className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background md:col-span-1"
        />
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
