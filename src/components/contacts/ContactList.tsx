import { useState } from "react";
import { Contact, ContactStatus, RelationshipStatus } from "@/types/contact";
import { ContactCard } from "./ContactCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
  onSendEmail: (contact: Contact, type: 'cold' | 'followup') => void;
}

export function ContactList({ contacts, onEditContact, onSendEmail }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      const matchesRelationship = relationshipFilter === "all" || contact.relationshipStatus === relationshipFilter;
      
      return matchesSearch && matchesStatus && matchesRelationship;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.localeCompare(b.company);
        case "lastContacted":
          if (!a.lastContacted && !b.lastContacted) return 0;
          if (!a.lastContacted) return 1;
          if (!b.lastContacted) return -1;
          return new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime();
        case "followUpDate":
          if (!a.followUpDate && !b.followUpDate) return 0;
          if (!a.followUpDate) return 1;
          if (!b.followUpDate) return -1;
          return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
        default:
          return 0;
      }
    });

  const getFollowUpCount = () => {
    return contacts.filter(contact => 
      contact.followUpDate && new Date(contact.followUpDate) <= new Date()
    ).length;
  };

  const getStatusCount = (status: ContactStatus) => {
    return contacts.filter(contact => contact.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-primary">{contacts.length}</div>
          <div className="text-sm text-muted-foreground">Total Contacts</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-warning">{getFollowUpCount()}</div>
          <div className="text-sm text-muted-foreground">Need Follow Up</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-success">{getStatusCount(ContactStatus.MEETING_COMPLETED)}</div>
          <div className="text-sm text-muted-foreground">Meetings Done</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-accent">{getStatusCount(ContactStatus.AWAITING_REPLY)}</div>
          <div className="text-sm text-muted-foreground">Awaiting Reply</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ContactStatus.NEW}>New</SelectItem>
            <SelectItem value={ContactStatus.COLD_OUTREACH}>Cold Outreach</SelectItem>
            <SelectItem value={ContactStatus.AWAITING_REPLY}>Awaiting Reply</SelectItem>
            <SelectItem value={ContactStatus.RESPONDED}>Responded</SelectItem>
            <SelectItem value={ContactStatus.MEETING_SCHEDULED}>Meeting Scheduled</SelectItem>
            <SelectItem value={ContactStatus.MEETING_COMPLETED}>Meeting Completed</SelectItem>
            <SelectItem value={ContactStatus.FOLLOW_UP_NEEDED}>Follow Up Needed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Relationships</SelectItem>
            <SelectItem value={RelationshipStatus.STRANGER}>Stranger</SelectItem>
            <SelectItem value={RelationshipStatus.ACQUAINTANCE}>Acquaintance</SelectItem>
            <SelectItem value={RelationshipStatus.PROFESSIONAL}>Professional</SelectItem>
            <SelectItem value={RelationshipStatus.FRIENDLY}>Friendly</SelectItem>
            <SelectItem value={RelationshipStatus.CLOSE}>Close</SelectItem>
            <SelectItem value={RelationshipStatus.MENTOR}>Mentor</SelectItem>
            <SelectItem value={RelationshipStatus.MENTEE}>Mentee</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="lastContacted">Last Contacted</SelectItem>
            <SelectItem value="followUpDate">Follow Up Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Grid */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {contacts.length === 0 ? "No contacts yet" : "No contacts match your filters"}
          </div>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setRelationshipFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={onEditContact}
              onSendEmail={onSendEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
}