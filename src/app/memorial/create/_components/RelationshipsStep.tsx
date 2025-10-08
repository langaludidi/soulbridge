"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Relationship {
  id: string;
  relationship_type: string;
  name: string;
}

interface RelationshipsStepProps {
  memorialId: string | null;
}

export default function RelationshipsStep({ memorialId }: RelationshipsStepProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);

  // Form inputs for different relationship types
  const [formData, setFormData] = useState({
    spouse: "",
    children: "",
    parents: "",
    siblings: "",
    grandchildren: "",
    greatGrandchildren: "",
  });

  useEffect(() => {
    if (memorialId) {
      fetchRelationships();
    }
  }, [memorialId]);

  const fetchRelationships = async () => {
    if (!memorialId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("memorial_id", memorialId) as { data: Relationship[] | null, error: unknown };

      if (error) throw error;
      if (data) {
        setRelationships(data);

        // Populate form with existing data
        const spouse = data.find(r => r.relationship_type === "spouse");
        const children = data.filter(r => r.relationship_type === "child").map(r => r.name).join(", ");
        const parents = data.filter(r => r.relationship_type === "parent").map(r => r.name).join(", ");
        const siblings = data.filter(r => r.relationship_type === "sibling").map(r => r.name).join(", ");
        const grandchildren = data.filter(r => r.relationship_type === "grandchild").map(r => r.name).join(", ");
        const greatGrandchildren = data.filter(r => r.relationship_type === "great-grandchild").map(r => r.name).join(", ");

        setFormData({
          spouse: spouse?.name || "",
          children: children || "",
          parents: parents || "",
          siblings: siblings || "",
          grandchildren: grandchildren || "",
          greatGrandchildren: greatGrandchildren || "",
        });
      }
    } catch (error) {
      console.error("Error fetching relationships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!memorialId) {
      toast.error("Please save the memorial as a draft first");
      return;
    }

    try {
      // Delete existing relationships
      await supabase
        .from("relationships")
        .delete()
        .eq("memorial_id", memorialId);

      // Prepare new relationships array
      const newRelationships: Array<{
        memorial_id: string;
        relationship_type: string;
        name: string;
      }> = [];

      // Add spouse
      if (formData.spouse.trim()) {
        newRelationships.push({
          memorial_id: memorialId,
          relationship_type: "spouse",
          name: formData.spouse.trim(),
        });
      }

      // Add children (comma-separated)
      if (formData.children.trim()) {
        formData.children.split(",").forEach((child) => {
          const name = child.trim();
          if (name) {
            newRelationships.push({
              memorial_id: memorialId,
              relationship_type: "child",
              name,
            });
          }
        });
      }

      // Add parents (comma-separated)
      if (formData.parents.trim()) {
        formData.parents.split(",").forEach((parent) => {
          const name = parent.trim();
          if (name) {
            newRelationships.push({
              memorial_id: memorialId,
              relationship_type: "parent",
              name,
            });
          }
        });
      }

      // Add siblings (comma-separated)
      if (formData.siblings.trim()) {
        formData.siblings.split(",").forEach((sibling) => {
          const name = sibling.trim();
          if (name) {
            newRelationships.push({
              memorial_id: memorialId,
              relationship_type: "sibling",
              name,
            });
          }
        });
      }

      // Add grandchildren (comma-separated)
      if (formData.grandchildren.trim()) {
        formData.grandchildren.split(",").forEach((grandchild) => {
          const name = grandchild.trim();
          if (name) {
            newRelationships.push({
              memorial_id: memorialId,
              relationship_type: "grandchild",
              name,
            });
          }
        });
      }

      // Add great-grandchildren (comma-separated)
      if (formData.greatGrandchildren.trim()) {
        formData.greatGrandchildren.split(",").forEach((greatGrandchild) => {
          const name = greatGrandchild.trim();
          if (name) {
            newRelationships.push({
              memorial_id: memorialId,
              relationship_type: "great-grandchild",
              name,
            });
          }
        });
      }

      // Insert new relationships
      if (newRelationships.length > 0) {
        const { error } = await supabase
          .from("relationships")
          .insert(newRelationships as never[]);

        if (error) throw error;
      }

      toast.success("Relationships saved");
      fetchRelationships();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save relationships");
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Family & Relationships
        </h2>
        <p className="text-muted-foreground text-lg">
          Add information about family members and loved ones
        </p>
      </div>

      {!memorialId && (
        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Please save the memorial as a draft first to add relationships.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Label htmlFor="spouse">Spouse/Partner</Label>
          <Input
            id="spouse"
            placeholder="e.g., Jane Doe"
            value={formData.spouse}
            onChange={(e) =>
              setFormData({ ...formData, spouse: e.target.value })
            }
            disabled={!memorialId}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="children">Children</Label>
          <Input
            id="children"
            placeholder="e.g., John Jr., Mary, David (separate with commas)"
            value={formData.children}
            onChange={(e) =>
              setFormData({ ...formData, children: e.target.value })
            }
            disabled={!memorialId}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate multiple names with commas
          </p>
        </div>

        <div>
          <Label htmlFor="parents">Parents</Label>
          <Input
            id="parents"
            placeholder="e.g., Robert and Susan Doe"
            value={formData.parents}
            onChange={(e) =>
              setFormData({ ...formData, parents: e.target.value })
            }
            disabled={!memorialId}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="siblings">Siblings</Label>
          <Input
            id="siblings"
            placeholder="e.g., Michael, Sarah (separate with commas)"
            value={formData.siblings}
            onChange={(e) =>
              setFormData({ ...formData, siblings: e.target.value })
            }
            disabled={!memorialId}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate multiple names with commas
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10 space-y-4">
          <div>
            <Label htmlFor="grandchildren" className="text-base font-semibold">Grandchildren</Label>
            <Input
              id="grandchildren"
              placeholder="e.g., Emma, Noah, Olivia (separate with commas)"
              value={formData.grandchildren}
              onChange={(e) =>
                setFormData({ ...formData, grandchildren: e.target.value })
              }
              disabled={!memorialId}
              className="mt-2 bg-background hover:border-accent transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple names with commas
            </p>
          </div>

          <div>
            <Label htmlFor="greatGrandchildren" className="text-base font-semibold">Great-Grandchildren</Label>
            <Input
              id="greatGrandchildren"
              placeholder="e.g., Liam, Sophia (separate with commas)"
              value={formData.greatGrandchildren}
              onChange={(e) =>
                setFormData({ ...formData, greatGrandchildren: e.target.value })
              }
              disabled={!memorialId}
              className="mt-2 bg-background hover:border-accent transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple names with commas
            </p>
          </div>
        </div>
      </div>

      {memorialId && (
        <Button onClick={handleSave} variant="primary">
          Save Relationships
        </Button>
      )}

      <p className="text-sm text-muted-foreground">
        All fields are optional. You can skip this step if you prefer.
      </p>

      {/* Display saved relationships */}
      {relationships.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded-xl shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 text-lg">
            Saved Relationships
          </h3>
          <div className="space-y-3 text-sm">
            {relationships
              .filter((r) => r.relationship_type === "spouse")
              .map((r) => (
                <p key={r.id} className="flex items-start gap-2">
                  <span className="text-muted-foreground font-medium min-w-[100px]">Spouse:</span>
                  <span className="text-foreground">{r.name}</span>
                </p>
              ))}
            {relationships.filter((r) => r.relationship_type === "child")
              .length > 0 && (
              <p className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[100px]">Children:</span>
                <span className="text-foreground">
                  {relationships
                    .filter((r) => r.relationship_type === "child")
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </p>
            )}
            {relationships.filter((r) => r.relationship_type === "grandchild")
              .length > 0 && (
              <p className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[100px]">Grandchildren:</span>
                <span className="text-foreground">
                  {relationships
                    .filter((r) => r.relationship_type === "grandchild")
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </p>
            )}
            {relationships.filter((r) => r.relationship_type === "great-grandchild")
              .length > 0 && (
              <p className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[100px]">Great-Grand:</span>
                <span className="text-foreground">
                  {relationships
                    .filter((r) => r.relationship_type === "great-grandchild")
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </p>
            )}
            {relationships.filter((r) => r.relationship_type === "parent")
              .length > 0 && (
              <p className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[100px]">Parents:</span>
                <span className="text-foreground">
                  {relationships
                    .filter((r) => r.relationship_type === "parent")
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </p>
            )}
            {relationships.filter((r) => r.relationship_type === "sibling")
              .length > 0 && (
              <p className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[100px]">Siblings:</span>
                <span className="text-foreground">
                  {relationships
                    .filter((r) => r.relationship_type === "sibling")
                    .map((r) => r.name)
                    .join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
