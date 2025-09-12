import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Partners() {
  const benefits = [
    { icon: "💰", title: "Reduce Costs", description: "No need to build memorial technology in-house. We handle hosting, updates, and support." },
    { icon: "🚀", title: "Promote Brand", description: "Every memorial showcases your business, creating lasting brand impressions with families." },
    { icon: "📈", title: "Generate Revenue", description: "Earn through revenue sharing, referral commissions, or direct white-label pricing." },
    { icon: "🕊️", title: "Dignified Remembrance", description: "Help families create beautiful, permanent tributes that honor their loved ones with dignity." },
  ];

  const partnerTypes = [
    {
      icon: "🤝",
      title: "Co-Branded",
      description: "Your logo alongside SoulBridge branding. Perfect for established funeral homes wanting to enhance their digital offerings.",
      gradient: "from-primary to-secondary",
      examples: "Suitable for 90% of funeral homes",
    },
    {
      icon: "🔖",
      title: "White-Label",
      description: "Complete branding control with your own domain. Ideal for larger operators wanting full brand ownership.",
      gradient: "from-blue-500 to-purple-600",
      examples: "For larger groups and enterprise clients",
    },
    {
      icon: "📣",
      title: "Referral",
      description: "Earn commissions by referring families to SoulBridge. Perfect for smaller operators or individual consultants.",
      gradient: "from-orange-400 to-red-500",
      examples: "For consultants and lead generators",
    },
  ];

  const steps = [
    { title: "Sign Up", description: "Complete our simple registration with your business details and choose your partnership model." },
    { title: "Choose Branding", description: "Set up your branding preferences, from co-branded experiences to full white-label solutions." },
    { title: "Start Publishing", description: "Begin creating beautiful memorials for families and manage them through your partner dashboard." },
    { title: "Earn Revenue", description: "Receive revenue sharing or referral payments while providing exceptional value to families." },
  ];

  return (
    <div className="min-h-screen section-bg-primary">

      {/* Hero Section */}
      <section className="py-16 sm:py-24 section-bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Trusted Partner Network
            </Badge>
            <h1 className="h1 mb-6">
              Partner with SoulBridge
            </h1>
            <p className="lead text-muted-foreground max-w-4xl mx-auto mb-8">
              Join South Africa's leading memorial platform and help families honour their loved ones with dignity and grace.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 section-bg-quaternary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              How It Works
            </h2>
            <p className="lead text-muted-foreground max-w-3xl mx-auto">
              Getting started as a SoulBridge partner is simple and straightforward
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="h3 mb-4">{step.title}</h3>
                <p className="body text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 sm:py-20 section-bg-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              Partner Types
            </h2>
            <p className="lead text-muted-foreground max-w-3xl mx-auto">
              We work with various professionals in the funeral and memorial industry
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div key={index} className="section-elevated rounded-xl p-8 text-center group hover:shadow-md transition-all duration-300">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${type.gradient}`}>
                  <type.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="h3 mb-3">{type.title}</h3>
                <p className="body text-muted-foreground mb-4">{type.description}</p>
                <div className="text-sm text-primary font-medium">{type.examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Options */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Choose Your Partnership Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the partnership approach that best fits your business needs and brand strategy.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Co-Branded */}
          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardContent className="space-y-6">
              <div className="text-6xl">🤝</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Co-Branded</h3>
                <Badge variant="secondary" className="mb-4">Most Popular</Badge>
              </div>
              <p className="text-muted-foreground">
                Your logo alongside SoulBridge branding. Perfect for established funeral homes wanting to enhance their digital offerings.
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li>• Your logo on all memorials</li>
                <li>• Revenue sharing model</li>
                <li>• Joint marketing opportunities</li>
                <li>• Shared customer support</li>
                <li>• Quick setup (1-2 days)</li>
              </ul>
              <Link href="/partners/signup?model=cobrand">
                <Button className="w-full" data-testid="button-choose-cobrand">
                  Choose Co-Branded
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* White-Label */}
          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardContent className="space-y-6">
              <div className="text-6xl">🔖</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">White-Label</h3>
                <Badge variant="outline" className="mb-4">Enterprise</Badge>
              </div>
              <p className="text-muted-foreground">
                Complete branding control with your own domain. Ideal for larger operators wanting full brand ownership.
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li>• Your branding throughout</li>
                <li>• Custom domain (memorials.yourname.com)</li>
                <li>• White-label pricing</li>
                <li>• Direct customer relationship</li>
                <li>• Setup assistance (3-5 days)</li>
              </ul>
              <Link href="/partners/signup?model=whitelabel">
                <Button className="w-full" variant="outline" data-testid="button-choose-whitelabel">
                  Choose White-Label
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Referral */}
          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardContent className="space-y-6">
              <div className="text-6xl">📣</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Referral</h3>
                <Badge variant="outline" className="mb-4">Easy Start</Badge>
              </div>
              <p className="text-muted-foreground">
                Earn commissions by referring families to SoulBridge. Perfect for smaller operators or individual consultants.
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li>• Unique referral tracking</li>
                <li>• Commission per conversion</li>
                <li>• No ongoing management</li>
                <li>• Marketing materials provided</li>
                <li>• Instant setup</li>
              </ul>
              <Link href="/partners/signup?model=referral">
                <Button className="w-full" variant="outline" data-testid="button-choose-referral">
                  Choose Referral
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Testimonials/Scenarios */}
      <section className="py-16 bg-primary/5 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Trusted by Leading Funeral Homes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our partners are enhancing their services and growing their businesses with SoulBridge.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-8">
          <Card className="p-8">
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">MF</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Mokoena Funerals</h4>
                  <p className="text-sm text-muted-foreground">Johannesburg, Gauteng</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Mokoena Funerals now includes SoulBridge in every package. Families love having a permanent place to share memories, and we've seen a 30% increase in premium package uptake."
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Co-Branded Partner</Badge>
                <span className="text-sm text-muted-foreground">• 2 years with SoulBridge</span>
              </div>
            </CardContent>
          </Card>
          <Card className="p-8">
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">VF</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Viljoen Family Services</h4>
                  <p className="text-sm text-muted-foreground">Cape Town, Western Cape</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Our white-label solution lets us offer digital memorials under our own brand. It's become a key differentiator that families specifically request when they call us."
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">White-Label Partner</Badge>
                <span className="text-sm text-muted-foreground">• 18 months with SoulBridge</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 sm:py-20 section-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              Why Partner with SoulBridge?
            </h2>
            <p className="lead text-muted-foreground max-w-3xl mx-auto">
              Build meaningful connections with your community while growing your business through our trusted platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="section-elevated rounded-xl p-8 text-center h-full hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="h3 mb-4">{benefit.title}</h3>
                <p className="body text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about partnering with SoulBridge.
          </p>
        </div>
        <div className="max-w-4xl mx-auto px-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="pricing" data-testid="accordion-pricing">
              <AccordionTrigger>What does it cost to become a partner?</AccordionTrigger>
              <AccordionContent>
                Partnership with SoulBridge is free to start. Co-branded partners work on a revenue-sharing model (typically 20-30%), white-label partners pay a monthly platform fee based on usage, and referral partners earn commissions per successful conversion. There are no setup fees or long-term contracts required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="support" data-testid="accordion-support">
              <AccordionTrigger>What kind of support do you provide?</AccordionTrigger>
              <AccordionContent>
                All partners receive dedicated onboarding assistance, ongoing technical support, marketing materials, and access to our partner portal. Co-branded and white-label partners get priority support with dedicated account management for larger partnerships.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="setup" data-testid="accordion-setup">
              <AccordionTrigger>How long does setup take?</AccordionTrigger>
              <AccordionContent>
                Referral partnerships are active immediately. Co-branded partnerships typically take 1-2 business days for branding setup. White-label partnerships take 3-5 business days to configure custom domains and complete branding integration.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="billing" data-testid="accordion-billing">
              <AccordionTrigger>How does billing and payment work?</AccordionTrigger>
              <AccordionContent>
                Revenue sharing and referral commissions are paid monthly via bank transfer. White-label platform fees are billed monthly in advance. All financial reporting is available in real-time through your partner dashboard, with detailed breakdowns of revenue and commissions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancellation" data-testid="accordion-cancellation">
              <AccordionTrigger>Can I cancel my partnership anytime?</AccordionTrigger>
              <AccordionContent>
                Yes, there are no long-term contracts. Partnerships can be cancelled with 30 days notice. Existing memorials created under your partnership will continue to be maintained, ensuring families aren't disrupted. Final payments and settlements are processed within 30 days of cancellation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="training" data-testid="accordion-training">
              <AccordionTrigger>Do you provide training for my staff?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We provide comprehensive training materials, video tutorials, and live training sessions for your team. Partners can invite multiple staff members to their dashboard with appropriate role-based access controls.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 section-bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="h2 mb-6">
              Ready to Partner with SoulBridge?
            </h2>
            <p className="lead text-muted-foreground mb-8">
              Join our growing network of trusted partners and help families create lasting memorials for their loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/partners/signup">
                <Button size="lg" className="text-lg px-12 py-4" data-testid="button-get-started-final">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-lg px-12 py-4" data-testid="button-speak-expert">
                  Speak to an Expert
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Questions? Call us at 041 019 5019 or email partners@soulbridge.co.za
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}