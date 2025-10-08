"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ObituaryStepProps {
  data: {
    obituary_short: string;
    obituary_full: string;
  };
  updateData: (data: any) => void;
}

export default function ObituaryStep({ data, updateData }: ObituaryStepProps) {
  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Life Story
        </h2>
        <p className="text-muted-foreground text-lg">
          Share the story of their life and legacy
        </p>
      </div>

      {/* Short Tribute */}
      <div className="space-y-2 p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10">
        <Label htmlFor="obituary_short" className="text-base font-semibold">Short Tribute</Label>
        <Input
          id="obituary_short"
          placeholder="A brief, heartfelt tribute (max 160 characters)"
          value={data.obituary_short}
          onChange={(e) =>
            updateData({
              obituary_short: e.target.value.slice(0, 160),
            })
          }
          maxLength={160}
          className="mt-2 bg-background hover:border-accent transition-colors"
        />
        <p className="text-xs text-muted-foreground">
          {data.obituary_short.length}/160 characters - Used for sharing and previews
        </p>
      </div>

      {/* Full Obituary */}
      <div className="space-y-2 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
        <Label htmlFor="obituary_full" className="text-base font-semibold">Full Obituary</Label>
        <Textarea
          id="obituary_full"
          placeholder="Write the full life story, achievements, passions, and what made them special..."
          value={data.obituary_full}
          onChange={(e) => updateData({ obituary_full: e.target.value })}
          rows={12}
          className="mt-2 bg-background hover:border-primary transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Take your time to craft a beautiful tribute that captures their essence.
        </p>
      </div>
    </div>
  );
}
