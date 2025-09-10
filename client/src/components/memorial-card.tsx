import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Memorial } from "@shared/schema";

interface MemorialCardProps {
  memorial: Memorial;
}

export function MemorialCard({ memorial }: MemorialCardProps) {
  const birthYear = new Date(memorial.dateOfBirth).getFullYear();
  const passingYear = new Date(memorial.dateOfPassing).getFullYear();
  
  // Fallback image for memorials without profile photos
  const defaultImage = "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600";

  return (
    <Link href={`/memorial/${memorial.id}`}>
      <Card className="memorial-card cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300" data-testid={`card-memorial-${memorial.id}`}>
        <div className="relative h-64">
          <img 
            src={memorial.profilePhotoUrl || defaultImage} 
            alt={`${memorial.firstName} ${memorial.lastName}`}
            className="w-full h-full object-cover"
            data-testid={`img-memorial-photo-${memorial.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-serif font-semibold" data-testid={`text-memorial-name-${memorial.id}`}>
              {memorial.firstName} {memorial.lastName}
            </h3>
            <p className="text-sm opacity-90" data-testid={`text-memorial-years-${memorial.id}`}>
              {birthYear} - {passingYear} | {memorial.province}
            </p>
          </div>
        </div>
        <CardContent className="p-6">
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
      </Card>
    </Link>
  );
}
