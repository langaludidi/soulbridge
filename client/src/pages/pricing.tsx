import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Check, Star, Users, Heart, Crown, Shield, ArrowRight, CreditCard, Building2 } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

interface PlanFeatures {
  memorialLimit: string;
  allowGallery: boolean;
  allowAudioVideo: boolean;
  allowPdf: boolean;
  allowEvents: boolean;
  allowFamilyTree: boolean;
  allowPrivateLink: boolean;
  maxPhotos: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  title: string;
  price: number;
  interval: string;
  description: string;
  features: PlanFeatures;
  popular?: boolean;
  icon: React.ReactNode;
  badge?: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: "remember",
    name: "Remember",
    title: "Remember",
    price: 0,
    interval: "Free Forever",
    description: "Perfect for commemorating a single loved one with dignity and respect.",
    features: {
      memorialLimit: "1 memorial",
      allowGallery: false,
      allowAudioVideo: false,
      allowPdf: true,
      allowEvents: false,
      allowFamilyTree: false,
      allowPrivateLink: false,
      maxPhotos: "1 photo"
    },
    icon: <Heart className="w-6 h-6" />,
    badge: "Free"
  },
  {
    id: "honour",
    name: "Honour",
    title: "Honour",
    price: 49,
    interval: "monthly",
    description: "Honor multiple family members with enhanced memorial features and media galleries.",
    features: {
      memorialLimit: "3 memorials",
      allowGallery: true,
      allowAudioVideo: true,
      allowPdf: true,
      allowEvents: false,
      allowFamilyTree: false,
      allowPrivateLink: true,
      maxPhotos: "10 photos each"
    },
    popular: true,
    icon: <Star className="w-6 h-6" />,
    badge: "Popular"
  },
  {
    id: "legacy",
    name: "Legacy",
    title: "Legacy",
    price: 99,
    interval: "monthly",
    description: "Create unlimited memorials with advanced features for preserving family history.",
    features: {
      memorialLimit: "Unlimited",
      allowGallery: true,
      allowAudioVideo: true,
      allowPdf: true,
      allowEvents: true,
      allowFamilyTree: true,
      allowPrivateLink: true,
      maxPhotos: "Unlimited"
    },
    icon: <Crown className="w-6 h-6" />
  },
  {
    id: "family_vault",
    name: "Family Vault",
    title: "Family Vault", 
    price: 199,
    interval: "monthly",
    description: "Complete family heritage solution with collaborative features and premium support.",
    features: {
      memorialLimit: "Unlimited",
      allowGallery: true,
      allowAudioVideo: true,
      allowPdf: true,
      allowEvents: true,
      allowFamilyTree: true,
      allowPrivateLink: true,
      maxPhotos: "Unlimited"
    },
    icon: <Shield className="w-6 h-6" />,
    badge: "Premium"
  }
];

export default function PricingPage() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "yearly">("monthly");
  const [selectedProvider, setSelectedProvider] = useState<"paystack" | "netcash">("netcash");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get current user subscription
  const { data: subscription } = useQuery({
    queryKey: ["/api/billing/subscription"],
    enabled: !!isAuthenticated
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      try {
        const response = await apiRequest("POST", `/api/billing/checkout-session`, {
          plan: planId,
          interval: selectedInterval,
          provider: selectedProvider,
          userId: user?.id
        });
        return await response.json();
      } catch (error: any) {
        console.error('Checkout API error:', error);
        throw new Error(error?.message || 'Failed to initialize checkout session');
      }
    },
    onSuccess: (data: any) => {
      if (data?.checkoutUrl) {
        // Show provider-specific success message
        const providerName = selectedProvider === 'paystack' ? 'Paystack' : 'NetCash Pay Now';
        toast({
          title: "Redirecting to payment",
          description: `Taking you to ${providerName} to complete your payment securely.`
        });
        
        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1000);
      } else {
        toast({
          title: "Checkout initiated",
          description: "Please complete your payment to activate your subscription."
        });
      }
    },
    onError: (error: any) => {
      console.error('Checkout error:', error);
      
      // Parse error message for better user feedback
      let errorMessage = "Failed to start checkout process. Please try again.";
      
      if (error?.message?.includes('Family Vault is only available monthly')) {
        errorMessage = "Family Vault plan is only available with monthly billing.";
      } else if (error?.message?.includes('Invalid payment provider')) {
        errorMessage = "The selected payment method is not available. Please try a different option.";
      } else if (error?.message?.includes('provider')) {
        errorMessage = `There was an issue with ${selectedProvider === 'paystack' ? 'Paystack' : 'NetCash'}. Please try the other payment method.`;
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      setLocation("/api/login");
      return;
    }

    if (planId === "remember") {
      toast({
        title: "Already active",
        description: "You're currently on the free Remember plan."
      });
      return;
    }

    // Prevent Paystack usage in development
    if (isDevelopment && selectedProvider === "paystack") {
      toast({
        title: "Payment Method Not Available",
        description: "Paystack is not available in development mode. Please use NetCash Pay Now.",
        variant: "destructive"
      });
      setSelectedProvider("netcash");
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (plan) {
      // Show PaymentModal for better UX, fallback to direct API call
      const modalPlan = {
        id: plan.id,
        name: plan.name,
        price: selectedInterval === "yearly" ? Math.round(plan.price * 12 * 0.8) / 12 : plan.price,
        interval: selectedInterval,
        description: plan.description,
        features: [
          plan.features.memorialLimit,
          plan.features.allowGallery ? "Gallery enabled" : "Basic gallery",
          plan.features.allowAudioVideo ? "Audio/Video supported" : "Text only",
          plan.features.allowPdf ? "PDF export" : "Online viewing",
          plan.features.maxPhotos
        ]
      };
      
      setSelectedPlan(modalPlan);
      setPaymentModalOpen(true);
    } else {
      // Fallback to direct API call
      checkoutMutation.mutate(planId);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been activated. Redirecting...",
      variant: "default"
    });
    
    // Refresh subscription data
    queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription"] });
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      return plan.price === 0 ? "Get Started Free" : "Sign up to Subscribe";
    }
    
    if (subscription && typeof subscription === 'object' && 'tier' in subscription && subscription.tier === plan.id) {
      return "Current Plan";
    }
    
    if (plan.price === 0) {
      return "Get Started Free";
    }
    
    const displayPrice = selectedInterval === "yearly" 
      ? Math.round(plan.price * 12 * 0.8) 
      : plan.price;
    return `Subscribe for R${displayPrice}${selectedInterval === "yearly" ? "/year" : "/month"}`;
  };

  const isCurrentPlan = (planId: string): boolean => {
    return Boolean(subscription && typeof subscription === 'object' && 'tier' in subscription && subscription.tier === planId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl text-primary">
              Soulbridge
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button variant="outline" asChild>
                  <Link href="/">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/api/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/api/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Honor Your Loved Ones with Dignity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose the perfect plan to create beautiful digital memorials that celebrate the lives 
            and legacy of your family members across South Africa.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-muted/20 p-1 rounded-lg">
              <button
                onClick={() => setSelectedInterval("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedInterval === "monthly" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid="button-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedInterval("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedInterval === "yearly" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid="button-yearly"
              >
                Yearly
              </button>
            </div>
            {selectedInterval === "yearly" && (
              <Badge className="ml-3" variant="secondary">Save 20%</Badge>
            )}
          </div>

          {/* Payment Provider Selection */}
          <div className="max-w-lg mx-auto mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Choose Your Payment Method</h3>
            <RadioGroup 
              value={selectedProvider} 
              onValueChange={(value: "paystack" | "netcash") => setSelectedProvider(value)}
              className="grid grid-cols-1 gap-4"
              data-testid="payment-provider-selection"
            >
              <div className="relative">
                <RadioGroupItem 
                  value="paystack" 
                  id="paystack" 
                  className="peer sr-only" 
                  disabled={isDevelopment}
                />
                <Label
                  htmlFor="paystack"
                  className={`flex items-center justify-between w-full p-4 text-muted-foreground bg-white border-2 border-border rounded-lg cursor-pointer dark:hover:text-muted-foreground dark:border-border peer-checked:border-primary hover:text-muted-foreground dark:peer-checked:text-primary peer-checked:text-primary hover:bg-muted/10 dark:text-muted-foreground dark:bg-card dark:hover:bg-surface-2 ${isDevelopment ? 'opacity-50 cursor-not-allowed' : ''}`}
                  data-testid="label-paystack"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <div>
                      <div className="text-lg font-medium">Paystack</div>
                      <div className="text-sm text-muted-foreground">
                        {isDevelopment ? 'Not available in development' : 'Credit cards, debit cards, mobile money'}
                      </div>
                    </div>
                  </div>
                  {isDevelopment ? (
                    <Badge variant="outline">Disabled</Badge>
                  ) : (
                    <Badge variant="secondary">Most Popular</Badge>
                  )}
                </Label>
              </div>
              
              <div className="relative">
                <RadioGroupItem value="netcash" id="netcash" className="peer sr-only" />
                <Label
                  htmlFor="netcash"
                  className="flex items-center justify-between w-full p-4 text-muted-foreground bg-white border-2 border-border rounded-lg cursor-pointer dark:hover:text-muted-foreground dark:border-border peer-checked:border-primary hover:text-muted-foreground dark:peer-checked:text-primary peer-checked:text-primary hover:bg-muted/10 dark:text-muted-foreground dark:bg-card dark:hover:bg-surface-2"
                  data-testid="label-netcash"
                >
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-3" />
                    <div>
                      <div className="text-lg font-medium">NetCash Pay Now</div>
                      <div className="text-sm text-muted-foreground">Direct from your bank account - secure & trusted</div>
                    </div>
                  </div>
                  <Badge variant="outline">Bank Payment</Badge>
                </Label>
              </div>
            </RadioGroup>
            
            {/* Payment Method Information */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedProvider === "paystack" ? (
                  <>
                    <strong>Paystack:</strong> Pay instantly with your credit/debit card or mobile wallet. Fast, secure, and supports all major South African banks.
                  </>
                ) : (
                  <>
                    <strong>NetCash Pay Now:</strong> Pay directly from your bank account using internet banking or EFT. Trusted by South African businesses for over 20 years.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? "border-primary shadow-lg scale-105" 
                  : isCurrentPlan(plan.id)
                  ? "border-green-500 shadow-md"
                  : "border-border"
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    className={
                      plan.popular 
                        ? "bg-primary text-white" 
                        : plan.badge === "Premium"
                        ? "bg-purple-600 text-white"
                        : "bg-green-600 text-white"
                    }
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">
                  {plan.title}
                </CardTitle>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {plan.price === 0 
                      ? "Free" 
                      : selectedInterval === "yearly" 
                      ? `R${Math.round(plan.price * 12 * 0.8)}` 
                      : `R${plan.price}`
                    }
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {selectedInterval === "yearly" 
                        ? "per year (20% discount)" 
                        : "per month"
                      }
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center min-h-[3rem]">
                  {plan.description}
                </p>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{plan.features.memorialLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{plan.features.maxPhotos}</span>
                  </div>
                  {plan.features.allowPdf && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">PDF downloads</span>
                    </div>
                  )}
                  {plan.features.allowGallery && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Photo gallery</span>
                    </div>
                  )}
                  {plan.features.allowAudioVideo && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Audio & video</span>
                    </div>
                  )}
                  {plan.features.allowEvents && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Memorial events</span>
                    </div>
                  )}
                  {plan.features.allowFamilyTree && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Family tree</span>
                    </div>
                  )}
                  {plan.features.allowPrivateLink && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Private sharing</span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={checkoutMutation.isPending || isCurrentPlan(plan.id)}
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90" 
                      : isCurrentPlan(plan.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }`}
                  variant={isCurrentPlan(plan.id) ? "default" : plan.popular ? "default" : "outline"}
                  data-testid={`button-subscribe-${plan.id}`}
                >
                  {checkoutMutation.isPending ? "Processing..." : getButtonText(plan)}
                  {!isCurrentPlan(plan.id) && plan.price > 0 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Are there any setup fees?</h3>
              <p className="text-muted-foreground text-sm">
                No setup fees. You only pay the monthly subscription price for your chosen plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept card payments via Paystack (Visa, Mastercard, mobile money) and direct bank payments via NetCash Pay Now.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is NetCash Pay Now secure?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, NetCash is PCI DSS compliant and trusted by thousands of South African businesses for over 20 years.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely. We use industry-standard encryption and security practices to protect your memories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. Your memorials remain active until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Start Honoring Your Loved Ones Today
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of South African families preserving precious memories with dignity.
          </p>
          {!isAuthenticated && (
            <Button size="lg" asChild>
              <Link href="/api/login">Get Started Free</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}