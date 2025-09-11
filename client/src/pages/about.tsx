import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              Honoring Loved Ones with Ease
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              About SoulBridge
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Bridging lives, memories, and legacies with dignity and love.
            </p>
            
            <div className="flex justify-center">
              <Link href="/create">
                <Button size="lg" className="px-8 py-3" data-testid="button-about-create-memorial">
                  Create Memorial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
              SoulBridge Mission
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              To empower families and partners to honour, celebrate, and preserve the lives of their loved ones with dignity, beauty, and ease through meaningful online memorials that bridge memories across generations.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
              SoulBridge Vision
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              To become Africa's leading digital memorial platform, bridging families, communities, and partners worldwide through innovative, respectful, and accessible remembrance experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
                Our Story
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              <p className="mb-6">
                SoulBridge was born out of a deeply personal moment. After losing someone very close to my heart, I searched for a local platform where I could share the news of their passing and allow friends and family to honour their life with stories and tributes.
              </p>
              <p className="mb-6">
                To my surprise, I could not find any platforms in South Africa that offered this in a way that felt dignified, beautiful, and accessible. I eventually had to use a platform from abroad, which felt disconnected from our culture and community.
              </p>
              <p className="mb-6">
                I realised I was not alone in this experience. Many families here deserve a space that reflects their values, traditions, and stories with respect and ease.
              </p>
              <p>
                That's why I created SoulBridge – to empower families and partners to honour, celebrate, and preserve the lives of their loved ones with dignity, while bridging memories across generations and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Ready to Honour Your Loved One's Legacy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create a beautiful memorial page to celebrate their life and keep their memory alive forever.
            </p>
            <Link href="/create">
              <Button size="lg" className="px-8 py-3" data-testid="button-about-final-cta">
                Create Memorial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}