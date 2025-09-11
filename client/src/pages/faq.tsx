import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Search, CreditCard, Users, Shield, Heart, Settings, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Frequently Asked Questions - SoulBridge Memorial Platform";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'SoulBridge FAQ - Answers to common questions about digital memorials, subscription plans, payments, cultural sensitivity, and memorial features for South African families.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'SoulBridge FAQ - Answers to common questions about digital memorials, subscription plans, payments, cultural sensitivity, and memorial features for South African families.';
      document.head.appendChild(meta);
    }
  }, []);

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: HelpCircle,
      color: "bg-primary/10 text-primary",
      count: 8
    },
    {
      id: "subscriptions",
      title: "Subscriptions & Billing",
      icon: CreditCard,
      color: "bg-secondary/10 text-secondary",
      count: 12
    },
    {
      id: "features",
      title: "Features & Capabilities",
      icon: Settings,
      color: "bg-accent/10 text-accent",
      count: 10
    },
    {
      id: "cultural",
      title: "Cultural Sensitivity",
      icon: Heart,
      color: "bg-destructive/10 text-destructive",
      count: 6
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      color: "bg-muted/50 text-muted-foreground",
      count: 7
    },
    {
      id: "community",
      title: "Community Guidelines",
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      count: 5
    }
  ];

  const faqData = {
    "getting-started": [
      {
        question: "How do I create my first memorial?",
        answer: "Getting started with SoulBridge is simple. First, sign up for an account and choose a subscription plan that fits your needs. Then, click 'Create Memorial' and fill in the basic information about your loved one. You can add photos, write their story, and invite family and friends to contribute. Our platform guides you through each step with helpful prompts and cultural considerations."
      },
      {
        question: "What's the difference between free and paid plans?",
        answer: "Our Remember plan (Free) allows you to create one basic memorial with limited photos and features. Paid plans offer enhanced capabilities: Honour (R49/month) includes photo galleries and guest books, Legacy (R99/month) adds video uploads and custom themes, and Family Vault (R199/month) provides unlimited memorials and advanced family management tools."
      },
      {
        question: "Can I create memorials for pets?",
        answer: "Yes, SoulBridge welcomes pet memorials. We understand that pets are beloved family members, and you can create beautiful tributes for them using the same features available for human memorials. Our platform respects all forms of loss and grief."
      },
      {
        question: "How long does it take to set up a memorial?",
        answer: "A basic memorial can be created in 10-15 minutes. However, we recommend taking your time to thoughtfully craft the content. You can always save your progress and return later to add more photos, stories, and tributes. Many families spend several hours over a few days to create a comprehensive memorial."
      },
      {
        question: "Can I create a memorial before someone passes away?",
        answer: "Yes, SoulBridge allows you to create 'living memorials' or 'celebration of life' pages for people who are still with us but may be facing terminal illness. This can be a beautiful way to collect memories and messages while your loved one can still see and appreciate them."
      },
      {
        question: "What if I make a mistake in the memorial information?",
        answer: "You can edit memorial information at any time through your account dashboard. We understand that details may need to be corrected or updated, and our platform makes it easy to make changes. If you need help with edits, our support team is always available to assist."
      },
      {
        question: "How do I invite others to contribute to the memorial?",
        answer: "You can invite family and friends by email directly through the platform, or share the memorial link via social media, WhatsApp, or other messaging platforms. Contributors can add photos, write tributes, and sign the guest book without needing to create an account."
      },
      {
        question: "Can I print the memorial content?",
        answer: "Yes, all subscription plans include the ability to generate and print memorial content. You can create PDF versions of the memorial page, guest book entries, and photo collections for physical keepsakes or funeral programs."
      }
    ],
    "subscriptions": [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards through our secure payment partners Paystack and Netcash. This includes Visa, Mastercard, and American Express. We also support EFT (Electronic Funds Transfer) for South African bank accounts. All payments are processed securely and we never store your card details on our servers."
      },
      {
        question: "Can I change my subscription plan at any time?",
        answer: "Yes, you can upgrade or downgrade your subscription at any time through your account settings. When you upgrade, the new features become available immediately and you'll be charged a prorated amount. When you downgrade, the change takes effect at the end of your current billing cycle to ensure you get full value from your current plan."
      },
      {
        question: "What happens if I cancel my subscription?",
        answer: "If you cancel your subscription, your memorial will remain accessible but you'll lose access to premium features at the end of your billing period. Your basic memorial content will be preserved according to our data retention policy. You can reactivate your subscription at any time to regain access to premium features."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund. After 30 days, refunds are handled on a case-by-case basis, particularly in cases of technical issues or exceptional circumstances."
      },
      {
        question: "Is there a family discount available?",
        answer: "Yes! Our Family Vault plan (R199/month) is designed for families who want to create multiple memorials and is significantly more cost-effective than individual plans. We also offer compassionate pricing for families experiencing financial hardship - please contact our support team to discuss options."
      },
      {
        question: "How does billing work for annual subscriptions?",
        answer: "Annual subscriptions are billed once per year and offer a 20% discount compared to monthly billing. Your subscription will auto-renew each year unless you cancel. You'll receive reminder emails 30 days and 7 days before renewal to give you time to make any changes to your plan."
      },
      {
        question: "Can I pause my subscription temporarily?",
        answer: "We understand that there may be times when you need to pause your subscription. Contact our support team to discuss temporary suspension options. We offer compassionate holds for financial hardship or personal circumstances, ensuring your memorial remains accessible during difficult times."
      },
      {
        question: "What happens to my memorial if I don't pay?",
        answer: "We provide a 30-day grace period for late payments, during which your memorial remains fully accessible. After this period, premium features are suspended but your basic memorial content is preserved. We'll work with you to resolve payment issues and never delete memorial content due to billing problems."
      },
      {
        question: "Do you charge extra for storage space?",
        answer: "Our subscription plans include generous storage allowances. The Remember plan includes 100MB, Honour includes 1GB, Legacy includes 5GB, and Family Vault includes unlimited storage. We never charge surprise overage fees - if you approach your limit, we'll contact you to discuss upgrade options."
      },
      {
        question: "Can I get an invoice for my subscription?",
        answer: "Yes, we provide detailed invoices for all subscriptions that can be downloaded from your account dashboard. These invoices include all necessary information for expense reporting or tax purposes. VAT is included where applicable according to South African tax regulations."
      },
      {
        question: "Is there a student or senior citizen discount?",
        answer: "We offer compassionate pricing for students, senior citizens, and those experiencing financial hardship. Contact our support team with documentation of your status to discuss available discounts. We believe everyone should have access to meaningful memorial services regardless of financial circumstances."
      },
      {
        question: "How do I update my payment information?",
        answer: "You can update your payment information at any time through your account settings. Navigate to the 'Billing' section and click 'Update Payment Method'. Your new payment method will be securely stored and used for future billing cycles."
      }
    ],
    "features": [
      {
        question: "What types of content can I upload to a memorial?",
        answer: "You can upload photos (JPEG, PNG), videos (MP4, MOV), documents (PDF), and audio recordings (MP3, WAV). Our Legacy and Family Vault plans support larger file sizes and more file types. All content is stored securely and can be downloaded by authorized family members."
      },
      {
        question: "Can I customize the appearance of the memorial?",
        answer: "Yes! Our Legacy and Family Vault plans include custom themes, color schemes, and layout options. You can choose from designs that reflect your loved one's personality or cultural background. Our themes include options suitable for different South African traditions and religious backgrounds."
      },
      {
        question: "How does the guest book feature work?",
        answer: "The guest book allows visitors to leave messages, share memories, and upload photos. Available on Honour, Legacy, and Family Vault plans, guest book entries can be moderated by the memorial creator to ensure appropriate content. Entries can be printed and compiled into a physical keepsake book."
      },
      {
        question: "Can I create a timeline of my loved one's life?",
        answer: "Yes, our timeline feature (available on Legacy and Family Vault plans) allows you to create a chronological journey through your loved one's life. Add milestones, achievements, photos, and stories organized by date. This creates a beautiful, comprehensive life story."
      },
      {
        question: "Is there a mobile app available?",
        answer: "SoulBridge is built as a responsive web application that works perfectly on mobile devices through your browser. You can access all features, upload content, and manage memorials from your smartphone or tablet. A dedicated mobile app is planned for future release."
      },
      {
        question: "Can I share the memorial on social media?",
        answer: "Yes, you can easily share memorial pages on Facebook, Twitter, WhatsApp, and other social platforms. You control the privacy settings and can choose whether the memorial is publicly accessible or restricted to invited family and friends only."
      },
      {
        question: "How do I create funeral programs and order of service documents?",
        answer: "Our Order of Service feature (available on all plans) provides templates for creating beautiful funeral programs. Choose from culturally appropriate designs, add your content, and download print-ready PDFs. Templates are available for various religious and cultural traditions common in South Africa."
      },
      {
        question: "Can family members contribute to the memorial from different locations?",
        answer: "Absolutely! SoulBridge is designed for families spread across South Africa and around the world. Family members can contribute photos, stories, and memories from anywhere with an internet connection. Real-time notifications keep everyone updated on new contributions."
      },
      {
        question: "What happens to the memorial after the funeral?",
        answer: "The memorial becomes a permanent tribute that family and friends can visit anytime. You can continue adding new memories, anniversary tributes, and birthday messages. Many families use their memorial as an ongoing celebration of their loved one's life and legacy."
      },
      {
        question: "Can I backup or export my memorial content?",
        answer: "Yes, all subscription plans include the ability to export your memorial content. You can download a complete backup including all photos, videos, stories, and guest book entries. This ensures your precious memories are preserved even if you cancel your subscription."
      }
    ],
    "cultural": [
      {
        question: "Does SoulBridge respect different religious and cultural traditions?",
        answer: "Yes, SoulBridge is designed to honor all South African cultures and religions. We offer templates and guidance for Christian, Muslim, Jewish, Hindu, traditional African, and other cultural traditions. Our platform includes culturally appropriate themes, language options, and memorial formats that respect diverse customs and beliefs."
      },
      {
        question: "Can I create a memorial in languages other than English?",
        answer: "Yes, you can create memorials in Afrikaans, isiZulu, isiXhosa, Sesotho, and other South African languages. Our platform supports multiple languages, and you can mix languages within a single memorial to reflect your family's linguistic diversity. We're continuously adding support for more local languages."
      },
      {
        question: "Are there specific templates for traditional African ceremonies?",
        answer: "Yes, we offer templates that honor traditional African customs including ancestral ceremonies, cleansing rituals, and cultural celebrations of life. These templates respect traditional practices while providing modern digital preservation of memories and customs."
      },
      {
        question: "How do you handle religious symbols and imagery?",
        answer: "Our platform includes a wide variety of religious symbols and imagery appropriate for different faiths. You can add Christian crosses, Islamic crescents, Jewish stars, Hindu symbols, and traditional African spiritual symbols. All imagery is used respectfully and in consultation with religious communities."
      },
      {
        question: "Can I include traditional music or prayers in the memorial?",
        answer: "Yes, you can upload traditional songs, hymns, prayers, and spiritual recordings to your memorial. Our audio features support praise songs, traditional chants, religious readings, and personal recordings. This helps preserve the spiritual and cultural elements that were important to your loved one."
      },
      {
        question: "Does SoulBridge provide guidance on cultural etiquette for online memorials?",
        answer: "Yes, we provide cultural guidance and etiquette tips for creating respectful online memorials. Our writing guide includes suggestions for different cultural contexts, appropriate language, and customs to consider when sharing memories publicly. We also offer community moderation to ensure cultural sensitivity."
      }
    ],
    "privacy": [
      {
        question: "How secure is my family's information on SoulBridge?",
        answer: "SoulBridge uses bank-level security measures including SSL encryption, secure data centers, and regular security audits. We comply with POPIA (Protection of Personal Information Act) and international privacy standards. Your memorial content is backed up securely and protected against unauthorized access."
      },
      {
        question: "Who can see the memorial I create?",
        answer: "You have complete control over who can see your memorial. You can make it public, private to invited family and friends only, or password-protected. You can also control who can contribute content and moderate all additions before they appear on the memorial."
      },
      {
        question: "Can I delete or modify memorial content after it's published?",
        answer: "Yes, as the memorial creator, you have full control to edit, modify, or delete content at any time. You can also designate other family members as co-administrators who can help manage the memorial. All changes are logged for transparency and security."
      },
      {
        question: "What happens to my data if SoulBridge closes down?",
        answer: "We're committed to preserving your memories permanently. In the unlikely event of business closure, we would provide at least 90 days' notice and offer ways to export all your memorial content. We're also exploring partnerships with digital preservation organizations to ensure long-term memorial preservation."
      },
      {
        question: "Do you share information with third parties?",
        answer: "We never sell your personal information. We only share data with trusted service providers necessary for platform operation (like payment processors) under strict data protection agreements. All sharing complies with POPIA requirements and you can review our detailed privacy policy for complete information."
      },
      {
        question: "How do I report inappropriate content on a memorial?",
        answer: "Every memorial page has a discreet 'Report' button that allows you to flag inappropriate content. Our moderation team reviews all reports within 24 hours and takes appropriate action. We maintain community guidelines that ensure memorials remain respectful spaces for remembrance."
      },
      {
        question: "Can I transfer ownership of a memorial to another family member?",
        answer: "Yes, memorial ownership can be transferred to another family member through your account settings or by contacting our support team. This is useful for ensuring memorial continuity across generations or when circumstances change within the family."
      }
    ],
    "community": [
      {
        question: "What are the community guidelines for SoulBridge?",
        answer: "Our community guidelines ensure that SoulBridge remains a respectful space for remembrance. We prohibit disrespectful comments, commercial solicitation, inappropriate content, and anything that would cause distress to grieving families. All content is moderated to maintain the dignity of memorial spaces."
      },
      {
        question: "Can I report someone who is posting inappropriate content?",
        answer: "Yes, every piece of content has a report function that you can use to flag inappropriate material. Our moderation team investigates all reports promptly and takes action ranging from content removal to account suspension depending on the severity of the violation."
      },
      {
        question: "How do you handle disputes between family members about memorial content?",
        answer: "We understand that grief can sometimes lead to family disagreements. We provide mediation support and encourage families to resolve disputes privately first. Our support team can facilitate discussions and, if necessary, temporarily restrict memorial access until family matters are resolved."
      },
      {
        question: "Can I block certain people from viewing or contributing to a memorial?",
        answer: "Yes, you have granular control over who can access your memorial. You can block specific individuals, require approval for all contributions, and set different permission levels for different family members. Your memorial is your space to manage as you see fit."
      },
      {
        question: "Is there a way to connect with other families who have experienced similar losses?",
        answer: "While we don't operate a general forum (to maintain privacy), we do offer optional grief support resources and can connect you with professional counseling services and support groups in South Africa. Our focus remains on individual family memorial spaces rather than community discussion areas."
      }
    ]
  };

  const filteredFAQs = Object.entries(faqData).reduce((acc, [category, items]) => {
    if (searchQuery) {
      const filtered = items.filter(
        item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    } else {
      acc[category] = items;
    }
    return acc;
  }, {} as Record<string, typeof faqData[keyof typeof faqData]>);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions about creating memorials, subscriptions, and honoring your loved ones
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
                data-testid="input-search-faq"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a category to find specific information about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const hasContent = filteredFAQs[category.id]?.length > 0;
              
              return (
                <Card key={category.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${!hasContent && searchQuery ? 'opacity-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {filteredFAQs[category.id]?.length || 0} {searchQuery ? 'matching ' : ''}questions
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {category.count} total
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Content */}
          <div className="space-y-12">
            {Object.entries(filteredFAQs).map(([categoryId, items]) => {
              const category = faqCategories.find(cat => cat.id === categoryId);
              if (!category) return null;

              const Icon = category.icon;

              return (
                <div key={categoryId} className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  <Accordion type="multiple" className="space-y-4">
                    {items.map((item, index) => (
                      <AccordionItem 
                        key={`${categoryId}-${index}`} 
                        value={`${categoryId}-${index}`}
                        className="bg-card border rounded-lg px-6"
                      >
                        <AccordionTrigger 
                          className="text-left hover:no-underline py-6"
                          data-testid={`accordion-trigger-${categoryId}-${index}`}
                        >
                          <span className="font-medium text-foreground pr-4">
                            {item.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {searchQuery && Object.keys(filteredFAQs).length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any questions matching "{searchQuery}". Try searching with different keywords or browse our categories above.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                data-testid="button-clear-search"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6">
            Still Need Help?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you can't find the answer you're looking for, our compassionate support team is here to help. 
            We understand the sensitivity of memorial services and are committed to providing personalized assistance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Get personalized help from our team</p>
                <Link href="/contact">
                  <Button size="sm" data-testid="button-contact-support">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Writing Guide</h3>
                <p className="text-muted-foreground text-sm mb-4">Learn how to write meaningful tributes</p>
                <Link href="/writing-guide">
                  <Button variant="outline" size="sm" data-testid="button-writing-guide">View Guide</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
                <p className="text-muted-foreground text-sm mb-4">Create your first memorial easily</p>
                <Link href="/create">
                  <Button variant="outline" size="sm" data-testid="button-create-memorial">Create Memorial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Emergency Support</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Need urgent assistance? Contact our emergency support line at 041 019 5019 or email urgent@soulbridge.co.za
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-destructive hover:bg-destructive/90" data-testid="button-emergency-call">
                Call Emergency Support
              </Button>
              <Button variant="outline" data-testid="button-emergency-email">
                Email Urgent Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}