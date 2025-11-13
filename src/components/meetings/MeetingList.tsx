import { Meeting, MeetingStatus } from "@/types/meeting";
import { MeetingCard } from "./MeetingCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface MeetingListProps {
  meetings: Meeting[];
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

export function MeetingList({ meetings, onEditMeeting, onDeleteMeeting }: MeetingListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const filteredMeetings = meetings
    .filter(meeting => statusFilter === "all" || meeting.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        case "date-desc":
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
        case "contact":
          return a.contactName.localeCompare(b.contactName);
        default:
          return 0;
      }
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(MeetingStatus).map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="contact">By Contact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No meetings found. Create your first meeting to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onEdit={onEditMeeting}
              onDelete={onDeleteMeeting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
