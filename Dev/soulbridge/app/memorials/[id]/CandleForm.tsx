'use client';

import { useState } from 'react';

interface CandleFormProps {
  memorialId: string;
  onSuccess?: () => void;
}

export default function CandleForm({ memorialId, onSuccess }: CandleFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    lit_by_name: '',
    message: '',
    candle_type: 'white',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: memorialId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to light candle');
      }

      setSuccess(true);
      setFormData({
        lit_by_name: '',
        message: '',
        candle_type: 'white',
      });

      // Refresh the page to show the new candle and update counts
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Collapsed state - compact button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 rounded-lg p-6 transition-all duration-200 group"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Light a Virtual Candle
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Light a candle in loving memory
            </p>
          </div>
        </div>
      </button>
    );
  }

  // Expanded state - full form
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Light a Virtual Candle
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <p className="text-green-800 dark:text-green-200">
            Your candle has been lit and will burn for 7 days.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            name="lit_by_name"
            required
            value={formData.lit_by_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Candle Type
          </label>
          <select
            name="candle_type"
            value={formData.candle_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent"
          >
            <option value="white">🕯️ White Candle</option>
            <option value="red">🔴 Red Candle</option>
            <option value="blue">🔵 Blue Candle</option>
            <option value="yellow">🟡 Yellow Candle</option>
            <option value="purple">🟣 Purple Candle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message (Optional)
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Add a personal message..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Lighting...' : 'Light Candle'}
          </button>
        </div>
      </form>
    </div>
  );
}
