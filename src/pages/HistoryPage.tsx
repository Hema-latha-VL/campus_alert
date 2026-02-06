import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { NoticeCard } from '@/components/NoticeCard';
import { NoticeDNAView } from '@/components/NoticeDNAView';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppState } from '@/state/AppState';
import { eventApi, type EventData } from '@/lib/apiClient';
import { Notice } from '@/data/mockData';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const HistoryPage = () => {
  const { mode } = useAppState();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [expiredEvents, setExpiredEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch events and filter expired ones
  useEffect(() => {
    const loadExpiredEvents = async () => {
      try {
        const res = await eventApi.getAll();
        const allEvents = res.events || [];
        const now = new Date();

        // Filter expired events (deadline has passed)
        const expired = allEvents.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate < now;
        });

        setExpiredEvents(expired);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpiredEvents();
  }, []);

  // Convert event to notice
  const eventToNotice = (event: EventData): Notice => ({
    id: event._id || `event-${event.name}-${Date.now()}`,
    eventId: event._id,
    title: event.name,
    summary: `${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}: ${event.description.substring(0, 50)}...`,
    description: event.description,
    category: event.eventType === 'placement' ? 'placement' : event.eventType === 'test' ? 'exam' : 'event',
    priority: 'low',
    department: [event.department || 'All'],
    deadline: new Date(event.date),
    postedAt: new Date(),
    upvotes: 0,
    views: event.views || 0,
    isVerified: true,
    relevanceReason: 'Past event - archived in history',
    imageUrl: event.imageUrl,
  });

  const filteredHistory = expiredEvents
    .map(eventToNotice)
    .filter((notice) =>
      searchQuery.trim() === '' ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.summary.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.deadline?.getTime() || 0) - (a.deadline?.getTime() || 0));

  return (
    <PageLayout mode={mode} className="pt-28 pb-12 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-display-md font-bold mb-2">Event History</h1>
            <p className="text-muted-foreground">
              View all past events and archived notifications
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search past events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* History Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            <p>Loading history...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Archived Events</h2>
              <Badge variant="secondary">{filteredHistory.length}</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((notice, index) => (
                <div
                  key={notice.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NoticeCard
                    notice={notice}
                    size="md"
                    onClick={() => setSelectedNotice(notice)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-muted-foreground">
            <p>No past events found. Check back later!</p>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <NoticeDNAView notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
    </PageLayout>
  );
};

export default HistoryPage;
