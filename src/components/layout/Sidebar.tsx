
import { 
  Sidebar as SidebarComponent, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Building2, Home, BarChart, Plus, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarComponent>
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Vitalis CRM</h1>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className={isActive("/") ? "bg-sidebar-accent" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-3">
                    <Home size={20} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className={isActive("/companies") ? "bg-sidebar-accent" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/companies" className="flex items-center gap-3">
                    <Building2 size={20} />
                    <span>Companies</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className={isActive("/statistics") ? "bg-sidebar-accent" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/statistics" className="flex items-center gap-3">
                    <BarChart size={20} />
                    <span>Statistics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/companies/new" className="flex items-center gap-3 text-sidebar-primary">
                    <Plus size={20} />
                    <span>Add Company</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
