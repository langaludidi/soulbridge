import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Home, Users, Phone } from "lucide-react";

export default function Login() {
  // Updated: 2025-09-15 13:10 - Force Vercel deployment from correct commit d3b5f32
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <Heart className="h-12 w-12 text-primary group-hover:text-primary/80 transition-colors duration-300" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">SoulBridge</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-muted/50">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your memorial dashboard and create lasting tributes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Authentication Status */}
            <div className="bg-muted/50 border border-muted rounded-lg p-4 text-center">
              <h3 className="font-semibold text-foreground mb-2">Authentication Currently Unavailable</h3>
              <p className="text-sm text-muted-foreground">
                User authentication is temporarily unavailable on this deployment. 
                You can still browse memorials and explore our features.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button asChild className="w-full" variant="default">
                <Link href="/browse">
                  <Users className="h-4 w-4 mr-2" />
                  Browse Memorials
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="ghost">
                <Link href="/contact">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>

            {/* Information */}
            <div className="text-center pt-4 border-t border-muted">
              <p className="text-xs text-muted-foreground">
                For full functionality including creating memorials and user accounts, 
                please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-x-4 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}