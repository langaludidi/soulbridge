"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, ArrowRight, Loader2, Sparkles, Mail } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const reference = searchParams.get("reference");

  const [payment, setPayment] = useState<{
    reference: string;
    amount: number;
    planName: string;
    billingCycle: string;
    paidAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      checkPaymentStatus();

      // Trigger enhanced confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const colors = ["#8B5CF6", "#EC4899", "#F59E0B"];

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors,
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [reference]);

  const checkPaymentStatus = async () => {
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
        paidAt: payment.completed_at || payment.created_at,
      });
    } catch (error) {
      console.error("Payment status check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    // TODO: Implement PDF receipt download
    alert("Receipt download will be implemented soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Loading Payment Details
          </h1>
          <p className="text-muted-foreground mb-6">
            Please wait while we confirm your payment...
          </p>
          <Button
            variant="outline"
            onClick={() => checkPaymentStatus()}
            className="w-full"
          >
            Refresh Status
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 via-background to-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your subscription has been activated. Welcome to{" "}
            <span className="text-accent font-semibold">
              {payment.planName}
            </span>
            !
          </p>
        </div>

        {/* Payment Details Card */}
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
              <span className="text-muted-foreground">Amount Paid</span>
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
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">
                {new Date(payment.paidAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Receipt Info */}
          <div className="bg-muted/30 rounded-token p-4 flex items-start gap-3">
            <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Receipt sent to your email
              </p>
              <p className="text-xs text-muted-foreground">
                A detailed receipt has been sent to your registered email address.
              </p>
            </div>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-accent/5 to-transparent border-accent/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              What's Next?
            </h2>
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Create Your First Memorial
                </p>
                <p className="text-sm text-muted-foreground">
                  Start honoring your loved ones with beautiful digital tributes
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Upload Photos & Memories
                </p>
                <p className="text-sm text-muted-foreground">
                  Add unlimited photos, videos, and audio to celebrate their life
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Share with Family & Friends
                </p>
                <p className="text-sm text-muted-foreground">
                  Invite others to view, contribute tributes, and light virtual candles
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <Link href="/memorial/create" className="flex-1 sm:flex-initial">
            <Button variant="accent" size="lg" className="w-full shadow-lg">
              Create Your First Memorial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
