import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Home, 
  RefreshCw, 
  CreditCard,
  Loader2 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentComplete() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [reference, setReference] = useState<string>("");
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // Get reference from URL params
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || '';
    setReference(ref);
  }, []);

  // Poll for transaction status
  const { data: transactionData, isLoading, refetch } = useQuery({
    queryKey: ['/api/billing/transaction', reference],
    enabled: !!reference,
    refetchInterval: (data) => {
      // Stop polling if transaction is completed or failed, or after 10 checks
      if (!data || checkCount >= 10) return false;
      if ((data as any)?.status === 'completed' || (data as any)?.status === 'failed') return false;
      return 3000; // Poll every 3 seconds
    }
  });

  // Update check count when data changes
  useEffect(() => {
    if (transactionData) {
      setCheckCount(prev => prev + 1);
    }
  }, [transactionData]);

  const handleRefresh = () => {
    setCheckCount(0);
    refetch();
  };

  const handleGoToSuccess = () => {
    setLocation(`/payment/success?reference=${reference}`);
  };

  const handleGoToDeclined = () => {
    setLocation(`/payment/declined?reference=${reference}`);
  };

  const handleGoToDashboard = () => {
    setLocation('/dashboard');
  };

  const handleRetryPayment = () => {
    setLocation('/pricing');
  };

  // Determine the current status
  const getStatus = () => {
    if (isLoading && checkCount === 0) return 'loading';
    if (!transactionData) return 'unknown';
    
    switch ((transactionData as any)?.status) {
      case 'completed': return 'success';
      case 'failed': return 'failed';
      case 'pending': return 'pending';
      default: return 'unknown';
    }
  };

  const status = getStatus();

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'loading':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'from-green-50 to-white';
      case 'failed': return 'from-red-50 to-white';
      case 'pending': return 'from-yellow-50 to-white';
      default: return 'from-blue-50 to-white';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success': return 'Payment Successful!';
      case 'failed': return 'Payment Failed';
      case 'pending': return 'Processing Payment...';
      case 'loading': return 'Checking Payment Status...';
      default: return 'Payment Status Unknown';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'success': 
        return 'Your payment has been processed successfully and your subscription is now active.';
      case 'failed': 
        return 'There was an issue processing your payment. Please try again.';
      case 'pending': 
        return 'We\'re processing your payment. This usually takes a few moments.';
      case 'loading': 
        return 'Please wait while we verify your payment status...';
      default: 
        return 'We\'re having trouble determining your payment status. Please refresh or contact support.';
    }
  };

  // Auto-redirect after success/failure detection
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        handleGoToSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    } else if (status === 'failed') {
      const timer = setTimeout(() => {
        handleGoToDeclined();
      }, 3000);
      return () => clearTimeout(timer);
    }
    // Remove dependencies that cause type issues
  }, [status, handleGoToSuccess, handleGoToDeclined]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getStatusColor()}`}>
      {/* Header */}
      <div className="bg-white border-b">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
            {getStatusIcon()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getStatusTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            {getStatusDescription()}
          </p>
        </div>

        {/* Status-specific alerts */}
        {status === 'pending' && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your payment is being processed by NetCash. This typically takes 1-2 minutes.
              We'll automatically update this page when the status changes.
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment confirmed! You'll be redirected to the success page in a few seconds, 
              or you can click the button below to continue.
            </AlertDescription>
          </Alert>
        )}

        {status === 'failed' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Payment was not successful. You'll be redirected to try again, 
              or you can use the buttons below for more options.
            </AlertDescription>
          </Alert>
        )}

        {/* Transaction Details */}
        <Card className="mb-8" data-testid="card-transaction-status">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Transaction Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono text-sm" data-testid="text-reference">
                {reference || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <div data-testid="badge-status">
                {status === 'success' && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                {status === 'failed' && <Badge variant="destructive">Failed</Badge>}
                {status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>}
                {(status === 'loading' || status === 'unknown') && <Badge variant="secondary">Checking...</Badge>}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold" data-testid="text-amount">
                {(transactionData as any)?.amount ? `R${(transactionData as any).amount}` : 'Processing...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Checked:</span>
              <span className="text-sm text-gray-500" data-testid="text-last-checked">
                {new Date().toLocaleTimeString('en-ZA')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {status === 'success' && (
            <>
              <Button 
                onClick={handleGoToSuccess}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-view-success"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View Success Page
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoToDashboard}
                data-testid="button-dashboard"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <Button 
                onClick={handleGoToDeclined}
                variant="destructive"
                data-testid="button-view-declined"
              >
                <XCircle className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button 
                onClick={handleRetryPayment}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-retry-payment"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </>
          )}

          {(status === 'pending' || status === 'loading' || status === 'unknown') && (
            <>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoToDashboard}
                data-testid="button-dashboard"
              >
                Back to Dashboard
              </Button>
            </>
          )}

          <Button 
            variant="outline" 
            onClick={() => setLocation('/contact')}
            data-testid="button-contact-support"
          >
            Contact Support
          </Button>
        </div>

        {/* Progress Indicator for Pending Status */}
        {status === 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Your Payment</CardTitle>
              <CardDescription>
                Please don't close this page while we process your payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Payment Verification</span>
                      <span>{checkCount}/10 checks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300" 
                        style={{ width: `${Math.min((checkCount / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>✓ Payment request sent to NetCash</p>
                  <p>✓ Waiting for bank verification</p>
                  <p className="text-gray-400">
                    ○ Payment confirmation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-gray-600 mb-2">
            {status === 'pending' 
              ? "Payment taking longer than expected?" 
              : "Need help with your payment?"}
          </p>
          <Link href="/contact" className="text-primary hover:text-primary/80 font-medium">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
}