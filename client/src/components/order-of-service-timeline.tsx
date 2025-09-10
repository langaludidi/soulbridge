import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Music, Book, Heart, Users, Star, Edit3, Trash2, GripVertical } from "lucide-react";
import type { OrderOfServiceEvent } from "@shared/schema";

interface OrderOfServiceTimelineProps {
  events: OrderOfServiceEvent[];
  theme?: 'classic' | 'modern' | 'elegant';
  isEditable?: boolean;
  onEditEvent?: (event: OrderOfServiceEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  onReorderEvents?: (eventIds: string[]) => void;
  className?: string;
}

const eventTypeIcons = {
  'opening_prayer': Book,
  'hymn': Music,
  'reading': Book,
  'eulogy': Heart,
  'reflection': Star,
  'music': Music,
  'tribute': Heart,
  'closing_prayer': Book,
  'other': Users
};

const eventTypeLabels = {
  'opening_prayer': 'Opening Prayer',
  'hymn': 'Hymn',
  'reading': 'Scripture Reading',
  'eulogy': 'Eulogy',
  'reflection': 'Reflection',
  'music': 'Musical Selection',
  'tribute': 'Tribute',
  'closing_prayer': 'Closing Prayer',
  'other': 'Other'
};

export function OrderOfServiceTimeline({
  events,
  theme = 'classic',
  isEditable = false,
  onEditEvent,
  onDeleteEvent,
  onReorderEvents,
  className
}: OrderOfServiceTimelineProps) {
  const themeClasses = {
    classic: {
      container: "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700",
      eventCard: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600",
      timeline: "bg-slate-300 dark:bg-slate-600",
      timelineNode: "bg-slate-500 dark:bg-slate-400 border-white dark:border-slate-800",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-slate-700 dark:text-slate-300",
        muted: "text-slate-500 dark:text-slate-400"
      }
    },
    modern: {
      container: "bg-blue-50/30 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      eventCard: "bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
      timeline: "bg-blue-200 dark:bg-blue-700",
      timelineNode: "bg-blue-500 dark:bg-blue-400 border-white dark:border-blue-900",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-blue-800 dark:text-blue-200",
        muted: "text-blue-600 dark:text-blue-400"
      }
    },
    elegant: {
      container: "bg-amber-50/30 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      eventCard: "bg-white dark:bg-amber-900/10 border-amber-200 dark:border-amber-700",
      timeline: "bg-amber-200 dark:bg-amber-700",
      timelineNode: "bg-amber-500 dark:bg-amber-400 border-white dark:border-amber-900",
      text: {
        primary: "text-slate-900 dark:text-slate-100",
        secondary: "text-amber-800 dark:text-amber-200",
        muted: "text-amber-700 dark:text-amber-400"
      }
    }
  };

  const currentTheme = themeClasses[theme];

  if (events.length === 0) {
    return (
      <Card className={`${currentTheme.container} p-8 ${className}`} data-testid="empty-timeline">
        <div className="text-center space-y-4">
          <Users className={`h-12 w-12 mx-auto ${currentTheme.text.muted} opacity-50`} />
          <div>
            <h3 className={`text-lg font-semibold ${currentTheme.text.primary}`}>
              No Events Added Yet
            </h3>
            <p className={`text-sm ${currentTheme.text.muted} mt-1`}>
              {isEditable ? 'Add events to create your Order of Service timeline' : 'This Order of Service has no events listed'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${currentTheme.container} p-6 ${className}`} data-testid="service-timeline">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className={`text-xl md:text-2xl font-serif ${currentTheme.text.primary} font-semibold`}>
            Order of Service
          </h2>
          <Separator className="opacity-30" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${currentTheme.timeline}`} />
          
          <div className="space-y-6">
            {events.map((event, index) => {
              const IconComponent = eventTypeIcons[event.eventType as keyof typeof eventTypeIcons] || Users;
              const isLast = index === events.length - 1;
              
              return (
                <div key={event.id} className="relative flex items-start space-x-6 group">
                  {/* Timeline node */}
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full 
                    ${currentTheme.timelineNode} border-4 shadow-sm z-10
                  `}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>

                  {/* Event content */}
                  <Card className={`
                    flex-1 ${currentTheme.eventCard} shadow-sm hover:shadow-md transition-shadow
                    ${isEditable ? 'cursor-pointer hover:bg-opacity-80' : ''}
                  `}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0" data-testid={`event-${event.id}`}>
                          {/* Event header */}
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-semibold ${currentTheme.text.primary}`}>
                              {event.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {eventTypeLabels[event.eventType as keyof typeof eventTypeLabels]}
                            </Badge>
                          </div>

                          {/* Event details */}
                          <div className="space-y-2">
                            {event.speaker && (
                              <p className={`text-sm ${currentTheme.text.secondary}`}>
                                <span className="font-medium">Speaker:</span> {event.speaker}
                              </p>
                            )}
                            
                            {event.duration && (
                              <div className="flex items-center space-x-1">
                                <Clock className={`h-3 w-3 ${currentTheme.text.muted}`} />
                                <span className={`text-xs ${currentTheme.text.muted}`}>
                                  {event.duration}
                                </span>
                              </div>
                            )}

                            {event.description && (
                              <p className={`text-sm ${currentTheme.text.secondary} leading-relaxed`}>
                                {event.description}
                              </p>
                            )}

                            {event.content && (
                              <div className={`text-sm ${currentTheme.text.muted} mt-3 p-2 bg-slate-50 dark:bg-slate-700/30 rounded`}>
                                <p className="italic">{event.content}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Edit controls */}
                        {isEditable && (
                          <div className="flex items-center space-x-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onEditEvent?.(event)}
                              data-testid={`edit-event-${event.id}`}
                            >
                              <Edit3 className="h-3 w-3" />
                              <span className="sr-only">Edit event</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onDeleteEvent?.(event.id)}
                              data-testid={`delete-event-${event.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete event</span>
                            </Button>
                            {onReorderEvents && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                data-testid={`reorder-event-${event.id}`}
                              >
                                <GripVertical className="h-3 w-3" />
                                <span className="sr-only">Reorder event</span>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with event count */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className={`text-xs ${currentTheme.text.muted}`}>
            {events.length} {events.length === 1 ? 'event' : 'events'} in this service
          </p>
        </div>
      </div>
    </Card>
  );
}