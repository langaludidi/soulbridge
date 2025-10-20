'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderOfServiceReviewPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');
  const [memorial, setMemorial] = useState<any>(null);
  const [oos, setOos] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [approverName, setApproverName] = useState('');

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      setToken(p.token);
      fetchData(p.id, p.token);
    });
  }, [params]);

  const fetchData = async (memorialId: string, reviewToken: string) => {
    try {
      // Fetch memorial
      const memorialRes = await fetch(`/api/memorials/${memorialId}`);
      const memorialData = await memorialRes.json();

      if (memorialRes.ok) {
        setMemorial(memorialData.data);
      } else {
        throw new Error('Memorial not found');
      }

      // Fetch order of service
      const oosRes = await fetch(`/api/order-of-service?memorial_id=${memorialId}`);
      const oosData = await oosRes.json();

      if (oosRes.ok && oosData.data) {
        // Verify token matches
        if (oosData.data.review_token !== reviewToken) {
          throw new Error('Invalid review link');
        }

        // Check if expired
        const expiresAt = new Date(oosData.data.review_expires_at);
        const now = new Date();

        if (now > expiresAt) {
          throw new Error('This review link has expired');
        }

        setOos(oosData.data);
        setItems(oosData.data.items || []);
      } else {
        throw new Error('Order of service not found');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approverName.trim()) {
      alert('Please enter your name');
      return;
    }

    setApproving(true);

    try {
      const response = await fetch('/api/order-of-service/review-link', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          approved_by: approverName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve');
      }

      setOos(data.data);
      alert('Thank you! The order of service has been approved.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error</h2>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Order of Service Review
          </h1>
          {memorial && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              For: {memorial.full_name}
            </p>
          )}
        </div>

        {/* Approval Status */}
        {oos?.review_approved ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              ✓ Approved
            </h3>
            <p className="text-green-800 dark:text-green-200">
              This order of service was approved by {oos.review_approved_by} on{' '}
              {new Date(oos.review_approved_at).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Review Needed
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Please review the order of service below and approve it if everything looks correct.
            </p>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-2 border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleApprove}
                disabled={approving}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {approving ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        )}

        {/* Order of Service Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Service Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Cover Title:</span>
              <p className="text-gray-900 dark:text-white">{oos.cover_title}</p>
            </div>
            {oos.officiant && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Officiant:</span>
                <p className="text-gray-900 dark:text-white">{oos.officiant}</p>
              </div>
            )}
            {oos.venue && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Venue:</span>
                <p className="text-gray-900 dark:text-white">{oos.venue}</p>
              </div>
            )}
            {oos.service_date && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                <p className="text-gray-900 dark:text-white">
                  {new Date(oos.service_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {oos.service_time && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                <p className="text-gray-900 dark:text-white">{oos.service_time}</p>
              </div>
            )}
          </div>
        </div>

        {/* Program Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Program
          </h2>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {index + 1}. {item.title}
                  </div>
                  {item.speaker_performer && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.speaker_performer}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                      {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No program items yet</p>
          )}
        </div>

        {/* Pallbearers */}
        {oos.pallbearers && oos.pallbearers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Pallbearers
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {oos.pallbearers.map((name: string, index: number) => (
                <li key={index} className="text-gray-900 dark:text-white">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Link to Preview */}
        {oos && (
          <div className="mt-8 text-center">
            <Link
              href={`/memorials/${id}/order-of-service/preview`}
              className="inline-flex items-center px-6 py-3 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Full Preview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
