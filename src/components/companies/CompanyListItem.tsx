
import { Company } from "@/lib/supabase";
import { formatCurrency } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
import RatingBadge from "@/components/shared/RatingBadge";
import ApprovalBadge from "@/components/shared/ApprovalBadge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface CompanyListItemProps {
  company: Company;
}

const CompanyListItem = ({ company }: CompanyListItemProps) => {
  const { id, fields } = company;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link to={`/companies/${id}`} className="hover:text-primary transition-colors">
          {fields.Name}
        </Link>
      </TableCell>
      <TableCell>{fields.Sector}</TableCell>
      <TableCell>
        <RatingBadge rating={fields.Rating} />
      </TableCell>
      <TableCell>
        <ApprovalBadge status={fields.ApprovalStatus} />
      </TableCell>
      <TableCell>
        {formatCurrency(fields["Estimated Revenue"])}
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.Status} />
      </TableCell>
    </TableRow>
  );
};

export default CompanyListItem;
