import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Memorial } from "@shared/schema";

// Placeholder for Avatar, AvatarImage, AvatarFallback, Calendar, and cn
// In a real scenario, these would be imported from their respective libraries.
const Avatar = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const AvatarImage = ({ src, alt }: { src?: string, alt?: string }) => <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />;
const AvatarFallback = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const Calendar = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 2v2M16 2v2M4.5 19.5 4.5 8.5 19.5 8.5 19.5 19.5 4.5 19.5z"/><path d="M4 10.5h16"/></svg>;
const cn = (...classes: (string | undefined | null)[]): string => classes.filter(Boolean).join(" ");


interface MemorialCardProps {
  memorial: Memorial;
  className?: string; // Added className to the props as it's used in the changes
}

export function MemorialCard({ memorial, className }: MemorialCardProps) {
  // Original logic for birthYear and passingYear, and defaultImage are removed as they are not present in the provided changes.
  // The changes seem to expect different data properties like 'profile_image_url', 'full_name', 'birth_date', 'death_date', 'tagline', 'created_at'.
  // Assuming these properties exist on the 'memorial' object based on the provided changes.

  return (
    <Link 
      href={`/memorial/${memorial.id}`} // Changed from 'to' to 'href' to match original Link component usage
      className={cn(
        "memorial-card block rounded-2xl border border-border bg-card card-spacing shadow-sm hover:shadow-md transition-all duration-300 focus-visible",
        className
      )}
      data-testid={`card-memorial-${memorial.id}`} // Adjusted test id to match original
    >
      <div className="relative h-64"> {/* Maintained original image container structure */}
        <img 
          src={memorial.profilePhotoUrl || "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} // Using original image URL property and fallback
          alt={`${memorial.firstName} ${memorial.lastName}`} // Using original name properties
          className="w-full h-full object-cover"
          data-testid={`img-memorial-photo-${memorial.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-serif font-semibold" data-testid={`text-memorial-name-${memorial.id}`}>
            {memorial.firstName} {memorial.lastName}
          </h3>
          <p className="text-sm opacity-90" data-testid={`text-memorial-years-${memorial.id}`}>
            {new Date(memorial.dateOfBirth).getFullYear()} - {new Date(memorial.dateOfPassing).getFullYear()} | {memorial.province}
          </p>
        </div>
      </div>
      <CardContent className="p-6"> {/* Maintained original CardContent usage and padding */}
        {memorial.memorialMessage && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-memorial-excerpt-${memorial.id}`}>
            {memorial.memorialMessage}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {memorial.privacy === "public" ? "Public" : "Private"}
            </Badge>
            <span className="text-muted-foreground text-xs" data-testid={`text-memorial-views-${memorial.id}`}>
              {memorial.viewCount || 0} views
            </span>
          </div>
          <span className="text-muted-foreground text-xs" data-testid={`text-memorial-created-${memorial.id}`}>
            {format(new Date(memorial.createdAt!), "MMM yyyy")}
          </span>
        </div>
      </CardContent>
    </Link>
  );
}