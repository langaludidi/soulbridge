import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ServiceEventsEditor } from "@/components/service-events-editor";
import { OrderOfServiceCover } from "@/components/order-of-service-cover";
import { OrderOfServiceTimeline } from "@/components/order-of-service-timeline";
import type { DigitalOrderOfService, OrderOfServiceEvent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Eye, 
  EyeOff,
  Palette, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  Camera,
  Loader2,
  Globe,
  Lock
} from "lucide-react";

interface OrderOfServiceFormProps {
  memorial: {
    id: string;
    firstName: string;
    lastName: string;
  };
  initialData?: DigitalOrderOfService;
  onSave?: (orderOfService: DigitalOrderOfService) => void;
  onCancel?: () => void;
}

// Enhanced form schema with proper validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  theme: z.enum(["classic", "modern", "elegant"]),
  fontFamily: z.enum(["serif", "sans-serif", "script"]),
  status: z.enum(["draft", "published"]),
  privacy: z.enum(["public", "private"]),
  coverPhotoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  tributeQuote: z.string().max(500, "Quote must be 500 characters or less").optional(),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)").optional().or(z.literal("")),
  serviceTime: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM|am|pm)$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (e.g., 2:00 PM or 14:00)").optional().or(z.literal("")),
  venue: z.string().max(200, "Venue must be 200 characters or less").optional(),
  officiant: z.string().max(100, "Officiant name must be 100 characters or less").optional()
});

type FormData = z.infer<typeof formSchema>;

const themes = [
  { value: 'classic', label: 'Classic', description: 'Traditional and timeless' },
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary' },
  { value: 'elegant', label: 'Elegant', description: 'Warm and sophisticated' }
];

const fontFamilies = [
  { value: 'serif', label: 'Serif', description: 'Traditional and formal' },
  { value: 'sans-serif', label: 'Sans Serif', description: 'Clean and modern' },
  { value: 'script', label: 'Script', description: 'Elegant handwriting style' }
];

export function OrderOfServiceForm({
  memorial,
  initialData,
  onSave,
  onCancel
}: OrderOfServiceFormProps) {
  const { toast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [events, setEvents] = useState<OrderOfServiceEvent[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Initialize form FIRST before using it
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "Celebration of Life",
      theme: (initialData?.theme as "classic" | "modern" | "elegant") || "classic",
      fontFamily: (initialData?.fontFamily as "serif" | "sans-serif" | "script") || "serif",
      status: (initialData?.status as "draft" | "published") || "draft",
      privacy: (initialData?.privacy as "public" | "private") || "public",
      coverPhotoUrl: initialData?.coverPhotoUrl || "",
      tributeQuote: initialData?.tributeQuote || "",
      serviceDate: initialData?.serviceDate ? new Date(initialData.serviceDate).toISOString().split('T')[0] : "",
      serviceTime: initialData?.serviceTime || "",
      venue: initialData?.venue || "",
      officiant: initialData?.officiant || ""
    }
  });
  
  // Fetch events if editing existing Order of Service
  const { data: existingEvents } = useQuery({
    queryKey: ['/api/order-of-service', initialData?.id, 'events'],
    enabled: !!initialData?.id
  });
  
  // Update events when data loads
  useEffect(() => {
    if (existingEvents && Array.isArray(existingEvents)) {
      setEvents(existingEvents);
    } else if (initialData?.events && Array.isArray(initialData.events)) {
      setEvents(initialData.events);
    }
  }, [existingEvents, initialData?.events]);
  
  // Update preview data when form values change
  const watchedValues = form.watch();
  useEffect(() => {
    setPreviewData({
      ...watchedValues,
      events
    });
  }, [watchedValues, events]);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        memorialId: memorial.id,
        ...data,
        // Convert empty strings to null for backend
        coverPhotoUrl: data.coverPhotoUrl || null,
        tributeQuote: data.tributeQuote || null,
        serviceDate: data.serviceDate ? new Date(data.serviceDate) : null,
        serviceTime: data.serviceTime || null,
        venue: data.venue || null,
        officiant: data.officiant || null
      };
      return apiRequest('POST', `/api/memorials/${memorial.id}/order-of-service`, payload);
    },
    onSuccess: (orderOfService: any) => {
      toast({
        title: "Order of Service created!",
        description: "Your Order of Service has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/memorials', memorial.id] });
      onSave?.(orderOfService);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create Order of Service",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        // Convert empty strings to null for backend
        coverPhotoUrl: data.coverPhotoUrl || null,
        tributeQuote: data.tributeQuote || null,
        serviceDate: data.serviceDate ? new Date(data.serviceDate) : null,
        serviceTime: data.serviceTime || null,
        venue: data.venue || null,
        officiant: data.officiant || null
      };
      return apiRequest('PATCH', `/api/order-of-service/${initialData?.id}`, payload);
    },
    onSuccess: (orderOfService: any) => {
      toast({
        title: "Order of Service updated!",
        description: "Your changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/order-of-service', initialData?.id] });
      onSave?.(orderOfService);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update Order of Service",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    if (initialData) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {initialData ? 'Edit' : 'Create'} Order of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            For {memorial.firstName} {memorial.lastName}'s memorial
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            data-testid="toggle-preview-button"
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        /* Live Preview Mode */
        <div className="space-y-8">
          {previewData && (
            <div className="grid grid-cols-1 gap-8">
              {/* Preview Cover */}
              <OrderOfServiceCover
                orderOfService={{
                  ...initialData,
                  ...previewData,
                  id: initialData?.id || 'preview',
                  memorialId: memorial.id,
                  createdAt: initialData?.createdAt || new Date(),
                  updatedAt: new Date(),
                  viewCount: 0,
                  downloadCount: 0,
                  createdBy: null
                }}
                memorial={{
                  firstName: memorial.firstName,
                  lastName: memorial.lastName,
                  dateOfBirth: new Date().toISOString(),
                  dateOfPassing: new Date().toISOString(),
                  profilePhotoUrl: previewData.coverPhotoUrl || undefined,
                  memorialMessage: previewData.tributeQuote || undefined
                }}
                theme={previewData.theme as 'classic' | 'modern' | 'elegant'}
              />
              
              {/* Preview Timeline */}
              {events.length > 0 && (
                <OrderOfServiceTimeline
                  events={events}
                  theme={previewData.theme as 'classic' | 'modern' | 'elegant'}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card data-testid="basic-info-section">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Celebration of Life"
                            data-testid="title-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tributeQuote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tribute Quote (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="A meaningful quote or verse to honor their memory..."
                            rows={3}
                            data-testid="tribute-quote-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverPhotoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Photo URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4 text-slate-400" />
                            <Input
                              {...field}
                              placeholder="https://example.com/photo.jpg"
                              data-testid="cover-photo-input"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card data-testid="service-details-section">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Service Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="serviceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              data-testid="service-date-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Time</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                placeholder="e.g., 2:00 PM"
                                data-testid="service-time-input"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <Input
                              {...field}
                              placeholder="Church name and address"
                              data-testid="venue-input"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="officiant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Officiant</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <Input
                              {...field}
                              placeholder="Pastor, Reverend, or service leader name"
                              data-testid="officiant-input"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Service Events Section */}
              {initialData && (
                <ServiceEventsEditor
                  orderOfServiceId={initialData.id}
                  events={events}
                  onEventsChange={setEvents}
                  isEditable={true}
                />
              )}
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Design Settings */}
              <Card data-testid="design-settings-section">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Design</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="theme-select">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {themes.map(theme => (
                              <SelectItem key={theme.value} value={theme.value}>
                                <div>
                                  <div className="font-medium">{theme.label}</div>
                                  <div className="text-xs text-slate-500">{theme.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fontFamily"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font Family</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="font-family-select">
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fontFamilies.map(font => (
                              <SelectItem key={font.value} value={font.value}>
                                <div>
                                  <div className="font-medium">{font.label}</div>
                                  <div className="text-xs text-slate-500">{font.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Publishing Settings */}
              <Card data-testid="publishing-settings-section">
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="status-select">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">Draft</div>
                                  <div className="text-xs text-slate-500">Not visible to others</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="published">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">Published</div>
                                  <div className="text-xs text-slate-500">Visible to others</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Privacy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="privacy-select">
                              <SelectValue placeholder="Select privacy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Public - Anyone can view</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4" />
                                <span>Private - Only you can view</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="save-order-of-service-button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {initialData ? 'Update' : 'Create'} Order of Service
                    </>
                  )}
                </Button>

                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onCancel}
                    disabled={isLoading}
                    data-testid="cancel-button"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
      )}
      
      {/* Service Events for new Order of Service */}
      {!initialData && !isPreviewMode && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-slate-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Service Events
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Create your Order of Service first, then add service events like prayers, hymns, and readings.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}