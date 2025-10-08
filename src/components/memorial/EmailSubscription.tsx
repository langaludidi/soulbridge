/**
 * Email Subscription Component
 * "Keep Me Updated" widget for memorial updates
 */

'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';

interface EmailSubscriptionProps {
  memorialId: string;
  memorialName: string;
}

export function EmailSubscription({ memorialId, memorialName }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: memorialId,
          email: email,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900">You're subscribed!</h4>
            <p className="text-sm text-green-700 mt-1">
              We'll notify you of updates to this memorial.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-delft-blue-50 flex items-center justify-center flex-shrink-0">
          <Bell className="w-6 h-6 text-delft-blue" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Keep Me Updated
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get notified about new memories, photos, and service updates for {memorialName}.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delft-blue focus:border-transparent disabled:opacity-50 text-sm"
              placeholder="your@email.com"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-delft-blue text-white rounded-lg hover:bg-delft-blue-600 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
            >
              <Bell className="w-4 h-4" />
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            You can unsubscribe at any time. We'll never share your email.
          </p>
        </div>
      </div>
    </div>
  );
}
