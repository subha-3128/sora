import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import { requestPersistentStorage, setupNetworkListeners } from "@/lib/device";
import { useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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

function AppContent() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  useEffect(() => {
    // Request persistent storage for better offline support
    requestPersistentStorage().catch(() => {
      console.log("Persistent storage not available");
    });

    // Setup network status listeners
    setupNetworkListeners();

    // Prevent zoom on double tap (mobile)
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    return () => {
      document.removeEventListener("touchend", () => {});
    };
  }, []);

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
        <AppSidebar />
        <div className="flex flex-col flex-1 relative min-w-0">
          <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 md:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <img src="/logo.svg" alt="sora" className="h-8 w-auto" />
            </div>
            <ThemeToggle className="h-8 w-8" />
          </header>
          <main className="flex-1 overflow-y-auto">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthGate />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">sora</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AppContent /> : <AuthPage />;
}

export default App;
