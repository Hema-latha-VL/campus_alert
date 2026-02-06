import { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { eventApi, EventData } from '@/lib/apiClient';
import { Upload, X, AlertTriangle } from 'lucide-react';

interface EventFormProps {
  eventToEdit?: EventData;
  onSuccess?: (event: EventData) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  eventType: 'event' | 'test' | 'placement';
  date: string;
  time: string;
  imageUrl: string;
  coordinator: string;
  capacity: string;
  department: string;
  description: string;
  isMandatory: boolean;
}

const departments = [
  'Computer Science',
  'Information Technology',
  'Mechanical',
  'Electrical',
  'Electronics',
  'Civil',
  'Chemical',
  'Artificial Intelligence',
  'General',
  'All Departments',
];

const eventTypes = [
  { value: 'event', label: 'Event' },
  { value: 'test', label: 'Test' },
  { value: 'placement', label: 'Placement' },
];

export const EventForm = ({ eventToEdit, onSuccess, onCancel }: EventFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [form, setForm] = useState<FormData>({
    name: '',
    eventType: 'event',
    date: '',
    time: '',
    imageUrl: '',
    coordinator: '',
    capacity: '',
    department: '',
    description: '',
    isMandatory: false,
  });

  useEffect(() => {
    if (eventToEdit) {
      setForm({
        name: eventToEdit.name,
        eventType: eventToEdit.eventType,
        date: eventToEdit.date.split('T')[0],
        time: eventToEdit.time,
        imageUrl: eventToEdit.imageUrl || '',
        coordinator: eventToEdit.coordinator,
        capacity: String(eventToEdit.capacity),
        department: eventToEdit.department,
        description: eventToEdit.description,
        isMandatory: eventToEdit.isMandatory || false,
      });
      if (eventToEdit.imageUrl) {
        setImagePreview(eventToEdit.imageUrl);
      }
    }
  }, [eventToEdit]);

  const updateField = (key: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const canSubmit =
    form.name.trim() &&
    form.eventType &&
    form.date &&
    form.time &&
    form.coordinator.trim() &&
    form.capacity &&
    form.department &&
    form.description.trim();

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    // Validate that event date is in the future
    const eventDateTime = new Date(`${form.date}T${form.time}`);
    const now = new Date();
    
    if (eventDateTime <= now) {
      toast({ 
        title: 'Invalid event date', 
        description: 'Event date must be in the future, not in the past',
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        name: form.name,
        eventType: form.eventType,
        date: new Date(form.date).toISOString(),
        time: form.time,
        imageUrl: form.imageUrl,
        coordinator: form.coordinator,
        capacity: Number(form.capacity),
        department: form.department,
        description: form.description,
        isMandatory: form.isMandatory,
      };

      let result;
      if (eventToEdit) {
        result = await eventApi.update(eventToEdit._id!, eventData);
        toast({ title: 'Event updated successfully' });
      } else {
        result = await eventApi.create(eventData);
        toast({ title: 'Event created successfully' });
      }

      onSuccess?.(result.event);
    } catch (error) {
      toast({
        title: 'Failed to save event',
        description: error instanceof Error ? error.message : 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {eventToEdit ? 'Edit Event' : 'Create New Event'}
      </h2>

      <div className="space-y-6">
        {/* Event Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Event Name *
          </Label>
          <Input
            id="name"
            placeholder="e.g., Tech Fest 2024"
            value={form.name}
            onChange={(e) => updateField('name')(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Event Type *</Label>
          <Select value={form.eventType} onValueChange={(value) => updateField('eventType')(value as any)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => updateField('date')(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Time (HH:MM) *
            </Label>
            <Input
              id="time"
              type="time"
              value={form.time}
              onChange={(e) => updateField('time')(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
        </div>

        {/* Coordinator and Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coordinator" className="text-sm font-medium">
              Co-ordinator *
            </Label>
            <Input
              id="coordinator"
              placeholder="Name"
              value={form.coordinator}
              onChange={(e) => updateField('coordinator')(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Student Capacity *
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="100"
              value={form.capacity}
              onChange={(e) => updateField('capacity')(e.target.value)}
              className="bg-secondary/50"
              min="1"
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Department *</Label>
          <Select value={form.department} onValueChange={(value) => updateField('department')(value)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description/Details *
          </Label>
          <Textarea
            id="description"
            placeholder="Event description, venue, requirements, etc."
            value={form.description}
            onChange={(e) => updateField('description')(e.target.value)}
            className="bg-secondary/50 min-h-32"
          />
        </div>

        {/* Mandatory Event */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMandatory"
              checked={form.isMandatory}
              onCheckedChange={(checked) => 
                setForm(prev => ({ ...prev, isMandatory: checked as boolean }))
              }
            />
            <Label htmlFor="isMandatory" className="text-sm font-medium cursor-pointer">
              Mark as Mandatory Event
            </Label>
          </div>
          {form.isMandatory && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">
                This event will be mandatory and all users will receive email notifications regardless of their notification preferences.
              </p>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Event Image (Optional)</Label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </label>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-1"
          >
            {loading
              ? 'Saving...'
              : eventToEdit
              ? 'Update Event'
              : 'Create Event'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
