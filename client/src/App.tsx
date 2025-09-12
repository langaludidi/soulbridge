import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Memorial from "@/pages/memorial";
import Browse from "@/pages/browse";
import Partners from "@/pages/partners";
import PartnersDirectory from "@/pages/partners-directory";
import PartnersSignup from "@/pages/partners-signup";
import PartnersOnboarding from "@/pages/partners-onboarding";
import PartnerDashboard from "@/pages/partner-dashboard";
import OrderOfService from "@/pages/order-of-service";
import OrderOfServiceEdit from "@/pages/order-of-service-edit";
import CreateMemorialOrderOfService from "@/pages/create-memorial-order-of-service";
import CreatePage from "@/pages/create";
import About from "@/pages/about";
import PricingPage from "@/pages/pricing";
import PackagesPage from "@/pages/packages";
import DashboardPage from "@/pages/dashboard";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import WritingGuide from "@/pages/writing-guide";
import PaymentSuccess from "@/pages/payment-success";
import PaymentDeclined from "@/pages/payment-declined";
import PaymentComplete from "@/pages/payment-complete";

// Route configuration to eliminate duplication
const routes = [
  { path: "/dashboard", component: DashboardPage },
  { path: "/create", component: CreatePage },
  { path: "/memorial/:id", component: Memorial },
  { path: "/browse", component: Browse },
  { path: "/partners", component: Partners },
  { path: "/partners/directory", component: PartnersDirectory },
  { path: "/partners/signup", component: PartnersSignup },
  { path: "/partners/onboarding", component: PartnersOnboarding },
  { path: "/partner-dashboard", component: PartnerDashboard },
  { path: "/about", component: About },
  { path: "/packages", component: PackagesPage },
  { path: "/pricing", component: PricingPage },
  { path: "/order-of-service/:id", component: OrderOfService },
  { path: "/order-of-service/:id/edit", component: OrderOfServiceEdit },
  { path: "/create-memorial-order-of-service/:memorialId", component: CreateMemorialOrderOfService },
  { path: "/terms", component: Terms },
  { path: "/privacy", component: Privacy },
  { path: "/contact", component: Contact },
  { path: "/faq", component: FAQ },
  { path: "/writing-guide", component: WritingGuide },
  { path: "/payment/success", component: PaymentSuccess },
  { path: "/payment/declined", component: PaymentDeclined },
  { path: "/payment/complete", component: PaymentComplete },
];

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Navigation />
      <Switch>
        {/* Home route changes based on auth status */}
        <Route path="/" component={isLoading || !isAuthenticated ? Landing : Home} />
        
        {/* All other routes are the same regardless of auth status */}
        {routes.map(({ path, component }) => (
          <Route key={path} path={path} component={component} />
        ))}
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Router />
          </div>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;