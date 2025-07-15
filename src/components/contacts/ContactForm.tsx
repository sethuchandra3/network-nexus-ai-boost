import { useState } from "react";
import { Contact, ContactStatus, RelationshipStatus } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, onSave, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    linkedin: contact?.linkedin || '',
    role: contact?.role || '',
    company: contact?.company || '',
    status: contact?.status || ContactStatus.NEW,
    isAlumni: contact?.isAlumni || false,
    lastContacted: contact?.lastContacted || null,
    relationshipStatus: contact?.relationshipStatus || RelationshipStatus.STRANGER,
    referral: contact?.referral || '',
    aiNotes: contact?.aiNotes || '',
    followUpDate: contact?.followUpDate || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const handleDateSelect = (date: Date | undefined, field: 'lastContacted' | 'followUpDate') => {
    setFormData(prev => ({
      ...prev,
      [field]: date || null
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                required
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
                placeholder="Tech Corp"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: ContactStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContactStatus.NEW}>New</SelectItem>
                  <SelectItem value={ContactStatus.COLD_OUTREACH}>Cold Outreach</SelectItem>
                  <SelectItem value={ContactStatus.AWAITING_REPLY}>Awaiting Reply</SelectItem>
                  <SelectItem value={ContactStatus.RESPONDED}>Responded</SelectItem>
                  <SelectItem value={ContactStatus.MEETING_SCHEDULED}>Meeting Scheduled</SelectItem>
                  <SelectItem value={ContactStatus.MEETING_COMPLETED}>Meeting Completed</SelectItem>
                  <SelectItem value={ContactStatus.FOLLOW_UP_NEEDED}>Follow Up Needed</SelectItem>
                  <SelectItem value={ContactStatus.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Relationship Status</Label>
              <Select 
                value={formData.relationshipStatus} 
                onValueChange={(value: RelationshipStatus) => setFormData(prev => ({ ...prev, relationshipStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RelationshipStatus.STRANGER}>Stranger</SelectItem>
                  <SelectItem value={RelationshipStatus.ACQUAINTANCE}>Acquaintance</SelectItem>
                  <SelectItem value={RelationshipStatus.PROFESSIONAL}>Professional</SelectItem>
                  <SelectItem value={RelationshipStatus.FRIENDLY}>Friendly</SelectItem>
                  <SelectItem value={RelationshipStatus.CLOSE}>Close</SelectItem>
                  <SelectItem value={RelationshipStatus.MENTOR}>Mentor</SelectItem>
                  <SelectItem value={RelationshipStatus.MENTEE}>Mentee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Last Contacted</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.lastContacted && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.lastContacted ? format(formData.lastContacted, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.lastContacted || undefined}
                    onSelect={(date) => handleDateSelect(date, 'lastContacted')}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Follow Up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.followUpDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.followUpDate || undefined}
                    onSelect={(date) => handleDateSelect(date, 'followUpDate')}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">Referral Source</Label>
            <Input
              id="referral"
              value={formData.referral}
              onChange={(e) => setFormData(prev => ({ ...prev, referral: e.target.value }))}
              placeholder="How you found this contact"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="alumni"
              checked={formData.isAlumni}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAlumni: checked }))}
            />
            <Label htmlFor="alumni">Alumni of my school</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">AI Notes</Label>
            <Textarea
              id="notes"
              value={formData.aiNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, aiNotes: e.target.value }))}
              placeholder="AI-generated notes from meetings or interactions"
              rows={3}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              {contact ? 'Update Contact' : 'Add Contact'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}