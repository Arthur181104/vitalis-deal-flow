
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <main className="flex-1 p-6 max-w-full overflow-hidden">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
