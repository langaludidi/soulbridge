"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Plus, X, Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  event_title: string;
  event_date: string;
  event_time: string | null;
  event_location: string | null;
  event_description: string | null;
}

interface EventsStepProps {
  memorialId: string | null;
}

export default function EventsStep({ memorialId }: EventsStepProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    event_title: "",
    event_date: "",
    event_time: "",
    event_location: "",
    event_description: "",
  });

  useEffect(() => {
    if (memorialId) {
      fetchEvents();
    }
  }, [memorialId]);

  const fetchEvents = async () => {
    if (!memorialId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("memorial_events")
        .select("*")
        .eq("memorial_id", memorialId)
        .order("event_date", { ascending: true }) as { data: Event[] | null, error: unknown };

      if (error) throw error;
      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!memorialId) {
      toast.error("Please save the memorial as a draft first");
      return;
    }

    if (!formData.event_title || !formData.event_date) {
      toast.error("Event title and date are required");
      return;
    }

    try {
      const { error } = await supabase
        .from("memorial_events")
        .insert({
          memorial_id: memorialId,
          event_title: formData.event_title,
          event_date: formData.event_date,
          event_time: formData.event_time || null,
          event_location: formData.event_location || null,
          event_description: formData.event_description || null,
        });

      if (error) throw error;

      toast.success("Event added successfully");
      setFormData({
        event_title: "",
        event_date: "",
        event_time: "",
        event_location: "",
        event_description: "",
      });
      setShowForm(false);
      fetchEvents();
    } catch (error: any) {
      console.error("Add event error:", error);
      toast.error(error.message || "Failed to add event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("memorial_events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event deleted");
      fetchEvents();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Memorial Events
        </h2>
        <p className="text-muted-foreground text-lg">
          Add memorial services, viewings, or celebration of life events
        </p>
      </div>

      {!memorialId && (
        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Please save the memorial as a draft first to add events.
          </p>
        </div>
      )}

      {/* Add Event Button */}
      {memorialId && !showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      )}

      {/* Add Event Form */}
      {showForm && (
        <div className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Add New Event</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label htmlFor="event_title">Event Title *</Label>
            <Input
              id="event_title"
              placeholder="e.g., Memorial Service, Wake, Celebration of Life"
              value={formData.event_title}
              onChange={(e) => setFormData({ ...formData, event_title: e.target.value })}
              className="mt-1 bg-background hover:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="mt-1 bg-background hover:border-accent transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="event_time">Time</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                className="mt-1 bg-background hover:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event_location">Location</Label>
            <Input
              id="event_location"
              placeholder="e.g., St. Mary's Church, 123 Main Street"
              value={formData.event_location}
              onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
              className="mt-1 bg-background hover:border-accent transition-colors"
            />
          </div>

          <div>
            <Label htmlFor="event_description">Description</Label>
            <Textarea
              id="event_description"
              placeholder="Additional details about the event..."
              value={formData.event_description}
              onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
              rows={3}
              className="mt-1 bg-background hover:border-accent transition-colors resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </div>
        </div>
      )}

      {/* Events List */}
      {events.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          {events.map((event) => (
            <div
              key={event.id}
              className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded-xl shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <h4 className="text-xl font-semibold text-foreground">{event.event_title}</h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.event_date)}</span>
                      {event.event_time && (
                        <>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{event.event_time}</span>
                        </>
                      )}
                    </div>

                    {event.event_location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.event_location}</span>
                      </div>
                    )}
                  </div>

                  {event.event_description && (
                    <p className="text-sm text-foreground/80 mt-2">{event.event_description}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Events will be displayed on the memorial page to inform visitors of upcoming services.
      </p>
    </div>
  );
}
