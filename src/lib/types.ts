
export type CompanyStatus = 
  | "Contacted" 
  | "In Analysis" 
  | "LOI Sent" 
  | "Due Diligence" 
  | "Closed"
  | "Archived";

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
