import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Heart, Quote } from "lucide-react";
import { format } from "date-fns";
import type { DigitalOrderOfService } from "@shared/schema";

interface OrderOfServiceCoverProps {
  orderOfService: DigitalOrderOfService;
  memorial: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateOfPassing: string;
    profilePhotoUrl?: string;
    memorialMessage?: string;
  };
  theme?: 'classic' | 'modern' | 'elegant';
  className?: string;
}

export function OrderOfServiceCover({
  orderOfService,
  memorial,
  theme = 'classic',
  className
}: OrderOfServiceCoverProps) {
  const themeClasses = {
    classic: {
      container: "bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-slate-700 dark:text-slate-300",
        muted: "text-slate-500 dark:text-slate-400"
      },
      accent: "text-slate-800 dark:text-slate-200"
    },
    modern: {
      container: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-blue-800 dark:text-blue-200",
        muted: "text-blue-600 dark:text-blue-300"
      },
      accent: "text-indigo-700 dark:text-indigo-300"
    },
    elegant: {
      container: "bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-amber-800 dark:text-amber-200", 
        muted: "text-amber-700 dark:text-amber-300"
      },
      accent: "text-orange-700 dark:text-orange-300"
    }
  };

  const currentTheme = themeClasses[theme];
  const fullName = `${memorial.firstName} ${memorial.lastName}`;
  const birthYear = new Date(memorial.dateOfBirth).getFullYear();
  const passingYear = new Date(memorial.dateOfPassing).getFullYear();
  const lifeSpan = `${birthYear} - ${passingYear}`;

  return (
    <Card 
      className={`${currentTheme.container} p-8 md:p-12 text-center space-y-8 shadow-lg border-2 ${className}`}
      data-testid="order-of-service-cover"
    >
      {/* Header with spiritual element */}
      <div className="space-y-2">
        <div className="flex justify-center mb-4">
          <Heart className={`h-8 w-8 ${currentTheme.accent} opacity-60`} />
        </div>
        <h1 className={`text-2xl md:text-3xl font-serif ${currentTheme.text.primary} font-semibold`}>
          {orderOfService.title}
        </h1>
        <p className={`text-sm ${currentTheme.text.muted} font-medium tracking-wide uppercase`}>
          In Loving Memory
        </p>
      </div>

      <Separator className="opacity-30" />

      {/* Memorial Photo */}
      <div className="flex justify-center" data-testid="memorial-photo-section">
        <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/50 shadow-lg">
          <AvatarImage 
            src={orderOfService.coverPhotoUrl || memorial.profilePhotoUrl} 
            alt={`Photo of ${fullName}`}
            className="object-cover"
          />
          <AvatarFallback className={`text-3xl md:text-4xl font-serif ${currentTheme.text.secondary} bg-white/80`}>
            {memorial.firstName[0]}{memorial.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name and Life Years */}
      <div className="space-y-3" data-testid="memorial-details">
        <h2 className={`text-3xl md:text-4xl font-serif ${currentTheme.text.primary} font-bold`}>
          {fullName}
        </h2>
        <p className={`text-xl md:text-2xl ${currentTheme.text.secondary} font-light tracking-wide`}>
          {lifeSpan}
        </p>
      </div>

      {/* Tribute Quote */}
      {orderOfService.tributeQuote && (
        <div className="space-y-4 max-w-md mx-auto" data-testid="tribute-quote">
          <Quote className={`h-6 w-6 mx-auto ${currentTheme.text.muted} opacity-60`} />
          <blockquote className={`text-base md:text-lg ${currentTheme.text.secondary} font-light italic leading-relaxed`}>
            "{orderOfService.tributeQuote}"
          </blockquote>
        </div>
      )}

      <Separator className="opacity-30" />

      {/* Service Details */}
      <div className="space-y-6" data-testid="service-details">
        <h3 className={`text-lg md:text-xl ${currentTheme.text.primary} font-semibold`}>
          Celebration of Life Service
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Date */}
          {orderOfService.serviceDate && (
            <div className="flex items-center justify-center space-x-2">
              <Calendar className={`h-4 w-4 ${currentTheme.text.muted}`} />
              <span className={`text-sm md:text-base ${currentTheme.text.secondary}`}>
                {format(new Date(orderOfService.serviceDate), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          )}

          {/* Time */}
          {orderOfService.serviceTime && (
            <div className="flex items-center justify-center space-x-2">
              <Clock className={`h-4 w-4 ${currentTheme.text.muted}`} />
              <span className={`text-sm md:text-base ${currentTheme.text.secondary}`}>
                {orderOfService.serviceTime}
              </span>
            </div>
          )}
        </div>

        {/* Venue */}
        {orderOfService.venue && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <MapPin className={`h-4 w-4 ${currentTheme.text.muted}`} />
            <span className={`text-sm md:text-base ${currentTheme.text.secondary} text-center max-w-xs`}>
              {orderOfService.venue}
            </span>
          </div>
        )}

        {/* Officiant */}
        {orderOfService.officiant && (
          <div className={`text-sm ${currentTheme.text.muted} mt-4`}>
            Officiated by {orderOfService.officiant}
          </div>
        )}
      </div>

      {/* Footer decorative element */}
      <div className="pt-6">
        <div className="flex justify-center space-x-2 opacity-60">
          <div className={`w-2 h-2 rounded-full ${currentTheme.accent}`} />
          <div className={`w-2 h-2 rounded-full ${currentTheme.accent}`} />
          <div className={`w-2 h-2 rounded-full ${currentTheme.accent}`} />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center pt-4">
        <Badge 
          variant={orderOfService.status === 'published' ? 'default' : 'secondary'}
          className="text-xs"
          data-testid={`status-badge-${orderOfService.status}`}
        >
          {orderOfService.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      </div>
    </Card>
  );
}