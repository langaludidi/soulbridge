import { useState } from "react";
import { useFeatureGating } from "@/hooks/useFeatureGating";
import { LimitWarning } from "@/components/ui/feature-gate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import type { InsertMemorial } from "@shared/schema";
import { useLocation } from "wouter";

interface CreateMemorialModalProps {
  open: boolean;
  onClose: () => void;
}

type FormStep = 1 | 2 | 3 | 4;

export function CreateMemorialModal({ open, onClose }: CreateMemorialModalProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState({
    // Step 1: About your loved one
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    relationship: "",
    dateOfBirth: "",
    dateOfPassing: "",
    province: "",
    city: "",
    
    // Step 2: Memorial Details
    memorialMessage: "",
    memorialUrl: "",
    
    // Step 3: Photo Upload
    profilePhoto: null as File | null,
    
    // Step 4: Privacy & Final Settings
    privacy: "public",
    allowTributes: true,
    notifyEmail: "",
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const featureGating = useFeatureGating();

  const createMemorialMutation = useMutation({
    mutationFn: async (memorial: InsertMemorial) => {
      const response = await apiRequest("POST", "/api/memorials", memorial);
      return response.json();
    },
    onSuccess: (createdMemorial: any) => {
      toast({
        title: "Memorial Created Successfully",
        description: "Your memorial has been created and you can now view it.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memorials"] });
      onClose();
      resetForm();
      // Navigate to the newly created memorial
      if (createdMemorial?.id) {
        setLocation(`/memorial/${createdMemorial.id}`);
      }
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
    setCurrentStep(1);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      relationship: "",
      dateOfBirth: "",
      dateOfPassing: "",
      province: "",
      city: "",
      memorialMessage: "",
      memorialUrl: "",
      profilePhoto: null as File | null,
      privacy: "public",
      allowTributes: true,
      notifyEmail: "",
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

    // Check memorial limits
    if (!featureGating.canCreateMemorial) {
      toast({
        title: "Memorial Limit Reached",
        description: `You've reached your limit of ${featureGating.memorialLimit} memorials. Please upgrade your plan to create more.`,
        variant: "destructive",
      });
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

  // Step validation functions
  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast({ title: "First name is required", variant: "destructive" });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast({ title: "Last name is required", variant: "destructive" });
      return false;
    }
    if (!formData.dateOfBirth) {
      toast({ title: "Date of birth is required", variant: "destructive" });
      return false;
    }
    if (!formData.dateOfPassing) {
      toast({ title: "Date of passing is required", variant: "destructive" });
      return false;
    }
    if (!formData.province) {
      toast({ title: "Province is required", variant: "destructive" });
      return false;
    }
    
    // Validate dates
    const birthDate = new Date(formData.dateOfBirth);
    const passingDate = new Date(formData.dateOfPassing);
    
    if (birthDate >= passingDate) {
      toast({ title: "Date of passing must be after date of birth", variant: "destructive" });
      return false;
    }
    if (passingDate > new Date()) {
      toast({ title: "Date of passing cannot be in the future", variant: "destructive" });
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    // Step 2 has no required fields, just optional content
    return true;
  };

  const validateStep3 = () => {
    // Step 3 has no required fields, photo is optional
    return true;
  };

  const validateStep4 = () => {
    // Check if email is provided for notifications and validate format
    if (formData.notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.notifyEmail)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => Math.min(4, prev + 1) as FormStep);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as FormStep);
  };

  // Generate memorial URL slug from name
  const generateMemorialUrl = () => {
    if (formData.firstName && formData.lastName) {
      const slug = `${formData.firstName}-${formData.lastName}`.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, memorialUrl: slug }));
    }
  };

  // Step indicator component
  const StepIndicator = ({ step, currentStep }: { step: number; currentStep: number }) => {
    const isCompleted = step < currentStep;
    const isCurrent = step === currentStep;
    
    return (
      <div className="flex items-center">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
          isCompleted 
            ? 'bg-primary border-primary text-primary-foreground' 
            : isCurrent 
            ? 'border-primary text-primary bg-primary/10' 
            : 'border-muted-foreground text-muted-foreground'
        }`}>
          {isCompleted ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : step}
        </div>
        {step < 4 && (
          <div className={`w-8 sm:w-16 h-0.5 ${
            isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
          }`} />
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center pb-4">
              <h3 className="text-xl font-semibold">About your loved one</h3>
              <p className="text-muted-foreground mt-2">Tell us about the person you want to honor</p>
            </div>

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
                <Label htmlFor="middleName" className="text-base font-medium">Middle Name</Label>
                <Input
                  id="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                  className="h-12 px-4 py-3 text-base mt-2"
                  data-testid="input-middle-name"
                />
              </div>
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="h-12 px-4 py-3 mt-2" data-testid="select-gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-base font-medium">Relationship to you</Label>
                <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                  <SelectTrigger className="h-12 px-4 py-3 mt-2" data-testid="select-relationship">
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="husband">Husband</SelectItem>
                    <SelectItem value="wife">Wife</SelectItem>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="grandfather">Grandfather</SelectItem>
                    <SelectItem value="grandmother">Grandmother</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="grid md:grid-cols-2 gap-6">
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
              <div>
                <Label htmlFor="city" className="text-base font-medium">City/Town</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="h-12 px-4 py-3 text-base mt-2"
                  placeholder="e.g., Cape Town, Johannesburg"
                  data-testid="input-city"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center pb-4">
              <h3 className="text-xl font-semibold">Memorial Details</h3>
              <p className="text-muted-foreground mt-2">Share their story and create a meaningful tribute</p>
            </div>

            <div>
              <Label htmlFor="memorialMessage" className="text-base font-medium">Memorial Message</Label>
              <Textarea
                id="memorialMessage"
                value={formData.memorialMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, memorialMessage: e.target.value }))}
                placeholder="Share a brief message about their life, legacy, and what made them special..."
                className="min-h-[120px] px-4 py-3 text-base mt-2"
                rows={6}
                data-testid="textarea-memorial-message"
              />
              <p className="text-xs text-muted-foreground mt-1">This will be the main tribute message visitors see</p>
            </div>

            <div>
              <Label htmlFor="memorialUrl" className="text-base font-medium">Memorial URL</Label>
              <div className="flex mt-2">
                <Input
                  id="memorialUrl"
                  type="text"
                  value={formData.memorialUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, memorialUrl: e.target.value }))}
                  className="h-12 px-4 py-3 text-base"
                  placeholder="memorial-name"
                  data-testid="input-memorial-url"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateMemorialUrl}
                  className="ml-2 h-12"
                  data-testid="button-generate-url"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your memorial will be available at: soulbridge.com/memorial/{formData.memorialUrl || 'your-url'}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center pb-4">
              <h3 className="text-xl font-semibold">Photo Upload</h3>
              <p className="text-muted-foreground mt-2">Add a beautiful photo to honor their memory</p>
            </div>

            <div>
              <Label>Profile Photo</Label>
              <div className="mt-4">
                {photoPreview ? (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-40 h-40 object-cover rounded-lg shadow-lg"
                        data-testid="img-photo-preview"
                      />
                    </div>
                    <div className="mt-4 space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setProfilePhoto(null);
                          setPhotoPreview("");
                        }}
                        data-testid="button-remove-photo"
                      >
                        Remove Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo-input')?.click()}
                        data-testid="button-change-photo"
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">Upload a photo</p>
                    <p className="text-sm text-muted-foreground mb-4">Choose a beautiful photo that captures their spirit</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-input')?.click()}
                      data-testid="button-upload-photo"
                    >
                      Choose Photo
                    </Button>
                  </div>
                )}
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  data-testid="input-profile-photo"
                />
              </div>
              
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Photo Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a clear, high-quality photo</li>
                  <li>• Portrait photos work best</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Supported formats: JPG, PNG, GIF</li>
                  <li>• Photos are moderated for appropriateness</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center pb-4">
              <h3 className="text-xl font-semibold">Privacy & Settings</h3>
              <p className="text-muted-foreground mt-2">Configure how others can interact with this memorial</p>
            </div>

            <div>
              <Label className="text-base font-medium">Privacy Setting</Label>
              <RadioGroup 
                value={formData.privacy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                className="mt-3 space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="public" id="public" data-testid="radio-privacy-public" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="public" className="text-base font-medium cursor-pointer">
                      Public Memorial
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Anyone can view and search for this memorial. Tributes require approval.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="private" id="private" data-testid="radio-privacy-private" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="private" className="text-base font-medium cursor-pointer">
                      Private Memorial
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only people with the direct link can view this memorial.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allowTributes"
                  checked={formData.allowTributes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowTributes: !!checked }))}
                  data-testid="checkbox-allow-tributes"
                />
                <div className="flex-1">
                  <Label htmlFor="allowTributes" className="text-base font-medium cursor-pointer">
                    Allow tributes from visitors
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Let family and friends share memories and condolences
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notifyEmail" className="text-base font-medium">Notification Email</Label>
              <Input
                id="notifyEmail"
                type="email"
                value={formData.notifyEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, notifyEmail: e.target.value }))}
                className="h-12 px-4 py-3 text-base mt-2"
                placeholder="your-email@example.com"
                data-testid="input-notify-email"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll notify you when someone leaves a tribute or visits the memorial
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Review Process:</strong> All memorial submissions are reviewed by our team to ensure they meet our community guidelines. You will receive an email confirmation once your memorial is approved and published.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto" data-testid="modal-create-memorial">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-serif font-semibold">Create Memorial</DialogTitle>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 pt-4">
            <StepIndicator step={1} currentStep={currentStep} />
            <StepIndicator step={2} currentStep={currentStep} />
            <StepIndicator step={3} currentStep={currentStep} />
            <StepIndicator step={4} currentStep={currentStep} />
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground">Step {currentStep} of 4</p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-memorial-cancel"
              >
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handlePrevious}
                  data-testid="button-previous-step"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < 4 ? (
                <Button 
                  type="button"
                  onClick={handleNext}
                  data-testid="button-next-step"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={createMemorialMutation.isPending || !featureGating.canCreateMemorial}
                  data-testid="button-memorial-submit"
                >
                  {createMemorialMutation.isPending ? "Creating Memorial..." : "Create Memorial"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
