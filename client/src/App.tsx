import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Memorial from "@/pages/memorial";
import Browse from "@/pages/browse";
import Partners from "@/pages/partners";
import OrderOfService from "@/pages/order-of-service";
import OrderOfServiceEdit from "@/pages/order-of-service-edit";
import CreateMemorialOrderOfService from "@/pages/create-memorial-order-of-service";
import CreatePage from "@/pages/create";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/create" component={CreatePage} />
          <Route path="/memorial/:id" component={Memorial} />
          <Route path="/browse" component={Browse} />
          <Route path="/partners" component={Partners} />
          <Route path="/order-of-service/:id" component={OrderOfService} />
          <Route path="/order-of-service/:id/edit" component={OrderOfServiceEdit} />
          <Route path="/create-memorial-order-of-service/:memorialId" component={CreateMemorialOrderOfService} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/create" component={CreatePage} />
          <Route path="/memorial/:id" component={Memorial} />
          <Route path="/browse" component={Browse} />
          <Route path="/partners" component={Partners} />
          <Route path="/order-of-service/:id" component={OrderOfService} />
          <Route path="/order-of-service/:id/edit" component={OrderOfServiceEdit} />
          <Route path="/create-memorial-order-of-service/:memorialId" component={CreateMemorialOrderOfService} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
