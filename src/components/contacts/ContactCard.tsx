import { Contact, ContactStatus, RelationshipStatus } from "@/types/contact";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Mail, 
  Linkedin, 
  Building2, 
  Calendar, 
  GraduationCap,
  MessageSquare,
  Clock
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onSendEmail: (contact: Contact, type: 'cold' | 'followup') => void;
}

const getStatusColor = (status: ContactStatus) => {
  switch (status) {
    case ContactStatus.NEW:
      return "bg-muted text-muted-foreground";
    case ContactStatus.COLD_OUTREACH:
      return "bg-primary-light text-primary";
    case ContactStatus.AWAITING_REPLY:
      return "bg-warning-light text-warning";
    case ContactStatus.RESPONDED:
      return "bg-success-light text-success";
    case ContactStatus.MEETING_SCHEDULED:
      return "bg-accent-light text-accent";
    case ContactStatus.MEETING_COMPLETED:
      return "bg-success text-success-foreground";
    case ContactStatus.FOLLOW_UP_NEEDED:
      return "bg-warning text-warning-foreground";
    case ContactStatus.INACTIVE:
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRelationshipColor = (relationship: RelationshipStatus) => {
  switch (relationship) {
    case RelationshipStatus.STRANGER:
      return "bg-muted text-muted-foreground";
    case RelationshipStatus.ACQUAINTANCE:
      return "bg-primary-light text-primary";
    case RelationshipStatus.PROFESSIONAL:
      return "bg-accent-light text-accent";
    case RelationshipStatus.FRIENDLY:
      return "bg-success-light text-success";
    case RelationshipStatus.CLOSE:
      return "bg-success text-success-foreground";
    case RelationshipStatus.MENTOR:
      return "bg-warning text-warning-foreground";
    case RelationshipStatus.MENTEE:
      return "bg-warning-light text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ContactCard({ contact, onEdit, onSendEmail }: ContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isFollowUpDue = contact.followUpDate && new Date(contact.followUpDate) <= new Date();
  const needsAction = contact.status === ContactStatus.FOLLOW_UP_NEEDED || isFollowUpDue;

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${needsAction ? 'ring-2 ring-warning' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{contact.role}</p>
            </div>
          </div>
          {contact.isAlumni && (
            <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{contact.company}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(contact.status)}>
            {contact.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={getRelationshipColor(contact.relationshipStatus)}>
            {contact.relationshipStatus}
          </Badge>
        </div>

        {contact.lastContacted && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Last contact: {formatDistanceToNow(contact.lastContacted)} ago</span>
          </div>
        )}

        {contact.followUpDate && (
          <div className={`flex items-center space-x-2 text-sm ${isFollowUpDue ? 'text-warning' : 'text-muted-foreground'}`}>
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              Follow up: {isFollowUpDue ? 'Overdue' : format(contact.followUpDate, 'MMM d')}
            </span>
          </div>
        )}

        {contact.aiNotes && (
          <div className="bg-accent-light p-2 rounded-md">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent line-clamp-2">{contact.aiNotes}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(contact)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => onSendEmail(contact, contact.status === ContactStatus.NEW ? 'cold' : 'followup')}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          {contact.linkedin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(contact.linkedin, '_blank')}
              className="px-3"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}