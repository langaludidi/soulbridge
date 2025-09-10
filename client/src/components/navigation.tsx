import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import soulbridgeLogo from "@assets/SoulBridge Logo Sep 25_1757519878176.png";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src={soulbridgeLogo} 
                  alt="SoulBridge - Honouring Every Life. Connecting Every Soul" 
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>
          
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
          
          <div className="flex items-center space-x-4">
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
                <span className="text-sm text-muted-foreground" data-testid="text-user-name">
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
        </div>
      </div>
    </nav>
  );
}
