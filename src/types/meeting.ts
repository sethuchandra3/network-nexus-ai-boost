export enum MeetingPlatform {
  GOOGLE_MEET = "Google Meet",
  ZOOM = "Zoom",
  IN_PERSON = "In Person",
  PHONE = "Phone",
  OTHER = "Other"
}

export enum MeetingStatus {
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export interface Meeting {
  id: string;
  contactId: string;
  contactName: string;
  title: string;
  platform: MeetingPlatform;
  meetingLink?: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: MeetingStatus;
  notes: string;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}
