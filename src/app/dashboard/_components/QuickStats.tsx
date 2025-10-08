"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Heart, Image, MessageSquare, Eye } from "lucide-react";

interface Stats {
  totalMemorials: number;
  publishedMemorials: number;
  totalGalleryItems: number;
  totalTributes: number;
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stats>({
    totalMemorials: 0,
    publishedMemorials: 0,
    totalGalleryItems: 0,
    totalTributes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get memorials count
      const { count: memorialsCount } = await supabase
        .from("memorials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get published memorials count
      const { count: publishedCount } = await supabase
        .from("memorials")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "published");

      // Get user's memorial IDs for gallery and tributes
      const { data: userMemorials } = await supabase
        .from("memorials")
        .select("id")
        .eq("user_id", user.id);

      const memorialIds = userMemorials?.map((m) => m.id) || [];

      // Get gallery items count
      let galleryCount = 0;
      if (memorialIds.length > 0) {
        const { count: gCount } = await supabase
          .from("gallery_items")
          .select("*", { count: "exact", head: true })
          .in("memorial_id", memorialIds);
        galleryCount = gCount || 0;
      }

      // Get tributes count
      let tributesCount = 0;
      if (memorialIds.length > 0) {
        const { count: tCount } = await supabase
          .from("tributes")
          .select("*", { count: "exact", head: true })
          .in("memorial_id", memorialIds);
        tributesCount = tCount || 0;
      }

      setStats({
        totalMemorials: memorialsCount || 0,
        publishedMemorials: publishedCount || 0,
        totalGalleryItems: galleryCount,
        totalTributes: tributesCount,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Memorials",
      value: stats.totalMemorials,
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-600/10",
    },
    {
      label: "Published",
      value: stats.publishedMemorials,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "Gallery Items",
      value: stats.totalGalleryItems,
      icon: Image,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      label: "Tributes Received",
      value: stats.totalTributes,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
