import { Notice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Users, 
  AlertTriangle, 
  FileText,
  ThumbsUp,
  Share2,
  Bookmark,
  Shield,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryColor, getTimeRemaining } from '@/data/mockData';
import { useAppState } from '@/state/AppState';
import { useToast } from '@/hooks/use-toast';

interface NoticeDNAViewProps {
  notice: Notice;
  onClose: () => void;
}

interface DNALayer {
  id: string;
  title: string;
  icon: typeof Clock;
  content: React.ReactNode;
  color: string;
}

export const NoticeDNAView = ({ notice, onClose }: NoticeDNAViewProps) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(['what', 'who', 'when', 'action'])
  );

  const { toast } = useToast();
  const { allNotices, upvoteNotice, toggleBookmark, markViewed, isBookmarked } = useAppState();

  const liveNotice = useMemo(() => allNotices.find((n) => n.id === notice.id) ?? notice, [allNotices, notice]);

  const bookmarked = useMemo(() => isBookmarked(liveNotice.id), [isBookmarked, liveNotice.id]);

  useEffect(() => {
    markViewed(liveNotice.id);
  }, [markViewed, liveNotice.id]);

  const toggleLayer = (id: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLayers(newExpanded);
  };

  const layers: DNALayer[] = [
    {
      id: 'what',
      title: 'What It Is',
      icon: FileText,
      color: 'border-primary text-primary',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{liveNotice.title}</h3>
          <p className="text-muted-foreground">{liveNotice.summary}</p>
          <p className="text-sm text-foreground/80">{liveNotice.description}</p>
        </div>
      ),
    },
    {
      id: 'who',
      title: 'Who It Affects',
      icon: Users,
      color: 'border-accent text-accent',
      content: (
        <div className="flex flex-wrap gap-2">
          {liveNotice.department?.map((dept) => (
            <Badge key={dept} variant="secondary" className="px-3 py-1">
              {dept}
            </Badge>
          ))}
          {liveNotice.year?.map((y) => (
            <Badge key={y} variant="outline" className="px-3 py-1">
              Year {y}
            </Badge>
          ))}
          {!liveNotice.department && !liveNotice.year && (
            <span className="text-muted-foreground">All students</span>
          )}
        </div>
      ),
    },
    {
      id: 'when',
      title: 'Deadline Urgency',
      icon: AlertTriangle,
      color: liveNotice.priority === 'urgent' ? 'border-destructive text-destructive' : 'border-coral-500 text-coral-500',
      content: liveNotice.deadline ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{getTimeRemaining(liveNotice.deadline)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'absolute left-0 top-0 h-full rounded-full transition-all duration-500',
                liveNotice.priority === 'urgent' 
                  ? 'bg-gradient-to-r from-destructive to-coral-400 w-[90%]'
                  : liveNotice.priority === 'high'
                  ? 'bg-gradient-to-r from-coral-400 to-coral-300 w-[70%]'
                  : 'bg-gradient-to-r from-primary to-accent w-[40%]'
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {liveNotice.deadline.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ) : (
        <span className="text-muted-foreground">No specific deadline</span>
      ),
    },
    {
      id: 'action',
      title: 'Required Action',
      icon: FileText,
      color: 'border-teal-500 text-teal-500',
      content: (
        <div className="space-y-3">
          {liveNotice.venue && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">📍 Venue:</span>
              <span className="font-medium">{liveNotice.venue}</span>
            </div>
          )}
          {liveNotice.actionRequired && (
            <Button
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              onClick={async () => {
                const link = liveNotice.actionLink;
                if (link) {
                  try {
                    await navigator.clipboard.writeText(link);
                    toast({ title: 'Action link copied', description: 'Paste it into your browser to continue.' });
                  } catch {
                    toast({ title: 'Action ready', description: 'Unable to copy link; check details and proceed manually.' });
                  }
                  return;
                }

                toast({ title: 'Action acknowledged', description: 'Marked as acknowledged in your session.' });
              }}
            >
              {liveNotice.actionRequired}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Badge className={cn(getCategoryColor(liveNotice.category))}>
              {liveNotice.category.charAt(0).toUpperCase() + liveNotice.category.slice(1)}
            </Badge>
            {liveNotice.isVerified && (
              <div className="flex items-center gap-1 text-primary">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* DNA Layers */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const isExpanded = expandedLayers.has(layer.id);
            
            return (
              <div
                key={layer.id}
                className={cn(
                  'dna-layer transition-all duration-300',
                  layer.color,
                  isExpanded ? 'bg-secondary/30' : 'bg-transparent'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleLayer(layer.id)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{layer.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="mt-3 pl-6 animate-fade-in">
                    {layer.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer - Engagement */}
        <div className="p-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                upvoteNotice(liveNotice.id);
                toast({ title: 'Upvoted', description: 'Thanks! This helps surface relevant updates.' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Upvote notice"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{liveNotice.upvotes}</span>
            </button>
            <span className="text-sm text-muted-foreground">
              {liveNotice.views.toLocaleString()} views
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                toggleBookmark(liveNotice.id);
                toast({
                  title: bookmarked ? 'Removed bookmark' : 'Bookmarked',
                  description: bookmarked ? 'Removed from your saved list.' : 'Saved for quick access.',
                });
              }}
              className={cn(
                'p-2 rounded-xl hover:bg-secondary/50 transition-colors',
                bookmarked && 'bg-primary/10'
              )}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark notice'}
            >
              <Bookmark className={cn('h-5 w-5', bookmarked ? 'text-primary' : 'text-muted-foreground')} />
            </button>
            <button
              type="button"
              onClick={async () => {
                const shareText = `${liveNotice.title} — ${liveNotice.summary}`;
                try {
                  await navigator.clipboard.writeText(shareText);
                  toast({ title: 'Copied to clipboard', description: 'You can paste this into WhatsApp / email.' });
                } catch {
                  toast({
                    title: 'Copy failed',
                    description: 'Clipboard permission blocked. Try selecting and copying manually.',
                  });
                }
              }}
              className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
              aria-label="Share notice"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
