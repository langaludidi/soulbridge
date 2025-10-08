"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const planId = searchParams.get("plan");
  const billingCycle = searchParams.get("billing") as
    | "monthly"
    | "annual"
    | "lifetime";

  const [loading, setLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [plan, setPlan] = useState<{
    id: string;
    name: string;
    price: number;
    features: string[];
  } | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (planId && billingCycle) {
      loadPlanDetails();
    }
  }, [planId, billingCycle]);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser({ id: user.id, email: user.email || "" });
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  };

  const loadPlanDetails = async () => {
    try {
      // Capitalize first letter for database query (e.g., "free" -> "Free")
      const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("name", planName)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Plan query error:", error);
        throw new Error("Plan not found. Please run the database migration first.");
      }

      if (!data) {
        throw new Error("Plan data is empty. Please run the database migration first.");
      }

      let price = 0;
      if (billingCycle === "monthly" && data.price_monthly) {
        price = parseFloat(data.price_monthly.toString());
      } else if (billingCycle === "annual" && data.price_annual) {
        price = parseFloat(data.price_annual.toString());
      } else if (billingCycle === "lifetime" && data.price_lifetime) {
        price = parseFloat(data.price_lifetime.toString());
      }

      if (price === 0 && planName !== "Free") {
        throw new Error(`No price found for ${billingCycle} billing cycle`);
      }

      setPlan({
        id: data.id,
        name: data.name,
        price,
        features: data.features || [],
      });
    } catch (error: any) {
      console.error("Failed to load plan:", error);
      const errorMsg = error.message || "Failed to load plan details. Please ensure database is set up correctly.";
      toast.error(errorMsg);
      setPlanError(errorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to continue");
      router.push(`/sign-in?redirect=/checkout?plan=${planId}&billing=${billingCycle}`);
      return;
    }

    if (!plan || !planId || !billingCycle) {
      toast.error("Invalid plan selection");
      return;
    }

    setLoading(true);

    try {
      // Call API to initiate payment
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          planId: plan.id, // Use the UUID from the loaded plan, not the query param
          billingCycle,
          customerName: formData.fullName || formData.email,
          customerEmail: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorizationUrl;
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(error.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  // Show error if plan failed to load
  if (!planId || !billingCycle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Invalid Plan Selection</h2>
          <p className="text-muted-foreground mb-6">
            Please select a plan from the pricing page.
          </p>
          <Link href="/pricing">
            <Button variant="accent">View Pricing Plans</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Show error if plan failed to load
  if (planError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4 text-destructive">Failed to Load Plan</h2>
          <p className="text-muted-foreground mb-6">
            {planError}
          </p>
          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button variant="accent" className="w-full">Back to Pricing</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPlanError(null);
                loadPlanDetails();
              }}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show loading while fetching plan
  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading plan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/pricing"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Order Summary */}
          <div>
            <Card className="p-6 lg:p-8 sticky top-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {plan.name} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {billingCycle} billing
                    </p>
                  </div>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    R{plan.price}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <h4 className="font-semibold text-foreground mb-3">
                  What's included:
                </h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-serif text-3xl font-bold text-foreground">
                    R{plan.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {billingCycle === "lifetime"
                    ? "One-time payment, lifetime access"
                    : `Billed ${billingCycle}`}
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Payment Form */}
          <div>
            <Card className="p-6 lg:p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Secure Checkout
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Complete your purchase with Paystack secure payment
              </p>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-token">
                <ShieldCheck className="h-6 w-6 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Secure Payment
                  </p>
                  <p className="text-xs text-muted-foreground">
                    256-bit SSL encryption
                  </p>
                </div>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={!!user}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Receipt will be sent to this email
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 82 123 4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our{" "}
                  <Link href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>

              {/* Payment Info */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  What happens next?
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>
                      You'll be redirected to Paystack secure payment page
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Complete your payment with card or instant EFT</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>
                      Your plan will be activated immediately upon successful
                      payment
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Receipt will be sent to your email</span>
                  </li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
