import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sharingUtils } from "@/lib/sharingUtils";
import type { Memorial } from "@shared/schema";
import {
  Mail,
  MessageCircle,
  Link2,
  Copy,
  Send,
  Users,
  Heart,
  Share2,
  Facebook,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface InvitationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memorial: Memorial;
}

export function InvitationModal({ open, onOpenChange, memorial }: InvitationModalProps) {
  const [activeTab, setActiveTab] = useState("email");
  const [invitationForm, setInvitationForm] = useState({
    emails: "",
    customMessage: "",
    inviterName: "",
  });
  const [linkCopied, setLinkCopied] = useState(false);

  const { toast } = useToast();

  const sendInvitationMutation = useMutation({
    mutationFn: async (data: { emails: string[]; message: string; inviterName?: string }) => {
      return apiRequest("POST", `/api/memorials/${memorial.id}/invitations`, data);
    },
    onSuccess: () => {
      toast({
        title: "Invitations sent successfully",
        description: "Your invitations have been sent to the specified email addresses.",
      });
      setInvitationForm({ emails: "", customMessage: "", inviterName: "" });
    },
    onError: () => {
      toast({
        title: "Failed to send invitations",
        description: "There was an error sending the invitations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const memorialUrl = `${window.location.origin}/memorial/${memorial.id}`;
  const defaultMessage = sharingUtils.generateInvitationMessage(memorial, invitationForm.inviterName);

  const handleSendEmailInvitations = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationForm.emails.trim()) {
      toast({
        title: "Email addresses required",
        description: "Please enter at least one email address.",
        variant: "destructive",
      });
      return;
    }

    const emailList = invitationForm.emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast({
        title: "Invalid email addresses",
        description: `Please check these email addresses: ${invalidEmails.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    sendInvitationMutation.mutate({
      emails: emailList,
      message: invitationForm.customMessage || defaultMessage,
      inviterName: invitationForm.inviterName || undefined,
    });
  };

  const handleCopyLink = async () => {
    const shareData = sharingUtils.createInvitationData(
      memorial, 
      invitationForm.inviterName, 
      invitationForm.customMessage
    );
    
    const success = await sharingUtils.copyLink(shareData);
    if (success) {
      setLinkCopied(true);
      toast({
        title: "Link copied",
        description: "Memorial link has been copied to your clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 3000);
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const shareData = sharingUtils.createInvitationData(
      memorial, 
      invitationForm.inviterName, 
      invitationForm.customMessage
    );
    sharingUtils.shareOnWhatsApp(shareData);
  };

  const handleFacebookShare = () => {
    const shareData = sharingUtils.createInvitationData(
      memorial, 
      invitationForm.inviterName, 
      invitationForm.customMessage
    );
    sharingUtils.shareOnFacebook(shareData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Invite Family & Friends</span>
          </DialogTitle>
          <DialogDescription>
            Share {memorial.firstName} {memorial.lastName}'s memorial with family and friends. 
            Help others discover, contribute memories, and pay their respects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Memorial Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              {memorial.profilePhotoUrl ? (
                <img
                  src={memorial.profilePhotoUrl}
                  alt={`${memorial.firstName} ${memorial.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {memorial.firstName[0]}{memorial.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{memorial.firstName} {memorial.lastName}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(memorial.dateOfBirth).getFullYear()} - {new Date(memorial.dateOfPassing).getFullYear()} • {memorial.province}, South Africa
                </p>
              </div>
            </div>
          </div>

          {/* Invitation Options */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="flex items-center space-x-1" data-testid="tab-email-invite">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center space-x-1" data-testid="tab-link-invite">
                <Link2 className="w-4 h-4" />
                <span>Share Link</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center space-x-1" data-testid="tab-social-invite">
                <Share2 className="w-4 h-4" />
                <span>Social</span>
              </TabsTrigger>
            </TabsList>

            {/* Common Settings */}
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name (Optional)</label>
                <Input
                  placeholder="Enter your name"
                  value={invitationForm.inviterName}
                  onChange={(e) => setInvitationForm(prev => ({ ...prev, inviterName: e.target.value }))}
                  data-testid="input-inviter-name"
                />
                <p className="text-xs text-muted-foreground">
                  This will be included in the invitation message
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Message (Optional)</label>
                <Textarea
                  placeholder={defaultMessage}
                  value={invitationForm.customMessage}
                  onChange={(e) => setInvitationForm(prev => ({ ...prev, customMessage: e.target.value }))}
                  rows={3}
                  data-testid="textarea-custom-message"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleSendEmailInvitations} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Addresses</label>
                  <Textarea
                    placeholder="Enter email addresses separated by commas&#10;example: john@email.com, jane@email.com, family@email.com"
                    value={invitationForm.emails}
                    onChange={(e) => setInvitationForm(prev => ({ ...prev, emails: e.target.value }))}
                    rows={4}
                    required
                    data-testid="textarea-email-addresses"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple email addresses with commas
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={sendInvitationMutation.isPending}
                  className="w-full"
                  data-testid="button-send-email-invites"
                >
                  {sendInvitationMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Invitations...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email Invitations
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Memorial Link</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={memorialUrl}
                      readOnly
                      className="flex-1"
                      data-testid="input-memorial-url"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex items-center space-x-1"
                      data-testid="button-copy-link"
                    >
                      {linkCopied ? (
                        <>
                          <div className="w-4 h-4 text-primary">✓</div>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link directly with family and friends
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Preview Message</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {invitationForm.customMessage || defaultMessage}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share the memorial on social media platforms popular in South Africa
                </p>

                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    onClick={handleWhatsAppShare}
                    className="w-full justify-start text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/10"
                    data-testid="button-share-whatsapp"
                  >
                    <FaWhatsapp className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Share on WhatsApp</div>
                      <div className="text-xs text-muted-foreground">Most popular in South Africa</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleFacebookShare}
                    className="w-full justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/10"
                    data-testid="button-share-facebook"
                  >
                    <Facebook className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Share on Facebook</div>
                      <div className="text-xs text-muted-foreground">Reach extended family and friends</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => sharingUtils.shareViaEmail(sharingUtils.createInvitationData(memorial, invitationForm.inviterName, invitationForm.customMessage))}
                    className="w-full justify-start text-[#EA4335] border-[#EA4335]/20 hover:bg-[#EA4335]/10"
                    data-testid="button-share-email"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Share via Email</div>
                      <div className="text-xs text-muted-foreground">Direct personal invitation</div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips Section */}
          <div className="bg-chart-4/10 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center space-x-2 text-chart-4">
              <Heart className="w-4 h-4" />
              <span>Invitation Tips</span>
            </h4>
            <ul className="text-sm text-chart-4/80 space-y-1">
              <li>• Invite close family members first to help build the memorial</li>
              <li>• WhatsApp is very popular in South Africa for sharing with family</li>
              <li>• Include a personal message to encourage participation</li>
              <li>• Let people know they can share photos and memories</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}