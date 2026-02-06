import { GlassCard } from './GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventData } from '@/lib/apiClient';
import { Calendar, Clock, Users, MapPin, Edit, Trash2, CheckCircle } from 'lucide-react';

interface EventCardProps {
  event: EventData;
  showActions?: boolean;
  onEdit?: (event: EventData) => void;
  onDelete?: (eventId: string) => void;
}

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

export const EventCard = ({ event, showActions = false, onEdit, onDelete }: EventCardProps) => {
  return (
    <GlassCard className="p-6 hover:border-primary/50 transition">
      <div className="flex gap-4">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{event.name}</h3>
                <Badge className={getEventTypeColor(event.eventType)} variant="outline">
                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {event.description}
              </p>

              {/* Event Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>{event.capacity} seats</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{event.department}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 text-xs text-muted-foreground flex items-center justify-between">
                <p>
                  <strong>Co-ordinator:</strong> {event.coordinator}
                </p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  <span><strong>{event.views || 0}</strong> acknowledgements</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex gap-2 flex-shrink-0">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(event)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(event._id!)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
