import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, ArrowLeft, CreditCard, RefreshCw, HelpCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentDeclined() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [reference, setReference] = useState<string>("");
  const [errorReason, setErrorReason] = useState<string>("");

  useEffect(() => {
    // Get reference and error details from URL params
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || '';
    const error = params.get('error') || '';
    const reason = params.get('reason') || '';
    
    setReference(ref);
    setErrorReason(reason || error || 'Payment was declined by your bank or card provider');
  }, []);

  // Get failed transaction details if reference is available
  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['/api/billing/transaction', reference],
    enabled: !!reference,
  });

  const handleRetryPayment = () => {
    setLocation('/pricing');
  };

  const handleGoToDashboard = () => {
    setLocation('/dashboard');
  };

  const handleContactSupport = () => {
    setLocation('/contact');
  };

  const getErrorSuggestion = (reason: string) => {
    const lowerReason = reason.toLowerCase();
    
    if (lowerReason.includes('insufficient')) {
      return "Please check that you have sufficient funds in your account and try again.";
    }
    if (lowerReason.includes('expired') || lowerReason.includes('card')) {
      return "Please check that your card details are correct and that your card hasn't expired.";
    }
    if (lowerReason.includes('declined') || lowerReason.includes('bank')) {
      return "Your bank may have declined this transaction. Please contact your bank or try a different payment method.";
    }
    if (lowerReason.includes('network') || lowerReason.includes('timeout')) {
      return "There was a network issue. Please try your payment again.";
    }
    
    return "Please check your payment details and try again. If the problem persists, contact your bank.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl text-primary">
              Soulbridge
            </Link>
            <Button variant="outline" onClick={handleGoToDashboard}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Declined
          </h1>
          <p className="text-lg text-gray-600">
            We were unable to process your payment. Don't worry, we can help you resolve this.
          </p>
        </div>

        {/* Error Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Payment failed:</strong> {errorReason}
            <br />
            <span className="text-sm mt-1 block">
              {getErrorSuggestion(errorReason)}
            </span>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Transaction Details */}
          <Card data-testid="card-transaction-details">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
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
                    <Badge variant="destructive">
                      Failed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold" data-testid="text-amount">
                      {(transactionData as any)?.amount ? `R${(transactionData as any).amount}` : 'N/A'}
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

          {/* Troubleshooting */}
          <Card data-testid="card-troubleshooting">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Common Solutions
              </CardTitle>
              <CardDescription>
                Try these steps to resolve payment issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Check card details:</strong> Ensure your card number, expiry date, and CVV are correct
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Sufficient funds:</strong> Make sure you have enough balance for the transaction
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Bank authorization:</strong> Contact your bank if payments are being blocked
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Try different card:</strong> Use another card or payment method
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={handleRetryPayment}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-retry-payment"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Payment Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleContactSupport}
            data-testid="button-contact-support"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoToDashboard}
            data-testid="button-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Alternative Options */}
        <Card>
          <CardHeader>
            <CardTitle>Still Having Issues?</CardTitle>
            <CardDescription>
              We're here to help you get your subscription activated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Payment Methods</h4>
                <p className="text-sm text-gray-600 mb-3">
                  We accept all major credit and debit cards. You can also try:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visa and Mastercard</li>
                  <li>• Bank-issued debit cards</li>
                  <li>• Alternative payment providers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our support team can assist with payment issues:
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleContactSupport}
                    className="w-full justify-start"
                  >
                    Email Support
                  </Button>
                  <Link 
                    href="/faq" 
                    className="text-primary hover:text-primary/80 text-sm block"
                  >
                    View Payment FAQ
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notice */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500">
            No charges were made to your account. You can try again at any time.
          </p>
        </div>
      </div>
    </div>
  );
}