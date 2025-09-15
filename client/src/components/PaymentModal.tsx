import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, CreditCard, Building2, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onSuccess?: () => void;
}

type PaymentProvider = 'paystack' | 'netcash';

interface PaymentConfig {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  publicKey: string;
  metadata: {
    plan: string;
    interval: string;
    userId?: string;
    source: string;
  };
}

export function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('netcash');
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate total amount in cents (ZAR)
  const amountInCents = plan.price * 100;

  const initializePayment = async (provider: PaymentProvider) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('POST', `/api/billing/checkout-session`, {
        plan: plan.id,
        interval: plan.interval,
        provider
      });

      const data = await response.json();

      if (provider === 'paystack') {
        // Set up Paystack configuration for react-paystack
        setPaymentConfig({
          email: user.email || '',
          amount: amountInCents,
          currency: 'ZAR',
          reference: data.sessionId,
          publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_default',
          metadata: {
            plan: plan.id,
            interval: plan.interval,
            userId: user.id,
            source: 'soulbridge_modal'
          }
        });
      } else {
        // For NetCash, redirect to checkout URL
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaystackSuccess = (reference: any) => {
    toast({
      title: "Payment Successful!",
      description: `Your ${plan.name} subscription has been activated.`,
      variant: "default"
    });
    
    // Call success callback
    onSuccess?.();
    onClose();
    
    // Redirect to success page
    window.location.href = `/payment/success?reference=${reference.reference}`;
  };

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "Your payment was cancelled. You can try again anytime.",
      variant: "destructive"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Complete Your Subscription
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{plan.name} Plan</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(plan.price)}</div>
                  <div className="text-sm text-muted-foreground">per {plan.interval}</div>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Includes:</h4>
                {plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center">
                    <Shield className="w-3 h-3 mr-2 text-green-500" />
                    {feature}
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{plan.features.length - 3} more features
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Provider Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Payment Method</Label>
            <RadioGroup
              value={selectedProvider}
              onValueChange={(value: PaymentProvider) => setSelectedProvider(value)}
            >
              {/* Paystack Option */}
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="paystack" id="paystack" className="peer sr-only" />
                <Label
                  htmlFor="paystack"
                  className="flex items-center justify-between w-full cursor-pointer peer-checked:font-medium"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Card Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Instant</Badge>
                    <div className="text-xs text-muted-foreground">Paystack</div>
                  </div>
                </Label>
              </div>

              {/* NetCash Option */}
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="netcash" id="netcash" className="peer sr-only" />
                <Label
                  htmlFor="netcash"
                  className="flex items-center justify-between w-full cursor-pointer peer-checked:font-medium"
                >
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">1-3 days</Badge>
                    <div className="text-xs text-muted-foreground">NetCash</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            {selectedProvider === 'paystack' && paymentConfig ? (
              <PaystackButton
                {...paymentConfig}
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                className="w-full"
                text={
                  isLoading ? (
                    <Button disabled className="w-full" size="lg">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatPrice(plan.price)} with Card
                    </Button>
                  )
                }
              />
            ) : (
              <Button
                onClick={() => initializePayment(selectedProvider)}
                disabled={isLoading || !user}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    {selectedProvider === 'paystack' ? (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Initialize Card Payment
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Pay {formatPrice(plan.price)} via Bank
                      </>
                    )}
                  </>
                )}
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={onClose} 
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <Shield className="w-4 h-4 inline mr-1" />
            Your payment is secured by SSL encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;