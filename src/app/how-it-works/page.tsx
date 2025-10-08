import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  UserPlus,
  FileText,
  Images,
  Clock,
  Users,
  Settings,
  Eye,
  Share2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Your Account",
      description:
        "Sign up for free in seconds. No credit card required. Choose your plan later when you're ready to publish.",
      duration: "30 seconds",
      tips: [
        "Use Google sign-in for fastest setup",
        "Your email is never shared",
        "Start with our Free plan",
      ],
    },
    {
      number: "02",
      icon: FileText,
      title: "Add Profile Information",
      description:
        "Enter basic details: name, dates, and upload a profile photo. Add a meaningful quote or verse to personalize the memorial.",
      duration: "3-5 minutes",
      tips: [
        "Have dates and photos ready",
        "Choose a high-quality profile photo",
        "Select a quote that captures their spirit",
      ],
    },
    {
      number: "03",
      icon: FileText,
      title: "Write the Obituary",
      description:
        "Craft a beautiful tribute. Start with a short summary, then write the full life story. Share achievements, passions, and what made them special.",
      duration: "15-30 minutes",
      tips: [
        "Write from the heart",
        "Include accomplishments and passions",
        "Mention family and loved ones",
        "Share a favorite memory",
      ],
    },
    {
      number: "04",
      icon: Images,
      title: "Build the Gallery",
      description:
        "Upload photos and videos that celebrate their life. Add background music to create an emotional atmosphere. Organize media chronologically or by theme.",
      duration: "10-20 minutes",
      tips: [
        "Use high-resolution photos",
        "Mix recent and historical photos",
        "Add videos of special moments",
        "Choose meaningful background music",
      ],
    },
    {
      number: "05",
      icon: Clock,
      title: "Create Life Timeline",
      description:
        "Chronicle important milestones from birth to their final days. Add education, career achievements, family events, and special moments.",
      duration: "10-15 minutes",
      tips: [
        "Start with birth and major life events",
        "Include education and career milestones",
        "Add family events (marriage, children)",
        "Note special achievements and awards",
      ],
    },
    {
      number: "06",
      icon: Users,
      title: "Add Family & Relationships",
      description:
        "Document family connections. Add spouse, children, parents, and siblings. This creates a family tree for future generations.",
      duration: "5 minutes",
      tips: [
        "Include full names",
        "List children in birth order",
        "Add maiden names where relevant",
        "All fields are optional",
      ],
    },
    {
      number: "07",
      icon: Settings,
      title: "Configure Features",
      description:
        "Enable donations via Netcash if accepting contributions. Set up RSVP for the memorial service with date, time, and location details.",
      duration: "5-10 minutes",
      tips: [
        "Set up Netcash link in advance",
        "Include detailed service information",
        "Add directions to the venue",
        "Specify dress code if needed",
      ],
    },
    {
      number: "08",
      icon: Eye,
      title: "Set Privacy & Review",
      description:
        "Choose who can view the memorial: public, unlisted, or private. Review all details, then publish when ready.",
      duration: "5 minutes",
      tips: [
        "Public = Anyone can find it",
        "Unlisted = Only those with link",
        "Private = Only you can access",
        "You can change settings anytime",
      ],
    },
    {
      number: "09",
      icon: Share2,
      title: "Share with Loved Ones",
      description:
        "Once published, share via WhatsApp, Facebook, email, or QR code. Family and friends can leave tributes in the guestbook.",
      duration: "Ongoing",
      tips: [
        "Share on social media",
        "Email the link to family",
        "Print QR codes for funeral programs",
        "Monitor and respond to tributes",
      ],
    },
  ];

  const faqs = [
    {
      question: "How long does it take to create a memorial?",
      answer:
        "Most people complete a basic memorial in 30-60 minutes. You can always save as draft and return later to add more content.",
    },
    {
      question: "Can I edit after publishing?",
      answer:
        "Yes! You can edit your memorial anytime. Changes are reflected immediately on the live page.",
    },
    {
      question: "What if I need help?",
      answer:
        "Our support team is available via email. We also have detailed guides and video tutorials to help you through each step.",
    },
    {
      question: "Can multiple people contribute?",
      answer:
        "The memorial owner can add content. Family members can leave tributes in the guestbook and share their own memories.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Creating a Memorial is
              <span className="text-primary"> Simple & Meaningful</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Follow our step-by-step process to create a beautiful tribute in
              under an hour. No technical skills required.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/memorial/create">Start Creating Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row gap-8 items-center ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-serif text-5xl font-bold text-accent">
                          {step.number}
                        </span>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>

                      <p className="text-sm text-accent mb-4">
                        Estimated time: {step.duration}
                      </p>

                      <p className="text-muted-foreground mb-6">
                        {step.description}
                      </p>

                      <div className="bg-muted/30 rounded-token p-4">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Tips:
                        </p>
                        <ul className="space-y-2">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Visual Placeholder */}
                    <div className="flex-1">
                      <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-accent/30">
                        <div className="aspect-video flex items-center justify-center">
                          <Icon className="h-24 w-24 text-accent/30" />
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Total Time: 1-2 Hours
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Most memorials are completed in one sitting. Save as draft and
              return anytime to add more.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">30 min</div>
                <p className="font-semibold text-foreground mb-2">Quick Start</p>
                <p className="text-sm text-muted-foreground">
                  Basic memorial with profile, obituary, and one photo
                </p>
              </Card>

              <Card className="p-6 border-2 border-accent">
                <div className="text-4xl font-bold text-accent mb-2">1 hour</div>
                <p className="font-semibold text-foreground mb-2">
                  Complete Memorial
                </p>
                <p className="text-sm text-muted-foreground">
                  Full memorial with gallery, timeline, and all features
                </p>
              </Card>

              <Card className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">2+ hours</div>
                <p className="font-semibold text-foreground mb-2">
                  Comprehensive Tribute
                </p>
                <p className="text-sm text-muted-foreground">
                  Extensive content with 20+ photos, videos, and detailed timeline
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create a beautiful memorial in minutes. It's free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/memorial/create">
                  Create Memorial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">See All Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
