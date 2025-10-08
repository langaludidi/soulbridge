"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string | null;
}

interface TimelineStepProps {
  memorialId: string | null;
}

export default function TimelineStep({ memorialId }: TimelineStepProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
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
        .from("timeline_events")
        .select("*")
        .eq("memorial_id", memorialId)
        .order("date", { ascending: true });

      if (error) throw error;
      if (data) setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memorialId) {
      toast.error("Please save the memorial as a draft first");
      return;
    }

    try {
      if (editingId) {
        // Update existing event
        const { error } = await supabase
          .from("timeline_events")
          .update({
            date: formData.date,
            title: formData.title,
            description: formData.description || null,
          } as never)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Event updated");
      } else {
        // Create new event
        const { error } = await supabase.from("timeline_events").insert({
          memorial_id: memorialId,
          date: formData.date,
          title: formData.title,
          description: formData.description || null,
        } as never);

        if (error) throw error;
        toast.success("Event added");
      }

      // Reset form
      setFormData({ date: "", title: "", description: "" });
      setShowForm(false);
      setEditingId(null);
      fetchEvents();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save event");
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description || "",
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("timeline_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Event deleted");
      fetchEvents();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleCancel = () => {
    setFormData({ date: "", title: "", description: "" });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Life Timeline
        </h2>
        <p className="text-muted-foreground">
          Chronicle important milestones and memorable moments
        </p>
      </div>

      {!memorialId && (
        <div className="bg-muted/30 border border-border rounded-token p-4">
          <p className="text-sm text-muted-foreground">
            Please save the memorial as a draft first to add timeline events.
          </p>
        </div>
      )}

      {/* Add Event Button */}
      {memorialId && !showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      )}

      {/* Event Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-border rounded-token p-6 space-y-4"
        >
          <h3 className="font-semibold text-foreground">
            {editingId ? "Edit Event" : "Add New Event"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">Date *</Label>
              <Input
                id="event_date"
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="event_title">Event Title *</Label>
              <Input
                id="event_title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Graduated from University"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event_description">Description (optional)</Label>
            <Textarea
              id="event_description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add more details about this milestone..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              {editingId ? "Update Event" : "Add Event"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Events List */}
      {events.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Timeline Events</h3>
          <div className="space-y-3">
            {events.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={event.id}
                  className="border border-border rounded-token p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-accent">
                        {eventDate}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {events.length === 0 && memorialId && !showForm && (
        <div className="border-2 border-dashed border-border rounded-token p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No timeline events yet. Add milestones like birth, education, career,
            and family events.
          </p>
        </div>
      )}
    </div>
  );
}
