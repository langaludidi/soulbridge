/**
 * Virtual Candles Component
 * Interactive candle lighting with carousel display
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';

interface Candle {
  id: string;
  userName: string;
  message?: string;
  lightedAt: string;
}

interface VirtualCandlesProps {
  memorialId: string;
  memorialName: string;
}

export function VirtualCandles({ memorialId, memorialName }: VirtualCandlesProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLighting, setIsLighting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadCandles();
  }, [memorialId]);

  const loadCandles = async () => {
    try {
      const response = await fetch(`/api/memorial/${memorialId}/candles`);
      if (response.ok) {
        const data = await response.json();
        setCandles(data || []);
      }
    } catch (error) {
      console.error('Error loading candles:', error);
      // Set empty array on error
      setCandles([]);
    }
  };

  const handleLightCandle = async () => {
    if (!formData.name.trim()) return;

    setIsLighting(true);

    try {
      const response = await fetch('/api/candles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: memorialId,
          user_name: formData.name,
          message: formData.message,
        }),
      });

      if (response.ok) {
        const newCandle = await response.json();
        setCandles([newCandle, ...candles]);
        setFormData({ name: '', message: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error lighting candle:', error);
    } finally {
      setIsLighting(false);
    }
  };

  const nextCandle = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, candles.length));
  };

  const prevCandle = () => {
    setCurrentIndex((prev) => (prev - 1 + candles.length) % Math.max(1, candles.length));
  };

  const visibleCandles = candles.slice(currentIndex, currentIndex + 3);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Virtual Candles
          </h2>
          <p className="text-gray-600 mt-2">{candles.length} candles lit</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-delft-blue text-white rounded-lg hover:bg-delft-blue-600 transition-colors font-medium shadow-lg"
        >
          <Flame className="w-5 h-5" />
          Light a Candle
        </button>
      </div>

      {/* Light Candle Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Light a candle for {memorialName}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delft-blue focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delft-blue focus:border-transparent resize-none"
                    placeholder="Share a message..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLightCandle}
                    disabled={isLighting || !formData.name.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-delft-blue text-white rounded-lg hover:bg-delft-blue-600 transition-colors font-medium disabled:opacity-50"
                  >
                    <Flame className="w-4 h-4" />
                    {isLighting ? 'Lighting...' : 'Light Candle'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candle Carousel */}
      {candles.length > 0 ? (
        <div className="relative">
          <div className="flex items-center gap-4">
            {candles.length > 3 && (
              <button
                onClick={prevCandle}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleCandles.map((candle) => (
                <motion.div
                  key={candle.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg p-4 border border-orange-200"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Flame className="w-12 h-12 text-orange-500" />
                    </motion.div>
                    <p className="font-semibold text-gray-900 mt-3">{candle.userName}</p>
                    {candle.message && (
                      <p className="text-sm text-gray-600 text-center mt-2 line-clamp-2">
                        {candle.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(candle.lightedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {candles.length > 3 && (
              <button
                onClick={nextCandle}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p>No candles have been lit yet.</p>
          <p className="text-sm mt-1">Be the first to light a candle for {memorialName}</p>
        </div>
      )}
    </div>
  );
}
