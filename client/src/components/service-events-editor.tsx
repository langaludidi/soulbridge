import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { OrderOfServiceEvent } from "@shared/schema";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  Music, 
  Book, 
  Heart, 
  Users, 
  Star,
  Clock,
  User,
  FileText,
  Save
} from "lucide-react";

interface ServiceEventsEditorProps {
  orderOfServiceId: string;
  events: OrderOfServiceEvent[];
  onEventsChange?: (events: OrderOfServiceEvent[]) => void;
  isEditable?: boolean;
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: z.enum([
    "opening_prayer", "hymn", "reading", "eulogy", "reflection", 
    "music", "tribute", "closing_prayer", "other"
  ]),
  description: z.string().optional(),
  speaker: z.string().optional(),
  duration: z.string().optional(),
  content: z.string().optional()
});

type EventFormData = z.infer<typeof eventSchema>;

const eventTypes = [
  { value: 'opening_prayer', label: 'Opening Prayer', icon: Book },
  { value: 'hymn', label: 'Hymn', icon: Music },
  { value: 'reading', label: 'Scripture Reading', icon: Book },
  { value: 'eulogy', label: 'Eulogy', icon: Heart },
  { value: 'reflection', label: 'Reflection', icon: Star },
  { value: 'music', label: 'Musical Selection', icon: Music },
  { value: 'tribute', label: 'Tribute', icon: Heart },
  { value: 'closing_prayer', label: 'Closing Prayer', icon: Book },
  { value: 'other', label: 'Other', icon: Users }
];

export function ServiceEventsEditor({ 
  orderOfServiceId, 
  events, 
  onEventsChange,
  isEditable = true 
}: ServiceEventsEditorProps) {
  const { toast } = useToast();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OrderOfServiceEvent | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  const eventForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      eventType: "other",
      description: "",
      speaker: "",
      duration: "",
      content: ""
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const orderIndex = events.length; // Add at the end
      return apiRequest(`/api/order-of-service/${orderOfServiceId}/events`, 'POST', {
        ...data,
        orderIndex
      });
    },
    onSuccess: (newEvent: any) => {
      toast({
        title: "Event added!",
        description: "Service event has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', orderOfServiceId] });
      onEventsChange?.([...events, newEvent]);
      setIsAddingEvent(false);
      eventForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<EventFormData> }) => {
      return apiRequest(`/api/order-of-service-events/${data.id}`, 'PATCH', data.updates);
    },
    onSuccess: (updatedEvent: any) => {
      toast({
        title: "Event updated!",
        description: "Service event has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', orderOfServiceId] });
      const updatedEvents = events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
      onEventsChange?.(updatedEvents);
      setEditingEvent(null);
      eventForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return apiRequest(`/api/order-of-service-events/${eventId}`, 'DELETE');
    },
    onSuccess: (_: any, deletedEventId: string) => {
      toast({
        title: "Event deleted!",
        description: "Service event has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', orderOfServiceId] });
      const updatedEvents = events.filter(event => event.id !== deletedEventId);
      onEventsChange?.(updatedEvents);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Reorder events mutation
  const reorderEventsMutation = useMutation({
    mutationFn: async (eventIds: string[]) => {
      return apiRequest(`/api/order-of-service/${orderOfServiceId}/events/reorder`, 'PATCH', {
        eventIds
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', orderOfServiceId] });
    }
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    eventForm.reset({
      title: "",
      eventType: "other",
      description: "",
      speaker: "",
      duration: "",
      content: ""
    });
    setIsAddingEvent(true);
  };

  const handleEditEvent = (event: OrderOfServiceEvent) => {
    setIsAddingEvent(false);
    setEditingEvent(event);
    eventForm.reset({
      title: event.title,
      eventType: event.eventType as any,
      description: event.description || "",
      speaker: event.speaker || "",
      duration: event.duration || "",
      content: event.content || ""
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetEventId: string) => {
    e.preventDefault();
    
    if (!draggedEventId || draggedEventId === targetEventId) {
      setDraggedEventId(null);
      return;
    }

    const draggedIndex = events.findIndex(event => event.id === draggedEventId);
    const targetIndex = events.findIndex(event => event.id === targetEventId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder events array
    const reorderedEvents = [...events];
    const [draggedEvent] = reorderedEvents.splice(draggedIndex, 1);
    reorderedEvents.splice(targetIndex, 0, draggedEvent);

    // Update local state immediately
    onEventsChange?.(reorderedEvents);

    // Send to backend
    const eventIds = reorderedEvents.map(event => event.id);
    reorderEventsMutation.mutate(eventIds);
    
    setDraggedEventId(null);
  };

  const onSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateEventMutation.mutate({
        id: editingEvent.id,
        updates: data
      });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const isLoading = createEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending;

  return (
    <Card data-testid="service-events-editor">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Service Events</span>
          </CardTitle>
          {isEditable && (
            <Button
              onClick={handleAddEvent}
              size="sm"
              data-testid="add-event-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event, index) => {
              const eventType = eventTypes.find(type => type.value === event.eventType);
              const IconComponent = eventType?.icon || Users;
              
              return (
                <div
                  key={event.id}
                  draggable={isEditable}
                  onDragStart={(e) => handleDragStart(e, event.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, event.id)}
                  className={`
                    p-4 border rounded-lg bg-white dark:bg-slate-800 
                    ${isEditable ? 'cursor-move hover:bg-slate-50 dark:hover:bg-slate-700' : ''}
                    ${draggedEventId === event.id ? 'opacity-50' : ''}
                  `}
                  data-testid={`event-item-${event.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {isEditable && (
                        <GripVertical className="h-4 w-4 text-slate-400 mt-1 cursor-grab" />
                      )}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700">
                        <IconComponent className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {event.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {eventType?.label}
                          </Badge>
                          <span className="text-xs text-slate-500">#{index + 1}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          {event.speaker && (
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{event.speaker}</span>
                            </span>
                          )}
                          {event.duration && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.duration}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isEditable && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          data-testid={`edit-event-${event.id}`}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteEvent(event.id)}
                          data-testid={`delete-event-${event.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No service events added yet.</p>
            {isEditable && (
              <p className="text-sm mt-1">Click "Add Event" to start building your program.</p>
            )}
          </div>
        )}

        {/* Add/Edit Event Dialog */}
        {isEditable && (
          <Dialog open={isAddingEvent || !!editingEvent} onOpenChange={(open) => {
            if (!open) {
              setIsAddingEvent(false);
              setEditingEvent(null);
              eventForm.reset();
            }
          }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Edit Event' : 'Add Service Event'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="e.g., Opening Prayer, Welcome Song"
                            data-testid="event-title-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={eventForm.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="event-type-select">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center space-x-2">
                                  <type.icon className="h-4 w-4" />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="speaker"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Speaker/Leader</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Optional"
                              data-testid="event-speaker-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="e.g., 5 min"
                              data-testid="event-duration-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={2}
                            placeholder="Brief description or notes about this event..."
                            data-testid="event-description-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={eventForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content/Script</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Prayer text, song lyrics, reading passage, or speech notes..."
                            data-testid="event-content-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      data-testid="save-event-button"
                    >
                      {isLoading && <Save className="h-4 w-4 mr-2 animate-spin" />}
                      {editingEvent ? 'Update Event' : 'Add Event'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingEvent(false);
                        setEditingEvent(null);
                        eventForm.reset();
                      }}
                      data-testid="cancel-event-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}