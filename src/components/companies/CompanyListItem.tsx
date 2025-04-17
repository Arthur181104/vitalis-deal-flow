
import { Company } from "@/lib/supabase";
import { formatCurrency } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
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
      <TableCell>{fields.Location || "-"}</TableCell>
      <TableCell>
        {formatCurrency(fields["Estimated Revenue"])}
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.Status} />
      </TableCell>
      <TableCell>
        {fields.Website ? (
          <a 
            href={fields.Website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
};

export default CompanyListItem;
