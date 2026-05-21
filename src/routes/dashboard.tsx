import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Truck, Wrench, LogOut, Hammer, LayoutDashboard, Car, FileBarChart2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Parking", url: "/dashboard/parking", icon: Car, exact: false },
  { title: "Repair & Expense", url: "/dashboard/repair", icon: Wrench, exact: false },
  { title: "Trailer Building", url: "/dashboard/trailer-building", icon: Hammer, exact: false },
  { title: "Reports", url: "/dashboard/reports", icon: FileBarChart2, exact: false },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-accent flex items-center justify-center">
              <Truck className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="font-display text-sm leading-tight">AMA TRAILERS</div>
              <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Management System
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = item.exact ? pathname === item.url : pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sign out">
                <Link to="/">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="h-14 flex items-center gap-3 border-b bg-background/80 backdrop-blur sticky top-0 z-10 px-4">
          <SidebarTrigger />
          <div className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            Dashboard
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}