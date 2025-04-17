
import { toast } from "@/components/ui/sonner";

// Airtable API constants
const AIRTABLE_API_KEY = "keyVitalisSearchFund"; // Replace with your actual API key
const AIRTABLE_BASE_ID = "appVitalisSearchFund"; // Replace with your actual base ID
const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Helper function to make authenticated requests to Airtable
async function apiRequest(
  endpoint: string,
  method: string = "GET",
  data: any = null
) {
  try {
    const headers = {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PATCH" || method === "PUT")) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Something went wrong");
    }

    return await response.json();
  } catch (error: any) {
    console.error("API request failed:", error);
    toast.error(`API Error: ${error.message}`);
    throw error;
  }
}

export interface Company {
  id: string;
  fields: {
    Name: string;
    Sector: string;
    "Estimated Revenue"?: number;
    Location?: string;
    Status: "Contacted" | "In Analysis" | "LOI Sent" | "Due Diligence" | "Closed" | "Archived";
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
    const params = new URLSearchParams();
    if (filterByFormula) {
      params.append("filterByFormula", filterByFormula);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiRequest(`/Companies${query}`);
    return response.records as Company[];
  },

  async getCompanyById(id: string) {
    const response = await apiRequest(`/Companies/${id}`);
    return response as Company;
  },

  async createCompany(data: Partial<Company["fields"]>) {
    const payload = { fields: data };
    const response = await apiRequest(`/Companies`, "POST", payload);
    toast.success("Company created successfully");
    return response as Company;
  },

  async updateCompany(id: string, data: Partial<Company["fields"]>) {
    const payload = { fields: data };
    const response = await apiRequest(`/Companies/${id}`, "PATCH", payload);
    toast.success("Company updated successfully");
    return response as Company;
  },

  async deleteCompany(id: string) {
    await apiRequest(`/Companies/${id}`, "DELETE");
    toast.success("Company deleted successfully");
    return true;
  },
};

// Interactions API
export const interactionService = {
  async getInteractionsByCompany(companyId: string) {
    const filterByFormula = `FIND("${companyId}", {CompanyId})`;
    const params = new URLSearchParams({
      filterByFormula,
      sort: JSON.stringify([{ field: "Date", direction: "desc" }]),
    });
    const response = await apiRequest(`/Interactions?${params.toString()}`);
    return response.records as Interaction[];
  },

  async createInteraction(data: Omit<Interaction["fields"], "CreatedTime">) {
    const payload = { fields: data };
    const response = await apiRequest(`/Interactions`, "POST", payload);
    toast.success("Interaction logged successfully");
    return response as Interaction;
  },

  async updateInteraction(id: string, data: Partial<Interaction["fields"]>) {
    const payload = { fields: data };
    const response = await apiRequest(`/Interactions/${id}`, "PATCH", payload);
    toast.success("Interaction updated successfully");
    return response as Interaction;
  },

  async deleteInteraction(id: string) {
    await apiRequest(`/Interactions/${id}`, "DELETE");
    toast.success("Interaction deleted successfully");
    return true;
  },
};

// Comments API
export const commentService = {
  async getCommentsByCompany(companyId: string) {
    const filterByFormula = `FIND("${companyId}", {CompanyId})`;
    const params = new URLSearchParams({
      filterByFormula,
      sort: JSON.stringify([{ field: "CreatedTime", direction: "desc" }]),
    });
    const response = await apiRequest(`/Comments?${params.toString()}`);
    return response.records as Comment[];
  },

  async createComment(data: Omit<Comment["fields"], "CreatedTime">) {
    const payload = { fields: data };
    const response = await apiRequest(`/Comments`, "POST", payload);
    toast.success("Comment added successfully");
    return response as Comment;
  },

  async deleteComment(id: string) {
    await apiRequest(`/Comments/${id}`, "DELETE");
    toast.success("Comment deleted successfully");
    return true;
  },
};

// Statistics API
export const statsService = {
  async getDashboardStats() {
    const companies = await companyService.getCompanies();
    
    // Calculate status counts
    const statusCounts = companies.reduce((acc: Record<string, number>, company) => {
      const status = company.fields.Status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate sector distribution
    const sectorDistribution = companies.reduce((acc: Record<string, number>, company) => {
      const sector = company.fields.Sector;
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalCompanies: companies.length,
      statusCounts,
      sectorDistribution,
    };
  }
};
