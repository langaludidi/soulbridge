import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Check, ChevronLeft, ChevronRight, Upload, Heart, MessageCircle, Camera, Share2, Calendar, MapPin, User, Loader2 } from "lucide-react";
import type { InsertMemorial } from "@shared/schema";
import { useLocation } from "wouter";

interface CreateMemorialFormProps {
  onBack?: () => void;
}

type FormStep = 1 | 2 | 3 | 4;

export function CreateMemorialForm({ onBack }: CreateMemorialFormProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState({
    // Step 1: About your loved one
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    relationship: "",
    designation: "",
    dateOfBirth: "",
    dateOfPassing: "",
    province: "",
    city: "",
    country: "South Africa",
    
    // Step 2: Memorial Details
    memorialMessage: "",
    memorialUrl: "",
    lifeStory: "",
    
    // Step 3: Photo Upload
    profilePhoto: null as File | null,
    
    // Step 4: Privacy & Final Settings
    privacy: "public",
    allowTributes: true,
    allowPhotos: true,
    notifyEmail: "",
    enableOrderOfService: false,
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Comprehensive relationship options inspired by ForeverMissed
  const relationshipOptions = [
    { value: "spouse", label: "Spouse" },
    { value: "husband", label: "Husband" },
    { value: "wife", label: "Wife" },
    { value: "partner", label: "Partner" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "grandfather", label: "Grandfather" },
    { value: "grandmother", label: "Grandmother" },
    { value: "grandson", label: "Grandson" },
    { value: "granddaughter", label: "Granddaughter" },
    { value: "uncle", label: "Uncle" },
    { value: "aunt", label: "Aunt" },
    { value: "nephew", label: "Nephew" },
    { value: "niece", label: "Niece" },
    { value: "cousin", label: "Cousin" },
    { value: "father-in-law", label: "Father-in-law" },
    { value: "mother-in-law", label: "Mother-in-law" },
    { value: "son-in-law", label: "Son-in-law" },
    { value: "daughter-in-law", label: "Daughter-in-law" },
    { value: "brother-in-law", label: "Brother-in-law" },
    { value: "sister-in-law", label: "Sister-in-law" },
    { value: "stepfather", label: "Stepfather" },
    { value: "stepmother", label: "Stepmother" },
    { value: "stepson", label: "Stepson" },
    { value: "stepdaughter", label: "Stepdaughter" },
    { value: "stepbrother", label: "Stepbrother" },
    { value: "stepsister", label: "Stepsister" },
    { value: "friend", label: "Friend" },
    { value: "best-friend", label: "Best Friend" },
    { value: "colleague", label: "Colleague" },
    { value: "neighbor", label: "Neighbor" },
    { value: "mentor", label: "Mentor" },
    { value: "teacher", label: "Teacher" },
    { value: "student", label: "Student" },
    { value: "other", label: "Other" }
  ];

  // Designation/circumstances options inspired by ForeverMissed
  const designationOptions = [
    { value: "", label: "Not specified" },
    { value: "war-veteran", label: "War Veteran" },
    { value: "covid-victim", label: "COVID-19" },
    { value: "cancer-fighter", label: "Cancer Fighter" },
    { value: "healthcare-worker", label: "Healthcare Worker" },
    { value: "teacher", label: "Teacher/Educator" },
    { value: "first-responder", label: "First Responder" },
    { value: "military-service", label: "Military Service" },
    { value: "community-leader", label: "Community Leader" },
    { value: "religious-leader", label: "Religious Leader" },
    { value: "business-leader", label: "Business Leader" },
    { value: "artist", label: "Artist/Creative" },
    { value: "athlete", label: "Athlete" },
    { value: "volunteer", label: "Volunteer" },
    { value: "organ-donor", label: "Organ Donor" },
    { value: "accident", label: "Accident" },
    { value: "natural-causes", label: "Natural Causes" },
    { value: "sudden-passing", label: "Sudden Passing" },
    { value: "long-illness", label: "After Long Illness" }
  ];

  // South African provinces
  const provinceOptions = [
    { value: "eastern-cape", label: "Eastern Cape" },
    { value: "free-state", label: "Free State" },
    { value: "gauteng", label: "Gauteng" },
    { value: "kwazulu-natal", label: "KwaZulu-Natal" },
    { value: "limpopo", label: "Limpopo" },
    { value: "mpumalanga", label: "Mpumalanga" },
    { value: "northern-cape", label: "Northern Cape" },
    { value: "north-west", label: "North West" },
    { value: "western-cape", label: "Western Cape" }
  ];

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
      designation: "",
      dateOfBirth: "",
      dateOfPassing: "",
      province: "",
      city: "",
      country: "South Africa",
      memorialMessage: "",
      memorialUrl: "",
      lifeStory: "",
      profilePhoto: null as File | null,
      privacy: "public",
      allowTributes: true,
      allowPhotos: true,
      notifyEmail: "",
      enableOrderOfService: false,
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
    
    const stepConfig = [
      { icon: User, title: "About" },
      { icon: MessageCircle, title: "Memorial" },
      { icon: Camera, title: "Photo" },
      { icon: Share2, title: "Settings" }
    ];
    
    const IconComponent = stepConfig[step - 1].icon;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
          isCompleted 
            ? 'bg-primary border-primary text-primary-foreground' 
            : isCurrent 
            ? 'border-primary text-primary bg-primary/10' 
            : 'border-muted-foreground text-muted-foreground'
        }`}>
          {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
        </div>
        <div className="mt-2 text-center">
          <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
            {stepConfig[step - 1].title}
          </div>
        </div>
        {step < 4 && (
          <div className={`w-16 h-0.5 mt-4 ${
            isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
          }`} />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex justify-center items-center space-x-8 mb-6">
          {[1, 2, 3, 4].map(step => (
            <StepIndicator key={step} step={step} currentStep={currentStep} />
          ))}
        </div>
        
        <div className="text-center">
          <Badge variant="outline" className="mb-2">
            Step {currentStep} of 4
          </Badge>
          <div className="text-lg font-medium text-muted-foreground">
            {currentStep === 1 && "Tell us about your loved one"}
            {currentStep === 2 && "Share their story and create their memorial"}
            {currentStep === 3 && "Add a beautiful photo to honour their memory"}
            {currentStep === 4 && "Final settings and privacy preferences"}
          </div>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <><User className="h-5 w-5" /> About Your Loved One</>}
            {currentStep === 2 && <><MessageCircle className="h-5 w-5" /> Memorial Details</>}
            {currentStep === 3 && <><Camera className="h-5 w-5" /> Photo Upload</>}
            {currentStep === 4 && <><Share2 className="h-5 w-5" /> Privacy & Settings</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: About your loved one */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name(s)</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    placeholder="Enter middle name(s) (optional)"
                    data-testid="input-middle-name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Your relationship to them</Label>
                    <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                      <SelectTrigger data-testid="select-relationship">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Special designation or circumstances</Label>
                  <Select value={formData.designation} onValueChange={(value) => setFormData(prev => ({ ...prev, designation: value }))}>
                    <SelectTrigger data-testid="select-designation">
                      <SelectValue placeholder="Select if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                      {designationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      data-testid="input-date-birth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfPassing">Date of Passing *</Label>
                    <Input
                      id="dateOfPassing"
                      type="date"
                      value={formData.dateOfPassing}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfPassing: e.target.value }))}
                      data-testid="input-date-passing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province *</Label>
                    <Select value={formData.province} onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}>
                      <SelectTrigger data-testid="select-province">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Town</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city or town"
                      data-testid="input-city"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Memorial Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="memorialMessage">Memorial Message</Label>
                  <Textarea
                    id="memorialMessage"
                    value={formData.memorialMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, memorialMessage: e.target.value }))}
                    placeholder="Share a heartfelt message about your loved one's life, character, and the impact they had on those around them..."
                    rows={4}
                    className="resize-none"
                    data-testid="textarea-memorial-message"
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be the main tribute displayed on their memorial page.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifeStory">Life Story (Optional)</Label>
                  <Textarea
                    id="lifeStory"
                    value={formData.lifeStory}
                    onChange={(e) => setFormData(prev => ({ ...prev, lifeStory: e.target.value }))}
                    placeholder="Share more about their life journey, achievements, hobbies, family, and the legacy they leave behind..."
                    rows={6}
                    className="resize-none"
                    data-testid="textarea-life-story"
                  />
                  <p className="text-sm text-muted-foreground">
                    This longer narrative will help visitors learn more about who they were.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memorialUrl">Custom Memorial URL</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      soulbridge.co.za/memorial/
                    </span>
                    <Input
                      id="memorialUrl"
                      value={formData.memorialUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, memorialUrl: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      placeholder="their-name"
                      className="rounded-l-none"
                      data-testid="input-memorial-url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateMemorialUrl}
                      className="rounded-l-none border-l-0"
                      data-testid="button-generate-url"
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a personalized web address for easy sharing. Leave blank for automatic generation.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/30 mb-4">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        data-testid="input-photo-upload"
                      />
                      <Label htmlFor="photo-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" className="w-full" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {photoPreview ? "Change Photo" : "Upload Photo"}
                          </span>
                        </Button>
                      </Label>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Choose a beautiful photo that captures their spirit. This will be displayed prominently on their memorial.
                    </p>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Recommended: Square or portrait orientation</p>
                      <p>• File size: Maximum 10MB</p>
                      <p>• Formats: JPG, PNG, GIF</p>
                      <p>• This step is optional - you can add photos later</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Privacy & Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Memorial Privacy</Label>
                  <RadioGroup
                    value={formData.privacy}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="public" id="privacy-public" className="mt-1" />
                      <div className="space-y-1">
                        <Label htmlFor="privacy-public" className="font-medium">Public Memorial</Label>
                        <p className="text-sm text-muted-foreground">
                          Anyone can view and search for this memorial. Visible in public listings.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="private" id="privacy-private" className="mt-1" />
                      <div className="space-y-1">
                        <Label htmlFor="privacy-private" className="font-medium">Private Memorial</Label>
                        <p className="text-sm text-muted-foreground">
                          Only people with the direct link can access this memorial. Not searchable.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Community Features</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id="allow-tributes"
                        checked={formData.allowTributes}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowTributes: !!checked }))}
                        data-testid="checkbox-allow-tributes"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="allow-tributes" className="font-medium">Allow Tributes</Label>
                        <p className="text-sm text-muted-foreground">
                          Let others leave messages and memories on this memorial.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id="allow-photos"
                        checked={formData.allowPhotos}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowPhotos: !!checked }))}
                        data-testid="checkbox-allow-photos"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="allow-photos" className="font-medium">Allow Photo Sharing</Label>
                        <p className="text-sm text-muted-foreground">
                          Let family and friends add photos to the memorial gallery.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id="enable-order-of-service"
                        checked={formData.enableOrderOfService}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableOrderOfService: !!checked }))}
                        data-testid="checkbox-enable-order-of-service"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="enable-order-of-service" className="font-medium">Create Order of Service</Label>
                        <p className="text-sm text-muted-foreground">
                          Add this memorial to create a digital funeral program later.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notifyEmail">Notification Email (Optional)</Label>
                  <Input
                    id="notifyEmail"
                    type="email"
                    value={formData.notifyEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, notifyEmail: e.target.value }))}
                    placeholder="your.email@example.com"
                    data-testid="input-notify-email"
                  />
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when people add tributes or photos to this memorial.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div className="flex gap-2">
                {onBack && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    data-testid="button-back-to-page"
                  >
                    ← Back to Information
                  </Button>
                )}
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    data-testid="button-previous-step"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    data-testid="button-next-step"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createMemorialMutation.isPending}
                    data-testid="button-create-memorial"
                    className="min-w-[150px]"
                  >
                    {createMemorialMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Create Memorial
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}