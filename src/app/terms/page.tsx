import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Legal Agreement</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <div className="space-y-8">
              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using SoulBridge ("Service", "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SoulBridge is a digital memorial platform that allows users to create, manage, and share online memorials for deceased loved ones. The Service includes features for uploading content, managing privacy settings, and enabling visitor interactions through guestbooks and tributes.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">User Accounts</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use our Service, you must:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Be at least 13 years of age</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update account information as needed</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Responsibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach. We are not liable for any loss or damage arising from your failure to maintain account security.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Content and Conduct</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You retain ownership of content you upload to memorials. By uploading content, you grant SoulBridge a non-exclusive, worldwide license to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Store and display your content on the Platform</li>
                  <li>Back up and protect your content</li>
                  <li>Make your content accessible according to your privacy settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Content Guidelines</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to upload content that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Is false, misleading, or fraudulent</li>
                  <li>Violates any law or regulation</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains hate speech, harassment, or threats</li>
                  <li>Contains explicit sexual or violent content</li>
                  <li>Contains malware or harmful code</li>
                  <li>Violates others' privacy or publicity rights</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Content Removal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to remove content that violates these Terms or is otherwise objectionable. We may also suspend or terminate accounts that repeatedly violate our guidelines.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Subscription and Payment</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We offer both free and paid subscription plans. Pricing is subject to change with 30 days' notice for existing subscribers. New pricing applies immediately to new subscriptions.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Billing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Paid subscriptions are billed:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>In advance for the subscription period</li>
                  <li>Automatically unless you cancel</li>
                  <li>Using the payment method on file</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Refunds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 30-day money-back guarantee for new subscriptions. After 30 days, refunds are provided at our discretion. Lifetime subscriptions are non-refundable after 30 days.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Cancellation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may cancel your subscription at any time from your dashboard. Cancellation takes effect at the end of the current billing period. You will continue to have access until then.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Memorial Privacy and Access</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You control memorial privacy settings:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Public:</strong> Anyone can view the memorial</li>
                  <li><strong>Unlisted:</strong> Only those with the link can view</li>
                  <li><strong>Private:</strong> Requires your explicit approval</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You are responsible for managing access and privacy settings appropriately.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The SoulBridge platform, including its design, features, and functionality, is owned by SoulBridge and protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Prohibited Uses</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use the Service to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Impersonate any person or entity</li>
                  <li>Engage in unauthorized commercial activities</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Use automated tools to access or scrape content</li>
                  <li>Collect user information without consent</li>
                  <li>Upload viruses or malicious code</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Disclaimers and Limitations</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Service Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to provide uninterrupted service but do not guarantee availability. The Service is provided "as is" without warranties of any kind, express or implied.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, SoulBridge shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Data Loss</h3>
                <p className="text-muted-foreground leading-relaxed">
                  While we implement backup systems, we are not responsible for data loss. We recommend maintaining your own backups of important content.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may terminate or suspend your account immediately, without prior notice, for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees</li>
                  <li>At our sole discretion for business reasons</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Upon termination, your right to use the Service ceases immediately. Memorial content may be deleted according to our data retention policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with South African law. You agree to waive any right to a jury trial or class action.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notice. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Severability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For questions about these Terms of Service, contact us:
                </p>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <p className="text-foreground"><strong>Email:</strong> support@soulbridge.co.za</p>
                  <p className="text-foreground mt-2"><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  By using SoulBridge, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
