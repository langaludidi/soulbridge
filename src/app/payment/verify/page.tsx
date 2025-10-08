"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (reference) {
      verifyPayment();
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payments/verify?reference=${reference}`);
      const data = await response.json();

      if (response.ok) {
        if (data.status === 'completed') {
          // Redirect to success page
          router.push(`/payment/success?reference=${reference}`);
        } else {
          // Redirect to cancelled page
          router.push(`/payment/cancelled?reference=${reference}`);
        }
      } else {
        // Error - redirect to cancelled page
        router.push(`/payment/cancelled?reference=${reference}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      router.push(`/payment/cancelled?reference=${reference}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Verifying Payment...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment
        </p>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
