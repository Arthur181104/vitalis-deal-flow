import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyStatus, CompanyRating, CompanyApprovalStatus } from "./types";
import { Database } from "@/integrations/supabase/types";

export interface Company {
  id: string;
  fields: {
    Name: string;
    Sector: string;
    "Estimated Revenue"?: number;
    Location?: string;
    Status: CompanyStatus;
    Rating?: CompanyRating;
    ApprovalStatus?: CompanyApprovalStatus;
    Website?: string;
    Notes?: string;
    CreatedTime: string;
  };
}

export interface Interaction {
  id: string;
  fields: {
    Date: string;
    Type: "Call" | "Email" | "Meeting" | "Other";
    Notes?: string;
    CompanyId: string[];
    CreatedTime: string;
  };
}

export interface Comment {
  id: string;
  fields: {
    Content: string;
    CompanyId: string[];
    Author?: string;
    CreatedTime: string;
  };
}

// Type definition for Supabase company data
type CompanyRow = Database['public']['Tables']['companies']['Row'];

// Companies API
export const companyService = {
  async getCompanies(filterByFormula: string = "") {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      return (companies || []).map(company => ({
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
          Rating: (company.rating || 'Not Rated') as CompanyRating,
          ApprovalStatus: (company.approval_status || 'Under Review') as CompanyApprovalStatus,
          Website: company.website,
          Notes: company.notes,
          CreatedTime: company.created_at || new Date().toISOString()
        }
      })) as Company[];
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      toast.error(`Error fetching companies: ${error.message}`);
      return [];
    }
  },

  async getCompanyById(id: string) {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!company) throw new Error("Company not found");
      
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
          Rating: (company.rating || 'Not Rated') as CompanyRating,
          ApprovalStatus: (company.approval_status || 'Under Review') as CompanyApprovalStatus,
          Website: company.website,
          Notes: company.notes,
          CreatedTime: company.created_at || new Date().toISOString()
        }
      } as Company;
    } catch (error: any) {
      console.error("Error fetching company:", error);
      toast.error(`Error fetching company: ${error.message}`);
      throw error;
    }
  },

  async createCompany(data: Partial<Company["fields"]>) {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          name: data.Name || '',
          sector: data.Sector || '',
          estimated_revenue: data["Estimated Revenue"],
          location: data.Location,
          status: data.Status || 'Contacted',
          rating: data.Rating || 'Not Rated',
          approval_status: data.ApprovalStatus || 'Under Review',
          website: data.Website,
          notes: data.Notes
        })
        .select()
        .single();
        
      if (error) throw error;
      if (!company) throw new Error("Failed to create company");
      
      toast.success("Company created successfully");
      
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
          Rating: (company.rating || 'Not Rated') as CompanyRating,
          ApprovalStatus: (company.approval_status || 'Under Review') as CompanyApprovalStatus,
          Website: company.website,
          Notes: company.notes,
          CreatedTime: company.created_at || new Date().toISOString()
        }
      } as Company;
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(`Error creating company: ${error.message}`);
      throw error;
    }
  },

  async updateCompany(id: string, data: Partial<Company["fields"]>) {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .update({
          name: data.Name,
          sector: data.Sector,
          estimated_revenue: data["Estimated Revenue"],
          location: data.Location,
          status: data.Status,
          rating: data.Rating,
          approval_status: data.ApprovalStatus,
          website: data.Website,
          notes: data.Notes
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      if (!company) throw new Error("Failed to update company");
      
      toast.success("Company updated successfully");
      
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
          Rating: (company.rating || 'Not Rated') as CompanyRating,
          ApprovalStatus: (company.approval_status || 'Under Review') as CompanyApprovalStatus,
          Website: company.website,
          Notes: company.notes,
          CreatedTime: company.created_at || new Date().toISOString()
        }
      } as Company;
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error(`Error updating company: ${error.message}`);
      throw error;
    }
  },

  async deleteCompany(id: string) {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Company deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Error deleting company:", error);
      toast.error(`Error deleting company: ${error.message}`);
      throw error;
    }
  },
};

// Temporary mock implementations for interaction and comment services
// These will need proper implementations when the tables are created in Supabase
export const interactionService = {
  async getInteractionsByCompany(companyId: string): Promise<Interaction[]> {
    // Mock implementation - return empty array for now
    console.log("Mock interactionService.getInteractionsByCompany called", companyId);
    return [];
  },

  async createInteraction(data: Partial<Omit<Interaction["fields"], "CreatedTime"> & { CompanyId: string[] }>): Promise<Interaction> {
    // Mock implementation - return mock data
    console.log("Mock interactionService.createInteraction called", data);
    return {
      id: "mock-id",
      fields: {
        Date: data.Date || new Date().toISOString(),
        Type: data.Type || "Other",
        Notes: data.Notes,
        CompanyId: data.CompanyId || [],
        CreatedTime: new Date().toISOString()
      }
    };
  }
};

export const commentService = {
  async getCommentsByCompany(companyId: string): Promise<Comment[]> {
    // Mock implementation - return empty array for now
    console.log("Mock commentService.getCommentsByCompany called", companyId);
    return [];
  },

  async createComment(data: Partial<Omit<Comment["fields"], "CreatedTime"> & { CompanyId: string[] }>): Promise<Comment> {
    // Mock implementation - return mock data
    console.log("Mock commentService.createComment called", data);
    return {
      id: "mock-id",
      fields: {
        Content: data.Content || "",
        CompanyId: data.CompanyId || [],
        Author: data.Author,
        CreatedTime: new Date().toISOString()
      }
    };
  }
};
