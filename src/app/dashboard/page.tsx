"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UpgradePrompt, UpgradePrompts } from "@/components/ui/upgrade-prompt";
import { useEntitlements } from "@/lib/hooks/useEntitlements";
import {
  Plus,
  Eye,
  Share2,
  Edit,
  Trash2,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import UserProfileSection from "./_components/UserProfileSection";
import QuickStats from "./_components/QuickStats";
import SubscriptionSection from "./_components/SubscriptionSection";
import PaymentHistory from "./_components/PaymentHistory";

interface Memorial {
  id: string;
  full_name: string;
  slug: string;
  date_of_birth: string | null;
  date_of_death: string | null;
  profile_photo_url: string | null;
  status: "draft" | "published";
  privacy: "public" | "private" | "unlisted";
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { entitlements, loading: entitlementsLoading } = useEntitlements();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
        return;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.replace("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchMemorials();
  }, [checkAuth]);

  const fetchMemorials = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMemorials(data || []);
    } catch {
      toast.error("Failed to load memorials");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the memorial for ${name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("memorials").delete().eq("id", id);

      if (error) throw error;

      toast.success("Memorial deleted");
      fetchMemorials();
    } catch {
      toast.error("Failed to delete memorial");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return <Badge variant="accent">Published</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  const getPrivacyBadge = (privacy: string) => {
    const colors: Record<string, "default" | "secondary" | "outline"> = {
      public: "default",
      private: "secondary",
      unlisted: "outline",
    };

    return (
      <Badge variant={colors[privacy] || "outline"}>
        {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
      </Badge>
    );
  };

  if (loading || entitlementsLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const isAtMemorialLimit =
    entitlements?.maxMemorials !== null &&
    memorials.length >= (entitlements?.maxMemorials || 0);

  const handleCreateMemorial = () => {
    if (isAtMemorialLimit) {
      setShowUpgradePrompt(true);
    } else {
      router.push("/memorial/create");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/50">
          <div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-3 tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back! Here's an overview of your memorials.
            </p>
          </div>
          <Button
            variant="accent"
            size="lg"
            className="shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-shadow"
            onClick={handleCreateMemorial}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Memorial
          </Button>
        </div>

        {/* Upgrade Prompt Banner - Show if at limit */}
        {isAtMemorialLimit && entitlements && (
          <UpgradePrompt
            {...UpgradePrompts.memorialLimit(
              memorials.length,
              entitlements.maxMemorials || 0
            )}
            variant="banner"
            currentPlan={entitlements.plan}
            onClose={() => setShowUpgradePrompt(false)}
          />
        )}

        {/* User Profile Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UserProfileSection />
        </div>

        {/* Quick Stats */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <QuickStats />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {/* Subscription Info - Takes 1 column */}
          <div className="lg:col-span-1">
            <SubscriptionSection />
          </div>

          {/* Payment History - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PaymentHistory />
          </div>
        </div>

        {/* Memorials Section */}
        <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
                My Memorials
              </h2>
              <p className="text-muted-foreground">
                {memorials.length === 0
                  ? "Create your first memorial to get started"
                  : `${memorials.length} memorial${memorials.length === 1 ? "" : "s"} created`}
              </p>
            </div>
            {memorials.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="shadow-sm hover:shadow-md transition-shadow"
                onClick={handleCreateMemorial}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Memorial
              </Button>
            )}
          </div>

          {/* Empty State */}
          {memorials.length === 0 ? (
            <Card className="p-16 text-center bg-gradient-to-br from-card to-muted/20 border-2 border-dashed border-border shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-foreground mb-3">
                  Create Your First Memorial
                </h3>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  Honor and celebrate the life of a loved one with a beautiful
                  digital memorial that preserves their legacy forever.
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  className="shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all"
                  onClick={handleCreateMemorial}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
              </div>
            </Card>
          ) : (
            /* Memorials Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {memorials.map((memorial, index) => (
                <Card
                  key={memorial.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                    {memorial.profile_photo_url ? (
                      <img
                        src={memorial.profile_photo_url}
                        alt={memorial.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10">
                        <Users className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getStatusBadge(memorial.status)}
                      {getPrivacyBadge(memorial.privacy)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {memorial.full_name}
                      </h3>
                      {memorial.date_of_birth && memorial.date_of_death && (
                        <p className="text-sm font-medium text-muted-foreground">
                          {new Date(memorial.date_of_birth).getFullYear()} -{" "}
                          {new Date(memorial.date_of_death).getFullYear()}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 py-2 text-sm text-muted-foreground border-y border-border/50">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">0 views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">0 tributes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/memorial/${memorial.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full group/btn">
                          <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          View
                        </Button>
                      </Link>
                      <Link
                        href={`/memorial/edit/${memorial.id}`}
                        className="flex-1"
                      >
                        <Button variant="primary" size="sm" className="w-full group/btn">
                          <Edit className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/memorial/${memorial.slug}`
                          );
                          toast.success("Link copied!");
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                        onClick={() =>
                          handleDelete(memorial.id, memorial.full_name)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Modal - Show when user tries to create memorial at limit */}
        {showUpgradePrompt && isAtMemorialLimit && entitlements && (
          <UpgradePrompt
            {...UpgradePrompts.memorialLimit(
              memorials.length,
              entitlements.maxMemorials || 0
            )}
            variant="modal"
            currentPlan={entitlements.plan}
            onClose={() => setShowUpgradePrompt(false)}
          />
        )}
      </div>
    </div>
  );
}
