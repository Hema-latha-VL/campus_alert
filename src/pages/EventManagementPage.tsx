import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { EventForm } from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch, ApiError, eventApi, EventData } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Calendar, Users, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useAppState } from '@/state/AppState';

const EventManagementPage = () => {
  const { toast } = useToast();
  const { role, identity } = useAppState();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await eventApi.getAll();
      setEvents(res.events);
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({
        title: 'Failed to load events',
        description: detail || 'Try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateSuccess = (event: EventData) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e._id === event._id ? event : e)));
      setEditingEvent(null);
    } else {
      setEvents([event, ...events]);
    }
    setShowForm(false);
    loadEvents(); // Reload to ensure consistency
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventApi.delete(eventId);
      setEvents(events.filter((e) => e._id !== eventId));
      toast({ title: 'Event deleted successfully' });
    } catch (error) {
      const detail = error instanceof ApiError ? error.detail : undefined;
      toast({
        title: 'Failed to delete event',
        description: detail || 'Try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (event: EventData) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const canEditEvent = (event: EventData) => {
    if (role === 'admin') return true;
    if (role === 'advisor' && event.createdBy?._id === identity) return true;
    return false;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'test':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'placement':
        return 'bg-green-500/10 text-green-600 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Event Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage college events, tests, and placement drives
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="lg">
              + New Event
            </Button>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <div>
            <EventForm
              eventToEdit={editingEvent || undefined}
              onSuccess={handleCreateSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Events</h2>

          {loading ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground">Loading events...</p>
            </GlassCard>
          ) : events.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground">No events found. Create one to get started!</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <GlassCard key={event._id} className="p-6">
                  <div className="flex gap-6">
                    {/* Event Image */}
                    {event.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{event.name}</h3>
                            <Badge className={getEventTypeColor(event.eventType)}>
                              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{event.description}</p>

                          {/* Event Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{event.capacity} students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.department}</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-muted-foreground">
                              <strong>Co-ordinator:</strong> {event.coordinator}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <strong>Posted by:</strong> {event.createdBy?.firstName} {event.createdBy?.lastName}{' '}
                              ({event.createdBy?.loginName})
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <CheckCircle className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs text-muted-foreground">
                                <strong>{event.views || 0}</strong> acknowledgements
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {canEditEvent(event) && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(event._id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default EventManagementPage;
