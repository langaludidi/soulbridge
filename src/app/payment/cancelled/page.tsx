"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [payment, setPayment] = useState<{
    status: string;
    amount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      checkPaymentStatus();
    }
  }, [reference]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(
        `/api/payments/webhook?reference=${reference}`
      );
      const data = await response.json();

      if (response.ok) {
        setPayment(data);
      }
    } catch (error) {
      console.error("Payment status check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Go back to pricing page to start over
    router.push("/pricing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const isFailed = payment?.status === "failed";
  const isCancelled = payment?.status === "cancelled";

  return (
    <div className="min-h-screen bg-gradient-to-b from-destructive/5 to-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8 lg:p-12 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {isFailed ? "Payment Failed" : "Payment Cancelled"}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {isFailed
              ? "We couldn't process your payment. Please try again or use a different payment method."
              : "You cancelled the payment process. No charges were made to your account."}
          </p>

          {/* Payment Details */}
          {reference && (
            <div className="bg-muted/30 rounded-token p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Reference
                  </span>
                  <span className="text-sm font-mono text-foreground">
                    {reference}
                  </span>
                </div>
                {payment?.amount && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      R{payment.amount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold text-destructive capitalize">
                    {payment?.status || "Cancelled"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Common Issues */}
          {isFailed && (
            <div className="bg-background rounded-token p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">
                Common Issues
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Card expired or declined by bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Incorrect card details entered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Bank security restrictions</span>
                </li>
              </ul>
            </div>
          )}

          {/* What to Do Next */}
          <div className="bg-background rounded-token p-6 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-4">
              What to Do Next?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {isFailed && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>Check your card details and account balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>Contact your bank if the issue persists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>Try a different payment method</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>You can try again anytime - no penalties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>Contact support if you need assistance</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              onClick={handleRetry}
              className="flex-1 sm:flex-initial"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Link href="/pricing" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="lg" className="w-full">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs text-muted-foreground mt-8">
            Having trouble?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact our support team
            </Link>{" "}
            - we're here to help
          </p>
        </Card>

        {/* Alternative Options */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Not ready to purchase?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up">
              <Button variant="ghost" size="sm">
                Start with Free Plan
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" size="sm">
                Learn More About Features
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  );
}
