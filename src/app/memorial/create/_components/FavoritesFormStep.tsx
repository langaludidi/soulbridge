"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface FavoritesFormStepProps {
  data: {
    favorite_quote: string;
    favorite_song: string;
    hobbies: string[];
    personal_traits: string[];
  };
  updateData: (data: any) => void;
}

export default function FavoritesFormStep({ data, updateData }: FavoritesFormStepProps) {
  const [newHobby, setNewHobby] = useState("");
  const [newTrait, setNewTrait] = useState("");

  const addHobby = () => {
    if (newHobby.trim()) {
      updateData({ hobbies: [...(data.hobbies || []), newHobby.trim()] });
      setNewHobby("");
    }
  };

  const removeHobby = (index: number) => {
    const updated = (data.hobbies || []).filter((_, i) => i !== index);
    updateData({ hobbies: updated });
  };

  const addTrait = () => {
    if (newTrait.trim()) {
      updateData({ personal_traits: [...(data.personal_traits || []), newTrait.trim()] });
      setNewTrait("");
    }
  };

  const removeTrait = (index: number) => {
    const updated = (data.personal_traits || []).filter((_, i) => i !== index);
    updateData({ personal_traits: updated });
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Favorites & Personality
        </h2>
        <p className="text-muted-foreground text-lg">
          Share what made them special and unique
        </p>
      </div>

      {/* Favorite Quote */}
      <div className="space-y-2 p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10">
        <Label htmlFor="favorite_quote" className="text-base font-semibold">Favorite Quote</Label>
        <Textarea
          id="favorite_quote"
          placeholder="A quote they lived by or frequently mentioned..."
          value={data.favorite_quote || ""}
          onChange={(e) => updateData({ favorite_quote: e.target.value })}
          rows={3}
          className="mt-2 bg-background hover:border-accent transition-colors"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This will be displayed prominently on the memorial page.
        </p>
      </div>

      {/* Favorite Song */}
      <div className="space-y-2 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
        <Label htmlFor="favorite_song" className="text-base font-semibold">Favorite Song</Label>
        <Input
          id="favorite_song"
          placeholder="Song title and artist"
          value={data.favorite_song || ""}
          onChange={(e) => updateData({ favorite_song: e.target.value })}
          className="mt-2 bg-background hover:border-primary transition-colors"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Example: "What a Wonderful World - Louis Armstrong"
        </p>
      </div>

      {/* Hobbies */}
      <div className="space-y-3 p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10">
        <Label className="text-base font-semibold">Hobbies & Interests</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a hobby or interest..."
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHobby();
                }
              }}
              className="bg-background hover:border-accent transition-colors"
            />
            <Button
              type="button"
              variant="default"
              onClick={addHobby}
              disabled={!newHobby.trim()}
              className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {data.hobbies && data.hobbies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-4 bg-background rounded-lg border border-accent/10">
              {data.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-accent/20 to-accent/10 text-accent-foreground rounded-full text-sm font-medium shadow-sm border border-accent/20"
                >
                  <span>{hobby}</span>
                  <button
                    type="button"
                    onClick={() => removeHobby(index)}
                    className="hover:text-destructive transition-colors ml-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Examples: Gardening, Reading, Fishing, Cooking, Painting
        </p>
      </div>

      {/* Personal Traits */}
      <div className="space-y-3 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
        <Label className="text-base font-semibold">Personal Traits & Characteristics</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a personal trait..."
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTrait();
                }
              }}
              className="bg-background hover:border-primary transition-colors"
            />
            <Button
              type="button"
              variant="default"
              onClick={addTrait}
              disabled={!newTrait.trim()}
              className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {data.personal_traits && data.personal_traits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-4 bg-background rounded-lg border border-primary/10">
              {data.personal_traits.map((trait, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary/20 to-primary/10 text-primary-foreground rounded-full text-sm font-semibold shadow-sm border border-primary/20"
                >
                  <span>{trait}</span>
                  <button
                    type="button"
                    onClick={() => removeTrait(index)}
                    className="hover:text-destructive transition-colors ml-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Examples: Compassionate, Generous, Funny, Creative, Wise
        </p>
      </div>
    </div>
  );
}
