import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import type { InsertMemorial } from "@shared/schema";

interface CreateMemorialModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMemorialModal({ open, onClose }: CreateMemorialModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfPassing: "",
    province: "",
    memorialMessage: "",
    privacy: "public",
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const createMemorialMutation = useMutation({
    mutationFn: async (memorial: InsertMemorial) => {
      const response = await apiRequest("POST", "/api/memorials", memorial);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Memorial Submitted",
        description: "Your memorial has been submitted for review and will be published once approved by our team.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memorials"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to create a memorial.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create memorial. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      dateOfPassing: "",
      province: "",
      memorialMessage: "",
      privacy: "public",
    });
    setProfilePhoto(null);
    setPhotoPreview("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (PNG, JPG, etc.).",
          variant: "destructive",
        });
        return;
      }

      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || 
        !formData.dateOfBirth || !formData.dateOfPassing || !formData.province) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields marked with *.",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const birthDate = new Date(formData.dateOfBirth);
    const passingDate = new Date(formData.dateOfPassing);
    
    if (birthDate >= passingDate) {
      toast({
        title: "Invalid Dates",
        description: "Date of passing must be after date of birth.",
        variant: "destructive",
      });
      return;
    }

    if (passingDate > new Date()) {
      toast({
        title: "Invalid Date",
        description: "Date of passing cannot be in the future.",
        variant: "destructive",
      });
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create a memorial.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    const memorialData: InsertMemorial = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: new Date(formData.dateOfBirth),
      dateOfPassing: new Date(formData.dateOfPassing),
      province: formData.province,
      memorialMessage: formData.memorialMessage.trim() || undefined,
      privacy: formData.privacy as "public" | "private",
      profilePhotoUrl: undefined, // TODO: Implement photo upload with object storage
    };

    createMemorialMutation.mutate(memorialData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-create-memorial">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-semibold">Create Memorial</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-base font-medium">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="h-12 px-4 py-3 text-base mt-2"
                required
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-base font-medium">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="h-12 px-4 py-3 text-base mt-2"
                required
                data-testid="input-last-name"
              />
            </div>
          </div>
          
          {/* Date Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="dateOfBirth" className="text-base font-medium">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="h-12 px-4 py-3 text-base mt-2"
                required
                data-testid="input-date-of-birth"
              />
            </div>
            <div>
              <Label htmlFor="dateOfPassing" className="text-base font-medium">Date of Passing *</Label>
              <Input
                id="dateOfPassing"
                type="date"
                value={formData.dateOfPassing}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfPassing: e.target.value }))}
                className="h-12 px-4 py-3 text-base mt-2"
                required
                data-testid="input-date-of-passing"
              />
            </div>
          </div>
          
          {/* Province */}
          <div>
            <Label className="text-base font-medium">Province *</Label>
            <Select 
              value={formData.province} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
            >
              <SelectTrigger className="h-12 px-4 py-3 mt-2" data-testid="select-memorial-province">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                <SelectItem value="Free State">Free State</SelectItem>
                <SelectItem value="Gauteng">Gauteng</SelectItem>
                <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                <SelectItem value="Limpopo">Limpopo</SelectItem>
                <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                <SelectItem value="North West">North West</SelectItem>
                <SelectItem value="Western Cape">Western Cape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Profile Photo */}
          <div>
            <Label>Profile Photo</Label>
            <div className="mt-2">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                    data-testid="img-photo-preview"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setProfilePhoto(null);
                      setPhotoPreview("");
                    }}
                    data-testid="button-remove-photo"
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    data-testid="input-profile-photo"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Memorial Message */}
          <div>
            <Label htmlFor="memorialMessage" className="text-base font-medium">Memorial Message</Label>
            <Textarea
              id="memorialMessage"
              value={formData.memorialMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, memorialMessage: e.target.value }))}
              placeholder="Share a brief message about their life and legacy..."
              className="min-h-[120px] px-4 py-3 text-base mt-2"
              rows={4}
              data-testid="textarea-memorial-message"
            />
          </div>
          
          {/* Privacy Setting */}
          <div>
            <Label>Privacy Setting</Label>
            <RadioGroup 
              value={formData.privacy} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" data-testid="radio-privacy-public" />
                <Label htmlFor="public" className="text-sm cursor-pointer">
                  Public - Anyone can view
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" data-testid="radio-privacy-private" />
                <Label htmlFor="private" className="text-sm cursor-pointer">
                  Private - Only invited guests
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Moderation Notice */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> All memorial submissions are reviewed by our team to ensure they meet our community guidelines. You will receive an email confirmation once your memorial is approved and published.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              data-testid="button-memorial-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createMemorialMutation.isPending}
              data-testid="button-memorial-submit"
            >
              {createMemorialMutation.isPending ? "Creating Memorial..." : "Create Memorial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
