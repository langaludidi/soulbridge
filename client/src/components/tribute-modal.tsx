import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { InsertTribute } from "@shared/schema";

interface TributeModalProps {
  open: boolean;
  onClose: () => void;
  memorialId: string;
  memorialName: string;
}

export function TributeModal({ open, onClose, memorialId, memorialName }: TributeModalProps) {
  const [formData, setFormData] = useState({
    authorName: "",
    relationship: "",
    message: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTributeMutation = useMutation({
    mutationFn: async (tribute: InsertTribute) => {
      const response = await apiRequest("POST", `/api/memorials/${memorialId}/tributes`, tribute);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tribute Submitted",
        description: "Your tribute has been submitted for review and will be published soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "tributes"] });
      onClose();
      setFormData({ authorName: "", relationship: "", message: "" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to leave a tribute.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit tribute. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim() || !formData.message.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in your name and message.",
        variant: "destructive",
      });
      return;
    }

    createTributeMutation.mutate({
      authorName: formData.authorName.trim(),
      relationship: formData.relationship || undefined,
      message: formData.message.trim(),
      memorialId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-tribute">
        <DialogHeader>
          <DialogTitle>Leave a Tribute for {memorialName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="authorName">Your Name *</Label>
            <Input
              id="authorName"
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              placeholder="Enter your name"
              required
              data-testid="input-tribute-name"
            />
          </div>
          
          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Select 
              value={formData.relationship} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
            >
              <SelectTrigger data-testid="select-tribute-relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="student">Former Student</SelectItem>
                <SelectItem value="neighbor">Neighbor</SelectItem>
                <SelectItem value="community">Community Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="message">Your Tribute *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your memories and thoughts..."
              rows={4}
              required
              data-testid="textarea-tribute-message"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              data-testid="button-tribute-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createTributeMutation.isPending}
              data-testid="button-tribute-submit"
            >
              {createTributeMutation.isPending ? "Submitting..." : "Submit Tribute"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
