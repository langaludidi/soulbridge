import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";

// Core pages loaded immediately
import Landing from "@/pages/landing";
import Browse from "@/pages/browse";
import NotFound from "@/pages/not-found";

// Lazy load other pages for better performance
const Memorial = lazy(() => import("@/pages/memorial"));
const Login = lazy(() => import("@/pages/login"));
const Partners = lazy(() => import("@/pages/partners"));
const PartnersDirectory = lazy(() => import("@/pages/partners-directory"));
const PartnersSignup = lazy(() => import("@/pages/partners-signup"));
const PartnersOnboarding = lazy(() => import("@/pages/partners-onboarding"));
const PartnerDashboard = lazy(() => import("@/pages/partner-dashboard"));
const OrderOfService = lazy(() => import("@/pages/order-of-service"));
const OrderOfServiceEdit = lazy(() => import("@/pages/order-of-service-edit"));
const CreateMemorialOrderOfService = lazy(() => import("@/pages/create-memorial-order-of-service"));
const CreatePage = lazy(() => import("@/pages/create"));
const About = lazy(() => import("@/pages/about"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const PackagesPage = lazy(() => import("@/pages/packages"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Contact = lazy(() => import("@/pages/contact"));
const FAQ = lazy(() => import("@/pages/faq"));
const WritingGuide = lazy(() => import("@/pages/writing-guide"));
const PaymentSuccess = lazy(() => import("@/pages/payment-success"));
const PaymentDeclined = lazy(() => import("@/pages/payment-declined"));
const PaymentComplete = lazy(() => import("@/pages/payment-complete"));

// Route configuration to eliminate duplication
const routes = [
  { path: "/browse", component: Browse },
  { path: "/dashboard", component: DashboardPage },
  { path: "/admin", component: AdminDashboard },
  { path: "/create", component: CreatePage },
  { path: "/login", component: Login },
  { path: "/memorial/:id", component: Memorial },
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
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* Home route changes based on auth status */}
          <Route path="/" component={isLoading || !isAuthenticated ? Landing : Browse} />
          
          {/* All other routes are the same regardless of auth status */}
          {routes.map(({ path, component }) => (
            <Route key={path} path={path} component={component} />
          ))}
          
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary showDetails={true}>
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
    </ErrorBoundary>
  );
}

export default App;
