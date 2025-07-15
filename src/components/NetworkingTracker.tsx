import { useState } from "react";
import { Contact, ContactStatus } from "@/types/contact";
import { ContactList } from "./contacts/ContactList";
import { ContactForm } from "./contacts/ContactForm";
import { EmailGenerator } from "./email/EmailGenerator";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { calculateFollowUpDate } from "@/utils/followUpUtils";

export function NetworkingTracker() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
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
    
    setShowForm(false);
    setEditingContact(null);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
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

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleCloseEmailGenerator = () => {
    setEmailContact(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ContactForm
            contact={editingContact || undefined}
            onSave={handleSaveContact}
            onCancel={handleCancelForm}
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
                Manage your coffee chats and professional connections with AI-powered insights
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {contacts.length === 0 ? (
          // Empty State
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
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </div>
        ) : (
          // Contact List
          <ContactList
            contacts={contacts}
            onEditContact={handleEditContact}
            onSendEmail={handleSendEmail}
            onMarkResponded={handleMarkResponded}
          />
        )}
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