import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useEffect } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle, ShieldCheck } from "lucide-react";

const contactSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  memorialId: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Contact Us - SoulBridge Memorial Platform";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact SoulBridge support team. Get help with digital memorials, subscriptions, technical issues. Phone: 041 019 5019, Email: support@soulbridge.co.za');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact SoulBridge support team. Get help with digital memorials, subscriptions, technical issues. Phone: 041 019 5019, Email: support@soulbridge.co.za';
      document.head.appendChild(meta);
    }
  }, []);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      message: "",
      email: "",
      memorialId: "",
    }
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error Sending Message",
        description: error?.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you honour your loved ones with dignity and care
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Our support team typically responds within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Details */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our dedicated support team understands the sensitivity of memorial services and is committed to providing compassionate, professional assistance.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                        <p className="text-muted-foreground text-sm mb-2">Mon-Fri 9AM-5PM</p>
                        <p className="text-foreground font-medium" data-testid="text-phone-number">041 019 5019</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                        <p className="text-muted-foreground text-sm mb-2">24/7 - We respond within 24 hours</p>
                        <p className="text-foreground font-medium" data-testid="text-email-address">support@soulbridge.co.za</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                        <p className="text-muted-foreground text-sm">
                          SoulBridge (Pty) Ltd<br />
                          14a Pickering Street<br />
                          Newton Park, Port Elizabeth<br />
                          South Africa
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                        <div className="text-muted-foreground text-sm space-y-1">
                          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                          <p>Saturday & Sunday: Closed</p>
                          <p>Email support: Available 24/7</p>
                          <p className="text-xs mt-2">All times are South Africa Standard Time (SAST)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email address" 
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief description of your inquiry" 
                                {...field} 
                                data-testid="input-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />


                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your inquiry..." 
                                className="min-h-[120px]" 
                                {...field} 
                                data-testid="textarea-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <ShieldCheck className="w-4 h-4 inline mr-2" />
                          Your information is protected and will only be used to respond to your inquiry. 
                          Read our <Link href="/privacy"><span className="text-primary hover:underline cursor-pointer">Privacy Policy</span></Link> for more details.
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={contactMutation.isPending}
                        data-testid="button-send-message"
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
              Quick Help
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Looking for immediate assistance? These resources might help you find answers faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Frequently Asked Questions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Find answers to common questions about subscriptions, features, and getting started
                </p>
                <Link href="/faq">
                  <Button variant="outline" size="sm" data-testid="button-view-faq">
                    View FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Writing Guide</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Get help with writing meaningful tributes and memorial content
                </p>
                <Link href="/writing-guide">
                  <Button variant="outline" size="sm" data-testid="button-view-writing-guide">
                    View Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Privacy & Terms</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Review our privacy policy and terms of use for detailed information
                </p>
                <div className="flex flex-col space-y-2">
                  <Link href="/privacy">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-view-privacy">
                      Privacy Policy
                    </Button>
                  </Link>
                  <Link href="/terms">
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-view-terms">
                      Terms of Use
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-destructive/5 dark:bg-destructive/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Emergency Memorial Support</h3>
          <p className="text-muted-foreground mb-6">
            If you need urgent assistance with memorial content or have an immediate concern, 
            please call our emergency line or email us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-destructive hover:bg-destructive/90" data-testid="button-emergency-call">
              <Phone className="w-4 h-4 mr-2" />
              Emergency: 041 019 5019
            </Button>
            <Button variant="outline" data-testid="button-emergency-email">
              <Mail className="w-4 h-4 mr-2" />
              urgent@soulbridge.co.za
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}