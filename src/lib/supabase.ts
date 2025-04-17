
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { CompanyStatus } from "./types";

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

// Companies API
export const companyService = {
  async getCompanies(filterByFormula: string = "") {
    try {
      // Por enquanto, continua utilizando o objeto Airtable, até migrarmos completamente para Supabase
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
          Status: company.status,
          Website: company.website,
          Notes: company.notes,
          CreatedTime: company.created_at
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
          CreatedTime: company.created_at
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
          name: data.Name,
          sector: data.Sector,
          estimated_revenue: data["Estimated Revenue"],
          location: data.Location,
          status: data.Status,
          website: data.Website,
          notes: data.Notes
        })
        .select()
        .single();
        
      if (error) throw error;
      
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
          CreatedTime: company.created_at
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
          CreatedTime: company.created_at
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

// Adaptações para os outros serviços seguirão o mesmo padrão
// Implementaremos conforme necessário
