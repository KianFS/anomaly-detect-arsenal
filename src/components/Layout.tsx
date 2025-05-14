
import { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from 'react-router-dom';
import { BarChart2, FileSearch, Shield, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { detections } = useApp();
  
  const criticalCount = detections.filter(d => d.severity === 'critical').length;
  const hasAlerts = criticalCount > 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarHeader className="py-6">
            <div className="flex items-center gap-2 px-4">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold">FS Attack Detector</h1>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/" className="flex items-center gap-3">
                        <BarChart2 className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/details" className="flex items-center gap-3 relative">
                        <FileSearch className="w-5 h-5" />
                        <span>Detection Log</span>
                        {hasAlerts && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-security-critical rounded-full animate-pulse-alert flex items-center justify-center text-[10px] text-white">
                            {criticalCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/settings" className="flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-center text-muted-foreground">
            File System Analysis-Based Attack Detector
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1">
          <div className="container py-4">
            <div className="mb-4 flex justify-between items-center">
              <SidebarTrigger />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
