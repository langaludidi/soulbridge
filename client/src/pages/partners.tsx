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
    { icon: "🎯", title: "Easy Integration", description: "Seamlessly integrate digital memorials into your existing funeral service packages." },
    { icon: "📱", title: "Mobile Optimized", description: "All memorials are fully responsive and optimized for mobile viewing and sharing." },
    { icon: "🔒", title: "Secure & Private", description: "Enterprise-grade security with privacy controls that families can trust completely." },
    { icon: "📊", title: "Analytics Dashboard", description: "Track memorial performance, engagement metrics, and revenue through detailed reports." }
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
                  <span className="text-4xl text-white">{type.icon}</span>
                </div>
                <h3 className="h3 mb-3">{type.title}</h3>
                <p className="body text-muted-foreground mb-4">{type.description}</p>
                <div className="text-sm text-primary font-medium">{type.examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Packages Section */}
      <section className="py-16 sm:py-20 section-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              Partnership Packages & Pricing
            </h2>
            <p className="lead text-muted-foreground max-w-3xl mx-auto">
              Choose from our flexible partnership packages designed to grow with your business
            </p>
          </div>

          {/* Starter Package */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Starter Package</h3>
                <Badge variant="secondary" className="mb-6">Perfect for New Partners</Badge>
                
                <div className="text-3xl font-bold text-primary mb-6">R0 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Up to 5 memorials/month</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Co-branded experience</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Basic analytics dashboard</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Email support</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> 20% revenue share</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Training materials</div>
                </div>
                
                <Link href="/partners/signup?model=cobrand&package=starter">
                  <Button className="w-full" data-testid="button-choose-starter">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Package */}
            <Card className="relative overflow-hidden border-2 border-primary hover:shadow-xl transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Professional Package</h3>
                <Badge variant="default" className="mb-6">Best Value</Badge>
                
                <div className="text-3xl font-bold text-primary mb-6">R299 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Unlimited memorials</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Full co-branded experience</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Advanced analytics & reports</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Priority phone & email support</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> 30% revenue share</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Custom branding options</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Marketing materials & templates</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Team member accounts (up to 5)</div>
                </div>
                
                <Link href="/partners/signup?model=cobrand&package=professional">
                  <Button className="w-full" data-testid="button-choose-professional">
                    Choose Professional
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise Package</h3>
                <Badge variant="outline" className="mb-6">Custom Solution</Badge>
                
                <div className="text-3xl font-bold text-primary mb-6">Custom <span className="text-sm font-normal text-muted-foreground">pricing</span></div>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> White-label solution</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Custom domain setup</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Complete brand control</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Dedicated account manager</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Custom revenue sharing</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> API access & integrations</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> Unlimited team members</div>
                  <div className="flex items-center text-sm"><span className="text-green-500 mr-2">✓</span> 24/7 priority support</div>
                </div>
                
                <Link href="/contact?subject=enterprise">
                  <Button variant="outline" className="w-full" data-testid="button-choose-enterprise">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
                <li>• 20-30% revenue sharing</li>
                <li>• Joint marketing opportunities</li>
                <li>• Shared customer support</li>
                <li>• Quick setup (1-2 days)</li>
                <li>• Training & onboarding included</li>
                <li>• Marketing materials provided</li>
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
                <li>• Complete branding control</li>
                <li>• Custom domain (memorials.yourname.com)</li>
                <li>• White-label pricing flexibility</li>
                <li>• Direct customer relationship</li>
                <li>• Professional setup (3-5 days)</li>
                <li>• SSL certificates included</li>
                <li>• Dedicated account manager</li>
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
                <li>• R500-R1500 per conversion</li>
                <li>• No ongoing management</li>
                <li>• Marketing materials provided</li>
                <li>• Instant setup & activation</li>
                <li>• Monthly payout via EFT</li>
                <li>• Performance bonuses available</li>
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

      {/* Special Offers Section */}
      <section className="py-16 sm:py-20 section-bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              Special Partnership Offers
            </h2>
            <p className="lead text-muted-foreground max-w-3xl mx-auto">
              Limited-time offers designed to help you get started and grow faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Launch Bonus Offer */}
            <Card className="relative overflow-hidden border-2 border-primary">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold rounded-bl-lg">
                Limited Time
              </div>
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Launch Bonus</h3>
                <p className="text-muted-foreground mb-6">
                  Start your partnership with a head start. Get your first month free plus additional bonuses to help you succeed.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm"><span className="text-primary mr-2">•</span> First month completely free (Professional Package)</div>
                  <div className="flex items-center text-sm"><span className="text-primary mr-2">•</span> R2,000 marketing credit for online advertising</div>
                  <div className="flex items-center text-sm"><span className="text-primary mr-2">•</span> Free professional logo design service</div>
                  <div className="flex items-center text-sm"><span className="text-primary mr-2">•</span> Dedicated onboarding specialist</div>
                  <div className="flex items-center text-sm"><span className="text-primary mr-2">•</span> Priority placement in partner directory</div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Valid until March 31, 2025
                </Badge>
              </CardContent>
            </Card>

            {/* Volume Discount Offer */}
            <Card className="relative overflow-hidden border-2">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Volume Rewards Program</h3>
                <p className="text-muted-foreground mb-6">
                  The more memorials you create, the more you earn. Our tiered reward system increases your revenue share as you grow.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span>5-10 memorials/month:</span>
                    <Badge variant="outline">25% revenue share</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>11-25 memorials/month:</span>
                    <Badge variant="secondary">30% revenue share</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>25+ memorials/month:</span>
                    <Badge variant="default">35% revenue share</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>50+ memorials/month:</span>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white">40% revenue share</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <span className="text-3xl text-white">{benefit.icon}</span>
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
                We offer flexible pricing to suit every business. Our Starter Package is completely free with basic features and 20% revenue share. The Professional Package is R299/month with unlimited memorials and 30% revenue share. Enterprise solutions have custom pricing with white-label options. No setup fees or long-term contracts required - you can start free and upgrade anytime.
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
                Revenue sharing and referral commissions are paid monthly via EFT bank transfer on the last business day of each month. Professional Package fees are billed monthly in advance via debit order or credit card. All financial reporting is available in real-time through your partner dashboard, with detailed breakdowns of revenue, commissions, and payment history. Minimum payout threshold is R100.
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
                Absolutely. We provide comprehensive training including: video tutorials for all features, live onboarding sessions, downloadable training materials, and ongoing support. Partners can invite unlimited staff members (Professional+ packages) with role-based access controls. We also offer on-site training for Enterprise partners and quarterly webinars to keep your team updated on new features.
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