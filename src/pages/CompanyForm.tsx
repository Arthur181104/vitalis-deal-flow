
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import CompanyFormComponent from "@/components/companies/CompanyForm";
import { companyService, Company } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Fetch company details if in edit mode
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getCompanyById(id!),
    enabled: isEditMode,
  });

  const handleSuccess = (result: Company) => {
    navigate(`/companies/${result.id}`);
  };

  return (
    <Layout>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={isEditMode ? "Edit Company" : "Add New Company"}
        description={isEditMode 
          ? "Update company information" 
          : "Add a new company to your pipeline"
        }
      />

      {isEditMode && isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="max-w-3xl">
          <CompanyFormComponent company={company} onSuccess={handleSuccess} />
        </div>
      )}
    </Layout>
  );
};

export default CompanyForm;
