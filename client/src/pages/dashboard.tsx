import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { 
  Crown, 
  Users, 
  Heart, 
  Shield, 
  Plus, 
  Settings, 
  CreditCard, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpCircle
} from "lucide-react";

interface Subscription {
  id: string;
  tier: string;
  status: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
}

interface UsageStats {
  memorialsUsed: number;
  memorialsLimit: number | "unlimited";
  currentMonthActive: number;
  totalTributes: number;
}

const tierConfig = {
  remember: {
    name: "Remember",
    icon: <Heart className="w-5 h-5" />,
    color: "bg-green-100 text-green-800",
    limit: 1
  },
  honour: {
    name: "Honour", 
    icon: <Users className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-800",
    limit: 3
  },
  legacy: {
    name: "Legacy",
    icon: <Crown className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-800",
    limit: "unlimited"
  },
  family_vault: {
    name: "Family Vault",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-gold-100 text-gold-800",
    limit: "unlimited"
  }
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Get user subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<Subscription>({
    queryKey: ["/api/billing/subscription"],
    enabled: !!isAuthenticated
  });

  // Get usage statistics  
  const { data: usage, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ["/api/user/usage"],
    enabled: !!isAuthenticated
  });

  // Get recent memorials
  const { data: recentMemorials, isLoading: memorialsLoading } = useQuery({
    queryKey: ["/api/memorials", { recent: true, limit: 5 }],
    enabled: !!isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to access your dashboard.
            </p>
            <Button asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTier = subscription?.tier || "remember";
  const tierInfo = tierConfig[currentTier as keyof typeof tierConfig] || tierConfig.remember;
  
  const memorialUsagePercent = usage && typeof tierInfo.limit === 'number' 
    ? Math.min((usage.memorialsUsed / tierInfo.limit) * 100, 100)
    : usage?.memorialsUsed || 0;

  const isNearLimit = typeof tierInfo.limit === 'number' && usage 
    ? usage.memorialsUsed >= tierInfo.limit * 0.8 
    : false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="font-bold text-2xl text-primary">
                Soulbridge
              </Link>
              <Badge variant="outline">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Upgrade
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome">
            Welcome back, {user?.firstName || "User"}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your memorials and subscription from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Usage Overview */}
            <Card data-testid="card-usage">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usageLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Memorials Created</span>
                        <span className="text-sm text-gray-600" data-testid="text-usage-count">
                          {usage?.memorialsUsed || 0} / {
                            typeof tierInfo.limit === 'number' ? tierInfo.limit : '∞'
                          }
                        </span>
                      </div>
                      {typeof tierInfo.limit === 'number' ? (
                        <Progress 
                          value={memorialUsagePercent} 
                          className={`h-2 ${isNearLimit ? 'bg-red-100' : 'bg-blue-100'}`}
                        />
                      ) : (
                        <div className="text-green-600 text-sm">Unlimited memorials ∞</div>
                      )}
                    </div>
                    
                    {isNearLimit && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">
                          You're approaching your memorial limit. Consider upgrading for unlimited access.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary" data-testid="text-active-memorials">
                          {usage?.currentMonthActive || 0}
                        </div>
                        <div className="text-sm text-gray-600">Active This Month</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary" data-testid="text-total-tributes">
                          {usage?.totalTributes || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Tributes</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Memorials */}
            <Card data-testid="card-recent-memorials">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Memorials</CardTitle>
                <Button size="sm" asChild>
                  <Link href="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Memorial
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {memorialsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (recentMemorials && Array.isArray(recentMemorials) && recentMemorials.length > 0) ? (
                  <div className="space-y-3">
                    {(recentMemorials as any[]).slice(0, 5).map((memorial: any) => (
                      <div key={memorial.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <img
                          src={memorial.photoUrl || '/placeholder-memorial.jpg'}
                          alt={memorial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{memorial.name}</h3>
                          <p className="text-sm text-gray-600">
                            {memorial.birthDate} - {memorial.deathDate}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/memorial/${memorial.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No memorials yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first memorial to honor a loved one.
                    </p>
                    <Button asChild>
                      <Link href="/create">Create Memorial</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Current Plan */}
            <Card data-testid="card-subscription">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {tierInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold" data-testid="text-current-plan">
                          {tierInfo.name}
                        </h3>
                        <Badge className={tierInfo.color} variant="secondary">
                          {subscription?.status === 'active' ? 'Active' : 'Free'}
                        </Badge>
                      </div>
                    </div>

                    {subscription?.currentPeriodEnd && (
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {subscription.cancelledAt 
                          ? `Ends ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                          : `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                        }
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/pricing">
                          <ArrowUpCircle className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </Link>
                      </Button>
                      {subscription && subscription.tier !== 'remember' && (
                        <Button variant="outline" size="sm" className="w-full" data-testid="button-manage-billing">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Billing
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/browse">
                      <Heart className="w-4 h-4 mr-2" />
                      Browse All Memorials
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/partners">
                      <Users className="w-4 h-4 mr-2" />
                      Find Funeral Services
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/about">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      How It Works
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}