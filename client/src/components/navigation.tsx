import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import soulbridgeLogo from "@assets/SoulBridge Logo Sep 25_1757519878176.png";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                <img 
                  src={soulbridgeLogo} 
                  alt="SoulBridge - Honouring Every Life. Connecting Every Soul" 
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" data-testid="link-nav-home">
                <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  location === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                  Home
                </span>
              </Link>
              <Link href="/browse" data-testid="link-nav-browse">
                <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  location === "/browse" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                  Browse Memorials
                </span>
              </Link>
              <Link href="/partners" data-testid="link-nav-partners">
                <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  location === "/partners" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                  Partners
                </span>
              </Link>
              <Link href="/about" data-testid="link-nav-about">
                <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  location === "/about" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                  About
                </span>
              </Link>
              {isAuthenticated && (
                <Link href="/create" data-testid="link-nav-create">
                  <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    location === "/create" ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}>
                    Create Memorial
                  </span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-user-profile"
                  />
                )}
                <span className="text-sm text-muted-foreground hidden lg:block" data-testid="text-user-name">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-7 h-7 rounded-full object-cover"
                    data-testid="img-user-profile-mobile"
                  />
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 h-9 w-9"
                  data-testid="button-mobile-menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  size="sm"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login-mobile"
                  className="text-sm px-4 h-9"
                >
                  Sign In
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 h-9 w-9"
                  data-testid="button-mobile-menu-guest"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-3 pt-3 pb-4 space-y-2">
              <Link href="/" data-testid="link-nav-home-mobile">
                <span 
                  className={`block px-4 py-3 text-base font-medium transition-colors cursor-pointer rounded-lg ${
                    location === "/" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </span>
              </Link>
              <Link href="/browse" data-testid="link-nav-browse-mobile">
                <span 
                  className={`block px-4 py-3 text-base font-medium transition-colors cursor-pointer rounded-lg ${
                    location === "/browse" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Memorials
                </span>
              </Link>
              <Link href="/partners" data-testid="link-nav-partners-mobile">
                <span 
                  className={`block px-4 py-3 text-base font-medium transition-colors cursor-pointer rounded-lg ${
                    location === "/partners" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Partners
                </span>
              </Link>
              <Link href="/about" data-testid="link-nav-about-mobile">
                <span 
                  className={`block px-4 py-3 text-base font-medium transition-colors cursor-pointer rounded-lg ${
                    location === "/about" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </span>
              </Link>
              {isAuthenticated && (
                <Link href="/create" data-testid="link-nav-create-mobile">
                  <span 
                    className={`block px-4 py-3 text-base font-medium transition-colors cursor-pointer rounded-lg ${
                      location === "/create" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Memorial
                  </span>
                </Link>
              )}
              {isAuthenticated && (
                <div className="border-t border-border pt-3 mt-3">
                  <div className="px-4 py-2 mb-3">
                    <span className="text-sm text-muted-foreground" data-testid="text-user-name-mobile">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.href = "/api/logout"}
                    data-testid="button-logout-mobile"
                    className="ml-4 mb-2 h-9"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
