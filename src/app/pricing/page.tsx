"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type BillingCycle = "monthly" | "annual" | "lifetime";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");

  const plans = [
    {
      id: "free",
      name: "Free",
      tagline: "Celebrate one life, forever free.",
      description: "Entry point — allows one memorial to experience SoulBridge",
      price: { monthly: 0, annual: 0, lifetime: 0 },
      popular: false,
      cta: "Get Started",
      features: [
        "Create 1 memorial",
        "Upload up to 10 photos",
        "2 basic themes",
        "Share link",
        "Guest book",
        "Virtual candles",
        "Timeline",
      ],
    },
    {
      id: "essential",
      name: "Essential",
      tagline: "Build a beautiful, complete tribute.",
      description: "Ideal for one full-featured memorial",
      price: { monthly: 99, annual: 999, lifetime: null },
      popular: true,
      cta: "Start Essential",
      features: [
        "1 memorial",
        "Unlimited photos, videos, audio",
        "All 4 themes",
        "QR code generation",
        "Full social sharing",
        "Timeline",
        "Donation link",
        "Email support",
        "Analytics",
      ],
    },
    {
      id: "family",
      name: "Family",
      tagline: "Honor all your loved ones.",
      description: "Manage multiple memorials",
      price: { monthly: 179, annual: 1799, lifetime: null },
      popular: false,
      cta: "Start Family",
      features: [
        "Up to 3 memorials",
        "Unlimited photos, videos, audio",
        "All 4 themes",
        "QR code generation",
        "Full social sharing",
        "Timeline",
        "Donation link",
        "Priority support",
        "Analytics",
        "Early access to new features",
      ],
    },
    {
      id: "lifetime",
      name: "Lifetime",
      tagline: "One price. Infinite memories.",
      description: "Pay once, keep forever — full access",
      price: { monthly: null, annual: null, lifetime: 2999 },
      popular: false,
      cta: "Get Lifetime Access",
      features: [
        "Unlimited memorials",
        "Unlimited photos, videos, audio",
        "All themes + Custom",
        "QR code generation",
        "Full social sharing",
        "Timeline",
        "Donation link",
        "Priority support",
        "Analytics",
        "Future updates included",
        "Custom requests (if feasible)",
      ],
    },
  ];

  const getPriceDisplay = (plan: typeof plans[0]) => {
    if (plan.id === "free") return "Free";

    if (billingCycle === "lifetime") {
      if (plan.price.lifetime === null) return "—";
      return `R${plan.price.lifetime}`;
    }

    if (billingCycle === "annual") {
      if (plan.price.annual === null) return "—";
      return `R${plan.price.annual}`;
    }

    if (plan.price.monthly === null) return "—";
    return `R${plan.price.monthly}`;
  };

  const getBillingLabel = () => {
    if (billingCycle === "lifetime") return "once";
    if (billingCycle === "annual") return "/year";
    return "/month";
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-h1 md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Simple, transparent pricing. Start free and upgrade as you grow. No hidden fees. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-muted rounded-pill p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-pill text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-pill text-sm font-medium transition-all ${
                  billingCycle === "annual"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
                <Badge variant="accent" className="ml-2 text-xs">Save 2 months</Badge>
              </button>
              <button
                onClick={() => setBillingCycle("lifetime")}
                className={`px-6 py-2 rounded-pill text-sm font-medium transition-all ${
                  billingCycle === "lifetime"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Lifetime
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative p-6 flex flex-col ${
                  plan.popular
                    ? "border-2 border-accent shadow-lg"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge
                    variant="accent"
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    Most Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs font-medium text-accent mb-2 italic">
                    {plan.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold text-foreground">
                      {getPriceDisplay(plan)}
                    </span>
                    {plan.id !== "free" && (
                      <span className="text-muted-foreground">
                        {getBillingLabel()}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={
                    plan.id === "free"
                      ? "/sign-up"
                      : `/checkout?plan=${plan.id}&billing=${billingCycle}`
                  }
                  className="w-full"
                >
                  <Button
                    variant={plan.popular ? "accent" : "primary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-h2 md:text-4xl font-bold text-foreground mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-muted-foreground">
              See what's included in each plan
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full bg-card rounded-token shadow-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Essential</th>
                  <th className="text-center p-4 font-semibold">Family</th>
                  <th className="text-center p-4 font-semibold">Lifetime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4">Memorials</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">Photo & Video Uploads</td>
                  <td className="text-center p-4">10 photos only</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4">Themes</td>
                  <td className="text-center p-4">2 basic</td>
                  <td className="text-center p-4">All 4</td>
                  <td className="text-center p-4">All 4</td>
                  <td className="text-center p-4">All + Custom</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">QR Code</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Donations</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">Analytics</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Support</td>
                  <td className="text-center p-4">Community</td>
                  <td className="text-center p-4">Email</td>
                  <td className="text-center p-4">Priority</td>
                  <td className="text-center p-4">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ or CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-h2 md:text-3xl font-bold text-foreground mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our team is here to help you choose the right plan
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
