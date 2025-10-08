"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { CreditCard, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  amount: number;
  status: string;
  billing_cycle: string | null;
  created_at: string;
  completed_at: string | null;
  netcash_reference: string | null;
  plans: {
    name: string;
  };
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select("*, plans(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setPayments((data as unknown as Payment[]) || []);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "accent" | "outline"> = {
      completed: "accent",
      pending: "secondary",
      failed: "outline",
      cancelled: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-sm text-muted-foreground">
          Loading payment history...
        </div>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            No Payment History
          </h3>
          <p className="text-sm text-muted-foreground">
            Your payment history will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Payment History
        </h2>
        <CreditCard className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 border border-border rounded-token hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{getStatusIcon(payment.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {payment.plans.name} Plan
                  </h4>
                  {getStatusBadge(payment.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {payment.billing_cycle
                    ? `${payment.billing_cycle.charAt(0).toUpperCase()}${payment.billing_cycle.slice(1)} billing`
                    : "One-time payment"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(payment.created_at).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {payment.netcash_reference && (
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Ref: {payment.netcash_reference}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <span className="font-serif text-lg font-bold text-foreground">
                R{payment.amount}
              </span>
              {payment.status === "completed" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    // TODO: Implement receipt download
                    alert("Receipt download coming soon");
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Receipt
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {payments.length >= 10 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Showing last 10 transactions
          </p>
        </div>
      )}
    </Card>
  );
}
