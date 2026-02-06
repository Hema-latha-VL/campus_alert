import { useMemo, useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { NoticeDNAView } from '@/components/NoticeDNAView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Notice, NoticeCategory, getCategoryColor, getTimeRemaining } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, Download, Bell, Clock } from 'lucide-react';
import { useAppState, type ReminderPreset } from '@/state/AppState';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { NoticeCard } from '@/components/NoticeCard';
import { eventApi, type EventData } from '@/lib/apiClient';

const categories: { id: NoticeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'exam', label: 'Exams' },
  { id: 'placement', label: 'Placements' },
  { id: 'event', label: 'Events' },
  { id: 'club', label: 'Clubs' },
];

const timelineSegments = [
  { id: 'now', label: 'Now', days: 0 },
  { id: 'week', label: 'This Week', days: 7 },
  { id: 'month', label: 'This Month', days: 30 },
];

type ExportScope = 'upcoming' | '7d' | 'urgent';

const pad2 = (n: number) => String(n).padStart(2, '0');

const toIcsDate = (d: Date) => {
  return (
    String(d.getUTCFullYear()) +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    'T' +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    'Z'
  );
};

const escapeIcs = (value: string) => {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
};

const TimelinePage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    mode,
    allNotices,
    remindersEnabledCount,
    nextReminderAt,
    setReminder,
    clearReminder,
    getReminder,
    highlightedNoticeIds,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState<NoticeCategory | 'all'>('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [hoveredNotice, setHoveredNotice] = useState<string | null>(null);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportScope, setExportScope] = useState<ExportScope>('upcoming');

  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderNoticeId, setReminderNoticeId] = useState<string | null>(null);
  const [reminderPreset, setReminderPreset] = useState<ReminderPreset>('1h');
  const [customTriggerAt, setCustomTriggerAt] = useState<string>('');
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventApi.getAll();
        setEvents(res.events || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  useMemo(() => {
    const modal = searchParams.get('modal');
    if (!modal) return;

    if (modal === 'export') {
      setExportOpen(true);
      setReminderOpen(false);
    }

    if (modal === 'reminder') {
      const first = allNotices[0]?.id ?? null;
      setReminderNoticeId(first);
      setReminderOpen(true);
      setExportOpen(false);
    }
  }, [allNotices, searchParams]);

  // Convert events to notices
  const eventToNotice = (event: EventData): Notice => ({
    id: event._id || `event-${event.name}-${Date.now()}`,
    title: event.name,
    summary: `${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}: ${event.description.substring(0, 50)}...`,
    description: event.description,
    category: event.eventType === 'placement' ? 'placement' : event.eventType === 'test' ? 'exam' : 'event',
    priority: 'high',
    department: [event.department || 'All'],
    deadline: new Date(event.date),
    postedAt: new Date(),
    upvotes: 0,
    views: 0,
    isVerified: true,
    imageUrl: event.imageUrl || undefined,
    relevanceReason: `${event.eventType} event${event.department ? ` for ${event.department}` : ' (Campus-wide)'}`,
  });

  // Merge events with notices
  const noticesWithEvents = useMemo(() => {
    const convertedEvents = events.map(eventToNotice);
    return [...convertedEvents, ...allNotices];
  }, [events, allNotices]);

  const filteredNotices = useMemo(() => {
    return noticesWithEvents.filter((notice) => {
      if (activeCategory === 'all') return true;
      return notice.category === activeCategory;
    });
  }, [noticesWithEvents, activeCategory]);

  const upcomingNotices = useMemo(() => {
    const now = Date.now();
    return filteredNotices
      .map((n) => ({ notice: n, at: (n.deadline ?? n.postedAt).getTime() }))
      .filter((x) => x.at >= now)
      .sort((a, b) => a.at - b.at)
      .map((x) => x.notice);
  }, [filteredNotices]);

  const exportedNotices = useMemo(() => {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    return upcomingNotices.filter((n) => {
      const at = (n.deadline ?? n.postedAt).getTime();
      if (exportScope === 'urgent') return n.priority === 'urgent';
      if (exportScope === '7d') return at <= now + weekMs;
      return true;
    });
  }, [upcomingNotices, exportScope]);

  const resolveReminderTriggerAt = (notice: Notice, preset: ReminderPreset, customValue: string): Date | null => {
    const base = notice.deadline ?? notice.postedAt;
    if (preset === '1h') return new Date(base.getTime() - 60 * 60 * 1000);
    if (preset === '1d') return new Date(base.getTime() - 24 * 60 * 60 * 1000);
    if (!customValue) return null;
    const parsed = new Date(customValue);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const exportIcs = (notices: Notice[], label: string) => {
    const now = new Date();
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AlertHub//Journey Timeline//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    notices.forEach((n) => {
      const start = n.deadline ?? n.postedAt;
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${escapeIcs(`alerthub-${n.id}@local`)}`);
      lines.push(`DTSTAMP:${toIcsDate(now)}`);
      lines.push(`DTSTART:${toIcsDate(start)}`);
      lines.push(`DTEND:${toIcsDate(end)}`);
      lines.push(`SUMMARY:${escapeIcs(n.title)}`);
      lines.push(`DESCRIPTION:${escapeIcs(`${n.summary}\n\n${n.description}`)}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    const ics = lines.join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerthub-${label}-${new Date().toISOString().slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Group notices by time segment - only include items with deadlines AND verified (admin/advisor posts)
  const groupedNotices = {
    now: filteredNotices.filter((n) => {
      if (!n.deadline || !n.isVerified) return false;
      const hours = (n.deadline.getTime() - Date.now()) / (1000 * 60 * 60);
      return hours >= 0 && hours <= 24;
    }),
    week: filteredNotices.filter((n) => {
      if (!n.deadline || !n.isVerified) return false;
      const days = (n.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days > 1 && days <= 7;
    }),
    month: filteredNotices.filter((n) => {
      if (!n.deadline || !n.isVerified) return false;
      const days = (n.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days > 7;
    }),
  };

  return (
    <PageLayout mode={mode} className="pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-display-md font-bold mb-2">Journey Timeline</h1>
            <p className="text-muted-foreground">
              Your visual path through upcoming campus events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setExportOpen(true);
              }}
            >
              <Download className="h-4 w-4" />
              Export to Calendar
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const first = upcomingNotices[0]?.id ?? null;
                setReminderNoticeId(first);
                setReminderOpen(true);
              }}
            >
              <Bell className="h-4 w-4" />
              Set Reminders
            </Button>
          </div>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold">Reminders enabled</h3>
              <p className="text-sm text-muted-foreground">
                {remindersEnabledCount === 0
                  ? 'No active reminders yet.'
                  : `${remindersEnabledCount} active • Next: ${nextReminderAt ? nextReminderAt.toLocaleString() : '—'}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const first = upcomingNotices[0]?.id ?? null;
                  setReminderNoticeId(first);
                  setReminderOpen(true);
                }}
              >
                Manage
              </Button>
              {remindersEnabledCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    Object.keys(upcomingNotices.reduce<Record<string, true>>((acc, n) => {
                      const r = getReminder(n.id);
                      if (r?.status === 'scheduled') acc[n.id] = true;
                      return acc;
                    }, {})).forEach((id) => clearReminder(id));
                    toast({ title: 'Reminders cleared', description: 'All active reminders have been removed.' });
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline bar */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-primary to-accent rounded-full" />

          {/* Timeline segments */}
          <div className="grid grid-cols-3 gap-6 pt-16">
            {timelineSegments.map((segment) => {
              const notices = groupedNotices[segment.id as keyof typeof groupedNotices];
              
              return (
                <div key={segment.id} className="space-y-4">
                  {/* Segment marker */}
                  <div className="relative -mt-12">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full border-4 border-background mx-auto',
                        segment.id === 'now' && 'bg-destructive',
                        segment.id === 'week' && 'bg-primary',
                        segment.id === 'month' && 'bg-accent'
                      )}
                    />
                    <p className="text-center font-semibold mt-2">{segment.label}</p>
                  </div>

                  {/* Notice nodes */}
                  <div className="space-y-4">
                    {notices.length > 0 ? (
                      notices.slice(0, 5).map((notice, index) => (
                      <div
                        key={notice.id}
                        onMouseEnter={() => setHoveredNotice(notice.id)}
                        onMouseLeave={() => setHoveredNotice(null)}
                        className={cn(
                          'timeline-node cursor-pointer transition-all duration-300 h-auto',
                          'animate-fade-in'
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="h-full">
                          <NoticeCard
                            notice={notice}
                            size="sm"
                            reminderActive={!!getReminder(notice.id)}
                            onClick={() => setSelectedNotice(notice)}
                          />
                        </div>

                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReminderNoticeId(notice.id);
                              setReminderPreset('1h');
                              setCustomTriggerAt('');
                              setReminderOpen(true);
                            }}
                            className="gap-2"
                          >
                            <Bell className="h-4 w-4" />
                            Remind me
                          </Button>
                        </div>
                      </div>
                    ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notices scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notice DNA View Modal */}
      {selectedNotice && (
        <NoticeDNAView
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="glass-card border border-white/20 bg-white/80 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Export to Calendar</DialogTitle>
            <DialogDescription>
              Choose what you want to export. Your download will be a real <span className="font-medium">.ics</span> calendar file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as ExportScope)} className="space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                <RadioGroupItem value="upcoming" />
                <div className="flex-1">
                  <div className="font-medium">All upcoming notices</div>
                  <div className="text-sm text-muted-foreground">Everything with a future date</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                <RadioGroupItem value="7d" />
                <div className="flex-1">
                  <div className="font-medium">Next 7 days</div>
                  <div className="text-sm text-muted-foreground">Short-term plan export</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                <RadioGroupItem value="urgent" />
                <div className="flex-1">
                  <div className="font-medium">Only urgent</div>
                  <div className="text-sm text-muted-foreground">High-priority deadlines only</div>
                </div>
              </label>
            </RadioGroup>

            <div className="rounded-xl bg-secondary/20 p-4">
              <div className="text-sm font-medium">Ready to export</div>
              <div className="text-sm text-muted-foreground">{exportedNotices.length} events</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (exportedNotices.length === 0) {
                  toast({ title: 'Nothing to export', description: 'No matching upcoming notices were found.' });
                  return;
                }
                const label = exportScope === 'upcoming' ? 'upcoming' : exportScope === '7d' ? 'next-7-days' : 'urgent';
                exportIcs(exportedNotices, label);
                setExportOpen(false);
                toast({ title: 'Schedule exported successfully', description: 'Your calendar file has been downloaded.' });
              }}
            >
              Download .ics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="glass-card border border-white/20 bg-white/80 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Set Reminder</DialogTitle>
            <DialogDescription>
              Choose a notice and when you want to be reminded. Reminders are saved locally for demo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Select notice</div>
              <div className="max-h-48 overflow-auto rounded-xl border border-border/50">
                {upcomingNotices.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">No upcoming notices available.</div>
                )}
                {upcomingNotices.map((n) => {
                  const active = reminderNoticeId === n.id;
                  const r = getReminder(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setReminderNoticeId(n.id)}
                      className={cn(
                        'w-full text-left p-3 border-b border-border/50 last:border-b-0 transition-colors',
                        active ? 'bg-primary/10' : 'hover:bg-secondary/30'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{n.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {(n.deadline ?? n.postedAt).toLocaleString()}
                          </div>
                        </div>
                        {r?.status === 'scheduled' && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Bell className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Reminder time</div>
              <RadioGroup value={reminderPreset} onValueChange={(v) => setReminderPreset(v as ReminderPreset)} className="space-y-3">
                <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                  <RadioGroupItem value="1h" />
                  <div className="flex-1">
                    <div className="font-medium">1 hour before</div>
                    <div className="text-sm text-muted-foreground">Best for last-mile tasks</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                  <RadioGroupItem value="1d" />
                  <div className="flex-1">
                    <div className="font-medium">1 day before</div>
                    <div className="text-sm text-muted-foreground">Best for planning</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                  <RadioGroupItem value="custom" />
                  <div className="flex-1">
                    <div className="font-medium">Custom time</div>
                    <div className="text-sm text-muted-foreground">Pick an exact trigger time</div>
                  </div>
                </label>
              </RadioGroup>

              {reminderPreset === 'custom' && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Trigger at</div>
                  <Input value={customTriggerAt} onChange={(e) => setCustomTriggerAt(e.target.value)} type="datetime-local" />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (!reminderNoticeId) {
                  toast({ title: 'Pick a notice', description: 'Select a notice to attach the reminder to.' });
                  return;
                }
                clearReminder(reminderNoticeId);
                toast({ title: 'Reminder removed', description: 'Reminder cancelled for this notice.' });
              }}
              disabled={!reminderNoticeId || !getReminder(reminderNoticeId)}
            >
              Cancel reminder
            </Button>
            <Button
              onClick={() => {
                if (!reminderNoticeId) {
                  toast({ title: 'Pick a notice', description: 'Select a notice to attach the reminder to.' });
                  return;
                }
                const notice = noticesWithEvents.find((n) => n.id === reminderNoticeId);
                if (!notice) {
                  toast({ title: 'Notice missing', description: 'Could not locate the selected notice.' });
                  return;
                }
                const triggerAt = resolveReminderTriggerAt(notice, reminderPreset, customTriggerAt);
                if (!triggerAt) {
                  toast({ title: 'Invalid time', description: 'Please choose a valid reminder time.' });
                  return;
                }
                setReminder(notice.id, triggerAt, reminderPreset);
                setReminderOpen(false);
                toast({ title: 'Reminder Active', description: `Reminder set for ${triggerAt.toLocaleString()}.` });
              }}
            >
              Save reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TimelinePage;
