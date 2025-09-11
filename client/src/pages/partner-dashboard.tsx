import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  DollarSign, 
  Upload, 
  Globe, 
  Link2, 
  Copy,
  Edit,
  Eye,
  Calendar,
  BarChart3,
  Settings
} from "lucide-react";

// API-driven data fetching (replaced mock data)

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingBranding, setEditingBranding] = useState(false);
  // Fetch partner dashboard data using real API calls
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['/api/partner/dashboard'],
    enabled: !!user,
  });

  // Extract partner data from dashboard response
  const partnerData = dashboardData && typeof dashboardData === 'object' && 'partner' in dashboardData ? dashboardData.partner : null;
  const isPartnerLoading = isDashboardLoading; // Use same loading state

  const { data: brandingData, isLoading: isBrandingLoading } = useQuery({
    queryKey: ['/api/partner/branding'],
    enabled: !!user,
  });

  const { data: memorialsData, isLoading: isMemorialsLoading } = useQuery({
    queryKey: ['/api/memorials'],
    enabled: !!user,
  });

  const [brandingForm, setBrandingForm] = useState({
    primaryColor: "#1e40af",
    secondaryColor: "#64748b", 
    fontFamily: "serif",
    displayName: "",
  });

  // Update branding form when branding data is fetched
  React.useEffect(() => {
    if (brandingData && typeof brandingData === 'object' && 'brandingConfig' in brandingData && brandingData.brandingConfig) {
      setBrandingForm(brandingData.brandingConfig);
    }
  }, [brandingData]);

  // Extract data with fallbacks for loading states
  const kpis = (dashboardData && typeof dashboardData === 'object') ? {
    totalMemorials: ('totalMemorials' in dashboardData ? dashboardData.totalMemorials : 0) as number,
    activeMemorials: ('activeMemorials' in dashboardData ? dashboardData.activeMemorials : 0) as number,
    monthlyViews: ('monthlyViews' in dashboardData ? dashboardData.monthlyViews : 0) as number,
    monthlyRevenue: ('monthlyRevenue' in dashboardData ? dashboardData.monthlyRevenue : 0) as number,
    pendingPayouts: ('pendingPayouts' in dashboardData ? dashboardData.pendingPayouts : 0) as number,
    referralConversions: ('referralConversions' in dashboardData ? dashboardData.referralConversions : 0) as number,
  } : {
    totalMemorials: 0,
    activeMemorials: 0,
    monthlyViews: 0,
    monthlyRevenue: 0,
    pendingPayouts: 0,
    referralConversions: 0,
  };

  // Helper function for currency formatting
  const formatCurrency = (amountInCents: number) => {
    return `R${(amountInCents / 100).toFixed(2)}`;
  };

  const memorials = Array.isArray(memorialsData) ? memorialsData : [];
  const isLoading = isDashboardLoading || isPartnerLoading || isBrandingLoading || isMemorialsLoading;

  // Real mutation for saving branding
  const { mutate: saveBranding, isPending: isSavingBranding } = useMutation({
    mutationFn: async (brandingConfig: any) => {
      const response = await fetch('/api/partner/branding', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandingConfig }),
      });
      if (!response.ok) {
        throw new Error('Failed to update branding');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Branding Updated",
        description: "Your branding configuration has been saved successfully.",
      });
      setEditingBranding(false);
      // Invalidate and refetch branding data
      queryClient.invalidateQueries({ queryKey: ['/api/partner/branding'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update branding configuration.",
        variant: "destructive",
      });
    },
  });

  const handleSaveBranding = () => {
    saveBranding(brandingForm);
  };

  const handleCopyReferralLink = () => {
    const referralLink = `https://soulbridge.co.za?ref=${partnerData?.id || 'unknown'}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard.",
    });
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading your partner dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if data loading failed
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-destructive text-xl">!</span>
              </div>
              <p className="text-muted-foreground">Failed to load partner dashboard data.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Partner Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{partnerData?.name || 'Loading...'}</Badge>
              <Badge variant={partnerData?.status === 'active' ? 'default' : 'secondary'}>
                {partnerData?.status || 'pending'}
              </Badge>
              <Badge variant="outline">{partnerData?.partnershipModel || 'referral'}</Badge>
            </div>
          </div>
          <Button data-testid="button-account-settings">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="memorials" data-testid="tab-memorials">
              <Heart className="w-4 h-4 mr-2" />
              Memorials
            </TabsTrigger>
            <TabsTrigger value="branding" data-testid="tab-branding">
              <Upload className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            {partnerData?.partnershipModel === 'whitelabel' && (
              <TabsTrigger value="domain" data-testid="tab-domain">
                <Globe className="w-4 h-4 mr-2" />
                Domain
              </TabsTrigger>
            )}
            <TabsTrigger value="payouts" data-testid="tab-payouts">
              <DollarSign className="w-4 h-4 mr-2" />
              Referrals & Payouts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Memorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="kpi-total-memorials">
                    {kpis.totalMemorials}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {kpis.activeMemorials} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="kpi-monthly-views">
                    {kpis.monthlyViews.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="kpi-monthly-revenue">
                    {formatCurrency(kpis.monthlyRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {partnerData?.revenueSharePct || 0}% share
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Payouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="kpi-pending-payouts">
                    {formatCurrency(kpis.pendingPayouts)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Next payout: Feb 28
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New memorial published</p>
                      <p className="text-xs text-muted-foreground">Grace Mogale memorial went live</p>
                    </div>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Revenue share payment</p>
                      <p className="text-xs text-muted-foreground">R312 added to pending payouts</p>
                    </div>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memorials Tab */}
          <TabsContent value="memorials" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Memorial Management</h2>
              <Button data-testid="button-create-memorial">
                Create New Memorial
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date of Passing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Tributes</TableHead>
                      <TableHead>Photos</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memorials.map((memorial) => (
                      <TableRow key={memorial.id}>
                        <TableCell className="font-medium" data-testid={`memorial-name-${memorial.id}`}>
                          {memorial.firstName} {memorial.lastName}
                        </TableCell>
                        <TableCell>{new Date(memorial.dateOfPassing).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={memorial.status === 'published' ? 'default' : 'secondary'}
                            data-testid={`memorial-status-${memorial.id}`}
                          >
                            {memorial.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{memorial.views}</TableCell>
                        <TableCell>{memorial.tributes}</TableCell>
                        <TableCell>{memorial.photos}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" data-testid={`button-view-${memorial.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-edit-${memorial.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Branding Configuration</h2>
              <Button 
                onClick={() => setEditingBranding(!editingBranding)}
                data-testid="button-edit-branding"
              >
                {editingBranding ? 'Cancel' : 'Edit Branding'}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Brand Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label htmlFor="logo-upload">Business Logo</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {partnerData?.logoUrl ? (
                      <img 
                        src={partnerData.logoUrl} 
                        alt="Business logo" 
                        className="h-16 mx-auto mb-4" 
                      />
                    ) : (
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    )}
                    <p className="text-muted-foreground mb-4">
                      {partnerData?.logoUrl ? 'Update your logo' : 'Upload your business logo'}
                    </p>
                    <Button variant="outline" disabled={!editingBranding} data-testid="button-upload-logo">
                      Select Logo File
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Brand Colors */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={brandingForm.primaryColor}
                        onChange={(e) => setBrandingForm({...brandingForm, primaryColor: e.target.value})}
                        disabled={!editingBranding}
                        className="w-16 h-10"
                        data-testid="input-primary-color"
                      />
                      <Input
                        value={brandingForm.primaryColor}
                        onChange={(e) => setBrandingForm({...brandingForm, primaryColor: e.target.value})}
                        disabled={!editingBranding}
                        data-testid="input-primary-color-hex"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={brandingForm.secondaryColor}
                        onChange={(e) => setBrandingForm({...brandingForm, secondaryColor: e.target.value})}
                        disabled={!editingBranding}
                        className="w-16 h-10"
                        data-testid="input-secondary-color"
                      />
                      <Input
                        value={brandingForm.secondaryColor}
                        onChange={(e) => setBrandingForm({...brandingForm, secondaryColor: e.target.value})}
                        disabled={!editingBranding}
                        data-testid="input-secondary-color-hex"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select 
                    value={brandingForm.fontFamily} 
                    onValueChange={(value) => setBrandingForm({...brandingForm, fontFamily: value})}
                    disabled={!editingBranding}
                  >
                    <SelectTrigger data-testid="select-font-family">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Serif (Traditional)</SelectItem>
                      <SelectItem value="sans-serif">Sans Serif (Modern)</SelectItem>
                      <SelectItem value="script">Script (Elegant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingBranding && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingBranding(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveBranding} data-testid="button-save-branding">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domain Tab (White-label only) */}
          {partnerData?.partnershipModel === 'whitelabel' && (
            <TabsContent value="domain" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Domain Management</h2>
                <Button data-testid="button-add-domain">
                  Add Custom Domain
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Domains</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium" data-testid="primary-domain">
                        {partnerData?.domainConfig?.primaryDomain || 'No domain configured'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="default">Primary</Badge>
                        <Badge variant={partnerData?.domainConfig?.sslEnabled ? 'default' : 'secondary'}>
                          {partnerData?.domainConfig?.sslEnabled ? 'SSL Active' : 'SSL Pending'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-configure-domain">
                      Configure
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">DNS Configuration</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Point your domain to our servers using these DNS records:
                    </p>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex items-center justify-between">
                        <span>CNAME: memorials → soulbridge-hosting.com</span>
                        <Button variant="outline" size="sm" data-testid="button-copy-cname">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>TXT: verification → sb-verify-{partnerData?.id || 'pending'}</span>
                        <Button variant="outline" size="sm" data-testid="button-copy-txt">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Referrals & Payouts Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <h2 className="text-2xl font-semibold">Referrals & Payouts</h2>

            {/* Referral Section */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Program</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your Referral Link</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        value={`https://soulbridge.co.za?ref=${partnerData?.id || 'pending'}`}
                        readOnly
                        data-testid="input-referral-link"
                      />
                      <Button variant="outline" size="sm" onClick={handleCopyReferralLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Commission Rate</Label>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(partnerData?.referralPayoutZar || 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">per successful conversion</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold" data-testid="referral-conversions">
                      {kpis.referralConversions}
                    </div>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(kpis.referralConversions * (partnerData?.referralPayoutZar || 0))}
                    </div>
                    <p className="text-sm text-muted-foreground">Earned this month</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(kpis.pendingPayouts)}
                    </div>
                    <p className="text-sm text-muted-foreground">Pending payout</p>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Payout History */}
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-01-31</TableCell>
                      <TableCell>Revenue Share</TableCell>
                      <TableCell>{formatCurrency(28500)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-01-31</TableCell>
                      <TableCell>Referral Commission</TableCell>
                      <TableCell>{formatCurrency(150000)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-02-28</TableCell>
                      <TableCell>Revenue Share</TableCell>
                      <TableCell>{formatCurrency(31200)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}