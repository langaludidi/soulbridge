import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import soulbridgeIcon from "@assets/SoulBridge-Favicon_1757600710068.png";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={soulbridgeIcon} 
                alt="SoulBridge" 
                className="w-8 h-8"
              />
              <h3 className="text-lg font-serif font-semibold text-foreground">SoulBridge</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Honouring Every Life. Connecting Every Soul. 
              A digital space to remember, honour, and celebrate loved ones with family and friends.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
            <nav className="space-y-3">
              <Link href="/browse" data-testid="link-footer-browse">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Browse Memorials
                </span>
              </Link>
              <Link href="/partners" data-testid="link-footer-partners">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Partner Program
                </span>
              </Link>
              <Link href="/about" data-testid="link-footer-about">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  About Us
                </span>
              </Link>
              <Link href="/faq" data-testid="link-footer-faq">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  FAQ
                </span>
              </Link>
              <Link href="/writing-guide" data-testid="link-footer-writing-guide">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Memorial Writing Guide
                </span>
              </Link>
            </nav>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal & Support</h4>
            <nav className="space-y-3">
              <Link href="/terms" data-testid="link-footer-terms">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Terms of Service
                </span>
              </Link>
              <Link href="/privacy" data-testid="link-footer-privacy">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/contact" data-testid="link-footer-contact">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Contact Support
                </span>
              </Link>
              <Link href="/packages" data-testid="link-footer-packages">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Subscription Plans
                </span>
              </Link>
              <Link href="/pricing" data-testid="link-footer-pricing">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">
                  Pricing
                </span>
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground" data-testid="text-footer-phone">
                  041 019 5019
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground" data-testid="text-footer-email">
                  support@soulbridge.co.za
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>SoulBridge (Pty) Ltd</p>
                  <p>14a Pickering Street</p>
                  <p>Newton Park, Port Elizabeth</p>
                  <p>South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Soulbridge. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-muted-foreground">
                Built with compassion and care
              </span>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="text-xs text-muted-foreground">Made in South Africa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}