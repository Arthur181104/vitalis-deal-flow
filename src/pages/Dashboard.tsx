
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/shared/PageHeader";
import { companyService } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Fetch companies data
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getCompanies(),
  });

  if (isLoading) {
    return (
      <Layout>
        <PageHeader title="Dashboard" description="Company Management Overview" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Layout>
    );
  }

  // Count companies by rating
  const ratingCounts = companies?.reduce((acc, company) => {
    const rating = company.fields.Rating || "Not Rated";
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Count companies by approval status
  const approvalCounts = companies?.reduce((acc, company) => {
    const status = company.fields.ApprovalStatus || "Under Review";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Get total count
  const totalCompanies = companies?.length || 0;

  return (
    <Layout>
      <PageHeader 
        title="Company Management Dashboard" 
        description="Strategic evaluation and investment decision-making"
        action={{
          label: "Add Company",
          icon: Building2,
          href: "/companies/new",
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Companies */}
        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{totalCompanies}</span>
              <Building2 className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Companies under evaluation</p>
          </CardContent>
        </Card>
        
        {/* Rating Distribution */}
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Rated (A/B)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{(ratingCounts["A"] || 0) + (ratingCounts["B"] || 0)}</span>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              A: {ratingCounts["A"] || 0}, B: {ratingCounts["B"] || 0}
            </p>
          </CardContent>
        </Card>
        
        {/* Approval Distribution */}
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{approvalCounts["Approved"] || 0}</span>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Approved: {approvalCounts["Approved"] || 0}, 
              Under Review: {approvalCounts["Under Review"] || 0}, 
              Not Approved: {approvalCounts["Not Approved"] || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            {companies && companies.length > 0 ? (
              <div className="space-y-4">
                {/* Sort companies by rating (A → D) */}
                {companies
                  .filter(c => c.fields.Rating && c.fields.Rating !== "Not Rated")
                  .sort((a, b) => {
                    const ratingA = a.fields.Rating || "Not Rated";
                    const ratingB = b.fields.Rating || "Not Rated";
                    return ratingA.localeCompare(ratingB);
                  })
                  .slice(0, 5)
                  .map((company) => (
                    <div 
                      key={company.id} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white bg-${company.fields.Rating === 'A' ? 'green' : company.fields.Rating === 'B' ? 'blue' : company.fields.Rating === 'C' ? 'yellow' : company.fields.Rating === 'D' ? 'red' : 'gray'}-600`}>
                          {company.fields.Rating}
                        </div>
                        <span className="font-medium">{company.fields.Name}</span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/companies/${company.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                <div className="flex justify-center mt-4">
                  <Button asChild variant="outline">
                    <Link to="/companies">View All Companies</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No companies rated yet</p>
                <Button asChild>
                  <Link to="/companies/new">Add Your First Company</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
