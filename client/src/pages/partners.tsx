import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Bring Dignified Digital Memorials 
            <br />
            <span className="text-primary">to Your Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join South Africa's leading funeral service partners who offer families beautiful, culturally relevant digital memorials. Enhance your services, grow your brand, and create lasting legacies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/partners/signup">
              <Button size="lg" className="text-lg px-8 py-3" data-testid="button-apply-now">
                Apply Now
              </Button>
            </Link>
            <Link href="/partners/directory">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" data-testid="button-view-directory">
                View Partner Directory
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Start in under 5 minutes • No setup fees • Cancel anytime
          </p>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30 rounded-3xl mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with SoulBridge in four simple steps and begin offering digital memorials to families immediately.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Sign Up</h3>
              <p className="text-muted-foreground">
                Complete our simple registration with your business details and choose your partnership model.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Choose Branding</h3>
              <p className="text-muted-foreground">
                Set up your branding preferences, from co-branded experiences to full white-label solutions.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Start Publishing</h3>
              <p className="text-muted-foreground">
                Begin creating beautiful memorials for families and manage them through your partner dashboard.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Earn Revenue</h3>
              <p className="text-muted-foreground">
                Receive revenue sharing or referral payments while providing exceptional value to families.
              </p>
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
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Partner with SoulBridge?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your business with digital memorial services that families value and remember.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Reduce Costs</h3>
              <p className="text-muted-foreground">
                No need to build memorial technology in-house. We handle hosting, updates, and support.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Promote Brand</h3>
              <p className="text-muted-foreground">
                Every memorial showcases your business, creating lasting brand impressions with families.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Generate Revenue</h3>
              <p className="text-muted-foreground">
                Earn through revenue sharing, referral commissions, or direct white-label pricing.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🕊️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Dignified Remembrance</h3>
              <p className="text-muted-foreground">
                Help families create beautiful, permanent tributes that honor their loved ones with dignity.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30 rounded-3xl">
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
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join hundreds of funeral service providers across South Africa who trust SoulBridge to help them serve families with dignity and innovation.
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
              Questions? Call us at 011 123 4567 or email partners@soulbridge.co.za
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}