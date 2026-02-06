import { useEffect, useMemo, useRef, useState } from 'react';
 import { PageLayout, FloatingOrb } from '@/components/PageLayout';
 import { GlassCard } from '@/components/GlassCard';
 import { Button } from '@/components/ui/button';
 import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
 import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
 import { Switch } from '@/components/ui/switch';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
 import { 
   Bell, 
   Calendar, 
   Briefcase, 
   Users, 
   Sparkles,
   Brain,
   Filter,
   ArrowRight,
   CheckCircle,
   AlertTriangle,
   Search,
   X,
   BookOpen,
   PartyPopper,
   Volume2
 } from 'lucide-react';
 import { categories as allCategories, departments, getCategoryColor, getGreeting, type Notice, type NoticeCategory } from '@/data/mockData';
 import { NoticeCard } from '@/components/NoticeCard';
 import { NoticeDNAView } from '@/components/NoticeDNAView';
 import { FeedbackDialog } from '@/components/FeedbackDialog';
 import Footer from '@/components/Footer';
 import { useAppState } from '@/state/AppState';
 import { cn } from '@/lib/utils';
 import { useToast } from '@/hooks/use-toast';
 import { useNavigate } from 'react-router-dom';
 import { eventApi, type EventData } from '@/lib/apiClient';
 
 const floatingIcons = [
   { icon: Bell, label: 'Events', category: 'event' as const, delay: '0.5s', position: 'top-40 right-[35%]' },
 ];
 
 const features = [
   {
     icon: Brain,
     title: 'Campus Intelligence',
     description: 'AI-powered notice relevance engine that understands your academic context.',
   },
   {
     icon: Sparkles,
     title: 'Personal Attention Engine',
     description: 'Every notice tells you why it matters to YOU specifically.',
   },
   {
     icon: Filter,
     title: 'Smart Filtering',
     description: 'Switch between Quiet, Exam, and Event modes instantly.',
   },
 ];
 
 const stats = [
   { value: '10,000+', label: 'Notices Delivered' },
   { value: '98%', label: 'On-time Awareness' },
   { value: '5,000+', label: 'Active Students' },
   { value: '50+', label: 'Departments' },
 ];
 
 const LandingPage = () => {
   const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
   const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
   const [heroDismissed, setHeroDismissed] = useState(false);
  const [archiveQuery, setArchiveQuery] = useState('');
  const [events, setEvents] = useState<EventData[]>([]);
  const [acknowledgedEvents, setAcknowledgedEvents] = useState<Set<string>>(new Set());
 
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const {
    authReady,
    role,
    userId,
    advisorLoginName,
    advisorName,
    mode,
     setMode,
     view,
     setView,
     preferences,
     updatePreferences,
     activeCategory,
     setActiveCategory,
     showRelevance,
     setShowRelevance,
     panels,
     openPreferences,
     closeAllPanels,
     filteredNotices,
     rankedNotices,
     urgentTodayCount,
   } = useAppState();
 
   const heroRef = useRef<HTMLDivElement | null>(null);
   const pulseRef = useRef<HTMLDivElement | null>(null);
   const dashboardRef = useRef<HTMLDivElement | null>(null);
   const timelineRef = useRef<HTMLDivElement | null>(null);
  const archiveRef = useRef<HTMLDivElement | null>(null);
   const settingsRef = useRef<HTMLDivElement | null>(null);
 
   const lastViewRef = useRef(view);
 
   useEffect(() => {
     const prev = lastViewRef.current;
     lastViewRef.current = view;
 
     if (view === 'settings' && prev !== 'settings') {
       openPreferences();
     }
   }, [openPreferences, view]);
 
   useEffect(() => {
     // Reset scroll to top when page loads or view changes to home
     if (view === 'home') {
       // Use setTimeout to ensure DOM is ready
       setTimeout(() => {
         window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
         heroRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
       }, 0);
     }
   }, [view]);

   useEffect(() => {
     setHeroDismissed(view !== 'home');
   }, [view]);
 
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
 
   const heroTone = urgentTodayCount > 0 ? 'warning' : 'calm';

   // Check if event is expired
   const isEventExpired = (eventDate: string): boolean => {
     const eventTime = new Date(eventDate);
     const now = new Date();
     // Set both to midnight for day-level comparison
     eventTime.setHours(0, 0, 0, 0);
     now.setHours(0, 0, 0, 0);
     return eventTime < now;
   };

   // Check if event deadline is today
   const isEventToday = (eventDate: string): boolean => {
     const eventTime = new Date(eventDate);
     const now = new Date();
     eventTime.setHours(0, 0, 0, 0);
     now.setHours(0, 0, 0, 0);
     return eventTime.getTime() === now.getTime();
   };

   // Convert events to notices
   const eventToNotice = (event: EventData): Notice => {
     const isToday = isEventToday(event.date);
     return {
       id: event._id || `event-${event.name}-${Date.now()}`,
       eventId: event._id,
       title: event.name,
       summary: `${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}: ${event.description.substring(0, 50)}...`,
       description: event.description,
       category: event.eventType === 'placement' ? 'placement' : event.eventType === 'test' ? 'exam' : 'event',
       priority: isToday ? 'urgent' : 'high', // Mark as urgent if deadline is today
       department: [event.department || 'All'],
       deadline: new Date(event.date),
       postedAt: new Date(),
       upvotes: 0,
       views: event.views || 0,
       isVerified: true,
       relevanceReason: isToday ? `${event.eventType} deadline TODAY!` : `${event.eventType} event${event.department ? ` for ${event.department}` : ' (Campus-wide)'}`,
       imageUrl: event.imageUrl,
     };
   };

   const handleAcknowledge = async (eventId: string) => {
     if (acknowledgedEvents.has(eventId)) return;
     try {
       await eventApi.acknowledge(eventId);
       setAcknowledgedEvents((prev) => new Set(prev).add(eventId));
       const res = await eventApi.getAll();
       setEvents(res.events || []);
       toast({ title: 'Acknowledged', description: 'Thanks for confirming. Count updated.' });
     } catch (error) {
       console.error('Acknowledge error:', error);
       toast({ title: 'Failed to acknowledge', description: 'Please try again later.', variant: 'destructive' });
     }
   };
 
   // Merge events with notices (filter out expired events)
   const allNoticesWithEvents = useMemo(() => {
     const activeEvents = events.filter((event) => !isEventExpired(event.date));
     const convertedEvents = activeEvents.map(eventToNotice);
     return [...convertedEvents, ...rankedNotices];
   }, [events, rankedNotices]);
 
   const heroSummary = useMemo(() => {
     const dept = preferences.departments.length > 0 ? preferences.departments.join(', ') : 'All departments';
     const urgentText =
       urgentTodayCount > 0
         ? `You have ${urgentTodayCount} urgent update${urgentTodayCount === 1 ? '' : 's'} today`
         : 'No critical alerts right now 🎉';
 
     const modeHint =
       mode === 'exam'
         ? 'Exam Mode prioritizing academic deadlines'
         : mode === 'event'
           ? 'Event Mode surfacing clubs & activities'
           : 'Quiet Mode filtering noise';
 
     return `${urgentText} • ${dept} • ${modeHint}`;
   }, [preferences.departments, urgentTodayCount, mode]);
 
   const exploreNotices = () => {
     setHeroDismissed(true);
     setView('pulse');
     toast({
       title: 'Campus Pulse',
       description: activeCategory === 'all' ? 'Showing your prioritized notices.' : `Filtered to ${activeCategory}.`,
     });
   };
 
   const openCustomizer = () => {
     openPreferences();
     toast({
       title: 'Customize Alerts',
       description: 'Update your department, categories, and urgency preferences.',
     });
   };
 
   const cycleMode = () => {
     const next = mode === 'quiet' ? 'exam' : mode === 'exam' ? 'event' : 'quiet';
     setMode(next);
   };
 
   const modeMeta = {
     quiet: { label: 'Quiet Mode', icon: Volume2 },
     exam: { label: 'Exam Mode', icon: BookOpen },
     event: { label: 'Event Mode', icon: PartyPopper },
   } as const;
 
   const ModeIcon = modeMeta[mode].icon;
 
  const filteredArchive = useMemo(() => {
    const source = allNoticesWithEvents.filter((n) => activeCategory === 'all' || n.category === activeCategory);
    if (!archiveQuery) return source;
    const q = archiveQuery.toLowerCase();
    return source.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
  }, [archiveQuery, allNoticesWithEvents, activeCategory]);
 
   const timelineBuckets = useMemo(() => {
     const now = Date.now();
     const inHours = (h: number) => now + h * 60 * 60 * 1000;
     const inDays = (d: number) => now + d * 24 * 60 * 60 * 1000;
 
     const next24h = allNoticesWithEvents.filter((n) => (n.deadline ? n.deadline.getTime() <= inHours(24) : n.priority === 'urgent'));
     const next7d = allNoticesWithEvents.filter((n) => (n.deadline ? n.deadline.getTime() > inHours(24) && n.deadline.getTime() <= inDays(7) : n.priority === 'high'));
     const later = allNoticesWithEvents.filter((n) => (n.deadline ? n.deadline.getTime() > inDays(7) : n.priority === 'medium' || n.priority === 'low'));
 
     return { next24h, next7d, later };
   }, [allNoticesWithEvents]);
 
 
   return (
     <PageLayout showOrbs mode={mode} className="pt-28">
       {/* Hero Section */}
       <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 z-10">
         {/* Floating Icons */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {floatingIcons.map((item, index) => {
             const Icon = item.icon;
             return (
               <div
                 key={index}
                 className={`absolute ${item.position} animate-float opacity-20`}
                 style={{ animationDelay: item.delay }}
               >
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <button
                       type="button"
                       onClick={() => {
                         setActiveCategory(item.category);
                         setView('pulse');
                         toast({ title: 'Filtered', description: `Showing ${item.label} notices.` });
                       }}
                       className={cn(
                         'glass-card p-4 rounded-2xl pointer-events-auto transition-all duration-300',
                         activeCategory === item.category && 'opacity-100 shadow-glow scale-[1.03]'
                       )}
                       aria-label={`Filter to ${item.label}`}
                     >
                       <Icon className="h-8 w-8 text-primary" />
                     </button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p className="font-medium">{item.label}</p>
                   </TooltipContent>
                 </Tooltip>
               </div>
             );
           })}
         </div>
 
         {/* Hero Content */}
         <div
           className={cn(
             'text-center max-w-4xl mx-auto space-y-8 transition-all duration-500',
             'opacity-100 translate-y-0'
           )}
         >
           <button
             type="button"
             onClick={() => {
               cycleMode();
               toast({ title: modeMeta[mode].label, description: 'Mode switched. Priority logic updated.' });
             }}
             className={cn(
               'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
               heroTone === 'warning' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
             )}
             aria-label="Cycle mode"
           >
             {heroTone === 'warning' ? <AlertTriangle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
             <span>Intelligent Campus Communication</span>
             <span className="flex items-center gap-2 pl-2 border-l border-border/50">
               <ModeIcon className="h-4 w-4" />
               <span className="hidden sm:inline">{modeMeta[mode].label}</span>
             </span>
           </button>
 
           <h1 className="text-display-xl font-bold text-foreground text-balance">
             Never Miss a{' '}
             <span className="gradient-text">Campus Update</span>
             {' '}Again.
           </h1>
 
           <div className="space-y-2">
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
               AlertHub intelligently curates and delivers campus notices based on your profile,
               preferences, and deadlines. No more information overload.
             </p>
             <p
               className={cn(
                 'text-sm font-medium max-w-2xl mx-auto transition-colors duration-300',
                 heroTone === 'warning' ? 'text-destructive' : 'text-primary'
               )}
             >
               {heroSummary}
             </p>
           </div>
 
           <div className="flex flex-wrap items-center justify-center gap-4">
             <Button
               size="lg"
               className="bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg transition-all duration-300 text-lg px-8 py-6"
               onClick={exploreNotices}
             >
               Explore Notices
               <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
             <Button
               variant="outline"
               size="lg"
               className="text-lg px-8 py-6 border-2 hover:border-primary/50 hover:bg-primary/5"
               onClick={openCustomizer}
             >
               Customize Alerts
             </Button>
           </div>
         </div>
 
         {/* Scroll indicator */}
         <button
           type="button"
           onClick={() => {
             setView('pulse');
             toast({ title: 'Jumped to Campus Pulse', description: 'Scrolling to your live visualization.' });
           }}
           className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
           aria-label="Jump to Campus Pulse"
         >
           <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2 hover:border-primary/40 transition-colors">
             <div className="w-1 h-3 rounded-full bg-muted-foreground/50" />
           </div>
         </button>
       </section>
 
       {/* Campus Pulse View */}
       <section ref={pulseRef} className="py-16 px-6">
         <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-display-md font-bold mb-2">Campus Pulse</h2>
              <p className="text-muted-foreground">
                Live notice visualization shaped by your preferences
              </p>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or summary…"
                    value={archiveQuery}
                    onChange={(e) => setArchiveQuery(e.target.value)}
                    className="pl-12 h-12 bg-transparent border-2 focus:border-primary rounded-xl transition-all duration-300 focus:shadow-glow"
                  />
                  {archiveQuery && (
                    <button
                      type="button"
                      onClick={() => setArchiveQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Relevance</span>
                <Switch checked={showRelevance} onCheckedChange={setShowRelevance} />
              </div>
              <Button variant="outline" onClick={() => setActiveCategory('all')}>
                Clear Filter
              </Button>
            </div>
          </div>
 
           <div className="flex flex-wrap items-center gap-2 mb-8">
             <button
               type="button"
               onClick={() => setActiveCategory('all')}
               className={cn(
                 'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                 activeCategory === 'all'
                   ? 'bg-primary text-primary-foreground shadow-glow'
                   : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
               )}
             >
               All
             </button>
             {allCategories.map((c) => (
               <button
                 key={c.id}
                 type="button"
                 onClick={() => setActiveCategory(c.id)}
                 className={cn(
                   'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                   activeCategory === c.id
                     ? 'bg-primary text-primary-foreground shadow-glow'
                     : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                 )}
               >
                 {c.label}
               </button>
             ))}
           </div>
 
          <div
            className={cn(
              'grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500',
              view === 'pulse' ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
            )}
          >
            {filteredArchive.map((notice, index) => (
              <div key={notice.id} className="animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                <NoticeCard
                  notice={notice}
                  showRelevance={showRelevance}
                  onClick={() => setSelectedNotice(notice)}
                  onAcknowledge={handleAcknowledge}
                  showAcknowledge={role === 'student' && !!notice.eventId}
                  isAcknowledged={notice.eventId ? acknowledgedEvents.has(notice.eventId) : false}
                />
              </div>
            ))}
          </div>
         </div>
       </section>
 

 
       {/* Features Section */}
       <section className="py-20 px-6 relative">
         <FloatingOrb size="lg" color="purple" className="top-0 left-1/4" />
         
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-display-md font-bold mb-4">
               Built for <span className="gradient-text">Smart Students</span>
             </h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
               AlertHub isn't just a notice board. It's your personal campus intelligence system.
             </p>
           </div>
 
           <div className="grid md:grid-cols-3 gap-8">
             {features.map((feature, index) => {
               const Icon = feature.icon;
               return (
                 <GlassCard
                   key={index}
                   glow={hoveredFeature === index ? 'teal' : 'none'}
                   className="text-center p-8"
                   onClick={() => {
                     if (index === 0) {
                       setView('dashboard');
                       toast({ title: 'Campus Intelligence', description: 'Jumped to your personalized dashboard.' });
                       return;
                     }
                     if (index === 1) {
                       setShowRelevance(!showRelevance);
                       toast({
                         title: 'Personal Attention Engine',
                         description: showRelevance ? 'Relevance hints hidden.' : 'Relevance hints enabled.',
                       });
                       return;
                     }
                     openCustomizer();
                   }}
                 >
                   <div
                     onMouseEnter={() => setHoveredFeature(index)}
                     onMouseLeave={() => setHoveredFeature(null)}
                     className="space-y-4"
                   >
                     <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                       <Icon className="h-8 w-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-semibold">{feature.title}</h3>
                     <p className="text-muted-foreground">{feature.description}</p>
                   </div>
                 </GlassCard>
               );
             })}
           </div>
         </div>
       </section>
 
 
       {/* Timeline View */}
       <section ref={timelineRef} className="py-16 px-6">
         <div className="max-w-7xl mx-auto space-y-8">
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
             <div>
               <h2 className="text-display-md font-bold mb-2">Journey Timeline</h2>
               <p className="text-muted-foreground">A visual path through deadlines and opportunities</p>
             </div>
             <div className="flex items-center gap-3">
               <Button
                 variant="outline"
                 onClick={() => {
                   setView('timeline');
                   navigate('/timeline?modal=export');
                 }}
               >
                 Export
               </Button>
               <Button
                 variant="outline"
                 onClick={() => {
                   setView('timeline');
                   navigate('/timeline?modal=reminder');
                 }}
               >
                 Remind Me
               </Button>
             </div>
           </div>
 
           <div className="grid md:grid-cols-3 gap-6">
             {[{ id: 'next24h', label: 'Next 24h', color: 'destructive' }, { id: 'next7d', label: 'Next 7 days', color: 'primary' }, { id: 'later', label: 'Later', color: 'accent' }].map((seg) => {
               const items = timelineBuckets[seg.id as keyof typeof timelineBuckets].slice(0, 6);
               return (
                 <div key={seg.id} className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="font-semibold text-lg">{seg.label}</h3>
                     <Badge variant="secondary">{items.length}</Badge>
                   </div>
 
                   <div className="space-y-4">
                     {items.length > 0 ? (
                       items.map((notice, index) => (
                         <div key={notice.id} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
                           <NoticeCard
                             notice={notice}
                             showRelevance={showRelevance}
                             onClick={() => setSelectedNotice(notice)}
                             onAcknowledge={handleAcknowledge}
                             showAcknowledge={role === 'student' && !!notice.eventId}
                             isAcknowledged={notice.eventId ? acknowledgedEvents.has(notice.eventId) : false}
                           />
                         </div>
                       ))
                     ) : (
                       <div className="glass-card p-8 text-center text-muted-foreground">
                         <p>Nothing queued</p>
                       </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
       </section>
 
 
       {/* CTA Section */}
       <section className="py-20 px-6">
         <div className="max-w-4xl mx-auto text-center">
           <GlassCard
             glow="teal"
             className="p-12"
             onClick={() => {
               setView('dashboard');
               toast({ title: 'Gateway', description: 'Opening your personalized dashboard.' });
             }}
           >
             <h2 className="text-display-md font-bold mb-4">
               Ready to Stay Informed?
             </h2>
             <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
               Join thousands of students who never miss important updates.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4">
               <Button
                 size="lg"
                 className="bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg"
                 onClick={() => {
                   setView('dashboard');
                   toast({ title: 'Welcome', description: 'Opening your personalized dashboard.' });
                 }}
               >
                 Get Started
                 <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
             </div>
             
             <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
               <button
                 type="button"
                 onClick={() => {
                   openCustomizer();
                 }}
                 className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-secondary/40 transition-colors"
                 aria-label="Open preferences"
               >
                 <CheckCircle className="h-4 w-4 text-primary" />
                 <span>Free for all students</span>
               </button>
               <button
                 type="button"
                 onClick={() => {
                   cycleMode();
                   toast({ title: 'Noise control', description: `Now in ${modeMeta[mode].label}.` });
                 }}
                 className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-secondary/40 transition-colors"
                 aria-label="Cycle mode"
               >
                 <CheckCircle className="h-4 w-4 text-primary" />
                 <span>No spam, ever</span>
               </button>
             </div>
           </GlassCard>
         </div>
       </section>
 
       {/* Footer */}
       <Footer
         onBackToTop={() => {
           setView('home');
           toast({ title: 'Back to top', description: 'Returned to the hero section.' });
         }}
         onModeChange={() => {
           cycleMode();
           toast({ title: 'Accent updated', description: 'Mode changed from the footer.' });
         }}
         showNewsletter={true}
         showSocialLinks={true}
         feedbackComponent={
           <FeedbackDialog
             studentId={userId}
             disabled={role !== 'student'}
             hasAdvisor={!!advisorLoginName}
             advisorName={advisorName}
             isAuthReady={authReady}
           />
         }
       />
 
       <div ref={settingsRef} />
 
       <Dialog open={panels.preferencesOpen} onOpenChange={(open) => (open ? openPreferences() : closeAllPanels())}>
         <DialogContent className="glass-card border border-white/20 bg-white/80 backdrop-blur-xl max-w-md">
           <DialogHeader>
             <DialogTitle>Customize Alerts</DialogTitle>
             <DialogDescription>Filter and personalize which notices you want to see.</DialogDescription>
           </DialogHeader>

           <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto">
             <div className="space-y-3">
               <h3 className="font-semibold">Departments</h3>
               <div className="flex flex-wrap gap-2">
                 {departments.map((dept) => {
                   const active = preferences.departments.includes(dept);
                   return (
                     <button
                       key={dept}
                       type="button"
                       onClick={() => {
                         updatePreferences({
                           departments: active ? preferences.departments.filter((d) => d !== dept) : [...preferences.departments, dept],
                         });
                       }}
                       className={cn(
                         'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                         active ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                       )}
                     >
                       {dept}
                     </button>
                   );
                 })}
               </div>
             </div>

             <div className="space-y-3">
               <h3 className="font-semibold">Categories</h3>
               <div className="flex flex-wrap gap-2">
                 {allCategories.map((cat) => {
                   const active = preferences.categories.includes(cat.id);
                   return (
                     <button
                       key={cat.id}
                       type="button"
                       onClick={() => {
                         updatePreferences({
                           categories: active
                             ? preferences.categories.filter((c) => c !== cat.id)
                             : [...preferences.categories, cat.id],
                         });
                       }}
                       className={cn(
                         'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                         active ? getCategoryColor(cat.id) : 'bg-muted text-muted-foreground hover:bg-muted/80'
                       )}
                     >
                       {cat.label}
                     </button>
                   );
                 })}
               </div>
             </div>

             <div className="space-y-3">
               <h3 className="font-semibold">Urgency Threshold</h3>
               <div className="flex flex-wrap gap-2">
                 {(['urgent', 'high', 'medium', 'low'] as const).map((lvl) => (
                   <button
                     key={lvl}
                     type="button"
                     onClick={() => updatePreferences({ urgency: lvl })}
                     className={cn(
                       'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                       preferences.urgency === lvl ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                     )}
                   >
                     {lvl}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-3">
               <h3 className="font-semibold">Mode</h3>
               <div className="flex flex-wrap gap-2">
                 {(['quiet', 'exam', 'event'] as const).map((m) => (
                   <button
                     key={m}
                     type="button"
                     onClick={() => setMode(m)}
                     className={cn(
                       'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                       mode === m ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                     )}
                   >
                     {m}
                   </button>
                 ))}
               </div>
             </div>

             <Button
               className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg"
               onClick={() => {
                 closeAllPanels();
                 toast({ title: 'Saved locally', description: 'Preferences stored in browser state.' });
               }}
             >
               Done
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     </PageLayout>
   );
 };
 
 export default LandingPage;
 




