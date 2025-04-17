
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    href?: string;
    onClick?: () => void;
  };
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && (
        action.href ? (
          <Button asChild className="mt-4 md:mt-0">
            <Link to={action.href} className="flex items-center gap-2">
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} className="mt-4 md:mt-0">
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )
      )}
    </div>
  );
};

export default PageHeader;
