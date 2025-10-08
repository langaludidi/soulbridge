"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { Check, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PlanLimits {
  name: string;
  max_memorials: number | null;
  max_uploads: number | null;
  features: string[];
}

interface UserProfile {
  plan: string;
  subscription_status: string;
}

export default function SubscriptionSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanLimits | null>(null);
  const [memorialCount, setMemorialCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .single<UserProfile>();

      if (profileData) {
        setProfile(profileData);

        // Get plan details
        const { data: planData } = await supabase
          .from("plans")
          .select("name, max_memorials, max_uploads, features")
          .eq("name", profileData.plan.charAt(0).toUpperCase() + profileData.plan.slice(1))
          .single<PlanLimits>();

        if (planData) {
          setPlanDetails(planData);
        }

        // Get memorial count
        const { count } = await supabase
          .from("memorials")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setMemorialCount(count || 0);
      }
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!profile || !planDetails) return null;

  const isLimitReached =
    planDetails.max_memorials !== null &&
    memorialCount >= planDetails.max_memorials;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-accent/10">
            <Crown className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground">
              {planDetails.name} Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <Badge
                variant={
                  profile.subscription_status === "active"
                    ? "default"
                    : "secondary"
                }
                className="ml-1"
              >
                {profile.subscription_status}
              </Badge>
            </p>
          </div>
        </div>
        {profile.plan === "free" && (
          <Link href="/pricing">
            <Button variant="accent" size="sm">
              Upgrade
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {/* Usage Stats */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Memorials Used</span>
            <span className="font-medium">
              {memorialCount} /{" "}
              {planDetails.max_memorials === null
                ? "Unlimited"
                : planDetails.max_memorials}
            </span>
          </div>
          {planDetails.max_memorials !== null && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isLimitReached ? "bg-destructive" : "bg-accent"
                }`}
                style={{
                  width: `${Math.min(
                    (memorialCount / planDetails.max_memorials) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}
        </div>

        {isLimitReached && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              You've reached your memorial limit. Upgrade to create more.
            </p>
          </div>
        )}

        {/* Features */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Plan Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {planDetails.features?.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {profile.plan === "free" && (
          <Link href="/pricing" className="block">
            <Button variant="outline" className="w-full">
              View All Plans
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
