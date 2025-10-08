"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const reference = searchParams.get("reference");

  const [payment, setPayment] = useState<{
    reference: string;
    amount: number;
    planName: string;
    billingCycle: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (reference) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [reference]);

  const fetchPaymentDetails = async () => {
    try {
      if (!reference) return;

      const { data: payment, error } = await supabase
        .from("payments")
        .select("*, plans(name)")
        .eq("payment_reference", reference)
        .single();

      if (error || !payment) {
        console.error("Failed to fetch payment:", error);
        return;
      }

      setPayment({
        reference: payment.payment_reference,
        amount: payment.amount,
        planName: (payment.plans as any)?.name || "Unknown",
        billingCycle: payment.billing_cycle,
        createdAt: payment.created_at,
      });
    } catch (error) {
      console.error("Payment fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!payment) return;

    setRetrying(true);

    try {
      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(
          `/sign-in?redirect=/checkout?plan=${payment.planName.toLowerCase()}&billing=${payment.billingCycle}`
        );
        return;
      }

      // Redirect to checkout with same plan
      router.push(
        `/checkout?plan=${payment.planName.toLowerCase()}&billing=${payment.billingCycle}`
      );
    } catch (error) {
      console.error("Retry error:", error);
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!reference && !payment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4">No Payment Found</h2>
          <p className="text-muted-foreground mb-6">
            No payment reference was provided
          </p>
          <Link href="/pricing">
            <Button variant="accent">View Pricing Plans</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-destructive/5 via-background to-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Failure Icon */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-destructive/10">
            <XCircle className="h-14 w-14 text-destructive" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Unfortunately, your payment could not be processed. Don't worry, you
            haven't been charged.
          </p>
        </div>

        {/* Payment Details Card */}
        {payment && (
          <Card className="p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Payment Details
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold text-foreground">
                  {payment.planName}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-semibold text-foreground capitalize">
                  {payment.billingCycle}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-serif text-2xl font-bold text-foreground">
                  R{payment.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-sm text-foreground">
                  {payment.reference}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-destructive">Failed</span>
              </div>
            </div>
          </Card>
        )}

        {/* Common Reasons Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-muted/50 to-transparent animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Common Reasons
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Insufficient funds in your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Card details entered incorrectly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Card has expired or been blocked</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Payment was declined by your bank</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Network connection was interrupted</span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-accent/10 rounded-token border border-accent/20">
            <p className="text-sm text-foreground">
              <strong>Tip:</strong> Please check with your bank or try a different
              payment method. If the problem persists, contact our support team.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 mb-8">
          <Button
            variant="accent"
            size="lg"
            className="flex-1 sm:flex-initial shadow-lg"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </>
            )}
          </Button>
          <Link href="/pricing" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="lg" className="w-full">
              View Other Plans
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Support */}
        <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
          <p className="text-sm text-foreground mb-4">
            <strong>Need help with your payment?</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to assist you with any payment issues or
            questions you may have.
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}
