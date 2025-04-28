
export type CompanyStatus = 
  | "Contacted" 
  | "In Analysis" 
  | "LOI Sent" 
  | "Due Diligence" 
  | "Closed"
  | "Archived";

export type CompanyRating = "A" | "B" | "C" | "D" | "Not Rated";

export type CompanyApprovalStatus = "Approved" | "Not Approved" | "Under Review";

export type InteractionType = "Call" | "Email" | "Meeting" | "Other";

export interface StatusInfo {
  label: string;
  value: CompanyStatus;
  color: string;
  className: string;
}

export interface SectorOption {
  label: string;
  value: string;
}

export const STATUS_OPTIONS: StatusInfo[] = [
  { label: "Contacted", value: "Contacted", color: "#9b87f5", className: "status-badge-contacted" },
  { label: "In Analysis", value: "In Analysis", color: "#1EAEDB", className: "status-badge-in-analysis" },
  { label: "LOI Sent", value: "LOI Sent", color: "#FDE1D3", className: "status-badge-loi-sent" },
  { label: "Due Diligence", value: "Due Diligence", color: "#E5DEFF", className: "status-badge-due-diligence" },
  { label: "Closed", value: "Closed", color: "#7E69AB", className: "status-badge-closed" },
  { label: "Archived", value: "Archived", color: "#8E9196", className: "status-badge-archived" },
];

export const RATING_OPTIONS = [
  { label: "A - Excellent", value: "A" },
  { label: "B - Good", value: "B" },
  { label: "C - Average", value: "C" },
  { label: "D - Poor", value: "D" },
  { label: "Not Rated", value: "Not Rated" },
];

export const APPROVAL_STATUS_OPTIONS = [
  { label: "Approved", value: "Approved" },
  { label: "Not Approved", value: "Not Approved" },
  { label: "Under Review", value: "Under Review" },
];

export const SECTOR_OPTIONS: SectorOption[] = [
  { label: "Technology", value: "Technology" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Financial Services", value: "Financial Services" },
  { label: "Consumer Goods", value: "Consumer Goods" },
  { label: "Retail", value: "Retail" },
  { label: "Transportation", value: "Transportation" },
  { label: "Energy", value: "Energy" },
  { label: "Education", value: "Education" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "Other", value: "Other" },
];

export const INTERACTION_TYPE_OPTIONS = [
  { label: "Call", value: "Call" },
  { label: "Email", value: "Email" },
  { label: "Meeting", value: "Meeting" },
  { label: "Other", value: "Other" },
];

export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getRatingColor = (rating: CompanyRating | undefined): string => {
  switch (rating) {
    case "A": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "B": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "C": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "D": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const getApprovalStatusColor = (status: CompanyApprovalStatus | undefined): string => {
  switch (status) {
    case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Not Approved": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Under Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};
