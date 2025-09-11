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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Navigation />
      <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/memorial/:id" component={Memorial} />
          <Route path="/browse" component={Browse} />
          <Route path="/partners" component={Partners} />
          <Route path="/partners/directory" component={PartnersDirectory} />
          <Route path="/partners/signup" component={PartnersSignup} />
          <Route path="/partners/onboarding" component={PartnersOnboarding} />
          <Route path="/partner-dashboard" component={PartnerDashboard} />
          <Route path="/about" component={About} />
          <Route path="/packages" component={PackagesPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/order-of-service/:id" component={OrderOfService} />
          <Route path="/order-of-service/:id/edit" component={OrderOfServiceEdit} />
          <Route path="/create-memorial-order-of-service/:memorialId" component={CreateMemorialOrderOfService} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
          <Route path="/writing-guide" component={WritingGuide} />
          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/payment/declined" component={PaymentDeclined} />
          <Route path="/payment/complete" component={PaymentComplete} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/memorial/:id" component={Memorial} />
          <Route path="/browse" component={Browse} />
          <Route path="/partners" component={Partners} />
          <Route path="/partners/directory" component={PartnersDirectory} />
          <Route path="/partners/signup" component={PartnersSignup} />
          <Route path="/partners/onboarding" component={PartnersOnboarding} />
          <Route path="/partner-dashboard" component={PartnerDashboard} />
          <Route path="/about" component={About} />
          <Route path="/packages" component={PackagesPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/order-of-service/:id" component={OrderOfService} />
          <Route path="/order-of-service/:id/edit" component={OrderOfServiceEdit} />
          <Route path="/create-memorial-order-of-service/:memorialId" component={CreateMemorialOrderOfService} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
          <Route path="/writing-guide" component={WritingGuide} />
          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/payment/declined" component={PaymentDeclined} />
          <Route path="/payment/complete" component={PaymentComplete} />
        </>
      )}
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