import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Search,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export default function SupportPage() {
  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email from our support team",
      detail: "support@soulbridge.co.za",
      action: "Send Email",
      href: "mailto:support@soulbridge.co.za",
      available: "Response within 24 hours",
    },
    {
      icon: MessageSquare,
      title: "Contact Form",
      description: "Fill out our detailed contact form",
      detail: "Get personalized assistance",
      action: "Contact Us",
      href: "/contact",
      available: "Response within 24-48 hours",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse our comprehensive guides",
      detail: "Step-by-step tutorials and articles",
      action: "View Docs",
      href: "/how-it-works",
      available: "Available 24/7",
    },
  ];

  const faqs = [
    {
      question: "How do I create a memorial?",
      answer:
        "Sign up for an account, then click 'Create Memorial' from your dashboard. Follow our step-by-step wizard to add photos, write an obituary, and customize the page. You can save as a draft and come back anytime.",
    },
    {
      question: "Can I make the memorial private?",
      answer:
        "Yes! You have three privacy options: Public (anyone can view), Unlisted (only people with the link can view), and Private (requires you to approve viewers). Change this anytime from the memorial settings.",
    },
    {
      question: "How much storage do I get?",
      answer:
        "All plans include unlimited photo and video uploads. We don't limit the number of memories you can share. High-resolution images are supported and securely stored in the cloud.",
    },
    {
      question: "Can I edit the memorial after publishing?",
      answer:
        "Absolutely! You can edit any aspect of the memorial at any time. Add new photos, update the obituary, manage events, or change privacy settings whenever you need to.",
    },
    {
      question: "How do people leave tributes?",
      answer:
        "Visitors can scroll to the Guestbook section and click 'Leave a Tribute' to write a message. If tributes are enabled, they'll be displayed on the memorial page. You'll receive email notifications for new tributes.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor. All transactions are encrypted and PCI-compliant for your security.",
    },
    {
      question: "Can I export or download the memorial?",
      answer:
        "Currently, memorials are designed to be permanent online tributes. You can download individual photos and videos from the gallery. If you need a complete backup, contact our support team.",
    },
    {
      question: "What happens if I cancel my subscription?",
      answer:
        "Your memorial will remain active until the end of your current billing period. After that, it will be archived but not deleted. You can reactivate it at any time by renewing your subscription.",
    },
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      href: "/how-it-works",
    },
    {
      icon: FileText,
      title: "User Guide",
      description: "Detailed documentation and tips",
      href: "/how-it-works",
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Common questions answered",
      href: "#faqs",
    },
  ];

  const features = [
    "24-hour email response time",
    "Comprehensive documentation",
    "Video tutorials and guides",
    "Step-by-step memorial creation",
    "Privacy and security help",
    "Technical troubleshooting",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <HelpCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">We're Here to Help</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Support & Help Center
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Get the assistance you need to create beautiful memorial tributes.
              Our team is ready to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the support channel that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportChannels.map((channel) => (
              <Card key={channel.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                    <channel.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">{channel.description}</p>
                  <p className="text-sm font-medium text-foreground mb-4">
                    {channel.detail}
                  </p>
                  <Button asChild className="w-full mb-3">
                    <Link href={channel.href}>{channel.action}</Link>
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{channel.available}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                What We Support
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive assistance for all your needs
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Self-Service Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers quickly with our helpful resources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {resources.map((resource) => (
              <Link key={resource.title} href={resource.href}>
                <Card className="p-6 text-center hover:shadow-lg transition-all hover:border-primary/30 h-full">
                  <div className="inline-flex p-3 bg-accent/10 rounded-lg mb-4">
                    <resource.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-accent mt-1 shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is ready to help you with any questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/contact">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="mailto:support@soulbridge.co.za">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
