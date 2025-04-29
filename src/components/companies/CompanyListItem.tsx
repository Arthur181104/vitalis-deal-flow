
import { Company, companyService } from "@/lib/supabase";
import { formatCurrency } from "@/lib/types";
import StatusBadge from "@/components/shared/StatusBadge";
import RatingBadge from "@/components/shared/RatingBadge";
import ApprovalBadge from "@/components/shared/ApprovalBadge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

interface CompanyListItemProps {
  company: Company;
}

const CompanyListItem = ({ company }: CompanyListItemProps) => {
  const { id, fields } = company;
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await companyService.deleteCompany(id);
      // Invalidate and refetch companies data after deletion
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

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
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete company</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete company</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {fields.Name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default CompanyListItem;
