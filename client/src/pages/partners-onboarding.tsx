import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Circle, Upload, Users, Palette, Globe, Link2, DollarSign } from "lucide-react";
import { Link } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
  action?: () => void;
}

interface PartnershipModel {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: OnboardingStep[];
}

export default function PartnersOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeModel, setActiveModel] = useState<string>("cobrand");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Mock data - in real app this would come from API
  const [partnerData, setPartnerData] = useState({
    partnershipModel: "cobrand",
    onboardingStatus: "pending",
    businessName: "Demo Funeral Home",
    contactName: "John Doe",
    email: "john@demofunerals.co.za",
  });

  const models: PartnershipModel[] = [
    {
      id: "cobrand",
      name: "Co-Branded Partnership",
      icon: "🤝",
      description: "Joint branding with revenue sharing",
      steps: [
        {
          id: "upload-logo",
          title: "Upload Your Logo",
          description: "Upload your business logo for co-branded memorials",
          icon: <Upload className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "brand-colors",
          title: "Set Brand Colors",
          description: "Choose primary and secondary colors for your brand",
          icon: <Palette className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "revenue-share",
          title: "Configure Revenue Share",
          description: "Review and confirm your revenue sharing agreement",
          icon: <DollarSign className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "staff-invites",
          title: "Invite Staff Members",
          description: "Add team members who will manage memorials",
          icon: <Users className="w-5 h-5" />,
          completed: false,
          required: false,
        },
      ],
    },
    {
      id: "whitelabel",
      name: "White-Label Partnership",
      icon: "🔖",
      description: "Complete control with your branding",
      steps: [
        {
          id: "domain-setup",
          title: "Set Up Custom Domain",
          description: "Configure your custom domain (e.g., memorials.yourname.com)",
          icon: <Globe className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "upload-logo",
          title: "Upload Your Logo",
          description: "Upload your business logo for white-label branding",
          icon: <Upload className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "brand-config",
          title: "Complete Branding",
          description: "Set colors, fonts, and styling for your platform",
          icon: <Palette className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "staff-invites",
          title: "Invite Staff Members",
          description: "Add team members who will manage your platform",
          icon: <Users className="w-5 h-5" />,
          completed: false,
          required: false,
        },
      ],
    },
    {
      id: "referral",
      name: "Referral Partnership",
      icon: "📣",
      description: "Earn commissions through referrals",
      steps: [
        {
          id: "referral-link",
          title: "Generate Referral Link",
          description: "Get your unique referral tracking link",
          icon: <Link2 className="w-5 h-5" />,
          completed: false,
          required: true,
        },
        {
          id: "payout-details",
          title: "Set Up Payout Details",
          description: "Configure how you'll receive commission payments",
          icon: <DollarSign className="w-5 h-5" />,
          completed: false,
          required: true,
        },
      ],
    },
  ];

  const activeModelData = models.find(m => m.id === activeModel) || models[0];
  const totalSteps = activeModelData.steps.length;
  const completedCount = activeModelData.steps.filter(step => completedSteps.has(step.id)).length;
  const progress = (completedCount / totalSteps) * 100;

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    toast({
      title: "Step Completed!",
      description: "Great progress on your onboarding.",
    });
  };

  const handleCompleteOnboarding = () => {
    toast({
      title: "Onboarding Complete!",
      description: "Welcome to SoulBridge! You can now start creating memorials.",
    });
    // In real app, this would update the partner status and redirect to dashboard
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Welcome to SoulBridge!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Let's get your partnership set up so you can start offering digital memorials to families.
          </p>
          <Badge variant="secondary" className="text-sm">
            {partnerData.businessName} • {activeModelData.name}
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{activeModelData.icon}</span>
                  Onboarding Progress
                </CardTitle>
                <p className="text-muted-foreground">{activeModelData.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{completedCount}/{totalSteps}</div>
                <div className="text-sm text-muted-foreground">Steps completed</div>
              </div>
            </div>
            <Progress value={progress} className="mt-4" data-testid="progress-onboarding" />
          </CardHeader>
        </Card>

        {/* Model Tabs */}
        <Tabs value={activeModel} onValueChange={setActiveModel} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            {models.map((model) => (
              <TabsTrigger key={model.id} value={model.id} data-testid={`tab-${model.id}`}>
                <span className="mr-2">{model.icon}</span>
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {models.map((model) => (
            <TabsContent key={model.id} value={model.id}>
              <div className="grid gap-6">
                {model.steps.map((step, index) => (
                  <Card key={step.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {completedSteps.has(step.id) ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" data-testid={`step-completed-${step.id}`} />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground" data-testid={`step-pending-${step.id}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {step.icon}
                              <h3 className="text-lg font-semibold text-foreground">
                                {step.title}
                                {step.required && <span className="text-red-500 ml-1">*</span>}
                              </h3>
                            </div>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                        <Badge variant={step.required ? "default" : "secondary"}>
                          {step.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <StepContent
                        step={step}
                        onComplete={() => handleStepComplete(step.id)}
                        isCompleted={completedSteps.has(step.id)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link href="/partners">
            <Button variant="outline" data-testid="button-back-to-partners">
              Back to Partners
            </Button>
          </Link>
          
          <div className="flex gap-4">
            {progress === 100 ? (
              <Button onClick={handleCompleteOnboarding} data-testid="button-complete-onboarding">
                Complete Onboarding
              </Button>
            ) : (
              <Button disabled data-testid="button-complete-disabled">
                Complete Required Steps ({totalSteps - completedCount} remaining)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for individual step content
function StepContent({ 
  step, 
  onComplete, 
  isCompleted 
}: { 
  step: OnboardingStep; 
  onComplete: () => void; 
  isCompleted: boolean;
}) {
  const [formData, setFormData] = useState<any>({});

  const renderStepContent = () => {
    switch (step.id) {
      case "upload-logo":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Upload your business logo (PNG, JPG, SVG)
              </p>
              <Button variant="outline" data-testid="button-upload-logo">
                Select Logo File
              </Button>
            </div>
          </div>
        );

      case "brand-colors":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input
                  id="primary-color"
                  type="color"
                  defaultValue="#3b82f6"
                  data-testid="input-primary-color"
                />
              </div>
              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input
                  id="secondary-color"
                  type="color"
                  defaultValue="#64748b"
                  data-testid="input-secondary-color"
                />
              </div>
            </div>
          </div>
        );

      case "domain-setup":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-domain">Custom Domain</Label>
              <Input
                id="custom-domain"
                placeholder="memorials.yourname.com"
                data-testid="input-custom-domain"
              />
              <p className="text-sm text-muted-foreground mt-2">
                We'll help you configure DNS settings after you submit this.
              </p>
            </div>
          </div>
        );

      case "revenue-share":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Revenue Sharing Agreement</h4>
              <p className="text-muted-foreground text-sm mb-4">
                You'll receive 25% of subscription revenue from customers you acquire.
                Payments are made monthly via bank transfer.
              </p>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="agree-revenue" data-testid="checkbox-agree-revenue" />
                <Label htmlFor="agree-revenue" className="text-sm">
                  I agree to the revenue sharing terms
                </Label>
              </div>
            </div>
          </div>
        );

      case "referral-link":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Your Referral Link</h4>
              <div className="flex items-center space-x-2">
                <Input
                  value="https://soulbridge.co.za?ref=DEMO123"
                  readOnly
                  data-testid="input-referral-link"
                />
                <Button variant="outline" size="sm" data-testid="button-copy-link">
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Share this link to earn R500 for every successful conversion.
              </p>
            </div>
          </div>
        );

      case "payout-details":
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input id="bank-name" placeholder="e.g., Standard Bank" data-testid="input-bank-name" />
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="123456789" data-testid="input-account-number" />
              </div>
            </div>
          </div>
        );

      case "staff-invites":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff-emails">Staff Email Addresses</Label>
              <Textarea
                id="staff-emails"
                placeholder="john@yourname.co.za&#10;jane@yourname.co.za"
                data-testid="textarea-staff-emails"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter one email address per line. They'll receive invites to access your partner dashboard.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-muted-foreground">
            Configuration form for {step.title}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderStepContent()}
      
      {!isCompleted && (
        <div className="flex justify-end">
          <Button onClick={onComplete} data-testid={`button-complete-${step.id}`}>
            Complete Step
          </Button>
        </div>
      )}
      
      {isCompleted && (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Step completed successfully
        </div>
      )}
    </div>
  );
}