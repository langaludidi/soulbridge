import type { Memorial } from "@shared/schema";

// Sharing utilities for different platforms

export interface ShareData {
  memorial: Memorial;
  currentUrl: string;
  message?: string;
}

export const sharingUtils = {
  // Generate a share message for the memorial
  generateShareMessage: (memorial: Memorial): string => {
    const name = `${memorial.firstName} ${memorial.lastName}`;
    const birthYear = new Date(memorial.dateOfBirth).getFullYear();
    const passingYear = new Date(memorial.dateOfPassing).getFullYear();
    
    return `Remember ${name} (${birthYear} - ${passingYear}) on SoulBridge. Honor their memory and share precious moments with family and friends.`;
  },

  // Share on Facebook
  shareOnFacebook: (shareData: ShareData): void => {
    const message = shareData.message || sharingUtils.generateShareMessage(shareData.memorial);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.currentUrl)}&quote=${encodeURIComponent(message)}`;
    
    window.open(url, 'facebook-share', 'width=626,height=436,toolbar=0,status=0');
  },

  // Share on WhatsApp
  shareOnWhatsApp: (shareData: ShareData): void => {
    const message = shareData.message || sharingUtils.generateShareMessage(shareData.memorial);
    const fullMessage = `${message}\n\n${shareData.currentUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    
    window.open(url, '_blank');
  },

  // Copy link to clipboard
  copyLink: async (shareData: ShareData): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(shareData.currentUrl);
      return true;
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        console.error('Failed to copy link:', fallbackErr);
        return false;
      }
    }
  },

  // Share via email
  shareViaEmail: (shareData: ShareData): void => {
    const name = `${shareData.memorial.firstName} ${shareData.memorial.lastName}`;
    const subject = `Memorial for ${name} - SoulBridge`;
    const message = shareData.message || sharingUtils.generateShareMessage(shareData.memorial);
    const body = `${message}\n\nVisit the memorial: ${shareData.currentUrl}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  },

  // Generate invitation message
  generateInvitationMessage: (memorial: Memorial, inviterName?: string): string => {
    const name = `${memorial.firstName} ${memorial.lastName}`;
    const inviter = inviterName ? ` ${inviterName}` : "";
    
    return `You're invited${inviter ? ` by${inviter}` : ""} to visit ${name}'s memorial on SoulBridge. Share your memories, view photos, and leave a tribute to honor their life.`;
  },

  // Create invitation data for different platforms
  createInvitationData: (memorial: Memorial, inviterName?: string, customMessage?: string): ShareData => {
    const message = customMessage || sharingUtils.generateInvitationMessage(memorial, inviterName);
    return {
      memorial,
      currentUrl: `${window.location.origin}/memorial/${memorial.id}`,
      message
    };
  }
};

// Social platform configurations
export const socialPlatforms = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    shareFunction: sharingUtils.shareOnFacebook
  },
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    shareFunction: sharingUtils.shareOnWhatsApp
  },
  email: {
    name: 'Email',
    color: '#EA4335',
    shareFunction: sharingUtils.shareViaEmail
  }
} as const;

export type SocialPlatform = keyof typeof socialPlatforms;