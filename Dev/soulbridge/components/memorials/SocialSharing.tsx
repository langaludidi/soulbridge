'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react';

interface SocialSharingProps {
  memorialId: string;
  deceasedName: string;
  years?: string;
  variant?: 'dropdown' | 'inline';
}

export function SocialSharing({
  memorialId,
  deceasedName,
  years,
  variant = 'dropdown',
}: SocialSharingProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const memorialUrl = `https://soulbridge.co.za/memorials/${memorialId}`;
  const shareTitle = `In Loving Memory of ${deceasedName}${years ? ` (${years})` : ''}`;
  const shareText = `Visit ${deceasedName}'s memorial to light a candle and share your memories.`;

  const handleShare = async (platform: string) => {
    // Track the share
    try {
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorialId, platform }),
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }

    // Close dropdown after share
    setShowDropdown(false);
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    handleShare('facebook');
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(memorialUrl)}&text=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=600,height=400'
    );
    handleShare('twitter');
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(memorialUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    handleShare('linkedin');
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${memorialUrl}`)}`,
      '_blank'
    );
    handleShare('whatsapp');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${memorialUrl}`)}`;
    handleShare('email');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      handleShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: memorialUrl,
        });
        handleShare('native_share');
      } catch (error) {
        // User cancelled share or error occurred
        console.error('Native share failed:', error);
      }
    }
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareOnFacebook}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#0C63D4] transition-colors text-sm font-medium"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </button>

        <button
          onClick={shareOnTwitter}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#0C8BD9] transition-colors text-sm font-medium"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </button>

        <button
          onClick={shareOnWhatsApp}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors text-sm font-medium"
          aria-label="Share on WhatsApp"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>

        <button
          onClick={shareOnLinkedIn}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors text-sm font-medium"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </button>

        <button
          onClick={shareViaEmail}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm font-medium"
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </button>

        <button
          onClick={copyLink}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#2B3E50] text-white hover:bg-[#243342] transition-colors text-sm font-medium"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </button>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative">
      <button
        onClick={() => {
          if (navigator.share) {
            nativeShare();
          } else {
            setShowDropdown(!showDropdown);
          }
        }}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-[#2B3E50] text-white hover:bg-[#243342] transition-colors text-sm font-medium"
        aria-label="Share memorial"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
            <button
              onClick={shareOnFacebook}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Facebook className="w-5 h-5 mr-3 text-[#1877F2]" />
              Share on Facebook
            </button>

            <button
              onClick={shareOnTwitter}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Twitter className="w-5 h-5 mr-3 text-[#1DA1F2]" />
              Share on Twitter
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Share on WhatsApp
            </button>

            <button
              onClick={shareOnLinkedIn}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Linkedin className="w-5 h-5 mr-3 text-[#0A66C2]" />
              Share on LinkedIn
            </button>

            <hr className="my-2 border-gray-200 dark:border-gray-700" />

            <button
              onClick={shareViaEmail}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
              Share via Email
            </button>

            <button
              onClick={copyLink}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-3 text-green-500" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
