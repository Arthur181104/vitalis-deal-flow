
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyStatus } from "./types";
import { Database } from "@/integrations/supabase/types";

export interface Company {
  id: string;
  fields: {
    Name: string;
    Sector: string;
    "Estimated Revenue"?: number;
    Location?: string;
    Status: CompanyStatus;
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
      
      // Adapta o formato do Supabase para o formato esperado pelo frontend
      return (companies || []).map(company => ({
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
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
      
      // Adapta o formato do Supabase para o formato esperado pelo frontend
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
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
      // Converte o formato do frontend para o formato do Supabase
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          name: data.Name || '',
          sector: data.Sector || '',
          estimated_revenue: data["Estimated Revenue"],
          location: data.Location,
          status: data.Status || 'Contacted',
          website: data.Website,
          notes: data.Notes
        })
        .select()
        .single();
        
      if (error) throw error;
      if (!company) throw new Error("Failed to create company");
      
      toast.success("Company created successfully");
      
      // Retorna no formato esperado pelo frontend
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
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
      // Converte o formato do frontend para o formato do Supabase
      const { data: company, error } = await supabase
        .from('companies')
        .update({
          name: data.Name,
          sector: data.Sector,
          estimated_revenue: data["Estimated Revenue"],
          location: data.Location,
          status: data.Status,
          website: data.Website,
          notes: data.Notes
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      if (!company) throw new Error("Failed to update company");
      
      toast.success("Company updated successfully");
      
      // Retorna no formato esperado pelo frontend
      return {
        id: company.id,
        fields: {
          Name: company.name,
          Sector: company.sector,
          "Estimated Revenue": company.estimated_revenue,
          Location: company.location,
          Status: company.status as CompanyStatus,
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

// Interaction service for Supabase
export const interactionService = {
  async getInteractionsByCompany(companyId: string): Promise<Interaction[]> {
    try {
      const { data: interactions, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      // Transform Supabase format to our application format
      return (interactions || []).map(interaction => ({
        id: interaction.id,
        fields: {
          Date: interaction.date || '',
          Type: interaction.type as "Call" | "Email" | "Meeting" | "Other",
          Notes: interaction.notes,
          CompanyId: [companyId],
          CreatedTime: interaction.created_at || new Date().toISOString()
        }
      }));
    } catch (error: any) {
      console.error("Error fetching interactions:", error);
      toast.error(`Error fetching interactions: ${error.message}`);
      return [];
    }
  },

  async createInteraction(data: Partial<Omit<Interaction["fields"], "CreatedTime"> & { CompanyId: string[] }>): Promise<Interaction> {
    try {
      // Extract company ID from the array
      const companyId = data.CompanyId && data.CompanyId.length > 0 ? data.CompanyId[0] : null;
      
      if (!companyId) throw new Error("Company ID is required");
      
      const { data: interaction, error } = await supabase
        .from('interactions')
        .insert({
          date: data.Date,
          type: data.Type || 'Other',
          notes: data.Notes,
          company_id: companyId
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!interaction) throw new Error("Failed to create interaction");
      
      toast.success("Interaction logged successfully");
      
      return {
        id: interaction.id,
        fields: {
          Date: interaction.date || '',
          Type: interaction.type as "Call" | "Email" | "Meeting" | "Other",
          Notes: interaction.notes,
          CompanyId: [companyId],
          CreatedTime: interaction.created_at || new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error("Error creating interaction:", error);
      toast.error(`Error creating interaction: ${error.message}`);
      throw error;
    }
  }
};

// Comment service for Supabase
export const commentService = {
  async getCommentsByCompany(companyId: string): Promise<Comment[]> {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      // Transform Supabase format to our application format
      return (comments || []).map(comment => ({
        id: comment.id,
        fields: {
          Content: comment.content || '',
          CompanyId: [companyId],
          Author: comment.author,
          CreatedTime: comment.created_at || new Date().toISOString()
        }
      }));
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast.error(`Error fetching comments: ${error.message}`);
      return [];
    }
  },

  async createComment(data: Partial<Omit<Comment["fields"], "CreatedTime"> & { CompanyId: string[] }>): Promise<Comment> {
    try {
      // Extract company ID from the array
      const companyId = data.CompanyId && data.CompanyId.length > 0 ? data.CompanyId[0] : null;
      
      if (!companyId) throw new Error("Company ID is required");
      if (!data.Content) throw new Error("Comment content is required");
      
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          content: data.Content,
          author: data.Author,
          company_id: companyId
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!comment) throw new Error("Failed to create comment");
      
      toast.success("Comment added successfully");
      
      return {
        id: comment.id,
        fields: {
          Content: comment.content || '',
          CompanyId: [companyId],
          Author: comment.author,
          CreatedTime: comment.created_at || new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error("Error creating comment:", error);
      toast.error(`Error creating comment: ${error.message}`);
      throw error;
    }
  }
};
