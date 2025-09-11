import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import type { Partner, PartnerDomain } from "@shared/schema";

// Extended Request interface to include brand context
export interface BrandedRequest extends Request {
  brandContext?: {
    partner: Partner | null;
    mode: 'none' | 'cobrand' | 'whitelabel';
    domain?: PartnerDomain;
    branding?: {
      logoUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
      displayName?: string;
    };
  };
}

/**
 * Middleware to resolve branding context based on domain or query parameters
 * This middleware attaches branding information to the request for partner-branded experiences
 */
export async function resolveBrandingContext(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Initialize default context
    req.brandContext = {
      partner: null,
      mode: 'none',
    };

    // First, try to resolve by Host header (for white-label/co-brand domains)
    const hostHeader = req.get('Host');
    if (hostHeader) {
      // Clean the host header to prevent header injection attacks
      const cleanHost = hostHeader.toLowerCase().trim();
      
      // Validate host format to prevent malicious input
      if (/^[a-z0-9.-]+$/i.test(cleanHost) && cleanHost.length <= 253) {
        try {
          const partnerDomain = await storage.getPartnerDomainByDomain(cleanHost);
          if (partnerDomain && partnerDomain.isActive) {
            const partner = await storage.getPartner(partnerDomain.partnerId);
            if (partner && partner.status === 'published') {
              req.brandContext = {
                partner,
                mode: partner.partnershipModel === 'whitelabel' ? 'whitelabel' : 'cobrand',
                domain: partnerDomain,
                branding: partner.brandingConfig as any || {},
              };
              
              // For white-label, completely override branding
              if (req.brandContext.mode === 'whitelabel') {
                req.brandContext.branding = {
                  ...req.brandContext.branding,
                  displayName: partner.name, // Use partner name for white-label
                };
              }
              
              return next();
            }
          }
        } catch (error) {
          console.warn('Error resolving partner domain:', error);
          // Continue with fallback resolution
        }
      }
    }

    // Fallback: Try to resolve by query parameter ?partner={id|slug}
    const partnerParam = req.query.partner as string;
    if (partnerParam && typeof partnerParam === 'string') {
      // Sanitize partner parameter
      const cleanPartnerId = partnerParam.trim();
      
      // Try to find partner by ID first, then by slug/name
      try {
        let partner: Partner | null = null;
        
        // Try by ID (UUID format)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanPartnerId)) {
          partner = await storage.getPartner(cleanPartnerId) || null;
        } else {
          // Try by slug/name (for user-friendly URLs)
          partner = await storage.getPartnerBySlug(cleanPartnerId) || null;
        }
        
        if (partner && partner.status === 'published') {
          req.brandContext = {
            partner,
            mode: 'cobrand', // Query parameter approach is always co-brand mode
            branding: partner.brandingConfig as any || {},
          };
        }
      } catch (error) {
        console.warn('Error resolving partner by query parameter:', error);
        // Continue with default context
      }
    }

    next();
  } catch (error) {
    console.error('Branding middleware error:', error);
    // On error, continue with default context (no branding)
    req.brandContext = {
      partner: null,
      mode: 'none',
    };
    next();
  }
}

/**
 * Helper function to get branding data for API responses
 */
export function getBrandingResponse(brandContext: BrandedRequest['brandContext']) {
  if (!brandContext || !brandContext.partner) {
    return {
      mode: 'none' as const,
      branding: {
        logoUrl: null,
        primaryColor: '#000000',
        secondaryColor: '#666666',
        fontFamily: 'Inter',
        displayName: 'SoulBridge',
      },
    };
  }

  const { partner, mode, branding = {} } = brandContext;
  
  return {
    mode,
    partnerId: partner.id,
    partnerName: partner.name,
    branding: {
      logoUrl: branding.logoUrl || partner.logoUrl || null,
      primaryColor: branding.primaryColor || '#000000',
      secondaryColor: branding.secondaryColor || '#666666',
      fontFamily: branding.fontFamily || 'Inter',
      displayName: mode === 'whitelabel' 
        ? (branding.displayName || partner.name)
        : 'SoulBridge',
    },
  };
}

/**
 * Utility function to check if current context is partner-branded
 */
export function isPartnerBranded(brandContext: BrandedRequest['brandContext']): boolean {
  return !!(brandContext?.partner && brandContext.mode !== 'none');
}

/**
 * Utility function to get partner ID from brand context (for memorial association)
 */
export function getPartnerIdFromContext(brandContext: BrandedRequest['brandContext']): string | null {
  return brandContext?.partner?.id || null;
}