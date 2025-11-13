import { useState } from "react";
import { Contact, ContactStatus } from "@/types/contact";
import { Meeting, MeetingStatus } from "@/types/meeting";
import { ContactList } from "./contacts/ContactList";
import { ContactForm } from "./contacts/ContactForm";
import { MeetingList } from "./meetings/MeetingList";
import { MeetingForm } from "./meetings/MeetingForm";
import { EmailGenerator } from "./email/EmailGenerator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, TrendingUp, Calendar, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { calculateFollowUpDate } from "@/utils/followUpUtils";

export function NetworkingTracker() {
  const [activeTab, setActiveTab] = useState<string>("contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [emailContact, setEmailContact] = useState<Contact | null>(null);
  const [emailType, setEmailType] = useState<'cold' | 'followup'>('cold');

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingContact) {
      // Update existing contact
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id 
          ? { ...contactData, id: editingContact.id, createdAt: editingContact.createdAt, updatedAt: now }
          : c
      ));
      toast({
        title: "Contact updated",
        description: `${contactData.name} has been updated successfully.`,
      });
    } else {
      // Add new contact
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      setContacts(prev => [...prev, newContact]);
      toast({
        title: "Contact added",
        description: `${contactData.name} has been added to your network.`,
      });
    }
    
    setShowContactForm(false);
    setEditingContact(null);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleSaveMeeting = (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingMeeting) {
      setMeetings(prev => prev.map(m => 
        m.id === editingMeeting.id 
          ? { ...meetingData, id: editingMeeting.id, createdAt: editingMeeting.createdAt, updatedAt: now }
          : m
      ));
      toast({
        title: "Meeting updated",
        description: `${meetingData.title} has been updated successfully.`,
      });
    } else {
      const newMeeting: Meeting = {
        ...meetingData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      setMeetings(prev => [...prev, newMeeting]);
      toast({
        title: "Meeting created",
        description: `${meetingData.title} has been added to your calendar.`,
      });
    }
    
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed.",
    });
  };

  const handleSendEmail = (contact: Contact, type: 'cold' | 'followup') => {
    setEmailContact(contact);
    setEmailType(type);
  };

  const handleEmailSent = (contact: Contact, followUpDate: Date) => {
    // Update contact status and follow-up date with intelligent follow-up calculation
    const intelligentFollowUpDate = calculateFollowUpDate(contact.relationshipStatus);
    
    setContacts(prev => prev.map(c => 
      c.id === contact.id 
        ? { 
            ...c, 
            status: ContactStatus.AWAITING_REPLY,
            lastContacted: new Date(),
            followUpDate: intelligentFollowUpDate,
            updatedAt: new Date()
          }
        : c
    ));
    setEmailContact(null);
    
    toast({
      title: "Email marked as sent",
      description: `Follow-up scheduled based on your ${contact.relationshipStatus} relationship level.`,
    });
  };

  const handleMarkResponded = (contact: Contact) => {
    // Update contact to responded status and set new follow-up based on relationship
    const newFollowUpDate = calculateFollowUpDate(contact.relationshipStatus);
    
    setContacts(prev => prev.map(c => 
      c.id === contact.id 
        ? { 
            ...c, 
            status: ContactStatus.RESPONDED,
            lastContacted: new Date(),
            followUpDate: newFollowUpDate,
            updatedAt: new Date()
          }
        : c
    ));
    
    toast({
      title: "Marked as responded",
      description: `Next follow-up automatically scheduled based on relationship level.`,
    });
  };

  const handleCancelContactForm = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };

  const handleCancelMeetingForm = () => {
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };

  const handleCloseEmailGenerator = () => {
    setEmailContact(null);
  };

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ContactForm
            contact={editingContact || undefined}
            onSave={handleSaveContact}
            onCancel={handleCancelContactForm}
          />
        </div>
      </div>
    );
  }

  if (showMeetingForm) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <MeetingForm
            meeting={editingMeeting || undefined}
            contacts={contacts}
            onSave={handleSaveMeeting}
            onCancel={handleCancelMeetingForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b bg-gradient-to-br from-primary/5 via-accent/5 to-background backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Chatter.ai
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium">LinkedIn CRM</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Lightweight networking CRM that connects to LinkedIn, logs coffee chats, and tracks relationships—keeping your outreach organized in one place.
              </p>
            </div>
            <Button 
              onClick={() => activeTab === "contacts" ? setShowContactForm(true) : setShowMeetingForm(true)} 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "contacts" ? "Add Contact" : "Add Meeting"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-10 p-1 h-auto bg-card border shadow-sm">
            <TabsTrigger 
              value="contacts" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 px-6 py-3"
            >
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger 
              value="meetings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 px-6 py-3"
            >
              <Video className="h-4 w-4" />
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            {contacts.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-full border-2 border-primary/20">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Start Building Your Network
                </h2>
                <p className="text-muted-foreground mb-12 max-w-xl mx-auto text-lg">
                  Add your first contact to begin tracking your coffee chats, networking events, and professional relationships.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                  <div className="group p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Add Contacts</h3>
                    <p className="text-sm text-muted-foreground">Track all your networking connections from LinkedIn</p>
                  </div>
                  <div className="group p-6 rounded-2xl bg-card border hover:border-success/50 hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-br from-success/10 to-success/5 p-4 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-7 w-7 text-success" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">AI Email Generation</h3>
                    <p className="text-sm text-muted-foreground">Generate personalized outreach messages</p>
                  </div>
                  <div className="group p-6 rounded-2xl bg-card border hover:border-warning/50 hover:shadow-lg transition-all duration-300">
                    <div className="bg-gradient-to-br from-warning/10 to-warning/5 p-4 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="h-7 w-7 text-warning" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Follow-up Tracking</h3>
                    <p className="text-sm text-muted-foreground">Never miss a follow-up opportunity</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowContactForm(true)} 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <ContactList
                contacts={contacts}
                onEditContact={handleEditContact}
                onSendEmail={handleSendEmail}
                onMarkResponded={handleMarkResponded}
              />
            )}
          </TabsContent>

          <TabsContent value="meetings">
            {meetings.length === 0 && contacts.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-full border-2 border-primary/20">
                    <Video className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Schedule Your First Meeting
                </h2>
                <p className="text-muted-foreground mb-12 max-w-xl mx-auto text-lg">
                  Add some contacts first, then schedule meetings to track your coffee chats and networking sessions.
                </p>
                <Button 
                  onClick={() => setActiveTab("contacts")} 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Go to Contacts
                </Button>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-full border-2 border-primary/20">
                    <Video className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Schedule Your First Meeting
                </h2>
                <p className="text-muted-foreground mb-12 max-w-xl mx-auto text-lg">
                  Create meetings with your contacts and track them with Google Meet or Zoom integration.
                </p>
                <Button 
                  onClick={() => setShowMeetingForm(true)} 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Meeting
                </Button>
              </div>
            ) : (
              <MeetingList
                meetings={meetings}
                onEditMeeting={handleEditMeeting}
                onDeleteMeeting={handleDeleteMeeting}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Generator Modal */}
      {emailContact && (
        <EmailGenerator
          contact={emailContact}
          type={emailType}
          isOpen={!!emailContact}
          onClose={handleCloseEmailGenerator}
          onEmailSent={handleEmailSent}
        />
      )}
    </div>
  );
}