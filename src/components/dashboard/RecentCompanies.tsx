
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Company } from "@/lib/airtable";
import { formatDate } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { Link } from "react-router-dom";

interface RecentCompaniesProps {
  companies: Company[];
}

const RecentCompanies = ({ companies }: RecentCompaniesProps) => {
  // Sort by created time (newest first) and take first 5
  const recentCompanies = [...companies]
    .sort((a, b) => new Date(b.fields.CreatedTime).getTime() - new Date(a.fields.CreatedTime).getTime())
    .slice(0, 5);

  return (
    <Card className="col-span-3 md:col-span-2">
      <CardHeader>
        <CardTitle>Recently Added Companies</CardTitle>
      </CardHeader>
      <CardContent>
        {recentCompanies.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No companies added yet</p>
        ) : (
          <div className="space-y-4">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Link 
                    to={`/companies/${company.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {company.fields.Name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Added {formatDate(company.fields.CreatedTime)}
                  </p>
                </div>
                <StatusBadge status={company.fields.Status} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
          <Link 
            to="/companies" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all companies →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCompanies;
