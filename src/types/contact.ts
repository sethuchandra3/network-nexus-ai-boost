export interface Contact {
  id: string;
  name: string;
  email: string;
  linkedin?: string;
  role: string;
  company: string;
  status: ContactStatus;
  isAlumni: boolean;
  lastContacted?: Date;
  relationshipStatus: RelationshipStatus;
  aiNotes?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContactStatus {
  NEW = "new",
  COLD_OUTREACH = "cold_outreach",
  AWAITING_REPLY = "awaiting_reply", 
  RESPONDED = "responded",
  MEETING_SCHEDULED = "meeting_scheduled",
  MEETING_COMPLETED = "meeting_completed",
  FOLLOW_UP_NEEDED = "follow_up_needed",
  INACTIVE = "inactive"
}

export enum RelationshipStatus {
  STRANGER = "stranger",
  ACQUAINTANCE = "acquaintance", 
  PROFESSIONAL = "professional",
  FRIENDLY = "friendly",
  CLOSE = "close",
  MENTOR = "mentor",
  MENTEE = "mentee"
}

export interface EmailTemplate {
  id: string;
  type: 'cold' | 'followup';
  subject: string;
  body: string;
  contactId: string;
}