
import { CompanyStatus } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CompanyStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusInfo = STATUS_OPTIONS.find(s => s.value === status);

  if (!statusInfo) {
    return <Badge variant="outline" className={className}>Unknown</Badge>;
  }

  return (
    <span className={cn("status-badge", statusInfo.className, className)}>
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;
