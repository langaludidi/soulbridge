'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = searchParams?.get('plan') || 'essential';

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/sign-in?redirect_url=/checkout?plan=${plan}`);
    }
  }, [isSignedIn, isLoaded, router, plan]);

  const planDetails = getPlanDetails(plan);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2B3E50] dark:text-[#9FB89D] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] bg-clip-text text-transparent">
              SoulBridge
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Purchase
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You&apos;re one step away from creating meaningful memorials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Plan Summary
            </h3>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Plan</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {planDetails.name}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="text-gray-900 dark:text-white">
                  {planDetails.duration} months
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Memorials</span>
                <span className="text-gray-900 dark:text-white">
                  Up to {planDetails.maxMemorials}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Photos per memorial</span>
                <span className="text-gray-900 dark:text-white">
                  Up to {planDetails.maxPhotos}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-[#2B3E50] dark:text-[#9FB89D]">
                  R {planDetails.price}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                One-time payment, no subscription
              </p>
            </div>

            {/* Included Features */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                What&apos;s included:
              </h4>
              <ul className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Method
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">MC</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">BANK</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You will be redirected to Paystack to complete your payment securely using your preferred payment method.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] text-white hover:from-indigo-700 hover:to-purple-700 px-6 py-4 rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay R {planDetails.price}
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
                Secure payment powered by Paystack
              </p>
            </div>

            {/* Security Badge */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Safe & Secure Payment
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-gray-600 dark:text-gray-400 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] text-sm inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function getPlanDetails(plan: string) {
  switch (plan) {
    case 'essential':
      return {
        name: 'Essential',
        price: 150,
        duration: 6,
        maxMemorials: 3,
        maxPhotos: 30,
        features: [
          'Up to 3 memorials',
          '30 photos per memorial',
          '10 audio & video files each',
          'Classic + Modern themes',
          'Explore listing',
          'Enhanced analytics (30 days)',
          'Email support',
          '6 months hosting',
        ],
      };
    case 'premium':
      return {
        name: 'Premium',
        price: 600,
        duration: 12,
        maxMemorials: 10,
        maxPhotos: 200,
        features: [
          'Up to 10 memorials',
          '200 photos per memorial',
          '30 audio & video files each',
          'All 4 themes',
          'Explore listing',
          'Advanced analytics + PDF export',
          'Priority email support',
          '12 months hosting',
          'Renewable at R100/year',
        ],
      };
    default:
      return {
        name: 'Essential',
        price: 150,
        duration: 6,
        maxMemorials: 3,
        maxPhotos: 30,
        features: [],
      };
  }
}
