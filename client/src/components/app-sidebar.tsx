import { CheckSquare, LayoutDashboard, CalendarDays, CalendarRange, LogOut, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { title: "Daily Focus", url: "/", icon: LayoutDashboard },
  { title: "Weekly Review", url: "/weekly", icon: CalendarDays },
  { title: "Monthly Overview", url: "/monthly", icon: CalendarRange },
];

const settings = [
  { title: "Habit Configuration", url: "/settings/habits", icon: CheckSquare },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const getMenuItemClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
      isActive
        ? "bg-primary/15 text-primary font-semibold border-primary/30 shadow-sm"
        : "text-sidebar-foreground/85 border-transparent hover:bg-sidebar-accent hover:text-sidebar-foreground hover:border-sidebar-border"
    }`;

  return (
    <Sidebar variant="sidebar" className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-2 px-2">
          <img src="/logo.svg" alt="sora" className="h-8 w-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-3 px-2 pb-2">
        <SidebarGroup className="p-1.5 rounded-xl bg-sidebar-accent/60 border border-sidebar-border/70">
          <SidebarGroupLabel className="px-2 pb-1 text-[11px] font-semibold text-sidebar-foreground/70 uppercase tracking-[0.12em]">Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigation.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url} className={getMenuItemClass(isActive)}>
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto p-1.5 pb-2 rounded-xl bg-sidebar-accent/60 border border-sidebar-border/70">
          <SidebarGroupLabel className="px-2 pb-1 text-[11px] font-semibold text-sidebar-foreground/70 uppercase tracking-[0.12em]">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {settings.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url} className={getMenuItemClass(isActive)}>
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
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
      <SidebarFooter className="p-4 border-t border-border/50 bg-sidebar-accent/30">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-sidebar-foreground/50 font-medium">Logged in as</p>
              <p className="text-sm text-sidebar-foreground font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <LogOut className="w-4 h-4" />
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
          <ThemeToggle className="w-full justify-center" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
