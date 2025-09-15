import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, ArrowRight, Home, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { PaymentTransaction, SubscriptionResponse } from "@shared/types";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [reference, setReference] = useState<string>("");

  useEffect(() => {
    // Get reference from URL params
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || '';
    setReference(ref);
  }, []);

  // Get transaction details if reference is available
  const { data: transactionData, isLoading } = useQuery<PaymentTransaction>({
    queryKey: ['/api/billing/transaction', reference],
    enabled: !!reference,
    retry: 3,
    retryDelay: 2000,
  });

  // Get user subscription details
  const { data: subscription } = useQuery<SubscriptionResponse>({
    queryKey: ['/api/billing/subscription'],
    enabled: !!user
  });

  const planNames = {
    honour: "Honour",
    legacy: "Legacy", 
    family_vault: "Family Vault"
  };

  const handleGoToDashboard = () => {
    setLocation('/dashboard');
  };

  const handleViewSubscription = () => {
    setLocation('/dashboard#subscription');
  };

  const handleCreateMemorial = () => {
    setLocation('/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl text-primary">
              Soulbridge
            </Link>
            <Button variant="outline" onClick={handleGoToDashboard}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your subscription. Your payment has been processed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Transaction Details */}
          <Card data-testid="card-transaction-details">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-sm" data-testid="text-reference">
                      {reference || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold" data-testid="text-amount">
                      {transactionData?.amount ? `R${transactionData.amount}` : 'Processing...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span data-testid="text-date">
                      {new Date().toLocaleDateString('en-ZA')}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card data-testid="card-subscription-details">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>
                Your new plan is now active and ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <div className="text-right">
                      <div className="font-semibold" data-testid="text-plan">
                        {planNames[subscription?.subscription?.plan as keyof typeof planNames] || subscription?.subscription?.plan}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {subscription?.subscription?.interval}ly
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Memorial Limit:</span>
                    <span data-testid="text-memorial-limit">
                      {subscription?.entitlements?.memorialLimit === -1 
                        ? 'Unlimited' 
                        : subscription?.entitlements?.memorialLimit || '1'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading subscription details...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={handleCreateMemorial}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-create-memorial"
          >
            Create Your First Memorial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleViewSubscription}
            data-testid="button-view-subscription"
          >
            View Subscription
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoToDashboard}
            data-testid="button-dashboard"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Memorials</h3>
                <p className="text-sm text-gray-600">
                  Start creating beautiful digital memorials for your loved ones
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Add Photos & Stories</h3>
                <p className="text-sm text-gray-600">
                  Upload photos and share meaningful stories and memories
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Share with Family</h3>
                <p className="text-sm text-gray-600">
                  Invite family and friends to view and contribute to the memorial
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-gray-600 mb-2">Need help getting started?</p>
          <Link href="/contact" className="text-primary hover:text-primary/80 font-medium">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
}