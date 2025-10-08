"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { User, Mail, Calendar, Crown } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  subscription_status: string;
  created_at: string;
}

export default function UserProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<UserProfile>();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!profile) return null;

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, "default" | "accent" | "secondary"> = {
      free: "secondary",
      essential: "default",
      family: "accent",
      lifetime: "accent",
    };
    return colors[plan.toLowerCase()] || "default";
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {profile.full_name || "User"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </div>
        <Link href="/settings">
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <Crown className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getPlanBadgeColor(profile.plan)}>
                {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
              </Badge>
              <Badge
                variant={
                  profile.subscription_status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {profile.subscription_status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium mt-1">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end md:justify-start">
          {profile.plan === "free" && (
            <Link href="/pricing">
              <Button variant="accent" size="sm">
                Upgrade Plan
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
