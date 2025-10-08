/**
 * MemoryWallSection Component
 * Clean memory wall with candle lighting feature
 * Professional card-based design matching reference
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageSquare, Flame, Send, Heart, Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';
import type { Memory } from '@/types/memorial';

interface MemoryWallSectionProps {
  memories: Memory[];
  memorialId: string;
  memorialName?: string;
}

export function MemoryWallSection({ memories: initialMemories, memorialId, memorialName }: MemoryWallSectionProps) {
  const [memories, setMemories] = useState(initialMemories);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedMemories, setLikedMemories] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: memorialId,
          author_name: formData.name,
          message: formData.message,
          is_public: true,
        }),
      });

      if (response.ok) {
        const newMemory = await response.json();
        setMemories([newMemory, ...memories]);
        setFormData({ name: '', message: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (memoryId: string) => {
    const isLiked = likedMemories.has(memoryId);

    try {
      const response = await fetch('/api/memories/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memory_id: memoryId, unlike: isLiked }),
      });

      if (response.ok) {
        const newLiked = new Set(likedMemories);
        if (isLiked) {
          newLiked.delete(memoryId);
          setLikeCounts({ ...likeCounts, [memoryId]: (likeCounts[memoryId] || 0) - 1 });
        } else {
          newLiked.add(memoryId);
          setLikeCounts({ ...likeCounts, [memoryId]: (likeCounts[memoryId] || 0) + 1 });
        }
        setLikedMemories(newLiked);
      }
    } catch (error) {
      console.error('Error liking memory:', error);
    }
  };

  const handleShare = async (memoryId: string, platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = `${window.location.origin}/memorial/${memorialId}#memory-${memoryId}`;
    const text = `See this memory shared for ${memorialName}`;

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setShowShareMenu(null);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          Memory Wall
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Write on the Wall
        </button>
      </div>

      {/* Add Memory Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Share a Memory
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50"
                placeholder="Share your favorite memory..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Post Memory'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories Grid */}
      {memories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No memories have been shared yet.</p>
          {memorialName && (
            <p className="text-sm text-gray-400 mt-1">
              Be the first to share a memory of {memorialName}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              id={`memory-${memory.id}`}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Attached Photo at Top */}
              {memory.photo && (
                <div className="relative w-full h-64">
                  <Image
                    src={memory.photo}
                    alt="Memory photo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Author Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {memory.authorPhoto ? (
                        <Image
                          src={memory.authorPhoto}
                          alt={memory.authorName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-delft-blue to-ash-gray text-white font-bold text-lg">
                          {memory.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {memory.authorName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(memory.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                  {memory.message}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(memory.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        likedMemories.has(memory.id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedMemories.has(memory.id) ? 'fill-current' : ''}`}
                      />
                      <span className="text-sm font-medium">
                        {likeCounts[memory.id] || 0}
                      </span>
                    </button>

                    {/* Candles */}
                    {memory.candles && memory.candles > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>
                          {memory.candles}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(showShareMenu === memory.id ? null : memory.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>

                    {/* Share Menu */}
                    {showShareMenu === memory.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => handleShare(memory.id, 'facebook')}
                          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <Facebook className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare(memory.id, 'twitter')}
                          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-sky-500" />
                          <span className="text-sm">Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare(memory.id, 'whatsapp')}
                          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">WhatsApp</span>
                        </button>
                        <button
                          onClick={() => handleShare(memory.id, 'copy')}
                          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">Copy Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
