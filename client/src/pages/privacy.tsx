import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - SoulBridge Memorial Platform";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'SoulBridge Privacy Policy - POPIA compliant privacy policy for our digital memorial platform. Learn how we protect your personal information and data rights in South Africa.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'SoulBridge Privacy Policy - POPIA compliant privacy policy for our digital memorial platform. Learn how we protect your personal information and data rights in South Africa.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-last-updated">
              Last updated: 11 September 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulBridge (Pty) Ltd ("we," "our," or "us") is committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                digital memorial platform and services ("SoulBridge" or "the Platform").
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This policy complies with the Protection of Personal Information Act 4 of 2013 (POPIA), the Electronic 
                Communications and Transactions Act 25 of 2002, and other applicable South African privacy laws. As the 
                responsible party under POPIA, we are committed to processing your personal information lawfully, fairly, 
                and transparently.
              </p>
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-foreground font-medium mb-2">POPIA Compliance Statement</p>
                <p className="text-muted-foreground text-sm">
                  This privacy policy has been designed to comply with POPIA requirements. If you have questions about your 
                  data subject rights or wish to exercise them, please contact our Information Officer using the details provided below.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Personal Information You Provide</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                <li><strong>Profile Information:</strong> Profile picture, biographical information, location (province/city)</li>
                <li><strong>Memorial Content:</strong> Photos, videos, stories, tributes, and other memorial-related content</li>
                <li><strong>Deceased Person Information:</strong> Name, dates, biographical information, photos</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through Paystack/Netcash)</li>
                <li><strong>Communication Data:</strong> Messages you send us, feedback, support requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li><strong>Usage Data:</strong> Pages visited, time spent, features used, search queries</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> Session data, preferences, authentication tokens</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Information from Third Parties</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may receive information from payment processors (Paystack, Netcash) regarding transaction status and 
                from social media platforms if you choose to share memorial content on social networks.
              </p>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We process your personal information for the following lawful purposes under POPIA:
              </p>
              
              <div className="space-y-6">
                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Provision (Contractual Necessity)</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Creating and maintaining your memorial pages</li>
                    <li>Processing payments and managing subscriptions</li>
                    <li>Providing customer support and technical assistance</li>
                    <li>Delivering requested services and features</li>
                  </ul>
                </div>

                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Legitimate Interest</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Improving our services and user experience</li>
                    <li>Preventing fraud and ensuring platform security</li>
                    <li>Analyzing usage patterns and platform performance</li>
                    <li>Content moderation and community safety</li>
                  </ul>
                </div>

                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Consent (Where Applicable)</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Marketing communications and newsletters</li>
                    <li>Optional data sharing with partner service providers</li>
                    <li>Social media integration features</li>
                  </ul>
                </div>

                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Legal Compliance</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Complying with South African laws and regulations</li>
                    <li>Responding to legal requests and court orders</li>
                    <li>Tax reporting and financial record keeping</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <ul className="list-disc pl-6 text-muted-foreground space-y-3 mb-6">
                <li>
                  <strong className="text-foreground">Service Providers:</strong> With trusted third-party service providers 
                  (hosting, payment processing, analytics) under strict data processing agreements
                </li>
                <li>
                  <strong className="text-foreground">Legal Requirements:</strong> When required by South African law, 
                  court order, or to protect our legal rights
                </li>
                <li>
                  <strong className="text-foreground">Emergency Situations:</strong> To protect the safety and security 
                  of users or the public
                </li>
                <li>
                  <strong className="text-foreground">Business Transfers:</strong> In connection with merger, acquisition, 
                  or sale of business assets (with notice to affected users)
                </li>
                <li>
                  <strong className="text-foreground">Partner Directory:</strong> Limited business information may be shared 
                  with verified funeral service partners (with your explicit consent)
                </li>
              </ul>

              <div className="bg-secondary/10 dark:bg-secondary/20 p-6 rounded-lg border-l-4 border-secondary">
                <p className="text-foreground font-medium mb-2">Cross-Border Data Transfers</p>
                <p className="text-muted-foreground text-sm">
                  Some of our service providers may be located outside South Africa. When transferring data internationally, 
                  we ensure adequate protection through appropriate safeguards as required by POPIA.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Technical Safeguards</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted data storage</li>
                    <li>Secure authentication systems</li>
                    <li>Regular security monitoring</li>
                    <li>Automated backup systems</li>
                  </ul>
                </div>
                
                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Organizational Measures</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Staff privacy training</li>
                    <li>Access controls and permissions</li>
                    <li>Regular security audits</li>
                    <li>Incident response procedures</li>
                    <li>Vendor security agreements</li>
                  </ul>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                While we strive to protect your personal information, no method of transmission or storage is 100% secure. 
                If you have reason to believe that your account security has been compromised, please contact us immediately.
              </p>
            </div>

            {/* Data Subject Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">6. Your Rights Under POPIA</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a data subject under POPIA, you have the following rights regarding your personal information:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Right of Access</h3>
                  <p className="text-muted-foreground text-sm">
                    Request confirmation of whether we process your personal information and access to such information
                  </p>
                </div>
                
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Right to Correction</h3>
                  <p className="text-muted-foreground text-sm">
                    Request correction or updating of inaccurate or incomplete personal information
                  </p>
                </div>
                
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Right to Deletion</h3>
                  <p className="text-muted-foreground text-sm">
                    Request deletion of personal information (subject to legal and contractual obligations)
                  </p>
                </div>
                
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Right to Object</h3>
                  <p className="text-muted-foreground text-sm">
                    Object to the processing of your personal information on reasonable grounds
                  </p>
                </div>
                
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Right to Data Portability</h3>
                  <p className="text-muted-foreground text-sm">
                    Request a copy of your personal information in a machine-readable format
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                To exercise any of these rights, please contact our Information Officer using the details provided in Section 9. 
                We will respond to your request within 30 days as required by POPIA.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                unless a longer retention period is required or permitted by law:
              </p>
              
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li><strong>Account Information:</strong> Until account deletion plus 1 year for legal compliance</li>
                <li><strong>Memorial Content:</strong> Permanently preserved as per memorial service purpose, unless deletion requested</li>
                <li><strong>Payment Records:</strong> 5 years as required by South African tax and financial regulations</li>
                <li><strong>Communication Records:</strong> 3 years for customer service and legal purposes</li>
                <li><strong>Analytics Data:</strong> Anonymized after 2 years, aggregated data retained indefinitely</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                Memorial content represents a unique category of information intended for permanent preservation. However, 
                memorial creators retain the right to request content modification or removal, subject to family member 
                notification procedures.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    Required for basic platform functionality, user authentication, and security
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    Help us understand how users interact with our platform to improve services
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    Remember your settings and preferences for a better user experience
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                You can control cookie settings through your browser, but disabling certain cookies may affect platform functionality. 
                We obtain consent for non-essential cookies as required by applicable law.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">9. Contact Information and Complaints</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Information Officer</h3>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p><strong>SoulBridge (Pty) Ltd</strong></p>
                    <p>Information Officer: Privacy Team</p>
                    <p>Email: privacy@soulbridge.co.za</p>
                    <p>Phone: 041 019 5019</p>
                    <p>Address: 14a Pickering Street<br />Newton Park, Port Elizabeth<br />South Africa</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Information Regulator</h3>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p><strong>Information Regulator South Africa</strong></p>
                    <p>Email: enquiries@inforegulator.org.za</p>
                    <p>Phone: +27 12 406 4818</p>
                    <p>Website: www.inforegulator.org.za</p>
                    <p>Address: 33 Hoofd Street<br />Forum III, 3rd Floor Braampark<br />Braamfontein, Johannesburg, 2001</p>
                  </div>
                </div>
              </div>

              <div className="bg-destructive/10 dark:bg-destructive/20 p-6 rounded-lg border-l-4 border-destructive">
                <p className="text-foreground font-medium mb-2">Privacy Complaints</p>
                <p className="text-muted-foreground text-sm">
                  If you believe we have not handled your personal information properly, you may contact our Information Officer 
                  first. If you remain unsatisfied, you have the right to lodge a complaint with the Information Regulator 
                  using the contact details above.
                </p>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                requirements, or other factors. When we make material changes, we will:
              </p>
              
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Update the "Last Updated" date at the top of this policy</li>
                <li>Notify users via email or prominent platform notice</li>
                <li>Provide 30 days' advance notice for material changes</li>
                <li>Seek additional consent where required by law</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                Your continued use of SoulBridge after policy updates constitutes acceptance of the revised policy, 
                unless additional consent is required for specific changes.
              </p>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-primary/5 dark:bg-primary/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Questions About Your Privacy?</h3>
              <p className="text-muted-foreground mb-6">
                Our Information Officer is available to help you understand and exercise your privacy rights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button data-testid="button-contact-privacy">
                    Contact Information Officer
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" data-testid="button-view-terms">
                    View Terms of Use
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