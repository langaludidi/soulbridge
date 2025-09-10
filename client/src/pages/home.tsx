import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { MemorialCard } from "@/components/memorial-card";
import { CreateMemorialModal } from "@/components/create-memorial-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { Memorial } from "@shared/schema";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const { data: recentMemorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Continue honoring the memories of your loved ones and connecting with your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowCreateModal(true)} data-testid="button-home-create-memorial">
                Create Memorial
              </Button>
              <Link href="/browse">
                <Button variant="secondary" data-testid="button-home-browse-memorials">
                  Browse Memorials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Recent Memorials</h2>
            <Link href="/browse">
              <Button variant="outline" size="sm" data-testid="button-view-all-recent">
                View All
              </Button>
            </Link>
          </div>
          
          {recentMemorials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentMemorials.slice(0, 6).map((memorial) => (
                <MemorialCard key={memorial.id} memorial={memorial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No memorials available yet.</p>
              <Button onClick={() => setShowCreateModal(true)} data-testid="button-create-first-home">
                Create the First Memorial
              </Button>
            </div>
          )}
        </div>
      </section>

      <CreateMemorialModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
