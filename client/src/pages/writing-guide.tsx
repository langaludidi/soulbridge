import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useEffect } from "react";
import { Heart, BookOpen, Star, Users, Globe, Feather, Cross, Moon, Shield } from "lucide-react";

export default function WritingGuide() {
  useEffect(() => {
    document.title = "Memorial Writing Guide - SoulBridge Memorial Platform";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'SoulBridge Memorial Writing Guide - Learn how to write meaningful tributes, obituaries, and memorial content for South African families. Includes templates for Christian, Muslim, Jewish, and Traditional African contexts.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'SoulBridge Memorial Writing Guide - Learn how to write meaningful tributes, obituaries, and memorial content for South African families. Includes templates for Christian, Muslim, Jewish, and Traditional African contexts.';
      document.head.appendChild(meta);
    }
  }, []);

  const writingTips = [
    {
      title: "Start with Love",
      description: "Begin with what made them special to you and your family",
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Share Stories",
      description: "Include specific memories that capture their personality",
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Celebrate Achievements",
      description: "Honor their accomplishments and contributions to community",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      title: "Include Family",
      description: "Mention relationships, children, grandchildren, and extended family",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Honor Heritage",
      description: "Respect cultural traditions and spiritual beliefs",
      icon: Globe,
      color: "text-purple-500"
    },
    {
      title: "Write from the Heart",
      description: "Authentic emotion resonates more than perfect prose",
      icon: Feather,
      color: "text-orange-500"
    }
  ];

  const culturalTemplates = {
    christian: {
      title: "Christian Memorial",
      icon: Cross,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      templates: [
        {
          type: "Traditional Christian Obituary",
          content: `"It is with heavy hearts that we announce the peaceful passing of [Name], who was called home to be with the Lord on [Date] at the age of [Age]. Born in [Place] on [Birth Date], [Name] was a devoted [relationship - father/mother/husband/wife] and faithful servant of Christ.

[Name] lived a life guided by faith, love, and service to others. [He/She] was an active member of [Church Name] for [number] years, where [he/she] served as [role/position]. [His/Her] unwavering faith was an inspiration to all who knew [him/her].

As a [profession/role], [Name] was known for [qualities/achievements]. [He/She] touched many lives through [specific examples of service or kindness].

[Name] is survived by [family members]. [He/She] was preceded in death by [family members].

'Well done, good and faithful servant' - Matthew 25:23. While we mourn our loss, we celebrate that [Name] is now in the loving arms of our Savior.

A celebration of life service will be held at [location] on [date and time]. In lieu of flowers, the family requests donations to [charity/church]."`
        },
        {
          type: "Christian Celebration of Life",
          content: `"Today we gather not in sorrow, but in celebration of the remarkable life of [Name], who lived [Age] years filled with love, faith, and purpose. On [Date], our beloved [relationship] peacefully transitioned from this earthly home to their eternal home with Jesus.

[Name]'s life was a testimony to God's grace. Born in [Location], [he/she] grew up with a heart for service and a deep love for the Lord. [His/Her] faith journey began at [Church/Location] and continued throughout [his/her] life as [he/she] served in various ministries including [specific ministries].

As a [profession/role], [Name] exemplified Christian values in everything [he/she] did. [He/She] believed in [specific values/quotes they lived by].

[Name] leaves behind a legacy of love: [family members and their relationships]. Each of us has been blessed by [his/her] example of faithfulness, kindness, and unconditional love.

'For I am convinced that neither death nor life... will be able to separate us from the love of God that is in Christ Jesus our Lord.' - Romans 8:38-39

Though we will miss [Name] deeply, we find comfort knowing [he/she] is experiencing the joy of Heaven and that we will be reunited one day."`
        }
      ]
    },
    muslim: {
      title: "Islamic Memorial",
      icon: Moon,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      templates: [
        {
          type: "Islamic Memorial Tribute",
          content: `"Inna lillahi wa inna ilayhi raji'un - Surely we belong to Allah and to Him we shall return.

It is with profound sadness and complete submission to Allah's will that we announce the passing of our beloved [Name], who returned to Allah on [Date] at the age of [Age]. Born in [Place] on [Birth Date], [Name] was a devoted Muslim and [relationship - father/mother/husband/wife].

[Name] lived according to the teachings of Islam, demonstrating the beautiful qualities of patience (sabr), gratitude (shukr), and compassion (rahma) in all aspects of life. [He/She] was known for [specific Islamic qualities/actions - charity, kindness to neighbors, devotion to prayer, etc.].

As a member of our community, [Name] contributed through [specific contributions - mosque activities, community service, etc.]. [His/Her] example of Islamic character inspired many and strengthened our ummah.

[Name] is survived by [family members]. May Allah grant them patience and strength during this difficult time.

We ask Allah to forgive [Name]'s sins, increase [his/her] good deeds, and grant [him/her] the highest level of Jannah. May Allah make [his/her] grave spacious and filled with light.

'And give good tidings to the patient, Who, when disaster strikes them, say, Indeed we belong to Allah, and indeed to Him we will return.' - Quran 2:155-156

The Janazah prayer will be held at [Mosque] on [Date] at [Time]. Burial will follow at [Cemetery]. We request your duas for the deceased and their family."`
        },
        {
          type: "Islamic Remembrance",
          content: `"Bismillah - In the name of Allah, the Most Gracious, the Most Merciful.

We remember with love and gratitude our dear [Name], who lived [Age] years as a faithful servant of Allah. On [Date], Allah called [him/her] to return to His mercy.

[Name] was blessed with [qualities - strong iman, generous spirit, love for the Prophet (PBUH), dedication to family]. [He/She] performed Hajj in [year] and often spoke of the spiritual transformation of that sacred journey.

Throughout [his/her] life, [Name] embodied the Sunnah through [specific examples - kindness to parents, charity to the poor, good treatment of neighbors]. [His/Her] commitment to [specific Islamic practices] was an inspiration to our family and community.

'Every soul will taste death, and you will only be given your full reward on the Day of Resurrection.' - Quran 3:185

We find comfort in Allah's promise that the righteous will be in gardens and springs. May Allah reunite us with [Name] in Jannah al-Firdaus.

Ameen."`
        }
      ]
    },
    jewish: {
      title: "Jewish Memorial",
      icon: Shield,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      templates: [
        {
          type: "Jewish Memorial Notice",
          content: `"Baruch Dayan HaEmet - Blessed is the True Judge.

It is with deep sorrow that we announce the passing of our beloved [Name] ([Hebrew name] ben/bat [father's Hebrew name]), who died on [Hebrew date] ([English date]) at the age of [Age]. [Name] passed away peacefully, surrounded by family.

Born in [Place] on [Date], [Name] was a devoted [relationship] and faithful member of the Jewish community. [He/She] was a member of [Synagogue name] and actively participated in [community activities/organizations].

[Name] lived a life guided by Jewish values of tikkun olam (repairing the world), tzedakah (righteousness/charity), and chesed (loving-kindness). [He/She] was known for [specific acts of kindness or community service].

Throughout [his/her] life, [Name] maintained a strong connection to [his/her] Jewish heritage through [specific examples - Shabbat observance, holiday celebrations, Torah study, etc.]. [His/Her] home was always open for Shabbat dinners and holiday celebrations.

[Name] is survived by [family members]. [He/She] was preceded in death by [family members].

'May [his/her] memory be for a blessing.' - Zichrono/Zichrona livracha.

Funeral services will be held at [location] on [date] at [time]. Shiva will be observed at [address] from [dates]. In lieu of flowers, donations may be made to [Jewish charity/organization].

May the Almighty comfort the mourners among the mourners of Zion and Jerusalem."`
        },
        {
          type: "Jewish Life Celebration",
          content: `"HaMakom yenachem etchem betoch she'ar avelei Tzion v'Yerushalayim - May the Omnipresent comfort you among the mourners of Zion and Jerusalem.

We celebrate the life of [Name] ([Hebrew name]), who lived [Age] years filled with purpose, learning, and love. On [Hebrew date] ([English date]), [his/her] neshamah (soul) returned to its Creator.

[Name] was born to [parents' names] in [location] and grew up with a deep appreciation for Jewish learning and tradition. [He/She] [education/career details] and was known for [his/her] [specific qualities].

As a Jew, [Name] understood the importance of l'dor v'dor (from generation to generation). [He/She] ensured that Jewish traditions continued through [specific examples - teaching Hebrew, sharing family recipes, telling stories of the past].

[Name]'s commitment to Torah values was evident in [specific examples]. [He/She] believed in the power of education and supported [Jewish institutions/causes].

'The memory of the righteous is a blessing' - Proverbs 10:7. [Name]'s legacy lives on through [specific legacy items - children raised in Jewish tradition, community contributions, etc.].

Though we mourn this loss, we find comfort in our traditions and in the knowledge that [Name]'s influence will continue through all the lives [he/she] touched.

Zichrono/Zichrona livracha - May [his/her] memory be for a blessing."`
        }
      ]
    },
    traditional: {
      title: "Traditional African",
      icon: Globe,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      templates: [
        {
          type: "Traditional African Tribute",
          content: `"It is with heavy hearts that we announce that our beloved [Name] has joined the ancestors on [Date] at the age of [Age]. Born in [Village/Location] on [Birth Date], [Name] was a pillar of strength in our family and community.

[Name] was the [son/daughter] of [parents' names] and grew up in the traditions of our [specific ethnic group/tribe]. [He/She] carried forward the wisdom of our forefathers and was known for [specific traditional qualities - wisdom, storytelling, respect for elders, etc.].

As a [role in community - headman, traditional healer, elder, etc.], [Name] served our community with dedication and wisdom. [He/She] was instrumental in [specific community contributions - settling disputes, preserving traditions, guiding young people].

[Name] understood the importance of ubuntu - 'I am because we are.' [His/Her] life embodied this philosophy through [specific examples of community service and support for others].

[He/She] was a keeper of our traditions, ensuring that our [customs/rituals/stories] were passed down to the next generation. [Name] often said, '[specific saying or wisdom they shared].'

[Name] is survived by [family members using traditional kinship terms where appropriate]. [He/She] was preceded in death by [family members].

According to our customs, [Name] will now take [his/her] place among our ancestors, continuing to watch over and guide our family and community.

Traditional rites will be observed at [location] beginning on [date]. The family welcomes the community to come and share memories of [Name] and celebrate the life [he/she] lived.

Hamba kahle, [Name]. Rest in peace with the ancestors."`
        },
        {
          type: "Ubuntu Celebration",
          content: `"Today we gather to honor the life of [Name], who lived [Age] years embodying the spirit of ubuntu - the belief that we are all connected and that a person is a person through other people.

Born in [Location], [Name] was raised with the values of respect, community, and tradition. [He/She] learned from the elders that [specific traditional wisdom/teachings] and carried these lessons throughout [his/her] life.

[Name] was known throughout our community for [specific traits - wisdom, generosity, ability to bring people together]. [He/She] believed that [specific philosophy or saying they lived by].

As a [role - parent, grandparent, elder], [Name] ensured that our children learned about their heritage. [He/She] told them stories of [specific stories/traditions] and taught them that [specific life lessons].

In our tradition, death is not an ending but a transition. [Name] now joins the ancestors who continue to guide us from the spiritual realm. [His/Her] wisdom, love, and example will live on in each of us.

We remember [Name] not with sadness alone, but with gratitude for the gift of [his/her] life and the lessons [he/she] taught us about what it means to be human.

May [his/her] spirit find peace with the ancestors, and may we continue to honor [his/her] memory by living according to the values [he/she] embodied.

Sala kahle - Go well, [Name]."`
        }
      ]
    }
  };

  const writingStructures = [
    {
      title: "Basic Memorial Structure",
      sections: [
        "Opening acknowledgment of passing",
        "Birth details and family background",
        "Life achievements and career",
        "Personal qualities and characteristics",
        "Family relationships and survivors",
        "Service information and arrangements",
        "Closing tribute or meaningful quote"
      ]
    },
    {
      title: "Celebration of Life Structure",
      sections: [
        "Warm opening celebrating their life",
        "Early life and formative experiences",
        "Passions, hobbies, and interests",
        "Impact on family and community",
        "Memorable stories and anecdotes",
        "Legacy and continuing influence",
        "Invitation to celebrate their memory"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Memorial Writing Guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to write meaningful tributes that honor your loved one's life, heritage, and legacy
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Culturally sensitive templates for South African families
            </p>
          </div>
        </div>
      </section>

      {/* Writing Tips */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
              Essential Writing Tips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're writing your first tribute or helping others honor their loved ones, these guidelines will help you create meaningful content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {writingTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${tip.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Writing Structure */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {writingStructures.map((structure, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">{structure.title}</CardTitle>
                  <CardDescription>A proven structure for creating meaningful memorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {structure.sections.map((section, sectionIndex) => (
                      <li key={sectionIndex} className="flex items-start space-x-3">
                        <Badge variant="secondary" className="mt-0.5 text-xs font-medium">
                          {sectionIndex + 1}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex-1">{section}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Templates */}
      <section className="py-16 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
              Cultural & Religious Templates
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Choose from templates that honor different South African cultural and religious traditions. 
              Each template provides culturally appropriate language and structure while remaining respectful and meaningful.
            </p>
          </div>

          <Tabs defaultValue="christian" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {Object.entries(culturalTemplates).map(([key, template]) => {
                const Icon = template.icon;
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center space-x-2" data-testid={`tab-${key}`}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{template.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(culturalTemplates).map(([key, template]) => {
              const Icon = template.icon;
              return (
                <TabsContent key={key} value={key} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${template.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-serif">{template.title} Writing Guide</CardTitle>
                          <CardDescription>
                            Culturally appropriate templates and language for {template.title.toLowerCase()} memorial services
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-6">
                    {template.templates.map((templateItem, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{templateItem.type}</CardTitle>
                          <CardDescription>
                            Copy and customize this template for your memorial
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
                            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                              {templateItem.content}
                            </pre>
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => navigator.clipboard.writeText(templateItem.content)}
                              data-testid={`button-copy-${key}-${index}`}
                            >
                              Copy Template
                            </Button>
                            <Button variant="outline" size="sm" data-testid={`button-customize-${key}-${index}`}>
                              Start Creating Memorial
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Writing Guidelines */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
              Cultural Sensitivity Guidelines
            </h2>
            <p className="text-muted-foreground">
              Important considerations when writing memorials for South African families
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Respectful Language</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Do Use:</h4>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                    <li>"Passed away," "called home," "joined the ancestors," "returned to the Creator"</li>
                    <li>Specific cultural or religious terms where appropriate</li>
                    <li>Names and titles that reflect respect (Mama, Tata, Ouma, Oupa, etc.)</li>
                    <li>Language that reflects their values and beliefs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Avoid:</h4>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                    <li>Overly clinical or impersonal language</li>
                    <li>Assumptions about religious beliefs</li>
                    <li>Cultural stereotypes or generalizations</li>
                    <li>Language that might be offensive to any cultural group</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <span>Cultural Considerations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Family Structure</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                      <li>Extended family relationships are often central</li>
                      <li>Community connections may be as important as blood relations</li>
                      <li>Traditional roles and titles should be respected</li>
                      <li>Multiple family names and clan names may be significant</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Spiritual Beliefs</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                      <li>Many families blend traditional and modern religious practices</li>
                      <li>Ancestral beliefs often coexist with other religions</li>
                      <li>Spiritual titles and religious roles should be acknowledged</li>
                      <li>Consider asking family about specific beliefs and customs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Language and Translation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    South Africa's linguistic diversity is a beautiful part of our heritage. Consider including:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                    <li>Traditional greetings or farewells in the family's home language</li>
                    <li>Meaningful phrases or sayings they often used</li>
                    <li>Proper pronunciation guides for names and terms</li>
                    <li>Translations of important cultural concepts</li>
                  </ul>
                  <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> If you're unsure about cultural practices or appropriate language, 
                      ask family members or community elders for guidance. They will appreciate your effort 
                      to honor their traditions correctly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-primary/5 dark:bg-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6">
            Need Help Writing Your Memorial?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team understands the importance of creating meaningful tributes. We're here to help you 
            honor your loved one's memory with the respect and dignity they deserve.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Personal Assistance</h3>
                <p className="text-muted-foreground text-sm mb-4">Get one-on-one help with writing your memorial</p>
                <Link href="/contact">
                  <Button size="sm" data-testid="button-personal-assistance">Get Help</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">FAQ</h3>
                <p className="text-muted-foreground text-sm mb-4">Common questions about memorial writing</p>
                <Link href="/faq">
                  <Button variant="outline" size="sm" data-testid="button-view-faq">View FAQ</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Feather className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Start Creating</h3>
                <p className="text-muted-foreground text-sm mb-4">Use our guided memorial creation process</p>
                <Link href="/create">
                  <Button variant="outline" size="sm" data-testid="button-start-creating">Create Memorial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Cultural Guidance Available</h3>
            <p className="text-muted-foreground text-sm">
              Our team includes members from different South African communities who can provide 
              culturally appropriate guidance for Christian, Muslim, Jewish, Hindu, and Traditional African memorials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}