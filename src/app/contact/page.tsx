"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Bug,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
      });
      setSubmitting(false);
    }, 1000);
  };

  const categories = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "support", label: "Technical Support", icon: HelpCircle },
    { value: "bug", label: "Report a Bug", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@soulbridge.co.za",
      description: "We typically respond within 24 hours",
    },
    {
      icon: MessageSquare,
      title: "Contact Form",
      details: "Use our contact form",
      description: "Get personalized assistance from our team",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "Within 24 hours",
      description: "Monday - Friday, 9:00 AM - 5:00 PM SAST",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I get help?",
      answer:
        "We respond to all inquiries within 24 hours during business days. For urgent technical issues, we aim to respond within 4 hours.",
    },
    {
      question: "What's the best way to contact you?",
      answer:
        "Email us at support@soulbridge.co.za or use our contact form. We handle all communication digitally to provide you with the best support experience.",
    },
    {
      question: "Do you offer memorial creation services?",
      answer:
        "While we provide a self-service platform, we can recommend professional memorial content creators if you need assistance.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              We're Here to
              <span className="text-primary"> Help</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question or need support? Our team is ready to assist you
              in creating a beautiful memorial for your loved one.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: cat.value })
                          }
                          className={`p-4 rounded-token border-2 text-left transition-all ${
                            formData.category === cat.value
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 mb-2 ${
                              formData.category === cat.value
                                ? "text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                          <p className="text-sm font-medium text-foreground">
                            {cat.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Other Ways to Reach Us
              </h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-accent" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {info.title}
                          </h3>
                          <p className="text-lg text-primary mb-1">
                            {info.details}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* FAQs */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
