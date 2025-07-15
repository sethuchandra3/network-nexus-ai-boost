import { useState } from "react";
import { Contact, ContactStatus, RelationshipStatus } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Calendar } from "lucide-react";
import { getFollowUpDescription } from "@/utils/followUpUtils";

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
    relationshipStatus: contact?.relationshipStatus || RelationshipStatus.STRANGER,
    aiNotes: contact?.aiNotes || '',
    lastContacted: contact?.lastContacted || null,
    followUpDate: contact?.followUpDate || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>);
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
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>Auto follow-up: {getFollowUpDescription(formData.relationshipStatus)}</span>
              </div>
            </div>
          </div>

          {(formData.lastContacted || formData.followUpDate) && (
            <div className="bg-accent-light p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="font-medium">Current Tracking Info:</span>
              </div>
              {formData.lastContacted && (
                <div className="text-sm text-muted-foreground">
                  Last contacted: {formData.lastContacted.toLocaleDateString()}
                </div>
              )}
              {formData.followUpDate && (
                <div className="text-sm text-muted-foreground">
                  Next follow-up: {formData.followUpDate.toLocaleDateString()}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Dates are automatically updated when you send emails or mark interactions
              </div>
            </div>
          )}

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
