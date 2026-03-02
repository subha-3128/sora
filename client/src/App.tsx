import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";

// Components
import { AppSidebar } from "@/components/app-sidebar";

// Pages
import DailyPage from "@/pages/daily";
import WeeklyPage from "@/pages/weekly";
import MonthlyPage from "@/pages/monthly";
import HabitsSettingsPage from "@/pages/habits-settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DailyPage} />
      <Route path="/weekly" component={WeeklyPage} />
      <Route path="/monthly" component={MonthlyPage} />
      <Route path="/settings/habits" component={HabitsSettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style}>
          <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
            <AppSidebar />
            <div className="flex flex-col flex-1 relative min-w-0">
              <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 md:hidden">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <span className="font-display font-bold text-foreground">FocusFlow</span>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
