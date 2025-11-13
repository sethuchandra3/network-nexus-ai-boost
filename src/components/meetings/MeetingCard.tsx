import { Meeting, MeetingStatus, MeetingPlatform } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, ExternalLink, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
}

export function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case MeetingStatus.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case MeetingStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getPlatformIcon = (platform: MeetingPlatform) => {
    if (platform === MeetingPlatform.GOOGLE_MEET || platform === MeetingPlatform.ZOOM) {
      return <Video className="h-4 w-4" />;
    }
    return <Calendar className="h-4 w-4" />;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{meeting.title}</h3>
            <Badge className={getStatusColor(meeting.status)}>
              {meeting.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            with {meeting.contactName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(meeting)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(meeting.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(meeting.scheduledDate, "PPP 'at' p")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{meeting.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getPlatformIcon(meeting.platform)}
          <span>{meeting.platform}</span>
          {meeting.meetingLink && (
            <a 
              href={meeting.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Join <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {meeting.aiSummary && (
        <div className="mb-4 p-3 bg-accent/50 rounded-md">
          <p className="text-sm font-medium mb-1">AI Summary</p>
          <p className="text-sm text-muted-foreground">{meeting.aiSummary}</p>
        </div>
      )}

      {meeting.notes && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Notes</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{meeting.notes}</p>
        </div>
      )}
    </Card>
  );
}
