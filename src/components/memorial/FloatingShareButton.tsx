/**
 * FloatingShareButton Component
 * Floating share button on the right side of the screen
 * Sticky behavior with dropdown share menu
 */

'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, Mail, X, MessageCircle } from 'lucide-react';

interface FloatingShareButtonProps {
  memorialName: string;
  birthDate: string;
  deathDate: string;
}

export function FloatingShareButton({ memorialName, birthDate, deathDate }: FloatingShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'email' | 'copy') => {
    const url = window.location.href;
    const title = `In Memory of ${memorialName}`;
    const text = `${memorialName}\n${formatDate(birthDate)} - ${formatDate(deathDate)}`;

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          // You could add a toast notification here
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      {/* Share Menu - appears on left when open */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in slide-in-from-right">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Share Memorial</p>
            </div>

            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="text-sm font-medium text-gray-700">Twitter</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('email')}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Email</span>
            </button>

            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <LinkIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Copy Link</span>
            </button>
          </div>
        </>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group"
        aria-label={isOpen ? "Close share menu" : "Share memorial"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Share2 className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
        )}
      </button>
    </div>
  );
}
