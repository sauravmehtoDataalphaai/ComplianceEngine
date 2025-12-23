"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSourcesPanel from "./DataSourcesPanel";
import { 
  LayoutDashboard, 
  FileCode, 
  PlayCircle, 
  Shield,
  Book,
  Database
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, color: "text-blue-500 dark:text-blue-400" },
  { title: "Rules", url: "/rules", icon: FileCode, color: "text-purple-500 dark:text-purple-400" },
  { title: "Results", url: "/results", icon: PlayCircle, color: "text-emerald-500 dark:text-emerald-400" },
];

const secondaryNavItems = [
  { title: "Functions Library", url: "/functions", icon: Book, color: "text-amber-500 dark:text-amber-400" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("nav");

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-2.5 sm:p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-md">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Compliance Engine</h1>
            <p className="text-xs text-muted-foreground">Data Quality Rules</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mx-0 rounded-none bg-transparent border-b">
            <TabsTrigger value="nav" className="rounded-none">
              Menu
            </TabsTrigger>
            <TabsTrigger value="datasources" className="rounded-none flex items-center gap-1">
              <Database className="h-3 w-3 text-cyan-500 dark:text-cyan-400" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nav" className="flex-1 mt-0">
            <SidebarGroup className="py-0">
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.url}
                        data-testid={`nav-${item.title.toLowerCase()}`}
                      >
                        <Link href={item.url}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Resources</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.url}
                        data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Link href={item.url}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </TabsContent>

          <TabsContent value="datasources" className="flex-1 mt-0 p-0">
            <DataSourcesPanel />
          </TabsContent>
        </Tabs>
      </SidebarContent>

      <SidebarFooter className="p-2.5 sm:p-3">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
