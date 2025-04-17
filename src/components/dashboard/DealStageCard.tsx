
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyStatus, STATUS_OPTIONS } from "@/lib/types";
import { Link } from "react-router-dom";

interface DealStageCardProps {
  status: CompanyStatus;
  count: number;
}

const DealStageCard = ({ status, count }: DealStageCardProps) => {
  const statusInfo = STATUS_OPTIONS.find(s => s.value === status) || {
    label: status,
    color: "#999999",
    className: ""
  };

  // Generate the filter query for this status
  const filterQuery = encodeURIComponent(`Status=${status}`);

  return (
    <Link to={`/companies?filter=${filterQuery}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2" style={{ borderBottom: `3px solid ${statusInfo.color}` }}>
          <CardTitle className="text-sm font-medium">{statusInfo.label}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground mt-1">Companies</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DealStageCard;
