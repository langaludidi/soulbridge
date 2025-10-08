"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DonationsRSVPStepProps {
  data: {
    allow_donations: boolean;
    donation_link: string;
    rsvp_enabled: boolean;
    rsvp_event_date: string;
    rsvp_event_time: string;
    rsvp_event_location: string;
    rsvp_event_details: string;
  };
  updateData: (data: any) => void;
}

export default function DonationsRSVPStep({ data, updateData }: DonationsRSVPStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Donations & RSVP
        </h2>
        <p className="text-muted-foreground">
          Optional features for memorial services and donations
        </p>
      </div>

      {/* Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Enable Donations</h3>
            <p className="text-sm text-muted-foreground">
              Allow visitors to make donations via Netcash
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateData({ allow_donations: !data.allow_donations })}
            className={`relative inline-flex h-6 w-11 items-center rounded-pill transition-colors ${
              data.allow_donations ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.allow_donations ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {data.allow_donations && (
          <div>
            <Label htmlFor="donation_link">Netcash Pay Link URL</Label>
            <Input
              id="donation_link"
              type="url"
              placeholder="https://pay.netcash.co.za/..."
              value={data.donation_link}
              onChange={(e) => updateData({ donation_link: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste your Netcash Pay Now link here
            </p>
          </div>
        )}
      </div>

      <hr className="border-border" />

      {/* RSVP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Enable RSVP</h3>
            <p className="text-sm text-muted-foreground">
              Allow visitors to RSVP for a memorial service or event
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateData({ rsvp_enabled: !data.rsvp_enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-pill transition-colors ${
              data.rsvp_enabled ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.rsvp_enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {data.rsvp_enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rsvp_event_date">Event Date</Label>
                <Input
                  id="rsvp_event_date"
                  type="date"
                  value={data.rsvp_event_date}
                  onChange={(e) => updateData({ rsvp_event_date: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rsvp_event_time">Event Time</Label>
                <Input
                  id="rsvp_event_time"
                  type="time"
                  value={data.rsvp_event_time}
                  onChange={(e) => updateData({ rsvp_event_time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rsvp_event_location">Location</Label>
              <Input
                id="rsvp_event_location"
                placeholder="e.g., St. Mary's Church, Cape Town"
                value={data.rsvp_event_location}
                onChange={(e) => updateData({ rsvp_event_location: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rsvp_event_details">Event Details</Label>
              <Textarea
                id="rsvp_event_details"
                placeholder="Additional information about the service..."
                value={data.rsvp_event_details}
                onChange={(e) => updateData({ rsvp_event_details: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
