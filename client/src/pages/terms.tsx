import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Use - SoulBridge Memorial Platform";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'SoulBridge Terms of Use - Digital memorial platform terms and conditions, subscription plans, and legal agreements for South African families.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'SoulBridge Terms of Use - Digital memorial platform terms and conditions, subscription plans, and legal agreements for South African families.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Terms of Use
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using SoulBridge services
            </p>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-last-updated">
              Last updated: 11 September 2025
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
            
            {/* Acceptance */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using SoulBridge ("the Platform"), operated by SoulBridge (Pty) Ltd (registration number pending), 
                you accept and agree to be bound by the terms and provision of this agreement. These Terms of Use are governed by 
                South African law, including the Electronic Communications and Transactions Act 25 of 2002 and the Protection of 
                Personal Information Act 4 of 2013 (POPIA).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you do not agree to abide by the above, please do not use this service. Your continued use of the Platform 
                constitutes acceptance of these terms as they may be modified from time to time.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge provides digital memorial services that allow families and individuals to create, maintain, and share 
                online tributes to deceased loved ones. Our services include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Digital memorial page creation and hosting</li>
                <li>Photo and video upload and storage</li>
                <li>Guest book and tribute collection</li>
                <li>Memorial sharing and notification services</li>
                <li>Order of Service creation and download tools</li>
                <li>Partner directory services for funeral service providers</li>
              </ul>
            </div>

            {/* Subscription Plans */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">3. Subscription Plans and Pricing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge offers the following subscription plans, with prices displayed in South African Rand (ZAR):
              </p>
              
              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Available Plans:</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Remember (Free):</strong> Basic memorial creation with limited features
                  </div>
                  <div>
                    <strong className="text-foreground">Honour (R49/month):</strong> Enhanced memorial features with photo galleries and guest book
                  </div>
                  <div>
                    <strong className="text-foreground">Legacy (R99/month):</strong> Premium features including video uploads and custom themes
                  </div>
                  <div>
                    <strong className="text-foreground">Family Vault (R199/month):</strong> Comprehensive family memorial management with unlimited storage
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Payments are processed through secure payment providers including Paystack and Netcash. All subscriptions 
                automatically renew unless cancelled. You may cancel your subscription at any time through your account 
                settings, with cancellation taking effect at the end of your current billing period.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Prices are subject to change with 30 days' advance notice. VAT (Value Added Tax) will be added where applicable 
                according to South African tax regulations.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">4. User Responsibilities and Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using SoulBridge, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Provide accurate and truthful information</li>
                <li>Respect the dignity and memory of the deceased</li>
                <li>Upload only content you have the right to share</li>
                <li>Maintain appropriate and respectful language in all content</li>
                <li>Comply with South African laws and cultural sensitivities</li>
                <li>Protect your account credentials and notify us of any unauthorized access</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">Prohibited Content:</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Content that is defamatory, abusive, or disrespectful</li>
                <li>Copyrighted material without proper authorization</li>
                <li>False information about the deceased or their family</li>
                <li>Commercial advertising or spam content</li>
                <li>Content that violates any South African law or regulation</li>
                <li>Inappropriate or offensive material that may cause distress</li>
              </ul>
            </div>

            {/* Content Moderation */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">5. Content Moderation and Removal</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge reserves the right to review, monitor, and remove any content that violates these terms or is 
                deemed inappropriate. We employ both automated systems and human review processes to ensure content quality 
                and appropriateness.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Content may be removed immediately if it:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Violates these Terms of Use</li>
                <li>Is reported by other users as inappropriate</li>
                <li>Contains illegal content under South African law</li>
                <li>Infringes on intellectual property rights</li>
                <li>Is deemed harmful to the SoulBridge community</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Users may appeal content removal decisions by contacting our support team at 
                <Link href="/contact">
                  <span className="text-primary hover:underline cursor-pointer" data-testid="link-contact-support">
                    support@soulbridge.co.za
                  </span>
                </Link>
              </p>
            </div>

            {/* Privacy and Data Protection */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">6. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed 
                by our Privacy Policy, which complies with POPIA (Protection of Personal Information Act 4 of 2013) and other 
                applicable South African privacy laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using SoulBridge, you consent to the collection and use of your information as outlined in our 
                <Link href="/privacy">
                  <span className="text-primary hover:underline cursor-pointer" data-testid="link-privacy-policy">
                    Privacy Policy
                  </span>
                </Link>
                . You have rights regarding your personal information, including the right to access, correct, and delete your data.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">7. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge and its licensors own all intellectual property rights in the Platform, including but not limited to 
                software, design, text, graphics, and trademarks. Users retain ownership of content they upload but grant 
                SoulBridge a license to use such content for the purpose of providing our services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may not reproduce, distribute, or create derivative works from any part of the Platform without explicit 
                written permission from SoulBridge (Pty) Ltd.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge provides services "as is" without warranties of any kind. To the maximum extent permitted by 
                South African law, we disclaim all warranties, express or implied, including but not limited to warranties 
                of merchantability and fitness for a particular purpose.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We shall not be liable for any indirect, incidental, special, or consequential damages arising from your 
                use of our services, including but not limited to loss of data, emotional distress, or lost profits.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability to you for any damages shall not exceed the amount you have paid to SoulBridge in the 
                twelve months preceding the claim.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Either party may terminate this agreement at any time. You may delete your account through your account 
                settings. We may suspend or terminate your account if you violate these terms or engage in conduct that 
                we deem harmful to the Platform or other users.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your access to the Platform will cease, but memorial content may be preserved according 
                to our data retention policies and the specific subscription plan terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">10. Governing Law and Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Use are governed by the laws of South Africa. Any disputes arising from or relating to these 
                terms shall be subject to the exclusive jurisdiction of the South African courts.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before pursuing legal action, parties are encouraged to attempt resolution through good faith negotiation. 
                If direct negotiation fails, disputes may be submitted to mediation through the Arbitration Foundation of 
                Southern Africa (AFSA).
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge reserves the right to modify these Terms of Use at any time. Users will be notified of material 
                changes via email or through prominent notice on the Platform at least 30 days before the changes take effect.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your continued use of the Platform after the effective date of changes constitutes acceptance of the modified terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms of Use, please contact us:
              </p>
              <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                <div className="space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">SoulBridge (Pty) Ltd</strong></p>
                  <p>Email: support@soulbridge.co.za</p>
                  <p>Phone: 041 019 5019</p>
                  <p>Address: 14a Pickering Street, Newton Park, Port Elizabeth</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-primary/5 dark:bg-primary/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you understand your rights and responsibilities
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button data-testid="button-contact-us">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="outline" data-testid="button-view-faq">
                    View FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}