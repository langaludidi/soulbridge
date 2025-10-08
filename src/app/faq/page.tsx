import { Card } from "@/components/ui/card";
import { HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const categories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create a memorial?",
          answer:
            "Sign up for a free account, then click 'Create Memorial' from your dashboard. Our step-by-step wizard guides you through adding photos, writing an obituary, and customizing the memorial page. You can save your progress as a draft and return anytime.",
        },
        {
          question: "Do I need technical skills to use SoulBridge?",
          answer:
            "No technical skills required! SoulBridge is designed to be as simple as using social media. If you can upload photos and write text, you can create a beautiful memorial.",
        },
        {
          question: "How long does it take to create a memorial?",
          answer:
            "A basic memorial can be created in 10-15 minutes. However, you can take as much time as you need. Save it as a draft and add more content over time.",
        },
      ],
    },
    {
      title: "Features & Functionality",
      faqs: [
        {
          question: "What can I include in a memorial?",
          answer:
            "You can include photos, videos, obituaries, life timeline events, family relationships, background music, memorial service details, guestbook for tributes, and more. The platform is designed to capture a complete picture of your loved one's life.",
        },
        {
          question: "Can I add videos to the memorial?",
          answer:
            "Yes! You can upload videos in MP4 or WebM format. Videos are a beautiful way to share memories and moments from your loved one's life.",
        },
        {
          question: "How do I add background music?",
          answer:
            "In the Gallery step, upload an audio file (MP3 or WAV) and mark it as 'Background Audio'. The music will play softly when visitors view the memorial page.",
        },
        {
          question: "Can visitors leave messages?",
          answer:
            "Yes! If you enable the guestbook feature, visitors can leave condolences and share their memories. You'll receive email notifications when new tributes are posted.",
        },
      ],
    },
    {
      title: "Privacy & Sharing",
      faqs: [
        {
          question: "Who can see the memorial?",
          answer:
            "You control who sees the memorial with three privacy options: Public (anyone can view), Unlisted (only people with the link), or Private (requires your approval). You can change privacy settings anytime.",
        },
        {
          question: "How do I share the memorial?",
          answer:
            "Each memorial has a unique URL and QR code. Share the link via email, social media, or messaging apps. The QR code can be printed for funeral programs or memorial cards.",
        },
        {
          question: "Can I prevent certain people from viewing?",
          answer:
            "With the Private setting, you control who can view the memorial. Only people you explicitly approve will have access.",
        },
      ],
    },
    {
      title: "Pricing & Plans",
      faqs: [
        {
          question: "Is there a free plan?",
          answer:
            "Yes! We offer a free plan that includes one memorial with all basic features. It's perfect for trying out the platform or creating a single memorial.",
        },
        {
          question: "What's included in paid plans?",
          answer:
            "Paid plans include multiple memorials, priority support, advanced customization options, and unlimited storage for photos and videos. See our pricing page for detailed comparisons.",
        },
        {
          question: "Can I upgrade or downgrade anytime?",
          answer:
            "Yes! You can change your plan at any time. If you upgrade, you'll have immediate access to additional features. Downgrades take effect at the end of your current billing period.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor. All transactions are encrypted and PCI-compliant.",
        },
      ],
    },
    {
      title: "Managing Memorials",
      faqs: [
        {
          question: "Can I edit a memorial after publishing?",
          answer:
            "Absolutely! You can edit any aspect of the memorial at any time - add photos, update text, manage events, or change privacy settings.",
        },
        {
          question: "Can I delete a memorial?",
          answer:
            "Yes, you can delete memorials from your dashboard. Once deleted, the memorial is permanently removed and cannot be recovered.",
        },
        {
          question: "Can multiple people manage a memorial?",
          answer:
            "Currently, only the memorial creator can edit it. We're working on adding collaboration features in future updates.",
        },
        {
          question: "How long will the memorial stay online?",
          answer:
            "Memorials remain online as long as your subscription is active. With our Lifetime plan, your memorial will be preserved permanently.",
        },
      ],
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "What if I encounter a problem?",
          answer:
            "Contact us via email at support@soulbridge.co.za or use our contact form. We respond to all inquiries within 24 hours during business days.",
        },
        {
          question: "What browsers are supported?",
          answer:
            "SoulBridge works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.",
        },
        {
          question: "Can I use SoulBridge on mobile?",
          answer:
            "Yes! SoulBridge is fully responsive and works beautifully on phones and tablets. Create and manage memorials from any device.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the sign-in page. You'll receive an email with instructions to reset your password.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <HelpCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Help Center</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about creating and managing memorial pages
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary/20">
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed pl-8">
                        {faq.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
