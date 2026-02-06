import { Notice, getCategoryColor, getPriorityGlow, getTimeRemaining } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Clock, MapPin, ThumbsUp, Shield, ChevronRight, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NoticeCardProps {
  notice: Notice;
  size?: 'sm' | 'md' | 'lg';
  showRelevance?: boolean;
  reminderActive?: boolean;
  onClick?: () => void;
  ghosted?: boolean;
  consequence?: string;
  onAcknowledge?: (eventId: string) => void;
  showAcknowledge?: boolean;
  isAcknowledged?: boolean;
}

export const NoticeCard = ({
  notice,
  size = 'md',
  showRelevance = true,
  reminderActive = false,
  onClick,
  ghosted = false,
  consequence,
  onAcknowledge,
  showAcknowledge = false,
  isAcknowledged = false,
}: NoticeCardProps) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card hover-lift cursor-pointer group relative overflow-hidden transition-all duration-300',
        sizeClasses[size],
        getPriorityGlow(notice.priority),
        ghosted && 'opacity-50 grayscale',
        notice.priority === 'urgent' && 'hover:border-2 hover:border-destructive hover:shadow-lg hover:shadow-destructive/20'
      )}
    >
      {/* Priority indicator bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          notice.priority === 'urgent' && 'bg-gradient-to-r from-destructive to-coral-400',
          notice.priority === 'high' && 'bg-gradient-to-r from-primary to-accent',
          notice.priority === 'medium' && 'bg-gradient-to-r from-cyan-400 to-teal-400',
          notice.priority === 'low' && 'bg-muted'
        )}
      />

      <div className="space-y-3">
        {/* Image if available */}
        {notice.imageUrl && (
          <div className="w-full h-40 rounded-lg overflow-hidden bg-muted">
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn('text-xs font-medium', getCategoryColor(notice.category))}
              >
                {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
              </Badge>
              {reminderActive && (
                <Badge variant="outline" className="bg-secondary/40 text-foreground">
                  Reminder
                </Badge>
              )}
              {notice.isVerified && (
                <div className="flex items-center gap-1 text-primary">
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>
            <h3 className={cn('font-semibold text-foreground leading-tight', titleSizes[size])}>
              {notice.title}
            </h3>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2">{notice.summary}</p>

        {/* Consequence text for ghosted mode */}
        {ghosted && consequence && (
          <div className="bg-destructive/10 text-destructive text-xs font-medium px-3 py-2 rounded-lg">
            ⚠️ {consequence}
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {notice.deadline && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{getTimeRemaining(notice.deadline)}</span>
            </div>
          )}
          {notice.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{notice.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{notice.upvotes}</span>
          </div>
          {notice.views > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{notice.views} views</span>
            </div>
          )}
        </div>

        {/* Relevance tag */}
        {showRelevance && notice.relevanceReason && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-primary font-medium">
              ✨ {notice.relevanceReason}
              {notice.viewedByPercentage && ` • ${notice.viewedByPercentage}% viewed`}
            </p>
          </div>
        )}

        {/* Acknowledge button for students */}
        {showAcknowledge && onAcknowledge && notice.eventId && (
          <div className="pt-3">
            <Button
              size="sm"
              variant={isAcknowledged ? "secondary" : "default"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge(notice.eventId!);
              }}
              disabled={isAcknowledged}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
