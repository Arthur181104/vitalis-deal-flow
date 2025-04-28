
import { supabase } from "@/integrations/supabase/client";
import { CompanyStatus, CompanyRating, CompanyApprovalStatus } from "./types";

export const statsService = {
  async getDashboardStats() {
    try {
      // Fetch all companies
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      // Calculate status counts
      const statusCounts: Record<string, number> = {};
      
      // Calculate sector distribution
      const sectorDistribution: Record<string, number> = {};
      
      // Calculate rating distribution
      const ratingCounts: Record<string, number> = {};
      
      // Calculate approval status counts
      const approvalStatusCounts: Record<string, number> = {};
      
      // Process companies to build statistics
      (companies || []).forEach((company) => {
        // Count by status
        if (company.status) {
          statusCounts[company.status] = (statusCounts[company.status] || 0) + 1;
        }
        
        // Count by sector
        if (company.sector) {
          sectorDistribution[company.sector] = (sectorDistribution[company.sector] || 0) + 1;
        }
        
        // Count by rating
        const rating = company.rating || 'Not Rated';
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        
        // Count by approval status
        const approvalStatus = company.approval_status || 'Under Review';
        approvalStatusCounts[approvalStatus] = (approvalStatusCounts[approvalStatus] || 0) + 1;
      });
      
      return {
        totalCompanies: companies?.length || 0,
        statusCounts,
        sectorDistribution,
        ratingCounts,
        approvalStatusCounts
      };
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalCompanies: 0,
        statusCounts: {},
        sectorDistribution: {},
        ratingCounts: {},
        approvalStatusCounts: {}
      };
    }
  }
};
