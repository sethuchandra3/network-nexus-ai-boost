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
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <span>Networking Tracker</span>
              </h1>
              <p className="text-muted-foreground">
                Manage your contacts, meetings, and professional connections with AI-powered insights
              </p>
            </div>
            <Button 
              onClick={() => activeTab === "contacts" ? setShowContactForm(true) : setShowMeetingForm(true)} 
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "contacts" ? "Add Contact" : "Add Meeting"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            {contacts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-primary-light p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Start Building Your Network</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Add your first contact to begin tracking your coffee chats, networking events, and professional relationships.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="text-center p-4">
                    <div className="bg-accent-light p-3 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold">Add Contacts</h3>
                    <p className="text-sm text-muted-foreground">Track all your networking connections</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-success-light p-3 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="font-semibold">AI Email Generation</h3>
                    <p className="text-sm text-muted-foreground">Generate personalized outreach emails</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-warning-light p-3 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-warning" />
                    </div>
                    <h3 className="font-semibold">Follow-up Tracking</h3>
                    <p className="text-sm text-muted-foreground">Never miss a follow-up opportunity</p>
                  </div>
                </div>
                <Button onClick={() => setShowContactForm(true)} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
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
              <div className="text-center py-16">
                <div className="bg-primary-light p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Video className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Schedule Your First Meeting</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Add some contacts first, then schedule meetings to track your coffee chats and networking sessions.
                </p>
                <Button onClick={() => setActiveTab("contacts")} size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  Go to Contacts
                </Button>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-primary-light p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Video className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Schedule Your First Meeting</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Create meetings with your contacts and track them with Google Meet or Zoom integration.
                </p>
                <Button onClick={() => setShowMeetingForm(true)} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
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