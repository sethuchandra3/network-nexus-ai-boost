import { useState } from "react";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Send, 
  RefreshCw, 
  Clock, 
  CalendarDays 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

interface EmailGeneratorProps {
  contact: Contact;
  type: 'cold' | 'followup';
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (contact: Contact, followUpDate: Date) => void;
}

export function EmailGenerator({ contact, type, isOpen, onClose, onEmailSent }: EmailGeneratorProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpDays, setFollowUpDays] = useState(7);

  const generateEmailTemplate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation (in real app, this would call an AI API)
    setTimeout(() => {
      if (type === 'cold') {
        setSubject(`Coffee chat opportunity - ${contact.name}`);
        setBody(`Hi ${contact.name.split(' ')[0]},

I hope this email finds you well! I came across your profile and was really impressed by your work at ${contact.company}${contact.isAlumni ? ' and our shared alma mater connection' : ''}.

As someone interested in ${contact.role.toLowerCase()}, I'd love to learn more about your journey and insights in the industry. Would you be open to a brief coffee chat sometime in the next couple of weeks?

I'm particularly curious about [specific area related to their role/company] and would greatly appreciate any advice you might have for someone looking to grow in this field.

Thank you for considering, and I completely understand if your schedule doesn't permit right now.

Best regards,
[Your Name]`);
      } else {
        setSubject(`Following up on our conversation - ${contact.name}`);
        setBody(`Hi ${contact.name.split(' ')[0]},

I hope you're doing well! I wanted to follow up on our previous conversation${contact.lastContacted ? ` from ${format(contact.lastContacted, 'MMMM d')}` : ''}.

${contact.aiNotes ? `I've been thinking about what you mentioned about ${contact.aiNotes.substring(0, 100)}...` : 'I really enjoyed our discussion and found your insights valuable.'}

I'd love to continue our conversation and explore how we might be able to help each other professionally. Would you be available for another chat in the coming weeks?

Looking forward to hearing from you!

Best regards,
[Your Name]`);
      }
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    const emailText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(emailText);
    toast({
      title: "Copied to clipboard",
      description: "Email template copied successfully",
    });
  };

  const handleSendEmail = () => {
    // In a real app, this would integrate with email client or API
    const followUpDate = addDays(new Date(), followUpDays);
    onEmailSent(contact, followUpDate);
    
    toast({
      title: "Email sent!",
      description: `Follow-up reminder set for ${format(followUpDate, 'MMMM d, yyyy')}`,
    });
    
    onClose();
  };

  const openEmailClient = () => {
    const emailUrl = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>
              {type === 'cold' ? 'Cold Outreach' : 'Follow-up'} Email - {contact.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Generate and customize your {type === 'cold' ? 'initial outreach' : 'follow-up'} email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Role:</span> {contact.role}
                </div>
                <div>
                  <span className="font-medium">Company:</span> {contact.company}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {contact.email}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Alumni:</span>
                  <Badge variant={contact.isAlumni ? "default" : "secondary"}>
                    {contact.isAlumni ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              {contact.aiNotes && (
                <div className="mt-4 p-3 bg-accent-light rounded-md">
                  <div className="text-sm font-medium mb-1">Previous Notes:</div>
                  <div className="text-sm text-muted-foreground">{contact.aiNotes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Generator */}
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Email</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Sparkles className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">AI Email Generation</h3>
                      <p className="text-muted-foreground">
                        Generate a personalized {type === 'cold' ? 'cold outreach' : 'follow-up'} email based on contact information
                      </p>
                    </div>
                    <Button
                      onClick={generateEmailTemplate}
                      disabled={isGenerating}
                      className="w-full max-w-sm"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Email
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customize" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter email content"
                    rows={12}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followup">Follow-up Reminder</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="followup"
                      type="number"
                      value={followUpDays}
                      onChange={(e) => setFollowUpDays(parseInt(e.target.value) || 7)}
                      className="w-20"
                      min="1"
                      max="30"
                    />
                    <span className="text-sm text-muted-foreground">days from now</span>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground ml-auto">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(addDays(new Date(), followUpDays), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          {(subject || body) && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={openEmailClient} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Open in Email Client
              </Button>
              <Button onClick={handleSendEmail} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Mark as Sent
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}