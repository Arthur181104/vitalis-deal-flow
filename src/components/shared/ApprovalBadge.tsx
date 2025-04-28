
import React from 'react';
import { CompanyApprovalStatus, getApprovalStatusColor } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApprovalBadgeProps {
  status: CompanyApprovalStatus | undefined;
  className?: string;
  showIcon?: boolean;
}

const ApprovalBadge = ({ status, className, showIcon = true }: ApprovalBadgeProps) => {
  if (!status) {
    return (
      <span className={cn("px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", className)}>
        {showIcon && <Clock className="h-3 w-3" />}
        Under Review
      </span>
    );
  }

  const icon = {
    "Approved": <CheckCircle className="h-3 w-3" />,
    "Not Approved": <XCircle className="h-3 w-3" />,
    "Under Review": <Clock className="h-3 w-3" />,
  }[status];

  return (
    <span className={cn("px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1", getApprovalStatusColor(status), className)}>
      {showIcon && icon}
      {status}
    </span>
  );
};

export default ApprovalBadge;
