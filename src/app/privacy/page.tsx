import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Privacy Matters</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Privacy Policy
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
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At SoulBridge, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our memorial creation platform.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Information We Collect</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Name and email address</li>
                  <li>Password (encrypted)</li>
                  <li>Account preferences and settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Memorial Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Content you create and upload to memorials, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Photos, videos, and audio files</li>
                  <li>Obituaries and written tributes</li>
                  <li>Timeline events and family relationships</li>
                  <li>Guestbook messages and tributes</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Usage Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We automatically collect certain information about your device and how you interact with our platform:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Browser type and version</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Date and time of visits</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide and maintain our memorial creation services</li>
                  <li>Process your account registration and authentication</li>
                  <li>Store and display memorial content according to your privacy settings</li>
                  <li>Send you service-related notifications and updates</li>
                  <li>Respond to your support requests and inquiries</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Information Sharing and Disclosure</h2>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Public Memorials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Content in public memorials is visible to anyone who visits the memorial URL. You control the privacy settings for each memorial.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may share your information with trusted third-party service providers who assist us in operating our platform, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>Cloud storage providers (for storing memorial content)</li>
                  <li>Payment processors (for handling subscriptions)</li>
                  <li>Email service providers (for notifications)</li>
                  <li>Analytics providers (for improving our services)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Legal Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law, court order, or governmental authority, or to protect our rights, property, or safety.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Encrypted password storage</li>
                  <li>Secure cloud storage with enterprise-grade security</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Your Privacy Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Request export of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, contact us at support@soulbridge.co.za.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze platform usage and performance</li>
                  <li>Improve user experience</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as your account is active or as needed to provide services. Memorial content is retained according to your subscription plan. You can delete your account and associated data at any time from your dashboard settings.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and stored on servers located outside your country of residence. By using our services, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a notice on our platform. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <p className="text-foreground"><strong>Email:</strong> support@soulbridge.co.za</p>
                  <p className="text-foreground mt-2"><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
