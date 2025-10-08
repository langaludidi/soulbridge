"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Simulate email confirmation (actual confirmation happens via Supabase link)
    const timer = setTimeout(() => {
      setStatus("success");
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto mb-4" />
            <h1 className="font-serif text-h2 font-bold text-foreground mb-2">
              Confirming Your Email
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="font-serif text-h2 font-bold text-foreground mb-2">
              Email Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your email has been verified successfully. Redirecting to your dashboard...
            </p>
            <Link href="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="font-serif text-h2 font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your email. The link may have expired or is invalid.
            </p>
            <Link href="/sign-in">
              <Button variant="primary">Back to Sign In</Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
