'use client';

import { useState } from 'react';

interface ShareSheetProps {
  memorialUrl: string;
  memorialName: string;
  memorialId: string;
}

export default function ShareSheet({ memorialUrl, memorialName, memorialId }: ShareSheetProps) {
  const [showShare, setShowShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareText = `In loving memory of ${memorialName}`;
  const squareImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://soulbridge.co.za'}/api/og/memorial/${memorialId}/square`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#1fb855]',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${memorialUrl}`)}`,
          '_blank'
        );
        trackShare('whatsapp');
      },
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-[#1877F2] hover:bg-[#0c63d4]',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`,
          '_blank'
        );
        trackShare('facebook');
      },
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-black hover:bg-gray-800',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(memorialUrl)}`,
          '_blank'
        );
        trackShare('twitter');
      },
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${memorialUrl}`)}`;
        trackShare('email');
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      trackShare('copy_link');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadSquareImage = async () => {
    try {
      const response = await fetch(squareImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${memorialName.replace(/\s+/g, '-').toLowerCase()}-memorial.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      trackShare('download_image');
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const trackShare = async (platform: string) => {
    try {
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorial_id: memorialId,
          platform,
        }),
      });
    } catch (err) {
      console.error('Failed to track share:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: memorialUrl,
        });
        trackShare('native_share');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setShowShare(!showShare);
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Memorial
      </button>

      {/* Share Sheet Modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowShare(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Share Memorial
              </h3>
              <button
                onClick={() => setShowShare(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Social Share Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors ${option.color}`}
                  >
                    {option.icon}
                    <span className="font-medium">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy Link Button */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Copy Link</span>
                  </>
                )}
              </button>

              {/* Download Square Image Button */}
              <button
                onClick={downloadSquareImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9FB89D] text-white rounded-lg hover:bg-[#84a182] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="font-medium">Download for Instagram/TikTok</span>
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Square image (1080×1080) for Instagram stories, posts, and TikTok
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
