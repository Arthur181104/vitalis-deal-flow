
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden transition-all">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
