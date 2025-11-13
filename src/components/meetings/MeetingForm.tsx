import { useState } from "react";
import { Meeting, MeetingPlatform, MeetingStatus } from "@/types/meeting";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface MeetingFormProps {
  meeting?: Meeting;
  contacts: Contact[];
  onSave: (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function MeetingForm({ meeting, contacts, onSave, onCancel }: MeetingFormProps) {
  const [formData, setFormData] = useState({
    contactId: meeting?.contactId || "",
    contactName: meeting?.contactName || "",
    title: meeting?.title || "",
    platform: meeting?.platform || MeetingPlatform.GOOGLE_MEET,
    meetingLink: meeting?.meetingLink || "",
    scheduledDate: meeting?.scheduledDate 
      ? new Date(meeting.scheduledDate).toISOString().slice(0, 16)
      : "",
    duration: meeting?.duration || 30,
    status: meeting?.status || MeetingStatus.SCHEDULED,
    notes: meeting?.notes || "",
    aiSummary: meeting?.aiSummary || "",
  });

  const handleContactChange = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setFormData(prev => ({
        ...prev,
        contactId,
        contactName: contact.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      scheduledDate: new Date(formData.scheduledDate),
    });
  };

  return (
    <div>
      <Button variant="ghost" onClick={onCancel} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Meetings
      </Button>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {meeting ? "Edit Meeting" : "New Meeting"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contact">Contact *</Label>
              <Select 
                value={formData.contactId} 
                onValueChange={handleContactChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Coffee Chat"
                required
              />
            </div>

            <div>
              <Label htmlFor="platform">Platform *</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value as MeetingPlatform }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MeetingPlatform).map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://meet.google.com/..."
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="scheduledDate">Scheduled Date & Time *</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="15"
                step="15"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as MeetingStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MeetingStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="aiSummary">AI Summary</Label>
            <Textarea
              id="aiSummary"
              value={formData.aiSummary}
              onChange={(e) => setFormData(prev => ({ ...prev, aiSummary: e.target.value }))}
              placeholder="AI-generated summary of the meeting (optional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Meeting Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Your notes from the meeting..."
              rows={6}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" size="lg">
              {meeting ? "Update Meeting" : "Create Meeting"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
