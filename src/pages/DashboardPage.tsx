import { useMemo, useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { NoticeCard } from '@/components/NoticeCard';
import { EventCard } from '@/components/EventCard';
import { NoticeDNAView } from '@/components/NoticeDNAView';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { Switch } from '@/components/ui/switch';
import { Notice, getGreeting } from '@/data/mockData';
import { eventApi, ApiError, type EventData } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Clock, 
  Heart, 
  Bookmark,
  AlertTriangle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useAppState } from '@/state/AppState';

const DashboardPage = () => {
  const { mode, setMode, rankedNotices, engagement, preferences, getReminder, identity } = useAppState();
  const { toast } = useToast();
  const [showMissMode, setShowMissMode] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
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
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  const todaysBrief = useMemo(() => {
    return rankedNotices.filter((n) => n.priority === 'urgent' || n.priority === 'high').slice(0, 3);
  }, [rankedNotices]);

  const missedNotices = useMemo(() => {
    return rankedNotices.filter((n) => !!n.deadline && n.priority !== 'low').slice(0, 3);
  }, [rankedNotices]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  const statsCards = useMemo(() => {
    const upcoming = rankedNotices.filter((n) => (n.deadline ?? n.postedAt).getTime() >= Date.now()).length;
    const health = Math.min(99, 40 + preferences.categories.length * 10);
    return [
      { icon: Eye, label: 'Notices Viewed', value: engagement.viewedIds.length, color: 'text-primary' },
      { icon: Clock, label: 'Upcoming Deadlines', value: upcoming, color: 'text-coral-500' },
      { icon: Heart, label: 'Subscription Health', value: `${health}%`, color: 'text-teal-500' },
      { icon: Bookmark, label: 'Saved Notices', value: engagement.bookmarkedIds.length, color: 'text-accent' },
    ];
  }, [engagement.bookmarkedIds.length, engagement.viewedIds.length, preferences.categories.length, rankedNotices]);

  return (
    <PageLayout mode={mode} className="pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-display-md font-bold">
              {getGreeting()}, <span className="gradient-text">{identity || 'Student'}</span> 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what you need to know today
            </p>
          </div>
          <ModeSwitcher currentMode={mode} onModeChange={setMode} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={index} className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Today's Brief */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Today, you should know this 👇</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {todaysBrief.map((notice, index) => (
              <div
                key={notice.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <NoticeCard
                  notice={notice}
                  onClick={() => setSelectedNotice(notice)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* What You Will Miss Mode */}
        <section className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-coral-500" />
                <div>
                  <h3 className="font-semibold">What You Will Miss</h3>
                  <p className="text-sm text-muted-foreground">
                    See consequences of ignoring updates
                  </p>
                </div>
              </div>
              <Switch
                checked={showMissMode}
                onCheckedChange={setShowMissMode}
              />
            </div>
          </GlassCard>

          {showMissMode && (
            <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
              {missedNotices.map((notice, index) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  ghosted
                  consequence={
                    notice.category === 'exam'
                      ? `You may miss: ${notice.title}`
                      : `Opportunity lost: ${notice.title}`
                  }
                  onClick={() => setSelectedNotice(notice)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Subscribed Notices */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Your Subscribed Notices
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankedNotices
              .filter((n) => n.department?.some((d) => preferences.departments.includes(d)))
              .slice(0, 6)
              .map((notice, index) => (
                <div
                  key={notice.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NoticeCard
                    notice={notice}
                    size="sm"
                    reminderActive={!!getReminder(notice.id)}
                    onClick={() => setSelectedNotice(notice)}
                  />
                </div>
              ))}
          </div>
        </section>

        {/* Upcoming Events */}
        {!eventsLoading && upcomingEvents.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Upcoming Events & Tests
            </h2>
            
            <div className="grid gap-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Notice DNA View Modal */}
      {selectedNotice && (
        <NoticeDNAView
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </PageLayout>
  );
};

export default DashboardPage;
