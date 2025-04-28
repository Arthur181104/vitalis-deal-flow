
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import CompanyFilter from "@/components/companies/CompanyFilter";
import CompanyListItem from "@/components/companies/CompanyListItem";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { companyService, Company } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CompaniesList = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const sector = searchParams.get("sector");
  const search = searchParams.get("search");
  const rating = searchParams.get("rating");
  const approval = searchParams.get("approval");

  // Fetch companies data
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ["companies", status, sector, search, rating, approval],
    queryFn: () => companyService.getCompanies(),
  });

  // Filter companies based on search params
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];

    return companies.filter((company) => {
      const matchesStatus = !status || company.fields.Status === status;
      const matchesSector = !sector || company.fields.Sector === sector;
      const matchesRating = !rating || company.fields.Rating === rating;
      const matchesApproval = !approval || company.fields.ApprovalStatus === approval;
      const matchesSearch = !search || company.fields.Name.toLowerCase().includes(search.toLowerCase());
      
      return matchesStatus && matchesSector && matchesRating && matchesApproval && matchesSearch;
    });
  }, [companies, status, sector, search, rating, approval]);

  // Sort companies by name
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => 
      a.fields.Name.localeCompare(b.fields.Name)
    );
  }, [filteredCompanies]);

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8 text-destructive">
          <p>Error loading companies. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Companies"
        description="Manage and track your target companies"
        action={{
          label: "Add Company",
          icon: Plus,
          href: "/companies/new",
        }}
      />

      <div className="mb-6">
        <CompanyFilter />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : sortedCompanies.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No companies found</h3>
          <p className="text-muted-foreground mb-6">
            {status || sector || search || rating || approval
              ? "Try adjusting your filters"
              : "Add your first company to get started"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies.map((company) => (
                <CompanyListItem key={company.id} company={company} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Layout>
  );
};

export default CompaniesList;
