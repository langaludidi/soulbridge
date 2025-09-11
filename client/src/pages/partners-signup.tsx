import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPartnerLeadSchema } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";

// Extended schema for the signup form
const partnerSignupSchema = insertPartnerLeadSchema.extend({
  partnershipModel: z.enum(["cobrand", "whitelabel", "referral"], {
    required_error: "Please select a partnership model",
  }),
  serviceType: z.enum(["funeral_home", "florist", "caterer", "musician", "photographer"], {
    required_error: "Please select your service type",
  }),
  province: z.enum([
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", 
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
  ], {
    required_error: "Please select your province",
  }),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  message: z.string().optional(),
});

type PartnerSignupForm = z.infer<typeof partnerSignupSchema>;

export default function PartnersSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Get partnership model from URL parameter if available
  const urlParams = new URLSearchParams(window.location.search);
  const modelParam = urlParams.get('model');

  const form = useForm<PartnerSignupForm>({
    resolver: zodResolver(partnerSignupSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      message: "",
      partnershipModel: (modelParam as any) || undefined,
      serviceType: undefined,
      province: undefined,
    },
  });

  const { mutate: submitSignup, isPending } = useMutation({
    mutationFn: async (data: PartnerSignupForm) => {
      // Add UTM tracking if available
      const utm = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign'),
        term: urlParams.get('utm_term'),
        content: urlParams.get('utm_content'),
      };

      const cleanUtm = Object.fromEntries(
        Object.entries(utm).filter(([_, v]) => v !== null)
      );

      return apiRequest('/api/partner-leads', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          utm: Object.keys(cleanUtm).length > 0 ? cleanUtm : undefined,
          leadSource: 'website',
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and contact you within 24 hours.",
      });
      // Redirect to confirmation or onboarding
      setLocation('/partners/onboarding');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerSignupForm) => {
    submitSignup(data);
  };

  const watchPartnershipModel = form.watch("partnershipModel");

  const getModelDetails = (model: string) => {
    switch (model) {
      case "cobrand":
        return {
          icon: "🤝",
          title: "Co-Branded Partnership",
          description: "Your logo alongside SoulBridge branding with revenue sharing",
          benefits: ["Revenue sharing model", "Joint branding", "Quick setup", "Shared support"],
        };
      case "whitelabel":
        return {
          icon: "🔖",
          title: "White-Label Partnership",
          description: "Complete control with your own branding and domain",
          benefits: ["Your branding throughout", "Custom domain", "Higher pricing control", "Direct customer relationship"],
        };
      case "referral":
        return {
          icon: "📣",
          title: "Referral Partnership",
          description: "Earn commissions by referring families to SoulBridge",
          benefits: ["Commission per conversion", "No ongoing management", "Marketing materials provided", "Instant setup"],
        };
      default:
        return null;
    }
  };

  const modelDetails = getModelDetails(watchPartnershipModel);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Partner with SoulBridge
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our network of trusted funeral service providers and start offering digital memorials to families in your community.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Partnership Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Partnership Model</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="partnershipModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedModel(value);
                          }}
                          className="grid md:grid-cols-3 gap-4"
                          data-testid="radio-partnership-model"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cobrand" id="cobrand" data-testid="radio-cobrand" />
                            <Label htmlFor="cobrand" className="cursor-pointer flex-1">
                              <Card className="p-4 hover:shadow-md transition-shadow">
                                <div className="text-center space-y-2">
                                  <div className="text-3xl">🤝</div>
                                  <h3 className="font-semibold">Co-Branded</h3>
                                  <p className="text-sm text-muted-foreground">Revenue sharing model</p>
                                </div>
                              </Card>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="whitelabel" id="whitelabel" data-testid="radio-whitelabel" />
                            <Label htmlFor="whitelabel" className="cursor-pointer flex-1">
                              <Card className="p-4 hover:shadow-md transition-shadow">
                                <div className="text-center space-y-2">
                                  <div className="text-3xl">🔖</div>
                                  <h3 className="font-semibold">White-Label</h3>
                                  <p className="text-sm text-muted-foreground">Your brand, your domain</p>
                                </div>
                              </Card>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="referral" id="referral" data-testid="radio-referral" />
                            <Label htmlFor="referral" className="cursor-pointer flex-1">
                              <Card className="p-4 hover:shadow-md transition-shadow">
                                <div className="text-center space-y-2">
                                  <div className="text-3xl">📣</div>
                                  <h3 className="font-semibold">Referral</h3>
                                  <p className="text-sm text-muted-foreground">Commission per conversion</p>
                                </div>
                              </Card>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Model Details */}
                {modelDetails && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{modelDetails.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{modelDetails.title}</h4>
                        <p className="text-muted-foreground mb-3">{modelDetails.description}</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {modelDetails.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Mokoena Family Funerals" 
                          {...field} 
                          data-testid="input-business-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service-type">
                            <SelectValue placeholder="Select your primary service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="funeral_home">Funeral Home</SelectItem>
                          <SelectItem value="florist">Florist</SelectItem>
                          <SelectItem value="caterer">Caterer</SelectItem>
                          <SelectItem value="musician">Musician</SelectItem>
                          <SelectItem value="photographer">Photographer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-province">
                            <SelectValue placeholder="Select your province" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://your-website.co.za" 
                          {...field} 
                          data-testid="input-website"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          {...field} 
                          data-testid="input-contact-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="contact@your-business.co.za" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="011 123 4567" 
                          {...field} 
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us about your business (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your business, why you're interested in partnering with SoulBridge, or any specific requirements you have..."
                          className="min-h-[120px]"
                          {...field} 
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isPending}
                className="px-12 py-3 text-lg"
                data-testid="button-submit-application"
              >
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Have questions about becoming a partner? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" data-testid="button-contact-support">
              Contact Support
            </Button>
            <Button variant="outline" data-testid="button-schedule-call">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}